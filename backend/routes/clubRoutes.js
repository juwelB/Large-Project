//Club-related routes

// import express
const express = require('express');

// import the club controllers
const clubController = require('../controllers/clubController');

// create a new express router
const {
    createClub
} = clubController;

const router = express.Router();

// POST request to create a new club
router.post('/create', createClub);

// export the router
module.exports = router;