const mongoose = require('mongoose');

const streamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Stream name is required'],
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Stream description is required']
    }
}, { timestamps: true });

streamSchema.pre('save', function setSlug() {
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

module.exports = mongoose.model('Stream', streamSchema);
