const connectDB = require('./backend/dbConnect');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const path = require('path');
require("dotenv").config();

// Import the club, user, and event routes
const eventRoutes = require('./backend/routes/eventRoutes');
const clubRoutes = require('./backend/routes/clubRoutes');
const userRoutes = require('./backend/routes/userRoutes');

let PORT = process.env.PORT || 5050;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Using the routes
app.use('/api/v1/clubs', clubRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/events', eventRoutes);

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Catch-all route to serve index.html for any unknown routes, except API routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    next();  // Skip this middleware if the route starts with /api/
  } else {
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
  }
});

// Connect to MongoDB
connectDB();
mongoose.connection.once('open', () => {
  console.log('MongoDB connected...');
});

app.listen(PORT, () => {
  console.log(`The Server is running on PORT: ${PORT}`);
});
