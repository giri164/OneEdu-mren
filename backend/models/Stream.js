const mongoose = require('mongoose');

const streamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Stream name is required'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Stream description is required']
    }
}, { timestamps: true });

module.exports = mongoose.model('Stream', streamSchema);
