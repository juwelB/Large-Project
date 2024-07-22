import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './SignUp';
import Login from './Login';
import LandingPage from './LandingPage';
import ForgotPassword from './ForgotPassword';
import EmailVerification from './EmailVerification';
import ForgotPasswordVerification from './ForgotPasswordVerification';
import LoggedInLandingPage from './LoggedInLandingPage';
import CalendarPage from './CalendarPage';
import ClubListPage from './ClubListPage';
import EventsPage from './EventsPage';
import ResetPassword from './ResetPassword';
import EmailVerified from './EmailVerified';
import { AuthProvider } from '../context/AuthContext';
import ClubForm from './ClubForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/forgot-password-verification" element={<ForgotPasswordVerification />} />
          <Route path="/dashboard" element={<LoggedInLandingPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/clubs" element={<ClubListPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/reset-password/:userId/:token" element={<ResetPassword />} />
          <Route path="/email-verified" element={<EmailVerified />} />
          <Route path="/create-club" element={<ClubForm />} />
          {/* Other routes */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;