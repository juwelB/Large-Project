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
    makeAdmin,
    getUserEvents,
    getUserClubs, // Added this line
    userInfo
} = controller;

//Post to register/login new user
router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/:id/verify/:token', verifyUser);
router.post('/forgot-password', forgotPassword);
router.post('/:userId/resetpassword/:token', resetPassword);
router.put('/:id/makeAdmin', makeAdmin);
router.get('/:userId/events', getUserEvents);
router.get('/:userId/clubs', getUserClubs); // Added this line
router.get('/userInfo/:email', userInfo);
module.exports = router;