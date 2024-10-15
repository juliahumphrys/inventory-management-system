// src/components/NavBar.js
import React from 'react';

function NavBar() {
  return (
    <nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/inventory">Inventory</a></li>
        <li><a href="/reports">Reports</a></li>
      </ul>
    </nav>
  );
}

export default NavBar;
