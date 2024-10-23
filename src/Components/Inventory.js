import React, { useState } from 'react';
import axios from 'axios';

function Inventory() {
<<<<<<< HEAD
  // States to capture form input
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [itemLocation, setItemLocation] = useState('');
  const [message, setMessage] = useState(''); // State for confirmation message

  // Function to randomize the itemNumber for a new item added
  const generateItemNumber = () => {
    // Convert the current number to a string and ensure it's 5 digits long (e.g., 00001)
    const itemNumber = currentItemNumber.toString().padStart(5, '0');
    setCurrentItemNumber((prevNumber) => prevNumber + 1); // Increment the item number for the next item
    return itemNumber;
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    // Validate inputs before sending
    if (!itemName || !itemCategory || !itemQuantity || !itemLocation) {
      setMessage('Please fill in all fields.');
      return;
    }

    const newItem = {
      itemNumber: generateItemNumber(),
      itemName,
      itemCategory,
      itemQuantity: parseInt(itemQuantity, 10), // Convert to integer
      itemLocation,
    };

    try {
      // POST request to send the data to the backend
      const response = await axios.post('http://localhost:5000/items', newItem);
      console.log(response.data); // Handle the response as needed
      setMessage('Item added successfully!'); // Success message
      // Reset the form
      setItemName('');
      setItemCategory('');
      setItemQuantity('');
      setItemLocation('');
    } catch (error) {
      console.error('Error adding item:', error);
      setMessage('Error adding item. Please try again.'); // Error message
    }
  };

  return (
    <div className="inventory-page">
      <h1>Inventory Page</h1>

      {/* Confirmation message */}
      {message && <p>{message}</p>}

      {/* Inventory Form */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Item Name:</label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Item Category:</label>
          <input
            type="text"
            value={itemCategory}
            onChange={(e) => setItemCategory(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Item Quantity:</label>
          <input
            type="number"
            value={itemQuantity}
            onChange={(e) => setItemQuantity(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Item Location:</label>
          <input
            type="text"
            value={itemLocation}
            onChange={(e) => setItemLocation(e.target.value)}
            required
          />
        </div>
        <button type="submit">Add Item</button>
      </form>
=======
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
>>>>>>> 8bfefa11efd7f3ba0fd3a11167f3f4611ac931f8
    </div>
  );
}

export default Inventory;
