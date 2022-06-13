require('app-module-path').addPath(require('app-root-path').toString());
require('dotenv').config();
const express = require('express');

const {
  createVote,
} = require('src/components/votes/votesController');

const voteRouters = new express.Router();

voteRouters.post('/votes',
    createVote,
);


module.exports = voteRouters;
