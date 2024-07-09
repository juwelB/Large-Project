const express = require('express');

const {
    createEvent,
    deleteEvent,
    updateEvent,
    viewEvent,
    joinEvent,
    unjoinEvent
} = require('../controllers/eventController');

const router = express.Router();

// POST request to create a new event
router.post('/createevent', createEvent);

// DELETE request to delete an event
router.delete('/deleteevent/:id', deleteEvent);

// PATCH request to update an event
router.patch('/updateevent/:id', updateEvent);

// GET request to view an event
router.get('/viewevent/:id', viewEvent);

// POST request to join an event
router.post('/joinevent/:id', joinEvent);

// POST request to unjoin an event
router.post('/unjoinevent/:id', unjoinEvent);

module.exports = router;
