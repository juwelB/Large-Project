import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './SignUp';
import Login from './Login';
import LandingPage from './LandingPage';
import ForgotPassword from './ForgotPassword';
import EmailVerification from './EmailVerification';
import LoggedInLandingPage from './LoggedInLandingPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<LoggedInLandingPage />} />
        {/* Other routes */}
      </Routes>
    </Router>
  );
};

export default App;