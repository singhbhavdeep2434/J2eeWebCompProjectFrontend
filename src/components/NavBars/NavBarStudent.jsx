// import React from 'react';
// import { Link } from 'react-router-dom';

// const NavBar = ({ handleLogout }) => {
//   return (
//     <div>
//       <nav className="navbar">
//         <h2>Dashboard</h2>
//         <div className="navbar-links">
//           {/* <Link to="/dashboard" className="nav-link">Home</Link>
//           <Link to="/signup" className="nav-link">Create User</Link>
//           <Link to="/show-users" className="nav-link">Show Users</Link>
//           <Link to="/create-course" className="nav-link">Create Course</Link> */}
//           <Link to="/courses" className="nav-link">Courses</Link>
//           <Link to="/show-enrollments" className="nav-link">Enrollments</Link>
//           <button onClick={handleLogout} className="logout-button">Logout</button>
//         </div>
//       </nav>
//     </div>
//   );
// };

// export default NavBar;


import React from 'react';
import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/NavBar.css';

const NavBar = ({ handleLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container-fluid justify-content-between">
        {/* App Name */}
        <NavLink to="/dashboard" className="navbar-brand fw-bold text-primary">
          <i className="bi bi-book"></i> StudentApp
        </NavLink>

        {/* Toggle Button for Mobile View */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto flex-wrap">
            {/* <li className="nav-item">
              <NavLink to="/dashboard" className="nav-link">
                <button className="btn btn-outline-primary mx-2">Home</button>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/signup" className="nav-link">
                <button className="btn btn-outline-primary mx-2">
                  Create User
                </button>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/show-users" className="nav-link">
                <button className="btn btn-outline-primary mx-2">
                  Show Users
                </button>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/create-course" className="nav-link">
                <button className="btn btn-outline-primary mx-2">
                  Create Course
                </button>
              </NavLink>
            </li> */}
            <li className="nav-item">
              <NavLink to="/courses" className="nav-link">
                <button className="btn btn-outline-primary mx-2">Courses</button>
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/my-enrollments" className="nav-link">
                <button className="btn btn-outline-primary mx-2">
                  Enrollments
                </button>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Logout Button */}
        <button onClick={handleLogout} className="btn btn-primary">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
