const connectDB = require('./dbConnect')
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config();
const User = require('./Model/User');
const Event = require('./Model/Event');
const Club = require('./Model/Club');


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

