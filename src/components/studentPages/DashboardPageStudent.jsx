import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/DashboardPage.css'; 
import NavBar from '../NavBars/NavBar';

const DashboardPage = () => {
  const navigate = useNavigate();

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    const decodedToken = parseJwt(token);
    if (!decodedToken || Date.now() >= decodedToken.exp * 1000) {
      localStorage.removeItem('authToken');
      navigate('/login');
    }
  }, [navigate]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div>
      {/* Pass handleLogout to NavBar */}
      <NavBar handleLogout={handleLogout} />

      {/* Main Content */}
      <div className="dashboard-container">
        <h1>Welcome to the Dashboard</h1>
        <p>Select an option below to manage the system:</p>
        <div className="dashboard-buttons">
          {/* <button
            onClick={() => handleNavigation('/signup')}
            className="dashboard-button"
          >
            Create User
          </button>
          <button
            onClick={() => handleNavigation('/show-users')}
            className="dashboard-button"
          >
            Show All Users
          </button>
          <button
            onClick={() => handleNavigation('/create-course')}
            className="dashboard-button"
          >
            Create Course
          </button> */}
          <button
            onClick={() => handleNavigation('/courses')}
            className="dashboard-button"
          >
            Show All Courses
          </button>
          <button
            onClick={() => handleNavigation('/show-enrollments')}
            className="dashboard-button"
          >
            Show All Enrollments
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
