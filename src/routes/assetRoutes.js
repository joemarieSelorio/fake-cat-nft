require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();
const express = require('express');

const {
  createAsset,
  updateAsset,
  createOffer,
  getOffers,
  acceptOffer,
} = require('src/components/assets/assetsController');
const {
  authorize,
} = require('src/middlewares/authorizationMiddleware');

const assetsRouters = new express.Router();

assetsRouters.post('/assets',
    authorize,
    createAsset,
);

assetsRouters.patch('/assets/:assetId/auction',
    authorize,
    updateAsset,
);

assetsRouters.post('/assets/:assetId/offers',
    authorize,
    createOffer,
);

assetsRouters.get('/assets/:assetId/offers',
    authorize,
    getOffers,
);

assetsRouters.patch('/assets/:assetId/offers/:offerId',
    authorize,
    acceptOffer,
);


module.exports = assetsRouters;
