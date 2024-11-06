import React, { useState } from 'react';
import './NavBar.css';
import { Link } from 'react-router-dom';

function NavBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]); // Holds search results
  const [error, setError] = useState(null); // Handles error messages

  const handleSearch = async (event) => {
    event.preventDefault();
    if (query) {
      try {
        const response = await fetch(`/items/search?itemNumber=${encodeURIComponent(query)}`);
        const result = await response.json();
        
        setResults(result.data ? [result.data] : []); // Adjust as per result structure
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error("Error fetching search results:", error);
        setError("Could not fetch search results"); // Set error message
      }
    }
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className="navbar">
        <ul className="navbar-list">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/inventory">Inventory</Link></li>
          <li><Link to="/reports">Reports</Link></li>
          <li><Link to="/developers">Developers Page</Link></li>
          <li><Link to="/administrators">Administrators</Link></li>
        </ul>
        
        {/* Search Bar in the Navigation Bar */}
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
      
      {/* Search Results - Outside of Navigation Bar */}
      {error && <p className="error-message">{error}</p>}
      {results.length > 0 && (
        <div className="search-results">
          <h4>Search Results:</h4>
          <ul>
            {results.map((itemInfo, index) => (
              <li key={index}>{itemInfo.itemName}</li> // Display item name
            ))}
          </ul>
        </div>
      )}
    </>
  );
}

export default NavBar;
