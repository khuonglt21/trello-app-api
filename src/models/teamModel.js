const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "can't be blank"],
        index: true,
    },
    description: {
        type: String,
    },
    members: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
            role: {
                type: String,
                default: 'member'
            },
        },
    ],
    boards: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Board'
        }
    ],
    image: {
        type: String
    }
}, {timestamps: true});

module.exports = mongoose.model('Team', teamSchema);