import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './Components/NavBar';
import './App.css'; 
import axios from 'axios'; 

function App() {
  return (
    <Router>
      <div className="App">
        {/* Banner and Header */}
        <header className="app-header">
          <h1>StageTrack</h1>
        </header>

        <NavBar />

        {/* Routing to different pages */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return <h1>Welcome to the Home Page</h1>;
}

function Inventory() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ itemNumber: '', itemName: '', itemCategory: '', itemQuantity: '', itemLocation: '' });

  // Fetch items from the server when the component loads
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

  const handleAddItem = async () => {
    try {
      await axios.post('/items', newItem);
      fetchItems(); // Refresh the list after adding a new item
      setNewItem({ itemNumber: '', itemName: '', itemCategory: '', itemQuantity: '', itemLocation: '' });
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const handleUpdateItem = async (itemNumber, updatedItem) => {
    try {
      await axios.put(`/items/${itemNumber}`, updatedItem);
      fetchItems(); // Refresh the list after updating an item
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDeleteItem = async (itemNumber) => {
    try {
      await axios.delete(`/items/${itemNumber}`);
      fetchItems(); // Refresh the list after deleting an item
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div>
      <h1>Inventory Page</h1>

      {/* Add New Item Form */}
      <div>
        <h2>Add a New Item</h2>
        <input
          type="text"
          placeholder="Item Number"
          value={newItem.itemNumber}
          onChange={(e) => setNewItem({ ...newItem, itemNumber: e.target.value })}
        />
        <input
          type="text"
          placeholder="Item Name"
          value={newItem.itemName}
          onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
        />
        <input
          type="text"
          placeholder="Item Category"
          value={newItem.itemCategory}
          onChange={(e) => setNewItem({ ...newItem, itemCategory: e.target.value })}
        />
        <input
          type="text"
          placeholder="Item Quantity"
          value={newItem.itemQuantity}
          onChange={(e) => setNewItem({ ...newItem, itemQuantity: e.target.value })}
        />
        <input
          type="text"
          placeholder="Item Location"
          value={newItem.itemLocation}
          onChange={(e) => setNewItem({ ...newItem, itemLocation: e.target.value })}
        />
        <button onClick={handleAddItem}>Add Item</button>
      </div>

      {/* Inventory List */}
      <div>
        <h2>Items in Inventory</h2>
        {items.length > 0 ? (
          <ul>
            {items.map((item) => (
              <li key={item.itemNumber}>
                <strong>{item.itemName}</strong> - {item.itemCategory} - Quantity: {item.itemQuantity} - Location: {item.itemLocation}
                <button onClick={() => handleDeleteItem(item.itemNumber)}>Delete</button>
                {/* You can also implement an update functionality here */}
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

function Reports() {
  return <h1>Reports Page</h1>;
}

export default App;
