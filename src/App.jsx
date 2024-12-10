import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/pages/LoginPage';
import CoursesPage from './components/pages/CoursesPage';
import SignUpPage from './components/pages/SignupPage';  // Import SignUpPage
import DashboardAdmin from './components/pages/DashboardPage';
import DashboardProfessor from './components/professorPages/DashboardPageProfessor';
import DashboardStudent from './components/studentPages/DashboardPageStudent';
import ShowUsers from './components/pages/ShowUsers';
import CreateCoursePage from './components/pages/CreateCoursePage';
import ShowEnrollmentsPage from './components/pages/ShowEnrollmentsPage';
import CoursesPageStudent from './components/studentPages/CoursesPageStudent';
import MyEnrollments from './components/studentPages/MyEnrollments';

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
        <Route path="/courses" element={
          <PrivateRoute>
              <CoursesPage />
            </PrivateRoute>
          } 
        />

        <Route path="/student-courses" element={
          <PrivateRoute>
              <CoursesPageStudent />
            </PrivateRoute>
          } 
        />
{/* 
        <Route path="/courses" element={
          <PrivateRoute>
              <CoursesPageStudent />
            </PrivateRoute>
          } 
        /> */}

        <Route
          path="/admin-dashboard"
          element={
            
              <DashboardAdmin />
          }
        />
        <Route
          path="/professor-dashboard"
          element={
            
              <DashboardProfessor />
          }
        />
        <Route
          path="/student-dashboard"
          element={
            
              <DashboardStudent />
              
          }
        />
        
        Default route (redirect to login if no valid role or other routes)
        <Route path="*" element={<Navigate to="/login" />} />


        <Route path="/dashboard" element={<DashboardAdmin />} />

        <Route path="/signup" element={<div>Create User Page</div>} />
        <Route path="/show-users" element={<ShowUsers />} />
        <Route path="/create-course" element={<CreateCoursePage />} />
        <Route path="/show-courses" element={<div>Show All Courses Page </div>} />
        <Route path="/show-enrollments" element={<ShowEnrollmentsPage />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        
        {/* Redirect to login page by default */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
