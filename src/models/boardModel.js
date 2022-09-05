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
                    default: 'Member'
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
        visibility:{
            type:String
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
        isExpandedLabels: {
            type: Boolean,
            default: false,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Board', boardSchema);
