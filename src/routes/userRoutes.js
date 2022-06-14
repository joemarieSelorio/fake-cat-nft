require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();
const express = require('express');

const {
  createUser,
  getUserWallet,
} = require('src/components/users/usersController');
const {
  authorize,
} = require('src/middlewares/authorizationMiddleware');


const userRouters = new express.Router();

userRouters.post('/users',
    createUser,
);

userRouters.get('/users/:id/wallets',
    authorize,
    getUserWallet,
);


module.exports = userRouters;
