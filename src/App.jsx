import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/pages/LoginPage';
import CoursesPage from './components/pages/CoursesPage';
import SignUpPage from './components/pages/SignupPage';  // Import SignUpPage
import DashboardPage from './components/pages/DashboardPage';
import ShowUsers from './components/pages/ShowUsers';
import CreateCoursePage from './components/pages/CreateCoursePage';
import ShowEnrollmentsPage from './components/pages/ShowEnrollmentsPage';

const App = () => {

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

        <Route path="/dashboard" element={<DashboardPage />} />

        <Route path="/signup" element={<div>Create User Page</div>} />
        <Route path="/show-users" element={<ShowUsers />} />
        <Route path="/create-course" element={<CreateCoursePage />} />
        <Route path="/show-courses" element={<div>Show All Courses Page </div>} />
        <Route path="/show-enrollments" element={<ShowEnrollmentsPage />} />
        
        {/* Redirect to login page by default */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
