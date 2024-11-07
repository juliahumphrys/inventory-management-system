const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('/Users/juliahumphrys/Documents/GitHub/Inventory_Project/backend/act_inventory.db');

const username = 'testUsername';
const password = 'testPassword';

db.run(
  `INSERT INTO adminAccounts (username, password) VALUES (?, ?)`,
  [username, password],
  function (err) {
    if (err) {
      console.error('Error inserting admin user:', err.message);
    } else {
      console.log('Admin user added successfully with ID:', this.lastID);
    }
    db.close();
  }
);
