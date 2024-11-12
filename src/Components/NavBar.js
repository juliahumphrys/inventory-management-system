import React, { useState } from 'react';
import './NavBar.css';
import { Link } from 'react-router-dom';


function NavBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]); // Holds search results
  const [error, setError] = useState(null); // Handles error messages
  const [editingItem, setEditingItem] = useState(null); // Track the item being edited

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
    setEditingItem(null); // Close edit form after successful update
    handleSearch(); // Refresh the search results
  } catch (error) {
    console.error("Error updating item:", error);
    alert("Could not update item");
  }
};

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
  <li key={index}>
    <strong>Item Name:</strong> {itemInfo.itemName} <br />
    <strong>Description:</strong> {itemInfo.itemDescription} <br />
    <strong>Category:</strong> {itemInfo.itemCategory} <br />
    <strong>Quantity:</strong> {itemInfo.itemQuantity} <br />
    <strong>Location:</strong> {itemInfo.itemLocation} <br />
    <div className="edit-item-button-box">
      <button className="edit-item-button" onClick={() => setEditingItem(itemInfo)}>
        Edit Item
      </button>
    </div>
  </li>
))}

    </ul>
  </div>
)}
{editingItem && (
  <div className="edit-form-container">
    <h4>Edit Item</h4>
    <form className="edit-form" onSubmit={(e) => { e.preventDefault(); submitEdit(); }}>
      <label>
        Item Name:
        <input
          type="text"
          name="itemName"
          value={editingItem.itemName}
          onChange={handleEditChange}
        />
      </label>
      <label>
        Description:
        <input
          type="text"
          name="itemDescription"
          value={editingItem.itemDescription}
          onChange={handleEditChange}
        />
      </label>
      <label>
        Item Category:
        <select
        value={editingItem.itemLocation}
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

      <label>
        Location:
        <select
        value={editingItem.itemLocation}
        onChange={handleEditChange}
        >
            <option value="" disabled>Select Item Location</option>
            <option value="In Use for Show">In Use for Show</option>
            <option value="Greenroom, Prop Bin 1">Greenroom, Prop Bin 1</option>
            <option value="Greenroom, Prop Bin 2">Greenroom, Prop Bin 2</option>
            <option value="Greenroom, Prop Bin 3">Greenroom, Prop Bin 3</option>
            <option value="Greenroom, Prop Bin 4">Greenroom, Prop Bin 4</option>
            <option value="Greenroom, Prop Bin 5">Greenroom, Prop Bin 5</option>
            <option value="Greenroom, Prop Bin 6">Greenroom, Prop Bin 6</option>
            <option value="Greenroom, Prop Bin 7">Greenroom, Prop Bin 7</option>
            <option value="Greenroom, Prop Bin 8">Greenroom, Prop Bin 8</option>
            <option value="Greenroom, Prop Bin 9">Greenroom, Prop Bin 9</option>
            <option value="Greenroom, Prop Bin 10">Greenroom, Prop Bin 10</option>
            <option value="Greenroom, Prop Bin 11">Greenroom, Prop Bin 11</option>
            <option value="Greenroom, Prop Bin 12">Greenroom, Prop Bin 12</option>
            <option value="Greenroom, Prop Bin 13">Greenroom, Prop Bin 13</option>
            <option value="Greenroom, Prop Bin 14">Greenroom, Prop Bin 14</option>
            <option value="Greenroom, Prop Bin 15">Greenroom, Prop Bin 15</option>
            <option value="Greenroom, Prop Bin 16">Greenroom, Prop Bin 16</option>
            <option value="Greenroom, Prop Bin 17">Greenroom, Prop Bin 17</option>
            <option value="Greenroom, Prop Bin 18">Greenroom, Prop Bin 18</option>
            <option value="Greenroom, Prop Bin 19">Greenroom, Prop Bin 19</option>
            <option value="Greenroom, Prop Bin 20">Greenroom, Prop Bin 20</option>
            <option value="Workshop">Workshop</option>
            <option value="Storage Unit">Storage Unit</option>
            <option value="Costume Loft, Rack 1">Costume Loft, Rack 1</option>
            <option value="Costume Loft, Rack 2">Costume Loft, Rack 2</option>
            <option value="Costume Loft, Rack 3">Costume Loft, Rack 3</option>
            <option value="Costume Loft, Rack 4">Costume Loft, Rack 4</option>
            <option value="Costume Loft, Rack 5">Costume Loft, Rack 5</option>
            <option value="Costume Loft, Rack 6">Costume Loft, Rack 6</option>
            <option value="Costume Loft, Rack 7">Costume Loft, Rack 7</option>
            <option value="Costume Loft, Rack 8">Costume Loft, Rack 8</option>
            <option value="Costume Loft, Rack 9">Costume Loft, Rack 9</option>
            <option value="Costume Loft, Rack 10">Costume Loft, Rack 10</option>
            <option value="Costume Loft, Shelves">Costume Loft, Shelves</option>
        </select>
      </label>
      <label>
        Quantity:
        <input
        type="number"
        name="itemQuantity"
        value={editingItem.itemQuantity}
        onChange={handleEditChange}
        />
      </label>
      <button type="submit">Save Changes</button>
      <button type="button" onClick={() => setEditingItem(null)}>Cancel</button>
      </label>
      
    </form>
  </div>
)}

    </>
  );
}

export default NavBar;
