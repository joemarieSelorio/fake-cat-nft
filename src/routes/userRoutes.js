require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();
const express = require('express');

const {
  createUser,
  getUserWallet,
  getAllUserAssets,
} = require('src/components/users/usersController');
const {
  authorize,
} = require('src/middlewares/authorizationMiddleware');


const userRouters = new express.Router();

userRouters.get('/users/:id/wallets',
    authorize,
    getUserWallet,
);

userRouters.get('/users/:id/assets',
    authorize,
    getAllUserAssets,
);

userRouters.post('/users',
    createUser,
);

module.exports = userRouters;
