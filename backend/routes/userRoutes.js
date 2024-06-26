//User-related routes


// import express
const express = require('express');
const controller = require('../controllers/userController');

// create a new express router
const router = express.Router();

// prep func for export
const {
    validateUser,
    registerUser
} = controller;

//Post to register new user

router.post('/login', validateUser);
router.post('/register', registerUser);

module.exports = router;