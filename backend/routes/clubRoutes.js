//Club-related routes

// import express
const express = require('express');

// import the club controllers
const clubController = require('../controllers/clubController');

// create a new express router
const {
    createClub,
    deleteClub,
    updateClub,
    viewClubMembers,
    viewAllClubs,
    viewMyClubs,
    viewClubEvents,
    joinClub,
    leaveClub
} = clubController;

const router = express.Router();

// POST request to create a new club
router.post('/createclub', createClub);
//DELETE request to delete a club
router.delete('/deleteclub', deleteClub);
//PUT request to update a club
router.put('/updateclub', updateClub);
//Get request to view club members
router.get('/viewClubMembers', viewClubMembers);
router.get('/viewAllClubs', viewAllClubs);
router.get('/viewMyClubs', viewMyClubs);
router.get('/viewClubEvents', viewClubEvents);
router.post('/joinClub', joinClub);
router.post('/leaveClub', leaveClub);

// export the router
module.exports = router;