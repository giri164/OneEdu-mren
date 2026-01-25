const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Role title is required']
    },
    description: {
        type: String
    },
    subDomain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubDomain',
        required: true
    },
    skills: [{
        type: String // Skill names
    }]
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);
