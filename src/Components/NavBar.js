// src/components/NavBar.js
import React, { useState } from 'react';
import './NavBar.css';
import { Link } from 'react-router-dom';

function NavBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]); // New state to hold search results
  const [error, setError] = useState(null); // Optional: state to handle error messages

  const handleSearch = async (event) => {
    event.preventDefault();
    if (query) {
      try {
        const response = await fetch(`/api/search?itemNumber=${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Failed to fetch results');
        
        const result = await response.json();
        setResults(result); // Store results to state
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error("Error fetching search results:", error);
        setError("Could not fetch search results"); // Set error to state
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
          placeholder="Search by Item Number"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="navbar-search-input"
        />
        <button type="submit" className="navbar-search-button">
          <span role="img" aria-label="search">🔍</span>    
        </button>
      </form>
      
      {/* Render search results */}
      {error && <p className="error-message">{error}</p>}
      {results.length > 0 && (
        <div className="search-results">
          <h4>Search Results:</h4>
          <ul>
            {results.map((item, index) => (
              <li key={index}>{item.name}</li> // Adjust property as needed
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
