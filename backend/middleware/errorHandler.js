// Centralized error handler middleware
// Should be placed after all routes in index.js

const errorHandler = (err, req, res, next) => {
    // Default status
    const statusCode = err.statusCode || 500;

    // Log the error (can be enhanced for production)
    console.error(err);

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Server Error',
        errors: err.errors || undefined
    });
};

module.exports = errorHandler;
