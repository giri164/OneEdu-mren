# OneEdu – Smart Career Guidance & Job Tracking Platform

OneEdu is a centralized career guidance system designed to help Intermediate and B.Tech students choose suitable career paths by mapping streams, skills, learning resources, and job opportunities in a structured way.

## Features

### User Module
- **Authentication**: JWT-based login and registration.
- **Career Exploration**: Browse streams (CSE, IT, Mech, etc.) and discover sub-domains and roles.
- **Skill Roadmap**: View required skills for each role with curated free and paid courses.
- **Market Insights**: Track companies hiring for roles and salary ranges.
- **Progress Tracking**: Dashboard to track skill levels (Beginner, Intermediate, Advanced).
- **Feedback**: Share experience and suggestions.

### Admin Module
- **Management**: Add/Update/Delete streams, sub-domains, and career roles.
- **Link Quality**: Manage course links and job listings.
- **Analytics**: view all user feedback.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, Lucide React, Axios, React Router.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **Security**: JWT Authentication, Bcrypt password hashing.

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB installed and running locally

### Installation

1. **Clone the repository** (or navigate to the project folder).

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   # Create .env file if it doesn't exist (see .env.example)
   npm run seed  # To populate sample data
   npm start
   ```

3. **Setup Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application**:
   - Open [http://localhost:5173](http://localhost:5173) in your browser.

### Default Credentials
- **User**: Register a new account or use seeded data if available.
- **Admin**
