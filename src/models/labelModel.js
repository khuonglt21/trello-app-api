const mongoose = require('mongoose');

const labelSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    owner: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Card',
        }
    ],
    color: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'board',
        }
    ],

});

module.exports = mongoose.model('Label', labelSchema);
