const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 5,
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    avatar: {
        type: String,
        default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
    },
    stream: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stream',
        default: null
    },
    skillProgress: [{
        skill: String,
        level: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced'],
            default: 'Beginner'
        }
    }],
    courseProgress: [{
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        isCompleted: {
            type: Boolean,
            default: false
        },
        completionPercentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        startedAt: {
            type: Date,
            default: null
        },
        completedAt: {
            type: Date,
            default: null
        }
    }],
    resume: {
        personalInfo: {
            fullName: String,
            email: String,
            phone: String,
            address: String,
            linkedin: String,
            github: String,
            website: String
        },
        summary: String,
        experience: [{
            company: String,
            position: String,
            location: String,
            startDate: String,
            endDate: String,
            current: Boolean,
            description: String
        }],
        education: [{
            institution: String,
            degree: String,
            field: String,
            location: String,
            startDate: String,
            endDate: String,
            current: Boolean,
            gpa: String
        }],
        skills: [String],
        certifications: [{
            name: String,
            issuer: String,
            date: String,
            url: String
        }],
        projects: [{
            name: String,
            description: String,
            technologies: [String],
            url: String,
            github: String
        }],
        languages: [{
            language: String,
            proficiency: {
                type: String,
                enum: ['Beginner', 'Intermediate', 'Advanced', 'Native']
            }
        }]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
