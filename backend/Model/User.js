const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        firstname: {
            type: String,
            required: true
        },

        lastname: {
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
                type: mongoose.Types.ObjectId
            }
        ]




    });

module.exports = mongoose.model('User', userSchema);