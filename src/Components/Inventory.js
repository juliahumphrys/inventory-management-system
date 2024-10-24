import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Inventory() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ itemNumber: '', itemName: '', itemCategory: '', itemQuantity: '', itemLocation: '' });
  const [newAdvancedItem, setNewAdvancedItem] = useState({ itemNumber: '', itemCost: '', itemCondition: '', itemDescription: '' });
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false); // Control form visibility
  const [showAdvancedForm, setShowAdvancedForm] = useState(false); // Control advanced form visibility

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
    const { itemCost, itemCondition, itemDescription } = newAdvancedItem;

    // Check regular form fields
    if (!itemNumber || !itemName || !itemCategory || !itemQuantity || !itemLocation) {
      setError('All fields are required.');
      return false;
    }
    if (isNaN(itemQuantity) || itemQuantity <= 0) {
      setError('Quantity must be a positive number.');
      return false;
    }

    // Check advanced form fields
    if (!itemCost || !itemCondition || !itemDescription) {
      setError('All fields in Advanced Item Info are required.');
      return false;
    }
    setError('');
    return true;
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    console.log("Basic Item Info:", newItem); //Should be logging basic item info
    console.log("Advanced Item Info:", newAdvancedItem); //Should be logging advanced item info lol

    try {
      if (editMode) {
        await handleUpdateItem(currentItem.itemNumber, newItem);
        setEditMode(false);
      } else {
        await axios.post('/items', { ...newItem, ...newAdvancedItem });
      }
      fetchItems();
      resetForm();
      setShowAddForm(false); // Hide form after submission
      setShowAdvancedForm(false); // Hide advanced form as well
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
    setNewAdvancedItem({ itemNumber: '', itemCost: '', itemCondition: '', itemDescription: '' });
    setError('');
  };

  const startEditItem = (item) => {
    setCurrentItem(item);
    setNewItem(item);
    setEditMode(true);
    setShowAddForm(true); // Show the form when editing
    setShowAdvancedForm(true); // Show advanced form when editing
  };

  const handleCostInputChange = (e) => {
    const value = e.target.value;
    // Allow only numbers and one decimal point
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(value)) {
      setNewAdvancedItem({ ...newAdvancedItem, itemCost: value });
    }
  };

  return (
    <div>
      <h1>Inventory Page</h1>

      {/* Button to show/hide the regular form */}
      <button onClick={() => {
        setShowAddForm(!showAddForm);
        if (!showAddForm) setShowAdvancedForm(false); // Reset advanced form visibility if hiding the add form
      }}>
        {showAddForm ? 'Hide Form' : 'Add New Item'}
      </button>

      {/* Regular Item Form */}
      {showAddForm && (
        <form>
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
          <select
            value={newItem.itemCategory}
            onChange={(e) => setNewItem({ ...newItem, itemCategory: e.target.value })}
            required
          >
            <option value="" disabled>Select Item Category</option>
            <option value="Category A">Category A</option>
            <option value="Category B">Category B</option>
          </select>

          <input
            type="text"
            placeholder="Item Location"
            value={newItem.itemLocation}
            onChange={(e) => setNewItem({ ...newItem, itemLocation: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Item Quantity"
            value={newItem.itemQuantity}
            onChange={(e) => setNewItem({ ...newItem, itemQuantity: e.target.value })}
            required
          />

          {/* Advanced Item Info Form */}
          {showAddForm && (
            <>
              <button onClick={() => setShowAdvancedForm(!showAdvancedForm)}>
                {showAdvancedForm ? 'Hide Advanced Form' : 'Add Advanced Item Info'}
              </button>
            </>
          )}

          {showAdvancedForm && (
            <div>
              <h2>Advanced Item Info</h2>
              <input
                type="text"
                placeholder="Item Number"
                value={newAdvancedItem.itemNumber}
                onChange={(e) => setNewAdvancedItem({ ...newAdvancedItem, itemNumber: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Item Cost"
                value={newAdvancedItem.itemCost}
                onChange={handleCostInputChange}
                required
              />
              <input
                type="text"
                placeholder="Item Condition"
                value={newAdvancedItem.itemCondition}
                onChange={(e) => setNewAdvancedItem({ ...newAdvancedItem, itemCondition: e.target.value })}
                required
              />
              <textarea
                placeholder="Item Description"
                value={newAdvancedItem.itemDescription}
                onChange={(e) => setNewAdvancedItem({ ...newAdvancedItem, itemDescription: e.target.value })}
                required
              ></textarea>
            </div>
          )}

          {/* Add Item Button */}
          <div style={{ marginTop: '20px' }}>
            <button type="button" onClick={handleAddItem} style={{ margin: '20px 0', padding: '10px 20px' }}>
              {editMode ? 'Update Item' : 'Add Item'}
            </button>
          </div>
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

