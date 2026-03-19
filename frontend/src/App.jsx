import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import Profile from './pages/Profile';
import HRDashboard from './pages/HRDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import JobDescription from './pages/JobDescription';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-200">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/description/:id" element={<JobDescription />} />

          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['candidate']}>
              <Profile />
            </ProtectedRoute>
          } />

          <Route path="/hr/dashboard" element={
            <ProtectedRoute allowedRoles={['hr']}>
              <HRDashboard />
            </ProtectedRoute>
          } />
          <Route path="/hr/jobs/:id/applicants" element={
            <ProtectedRoute allowedRoles={['hr']}>
            </ProtectedRoute>
          } />

          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;