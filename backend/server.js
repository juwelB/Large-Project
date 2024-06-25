const connectDB = require('./dbConnect')
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config();
const User = require('./Model/User');
const Event = require('./Model/Event');
const Club = require('./Model/Club');

// import the club routes
const clubRoutes = require('./routes/clubRoutes');

// middleware
app.use(express.json());

// routes
app.use('/clubs', clubRoutes);


// connect to mongodb
connectDB();
const app = express();
let PORT = process.env.PORT;


const user1 = new User({

})



mongoose.connection.once('open', () => {
    console.log('MongoDB connected...');



    app.listen(this.PORT, () => {

        console.log(`The Server is running on PORT${PORT}`);

    });


})

