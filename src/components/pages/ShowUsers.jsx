import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, updateUser, deleteUser } from '../services/userService'; // assuming these API functions are implemented
import '../styles/ShowUsers.css'; // Adjust the CSS accordingly
import NavBar from '../NavBars/NavBar';

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null); // Track the user being edited
  const [updatedUserData, setUpdatedUserData] = useState(null); // Store updated user data
  const navigate = useNavigate();

  // Fetch users on load
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch users
        const usersData = await fetchUsers(token);
        setUsers(usersData);
        setIsLoading(false);
      } catch (error) {
        setError("Could not fetch users.");
        setIsLoading(false);
        console.error("Users fetch error:", error);
      }
    };

    loadUsers();
  }, [navigate]);

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate('/login');
  };

  // Handle user login as another user (similar to the commented code)
//   const handleLoginAsUser = async (username) => {
//     const token = localStorage.getItem('authToken'); // Get the token from localStorage
//     if (!token) {
//       alert('You are not authenticated.');
//       return;
//     }

//     try {
//       const response = await fetch('http://localhost:8089/login-as-user', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`, // Include token for authentication
//         },
//         body: JSON.stringify({ username }),
//       });

//       if (!response.ok) {
//         throw new Error('Login failed with status ' + response.status);
//       }

