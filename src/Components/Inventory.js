import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Inventory() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ itemNumber: '', itemName: '', itemCategory: '', itemQuantity: '', itemLocation: '' });
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false); // Added to control form visibility

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('/items');
      setItems(response.data.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const validateForm = () => {
    const { itemNumber, itemName, itemCategory, itemQuantity, itemLocation } = newItem;
    if (!itemNumber || !itemName || !itemCategory || !itemQuantity || !itemLocation) {
      setError('All fields are required.');
      return false;
    }
    if (isNaN(itemQuantity) || itemQuantity <= 0) {
      setError('Quantity must be a positive number.');
      return false;
    }
    setError('');
    return true;
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editMode) {
        await handleUpdateItem(currentItem.itemNumber, newItem);
        setEditMode(false);
      } else {
        await axios.post('/items', newItem);
      }
      fetchItems();
      resetForm();
      setShowAddForm(false); // Hide form after submission
    } catch (error) {
      console.error('Error adding/updating item:', error);
    }
  };

  const handleUpdateItem = async (itemNumber, updatedItem) => {
    try {
      await axios.put(`/items/${itemNumber}`, updatedItem);
      fetchItems();
      resetForm();
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDeleteItem = async (itemNumber) => {
    try {
      await axios.delete(`/items/${itemNumber}`);
      fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const resetForm = () => {
    setNewItem({ itemNumber: '', itemName: '', itemCategory: '', itemQuantity: '', itemLocation: '' });
    setError('');
  };

  const startEditItem = (item) => {
    setCurrentItem(item);
    setNewItem(item);
    setEditMode(true);
    setShowAddForm(true); // Show the form when editing
  };

  return (
    <div>
      <h1>Inventory Page</h1>

      {/* Button to show/hide the form */}
      <button onClick={() => setShowAddForm(!showAddForm)}>
        {showAddForm ? 'Hide Form' : 'Add New Item'}
      </button>

      {/* Form is only shown if showAddForm is true */}
      {showAddForm && (
        <form onSubmit={handleAddItem}>
          <h2>{editMode ? 'Edit Item' : 'Add a New Item'}</h2>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <input
            type="text"
            placeholder="Item Number"
            value={newItem.itemNumber}
            onChange={(e) => setNewItem({ ...newItem, itemNumber: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Item Name"
            value={newItem.itemName}
            onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Item Category"
            value={newItem.itemCategory}
            onChange={(e) => setNewItem({ ...newItem, itemCategory: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Item Location"
            value={newItem.itemLocation}
            onChange={(e) => setNewItem({ ...newItem, itemLocation: e.target.value })}
            required
          />
          <select
            value={newItem.itemQuantity}
            onChange={(e) => setNewItem({ ...newItem, itemQuantity: e.target.value })}
          >
            {Array.from({ length: 20 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <button type="submit">{editMode ? 'Update Item' : 'Add Item'}</button>
          {editMode && <button type="button" onClick={resetForm}>Cancel</button>}
        </form>
      )}

      <div>
        <h2>Items in Inventory</h2>
        {items.length > 0 ? (
          <ul>
            {items.map((item) => (
              <li key={item.itemNumber}>
                <strong>{item.itemName}</strong> - {item.itemCategory} - Quantity: {item.itemQuantity} - Location: {item.itemLocation}
                <button onClick={() => startEditItem(item)}>Edit</button>
                <button onClick={() => handleDeleteItem(item.itemNumber)}>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No items found.</p>
        )}
      </div>
    </div>
  );
}

export default Inventory;
