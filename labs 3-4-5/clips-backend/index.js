const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const clipRoutes = require('./clip.route');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;


mongoose.connect('mongodb+srv://artem:12345@backenddb.cta5q.mongodb.net/?retryWrites=true&w=majority&appName=BackendDB');

// mongodb+srv://marmat:123@backenddb.99u4y.mongodb.net/?retryWrites=true&w=majority&appName=BackendDB

// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/clips', clipRoutes);

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, 'frontend')));

// Catch-all route to serve index.html for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
