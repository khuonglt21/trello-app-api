const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        isImage: {
            type: Boolean,
            default: true,
        },
        backgroundImageLink: {
            type: String,
            required: true,
        },
        activity: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                name: {
                    type: String,
                },
                action: {
                    type: String,
                },
                date: {
                    type: Date,
                    default: Date.now,
                },
                edited: {
                    type: Boolean,
                    default: false,
                },
                cardTitle: {
                    type: String,
                    default: '',
                },
                actionType: {
                    type: String,
                    default: 'action',
                },
                color: {
                    type: String,
                },
            },
        ],
        members: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
                name: {
                    type: String,
                },
                surname: {
                    type: String,
                },
                email: {
                    type: String,
                },
                role: {
                    type: String,
                    default: 'member'
                },
                color: {
                    type:String,
                },
                avatar:{
                    type: String,
                }
            },
        ],
        lists: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'List',
            },
        ],
        description: {
            type: String,
            default: '',
        },
        teams: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team"
        },
        labels: [
            {
                text: {
                    type: String,
                },
                color: {
                    type: String,
                },
                backColor: {
                    type: String,
                },
                selected: {
                    type: Boolean,
                },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Board', boardSchema);
