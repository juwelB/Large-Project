console.log('Server starting...');
console.log('NODE_ENV:', process.env.NODE_ENV);

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

// Use __dirname to get the current directory
const uploadsPath = path.join(__dirname, 'uploads');
console.log('Uploads directory path:', uploadsPath);

// Ensure the uploads directory exists
const fs = require('fs');
if (!fs.existsSync(uploadsPath)) {
  console.log('Creating upload directory');
  fs.mkdirSync(uploadsPath, { recursive: true });
}

// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadsPath));
console.log('Serving static files from:', uploadsPath);

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

// Add the upload route
const { uploadFile } = require('./backend/controllers/uploadController');
app.post('/api/v1/clubs/upload', uploadFile);

app.listen(PORT, () => {
  console.log(`The Server is running on PORT: ${PORT}`);
});