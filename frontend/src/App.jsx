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
import Feedback from './pages/Feedback';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col h-screen bg-cream text-gray-900 dark:bg-slate-950 dark:text-slate-100 transition-colors">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
              <SidePanel />
              <main className="flex-grow bg-cream dark:bg-slate-950 overflow-y-auto">
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
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/feedback" 
                element={
                  <ProtectedRoute>
                    <Feedback />
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
