import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [data, setData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const navigate = useNavigate();
  

  const handleLogin = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted!");
    setLoading(true);
    try {
     const res = await fetch('/AdminLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      setResponse(result);

      console.log(result);

      if (result.message === 'Login successful!') {
        console.log('Redirecting to admin page...');
        navigate('/AdminPage');
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError('Login failed, please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Administrator Login</h1>
      <p>Please login with an administrator account to access the administrator page.</p>
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
          autoComplete="current-password"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
      {response && <div>{response.message}</div>}
      {error && <div>{error}</div>}
    </div>
  );
};

export default AdminLogin;
