require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();
const express = require('express');

const {
  createWallet,
} = require('src/components/wallets/walletsController');

const walletRouters = new express.Router();

walletRouters.post('/wallets',
    createWallet,
);


module.exports = walletRouters;
