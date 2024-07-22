import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import EventCard from './EventCard';
import { toast } from 'react-toastify';

const EventList = () => {
  const { user } = useContext(AuthContext);
  const [rsvpedEvents, setRsvpedEvents] = useState([]);
  const [clubEvents, setClubEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (user) {
      fetchEvents();
    }
  }, [user]);

  const fetchEvents = async () => {
    if (!user) return; // Ensure user is defined before making API calls
    try {
      const userEventsResponse = await axios.get(`/api/v1/users/${user._id}/events`);
      setRsvpedEvents(userEventsResponse.data);

      const clubsResponse = await axios.post('/api/v1/clubs/viewMyClubs', { userId: user._id });
      const userClubs = clubsResponse.data;

      let allClubEvents = [];
      for (const club of userClubs) {
        if (!club._id) continue; // Ensure club._id is defined
        const clubEventsResponse = await axios.get(`/api/v1/clubs/${club._id}/events`);
        const clubEvents = clubEventsResponse.data;
        allClubEvents = allClubEvents.concat(clubEvents);
      }

      const nonRsvpedClubEvents = allClubEvents.filter(event => !userEventsResponse.data.some(rsvpEvent => rsvpEvent._id === event._id));
      setClubEvents(nonRsvpedClubEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleUnRSVP = async (eventId) => {
    try {
      await axios.post(`/api/v1/events/unjoinEvent/${eventId}`, { userId: user._id });
      setRsvpedEvents(rsvpedEvents.filter(event => event._id !== eventId));
      toast.success('Successfully Un-RSVP\'d from Event');
    } catch (error) {
      console.error('Error unRSVPing from event:', error);
      toast.error('Error Un-RSVPing from event: ' + (error.response ? error.response.data : error.message));
    }
  };

  const handleRSVP = async (eventId) => {
    try {
      await axios.post(`/api/v1/events/joinEvent/${eventId}`, { userId: user._id });
      setRsvpedEvents([...rsvpedEvents, { _id: eventId }]);
      toast.success('Successfully RSVP\'d to Event');
    } catch (error) {
      console.error('Error RSVPing to event:', error);
      toast.error('Error RSVPing to event: ' + (error.response ? error.response.data : error.message));
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`/api/v1/events/deleteEvent/${eventId}`);
      fetchEvents();
      toast.success('Successfully Deleted Event');
    } catch (error) {
      console.error('Error deleting event:', error.response ? error.response.data : error.message);
      toast.error('Error deleting event: ' + (error.response ? error.response.data : error.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">UCF Portal</div>
          <nav>
            <Link to="/calendar" className="mx-2 hover:text-gray-300">Calendar</Link>
            <Link to="/dashboard" className="mx-2 hover:text-gray-300">Home</Link>
            <Link to="/clubs" className="mx-2 hover:text-gray-300">Clubs</Link>
            <span className="mx-2">Hey, {user ? user.name : 'Guest'}</span>
          </nav>
        </div>
      </header>
      <main className="container mx-auto py-12 px-4">
        <h2 className="text-3xl font-bold mb-6">Your RSVP'ed Events</h2>
        <div className="max-w-4xl mx-auto">
          {rsvpedEvents.length > 0 ? (
            rsvpedEvents.map((event, index) => (
              <EventCard
                key={index}
                name={event.Ename}
                date={event.date}
                image={event.image}
                description={event.eventDetail.map(detail => detail.describe).join(', ')}
                location={event.location}
                onRSVP={() => handleUnRSVP(event._id)}
                rsvpStatus={true}
                onDelete={() => handleDeleteEvent(event._id)}
                isAdmin={user?.adminOf?.includes(event.clubId)} // Ensure user.adminOf is defined
              />
            ))
          ) : (
            <p className="text-center text-gray-600">No RSVP'ed events found.</p>
          )}
        </div>
        {selectedEvent && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h3 className="text-2xl font-bold mb-4">{selectedEvent.name}</h3>
            <p className="mb-4"><strong>Description:</strong> {selectedEvent.description}</p>
            <p className="mb-4"><strong>When:</strong> {selectedEvent.date}</p>
            <p className="mb-4"><strong>Where:</strong> {selectedEvent.location}</p>
            <button
              onClick={() => setSelectedEvent(null)}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        )}
        <h2 className="text-3xl font-bold mb-6 mt-12">Discover Your Club Events</h2>
        <div className="max-w-4xl mx-auto">
          {clubEvents.length > 0 ? (
            clubEvents.map((event, index) => (
              <EventCard
                key={index}
                name={event.Ename}
                date={event.date}
                image={event.image}
                description={event.eventDetail.map(detail => detail.describe).join(', ')}
                location={event.location}
                onRSVP={() => handleRSVP(event._id)}
                rsvpStatus={false}
                onDelete={() => handleDeleteEvent(event._id)}
                isAdmin={user?.adminOf?.includes(event.clubId)} // Ensure user.adminOf is defined
              />
            ))
          ) : (
            <p className="text-center text-gray-600">No events found for your clubs.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default EventList;