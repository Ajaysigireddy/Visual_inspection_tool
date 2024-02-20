import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import logo from '../IIITH_logo.png';
import 'bootstrap/dist/css/bootstrap.css';

const Layout = () => {
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    // Close dropdown when clicked outside
    const handleClickOutside = (event) => {
      if (!event.target.matches('.dropdown-toggle')) {
        setOpenDropdown(null);
      }
    };

    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleDropdownClick = (dropdownId) => {
    setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
  };

  const handleLogout = () => {
    // Clear the token in localStorage
    localStorage.setItem('token', null);
    localStorage.setItem('userEmail', null);
  };

  return (
    <div className="container">
      {/* Logo and Heading */}
      <div className="d-flex align-items-center justify-content-between">
        <img src={logo} alt="Logo" width="180" />
        <h1 className="mr-3">Visual Inspection Tool</h1>
      </div>

      {/* Navigation Bar */}
      <nav className="mt-3" style={{ display: "flex", justifyContent: "flex-end" }}>
        <ul className="nav">
          <li className="nav-item">
            <NavLink to="/home" className="nav-link">Home</NavLink>
          </li>
          <li className="nav-item dropdown">
            <button
              className="nav-link dropdown-toggle btn"
              type="button"
              onClick={() => handleDropdownClick('dataset')}
            >
              Dataset
            </button>
            <ul className={`dropdown-menu ${openDropdown === 'dataset' ? 'show' : ''}`}>
              <li>
                <Link to="/dataset/view" className="dropdown-item">View Dataset</Link>
              </li>
              <li>
                <Link to="/dataset/upload" className="dropdown-item">Upload Dataset</Link>
              </li>
            </ul>
          </li>
          <li className="nav-item dropdown">
            <button
              className="nav-link dropdown-toggle btn"
              type="button"
              onClick={() => handleDropdownClick('model')}
            >
              Model
            </button>
            <ul className={`dropdown-menu ${openDropdown === 'model' ? 'show' : ''}`}>
              <li>
                <Link to="/model/view" className="dropdown-item">View Model</Link>
              </li>
              <li>
                <Link to="/model/train" className="dropdown-item">Train Model</Link>
              </li>
            </ul>
          </li>
          <li className="nav-item dropdown">
            <button
              className="nav-link dropdown-toggle btn"
              type="button"
              onClick={() => handleDropdownClick('rules')}
            >
              Rules
            </button>
            <ul className={`dropdown-menu ${openDropdown === 'rules' ? 'show' : ''}`}>
              <li>
                <Link to="/rules/create" className="dropdown-item">Create Rules</Link>
              </li>
              <li>
                <Link to="/rules/view" className="dropdown-item">View Rules</Link>
              </li>
            </ul>
          </li>
          <li className="nav-item">
            <NavLink to="/deploy" className="nav-link">Visual Inspection</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/deploy" className="nav-link">Execution</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/login" className="nav-link" onClick={handleLogout} >Logout</NavLink>
          </li>
        </ul>
      </nav>
      {/* Render the current route */}
      <Outlet />
    </div>
  );
};

export default Layout;
