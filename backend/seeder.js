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

        // Admin with specific credentials: username=admin, email=admin@gmail.com, password=admin
        await User.create({
            name: 'admin',
            email: 'admin@gmail.com',
            password: 'admin',
            role: 'admin'
        });

        // 1. CSE Stream
        const cse = await Stream.create({
            name: 'Computer Science & Engineering',
            description: 'Focuses on software development, AI, Cyber Security, and IoT systems.'
        });

        // 2. Mechanical Stream
        await Stream.create({
            name: 'Mechanical Engineering',
            description: 'Design, manufacturing, and maintenance of mechanical systems and robotics.'
        });

        // 3. Civil Stream
        await Stream.create({
            name: 'Civil Engineering',
            description: 'Infrastructure, construction management, and urban development.'
        });

        // --- CSE SUB-DOMAINS ---
        const cseAIML = await SubDomain.create({
            name: 'CSE - AI & Machine Learning',
            stream: cse._id,
            description: 'Neural Networks, Deep Learning, and Predictive AI systems.'
        });

        const cseDataScience = await SubDomain.create({
            name: 'CSE - Data Science',
            stream: cse._id,
            description: 'Big Data Analytics, Statistical Modeling, and Business Intelligence.'
        });

        const cseCyber = await SubDomain.create({
            name: 'CSE - Cyber Security',
            stream: cse._id,
            description: 'Network Defense, Ethical Hacking, and Blockchain Technology.'
        });

        const cseIoT = await SubDomain.create({
            name: 'CSE - Internet of Things',
            stream: cse._id,
            description: 'Smart Devices, Embedded Systems, and Connected Infrastructure.'
        });

        // --- ROLES & COURSES: CYBER SECURITY (Blockchain focus) ---
        const blockchainDev = await Role.create({
            title: 'Blockchain Developer',
            subDomain: cseCyber._id,
            skills: ['Blockchain', 'Solidity', 'Web3'],
            description: 'Build decentralized user applications and secure smart contracts.'
        });

        await Course.create([
            { title: 'Blockchain Fundamentals', skill: 'Blockchain', type: 'Free', provider: 'YouTube', duration: '5 hours', link: 'https://www.youtube.com/watch?v=SSo_EIwHSd4', description: 'Concepts of DLT and Consensus.' },
            { title: 'Full Solidity Course', skill: 'Solidity', type: 'Paid', provider: 'Udemy', duration: '20 hours', link: 'https://www.udemy.com/course/ethereum-and-solidity-the-complete-developers-guide/', description: 'Ethereum Smart Contract development.' },
            { title: 'Web3 & React DApps', skill: 'Web3', type: 'Paid', provider: 'Udemy', duration: '12 hours', link: 'https://www.udemy.com/course/web3-dapp-programming-with-react/', description: 'Connect frontend to Blockchain.' }
        ]);

        // --- ROLES & COURSES: AI & ML ---
        const mlEngineer = await Role.create({
            title: 'Machine Learning Engineer',
            subDomain: cseAIML._id,
            skills: ['Python', 'Machine Learning', 'TensorFlow'],
            description: 'Design and deploy AI models for production.'
        });

        await Course.create([
            { title: 'Python for AI', skill: 'Python', type: 'Free', provider: 'YouTube', duration: '10 hours', link: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI', description: 'Python programming essentials for AI.' },
            { title: 'ML A-Z Certification', skill: 'Machine Learning', type: 'Paid', provider: 'Udemy', duration: '40 hours', link: 'https://www.udemy.com/course/machine-learning-a-z/', description: 'Complete ML bootcamp.' },
            { title: 'TensorFlow for Beginners', skill: 'TensorFlow', type: 'Free', provider: 'TensorFlow.org', duration: 'Self-paced', link: 'https://www.tensorflow.org/tutorials', description: 'Official deep learning tutorials.' }
        ]);

        // --- ROLES & COURSES: DATA SCIENCE ---
        const dataScientist = await Role.create({
            title: 'Data Scientist',
            subDomain: cseDataScience._id,
            skills: ['Statistics', 'SQL', 'Pandas'],
            description: 'Analyze complex data to drive business decisions.'
        });

        await Course.create([
            { title: 'Practical Statistics', skill: 'Statistics', type: 'Paid', provider: 'Coursera', duration: '4 weeks', link: 'https://www.coursera.org/learn/probability-statistics', description: 'Statistical foundations for data science.' },
            { title: 'SQL Mastery', skill: 'SQL', type: 'Free', provider: 'YouTube', duration: '6 hours', link: 'https://www.youtube.com/watch?v=HXV3zeQKqGY', description: 'Advanced SQL queries and modeling.' }
        ]);

        // --- ROLES & COURSES: IOT ---
        const iotEngineer = await Role.create({
            title: 'IoT System Architect',
            subDomain: cseIoT._id,
            skills: ['Embedded C', 'Arduino', 'MQTT'],
            description: 'Design end-to-end IoT ecosystems.'
        });

        await Course.create([
            { title: 'Arduino for Beginners', skill: 'Arduino', type: 'Free', provider: 'YouTube', duration: '8 hours', link: 'https://www.youtube.com/watch?v=zJ-LqeX_fLU', description: 'Microcontroller programming basics.' },
            { title: 'Embedded Systems with C', skill: 'Embedded C', type: 'Paid', provider: 'Udemy', duration: '15 hours', link: 'https://www.udemy.com/course/embedded-c-programming/', description: 'Low-level hardware programming.' }
        ]);

        // --- JOBS DATA ---
        await Job.create([
            { title: 'Blockchain Dev', role: blockchainDev._id, company: 'Binance', location: 'Remote', salaryRange: ' - ', link: 'https://binance.com' },
            { title: 'AI Analyst', role: mlEngineer._id, company: 'Google', location: 'London', salaryRange: ' - ', link: 'https://google.com' }
        ]);

        console.log(' Success: All Streams, Sub-domains, and Courses Seeded!');
        process.exit();
    } catch (err) {
        console.error(' Seeding Error:', err);
        process.exit(1);
    }
};

seedData();
