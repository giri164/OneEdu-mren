import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import SidePanel from './components/SidePanel';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import SubStreamDetails from './pages/SubStreamDetails';
import RoleDetails from './pages/RoleDetails';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import FeedbackForm from './components/FeedbackForm';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-cream text-gray-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
            <Navbar />
            <div className="flex flex-1">
              <SidePanel />
              <main className="flex-grow bg-cream dark:bg-slate-950">
                <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* User Routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                    <div className="max-w-7xl mx-auto px-4 pb-20">
                      <FeedbackForm />
                    </div>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/streams/:streamSlug/substreams/:subStreamSlug" 
                element={
                  <ProtectedRoute>
                    <SubStreamDetails />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/role/:id" 
                element={
                  <ProtectedRoute>
                    <RoleDetails />
                  </ProtectedRoute>
                } 
              />

              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              </Routes>
              </main>
            </div>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
