const express = require('express');
const {
    getStreams, createStream, updateStream, deleteStream,
    createSubStream, updateSubStream, deleteSubStream,
    getAllRoles, createRole, updateRole, deleteRole,
    getAllCourses, addCourse, updateCourse, deleteCourse,
    addJob, getAllFeedback, getAllCertificates, addCertificate, updateCertificate, deleteCertificate
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes here require admin privileges
router.use(protect);
router.use(authorize('admin'));

router.get('/streams', getStreams);
router.post('/streams', createStream);
router.put('/streams/:id', updateStream);
router.delete('/streams/:id', deleteStream);

router.post('/substreams', createSubStream);
router.put('/substreams/:id', updateSubStream);
router.delete('/substreams/:id', deleteSubStream);

router.get('/roles', getAllRoles);
router.post('/roles', createRole);
router.put('/roles/:id', updateRole);
router.delete('/roles/:id', deleteRole);

router.get('/courses', getAllCourses);
router.post('/courses', addCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);
router.post('/jobs', addJob);
router.get('/certificates', getAllCertificates);
router.post('/certificates', addCertificate);
router.put('/certificates/:id', updateCertificate);
router.delete('/certificates/:id', deleteCertificate);

router.get('/feedback', getAllFeedback);

module.exports = router;
