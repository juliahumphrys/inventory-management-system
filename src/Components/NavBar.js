// src/components/NavBar.js
import React from 'react';
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