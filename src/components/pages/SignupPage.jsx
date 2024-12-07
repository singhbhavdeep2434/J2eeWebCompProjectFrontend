import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../services/authService'; // Assuming this is implemented in your auth service
import '../styles/SignupPage.css'; // Create this file for styling the signup page

const SignupPage = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('STUDENT'); // Default role is STUDENT
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    // Check if the passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Call the signup function to create the new user
      const response = await signupUser(username, email, password, name, role);

      if (response) {
        // Store the user data upon successful signup
        localStorage.setItem('user', JSON.stringify(response)); // Store full user details in localStorage

        // Redirect to courses page after successful signup
        navigate('/courses');
      }
    } catch (error) {
      setError('An error occurred during signup.');
      console.error('Signup error:', error);
    }
  };

  return (
    <div className="signup-container">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Sign Up</h2>
        </div>
        <div className="card-content">
          <form onSubmit={handleSignup}>
            {error && <div className="alert">{error}</div>}

            <div className="form-group">
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="input"
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="input"
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input"
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input"
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="input"
              />
            </div>

            <div className="form-group">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input"
                required
              >
                
                <option value="STUDENT">STUDENT</option>
                <option value="PROFESSOR">PROFESSOR</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            <button type="submit" className="button">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
