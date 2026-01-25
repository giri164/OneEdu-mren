const express = require('express');
const {
    getStreams, updateProfile, getCareerPath,
    getRoles, getRoleDetails, updateSkillProgress,
    submitFeedback, trackCourseProgress, getCoursesBySubStream
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/streams', getStreams);

// Protected routes
router.use(protect);
router.put('/profile', updateProfile);
router.get('/career-path/:streamId', getCareerPath);
router.get('/roles/:substreamId', getRoles);
router.get('/role-details/:roleId', getRoleDetails);
router.post('/skill-progress', updateSkillProgress);
router.post('/course-progress', trackCourseProgress);
router.post('/feedback', submitFeedback);
router.get('/streams/:streamSlug/substreams/:subStreamSlug/courses', getCoursesBySubStream);

module.exports = router;
