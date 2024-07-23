import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ClubForm = ({ isOpen, onClose, onCreate }) => {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Upload logo
      let logoPath = '';
      if (logo) {
        const formData = new FormData();
        formData.append('logo', logo);
        console.log('Uploading logo:', logo); // Debug log
        const uploadResponse = await axios.post('/api/v1/clubs/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        logoPath = uploadResponse.data.filePath;
        console.log('Received logo path:', logoPath); // Debug log
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
      console.log('Sending club data:', clubData); // Debug log
      const response = await axios.post('/api/v1/clubs/createclub', clubData);
      const createdClub = response.data;

      console.log('Created club:', createdClub); // Debug log

      // Update user role and adminOf field
      await axios.put(`/api/v1/users/${user._id}/makeAdmin`, { clubId: createdClub._id });

      // Clear form fields
      setName('');
      setIndustry('');
      setDescription('');
      setLogo(null);

      onCreate(createdClub); // Pass the created club to the onCreate callback
      onClose();
    } catch (error) {
      console.error('Error creating club:', error.response ? error.response.data : error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create Club</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            &times;
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
    </div>
  );
};

export default ClubForm;