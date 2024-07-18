const Event = require('../Model/Event');
const Club = require('../Model/Club'); // Assuming you have a Club model

// Create new event
const createEvent = async (req, res) => {
    try {
        const { Ename, date, location, eventDetail, clubId } = req.body;
        const newEvent = new Event({
            Ename,
            date,
            location,
            eventDetail,
            clubId
        });
        const savedEvent = await newEvent.save();

        // Add the event to the club's event list
        await Club.findByIdAndUpdate(clubId, { $push: { events: savedEvent._id } });

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
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error viewing event', error });
    }
};

// Join event (RSVP)
const joinEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        if (!event.participants.includes(userId)) {
            event.participants.push(userId);
            await event.save();
        }
        res.status(200).json({ message: 'Joined event successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error joining event', error });
    }
};

// Un-join event (Cancel RSVP)
const unjoinEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        event.participants = event.participants.filter(participant => participant.toString() !== userId);
        await event.save();
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