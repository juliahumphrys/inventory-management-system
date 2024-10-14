const express = require('express');
const app = express();
const port = 5000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from the Node.js backend! ;)');
});

app.listen(port, () => {
    console.log('Server is running on port ${port}');
});

app.get('/items', (req, res) => {
    // Replace this with real data from your database later
    const items = [
      { itemNumber: '001', itemName: 'Prop Sword', itemCategory: 'Props', itemQuantity: 5, itemLocation: 'Storage Room' },
      { itemNumber: '002', itemName: 'Costume Hat', itemCategory: 'Costumes', itemQuantity: 2, itemLocation: 'Wardrobe' }
    ];
  
    res.json(items);
  });
  
