# OneEdu Admin Guide

## Admin Access Credentials

**Email:** `admin@gmail.com`  
**Password:** `admin`  
**Username:** `admin`

## How to Access Admin Dashboard

1. **Start the Application:**
   - Backend server should be running on `http://localhost:5000`
   - Frontend should be running on `http://localhost:5173`

2. **Login as Admin:**
   - Go to `http://localhost:5173/login`
   - **Check the "Login as Admin" checkbox** - this will auto-fill the credentials
   - Or manually enter: `admin@gmail.com` / `admin`
   - You will be automatically redirected to `/admin` dashboard

3. **Access from Navbar:**
   - Once logged in as admin, you'll see an "Admin" link in the navbar
   - Click it to access the admin dashboard at any time

## Admin Dashboard Features

### 1. Course Management
The admin dashboard provides comprehensive course management:

#### View All Courses
- See all courses in a table format with:
  - Title, Skill, Type (Free/Paid), Provider, Duration
  - Edit and Delete actions for each course

#### Add New Course
Click the "Add New Course" button to open a modal with fields:
- **Course Title** (required)
- **Skill** (required) - e.g., Python, Machine Learning, Blockchain
- **Type** (required) - Free or Paid
- **Provider** (required) - e.g., Udemy, Coursera, YouTube
- **Duration** - e.g., "20 hours", "4 weeks"
- **Course Link** (required) - Full URL to the course
- **Description** - Brief description of the course

#### Edit Existing Course
- Click the edit icon (pencil) next to any course
- Modify any field in the modal
- Click "Save Course" to update

#### Delete Course
- Click the delete icon (trash) next to any course
- Confirm the deletion in the popup
- Course will be permanently removed

### 2. Stream Management
- View all educational streams (CSE, Mechanical, Civil, etc.)
- Delete streams if needed
- Basic stream information display

### 3. User Feedback
- View all user feedback submitted through the platform
- See ratings (1-5 stars)
- Read user comments
- See which user submitted feedback and when

## Course Tracking (User Feature)

### How It Works
When users are on the **Role Details** page:
1. They see all courses for that specific role
2. Each course has a progress bar (0%, 25%, 50%, 75%, 100%)
3. Users can click percentage buttons to update their progress
4. They can mark courses as complete using the "Mark Complete" button
5. Progress is automatically saved to their profile

### Fixed Issues
✅ **Course Tracking Fixed:** The backend now correctly handles course progress updates
- Feedback model field corrected from `message` to `comment`
- Course progress tracking endpoint working properly
- Progress persists across sessions

## Important Notes

### Adding Courses
- Make sure the **Skill** field matches the skills defined in roles
- Courses are linked to roles through the skill name
- Example: If a role has skill "Python", add courses with skill="Python"

### Course Display
- Courses are automatically shown on the Role Details page for users
- They're grouped by skill
- Users see their personal progress for each course

### URL Format
- Course links must be full URLs starting with `http://` or `https://`
- Example: `https://www.udemy.com/course/python-bootcamp/`

## Troubleshooting

### Can't Login as Admin?
- Make sure you're using: `admin@gmail.com` / `admin`
- Check the "Login as Admin" checkbox for auto-fill
- Run `npm run seed` in the backend folder if admin user doesn't exist

### Courses Not Showing?
- Ensure the course's skill matches exactly with role skills
- Check that the course was saved successfully in admin dashboard

### Course Tracking Not Working?
- User must be logged in
- User must be on a Role Details page
- Backend server must be running

## Support

If you encounter any issues:
1. Check browser console for errors (F12)
2. Check backend terminal for server errors
3. Ensure MongoDB is running
4. Ensure both servers are started
