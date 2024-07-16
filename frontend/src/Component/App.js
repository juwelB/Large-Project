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
import ClubList from './ClubList';
import EventList from './EventList';
import ResetPassword from './ResetPassword';
import EmailVerified from './EmailVerified';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password-verification" element={<ForgotPasswordVerification />} />
        <Route path="/dashboard" element={<LoggedInLandingPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/clubs" element={<ClubList />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/reset-password/:userId/:token" element={<ResetPassword />} />
        <Route path="/email-verified" element={<EmailVerified />} />
        {/* Other routes */}
      </Routes>
    </Router>
  );
};

export default App;