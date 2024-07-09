//User-related routes


// import express
const express = require('express');
const controller = require('../controllers/userController');

// create a new express router
const router = express.Router();

// prep func for export
const {
    registerUser,
    loginUser
} = controller;

//Post to register/login new user
router.post('/login', loginUser);
router.post('/register', registerUser);

module.exports = router;