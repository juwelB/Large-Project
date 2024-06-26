const connectDB = require('./dbConnect')
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config();
// const User = require('./Model/User');
// const Event = require('./Model/Event');
// const Club = require('./Model/Club');

// import the club routes
const clubRoutes = require('./routes/clubRoutes');

// import user routes
const userRoutes = require('./routes/userRoutes');


let PORT = process.env.PORT || 5050;

// connect to mongodb
connectDB();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api/clubs', clubRoutes);
app.use('/api/user', userRoutes);
// app.use('/', (req, res) => {
//     res.send(`<h1> Hello World! </h1>`);
// }
// )



// const user1 = new User({

// })



mongoose.connection.once('open', () => {
    console.log('MongoDB connected...');

});


app.listen(PORT, () => {

    console.log(`The Server is running on PORT: ${PORT}`);

});



