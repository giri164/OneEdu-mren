const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Stream = require('./models/Stream');
const SubDomain = require('./models/SubDomain');
const Role = require('./models/Role');
const Course = require('./models/Course');
const Job = require('./models/Job');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

const seedData = async () => {
    try {
        await Stream.deleteMany();
        await SubDomain.deleteMany();
        await Role.deleteMany();
        await Course.deleteMany();
        await Job.deleteMany();
        await User.deleteMany();

        console.log('Data Cleared...');

        // Admin
        await User.create({
            name: 'Admin User',
            email: 'admin@oneedu.com',
            password: 'password123',
            role: 'admin'
        });

        // 1. CSE
        const cse = await Stream.create({
            name: 'Computer Science & Engineering',
            description: 'Software, AI, Cyber Security, and IoT.'
        });

        // 2. Mechanical
        const mech = await Stream.create({
            name: 'Mechanical Engineering',
            description: 'Machine design, Manufacturing, and Robotics.'
        });

        // 3. Civil
        const civil = await Stream.create({
            name: 'Civil Engineering',
            description: 'Infrastructure, Construction, and Urban Planning.'
        });

        // Sub-domains for CSE
        const cseCyber = await SubDomain.create({
            name: 'CSE - Cyber Security',
            stream: cse._id,
            description: 'Blockchain and Network Defense.'
        });

        const cseAI = await SubDomain.create({
            name: 'CSE - AI & ML',
            stream: cse._id,
            description: 'Machine Learning and Neural Networks.'
        });

        // Roles
        const blockchainDev = await Role.create({
            title: 'Blockchain Developer',
            subDomain: cseCyber._id,
            skills: ['Blockchain', 'Solidity', 'Cryptography'],
            description: 'Build secure decentralized apps.'
        });

        const mlEng = await Role.create({
            title: 'ML Engineer',
            subDomain: cseAI._id,
            skills: ['Python', 'Math', 'TensorFlow'],
            description: 'Build predictive AI models.'
        });

        // Courses
        await Course.create([
            {
                title: 'Blockchain Basics',
                skill: 'Blockchain',
                type: 'Free',
                provider: 'YouTube',
                duration: '6 hours',
                link: 'https://www.youtube.com/watch?v=SSo_EIwHSd4',
                description: 'Key concepts of blockchain.'
            },
            {
                title: 'Ethereum Developer Course',
                skill: 'Solidity',
                type: 'Paid',
                provider: 'Udemy',
                duration: '22 hours',
                link: 'https://www.udemy.com/course/ethereum-and-solidity-the-complete-developers-guide/',
                description: 'Build real-world DApps.'
            },
            {
                title: 'Machine Learning A-Z',
                skill: 'TensorFlow',
                type: 'Paid',
                provider: 'Udemy',
                duration: '40 hours',
                link: 'https://www.udemy.com/course/machine-learning-a-z/',
                description: 'Complete ML track.'
            },
            {
                title: 'AI Ethics',
                skill: 'Math',
                type: 'Free',
                provider: 'Coursera',
                duration: '4 weeks',
                link: 'https://www.coursera.org/learn/ai-ethics',
                description: 'Moral implications of AI.'
            }
        ]);

        // Jobs
        await Job.create([
            { title: 'Web3 Engineer', company: 'Solana', location: 'Remote', salary: '+', link: 'https://solana.com/jobs' },
            { title: 'Data Scientist', company: 'Tesla', location: 'Palo Alto', salary: '+', link: 'https://tesla.com/careers' }
        ]);

        console.log(' Full Seeding Complete!');
        process.exit();
    } catch (err) {
        console.error(' Error:', err);
        process.exit(1);
    }
};

seedData();
