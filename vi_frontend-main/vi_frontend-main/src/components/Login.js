import React, { useState } from 'react';
import './Login.css'
import { BASE_URL } from './config.js';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const navigate = useNavigate();

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(BASE_URL+ '/user/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        const token = localStorage.getItem('token');
        console.log(token);
  
        // Set userEmail in localStorage with an expiration time of 30 minutes
        localStorage.setItem('userEmail', email);
        setTimeout(() => {
          // After 30 minutes, set userEmail to null
          localStorage.setItem('userEmail', null);
        }, 30 * 60 * 1000); // 30 minutes in milliseconds
  
        console.log('Validation successful');
        // Navigate to "/home"
        navigate('/home');
      } else if (data.statusCode === 301) {
        // email not found, do something
        alert(data.message);
      } else if (data.statusCode === 302) {
        // incorrect password, do something
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };
  

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="submit">Login</button>
        <br />
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </form>
    </div>
  );
};

export default Login;
