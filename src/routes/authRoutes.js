require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();
const express = require('express');

const {
  login,
} = require('src/components/auth/authController');

const authRouters = new express.Router();

authRouters.post('/login',
    login,
);


module.exports = authRouters;
