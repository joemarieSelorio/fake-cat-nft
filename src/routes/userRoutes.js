require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();
const express = require('express');

const {
  createUser,
} = require('src/components/users/usersController');

const userRouters = new express.Router();

userRouters.post('/users',
    createUser,
);


module.exports = userRouters;
