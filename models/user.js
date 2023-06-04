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

module.exports = {getUserByUsername,authentication}