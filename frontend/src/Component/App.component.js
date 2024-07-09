import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../CSS/App.css';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('/api/v1/clubs')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Clubs</h1>
        <ul>
          {data.map(club => (
            <li key={club._id}>{club.name}</li>
          ))}
        </ul>
      </header>
    </div>
  );
}

export default App;