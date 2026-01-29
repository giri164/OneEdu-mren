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
            password: 'admin12345',
            role: 'admin'
        });
        // 1. CSE Stream
        const cse = await Stream.create({
            name: 'Computer Science & Engineering',
            description: 'Focuses on software development, AI, Cyber Security, and IoT systems.',
            logo: 'https://cdn-icons-png.flaticon.com/512/14/14532.png'
        });
        // 2. Mechanical Stream
        const mechanical = await Stream.create({
            name: 'Mechanical Engineering',
            description: 'Design, manufacturing, and maintenance of mechanical systems and robotics.',
            logo: 'https://cdn-icons-png.flaticon.com/512/921/921276.png'
        });
        // 3. Civil Stream
        const civil = await Stream.create({
            name: 'Civil Engineering',
            description: 'Infrastructure, construction management, and urban development.',
            logo: 'https://cdn-icons-png.flaticon.com/512/1524/1524863.png'
        });
        // 4. Electronics & Communication
        const ece = await Stream.create({
            name: 'Electronics & Communication Engineering',
            description: 'Embedded systems, communication networks, and VLSI design.',
            logo: 'https://cdn-icons-png.flaticon.com/512/2921/2921222.png'
        });
        // 5. Electrical & Electronics
        const eee = await Stream.create({
            name: 'Electrical & Electronics Engineering',
            description: 'Power systems, smart grid, and renewable integration.',
            logo: 'https://cdn-icons-png.flaticon.com/512/3589/3589592.png'
        });
        // --- CSE SUB-DOMAINS ---
        const cseAIML = await SubDomain.create({
            name: 'CSE - AI & Machine Learning',
            stream: cse._id,
            description: 'Neural Networks, Deep Learning, and Predictive AI systems.',
            logo: 'https://cdn-icons-png.flaticon.com/512/3143/3143615.png',
            recommendedCertifications: [
                { name: 'TensorFlow Developer', issuer: 'Google', level: 'Intermediate', examUrl: 'https://www.tensorflow.org/certificate', fee: '$100' },
                { name: 'AWS ML Specialty', issuer: 'AWS', level: 'Advanced', examUrl: 'https://aws.amazon.com/certification/certified-machine-learning-specialty/', fee: '$300' },
                { name: 'Azure AI Engineer', issuer: 'Microsoft', level: 'Intermediate', examUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-engineer/', fee: '$165' },
                { name: 'DataRobot AutoML Cert', issuer: 'DataRobot', level: 'Intermediate', examUrl: 'https://www.datarobot.com', fee: 'Free' },
                { name: 'Google Professional Data Engineer', issuer: 'Google', level: 'Advanced', examUrl: 'https://cloud.google.com/certification/data-engineer', fee: '$200' }
            ]
        });
        const cseDataScience = await SubDomain.create({
            name: 'CSE - Data Science',
            stream: cse._id,
            description: 'Big Data Analytics, Statistical Modeling, and Business Intelligence.',
            logo: 'https://cdn-icons-png.flaticon.com/512/4436/4436481.png',
            recommendedCertifications: [
                { name: 'Databricks Data Engineer Associate', issuer: 'Databricks', level: 'Intermediate', examUrl: 'https://www.databricks.com/learn/certification', fee: '$200' },
                { name: 'IBM Data Science Professional', issuer: 'IBM', level: 'Beginner', examUrl: 'https://www.coursera.org/professional-certificates/ibm-data-science', fee: '$39/mo' },
                { name: 'Google Data Analytics', issuer: 'Google', level: 'Beginner', examUrl: 'https://grow.google/dataanalytics/', fee: '$39/mo' },
                { name: 'Microsoft DP-900', issuer: 'Microsoft', level: 'Beginner', examUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-data-fundamentals/', fee: '$99' }
            ]
        });
        const cseCyber = await SubDomain.create({
            name: 'CSE - Cyber Security',
            stream: cse._id,
            logo: 'https://cdn-icons-png.flaticon.com/512/1680/1680403.png',
            description: 'Network Defense, Ethical Hacking, and Blockchain Technology.',
            recommendedCertifications: [
                { name: 'CEH v12', issuer: 'EC-Council', level: 'Intermediate', examUrl: 'https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/', fee: '$1199' },
                { name: 'CompTIA Security+', issuer: 'CompTIA', level: 'Beginner', examUrl: 'https://www.comptia.org/certifications/security', fee: '$404' },
                { name: 'CISSP', issuer: '(ISC)²', level: 'Advanced', examUrl: 'https://www.isc2.org/certifications/cissp', fee: '$749' },
                { name: 'OSCP', issuer: 'OffSec', level: 'Advanced', examUrl: 'https://www.offsec.com/courses/pen-200/', fee: '$1599' },
                { name: 'AZ-500 Security Engineer', issuer: 'Microsoft', level: 'Intermediate', examUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-security-engineer/', fee: '$165' }
            ]
        });
        const cseIoT = await SubDomain.create({
            name: 'CSE - Internet of Things',
            stream: cse._id,
            logo: 'https://cdn-icons-png.flaticon.com/512/3050/3050159.png',
            description: 'Smart Devices, Embedded Systems, and Connected Infrastructure.',
            recommendedCertifications: [
                { name: 'Cisco DevNet Associate', issuer: 'Cisco', level: 'Intermediate', examUrl: 'https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/devnet.html', fee: '$300' },
                { name: 'AWS IoT Core Specialty', issuer: 'AWS', level: 'Intermediate', examUrl: 'https://aws.amazon.com/iot/', fee: '$300' },
                { name: 'Azure IoT Developer AZ-220', issuer: 'Microsoft', level: 'Intermediate', examUrl: 'https://learn.microsoft.com/en-us/credentials/certifications/azure-iot-developer-specialty/', fee: '$165' },
                { name: 'Embedded Systems Professional', issuer: 'NXP', level: 'Intermediate', examUrl: 'https://www.nxp.com', fee: 'Varies' }
            ]
        });
        // --- ROLES & COURSES: CYBER SECURITY (Blockchain focus) ---
        const blockchainDev = await Role.create({
            title: 'Blockchain Developer',
            subDomain: cseCyber._id,
            skills: ['Blockchain', 'Solidity', 'Web3'],
            description: 'Build decentralized user applications and secure smart contracts.'
        });
        await Course.create([
            {
                title: 'Blockchain Fundamentals',
                skill: 'Blockchain',
                type: 'Free',
                provider: 'YouTube',
                duration: '5 hours',
                durationLabel: '5h • video',
                level: 'Beginner',
                link: 'https://www.youtube.com/watch?v=SSo_EIwHSd4',
                description: 'Concepts of DLT and Consensus.',
                certificateLinks: [
                    { label: 'Intro Badge', url: 'https://example.com/cert/blockchain-intro' }
                ],
                videoLinks: [
                    { title: 'Consensus Deep Dive', url: 'https://www.youtube.com/watch?v=OSrG9Q-s0J8' }
                ],
                targetCompanies: ['Coinbase', 'Binance'],
                role: blockchainDev._id,
                subDomain: cseCyber._id,
                stream: cse._id
            },
            {
                title: 'Full Solidity Course',
                skill: 'Solidity',
                type: 'Paid',
                provider: 'Udemy',
                duration: '20 hours',
                durationLabel: '20h • project based',
                level: 'Intermediate',
                link: 'https://www.udemy.com/course/ethereum-and-solidity-the-complete-developers-guide/',
                description: 'Ethereum Smart Contract development.',
                certificateLinks: [
                    { label: 'Smart Contracts Cert', url: 'https://example.com/cert/solidity-pro' }
                ],
                videoLinks: [
                    { title: 'Gas Optimization Tips', url: 'https://www.youtube.com/watch?v=Z0YTZ7f1RkA' }
                ],
                targetCompanies: ['Consensys', 'Chainlink Labs'],
                role: blockchainDev._id,
                subDomain: cseCyber._id,
                stream: cse._id
            },
            {
                title: 'Web3 & React DApps',
                skill: 'Web3',
                type: 'Paid',
                provider: 'Udemy',
                duration: '12 hours',
                durationLabel: '12h • hands-on',
                level: 'Intermediate',
                link: 'https://www.udemy.com/course/web3-dapp-programming-with-react/',
                description: 'Connect frontend to Blockchain.',
                certificateLinks: [
                    { label: 'DApp Builder', url: 'https://example.com/cert/dapp-builder' }
                ],
                videoLinks: [
                    { title: 'Wallet Integration', url: 'https://www.youtube.com/watch?v=5g2QF5Jz2Hk' }
                ],
                targetCompanies: ['Uniswap Labs', 'OpenSea'],
                role: blockchainDev._id,
                subDomain: cseCyber._id,
                stream: cse._id
            }
        ]);
        // --- ROLES & COURSES: AI & ML ---
        const mlEngineer = await Role.create({
            title: 'Machine Learning Engineer',
            subDomain: cseAIML._id,
            skills: ['Python', 'Machine Learning', 'TensorFlow'],
            description: 'Design and deploy AI models for production.'
        });
        await Course.create([
            {
                title: 'Python for AI',
                skill: 'Python',
                type: 'Free',
                provider: 'YouTube',
                duration: '10 hours',
                durationLabel: '10h • video',
                level: 'Beginner',
                link: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI',
                description: 'Python programming essentials for AI.',
                certificateLinks: [
                    { label: 'Foundations Badge', url: 'https://example.com/cert/python-ai' }
                ],
                videoLinks: [
                    { title: 'NumPy Crash', url: 'https://www.youtube.com/watch?v=8Mpc9ukltVA' }
                ],
                targetCompanies: ['Google', 'NVIDIA'],
                role: mlEngineer._id,
                subDomain: cseAIML._id,
                stream: cse._id
            },
            {
                title: 'ML A-Z Certification',
                skill: 'Machine Learning',
                type: 'Paid',
                provider: 'Udemy',
                duration: '40 hours',
                durationLabel: '40h • cohort',
                level: 'Intermediate',
                link: 'https://www.udemy.com/course/machine-learning-a-z/',
                description: 'Complete ML bootcamp.',
                certificateLinks: [
                    { label: 'ML Practitioner', url: 'https://example.com/cert/ml-practitioner' }
                ],
                videoLinks: [
                    { title: 'Feature Engineering', url: 'https://www.youtube.com/watch?v=g9c66TUylZ4' }
                ],
                targetCompanies: ['Meta', 'Airbnb'],
                role: mlEngineer._id,
                subDomain: cseAIML._id,
                stream: cse._id
            },
            {
                title: 'TensorFlow for Beginners',
                skill: 'TensorFlow',
                type: 'Free',
                provider: 'TensorFlow.org',
                duration: 'Self-paced',
                durationLabel: 'Self-paced • labs',
                level: 'Beginner',
                link: 'https://www.tensorflow.org/tutorials',
                description: 'Official deep learning tutorials.',
                certificateLinks: [
                    { label: 'TensorFlow Badge', url: 'https://example.com/cert/tf-badge' }
                ],
                videoLinks: [
                    { title: 'Keras Quickstart', url: 'https://www.youtube.com/watch?v=tPYj3fFJGjk' }
                ],
                targetCompanies: ['DeepMind', 'OpenAI'],
                role: mlEngineer._id,
                subDomain: cseAIML._id,
                stream: cse._id
            }
        ]);
        // --- ROLES & COURSES: DATA SCIENCE ---
        const dataScientist = await Role.create({
            title: 'Data Scientist',
            subDomain: cseDataScience._id,
            skills: ['Statistics', 'SQL', 'Pandas'],
            description: 'Analyze complex data to drive business decisions.'
        });

        await Course.create([
            {
                title: 'Practical Statistics',
                skill: 'Statistics',
                type: 'Paid',
                provider: 'Coursera',
                duration: '4 weeks',
                durationLabel: '4w • guided',
                level: 'Intermediate',
                link: 'https://www.coursera.org/learn/probability-statistics',
                description: 'Statistical foundations for data science.',
                certificateLinks: [
                    { label: 'Stats for DS', url: 'https://example.com/cert/stats-ds' }
                ],
                videoLinks: [
                    { title: 'p-values explained', url: 'https://www.youtube.com/watch?v=5koKb5B_XYg' }
                ],
                targetCompanies: ['Netflix', 'Lyft'],
                role: dataScientist._id,
                subDomain: cseDataScience._id,
                stream: cse._id
            },
            {
                title: 'SQL Mastery',
                skill: 'SQL',
                type: 'Free',
                provider: 'YouTube',
                duration: '6 hours',
                durationLabel: '6h • hands-on',
                level: 'Beginner',
                link: 'https://www.youtube.com/watch?v=HXV3zeQKqGY',
                description: 'Advanced SQL queries and modeling.',
                certificateLinks: [
                    { label: 'SQL Badge', url: 'https://example.com/cert/sql-badge' }
                ],
                videoLinks: [
                    { title: 'Indexing basics', url: 'https://www.youtube.com/watch?v=HubezKbFL7E' }
                ],
                targetCompanies: ['Snowflake', 'Databricks'],
                role: dataScientist._id,
                subDomain: cseDataScience._id,
                stream: cse._id
            }
        ]);
        // --- ROLES & COURSES: IOT ---
        const iotEngineer = await Role.create({
            title: 'IoT System Architect',
            subDomain: cseIoT._id,
            skills: ['Embedded C', 'Arduino', 'MQTT'],
            description: 'Design end-to-end IoT ecosystems.'
        });
        await Course.create([
            {
                title: 'Arduino for Beginners',
                skill: 'Arduino',
                type: 'Free',
                provider: 'YouTube',
                duration: '8 hours',
                durationLabel: '8h • lab heavy',
                level: 'Beginner',
                link: 'https://www.youtube.com/watch?v=zJ-LqeX_fLU',
                description: 'Microcontroller programming basics.',
                certificateLinks: [
                    { label: 'Arduino Foundations', url: 'https://example.com/cert/arduino-foundations' }
                ],
                videoLinks: [
                    { title: 'Sensor wiring', url: 'https://www.youtube.com/watch?v=MlNwXuY6p0s' }
                ],
                targetCompanies: ['Bosch', 'Siemens'],
                role: iotEngineer._id,
                subDomain: cseIoT._id,
                stream: cse._id
            },
            {
                title: 'Embedded Systems with C',
                skill: 'Embedded C',
                type: 'Paid',
                provider: 'Udemy',
                duration: '15 hours',
                durationLabel: '15h • project',
                level: 'Intermediate',
                link: 'https://www.udemy.com/course/embedded-c-programming/',
                description: 'Low-level hardware programming.',
                certificateLinks: [
                    { label: 'Embedded C Cert', url: 'https://example.com/cert/embedded-c' }
                ],
                videoLinks: [
                    { title: 'RTOS intro', url: 'https://www.youtube.com/watch?v=jndN2Rr-4x0' }
                ],
                targetCompanies: ['Texas Instruments', 'Qualcomm'],
                role: iotEngineer._id,
                subDomain: cseIoT._id,
                stream: cse._id
            }
        ]);
        // --- MECHANICAL SUB-DOMAINS ---
        const mechAutomotive = await SubDomain.create({
            name: 'MECH - Automotive Systems',
            stream: mechanical._id,
            description: 'Vehicle dynamics, powertrain design, and CAD for automotive systems.',
            logo: 'https://cdn-icons-png.flaticon.com/512/744/744447.png'
        });

        const mechRobotics = await SubDomain.create({
            name: 'MECH - Robotics & Automation',
            stream: mechanical._id,
            description: 'Industrial robots, kinematics, and control systems.',
            logo: 'https://cdn-icons-png.flaticon.com/512/924/924514.png'
        });

        const automotiveEngineer = await Role.create({
            title: 'Automotive Engineer',
            subDomain: mechAutomotive._id,
            skills: ['CAD', 'Powertrain', 'FEA'],
            description: 'Design and validate vehicle systems and components.'
        });

        const roboticsEngineer = await Role.create({
            title: 'Robotics Engineer',
            subDomain: mechRobotics._id,
            skills: ['Kinematics', 'ROS', 'Control Systems'],
            description: 'Develop robotic cells, controls, and automation scripts.'
        });
        await Course.create([
            {
                title: 'Automotive CAD with CATIA',
                skill: 'CAD',
                type: 'Paid',
                provider: 'Udemy',
                duration: '18 hours',
                durationLabel: '18h • projects',
                level: 'Intermediate',
                link: 'https://www.udemy.com/course/catia-v5-complete-course/',
                description: 'Model and assemble automotive components using CATIA.',
                certificateLinks: [{ label: 'CATIA Associate', url: 'https://example.com/cert/catia-associate' }],
                videoLinks: [{ title: 'Surface modeling tips', url: 'https://www.youtube.com/watch?v=13mMnRTucj8' }],
                targetCompanies: ['Bosch', 'Valeo'],
                role: automotiveEngineer._id,
                subDomain: mechAutomotive._id,
                stream: mechanical._id,
                isFeatured: true
            },
            {
                title: 'Vehicle Dynamics Fundamentals',
                skill: 'Powertrain',
                type: 'Free',
                provider: 'YouTube',
                duration: '6 hours',
                durationLabel: '6h • video',
                level: 'Beginner',
                link: 'https://www.youtube.com/watch?v=vEih0XW8Xq8',
                description: 'Suspension, braking, and handling basics.',
                certificateLinks: [{ label: 'Dynamics Badge', url: 'https://example.com/cert/dynamics' }],
                videoLinks: [{ title: 'Suspension tuning', url: 'https://www.youtube.com/watch?v=3qVcR8ZqF5Q' }],
                targetCompanies: ['Mahindra', 'Tata Motors'],
                role: automotiveEngineer._id,
                subDomain: mechAutomotive._id,
                stream: mechanical._id
            },
            {
                title: 'ROS for Industrial Robots',
                skill: 'ROS',
                type: 'Free',
                provider: 'YouTube',
                duration: '8 hours',
                durationLabel: '8h • labs',
                level: 'Intermediate',
                link: 'https://www.youtube.com/watch?v=8HyCNIVRbSU',
                description: 'Build and simulate robotic arms with ROS.',
                certificateLinks: [{ label: 'ROS Foundations', url: 'https://example.com/cert/ros' }],
                videoLinks: [{ title: 'ROS MoveIt intro', url: 'https://www.youtube.com/watch?v=NmA-DuMJt3E' }],
                targetCompanies: ['ABB', 'Fanuc'],
                role: roboticsEngineer._id,
                subDomain: mechRobotics._id,
                stream: mechanical._id,
                isFeatured: true
            },
            {
                title: 'Control Systems with MATLAB',
                skill: 'Control Systems',
                type: 'Paid',
                provider: 'Coursera',
                duration: '20 hours',
                durationLabel: '20h • guided',
                level: 'Intermediate',
                link: 'https://www.coursera.org/learn/intro-control-systems',
                description: 'Model and tune controllers for dynamic systems.',
                certificateLinks: [{ label: 'Control Systems Cert', url: 'https://example.com/cert/control' }],
                videoLinks: [{ title: 'PID tuning', url: 'https://www.youtube.com/watch?v=wkfEZmsQqiA' }],
                targetCompanies: ['Siemens', 'Rockwell Automation'],
                role: roboticsEngineer._id,
                subDomain: mechRobotics._id,
                stream: mechanical._id
            }
        ]);
        // --- CIVIL SUB-DOMAINS ---
        const civilStructural = await SubDomain.create({
            name: 'CIVIL - Structural Engineering',
            stream: civil._id,
            description: 'Analysis and design of load-bearing structures.',
            logo: 'https://cdn-icons-png.flaticon.com/512/1524/1524854.png'
        });

        const civilTransport = await SubDomain.create({
            name: 'CIVIL - Transportation Systems',
            stream: civil._id,
            description: 'Highway geometrics, transit planning, and traffic modeling.',
            logo: 'https://cdn-icons-png.flaticon.com/512/2913/2913152.png'
        });

        const structuralEngineer = await Role.create({
            title: 'Structural Engineer',
            subDomain: civilStructural._id,
            skills: ['ETABS', 'Revit', 'Steel Design'],
            description: 'Model, analyze, and detail buildings and bridges.'
        });

        const transportPlanner = await Role.create({
            title: 'Transportation Planner',
            subDomain: civilTransport._id,
            skills: ['VISSIM', 'GIS', 'Traffic Modeling'],
            description: 'Plan mobility networks and optimize traffic flows.'
        });
        await Course.create([
            {
                title: 'ETABS for High-Rise',
                skill: 'ETABS',
                type: 'Paid',
                provider: 'Udemy',
                duration: '14 hours',
                durationLabel: '14h • projects',
                level: 'Intermediate',
                link: 'https://www.udemy.com/course/etabs-complete-building-design/',
                description: 'Concrete building analysis with ETABS.',
                certificateLinks: [{ label: 'ETABS Designer', url: 'https://example.com/cert/etabs' }],
                videoLinks: [{ title: 'Seismic checks', url: 'https://www.youtube.com/watch?v=Vz5vWckHQwE' }],
                targetCompanies: ['AECOM', 'WSP'],
                role: structuralEngineer._id,
                subDomain: civilStructural._id,
                stream: civil._id,
                isFeatured: true
            },
            {
                title: 'Revit Structural Detailing',
                skill: 'Revit',
                type: 'Free',
                provider: 'YouTube',
                duration: '7 hours',
                durationLabel: '7h • hands-on',
                level: 'Beginner',
                link: 'https://www.youtube.com/watch?v=Khmw1jzOopg',
                description: 'BIM workflows for structural detailing.',
                certificateLinks: [{ label: 'BIM Starter', url: 'https://example.com/cert/bim' }],
                videoLinks: [{ title: 'Families 101', url: 'https://www.youtube.com/watch?v=hvETrQ9q70U' }],
                targetCompanies: ['Arup', 'Jacobs'],
                role: structuralEngineer._id,
                subDomain: civilStructural._id,
                stream: civil._id
            },
            {
                title: 'Traffic Simulation with VISSIM',
                skill: 'VISSIM',
                type: 'Paid',
                provider: 'Udemy',
                duration: '9 hours',
                durationLabel: '9h • simulation',
                level: 'Intermediate',
                link: 'https://www.udemy.com/course/vissim-traffic-simulation/',
                description: 'Microsimulation for intersections and corridors.',
                certificateLinks: [{ label: 'Traffic Modeler', url: 'https://example.com/cert/vissim' }],
                videoLinks: [{ title: 'Signal timing', url: 'https://www.youtube.com/watch?v=aaMylcQJUO0' }],
                targetCompanies: ['Atkins', 'HDR'],
                role: transportPlanner._id,
                subDomain: civilTransport._id,
                stream: civil._id,
                isFeatured: true
            },
            {
                title: 'GIS for Urban Planning',
                skill: 'GIS',
                type: 'Free',
                provider: 'YouTube',
                duration: '5 hours',
                durationLabel: '5h • labs',
                level: 'Beginner',
                link: 'https://www.youtube.com/watch?v=QEI2Cj2xGvA',
                description: 'Spatial analysis for transport demand.',
                certificateLinks: [{ label: 'GIS Analyst', url: 'https://example.com/cert/gis' }],
                videoLinks: [{ title: 'QGIS basics', url: 'https://www.youtube.com/watch?v=kCnNWyl9qSE' }],
                targetCompanies: ['Esri', 'Stantec'],
                role: transportPlanner._id,
                subDomain: civilTransport._id,
                stream: civil._id
            }
        ]);
        // --- ECE SUB-DOMAINS ---
        const eceEmbedded = await SubDomain.create({
            name: 'ECE - Embedded Systems',
            stream: ece._id,
            description: 'Microcontroller programming and PCB design.',
            logo: 'https://cdn-icons-png.flaticon.com/512/2913/2913097.png'
        });

        const eceWireless = await SubDomain.create({
            name: 'ECE - Communication Systems',
            stream: ece._id,
            description: 'Wireless protocols, SDR, and signal processing.',
            logo: 'https://cdn-icons-png.flaticon.com/512/1587/1587566.png'
        });

        const embeddedFirmware = await Role.create({
            title: 'Embedded Firmware Engineer',
            subDomain: eceEmbedded._id,
            skills: ['C', 'RTOS', 'PCB Bring-up'],
            description: 'Build firmware for microcontrollers and edge devices.'
        });

        const rfEngineer = await Role.create({
            title: 'RF Engineer',
            subDomain: eceWireless._id,
            skills: ['SDR', '5G', 'Signal Processing'],
            description: 'Design and test wireless front-ends and protocols.'
        });
        await Course.create([
            {
                title: 'FreeRTOS on STM32',
                skill: 'RTOS',
                type: 'Paid',
                provider: 'Udemy',
                duration: '11 hours',
                durationLabel: '11h • labs',
                level: 'Intermediate',
                link: 'https://www.udemy.com/course/freertos-on-stm32/',
                description: 'Tasks, queues, and drivers on Cortex-M.',
                certificateLinks: [{ label: 'RTOS Practitioner', url: 'https://example.com/cert/rtos' }],
                videoLinks: [{ title: 'ISR best practices', url: 'https://www.youtube.com/watch?v=bCL4pReJCgw' }],
                targetCompanies: ['STMicro', 'NXP'],
                role: embeddedFirmware._id,
                subDomain: eceEmbedded._id,
                stream: ece._id,
                isFeatured: true
            },
            {
                title: 'PCB Bring-up and JTAG Debug',
                skill: 'PCB Bring-up',
                type: 'Free',
                provider: 'YouTube',
                duration: '4 hours',
                durationLabel: '4h • practical',
                level: 'Beginner',
                link: 'https://www.youtube.com/watch?v=5g8A2H6G4pQ',
                description: 'Power sequencing, boot configs, and debugging.',
                certificateLinks: [{ label: 'Hardware Debug Badge', url: 'https://example.com/cert/bringup' }],
                videoLinks: [{ title: 'Oscilloscope essentials', url: 'https://www.youtube.com/watch?v=Q1lqzBNZ_v4' }],
                targetCompanies: ['Qualcomm', 'Apple'],
                role: embeddedFirmware._id,
                subDomain: eceEmbedded._id,
                stream: ece._id
            },
            {
                title: 'Software Defined Radio with GNU Radio',
                skill: 'SDR',
                type: 'Paid',
                provider: 'Coursera',
                duration: '16 hours',
                durationLabel: '16h • labs',
                level: 'Intermediate',
                link: 'https://www.coursera.org/learn/sdr',
                description: 'Modulation, filtering, and spectrum analysis.',
                certificateLinks: [{ label: 'SDR Specialist', url: 'https://example.com/cert/sdr' }],
                videoLinks: [{ title: 'OFDM basics', url: 'https://www.youtube.com/watch?v=b1hTG_3RbFY' }],
                targetCompanies: ['Ericsson', 'Nokia'],
                role: rfEngineer._id,
                subDomain: eceWireless._id,
                stream: ece._id,
                isFeatured: true
            },
            {
                title: '5G NR Protocols',
                skill: '5G',
                type: 'Free',
                provider: 'YouTube',
                duration: '6 hours',
                durationLabel: '6h • theory',
                level: 'Intermediate',
                link: 'https://www.youtube.com/watch?v=g3Ih9yNUFfE',
                description: 'RAN architecture, numerology, and PHY/MAC.',
                certificateLinks: [{ label: '5G Associate', url: 'https://example.com/cert/5g' }],
                videoLinks: [{ title: 'Beamforming intro', url: 'https://www.youtube.com/watch?v=JwDMbY9y1w0' }],
                targetCompanies: ['Samsung Networks', 'Jio'],
                role: rfEngineer._id,
                subDomain: eceWireless._id,
                stream: ece._id
            }
        ]);
        // --- EEE SUB-DOMAINS ---
        const eeePower = await SubDomain.create({
            name: 'EEE - Power Systems',
            stream: eee._id,
            description: 'Transmission, distribution, and grid stability.',
            logo: 'https://cdn-icons-png.flaticon.com/512/2913/2913137.png'
        });

        const eeeRenewable = await SubDomain.create({
            name: 'EEE - Renewable & Smart Grid',
            stream: eee._id,
            description: 'Solar, wind integration, and smart meters.',
            logo: 'https://cdn-icons-png.flaticon.com/512/3050/3050159.png'
        });

        const powerEngineer = await Role.create({
            title: 'Power Systems Engineer',
            subDomain: eeePower._id,
            skills: ['PowerWorld', 'Protection', 'SCADA'],
            description: 'Model and protect transmission and distribution networks.'
        });

        const renewableAnalyst = await Role.create({
            title: 'Renewable Energy Analyst',
            subDomain: eeeRenewable._id,
            skills: ['PV Design', 'Wind Modeling', 'Smart Metering'],
            description: 'Design hybrid renewable systems and monitor grid performance.'
        });

        await Course.create([
            {
                title: 'Power System Analysis with PowerWorld',
                skill: 'PowerWorld',
                type: 'Paid',
                provider: 'Udemy',
                duration: '12 hours',
                durationLabel: '12h • cases',
                level: 'Intermediate',
                link: 'https://www.udemy.com/course/powerworld-simulator/',
                description: 'Load flow, contingencies, and stability studies.',
                certificateLinks: [{ label: 'Grid Analyst', url: 'https://example.com/cert/powerworld' }],
                videoLinks: [{ title: 'Fault analysis', url: 'https://www.youtube.com/watch?v=7P0Cdm42HcM' }],
                targetCompanies: ['GE Grid', 'Siemens Energy'],
                role: powerEngineer._id,
                subDomain: eeePower._id,
                stream: eee._id,
                isFeatured: true
            },
            {
                title: 'Protection & Relays Basics',
                skill: 'Protection',
                type: 'Free',
                provider: 'YouTube',
                duration: '5 hours',
                durationLabel: '5h • fundamentals',
                level: 'Beginner',
                link: 'https://www.youtube.com/watch?v=QmZ6z6kPrJQ',
                description: 'OC, differential, and distance protection concepts.',
                certificateLinks: [{ label: 'Relay Basics', url: 'https://example.com/cert/relays' }],
                videoLinks: [{ title: 'Distance relay zones', url: 'https://www.youtube.com/watch?v=t24Yy7sY9Wk' }],
                targetCompanies: ['ABB', 'Schneider Electric'],
                role: powerEngineer._id,
                subDomain: eeePower._id,
                stream: eee._id
            },
            {
                title: 'Solar PV Design with PVSyst',
                skill: 'PV Design',
                type: 'Paid',
                provider: 'Coursera',
                duration: '15 hours',
                durationLabel: '15h • labs',
                level: 'Intermediate',
                link: 'https://www.coursera.org/learn/solar-energy-design',
                description: 'Size and simulate PV plants with shading and losses.',
                certificateLinks: [{ label: 'PV Designer', url: 'https://example.com/cert/pv' }],
                videoLinks: [{ title: 'String sizing', url: 'https://www.youtube.com/watch?v=9XqU5Wyd4a0' }],
                targetCompanies: ['SunPower', 'Adani Green'],
                role: renewableAnalyst._id,
                subDomain: eeeRenewable._id,
                stream: eee._id,
                isFeatured: true
            },
            {
                title: 'Smart Metering & AMI',
                skill: 'Smart Metering',
                type: 'Free',
                provider: 'YouTube',
                duration: '4 hours',
                durationLabel: '4h • overview',
                level: 'Beginner',
                link: 'https://www.youtube.com/watch?v=Hf56k97X3-Y',
                description: 'AMI architecture, DLMS/COSEM, and data pipelines.',
                certificateLinks: [{ label: 'AMI Basics', url: 'https://example.com/cert/ami' }],
                videoLinks: [{ title: 'DLMS in practice', url: 'https://www.youtube.com/watch?v=7v6kBxKuXZY' }],
                targetCompanies: ['Landis+Gyr', 'Itron'],
                role: renewableAnalyst._id,
                subDomain: eeeRenewable._id,
                stream: eee._id
            }
        ]);
        // --- JOBS DATA ---
        await Job.create([
            {
                title: 'Blockchain Dev',
                role: blockchainDev._id,
                company: 'Binance',
                location: 'Remote',
                salaryRange: '$90k-$140k',
                link: 'https://binance.com',
                description: 'Build and audit smart contracts; own on-chain integrations.'
            },
            {
                title: 'Smart Contract Auditor',
                role: blockchainDev._id,
                company: 'OpenZeppelin',
                location: 'Remote',
                salaryRange: '$110k-$170k',
                link: 'https://www.openzeppelin.com/careers',
                description: 'Threat-model and audit DeFi protocols; write formal proofs.'
            },
            {
                title: 'Web3 Security Engineer',
                role: blockchainDev._id,
                company: 'Trail of Bits',
                location: 'NYC / Remote',
                salaryRange: '$130k-$190k',
                link: 'https://www.trailofbits.com/careers',
                description: 'Review smart contracts, fuzzing, and incident response.'
            },
            {
                title: 'AI Analyst',
                role: mlEngineer._id,
                company: 'Google',
                location: 'London',
                salaryRange: '$70k-$110k',
                link: 'https://google.com',
                description: 'Prototype and ship ML models for ads quality.'
            },
            {
                title: 'Machine Learning Engineer',
                role: mlEngineer._id,
                company: 'Airbnb',
                location: 'San Francisco, CA',
                salaryRange: '$150k-$210k',
                link: 'https://careers.airbnb.com',
                description: 'Deliver ranking and personalization models at scale.'
            },
            {
                title: 'Applied Scientist',
                role: mlEngineer._id,
                company: 'Amazon',
                location: 'Seattle, WA',
                salaryRange: '$160k-$230k',
                link: 'https://www.amazon.jobs',
                description: 'Own end-to-end ML pipelines for search and ads.'
            },
            {
                title: 'Data Scientist',
                role: dataScientist._id,
                company: 'Netflix',
                location: 'Los Gatos, CA',
                salaryRange: '$150k-$210k',
                link: 'https://jobs.netflix.com',
                description: 'Experiment design and causal inference for personalization.'
            },
            {
                title: 'Senior Data Scientist',
                role: dataScientist._id,
                company: 'Spotify',
                location: 'Stockholm, SE',
                salaryRange: '$80k-$130k',
                link: 'https://www.lifeatspotify.com',
                description: 'Model user behavior to improve discovery and retention.'
            },
            {
                title: 'Analytics Engineer',
                role: dataScientist._id,
                company: 'Snowflake',
                location: 'San Mateo, CA',
                salaryRange: '$140k-$190k',
                link: 'https://www.snowflake.com/careers/',
                description: 'Build metrics layers and data models for product analytics.'
            },
            {
                title: 'IoT Systems Engineer',
                role: iotEngineer._id,
                company: 'Bosch',
                location: 'Stuttgart, DE',
                salaryRange: '$70k-$100k',
                link: 'https://www.bosch.com/careers/',
                description: 'Design secure firmware and telemetry pipelines.'
            },
            {
                title: 'Embedded IoT Developer',
                role: iotEngineer._id,
                company: 'Siemens',
                location: 'Munich, DE',
                salaryRange: '$65k-$95k',
                link: 'https://jobs.siemens.com',
                description: 'Develop edge compute apps, OTA updates, and device security.'
            },
            {
                title: 'IoT Cloud Engineer',
                role: iotEngineer._id,
                company: 'AWS',
                location: 'Dublin, IE',
                salaryRange: '$80k-$120k',
                link: 'https://aws.amazon.com/careers/',
                description: 'Build device onboarding, fleet mgmt, and observability.'
            },
            {
                title: 'Automotive CAE Engineer',
                role: automotiveEngineer._id,
                company: 'Mercedes-Benz',
                location: 'Bangalore, IN',
                salaryRange: '$12L-$20L',
                link: 'https://group.mercedes-benz.com/careers/',
                description: 'Simulate chassis and validate durability.'
            },
            {
                title: 'Robotics Automation Engineer',
                role: roboticsEngineer._id,
                company: 'ABB',
                location: 'Helsinki, FI',
                salaryRange: '$60k-$90k',
                link: 'https://careers.abb',
                description: 'Deploy robotic cells and safety logic.'
            },
            {
                title: 'Structural Engineer',
                role: structuralEngineer._id,
                company: 'WSP',
                location: 'Toronto, CA',
                salaryRange: '$80k-$120k',
                link: 'https://www.wsp.com/en-ca/careers',
                description: 'Lead steel and concrete member design.'
            },
            {
                title: 'Transportation Planner',
                role: transportPlanner._id,
                company: 'Atkins',
                location: 'Doha, QA',
                salaryRange: '$70k-$110k',
                link: 'https://careers.snclavalin.com',
                description: 'Develop corridor studies and microsimulations.'
            },
            {
                title: 'Embedded Firmware Engineer',
                role: embeddedFirmware._id,
                company: 'NXP',
                location: 'Eindhoven, NL',
                salaryRange: '$55k-$85k',
                link: 'https://www.nxp.com/company/careers',
                description: 'Develop RTOS drivers and secure boot.'
            },
            {
                title: 'RF Systems Engineer',
                role: rfEngineer._id,
                company: 'Ericsson',
                location: 'Stockholm, SE',
                salaryRange: '$60k-$95k',
                link: 'https://www.ericsson.com/en/careers',
                description: 'Prototype 5G radio features and validate KPIs.'
            },
            {
                title: 'Power Systems Engineer',
                role: powerEngineer._id,
                company: 'Siemens Energy',
                location: 'Munich, DE',
                salaryRange: '$65k-$100k',
                link: 'https://jobs.siemens-energy.com',
                description: 'Perform load flow and protection coordination.'
            },
            {
                title: 'Renewable Energy Analyst',
                role: renewableAnalyst._id,
                company: 'ENGIE',
                location: 'Paris, FR',
                salaryRange: '$55k-$90k',
                link: 'https://www.engie.com/en/candidates',
                description: 'Model hybrid solar-wind storage portfolios.'
            }
        ]);
        console.log(' Success: All Streams, Sub-domains, and Courses Seeded!');
        process.exit();
    } catch (err) {
        console.error(' Seeding Error:', err);
        process.exit(1);
    }
};
seedData();