const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path'); // For handling paths

const app = express();
const port = 3000;


// Middleware
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(express.static('public'));
app.use(express.json());

// Connect to the SQLite database 
const db = new sqlite3.Database('./act_inventory.db', (err) => {
  if (err) {
    console.error('Could not connect to the database', err);
  } else {
    console.log('Connected to the SQLite database');

    // Test the connection and create a test table
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS testConnection (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
      )`, (err) => {
        if (err) {
          console.error('Error creating test table:', err);
        } else {
          console.log('Test table created or already exists');
        }
      });

      // Insert test data
      db.run(`INSERT INTO testConnection (name) VALUES (?)`, ['Test Name'], function (err) {
        if (err) {
          console.error('Error inserting test data:', err);
        } else {
          console.log('Test data inserted with id:', this.lastID);
        }
      });

      // Fetch test data
      db.all(`SELECT * FROM testConnection`, [], (err, rows) => {
        if (err) {
          console.error('Error fetching test data:', err);
        } else {
          console.log('Test data fetched:', rows);
        }
      });
    });
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
    itemCost REAL NOT NULL, /* Changed to REAL for decimal support */
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

  db.run(`CREATE TABLE IF NOT EXISTS adminAccounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )`);
});

// Routes 

// Fetch all items 
app.get('/items', (req, res) => {
  const sql = 'SELECT * FROM itemInfo';
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'success', data: rows });
  });
});

// Add a new item
app.post('/items', (req, res) => {
  const { itemNumber, itemName, itemCategory, itemQuantity, itemLocation } = req.body;
  const sql = 'INSERT INTO itemInfo (itemNumber, itemName, itemCategory, itemQuantity, itemLocation) VALUES (?, ?, ?, ?, ?)';
  const params = [itemNumber, itemName, itemCategory, itemQuantity, itemLocation];

  console.log("Adding item:", params); // Log the item being added

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'Item added successfully', id: this.lastID });
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
      return res.status(400).json({ error: err.message });
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
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'Item deleted successfully' });
  });
});

// Fetch advanced item info
app.get('/items/:id/advanced', (req, res) => {
  const sql = 'SELECT * FROM advancedItemInfo WHERE itemNumber = ?';
  db.get(sql, [req.params.id], (err, row) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'success', data: row });
  });
});

// Add advanced item info
app.post('/items/:id/advanced', (req, res) => {
  const { itemCost, itemCondition, itemDescription } = req.body;
  const sql = 'INSERT INTO advancedItemInfo (itemNumber, itemCost, itemCondition, itemDescription) VALUES (?, ?, ?, ?)';
  const params = [req.params.id, itemCost, itemCondition, itemDescription];

  console.log("Adding advanced item info:", params); // Log the advanced item info being added

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'Advanced item info added successfully', id: this.lastID });
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
      return res.status(400).json({ error: err.message });
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
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'Advanced item info deleted successfully' });
  });
});

// Add historical item info
app.post('/items/:id/historical', (req, res) => {
  const { dateLastUsed, showLastUsed } = req.body;
  const sql = 'INSERT INTO historicalItemInfo (itemNumber, dateLastUsed, showLastUsed) VALUES (?, ?, ?)';
  const params = [req.params.id, dateLastUsed, showLastUsed];

  console.log("Adding historical item info:", params); // Log the historical item info being added

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'Historical item info added successfully', id: this.lastID });
  });
});
app.get('/api/search', (req, res) => {
  const assetTag = req.query.assetTag;
  const sql = `SELECT * FROM items WHERE asset_tag_id = ?`;
  db.get(sql, [itemNumber], (err, row) => {
      if (err) {
          res.status(500).json({ error: err.message });
          return;
      }
      res.json(row ? row : { message: "No item found with that asset tag ID" });
  });
});

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
