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
        logo: String
    },
    eventList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    memberList: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
});


module.exports = mongoose.model('Club', clubSchema);