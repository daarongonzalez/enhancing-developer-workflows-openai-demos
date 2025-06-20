const express = require('express');
const path = require('path');

const app = express();
const PORT = 3030;

// Serve static files from the current directory
app.use(express.static(__dirname));

// Route for the home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle extensionless routes
app.get('/shop', (req, res) => {
  res.sendFile(path.join(__dirname, 'shop.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'cart.html'));
});

app.get('/shipping', (req, res) => {
  res.sendFile(path.join(__dirname, 'shipping.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Bethany's Pie Shop server running at http://localhost:${PORT}`);
  console.log(`Press Ctrl+C to stop the server`);
}); 