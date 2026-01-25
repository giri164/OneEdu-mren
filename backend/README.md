# OneEdu Backend - Smart Career Guidance Platform

This is the backend API for the OneEdu platform, built using the MERN stack (Node.js, Express, MongoDB).

## Tech Stack
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: NoSQL Database
- **Mongoose**: ODM for MongoDB
- **JWT**: For authentication
- **Bcryptjs**: For password hashing

## Project Structure
- `models/`: Mongoose schemas
- `controllers/`: Logic for handling requests
- `routes/`: API route definitions
- `middleware/`: Custom middleware (auth, protect)
- `index.js`: Entry point
- `seeder.js`: Script to populate sample data

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB installed and running locally

### Installation
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration
1. Create a `.env` file in the `backend` directory (one is already provided with defaults).
2. Update `MONGODB_URI` if your MongoDB is running elsewhere.

### Seeding Data
To populate the database with sample streams, roles, and an admin user:
```bash
npm run seed
```
- **Admin Email**: admin@oneedu.com
- **Admin Password**: password123

### Running the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Auth
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login user
- `GET /api/auth/me`: Get current user profile (Protected)

### User
- `GET /api/user/streams`: Get all education streams
- `PUT /api/user/profile`: Update user stream selection (Protected)
- `GET /api/user/career-path/:streamId`: Get subdomains for a stream (Protected)
- `GET /api/user/roles/:subdomainId`: Get roles for a subdomain (Protected)
- `GET /api/user/role-details/:roleId`: Get skills, courses, and jobs for a role (Protected)
- `POST /api/user/skill-progress`: Update skill progress (Protected)
- `POST /api/user/feedback`: Submit feedback (Protected)

### Admin (Protected - Requires Admin Role)
- `POST /api/admin/streams`: Add a new stream
- `POST /api/admin/subdomains`: Add a new subdomain
- `POST /api/admin/roles`: Add a new career role
- `POST /api/admin/courses`: Add a course link
- `POST /api/admin/jobs`: Add a job listing
- `GET /api/admin/feedback`: View all user feedback
