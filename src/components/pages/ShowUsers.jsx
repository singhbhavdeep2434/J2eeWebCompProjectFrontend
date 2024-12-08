import React, { useState, useEffect } from 'react';
import '../styles/ShowUsers.css'; 
import { useNavigate } from 'react-router-dom';
import { fetchUsers } from '../services/userService';
import NavBar from '../NavBar';


const ShowAllUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
  
    useEffect(() => {
      const loadUsers = async () => {
        try {
          const token = localStorage.getItem("authToken");
          if (!token) {
            navigate('/login');
            return;
          }
  
          // Fetch Users
          const usersData = await fetchUsers(token);
          setUsers(usersData);
          setIsLoading(false);
        } catch (error) {
          setError("Could not fetch Users.");
          setIsLoading(false);
          console.error("Users fetch error:", error);
        }
      };
  
      loadUsers();
    }, [navigate]);
  
    const handleLogout = () => {
      localStorage.removeItem("authToken");
      navigate('/login');
    };
  
    if (isLoading) {
      return (
        <div className="container">
          <p>Loading Users...</p>
        </div>
      );
    }

  return (
    <div className="users-container">
        <NavBar/>
      {users.length > 0 ? (
        <table className="users-table">
          <thead>
            <tr>
              {/* <th>ID</th> */}
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                {/* <td>{user.id}</td> */}
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
};

export default ShowAllUsersPage;
