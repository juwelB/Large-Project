//Club-related routes

// import express
const express = require('express');

// import the club controllers
const clubController = require('../controllers/eventController');

// create a new express router
const {
    createEvent,
    deleteEvent,
    updateEvent,
    viewEvent,
    joinEvent,
    unjoinEvent
} = clubController;

const router = express.Router();

// POST request to create a new event
router.post('/createevent', createEvent);

// DELETE request to delete an event
router.delete('/deleteevent', deleteEvent);

// PATCH request to update an event
router.patch('/updateevent', updateEvent);

// GET request to view an event
router.get('/viewevent', viewEvent);

// POST request to join an event
router.post('/joinevent', joinEvent);

// POST request to unjoin an event
router.post('/unjoinevent', unjoinEvent);

module.exports = router;