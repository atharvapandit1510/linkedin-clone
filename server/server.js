require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
//const path = require('path'); 
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- Deployment Fix ---
// Serve static files (like your uploaded images) from the 'uploads' folder
// We use path.resolve to create an absolute path, which Render needs
//app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.log(err));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

