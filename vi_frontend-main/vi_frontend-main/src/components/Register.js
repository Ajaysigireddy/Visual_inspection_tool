import React, { useState } from 'react';
import './Register.css';
import { BASE_URL } from './config.js';
import { Link } from 'react-router-dom';


const domainOptions = [
    "Automobile",
    "Furniture",
    "Medicine"
];

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [domain, setDomain] = useState('');
  const [password, setPassword] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleOrganisationChange = (event) => {
    setOrganisation(event.target.value);
  };

  const handleDomainChange = (event) => {
    setDomain(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };


  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(BASE_URL+ '/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        organizationName: organisation,
        password: password,
        domain: domain
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.statusCode === 200) {
        // User successfully registered
        alert(data.message);
        // You can redirect to the login page or do anything else you want here
      } else if (data.statusCode === 300) {
        // User email already exists
        alert(data.message);
      }
    })
    .catch(error => {
      console.error(error);
    });
  };
  

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div className="form-row">
          <label htmlFor="organisation">Organisation Name:</label>
          <input
            type="text"
            id="organisation"
            value={organisation}
            onChange={handleOrganisationChange}
            required
          />
        </div>
        <div className="form-row">
            <label htmlFor="domain">Domain:</label>
            <input
            id="domain"
            type="text"
            list="domainOptions"
            value={domain}
            onChange={handleDomainChange}
            required/>
            <datalist id="domainOptions">
                {domainOptions.map((option) => (
                <option value={option} key={option} />
                ))}
            </datalist>
        </div>
        <div className="form-row">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="submit">Register</button>
        <br />
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </form>
    </div>
  );
};

export default Register;
