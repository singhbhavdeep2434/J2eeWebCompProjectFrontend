import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, updateUser, deleteUser } from '../services/userService'; // assuming these API functions are implemented
import '../styles/ShowUsers.css'; // Adjust the CSS accordingly
import NavBar from '../NavBars/NavBar';

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updatedUserData, setUpdatedUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const usersData = await fetchUsers(token);
        setUsers(usersData);
        setIsLoading(false);
      } catch (error) {
        setError('Could not fetch users.');
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const handleLoginAsUser = async (username) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('You are not authenticated.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8089/login-as-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error('Login failed with status ' + response.status);
      }

      const responseText = await response.text();
      const tokenRegex = /^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/;

      if (tokenRegex.test(responseText)) {
        localStorage.setItem('authToken', responseText);
        alert(`Logged in as ${username}`);
        navigate('/student-dashboard');
      } else {
        const data = JSON.parse(responseText);
        console.log('Received data:', data);
      }
    } catch (error) {
      alert('Failed to log in as this user.');
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setUpdatedUserData({ ...user });
  };

  const handleInputChange = (e) => {
    setUpdatedUserData({
      ...updatedUserData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateUser = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await updateUser(selectedUser.id, updatedUserData, token);
      setUsers(users.map(user => user.id === selectedUser.id ? { ...user, ...updatedUserData } : user));
      setSelectedUser(null);
      alert('User updated successfully!');
    } catch (error) {
      setError('Failed to update user.');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await deleteUser(userId, token);
      setUsers(users.filter(user => user.id !== userId));
      alert('User deleted successfully!');
    } catch (error) {
      setError('Failed to delete user.');
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="user-page">
      <NavBar handleLogout={handleLogout} />
      <div className="user-card">
        <div className="card-header">
          <h2>User Management</h2>
        </div>
        <div className="card-content">
          {error && <div className="alert">{error}</div>}

          {users.length === 0 ? (
            <p>No users available.</p>
          ) : (
            <table className="user-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    {selectedUser && selectedUser.id === user.id ? (
                      <>
                        <td><input type="text" name="username" value={updatedUserData.username} onChange={handleInputChange} /></td>
                        <td><input type="email" name="email" value={updatedUserData.email} onChange={handleInputChange} /></td>
                        <td><input type="text" name="role" value={updatedUserData.role} onChange={handleInputChange} /></td>
                        <td>
                          <button onClick={handleUpdateUser} className="save-btn">Save</button>
                          <button onClick={() => setSelectedUser(null)} className="cancel-btn">Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                          <button onClick={() => handleEditClick(user)} className="edit-btn">Edit</button>
                          <button onClick={() => handleDeleteUser(user.id)} className="delete-btn">Delete</button>
                          <button onClick={() => handleLoginAsUser(user.username)} className="login-btn">Login</button>
                        </td>
                      </>
                    )}
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

export default UserPage;
