import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GeneralLogin = ({ setIsLoggedIn }) => {
  const [data, setData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/GeneralLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const result = await res.json();

      console.log(result);

      if (result.message === 'General login successful!') {
        setIsLoggedIn(true);
        navigate('/home'); // Redirect to the main page
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError('Login failed, please try again');
    }
  };

  return (
    <div>
        <h1>Volunteer Login</h1>
        <p>Please login with the universal login. If you do not know it, ask an administrator.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={data.username}
          onChange={handleLogin}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={data.password}
          onChange={handleLogin}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <div>{error}</div>}
    </div>
  );
};

export default GeneralLogin;
