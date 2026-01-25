const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Course title is required']
    },
    slug: {
        type: String,
        unique: true
    },
    skill: {
        type: String,
        required: [true, 'Associated skill is required']
    },
    // Optional relations to organize courses by platform hierarchy
    stream: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stream',
        default: null
    },
    subDomain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubDomain',
        default: null
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        default: null
    },
    type: {
        type: String,
        enum: ['Free', 'Paid'],
        required: true
    },
    amount: {
        type: Number,
        min: 0,
        required: function requiredAmount() {
            return this.type === 'Paid';
        },
        default: 0
    },
    provider: {
        type: String,
        required: true
    },
    duration: {
        type: String
    },
    link: {
        type: String,
        required: true // primary link is mandatory
    },
    resourceLinks: {
        type: [
            {
                label: String,
                url: String,
                provider: String,
                type: {
                    type: String,
                    enum: ['Free', 'Paid'],
                    default: 'Free'
                },
                amount: {
                    type: Number,
                    min: 0,
                    required: function requiredResourceAmount() {
                        return this.type === 'Paid';
                    },
                    default: 0
                }
            }
        ],
        validate: {
            validator: function(val) {
                return !val || val.length <= 4; // Primary link + up to 4 extras => max 5 total
            },
            message: 'You can add at most 4 additional course links.'
        }
    },
    description: {
        type: String
    },
    certifications: [{
        name: String,
        type: {
            type: String,
            enum: ['Free', 'Paid']
        },
        link: String
    }],
    targetCompanies: [String]
    ,
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    durationLabel: String,
    videoLinks: [
        {
            title: String,
            url: String
        }
    ],
    certificateLinks: {
        type: [
            {
                label: String,
                url: String,
                type: {
                    type: String,
                    enum: ['Free', 'Paid'],
                    default: 'Paid'
                },
                amount: {
                    type: Number,
                    min: 0,
                    required: function requiredCertificateAmount() {
                        return this.type === 'Paid';
                    },
                    default: 0
                }
            }
        ],
        validate: {
            validator: function(val) {
                return !val || val.length <= 5;
            },
            message: 'You can add at most 5 certification links.'
        }
    },
    isFeatured: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

courseSchema.pre('save', function setSlug() {
    if (this.isModified('title')) {
        const base = this.title || '';
        this.slug = base
            .toString()
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    }
});

module.exports = mongoose.model('Course', courseSchema);
