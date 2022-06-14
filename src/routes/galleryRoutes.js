require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();
const express = require('express');

const {
  createGallery,
} = require('src/components/galleries/galleriesController');
const {
  authorize,
} = require('src/middlewares/authorizationMiddleware');

const galleryRouters = new express.Router();

galleryRouters.post('/galleries',
    authorize,
    createGallery,
);


module.exports = galleryRouters;
