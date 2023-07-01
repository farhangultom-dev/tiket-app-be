const mysql = require("../config/connection");
const bcrypt = require('bcryptjs')
require('dotenv').config();

async function getUserByUsername(database, email) {
    const connection = await mysql.connection();
    await connection.changeUser(database);

    try {
        let items = await connection.query({
            sql: "SELECT * FROM users where email = ? and is_active = 1 ",
            values: [email]
        });
        return items.length > 0 ? items[0] : null;
    } catch (err) {
        throw err;
    } finally {
        await connection.release();
    }
}

async function authentication(password, bcryptPassword) {
    let isValid = false
    try {
        await bcrypt.compare(password,bcryptPassword).then((result) => {
            if (result){
                isValid = true
            }
        }).catch((err) => {
            console.log("something went wrong "+err)
        });
        return isValid
    } catch (err) {
        throw err;
        return isValid
    } finally {
        return isValid
    }
}

async function insertUser(database, email,firstName,lastName,password) {
    const connection = await mysql.connection();
    await connection.changeUser(database);

    try {
        let items = await connection.query({
            sql: "INSERT INTO users (email, first_name, last_name, password) VALUES (?, ?, ?, ?) ",
            values: [email, firstName, lastName, password]
        });
        return items.affectedRows > 0;
    } catch (err) {
        throw err;
    } finally {
        await connection.release();
    }
}

async function checkUserExist(database, email) {
    const connection = await mysql.connection();
    await connection.changeUser(database);

    try {
        let items = await connection.query({
            sql: "SELECT email FROM users WHERE email = ? ",
            values: [email]
        });
        return items.length > 0 ? items[0] : null;
    } catch (err) {
        throw err;
    } finally {
        await connection.release();
    }
}

async function updatePhotoProfile(database, email, photoUrl) {
    const connection = await mysql.connection();
    await connection.changeUser(database);

    try {
        let items = await connection.query({
            sql: "UPDATE users SET photo_profile_path = ? WHERE email = ? ",
            values: [photoUrl, email]
        });
        return items.affectedRows > 0;
    } catch (err) {
        throw err;
    } finally {
        await connection.release();
    }
}

async function updateUsers(database, firstName, lastName,email) {
    const connection = await mysql.connection();
    await connection.changeUser(database);

    try {
        let items = await connection.query({
            sql: "UPDATE users SET first_name = ?, last_name = ? WHERE email = ? ",
            values: [firstName, lastName, email]
        });
        return items.affectedRows > 0;
    } catch (err) {
        throw err;
    } finally {
        await connection.release();
    }
}

module.exports = {getUserByUsername,authentication, insertUser, checkUserExist, updatePhotoProfile, updateUsers}