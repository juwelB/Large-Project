const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clubSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    clubInfo: {
        industry: String,
        description: String,
        logo: String // Added logo field
    },
    eventList: [{
        type: mongoose.Types.ObjectId,
        ref: 'Event'
    }],
    memberList: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    adminId: {
        type: mongoose.Types.ObjectId,
        required: true
    }
});


module.exports = mongoose.model('Club', clubSchema);