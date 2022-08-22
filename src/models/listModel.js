const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
    },
    cards: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Card',
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Board',
    },
});

module.exports = mongoose.model('List', listSchema);
