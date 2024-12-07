// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const DashboardPage = () => {
//   const navigate = useNavigate();

//   // Helper function to parse JWT without `jwt-decode`
//   const parseJwt = (token) => {
//     try {
//       const base64Url = token.split('.')[1]; // Get the payload part of the JWT
//       const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//       const jsonPayload = decodeURIComponent(
//         atob(base64)
//           .split('')
//           .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
//           .join('')
//       );
//       return JSON.parse(jsonPayload);
//     } catch (error) {
//       console.error('Error parsing JWT:', error);
//       return null;
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem('authToken');
//     if (!token) {
//       navigate('/login');
//       return;
//     }

//     const decodedToken = parseJwt(token);
//     if (!decodedToken || Date.now() >= decodedToken.exp * 1000) {
//       // Token is expired
//       localStorage.removeItem('authToken');
//       navigate('/login');
//     }
//   }, [navigate]);

//   const handleNavigation = (path) => {
//     navigate(path);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('authToken');
//     navigate('/login');
//   };

//   return (
//     <div style={{ padding: '20px', textAlign: 'center' }}>
//       <h1>Welcome to the Dashboard</h1>
//       <button onClick={handleLogout} style={buttonStyle}>
//         Logout
//       </button>
//       <div style={{ marginTop: '20px' }}>
//         <button
//           onClick={() => handleNavigation('/create-user')}
//           style={buttonStyle}
//         >
//           Create User
//         </button>
//         <button
//           onClick={() => handleNavigation('/show-users')}
//           style={buttonStyle}
//         >
//           Show All Users
//         </button>
//         <button
//           onClick={() => handleNavigation('/create-course')}
//           style={buttonStyle}
//         >
//           Create Course
//         </button>
//         <button
//           onClick={() => handleNavigation('/courses')}
//           style={buttonStyle}
//         >
//           Show All Courses
//         </button>
//         <button
//           onClick={() => handleNavigation('/show-enrollments')}
//           style={buttonStyle}
//         >
//           Show All Enrollments
//         </button>
//       </div>
//     </div>
//   );
// };

// const buttonStyle = {
//   margin: '10px',
//   padding: '10px 20px',
//   fontSize: '16px',
//   cursor: 'pointer',
// };

// export default DashboardPage;




import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/DashboardPage.css'; // Import the CSS file

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
      {/* Navigation Bar */}
      <nav className="navbar">
        <h2>Dashboard</h2>
        <div className="navbar-links">
          <Link to="/dashboard" className="nav-link">Home</Link>
          <Link to="/create-user" className="nav-link">Create User</Link>
          <Link to="/show-users" className="nav-link">Show Users</Link>
          <Link to="/create-course" className="nav-link">Create Course</Link>
          <Link to="/courses" className="nav-link">Courses</Link>
          <Link to="/show-enrollments" className="nav-link">Enrollments</Link>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="dashboard-container">
        <h1>Welcome to the Dashboard</h1>
        <p>Select an option below to manage the system:</p>
        <div className="dashboard-buttons">
          <button
            onClick={() => handleNavigation('/create-user')}
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
          </button>
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
