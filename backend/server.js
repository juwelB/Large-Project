const connectDB = require('./dbConnect')
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config();

// import the routes
const clubRoutes = require('./routes/clubRoutes');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');

let PORT = process.env.PORT || 5050;

// connect to mongodb
connectDB();

// express app
const app = express();

// Enable CORS
app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
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