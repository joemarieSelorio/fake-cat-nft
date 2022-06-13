require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();
const express = require('express');

const {
  createAsset,
} = require('src/components/assets/assetsController');

const assetsRouters = new express.Router();

assetsRouters.post('/assets',
    createAsset,
);


module.exports = assetsRouters;
