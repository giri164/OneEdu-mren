const { check, body } = require('express-validator');

// Shared helpers
const isMongoId = (field) => check(field).optional().isMongoId().withMessage(`${field} must be a valid id`);

module.exports = {
    auth: {
        register: [
            check('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
            check('email').trim().isEmail().withMessage('A valid email is required'),
            check('password')
                .isLength({ min: 6 })
                .withMessage('Password must be at least 6 characters')
                .matches(/[A-Z]/)
                .withMessage('Password must contain at least one uppercase letter')
        ],
        login: [
            check('email').trim().isEmail().withMessage('A valid email is required'),
            check('password').notEmpty().withMessage('Password is required')
        ],
        updateDetails: [
            isMongoId('stream')
        ],
        updatePassword: [
            check('currentPassword').notEmpty().withMessage('Current password is required'),
            check('newPassword')
                .isLength({ min: 6 })
                .withMessage('New password must be at least 6 characters')
                .matches(/[A-Z]/)
                .withMessage('New password must contain at least one uppercase letter')
        ]
    },
    user: {
        skillProgress: [
            check('skill').trim().notEmpty().withMessage('Skill is required'),
            check('level').trim().notEmpty().withMessage('Level is required')
        ],
        courseProgress: [
            check('courseId').trim().notEmpty().withMessage('Course ID is required').isMongoId().withMessage('Invalid course id'),
            check('completionPercentage')
                .notEmpty()
                .withMessage('Completion percentage is required')
                .isFloat({ min: 0, max: 100 })
                .withMessage('Completion percentage must be between 0 and 100'),
            check('isCompleted')
                .notEmpty()
                .withMessage('isCompleted is required')
                .isBoolean()
                .withMessage('isCompleted must be true or false')
        ],
        feedback: [
            check('comment').trim().notEmpty().withMessage('Comment is required'),
            check('rating')
                .notEmpty()
                .withMessage('Rating is required')
                .isInt({ min: 1, max: 5 })
                .withMessage('Rating must be between 1 and 5')
        ],
        applyJob: [
            check('jobId').trim().notEmpty().withMessage('Job ID is required').isMongoId().withMessage('Invalid job id'),
            check('notes').optional().isString().withMessage('Notes must be a string'),
            check('resume').optional().isObject().withMessage('Resume must be an object'),
            check('coverLetter').optional().isString().withMessage('Cover letter must be a string')
        ],
        updateApplication: [
            check('status')
                .optional()
                .isIn(['withdrawn'])
                .withMessage('Status must be "withdrawn"'),
            check('notes').optional().isString().withMessage('Notes must be a string')
        ],
        saveResume: [
            body().isObject().withMessage('Resume must be an object')
        ]
    },
    notifications: {
        createTest: [
            check('title').trim().notEmpty().withMessage('Title is required'),
            check('message').trim().notEmpty().withMessage('Message is required'),
            check('type').trim().notEmpty().withMessage('Type is required')
        ]
    }
};
