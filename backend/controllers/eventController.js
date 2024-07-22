const Event = require('../Model/Event');
const User = require('../Model/User');
const Club = require('../Model/Club'); // Assuming you have a Club model

// Create new event
const createEvent = async (req, res) => {
    try {
        const { Ename, date, location, eventDetail, clubId } = req.body;

        // Fetch the club to get the logo
        const club = await Club.findById(clubId);
        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }

        const newEvent = new Event({
            Ename,
            date,
            location,
            eventDetail,
            clubId,
            image: club.clubInfo.logo // Set the event image to the club's logo
        });

        const savedEvent = await newEvent.save();

        // Add the event to the club's event list
        club.eventList.push(savedEvent);
        await club.save();

        res.status(201).json(savedEvent);
    } catch (error) {
        res.status(500).json({ message: 'Error creating event', error });
    }
};

// Delete event
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Remove the event from the users' event lists
        await User.updateMany(
            { eventList: id },
            { $pull: { eventList: id } }
        );

        // Remove the event from the club's event list
        await Club.updateMany(
            { eventList: id },
            { $pull: { eventList: id } }
        );

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
        const user = await User.findById(userId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!event.participants.includes(userId)) {
            event.participants.push(userId);
            await event.save();
        }

        if (!user.eventList.includes(id)) {
            user.eventList.push(id);
            await user.save();
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
        const user = await User.findById(userId);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        event.participants = event.participants.filter(participant => participant.toString() !== userId);
        await event.save();

        user.eventList = user.eventList.filter(eventId => eventId.toString() !== id);
        await user.save();

        res.status(200).json({ message: 'Unjoined event successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error unjoining event', error });
    }
};

// Get user's RSVPs
const getUserRsvps = async (req, res) => {
    try {
        const { userId } = req.params;
        const events = await Event.find({ participants: userId }).select('_id');
        const eventIds = events.map(event => event._id);
        res.status(200).json(eventIds);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user RSVPs', error });
    }
};

module.exports = {
    createEvent,
    deleteEvent,
    updateEvent,
    viewEvent,
    joinEvent,
    unjoinEvent,
    getUserRsvps
};