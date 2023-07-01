require('dotenv').config();

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const createError = require('http-errors');
const responseFormat = require('response-format');
const multer  = require('multer')

const storage = multer.diskStorage({
  destination: './images',
  filename: function (req, file, cb) {
    const fileName = Date.now()+Math.round(Math.random() * 1E9)+'-'+file.originalname
    cb(null, fileName);
  }
});

const uploadAny = multer({storage: storage}).any();

const jwtKey = process.env.JWT_KEY;

const userModel = require("../models/user");
const helper = require("../helper/helper");


router.post('/signin', async function(req, res, next) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const db = req.headers.schema_name;

    console.log(email);
    console.log(db);

    const getUser = await userModel.getUserByUsername(db,email);
    console.log(getUser);

    if(getUser != null){

      const isAuthenticated = await userModel.authentication(password, getUser.password)
      console.log("authentication "+isAuthenticated)

      if (isAuthenticated){
        res.send(responseFormat.success("Successfully login", helper.deleteFromObject('password',getUser)))
        return
      }

      res.send(responseFormat.unAuthorized("Wrong password"))
      return

    }

    res.send(responseFormat.notFound("User could not be found"))
    return

  } catch (err) {
    next(createError(err.code,err.message));
  }
});

router.post('/signup',async function(req, res, next) {
  try {
    const email = req.body.email;
    const firstName = req.body.first_name
    const lastName = req.body.last_name
    const hashPassword = bcrypt.hashSync(req.body.password, 10);
    const db = req.headers.schema_name;

    let checkUserExist = await userModel.checkUserExist(db,email)

    if (checkUserExist){
      res.send(responseFormat.badRequest("Your email has been used"))
      return
    }

    let isSuccessSignUp = await userModel.insertUser(db,email,firstName,lastName,hashPassword)
    console.log(isSuccessSignUp)

    if (isSuccessSignUp) {
      res.send(responseFormat.success("Sign up success"))
      return
    }

    res.send(responseFormat.internalError("Sign up failed"))
    return

  } catch (err) {
    next(createError(err.code,err.message));
  }
});

router.post('/updateUsers',async function(req, res, next) {
  try {
    const email = req.body.email
    const firstName = req.body.first_name
    const lastName = req.body.last_name
    const db = req.headers.schema_name

    let isSuccessUpdate = await userModel.updateUsers(db,firstName,lastName,email)
    console.log(isSuccessUpdate)

    if (isSuccessUpdate) {
      res.send(responseFormat.success("Update user success"))
      return
    }

    res.send(responseFormat.internalError("Update user failed"))
    return

  } catch (err) {
    next(createError(err.code,err.message));
  }
});

router.post('/uploadPhotoProfile',uploadAny,async function(req, res, next) {
  try {
    const email = req.body.email;
    const db = req.headers.schema_name;

    if (req.files[0]){
      const filePath = req.protocol + '://' + req.get('host') + '/' + req.files[0].path
      const modifiedFilePath = filePath.replace(/\\/g, '/');

      let isSuccessUploadPhoto = await userModel.updatePhotoProfile(db,email,modifiedFilePath)

      if (isSuccessUploadPhoto){
        res.send(responseFormat.success("Success upload photo profile"))
      }

      res.send(responseFormat.internalError("Something went wrong"))
      return

    }

    res.send(responseFormat.badRequest("Nothing picture to upload"))
    return

  } catch (err) {
    next(createError(err.code,err.message));
  }
});

module.exports = router;
