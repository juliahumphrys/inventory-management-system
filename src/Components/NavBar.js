// src/components/NavBar.js
import React from 'react';
import './NavBar.css';

function NavBar() {
  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li><a href="/">Home</a></li>
        <li><a href="/inventory">Inventory</a></li>
        <li><a href="/reports">Reports</a></li>
      </ul>
    </nav>
  );
}

export default NavBar;
