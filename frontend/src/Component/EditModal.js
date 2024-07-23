import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditModal = ({ clubId, isOpen, onClose, onSave }) => {
  const [clubData, setClubData] = useState({
    name: '',
    clubInfo: {
      industry: '',
      description: ''
    }
  });

  useEffect(() => {
    if (isOpen) {
      // Fetch the club data when the modal is opened
      axios.get(`/api/clubs/${clubId}`)
        .then(response => {
          setClubData(response.data);
        })
        .catch(error => {
          console.error('Error fetching club data:', error);
        });
    }
  }, [isOpen, clubId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') {
      setClubData(prevState => ({
        ...prevState,
        [name]: value
      }));
    } else {
      setClubData(prevState => ({
        ...prevState,
        clubInfo: {
          ...prevState.clubInfo,
          [name]: value
        }
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put('/api/clubs/updateclub', { clubId, ...clubData })
      .then(response => {
        onSave(response.data);
        onClose();
      })
      .catch(error => {
        console.error('Error updating club:', error);
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/2">
        <h2 className="text-2xl mb-4">Edit Club</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={clubData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Industry</label>
            <input
              type="text"
              name="industry"
              value={clubData.clubInfo.industry}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description</label>
            <textarea
              name="description"
              value={clubData.clubInfo.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;