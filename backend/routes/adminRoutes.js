const express = require('express');
const {
    createStream, updateStream, deleteStream,
    createSubDomain, deleteSubDomain,
    getAllRoles, createRole, updateRole, deleteRole,
    getAllCourses, addCourse, updateCourse, deleteCourse,
    addJob, getAllFeedback
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes here require admin privileges
router.use(protect);
router.use(authorize('admin'));

router.post('/streams', createStream);
router.put('/streams/:id', updateStream);
router.delete('/streams/:id', deleteStream);

router.post('/subdomains', createSubDomain);
router.delete('/subdomains/:id', deleteSubDomain);

router.get('/roles', getAllRoles);
router.post('/roles', createRole);
router.put('/roles/:id', updateRole);
router.delete('/roles/:id', deleteRole);

router.get('/courses', getAllCourses);
router.post('/courses', addCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);
router.post('/jobs', addJob);

router.get('/feedback', getAllFeedback);

module.exports = router;
