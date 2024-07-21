const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true
        },

        lastName: {
            type: String,
            required: function () { return (this.role !== 0) }
        },

        userName: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true
        },
        // default user has a rule of 0, admin 1
        role:
        {
            type: Number,
            default: 0
        }
        ,
        clubList: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Club'
            }
        ],
        adminOf: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Club'
            }
        ],
        isVerified: {
            type: Boolean,
            default: false
        },
        eventList: [
            {
                type: mongoose.Types.ObjectId,
                ref: 'Event'
            }
        ]
    });
userSchema.methods.setClubsAdmin = function (clubId) {
    if (this.role != 1)
        throw new Error('Only admins can have adminOf attribute.');
    this.adminOf.push(clubId);
    return true;

}

module.exports = mongoose.model('User', userSchema);