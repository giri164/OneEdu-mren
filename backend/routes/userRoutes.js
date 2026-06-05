const express = require('express');
const {
    getStreams,
    updateProfile,
    getCareerPath,
    getRoles,
    getRoleDetails,
    updateSkillProgress,
    submitFeedback,
    trackCourseProgress,
    getCoursesBySubStream,
    search,
    applyForJob,
    getMyApplications,
    updateApplication,
    getResume,
    saveResume,
    getJobMatchScore,
    getJobRecommendations,
    getCareerAnalytics
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validationMiddleware');
const { auth: authSchemas, user: userSchemas } = require('../middleware/validationSchemas');

const router = express.Router();

// Public routes
router.get('/streams', getStreams);

// Protected routes
router.use(protect);
router.get('/search', search);
router.put('/profile', validate(authSchemas.updateDetails), updateProfile);
router.get('/career-path/:streamId', getCareerPath);
router.get('/roles/:substreamId', getRoles);
router.get('/role-details/:roleId', getRoleDetails);
router.post('/skill-progress', validate(userSchemas.skillProgress), updateSkillProgress);
router.post('/course-progress', validate(userSchemas.courseProgress), trackCourseProgress);
router.post('/feedback', validate(userSchemas.feedback), submitFeedback);
router.get('/streams/:streamSlug/substreams/:subStreamSlug/courses', getCoursesBySubStream);
router.get('/jobs/match/:jobId', getJobMatchScore);
router.get('/jobs/recommendations', getJobRecommendations);
router.get('/analytics', getCareerAnalytics);
router.post('/jobs/apply', validate(userSchemas.applyJob), applyForJob);
router.get('/jobs/applications', getMyApplications);
router.put('/jobs/applications/:id', validate(userSchemas.updateApplication), updateApplication);
router.get('/resume', getResume);
router.post('/resume', validate(userSchemas.saveResume), saveResume);

module.exports = router;
