const { z } = require('zod');

// User validation schemas
const userRegisterSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters').regex(/[A-Z]/, 'Password must contain at least one uppercase letter'),
    role: z.enum(['user', 'admin']).optional().default('user')
});

const userLoginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required')
});

const updateProfileSchema = z.object({
    name: z.string().min(2).max(50).optional(),
    stream: z.string().optional(),
    skillProgress: z.array(z.object({
        skill: z.string(),
        level: z.enum(['Beginner', 'Intermediate', 'Advanced'])
    })).optional()
});

// Resume validation schema
const resumeSchema = z.object({
    personalInfo: z.object({
        fullName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        address: z.string().optional(),
        linkedin: z.string().url().optional(),
        github: z.string().url().optional(),
        website: z.string().url().optional()
    }),
    summary: z.string().optional(),
    experience: z.array(z.object({
        company: z.string(),
        position: z.string(),
        location: z.string().optional(),
        startDate: z.string(),
        endDate: z.string().optional(),
        current: z.boolean().optional(),
        description: z.string()
    })).optional(),
    education: z.array(z.object({
        institution: z.string(),
        degree: z.string(),
        field: z.string().optional(),
        location: z.string().optional(),
        startDate: z.string(),
        endDate: z.string().optional(),
        current: z.boolean().optional(),
        gpa: z.string().optional()
    })).optional(),
    skills: z.array(z.string()).optional(),
    certifications: z.array(z.object({
        name: z.string(),
        issuer: z.string(),
        date: z.string(),
        url: z.string().url().optional()
    })).optional(),
    projects: z.array(z.object({
        name: z.string(),
        description: z.string(),
        technologies: z.array(z.string()),
        url: z.string().url().optional(),
        github: z.string().url().optional()
    })).optional(),
    languages: z.array(z.object({
        language: z.string(),
        proficiency: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Native'])
    })).optional()
});

// Feedback validation
const feedbackSchema = z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().min(10, 'Comment must be at least 10 characters'),
    category: z.enum(['bug', 'feature', 'improvement', 'other']).optional()
});

// Job application validation
const jobApplicationSchema = z.object({
    jobId: z.string(),
    coverLetter: z.string().optional(),
    expectedSalary: z.string().optional()
});

module.exports = {
    userRegisterSchema,
    userLoginSchema,
    updateProfileSchema,
    resumeSchema,
    feedbackSchema,
    jobApplicationSchema
};