import React from 'react';
import { Outlet } from 'react-router-dom';
import logo from '../IIITH_logo.png';
import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/js/bootstrap.bundle';

const Layoutbase = () => {

  return (
    <div className="container" >
      {/* Logo and Heading */}
      <div className="d-flex align-items-center justify-content-between">
        <img src={logo} alt="Logo" width="180" />
        <h1 className="mr-3">Visual Inspection Tool</h1>
      </div>
      {/* Render the current route */}
      <Outlet />
    </div>
  );
};

export default Layoutbase;
