const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const eventSchema = new Schema(
    {
        Ename: {
            type: String,
            required: true
        },

        date: {
            type: Date,
        },

        location: {
            type: Object,
            required: false
        },

        eventDetail: [
            {
                topic: {
                    type: String,
                    required: false
                },
                describe: {
                    type: String,
                    required: false
                }
            }
        ],

        participants: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],

        timeCreated: {
            type: Date,
            default: Date.now
        }

    });

module.exports = mongoose.model('Event', eventSchema);