import React, { useState } from 'react';
import axios from 'axios';

const ClubForm = () => {
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      }
    };
    await axios.post('/api/v1/clubs/createclub', clubData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Club Name" required />
      <input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Industry" />
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description"></textarea>
      <input type="file" onChange={(e) => setLogo(e.target.files[0])} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default ClubForm;