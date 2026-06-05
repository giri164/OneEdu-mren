const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  job: {
    type: mongoose.Schema.ObjectId,
    ref: 'Job',
    required: true
  },
  status: {
    type: String,
    enum: ['applied', 'interviewing', 'offered', 'rejected', 'withdrawn'],
    default: 'applied'
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  resume: {
    type: String, // URL to resume file
  },
  coverLetter: {
    type: String,
    maxlength: [1000, 'Cover letter cannot be more than 1000 characters']
  }
}, {
  timestamps: true
});

// Prevent duplicate applications
jobApplicationSchema.index({ user: 1, job: 1 }, { unique: true });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);