import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SearchResults.css';

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query');
  const navigate = useNavigate();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null); 

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`/items/search?itemNumber=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        const result = await response.json();
        setResults(result.data ? [result.data] : []);
        setError(null);
      } catch (err) {
        setError('Error fetching search results');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingItem((prev) => ({ ...prev, [name]: value }));
  };

  const submitEdit = async () => {
    try {
      const response = await fetch(`/items/${editingItem.itemNumber}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingItem),
      });

      if (!response.ok) throw new Error('Failed to update item');
      const result = await response.json();
      alert(result.message);
      setEditingItem(null); 
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Could not update item");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item); 
  };

  return (
    <div className="search-results-container">
      <h1>Search Results</h1>
      <p>Query: {query}</p>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {results.length > 0 ? (
        <ul className="results-list">
          {results.map((item, index) => (
            <li key={index} className="result-item">
              {editingItem && editingItem.itemNumber === item.itemNumber ? (
                <div className="edit-form">
                  
                  <input
                    type="text"
                    name="itemName"
                    value={editingItem.itemName}
                    onChange={handleEditChange}
                  />
                  <input
                    type="text"
                    name="itemDescription"
                    value={editingItem.itemDescription}
                    onChange={handleEditChange}
                  />
                  <input
                    type="text"
                    name="itemCategory"
                    value={editingItem.itemCategory}
                    onChange={handleEditChange}
                  />
                  <input
                    type="number"
                    name="itemQuantity"
                    value={editingItem.itemQuantity}
                    onChange={handleEditChange}
                  />
                  <input
                    type="text"
                    name="itemLocation"
                    value={editingItem.itemLocation}
                    onChange={handleEditChange}
                  />
                  <button onClick={submitEdit} className="save-button">Save</button>
                  <button onClick={() => setEditingItem(null)} className="cancel-button">Cancel</button>
                </div>
              ) : (
                <div>
                  <strong>Item Name:</strong> {item.itemName} <br />
                  <strong>Description:</strong> {item.itemDescription} <br />
                  <strong>Category:</strong> {item.itemCategory} <br />
                  <strong>Quantity:</strong> {item.itemQuantity} <br />
                  <strong>Location:</strong> {item.itemLocation} <br />
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        !loading && <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchResults;
