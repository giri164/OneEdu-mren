const mongoose = require('mongoose');

const subDomainSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subdomain name is required'],
        trim: true
    },
    slug: {
        type: String,
        unique: true
    },
    recommendedCertifications: [
        {
            name: String,
            issuer: String,
            level: String,
            examUrl: String,
            fee: String
        }
    ],
    description: {
        type: String
    },
    stream: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stream',
        required: true
    }
}, { timestamps: true });

subDomainSchema.pre('save', function setSlug() {
    if (this.isModified('name')) {
        const base = this.name || '';
        this.slug = base
            .toString()
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }
});

module.exports = mongoose.model('SubDomain', subDomainSchema);
