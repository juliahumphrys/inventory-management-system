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

  // Fetch search results whenever the query changes
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`/items/search?itemNumber=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        const result = await response.json();
        if (result.success) {
          setResults(result.data ? [result.data] : []);
          setError(null);
        } else {
          setError('No results found.');
        }
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

  // Handles changes to the input field
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingItem((prev) => ({ ...prev, [name]: value }));
  };

  // Submits the edited item data
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

      // Optional: Refresh search results after an edit
      navigate(`/search-results?query=${editingItem.itemNumber}`);
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Could not update item');
    }
  };

  // Edit button click handler
  const handleEdit = (item) => {
    setEditingItem(item);
  };

  return (
    <div className="search-results-container">
      <h1>Search Results</h1>
      <p>Item Number: {query}</p>
      {loading && <p>Loading...</p>}
      {error && !loading && <p className="error-message">{error}</p>}
      {results.length > 0 && !loading && (
        <ul className="results-list">
          {results.map((item, index) => (
            <li key={index} className="result-item">
              {editingItem && editingItem.itemNumber === item.itemNumber ? (
                <div className="edit-form">
<<<<<<< Updated upstream
                  <strong>Item Name:</strong>
                  <input
                    type="text"
                    name="itemName"
                    value={editingItem.itemName}
                    onChange={handleEditChange}
                  />
                  <strong>Item Description:</strong>
                  <input
                    type="text"
                    name="itemDescription"
                    value={editingItem.itemDescription}
                    onChange={handleEditChange}
                  />
                  <strong>Item Category:</strong>
                  <select
                    name="itemCategory"
                    value={editingItem.itemCategory}
                    onChange={handleEditChange}>
                  <option value="" disabled>Select Item Category</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Animals">Animals</option>
                  <option value="Documents and Money">Documents and Money</option>
                  <option value="Food">Food</option>
                  <option value="Games">Games</option>
                  <option value="Religion">Religion</option>
                  <option value="Hand Props">Hand Props</option>
                  <option value="Liquor Bottles">Liquor Bottles</option>
                  <option value="Medical Instruments">Medical Instruments</option>
                  <option value="Kitchen Items">Kitchen Items</option>
                  <option value="Musical Instruments">Musical Instruments</option>
                  <option value="Holiday">Holiday</option>
                  <option value="Miscellaneous">Miscellaneous</option>
                  <option value="Foam">Lighting</option>
                </select>


                  <strong>Item Quantity:</strong>
                  <input
                    type="number"
                    name="itemQuantity"
                    value={editingItem.itemQuantity}
                    onChange={handleEditChange}
                  />
                  <strong>Item Location:</strong>
                  <input
                    type="text"
                    name="itemLocation"
                    value={editingItem.itemLocation}
                    onChange={handleEditChange}
                  />
                  <strong>Item Condition:</strong>
                  <select
                    name="itemCondition"
                    value={editingItem.itemCondition}
                    onChange={handleEditChange}>
                  <option value="" disabled>Selct Item Condition</option>
                  <option value="New">New</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Used">Used</option>
                  <option value="Fair">Fair</option>
                  <option value="Bad">Bad</option>
                  <option value="Disposed">Disposed</option>
                  </select>

                  <strong>Date Last Used:</strong>
                  <input
                  type="date"
                  name="dateLastUsed"
                  value={editingItem.dateLastUsed}
                  onChange={handleEditChange}
                  />

                  <strong>Show Last Used: </strong>
                  <input
                    name="showLastUsed"
                    value={editingItem.showLastUsed}
                    onChange={handleEditChange}
                  />

                  <strong>Rent Status: </strong>
                  <select
                    name="isRented"
                    value={editingItem.isRented}
                    onChange={handleEditChange}
                    >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  </select>

                  {item.isRented === 'Yes' && (
                      <>
                  <strong>Theater Renting the Item:</strong>
                  <input
                    type="text"
                    name="theaterName"
                    value={editingItem.theaterName}
                    onChange={handleEditChange}
                  />
                  </>)}


=======
                  <label>
                    <strong>Item Name:</strong>
                    <input
                      type="text"
                      name="itemName"
                      value={editingItem.itemName}
                      onChange={handleEditChange}
                    />
                  </label>
                  <label>
                    <strong>Item Description:</strong>
                    <input
                      type="text"
                      name="itemDescription"
                      value={editingItem.itemDescription || ''}
                      onChange={handleEditChange}
                    />
                  </label>
                  <label>
                    <strong>Item Category:</strong>
                    <select
                      name="itemCategory"
                      value={editingItem.itemCategory}
                      onChange={handleEditChange}
                    >
                      <option value="" disabled>Select Item Category</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Animals">Animals</option>
                      <option value="Documents and Money">Documents and Money</option>
                      <option value="Food">Food</option>
                      <option value="Games">Games</option>
                      <option value="Religion">Religion</option>
                      <option value="Hand Props">Hand Props</option>
                      <option value="Liquor Bottles">Liquor Bottles</option>
                      <option value="Medical Instruments">Medical Instruments</option>
                      <option value="Kitchen Items">Kitchen Items</option>
                      <option value="Musical Instruments">Musical Instruments</option>
                      <option value="Holiday">Holiday</option>
                      <option value="Miscellaneous">Miscellaneous</option>
                      <option value="Foam">Lighting</option>
                    </select>
                  </label>
                  <label>
                    <strong>Item Quantity:</strong>
                    <input
                      type="number"
                      name="itemQuantity"
                      value={editingItem.itemQuantity}
                      onChange={handleEditChange}
                    />
                  </label>
                  <label>
                    <strong>Item Location:</strong>
                    <input
                      type="text"
                      name="itemLocation"
                      value={editingItem.itemLocation}
                      onChange={handleEditChange}
                    />
                  </label>
>>>>>>> Stashed changes
                  <button onClick={submitEdit} className="save-button">Save</button>
                  <button onClick={() => setEditingItem(null)} className="cancel-button">Cancel</button>
                </div>
              ) : (
                <div>
                  <strong>Item Name:</strong> {item.itemName} <br />
<<<<<<< Updated upstream
                  <strong>Item Image:</strong> {item.itemImage} <br />
                  <strong>Description:</strong> {item.itemDescription} <br />
=======
                  <strong>Description:</strong> {item.itemDescription || 'No description available'} <br />
>>>>>>> Stashed changes
                  <strong>Category:</strong> {item.itemCategory} <br />
                  <strong>Quantity:</strong> {item.itemQuantity} <br />
                  <strong>Location:</strong> {item.itemLocation} <br />
                  <strong>Item Condition: </strong> {item.itemCondition} <br />
                  <strong>Date Last Used:</strong> {item.dateLastUsed} <br />
                  <strong>Show Last Used: </strong> {item.showLastUsed} <br />
                  <strong>Rent Status: </strong> {item.isRented} <br />
                  {item.IsRented === 'Yes' && (
                        <>
                    <strong>Theater Name:</strong> {item.theaterName} <br /> </>
                  )}


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
      )}
    </div>
  );
};

export default SearchResults;
