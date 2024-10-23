import React, { useState } from 'react';
import axios from 'axios';

function Inventory() {
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
    </div>
  );
}

export default Inventory;
