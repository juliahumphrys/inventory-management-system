const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 5000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Connect to the SQLite database
const db = new sqlite3.Database('./act_inventory.db', (err) => {
  if (err) {
    console.error('Could not connect to the database', err);
  } else {
    console.log('Connected to the SQLite database');
  }
});

// Create tables if they don't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS itemInfo (
    itemNumber TEXT PRIMARY KEY,
    itemName TEXT NOT NULL,
    itemCategory TEXT NOT NULL,
    itemQuantity INTEGER NOT NULL,
    itemLocation TEXT NOT NULL,
    itemPicture TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS advancedItemInfo (
    itemNumber TEXT PRIMARY KEY,
    itemCost INTEGER NOT NULL,
    itemCondition TEXT NOT NULL,
    itemDescription TEXT NOT NULL,
    FOREIGN KEY(itemNumber) REFERENCES itemInfo(itemNumber)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS historicalItemInfo (
    itemNumber TEXT PRIMARY KEY,
    dateLastUsed TEXT NOT NULL,
    showLastUsed TEXT NOT NULL,
    FOREIGN KEY(itemNumber) REFERENCES itemInfo(itemNumber)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS theaterStatus (
    itemNumber TEXT PRIMARY KEY,
    rentedOut TEXT NOT NULL,
    locationRented TEXT NOT NULL,
    FOREIGN KEY(itemNumber) REFERENCES itemInfo(itemNumber)
  )`);
});

// Routes

// Fetch all items
app.get('/items', (req, res) => {
  const sql = 'SELECT * FROM itemInfo';
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
  const sql = 'INSERT INTO itemInfo (itemNumber, itemName, itemCategory, itemQuantity, itemLocation) VALUES (?, ?, ?, ?, ?)';
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
  const sql = `UPDATE itemInfo
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
  const sql = 'DELETE FROM itemInfo WHERE itemNumber = ?';
  const params = [req.params.id];

  db.run(sql, params, (err) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: 'Item deleted successfully' });
  });
});

// Fetch advanced item info
app.get('/items/:id/advanced', (req, res) => {
  const sql = 'SELECT * FROM advancedItemInfo WHERE itemNumber = ?';
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: row,
    });
  });
});

// Add advanced item info
app.post('/items/:id/advanced', (req, res) => {
  const { itemCost, itemCondition, itemDescription } = req.body;
  const sql = 'INSERT INTO advancedItemInfo (itemNumber, itemCost, itemCondition, itemDescription) VALUES (?, ?, ?, ?)';
  const params = [req.params.id, itemCost, itemCondition, itemDescription];

  db.run(sql, params, (err) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'Advanced item info added successfully',
    });
  });
});

// Update advanced item info
app.put('/items/:id/advanced', (req, res) => {
  const { itemCost, itemCondition, itemDescription } = req.body;
  const sql = `UPDATE advancedItemInfo
               SET itemCost = ?, itemCondition = ?, itemDescription = ?
               WHERE itemNumber = ?`;
  const params = [itemCost, itemCondition, itemDescription, req.params.id];

  db.run(sql, params, (err) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: 'Advanced item info updated successfully' });
  });
});

// Delete advanced item info
app.delete('/items/:id/advanced', (req, res) => {
  const sql = 'DELETE FROM advancedItemInfo WHERE itemNumber = ?';
  const params = [req.params.id];

  db.run(sql, params, (err) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: 'Advanced item info deleted successfully' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


