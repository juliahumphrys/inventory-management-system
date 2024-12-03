const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path'); 
const bodyParser = require('body-parser');
require('dotenv').config();

// Initialize the app variable before using it
const app = express();

// Middleware
app.use(bodyParser.json()); 

const port = process.env.PORT || 3000;
const publicIP = process.env.PUBLIC_IP;
const baseUrl = process.env.BASE_URL;
const baseDomain = process.env.BASE_DOMAIN || 'http://localhost';

console.log('Public IP:', process.env.PUBLIC_IP);

// Middleware
app.use(cors({
  origin: ['https://actinventory.com', 'http://localhost:3000'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, 
})); 

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use('/uploads', express.static('uploads'));



if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.protocol !== 'https') {
      res.redirect(`https://${req.headers.host}${req.url}`);
    } else {
      next();
    }
  });
}

// Connect to the SQLite database 
const dbPath = process.env.DB_PATH || './act_inventory.db';
const db = new sqlite3.Database(dbPath, (err) => {
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
    itemNumber INTEGER PRIMARY KEY AUTOINCREMENT,
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

const addAdminUser = (username, password) => {
  db.run(
      `INSERT INTO adminAccounts (username, password) VALUES (?, ?)`,
      [username, password],
      function (err) {
          if (err) {
              console.error('Error inserting admin user:', err.message);
          } else {
              console.log('Admin user added successfully with ID:', this.lastID);
          }
      }
  );
};

// Add a new item
app.post('/items', (req, res) => {
  const { itemNumber, itemName, itemCategory, itemQuantity, itemLocation } = req.body;
  const sql = 'INSERT INTO itemInfo (itemNumber, itemName, itemCategory, itemQuantity, itemLocation) VALUES (?, ?, ?, ?, ?)';
  const params = [itemNumber, itemName, itemCategory, itemQuantity, itemLocation];

  console.log("Adding item:", params); 

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

  console.log("Adding advanced item info:", params); 

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

  console.log("Adding historical item info:", params); 

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

app.post('/GeneralLogin', (req, res) => {
  const { username, password } = req.body;
  
  const generalUsername = 'actVolunteer';
  const generalPassword = 'actInvent0ry';

  if (username === generalUsername && password === generalPassword) {
    res.json({ message: 'General login successful!' });
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

  
app.get('/items/search', (req, res) => {
  const { itemNumber } = req.query;

  if (!itemNumber) {
    return res.status(400).json({ success: false, error: "itemNumber parameter is required" });
  }

  const sqll = `
    SELECT 
      i.itemNumber, i.itemName, i.itemCategory, i.itemQuantity, i.itemLocation, i.itemPicture,
      a.itemCost, a.itemCondition, a.itemDescription,
      h.dateLastUsed, h.showLastUsed
    FROM 
      itemInfo i
    LEFT JOIN 
      advancedItemInfo a ON i.itemNumber = a.itemNumber
    LEFT JOIN 
      historicalItemInfo h ON i.itemNumber = h.itemNumber
    WHERE 
      i.itemNumber = ?
  `;

  db.get(sqll, [itemNumber], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, error: err.message });
    }

    if (!row) {
      return res.status(404).json({ success: false, error: "No items found" });
    }

    res.json({ success: true, data: row });
  });
});



// Endpoint to add a New Admin
app.post('/admins', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Call the addAdminUser function
  db.run(
    `INSERT INTO adminAccounts (username, password) VALUES (?, ?)`,
    [username, password],
    function (err) {
        if (err) {
            console.error('Error adding admin:', err.message);
            res.status(500).json({ message: 'Failed to add admin user' });
        } else {
            res.status(200).json({ message: 'Admin user added successfully', id: this.lastID });
        }
    }
  );
});



// Endpoint to generate inventory report
 app.post('/generate-inventory-report', async (req, res) => {
 const { includeTheaterStatus, includeAdvancedInfo, includeHistoricalInfo } = req.body;

   // Query data from itemInfo (base table)
   const baseQuery = `SELECT * FROM itemInfo`;
   db.all(baseQuery, [], (err, items) => {
     if (err) {
       console.error('Error querying itemInfo:', err);
       return res.status(500).send('Error generating report');
     }

//     // Prepare report data
     let reportData = items.map(item => ({
       itemNumber: item.itemNumber,
       itemName: item.itemName,
       itemCategory: item.itemCategory,
       itemQuantity: item.itemQuantity,
       itemLocation: item.itemLocation,
     }));

//     // Include theaterStatus data if selected
     if (includeTheaterStatus) {
       const theaterQuery = `SELECT * FROM theaterStatus`;
       db.all(theaterQuery, [], (err, theaterData) => {
         if (err) console.error('Error querying theaterStatus:', err);
         reportData = reportData.map(item => {
           const theater = theaterData.find(t => t.itemNumber === item.itemNumber);
           return {
             ...item,
             rentedOut: theater ? theater.rentedOut : null,
             locationRented: theater ? theater.locationRented : null,
          };
         });
       });
     }

//     // Include advancedItemInfo data if selected
     if (includeAdvancedInfo) {
       const advancedQuery = `SELECT * FROM advancedItemInfo`;
       db.all(advancedQuery, [], (err, advancedData) => {
         if (err) console.error('Error querying advancedItemInfo:', err);
         reportData = reportData.map(item => {
           const advanced = advancedData.find(a => a.itemNumber === item.itemNumber);
           return {
             ...item,
             itemCost: advanced ? advanced.itemCost : null,
             itemCondition: advanced ? advanced.itemCondition : null,
             itemDescription: advanced ? advanced.itemDescription : null,
           };
         });
       });
     }

     // Include historicalItemInfo data if selected
     if (includeHistoricalInfo) {
       const historicalQuery = `SELECT * FROM historicalItemInfo`;
       db.all(historicalQuery, [], (err, historicalData) => {
         if (err) console.error('Error querying historicalItemInfo:', err);
         reportData = reportData.map(item => {
           const historical = historicalData.find(h => h.itemNumber === item.itemNumber);
           return {
             ...item,
             dateLastUsed: historical ? historical.dateLastUsed : null,
             showLastUsed: historical ? historical.showLastUsed : null,
           };
         });
       });
     }

     // Generate Excel file
     const worksheet = XLSX.utils.json_to_sheet(reportData);
     const workbook = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory Report');

     // Write Excel file to buffer and send to client
     const fileBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
     res.setHeader('Content-Disposition', 'attachment; filename="inventory_report.xlsx"');
     res.setHeader('Content-Type', 'application/octet-stream');
     res.send(fileBuffer);
   });
 });


 // Start the server
 app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on ${baseDomain}:${port}`);
});