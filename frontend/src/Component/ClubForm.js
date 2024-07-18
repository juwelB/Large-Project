import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Modal from './Modal';

const ClubForm = ({ isOpen, onClose }) => {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Upload logo
    let logoPath = '';
    if (logo) {
      const formData = new FormData();
      formData.append('logo', logo);
      const uploadResponse = await axios.post('/api/v1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      logoPath = uploadResponse.data.filePath;
    }

    // Save club data
    const clubData = {
      name,
      clubInfo: {
        industry,
        description,
        logo: logoPath
      },
      adminId: user._id
    };
    const response = await axios.post('/api/v1/clubs/createclub', clubData);
    const createdClub = response.data;

    // Update user role and adminOf field
    await axios.put(`/api/v1/users/${user._id}/makeAdmin`, { clubId: createdClub._id });

    setIsLoading(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create Club</h2>
          <button onClick={onClose} className="text-gray-600 hover:underline">
            Close
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Club Name</label>
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter Club Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
            <input
              type="text"
              id="industry"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter Industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">Club Logo</label>
            <input
              type="file"
              id="logo"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              onChange={(e) => setLogo(e.target.files[0])}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Club...' : 'Create Club'}
          </button>
        </form>
      </div>
    </Modal>
  );
};

export default ClubForm;