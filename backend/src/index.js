// Main server: connects to MongoDB, mounts routes, and starts Express
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const coursesRoutes = require('./routes/courses');
const recRoutes = require('./routes/recommendations');

const app = express();
app.use(cors());            // allow requests from frontend dev server
app.use(express.json());    // parse JSON bodies

// mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/recommendations', recRoutes);

const PORT = process.env.PORT || 5000;

// connect to Mongo and start server
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> {
    console.log('MongoDB connected');
    app.listen(PORT, ()=> console.log(`Backend running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Mongo connection error:', err);
    process.exit(1);
  });
