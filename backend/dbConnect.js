const mongoose = require('mongoose');
require("dotenv").config();


// connect to mongodb
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            // useUnifiedTopology: true,
            // useNewUrlParser: true
        })


    } catch (err) {
        console.log(err);


    }


}

module.exports = connectDB;