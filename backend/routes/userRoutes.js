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
    resetPassword,
    userInfo
} = controller;

//Post to register/login new user
router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/:id/verify/:token', verifyUser);
router.put('/forgotpassword', forgotPassword);
router.post('/:userId/resetpassword/:token', resetPassword);
router.get('/userInfo:userId', userInfo);

module.exports = router;