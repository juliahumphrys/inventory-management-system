// src/components/NavBar.js
import React, { useState } from 'react';
import './NavBar.css';
import { Link } from 'react-router-dom';

function NavBar() {
  const [query, setQuery] = useState('');

  const handleSearch = async (event) => {
    event.preventDefault();
    if (query) {
      try {
        const response = await fetch(`/api/search?assetTag=${encodeURIComponent(query)}`);
        const result = await response.json();
        console.log(result); // To see results in console; replace with code to display on UI
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }
  };

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/inventory">Inventory</Link></li>
        <li><Link to="/reports">Reports</Link></li>
        <li><Link to="/developers">Developers Page</Link></li>
        <li><Link to="/administrators">Administrators</Link></li>
      </ul>
      <form className="navbar-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by keyword or Asset Number..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="navbar-search-input"
        />
        <button type="submit" className="navbar-search-button">🔍</button>
      </form>
    </nav>
  );
}

export default NavBar;
