const Stream = require('../models/Stream');
const SubDomain = require('../models/SubDomain');
const Role = require('../models/Role');
const Course = require('../models/Course');
const Job = require('../models/Job');
const User = require('../models/User');
const Feedback = require('../models/Feedback');

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
