import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GeneralLogin.css';

const GeneralLogin = ({ setIsLoggedIn }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Hardcoded username and password for general users
    const correctUsername = 'actVolunteer';
    const correctPassword = 'actInvent0ry';

    if (credentials.username === correctUsername && credentials.password === correctPassword) {
        setIsLoggedIn(true);
        navigate('/home');  // Redirect to the main site after successful login
    } else {
      setError('Invalid username or password');
    }

    setLoading(false);
  };

  return (
    <div className="general-login-container">
      <h1>General Login</h1>
      <form onSubmit={handleSubmit} className="general-login-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            placeholder="Enter your username"
            required
          />
</div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" disabled={loading} className="login-button">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default GeneralLogin;