import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Inventory() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ itemNumber: '', itemName: '', itemCategory: '', itemQuantity: '', itemLocation: '' });
  const [newAdvancedItem, setNewAdvancedItem] = useState({ itemNumber: '', itemCost: '', itemCondition: '', itemDescription: '' });
  const [historicalItemInfo, setHistoricalItemInfo] = useState({ itemNumber: '', dateLastUsed: '', showLastUsed: false });
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false); // Control form visibility
  const [showAdvancedForm, setShowAdvancedForm] = useState(false); // Control advanced form visibility
  const [showHistoricalForm, setShowHistoricalForm] = useState(false);

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
      setShowHistoricalForm(false);
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

  const handleHistoricalInputChange = (e) => {
    const { name, value } = e.target;
    setHistoricalItemInfo({ ...historicalItemInfo, [name]: value });
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

          <select
            value={newItem.itemLocation}
            onChange={(e) => setNewItem({ ...newItem, itemLocation: e.target.value })}
            required
          >
            <option value="" disabled>Select Item Location</option>
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

          {/* Historical Item Info Form */}
          <button type="button" onClick={() => setShowHistoricalForm(!showHistoricalForm)}>
            {showHistoricalForm ? 'Hide Historical Info' : 'Add Historical Item Info'}
          </button>

          {showHistoricalForm && (
  <div>
    <h2>Historical Item Info</h2>
    <input
      type="text"
      name="itemNumber"
      placeholder="Item Number"
      value={historicalItemInfo.itemNumber}
      onChange={handleHistoricalInputChange}
      required
    />
    <input
      type="date"
      name="dateLastUsed"
      value={historicalItemInfo.dateLastUsed}
      onChange={handleHistoricalInputChange}
    />
    <input
      type="text" // Text input for "Show Last Used"
      name="showLastUsed"
      placeholder="Enter Show Last Used" // Updated placeholder
      value={historicalItemInfo.showLastUsed} // Bind to historicalItemInfo.showLastUsed
      onChange={(e) => setHistoricalItemInfo({ ...historicalItemInfo, showLastUsed: e.target.value })} // Handle input change
    />

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