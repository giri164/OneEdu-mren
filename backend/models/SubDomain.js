const mongoose = require('mongoose');

const subDomainSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subdomain name is required']
    },
    description: {
        type: String
    },
    stream: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stream',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('SubDomain', subDomainSchema);
