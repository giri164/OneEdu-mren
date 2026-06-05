const Stream = require('../models/Stream');
const SubDomain = require('../models/SubDomain');
const Role = require('../models/Role');
const Course = require('../models/Course');
const Job = require('../models/Job');
const JobApplication = require('../models/JobApplication');
const User = require('../models/User');
const Feedback = require('../models/Feedback');
const jobMatchingService = require('../services/jobMatchingService');
const mongoose = require('mongoose');

// Get all streams
exports.getStreams = async (req, res) => {
    try {
        const streams = await Stream.find();
        
        // Fetch subDomains for each stream
        const streamsWithSubDomains = await Promise.all(
            streams.map(async (stream) => {
                const subDomains = await SubDomain.find({ stream: stream._id });
                return {
                    ...stream.toObject(),
                    subDomains
                };
            })
        );
        
        res.status(200).json({ success: true, data: streamsWithSubDomains });
    } catch (err) {
        console.error('Error in getStreams:', err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// Update user profile with stream selection
exports.updateProfile = async (req, res) => {
    try {
        const { stream } = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, { stream }, { new: true });
        res.status(200).json({ success: true, data: user });
    } catch (err) {
        console.error('Error in updateProfile:', err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// Get subdomains and roles for a stream
exports.getCareerPath = async (req, res) => {
    try {
        const { streamId } = req.params;
        const stream = await Stream.findById(streamId);
        
        if (!stream) {
            return res.status(404).json({ success: false, message: 'Stream not found' });
        }

        const subDomains = await SubDomain.find({ stream: streamId });
        
        res.status(200).json({ success: true, data: { _id: stream._id, name: stream.name, slug: stream.slug, subDomains } });
    } catch (err) {
        console.error('Error in getCareerPath:', err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// Get roles for a subdomain
exports.getRoles = async (req, res) => {
    try {
        const subDomainId = req.params.substreamId || req.params.subdomainId;
        const roles = await Role.find({ subDomain: subDomainId }).populate('subDomain');
        res.status(200).json({ success: true, data: roles });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Get detailed role info with courses and jobs
exports.getRoleDetails = async (req, res) => {
    try {
        const role = await Role.findById(req.params.roleId).populate('subDomain');
        if (!role) return res.status(404).json({ success: false, message: 'Role not found' });

        // Fetch courses linked by role and also those matching skills
        const [roleLinkedCourses, skillCourses] = await Promise.all([
            Course.find({ role: role._id }),
            Course.find({ skill: { $in: role.skills } })
        ]);
        // Merge unique courses by _id
        const seen = new Set();
        const courses = [...roleLinkedCourses, ...skillCourses].filter(c => {
            const id = c._id.toString();
            if (seen.has(id)) return false;
            seen.add(id);
            return true;
        });
        const jobs = await Job.find({ role: req.params.roleId });

        // Get current user's course progress
        const user = await User.findById(req.user.id);
        const courseProgress = user.courseProgress || [];

        res.status(200).json({
            success: true,
            data: {
                _id: role._id,
                title: role.title,
                description: role.description,
                skills: role.skills,
                subDomain: role.subDomain,
                courses: courses.map(c => ({
                    ...c.toObject(),
                    progress: courseProgress.find(cp => cp.course?.toString() === c._id?.toString())
                })),
                jobs
            }
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Update skill progress
exports.updateSkillProgress = async (req, res) => {
    try {
        const { skill, level } = req.body;
        const user = await User.findById(req.user.id);

        const skillIndex = user.skillProgress.findIndex(item => item.skill === skill);
        if (skillIndex > -1) {
            await User.updateOne(
                { _id: req.user.id, "skillProgress.skill": skill },
                { $set: { "skillProgress.$.level": level } }
            );
        } else {
            await User.updateOne(
                { _id: req.user.id },
                { $push: { skillProgress: { skill, level } } }
            );
        }

        const updatedUser = await User.findById(req.user.id)
            .populate('stream')
            .populate({
                path: 'courseProgress.course',
                select: 'title skill type provider duration link description role'
            });
        res.status(200).json({ success: true, data: updatedUser.skillProgress });
    } catch (err) {
        console.error('Error in updateSkillProgress:', err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// Track course progress
exports.trackCourseProgress = async (req, res) => {
    try {
        const { courseId, completionPercentage, isCompleted } = req.body;
        const user = await User.findById(req.user.id);

        const courseIndex = user.courseProgress.findIndex(
            cp => cp.course?.toString() === courseId
        );

        if (courseIndex > -1) {
            await User.updateOne(
                { _id: req.user.id, "courseProgress.course": courseId },
                { 
                    $set: { 
                        "courseProgress.$.completionPercentage": completionPercentage,
                        "courseProgress.$.isCompleted": isCompleted,
                        "courseProgress.$.completedAt": isCompleted ? new Date() : (user.courseProgress[courseIndex].completedAt || null)
                    } 
                }
            );
        } else {
            await User.updateOne(
                { _id: req.user.id },
                { 
                    $push: { 
                        courseProgress: {
                            course: courseId,
                            completionPercentage,
                            isCompleted,
                            startedAt: new Date(),
                            completedAt: isCompleted ? new Date() : null
                        } 
                    } 
                }
            );
        }

        const updatedUser = await User.findById(req.user.id)
            .populate('stream')
            .populate({
                path: 'courseProgress.course',
                select: 'title skill type provider duration link description role'
            });
        res.status(200).json({ success: true, data: updatedUser });
    } catch (err) {
        console.error('Error in trackCourseProgress:', err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// Submit feedback
exports.submitFeedback = async (req, res) => {
    try {
        const { comment, rating } = req.body;
        const feedback = await Feedback.create({
            user: req.user.id,
            comment,
            rating
        });
        res.status(201).json({ success: true, data: feedback });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Courses by stream/substream slug with user progress + roles + jobs
exports.getCoursesBySubStream = async (req, res) => {
    try {
        const { streamSlug, subStreamSlug } = req.params;

        const stream = await Stream.findOne({ slug: streamSlug });
        if (!stream) {
            return res.status(404).json({ success: false, message: 'Stream not found' });
        }

        const subStream = await SubDomain.findOne({ slug: subStreamSlug, stream: stream._id });
        if (!subStream) {
            return res.status(404).json({ success: false, message: 'Sub-stream not found' });
        }

        const roles = await Role.find({ subDomain: subStream._id });
        const roleIds = roles.map(r => r._id);

        const courses = await Course.find({
            $or: [
                { subDomain: subStream._id },
                { role: { $in: roleIds } }
            ]
        }).sort({ createdAt: -1 });

        const jobs = await Job.find({ role: { $in: roleIds } }).sort({ createdAt: -1 });

        const user = await User.findById(req.user.id);
        const courseProgress = user?.courseProgress || [];
        const progressByCourse = new Map(
            courseProgress.map(cp => [cp.course?.toString(), cp])
        );

        const coursesWithProgress = courses.map(c => {
            const prog = progressByCourse.get(c._id.toString());
            return {
                ...c.toObject(),
                progress: prog || null
            };
        });

        return res.status(200).json({
            success: true,
            data: {
                stream,
                subStream,
                roles,
                courses: coursesWithProgress,
                jobs
            }
        });
    } catch (err) {
        console.error('Error in getCoursesBySubStream:', err);
        return res.status(400).json({ success: false, message: err.message });
    }
};

// Search across courses, jobs, roles, and streams
exports.search = async (req, res) => {
    try {
        const { q: query } = req.query;

        if (!query || query.trim().length < 2) {
            return res.status(200).json({
                success: true,
                data: {
                    courses: [],
                    jobs: [],
                    roles: [],
                    streams: []
                }
            });
        }

        const searchRegex = new RegExp(query, 'i');

        // Search courses
        const courses = await Course.find({
            $or: [
                { title: searchRegex },
                { provider: searchRegex },
                { description: searchRegex }
            ]
        }).populate('role').limit(20);

        // Search jobs
        const jobs = await Job.find({
            $or: [
                { title: searchRegex },
                { company: searchRegex },
                { location: searchRegex },
                { description: searchRegex }
            ]
        }).populate('role').limit(20);

        // Search roles
        const roles = await Role.find({
            $or: [
                { title: searchRegex },
                { skills: { $in: [searchRegex] } }
            ]
        }).populate('subDomain').limit(20);

        // Search streams
        const streams = await Stream.find({
            name: searchRegex
        }).limit(10);

        res.status(200).json({
            success: true,
            data: {
                courses,
                jobs,
                roles,
                streams
            }
        });
    } catch (err) {
        console.error('Error in search:', err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// Apply for a job
exports.applyForJob = async (req, res) => {
    try {
        const { jobId, notes, resume, coverLetter } = req.body;

        // Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        // Check if user already applied
        const existingApplication = await JobApplication.findOne({
            user: req.user.id,
            job: jobId
        });

        if (existingApplication) {
            return res.status(400).json({ success: false, message: 'You have already applied for this job' });
        }

        // Create application
        const application = await JobApplication.create({
            user: req.user.id,
            job: jobId,
            notes,
            resume,
            coverLetter
        });

        res.status(201).json({
            success: true,
            data: application
        });
    } catch (err) {
        console.error('Error in applyForJob:', err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// Get user's job applications
exports.getMyApplications = async (req, res) => {
    try {
        const applications = await JobApplication.find({ user: req.user.id })
            .populate('job')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: applications
        });
    } catch (err) {
        console.error('Error in getMyApplications:', err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// Update application status (for user to withdraw)
exports.updateApplication = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, notes } = req.body;

        const application = await JobApplication.findOne({
            _id: id,
            user: req.user.id
        });

        if (!application) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        // Users can only withdraw their applications
        if (status && status !== 'withdrawn') {
            return res.status(400).json({ success: false, message: 'You can only withdraw applications' });
        }

        application.status = status || application.status;
        if (notes) application.notes = notes;

        await application.save();

        res.status(200).json({
            success: true,
            data: application
        });
    } catch (err) {
        console.error('Error in updateApplication:', err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// Get user's resume
exports.getResume = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('resume');
        res.status(200).json({
            success: true,
            data: user.resume || null
        });
    } catch (err) {
        console.error('Error in getResume:', err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// Save/update user's resume
exports.saveResume = async (req, res) => {
    try {
        const resume = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { resume },
            { new: true }
        );
        res.status(200).json({
            success: true,
            data: user.resume
        });
    } catch (err) {
        console.error('Error in saveResume:', err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// Get job match score for a specific job
exports.getJobMatchScore = async (req, res) => {
    try {
        const { jobId } = req.params;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        const userSkills = user.skillProgress?.map(s => s.skill) || [];
        const matchResult = jobMatchingService.calculateMatchScore(userSkills, job.requirements || []);

        res.status(200).json({
            success: true,
            data: {
                jobId: job._id,
                jobTitle: job.title,
                ...matchResult
            }
        });
    } catch (err) {
        console.error('Error in getJobMatchScore:', err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// Get personalized job recommendations
exports.getJobRecommendations = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Get all available jobs
        const jobs = await Job.find({ isActive: true });

        const userSkills = user.skillProgress?.map(s => s.skill) || [];
        const recommendations = jobMatchingService.getJobRecommendations(userSkills, jobs);

        res.status(200).json({
            success: true,
            data: recommendations.slice(0, 10) // Return top 10 recommendations
        });
    } catch (err) {
        console.error('Error in getJobRecommendations:', err);
        res.status(400).json({ success: false, message: err.message });
    }
};

// Get career analytics for the user
exports.getCareerAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get job applications with status
        const applications = await JobApplication.find({ user: userId })
            .populate('job', 'title company')
            .sort({ createdAt: -1 });

        // Calculate application stats
        const totalApplications = applications.length;
        const pendingApplications = applications.filter(app => app.status === 'pending').length;
        const acceptedApplications = applications.filter(app => app.status === 'accepted').length;
        const rejectedApplications = applications.filter(app => app.status === 'rejected').length;
        const interviewRate = totalApplications > 0 ? Math.round((acceptedApplications / totalApplications) * 100) : 0;

        // Get course progress
        const courseProgress = await User.findById(userId).select('courseProgress');
        const totalCourses = courseProgress?.courseProgress?.length || 0;
        const completedCourses = courseProgress?.courseProgress?.filter(c => c.isCompleted)?.length || 0;
        const courseCompletionRate = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;

        // Get skill progress over time (mock data for now - in production, track skill updates)
        const skillProgress = courseProgress?.courseProgress?.filter(c => c.isCompleted) || [];
        const skillsLearned = skillProgress.length;

        // Monthly application data (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyApplications = await JobApplication.aggregate([
            { $match: { user: mongoose.Types.ObjectId(userId), createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Format monthly data
        const monthlyData = monthlyApplications.map(item => ({
            month: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`,
            applications: item.count
        }));

        // Skill development over time (simplified)
        const skillDevelopmentData = [
            { month: 'Jan', skills: 2 },
            { month: 'Feb', skills: 3 },
            { month: 'Mar', skills: 5 },
            { month: 'Apr', skills: 7 },
            { month: 'May', skills: 8 },
            { month: 'Jun', skills: skillsLearned }
        ];

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalApplications,
                    pendingApplications,
                    acceptedApplications,
                    rejectedApplications,
                    interviewRate,
                    totalCourses,
                    completedCourses,
                    courseCompletionRate,
                    skillsLearned
                },
                charts: {
                    monthlyApplications: monthlyData,
                    skillDevelopment: skillDevelopmentData
                }
            }
        });
    } catch (err) {
        console.error('Error in getCareerAnalytics:', err);
        res.status(400).json({ success: false, message: err.message });
    }
};
