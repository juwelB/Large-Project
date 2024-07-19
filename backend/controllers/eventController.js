const Event = require('../Model/Event');

// Create new event
const createEvent = async (req, res) => {
    try {
        const { Ename, date, location, eventDetail } = req.body;
        const newEvent = new Event({
            Ename,
            date,
            location,
            eventDetail
        });
        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        res.status(500).json({ message: 'Error creating event', error });
    }
};

// Delete event
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        await Event.findByIdAndDelete(id);
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event', error });
    }
};

// Update event
const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedEvent = await Event.findByIdAndUpdate(id, updates, { new: true });
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: 'Error updating event', error });
    }
};

// View event
const viewEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);
        if (!event) 
        {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error viewing event', error });
    }
};

// Join event
const joinEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);
        if (!event) 
        {
            return res.status(404).json({ message: 'Event not found' });
        }
        // Add logic to add user to event's participant list
        res.status(200).json({ message: 'Joined event successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error joining event', error });
    }
};

// Un-join event
const unjoinEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);
        if (!event) 
        {
            return res.status(404).json({ message: 'Event not found' });
        }
        // Add logic to remove user from event's participant list
        res.status(200).json({ message: 'Unjoined event successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error unjoining event', error });
    }
};

module.exports = {
    createEvent,
    deleteEvent,
    updateEvent,
    viewEvent,
    joinEvent,
    unjoinEvent
};
