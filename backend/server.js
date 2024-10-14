const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 5000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Connect to the SQLite database
const db = new sqlite3.Database('./theater_inventory.db', (err) => {
  if (err) {
    console.error('Could not connect to the database', err);
  } else {
    console.log('Connected to the SQLite database');
  }
});

// Create tables if they don't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS Item_Info (
    itemNumber TEXT PRIMARY KEY,
    itemName TEXT NOT NULL,
    itemCategory TEXT NOT NULL,
    itemQuantity INTEGER NOT NULL,
    itemLocation TEXT NOT NULL,
    itemPicture TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Advanced_Item_Info (
    itemNumber TEXT PRIMARY KEY,
    itemCost INTEGER NOT NULL,
    itemCondition TEXT NOT NULL,
    itemDescription TEXT NOT NULL,
    FOREIGN KEY(itemNumber) REFERENCES Item_Info(itemNumber)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Historical_Item_Info (
    itemNumber TEXT PRIMARY KEY,
    dateLastUsed TEXT NOT NULL,
    showLastUsed TEXT NOT NULL,
    FOREIGN KEY(itemNumber) REFERENCES Item_Info(itemNumber)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Theater_Status (
    itemNumber TEXT PRIMARY KEY,
    rentedOut TEXT NOT NULL,
    locationRented TEXT NOT NULL,
    FOREIGN KEY(itemNumber) REFERENCES Item_Info(itemNumber)
  )`);
});

// Routes

// Fetch all items
app.get('/items', (req, res) => {
  const sql = 'SELECT * FROM Item_Info';
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

// Add a new item
app.post('/items', (req, res) => {
  const { itemNumber, itemName, itemCategory, itemQuantity, itemLocation } = req.body;
  const sql = 'INSERT INTO Item_Info (itemNumber, itemName, itemCategory, itemQuantity, itemLocation) VALUES (?, ?, ?, ?, ?)';
  const params = [itemNumber, itemName, itemCategory, itemQuantity, itemLocation];

  db.run(sql, params, (err) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'Item added successfully',
    });
  });
});

// Update an item
app.put('/items/:id', (req, res) => {
  const { itemName, itemCategory, itemQuantity, itemLocation } = req.body;
  const sql = `UPDATE Item_Info
               SET itemName = ?, itemCategory = ?, itemQuantity = ?, itemLocation = ?
               WHERE itemNumber = ?`;
  const params = [itemName, itemCategory, itemQuantity, itemLocation, req.params.id];

  db.run(sql, params, (err) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: 'Item updated successfully' });
  });
});

// Delete an item
app.delete('/items/:id', (req, res) => {
  const sql = 'DELETE FROM Item_Info WHERE itemNumber = ?';
  const params = [req.params.id];

  db.run(sql, params, (err) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: 'Item deleted successfully' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

