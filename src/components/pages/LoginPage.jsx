import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import '../styles/LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // const token = await loginUser(username, password);
      // console.log(token);

      const response = await loginUser(username, password);
      console.log(response);

      const token  = response.token;
      const user = response.role;
      console.log(token);
      console.log(user);

      localStorage.setItem('authToken', token);
      // localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('user', user);

      const role = user;

      if (role === 'ADMIN') {
        navigate('/admin-dashboard');
      } 
      else if (role === 'PROFESSOR') {
        navigate('/professor-dashboard');
      } 
      else if (role === 'STUDENT') {
        navigate('/student-dashboard');
      } 
      else {
        throw new Error('Unknown role received');
      }



      // navigate('/dashboard');
    } catch (error) {
      setError('An error occurred during login.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Login</h2>
        </div>
        <div className="card-content">
          <form onSubmit={handleLogin}>
            {error && <div className="alert">{error}</div>}

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
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input"
              />
            </div>

            <button type="submit" className="button">
              Login
            </button>
          </form>
          
          {/* Link to SignUpPage */}
          <div className="signup-link">
            <p>Don't have an account? <a href="/signup">Sign Up</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
   