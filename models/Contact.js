
const mongoose = require('mongoose');

const contactSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        email: {
            type: String,
            default: '',
        },

        phone: {
            type: String,
            required: [true, 'Please add a phone number'],
        },
        country: {
            type: String,
            default: '',
        },
        isFavorite: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            default: 'personal',
            enum: ['personal', 'professional'],
        },
    },



    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Contact', contactSchema);
