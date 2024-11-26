import React, { useState } from 'react';
import './NavBar.css';
import { Link } from 'react-router-dom';

function NavBar() {
  const [query, setQuery] = useState('');
  
  function searchAndOpenNewPage(query) {
    window.open(`/search-results?query=${encodeURIComponent(query)}`, '_blank');
  }

  const handleSearch = async (event) => {
    event.preventDefault();
    if (query) {
      searchAndOpenNewPage(query); 
    }
  };

  return (
    <>
      <nav className="navbar">
        <ul className="navbar-list">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/inventory">Inventory</Link></li>
          <li><Link to="/reports">Reports</Link></li>
          <li><Link to="/developers">Developers Page</Link></li>
          <li><Link to="/login">Administrators</Link></li>
        </ul>
        
        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by Item Number"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="navbar-search-input"
          />
          <button type="submit" className="navbar-search-button">
            <span role="img" aria-label="search">🔍</span>    
          </button>
        </form>
      </nav>
    </>
  );
}

export default NavBar;
