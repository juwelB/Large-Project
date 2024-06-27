const connectDB = require('./dbConnect');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const path = require('path');
require("dotenv").config();

// import the club, user and event routes
const eventRoutes = require('./routes/eventRoutes');
const clubRoutes = require('./routes/clubRoutes');
const userRoutes = require('./routes/userRoutes');

let PORT = process.env.PORT || 5050;


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// using the routes
app.use('/api/v1/clubs', clubRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/events', eventRoutes);


// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Root route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// connect to db
console.log('MONGO_URI:', process.env.MONGO_URI); // Debugging line
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('connected to database');
    // listen to port
    app.listen(process.env.PORT, () => {
      console.log('listening for requests on port', process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(err);
  });