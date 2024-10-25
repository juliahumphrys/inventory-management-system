// src/components/NavBar.js
import React from 'react';
import './NavBar.css';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li><a href="/">Home</a></li>
        <li><a href="/inventory">Inventory</a></li>
        <li><a href="/reports">Reports</a></li>
        <li><a href="/developers">Developers Page</a></li>
        <li><a href="/Administrators">Administrators</a></li>
      </ul>
    </nav>
  );
}

export default NavBar;