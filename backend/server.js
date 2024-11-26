const express = require('express');
console.log('Server is running!');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path'); // For handling paths
const bodyParser = require('body-parser');

const app = express();
<<<<<<< Updated upstream
const port = 3000;

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
=======
const port = process.env.PORT || 3001;
const publicIP = process.env.PUBLIC_IP;
const privateIP = process.env.PRIVATE_IP;
const baseUrl = process.env.BASE_URL;
const baseDomain = process.env.BASE_DOMAIN || 'http://localhost';

console.log('Public IP:', process.env.PUBLIC_IP);
console.log('Private IP:', process.env.PRIVATE_IP);

// Middleware

app.use(cors({
  origin: ['https://actinventory.com', 'http://localhost:3000'], // Allow production and local domains
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow cookies
})); // Enables Cross-Origin Resource Sharing

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
>>>>>>> Stashed changes
app.use('/uploads', express.static('uploads'));

// Middleware
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to the SQLite database 
const db = new sqlite3.Database('./act_inventory.db', (err) => {
  if (err) {
    console.error('Could not connect to the database', err);
  } else {
    console.log('Connected to the SQLite database');

    // Test the connection and create a test table
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS testConnection (
        id INTEGER PRIMARY KEY,
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
    itemNumber TEXT PRIMARY KEY AUTOINCREMENT,
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
    res.json({ message: 'Item added successfully'});
  });
});

// Update an item
app.put('/items/:itemNumber', (req, res) => {
  const { itemName, itemCategory, itemQuantity, itemLocation } = req.body;
  const sql = `UPDATE itemInfo
               SET itemName = ?, itemCategory = ?, itemQuantity = ?, itemLocation = ?
               WHERE itemNumber = ?`;
  const params = [itemName, itemCategory, itemQuantity, itemLocation, req.params.itemNumber];

  db.run(sql, params, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'Item updated successfully' });
  });
});

// Delete an item
app.delete('/items/:itemNumber', (req, res) => {
  const sql = 'DELETE FROM itemInfo WHERE itemNumber = ?';
  const params = [req.params.itemNumber];
  db.run(sql, params, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'Item deleted successfully' });
  });
});

// Fetch advanced item info
app.get('/items/:itemNumber/advanced', (req, res) => {
  const sql = 'SELECT * FROM advancedItemInfo WHERE itemNumber = ?';
  db.get(sql, [req.params.itemNumber], (err, row) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'success', data: row });
  });
});

// Add advanced item info
app.post('/items/:itemNumber/advanced', (req, res) => {
  const { itemCost, itemCondition, itemDescription } = req.body;
  const sql = 'INSERT INTO advancedItemInfo (itemNumber, itemCost, itemCondition, itemDescription) VALUES (?, ?, ?, ?)';
  const params = [req.params.itemNumber, itemCost, itemCondition, itemDescription];

  console.log("Adding advanced item info:", params); // Log the advanced item info being added

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'Advanced item info added successfully', id: this.lastID });
  });
});

// Update advanced item info
app.put('/items/:itemNumber/advanced', (req, res) => {
  const { itemCost, itemCondition, itemDescription } = req.body;
  const sql = `UPDATE advancedItemInfo
               SET itemCost = ?, itemCondition = ?, itemDescription = ?
               WHERE itemNumber = ?`;
  const params = [itemCost, itemCondition, itemDescription, req.params.itemNumber];

  db.run(sql, params, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'Advanced item info updated successfully' });
  });
});

// Delete advanced item info
app.delete('/items/:itemNumber/advanced', (req, res) => {
  const sql = 'DELETE FROM advancedItemInfo WHERE itemNumber = ?';
  const params = [req.params.itemNumber];

  db.run(sql, params, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'Advanced item info deleted successfully' });
  });
});

// Add historical item info
app.post('/items/:itemNumber/historical', (req, res) => {
  const { dateLastUsed, showLastUsed } = req.body;
  const sql = 'INSERT INTO historicalItemInfo (itemNumber, dateLastUsed, showLastUsed) VALUES (?, ?, ?)';
  const params = [req.params.itemNumber, dateLastUsed, showLastUsed];

  console.log("Adding historical item info:", params); // Log the historical item info being added

  db.run(sql, params, function (err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.json({ message: 'Historical item info added successfully', id: this.lastID });
  });
});

app.post('/AdminLogin', (req, res) => {
  console.log('Received POST request to /AdminLogin');
  console.log('Request body:', req.body);
  const { username, password } = req.body;

  //Validate input
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  //Query to find the user
  const sql = 'SELECT * FROM adminAccounts WHERE username = ? AND password = ?';
  db.get(sql, [username, password], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!row) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    // Successful login
    res.json({ message: 'Login successful!', user: { username: row.username } });
  });
});  

//search bar
app.get('/items/search', (req, res) => {
  const { itemNumber } = req.query;
    console.log('Test1, itemNumber is', itemNumber || 'No itemNumber passed');
  if (!itemNumber) {
    return res.status(400).json({ success: false, error: "itemNumber parameter is required" });
  }
  const sql = `SELECT * FROM itemInfo WHERE itemNumber = ?`;
  db.get(sql, [itemNumber], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    if (!row) {
      return res.status(404).json({ success: false, message: "No item found with that item number" });
    }
    res.json({ success: true, data: row });
  });
});


// Search bar with data from multiple tables
app.get('/items/search', (req, res) => {
  const { itemNumber } = req.query;
  console.log('Test1, itemNumber is', itemNumber || 'No itemNumber passed');

  if (!itemNumber) {
    return res.status(400).json({ success: false, error: "itemNumber parameter is required" });
  }

  // Use LEFT JOIN to combine data from the three tables based on itemNumber
  const sql = `
    SELECT 
      itemInfo.*,
      advancedItemInfo.itemCost, 
      advancedItemInfo.itemCondition, 
      advancedItemInfo.itemDescription,
      historicalItemInfo.dateLastUsed,
      historicalItemInfo.showLastUsed
    FROM 
      itemInfo 
    LEFT JOIN 
      advancedItemInfo ON itemInfo.itemNumber = advancedItemInfo.itemNumber
    LEFT JOIN 
      historicalItemInfo ON itemInfo.itemNumber = historicalItemInfo.itemNumber
    WHERE 
      itemInfo.itemNumber = ?
  `;

  db.get(sql, [itemNumber], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
    if (!row) {
      return res.status(404).json({ success: false, message: "No item found with that item number" });
    }
    res.json({ success: true, data: row });
  });
});
<<<<<<< Updated upstream
=======


app.get('/test', (req, res) => {
  console.log('Test route hit');
  res.send('Server is working!');
});


// Endpoint to add a New Admin
app.post('/admins', (req, res) => {
  const { username, password } = req.body;
>>>>>>> Stashed changes


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

 