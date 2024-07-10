import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ClubList = () => {
  const { user } = useContext(AuthContext);
  const [clubs, setClubs] = useState([
    { name: 'Knight Hacks', logo: '/images/club-logos/knightHacks-logo.png', role: 'Member' },
    { name: 'I.E.E.E', logo: '/images/club-logos/ieee-logo.png', role: 'Admin' },
  ]);
  const [sortOption, setSortOption] = useState('All Clubs');

  const handleJoinLeaveClub = (clubName) => {
    // Logic to join/leave the club
    console.log(`Toggling membership for club: ${clubName}`);
  };

  const filteredClubs = sortOption === 'All Clubs' ? clubs : clubs.filter(club => club.role === sortOption);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">UCF Portal</div>
          <nav>
            <Link to="/calendar" className="mx-2 hover:text-gray-300">Calendar</Link>
            <Link to="/dashboard" className="mx-2 hover:text-gray-300">Home</Link>
            <Link to="/events" className="mx-2 hover:text-gray-300">Events</Link>
            <span className="mx-2">Hey, {user ? user.firstName : 'Guest'}</span>
          </nav>
        </div>
      </header>
      <main className="container mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Your Clubs</h2>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-gray-300 rounded-md p-2"
          >
            <option value="All Clubs">All Clubs</option>
            <option value="Member">Member</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <div className="max-w-4xl mx-auto">
          {filteredClubs.map((club, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4 mb-4 flex justify-between items-center">
              <div className="flex items-center">
                <img src={club.logo} alt={`${club.name} logo`} className="w-12 h-12 mr-4" />
                <div>
                  <h3 className="text-xl font-semibold">{club.name}</h3>
                  <p className="text-gray-600">Role: {club.role}</p>
                </div>
              </div>
              <button
                onClick={() => handleJoinLeaveClub(club.name)}
                className="bg-gold hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
                style={{ backgroundColor: '#FFD700' }}
              >
                {club.role ? 'Leave Club' : 'Join Club'}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ClubList;