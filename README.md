# OneEdu - Career Guidance Platform

A comprehensive MERN stack application that provides career guidance, job matching, resume analysis, and skill gap analysis for students and professionals.

## 🚀 Features

### Core Features
- **Career Recommendations** - Get personalized career suggestions based on your skills and interests
- **Job Matching Algorithm** - Find jobs that match your profile with intelligent scoring
- **Resume Analyzer** - Resume analysis with detailed feedback
- **Skill Gap Analyzer** - Compare your skills with job requirements
- **Career Analytics Dashboard** - Track your progress with interactive charts
- **Smart Notifications** - Real-time alerts and updates
- **Modern UI** - Beautiful animations and glassmorphism design

### Technical Features
- **Service-Oriented Architecture** - Clean separation of business logic
- **Input Validation** - Zod schema validation for all API inputs
- **Real-time Features** - WebSocket-based notifications
- **Responsive Design** - Mobile-first approach with dark mode
- **Modern Animations** - Framer Motion for smooth interactions

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Zod** - Schema validation

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup

#### Backend Configuration
```bash
cd backend
cp .env.example .env
```

Edit `.env` file:
```env
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/oneedu
JWT_SECRET=your_super_secret_jwt_key_here
# OPENAI_API_KEY=your_openai_api_key_here  # Optional - remove if not using AI features
PORT=5000
FRONTEND_URL=http://localhost:5175
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:
```bash
# Using MongoDB Compass or mongod
mongod
```

### 4. Seed Database (Optional)

```bash
cd backend
node seeder.js
```

### 5. Start Development Servers

#### Terminal 1 - Backend
```bash
cd backend
npm start
# Server will run on http://localhost:5000
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
# App will run on http://localhost:5175
```

## 📁 Project Structure

```
oneedu/
├── backend/
│   ├── controllers/     # Route handlers
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── middleware/     # Custom middleware
│   ├── utils/          # Helper functions
│   ├── seeder.js       # Database seeder
│   └── index.js        # Server entry point
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── context/    # React context
│   │   ├── api/        # API configuration
│   │   └── assets/     # Static assets
│   ├── public/         # Public assets
│   └── index.html      # HTML template
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

#### User Management
- `GET /api/user/streams` - Get learning streams
- `GET /api/user/analytics` - Get career analytics
- `PUT /api/user/profile` - Update user profile

## 🎨 Key Components

### Frontend Components
- `AnimatedCard` - Modern card with animations
- `PageTransition` - Smooth page transitions
- `NotificationCenter` - Real-time notifications
- `CareerAnalytics` - Interactive dashboard

### Backend Services
- `UserService` - User management logic
- `NotificationService` - Notification handling

## 🚀 Deployment

### Production Build
```bash
# Frontend build
cd frontend
npm run build

# Backend build (if needed)
cd ../backend
npm run build
```

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_secure_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

Built as a university project expo submission with modern web technologies and AI integration.

---


4. **Access the application**:
   - Open [http://localhost:5173](http://localhost:5173) in your browser.

### Default Credentials
- **User**: Register a new account or use seeded data if available.

## Project Structure
- `/backend`: API server, models, controllers, and routes.
- `/frontend`: React client with Tailwind CSS and context-based state management.

# One-EDU-smart carrer  

