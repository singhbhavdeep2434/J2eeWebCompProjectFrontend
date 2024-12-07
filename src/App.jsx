import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/pages/LoginPage';
import CoursesPage from './components/pages/CoursesPage';
import SignUpPage from './components/pages/SignupPage';  // Import SignUpPage

const App = () => {
  // Optional: Add a protected route component
  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("authToken");
    return token ? children : <Navigate to="/login" replace />;
  };

  return (
    <Router>
      <Routes>
        {/* Login page */}
        <Route path="/login" element={<LoginPage />} />

        {/* Sign Up page */}
        <Route path="/signup" element={<SignUpPage />} />  {/* Changed to /signup */}

        {/* Courses page (protected route) */}
        <Route 
          path="/courses" 
          element={
            <PrivateRoute>
              <CoursesPage />
            </PrivateRoute>
          } 
        />
        
        {/* Redirect to login page by default */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
