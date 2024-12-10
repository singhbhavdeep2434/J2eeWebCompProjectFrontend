import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = ({ handleLogout }) => {
  return (
    <div>
      <nav className="navbar">
        <h2>Dashboard</h2>
        <div className="navbar-links">
          <Link to="/dashboard" className="nav-link">Home</Link>
          <Link to="/signup" className="nav-link">Create User</Link>
          <Link to="/show-users" className="nav-link">Show Users</Link>
          <Link to="/create-course" className="nav-link">Create Course</Link>
          <Link to="/courses" className="nav-link">Courses</Link>
          <Link to="/show-enrollments" className="nav-link">Enrollments</Link>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
