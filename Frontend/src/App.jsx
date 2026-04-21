import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LogAction from './pages/LogAction';
import Leaderboard from './pages/Leaderboard';
import Badges from './pages/Badges';
import ForgotPassword from './pages/ForgotPassword';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import LearnMore from './pages/LearnMore';

import BackgroundLeaves from './components/BackgroundLeaves';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans relative">
          <BackgroundLeaves />
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />
              <Route path="/log-action" element={
                <ProtectedRoute><LogAction /></ProtectedRoute>
              } />
              <Route path="/leaderboard" element={
                <ProtectedRoute><Leaderboard /></ProtectedRoute>
              } />
              <Route path="/badges" element={
                <ProtectedRoute><Badges /></ProtectedRoute>
              } />
              <Route path="/learn-more" element={<LearnMore />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/donate" element={<Donate />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
