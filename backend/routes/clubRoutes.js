//Club-related routes

// import express
const express = require('express');

// import the club controllers
const clubController = require('../controllers/clubController');
const { uploadFile } = require('../controllers/uploadController');

const Club = require('../Model/Club'); // Import the Club model

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
router.post('/viewMyClubs', viewMyClubs);
router.get('/viewClubEvents', viewClubEvents);
router.post('/joinClub', joinClub);
router.post('/leaveClub', leaveClub);
router.get('/viewPublicClubEvents', async (req, res) => {
  try {
    const publicClub = await Club.findOne({ name: 'UCF' }).populate('eventList');
    if (!publicClub) {
      return res.status(404).json({ message: 'UCF not found' });
    }
    res.json(publicClub.eventList);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post('/upload', uploadFile);

// Get request to view events of a specific club
router.get('/:clubId/events', viewClubEvents);

// Get request to fetch a single club by ID
router.get('/:clubId', async (req, res) => {
  try {
    const club = await Club.findById(req.params.clubId);
    console.log(club);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }
    res.json(club);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// export the router
module.exports = router;