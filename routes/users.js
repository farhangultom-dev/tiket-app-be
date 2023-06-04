require('dotenv').config();

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const createError = require('http-errors');
const responseFormat = require('response-format');
const jwtKey = process.env.JWT_KEY;

const authModel = require("../models/user");
const helper = require("../helper/helper");

router.post('/signin', async function(req, res, next) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const db = req.headers.schema_name;

    console.log(email);
    console.log(db);

    const getUser = await authModel.getUserByUsername(db,email);
    console.log(getUser);

    if(getUser != null){

      const isAuthenticated = await authModel.authentication(password, getUser.password)
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

module.exports = router;
