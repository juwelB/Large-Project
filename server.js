require('dotenv').config(); // Ensure this is at the very top

const connectDB = require('./backend/dbConnect');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

// import the club, user and event routes
const eventRoutes = require('./backend/routes/eventRoutes');
const clubRoutes = require('./backend/routes/clubRoutes');
const userRoutes = require('./backend/routes/userRoutes');
const uploadRoutes = require('./backend/routes/upload');

let PORT = process.env.PORT || 5050;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// using the routes
app.use('/api/v1/clubs', clubRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/upload', uploadRoutes);

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Root route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

// Catch-all route to serve index.html for any unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

// connect to mongodb
connectDB();
mongoose.connection.once('open', () => {
  console.log('MongoDB connected...');
});

app.listen(PORT, () => {
  console.log(`The Server is running on PORT: ${PORT}`);
});