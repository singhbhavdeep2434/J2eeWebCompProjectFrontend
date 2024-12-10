import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ShowUsers.css';
import NavBar from '../NavBars/NavBar';

const ShowUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        navigate('/login'); // Redirect if not authenticated
        return;
      }

      try {
        const response = await fetch('http://localhost:8089/users', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data);
        setIsLoading(false);
      } catch (err) {
        setError('Unable to fetch users');
        setIsLoading(false);
        console.error(err);
      }
    };

    fetchUsers();
  }, [navigate]);

//   const handleLoginAsUser = async (username) => {
//     const token = localStorage.getItem('authToken');  // Get the token from localStorage
//     if (!token) {
//         alert('You are not authenticated.');
//         return;
//     }

//     try {
//         const response = await fetch('http://localhost:8089/login-as-user', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}`, // Include token for authentication
//             },
//             body: JSON.stringify({ username }),
//         });

//         if (!response.ok) {
//             throw new Error('Login failed with status ' + response.status);
//         }

//         const data = await response.json();
//         // Assuming the response contains a token or other necessary info
//         localStorage.setItem('authToken', data.token);  // Store the new token
//         alert(`Logged in as ${username}`);
//         navigate('/dashboard');  // Navigate to the dashboard or another page
//     } catch (error) {
//         console.error('Error during login:', error);
//         alert('Failed to log in as this user.');
//     }
// };

const handleLoginAsUser = async (username) => {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    if (!token) {
      alert('You are not authenticated.');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:8089/login-as-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include token for authentication
        },
        body: JSON.stringify({ username }),
      });
  
      if (!response.ok) {
        throw new Error('Login failed with status ' + response.status);
      }
  
      // Check if the response is a JWT token and handle accordingly
      const responseText = await response.text();  // Get the response as text
      const tokenRegex = /^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/;  // Regex for JWT format
  
      if (tokenRegex.test(responseText)) {
        // If it's a JWT, store it and proceed
        localStorage.setItem('authToken', responseText);
        alert(`Logged in as ${username}`);
        navigate('/dashboard'); // Navigate to the dashboard or another page
      } else {
        // Handle other types of responses (if needed)
        const data = JSON.parse(responseText);  // Try parsing it as JSON if it's not a token
        console.log('Received data:', data);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Failed to log in as this user.');
    }
  };

  


  return (
    <div className="container">
        <NavBar/>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Users</h2>
        </div>
        <div className="card-content">
          {isLoading ? (
            <p>Loading users...</p>
          ) : error ? (
            <div className="alert">{error}</div>
          ) : users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button
                        className="login-button"
                        onClick={() => handleLoginAsUser(user.username)}
                      >
                        Login
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowUsersPage;
