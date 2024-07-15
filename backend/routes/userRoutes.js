//User-related routes
// import express
const express = require('express');
const controller = require('../controllers/userController');

// create a new express router
const router = express.Router();

// prep func for export
const {
    registerUser,
    loginUser,
    verifyUser,
    forgotPassword,
    resetPassword
} = controller;

//Post to register/login new user
router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/:id/verify/:token', verifyUser);
router.put('/forgot-password', forgotPassword);
router.post('/:userId/resetpassword/:token', resetPassword);


module.exports = router;