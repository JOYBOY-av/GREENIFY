import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LogAction from './pages/LogAction';
import Leaderboard from './pages/Leaderboard';
import Badges from './pages/Badges';
import MyActions from './pages/MyActions';
import ForgotPassword from './pages/ForgotPassword';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import LearnMore from './pages/LearnMore';

import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminBadges from './pages/admin/AdminBadges';
import AdminActions from './pages/admin/AdminActions';
import AdminLegal from './pages/admin/AdminLegal';

import AmbientAnimations from './components/AmbientAnimations';

function App() {
  return (
    <AdminProvider>
      <AuthProvider>
        <Router>
          <Routes>

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users"     element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/badges"    element={<AdminRoute><AdminBadges /></AdminRoute>} />
            <Route path="/admin/actions"   element={<AdminRoute><AdminActions /></AdminRoute>} />
            <Route path="/admin/legal"     element={<AdminRoute><AdminLegal /></AdminRoute>} />

            <Route path="/*" element={
              <div className="min-h-screen flex flex-col text-gray-900 font-sans relative isolate">
                <AmbientAnimations />
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/"               element={<Landing />} />
                    <Route path="/login"          element={<Login />} />
                    <Route path="/register"       element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/dashboard"      element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/log-action"     element={<ProtectedRoute><LogAction /></ProtectedRoute>} />
                    <Route path="/leaderboard"    element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
                    <Route path="/badges"         element={<ProtectedRoute><Badges /></ProtectedRoute>} />
                    <Route path="/my-actions"     element={<ProtectedRoute><MyActions /></ProtectedRoute>} />
                    <Route path="/learn-more"     element={<LearnMore />} />
                    <Route path="/terms"          element={<Terms />} />
                    <Route path="/privacy"        element={<Privacy />} />
                    <Route path="/contact"        element={<Contact />} />
                    <Route path="/donate"         element={<Donate />} />
                  </Routes>
                </main>
                <Footer />
                <Toaster position="top-right" />
              </div>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </AdminProvider>
  );
}

export default App;