//       // Assuming response contains the new token
//       const data = await response.json();
//       localStorage.setItem('authToken', data.token);  // Store the new token
//       alert(`Logged in as ${username}`);
//       navigate('/dashboard');  // Navigate to the dashboard or another page
//     } catch (error) {
//       console.error('Error during login:', error);
//       alert('Failed to log in as this user.');
//     }
//   };


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
        navigate('/student-dashboard'); // Navigate to the dashboard or another page
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


  const handleEditClick = (user) => {
    setSelectedUser(user); // Set the user to edit
    setUpdatedUserData({ ...user }); // Prepopulate the data in the form
  };

  const handleInputChange = (e) => {
    setUpdatedUserData({
      ...updatedUserData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateUser = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await updateUser(selectedUser.id, updatedUserData, token); // Call the API to update the user

      // Update local users list after successful API call
      setUsers(users.map(user => user.id === selectedUser.id ? { ...user, ...updatedUserData } : user));
      setSelectedUser(null); // Close the edit form
      alert('User updated successfully!');
    } catch (error) {
      setError("Failed to update user.");
      console.error("Update error:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await deleteUser(userId, token); // Call the API to delete the user

      // Remove user from the local list after successful API call
      setUsers(users.filter(user => user.id !== userId));
      alert('User deleted successfully!');
    } catch (error) {
      setError("Failed to delete user.");
      console.error("Delete error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="container">
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <NavBar handleLogout={handleLogout} />
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Users</h2>
        </div>
        <div className="card-content">
          {/* {error && (
            <div className="alert">
              <p className="alert-description">{error}</p>
            </div>
          )} */}

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
                        <td>
                          <input
                            type="text"
                            name="username"
                            value={updatedUserData.username}
                            onChange={handleInputChange}
                          />
                        </td>
                        <td>
                          <input
                            type="email"
                            name="email"
                            value={updatedUserData.email}
                            onChange={handleInputChange}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="role"
                            value={updatedUserData.role}
                            onChange={handleInputChange}
                          />
                        </td>
                        <td>
                          <button onClick={handleUpdateUser}>Save</button>
                          <button onClick={() => setSelectedUser(null)}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                          <button onClick={() => handleEditClick(user)}>Edit</button>
                          <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                          <button
                            className="login-button"
                            onClick={() => handleLoginAsUser(user.username)}
                          >
                            Login
                          </button>
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




// 1.1

// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../styles/ShowUsers.css';
// import NavBar from '../NavBars/NavBar';

// const ShowUsersPage = () => {
//   const [users, setUsers] = useState([]);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUsers = async () => {
//       const token = localStorage.getItem('authToken');

//       if (!token) {
//         navigate('/login'); // Redirect if not authenticated
//         return;
//       }

//       try {
//         const response = await fetch('http://localhost:8089/users', {
//           method: 'GET',
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         if (!response.ok) {
//           throw new Error('Failed to fetch users');
//         }

//         const data = await response.json();
//         setUsers(data);
//         setIsLoading(false);
//       } catch (err) {
//         setError('Unable to fetch users');
//         setIsLoading(false);
//         console.error(err);
//       }
//     };

//     fetchUsers();
//   }, [navigate]);

// //   const handleLoginAsUser = async (username) => {
// //     const token = localStorage.getItem('authToken');  // Get the token from localStorage
// //     if (!token) {
// //         alert('You are not authenticated.');
// //         return;
// //     }

// //     try {
// //         const response = await fetch('http://localhost:8089/login-as-user', {
// //             method: 'POST',
// //             headers: {
// //                 'Content-Type': 'application/json',
// //                 'Authorization': `Bearer ${token}`, // Include token for authentication
// //             },
// //             body: JSON.stringify({ username }),
// //         });

// //         if (!response.ok) {
// //             throw new Error('Login failed with status ' + response.status);
// //         }

// //         const data = await response.json();
// //         // Assuming the response contains a token or other necessary info
// //         localStorage.setItem('authToken', data.token);  // Store the new token
// //         alert(`Logged in as ${username}`);
// //         navigate('/dashboard');  // Navigate to the dashboard or another page
// //     } catch (error) {
// //         console.error('Error during login:', error);
// //         alert('Failed to log in as this user.');
// //     }
// // };

// const handleLoginAsUser = async (username) => {
//     const token = localStorage.getItem('authToken'); // Get the token from localStorage
//     if (!token) {
//       alert('You are not authenticated.');
//       return;
//     }
  
//     try {
//       const response = await fetch('http://localhost:8089/login-as-user', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`, // Include token for authentication
//         },
//         body: JSON.stringify({ username }),
//       });
  
//       if (!response.ok) {
//         throw new Error('Login failed with status ' + response.status);
//       }
  
//       // Check if the response is a JWT token and handle accordingly
//       const responseText = await response.text();  // Get the response as text
//       const tokenRegex = /^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/;  // Regex for JWT format
  
//       if (tokenRegex.test(responseText)) {
//         // If it's a JWT, store it and proceed
//         localStorage.setItem('authToken', responseText);
//         alert(`Logged in as ${username}`);
//         navigate('/dashboard'); // Navigate to the dashboard or another page
//       } else {
//         // Handle other types of responses (if needed)
//         const data = JSON.parse(responseText);  // Try parsing it as JSON if it's not a token
//         console.log('Received data:', data);
//       }
//     } catch (error) {
//       console.error('Error during login:', error);
//       alert('Failed to log in as this user.');
//     }
//   };

  


//   return (
//     <div className="container">
//         <NavBar/>
//       <div className="card">
//         <div className="card-header">
//           <h2 className="card-title">Users</h2>
//         </div>
//         <div className="card-content">
//           {isLoading ? (
//             <p>Loading users...</p>
//           ) : error ? (
//             <div className="alert">{error}</div>
//           ) : users.length === 0 ? (
//             <p>No users found.</p>
//           ) : (
//             <table className="table">
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Name</th>
//                   <th>Username</th>
//                   <th>Email</th>
//                   <th>Role</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((user) => (
//                   <tr key={user.id}>
//                     <td>{user.id}</td>
//                     <td>{user.name}</td>
//                     <td>{user.username}</td>
//                     <td>{user.email}</td>
//                     <td>{user.role}</td>
//                     <td>
//                       <button
//                         className="login-button"
//                         onClick={() => handleLoginAsUser(user.username)}
//                       >
//                         Login
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShowUsersPage;

//1.2

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { fetchUsers, updateUser, deleteUser } from '../services/userService'; // assuming these API functions are implemented
// import '../styles/ShowUsers.css'; // Adjust the CSS accordingly
// import NavBar from '../NavBars/NavBar';

// const UserPage = () => {
//   const [users, setUsers] = useState([]);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [selectedUser, setSelectedUser] = useState(null); // Track the user being edited
//   const [updatedUserData, setUpdatedUserData] = useState(null); // Store updated user data
//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadUsers = async () => {
//       try {
//         const token = localStorage.getItem("authToken");
//         if (!token) {
//           navigate('/login');
//           return;
//         }

//         // Fetch users
//         const usersData = await fetchUsers(token);
//         setUsers(usersData);
//         setIsLoading(false);
//       } catch (error) {
//         setError("Could not fetch users.");
//         setIsLoading(false);
//         console.error("Users fetch error:", error);
//       }
//     };

//     loadUsers();
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem("authToken");
//     navigate('/login');
//   };

//   const handleEditClick = (user) => {
//     setSelectedUser(user); // Set the user to edit
//     setUpdatedUserData({ ...user }); // Prepopulate the data in the form
//   };

//   const handleInputChange = (e) => {
//     setUpdatedUserData({
//       ...updatedUserData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleUpdateUser = async () => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         navigate('/login');
//         return;
//       }

//       const response = await updateUser(selectedUser.id, updatedUserData, token); // Call the API to update the user

//       // Update local users list after successful API call
//       setUsers(users.map(user => user.id === selectedUser.id ? { ...user, ...updatedUserData } : user));
//       setSelectedUser(null); // Close the edit form
//       alert('User updated successfully!');
//     } catch (error) {
//       setError("Failed to update user.");
//       console.error("Update error:", error);
//     }
//   };

//   const handleDeleteUser = async (userId) => {
//     try {
//       const token = localStorage.getItem("authToken");
//       if (!token) {
//         navigate('/login');
//         return;
//       }

//       const response = await deleteUser(userId, token); // Call the API to delete the user

//       // Remove user from the local list after successful API call
//       setUsers(users.filter(user => user.id !== userId));
//       alert('User deleted successfully!');
//     } catch (error) {
//       setError("Failed to delete user.");
//       console.error("Delete error:", error);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="container">
//         <p>Loading users...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container">
//       <NavBar handleLogout={handleLogout} />
//       <div className="card">
//         <div className="card-header">
//           <h2 className="card-title">Users</h2>
//         </div>
//         <div className="card-content">
//           {error && (
//             <div className="alert">
//               <p className="alert-description">{error}</p>
//             </div>
//           )}

//           {users.length === 0 ? (
//             <p>No users available.</p>
//           ) : (
//             <table className="user-table">
//               <thead>
//                 <tr>
//                   <th>Username</th>
//                   <th>Email</th>
//                   <th>Role</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users.map((user) => (
//                   <tr key={user.id}>
//                     {selectedUser && selectedUser.id === user.id ? (
//                       <>
//                         <td>
//                           <input
//                             type="text"
//                             name="username"
//                             value={updatedUserData.username}
//                             onChange={handleInputChange}
//                           />
//                         </td>
//                         <td>
//                           <input
//                             type="email"
//                             name="email"
//                             value={updatedUserData.email}
//                             onChange={handleInputChange}
//                           />
//                         </td>
//                         <td>
//                           <input
//                             type="text"
//                             name="role"
//                             value={updatedUserData.role}
//                             onChange={handleInputChange}
//                           />
//                         </td>
//                         <td>
//                           <button onClick={handleUpdateUser}>Save</button>
//                           <button onClick={() => setSelectedUser(null)}>Cancel</button>
//                         </td>
//                       </>
//                     ) : (
//                       <>
//                         <td>{user.username}</td>
//                         <td>{user.email}</td>
//                         <td>{user.role}</td>
//                         <td>
//                           <button onClick={() => handleEditClick(user)}>Edit</button>
//                           <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
//                         </td>
//                       </>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserPage;
