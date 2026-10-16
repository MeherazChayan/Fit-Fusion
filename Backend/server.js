require('dotenv').config(); // load .env first

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/UserRoutes'); // user-related routes (signup/login/etc)

const app = express();

// read values from .env
const PORT = process.env.PORT || 3500;
const MONGO_URI = process.env.MONGO_URI;

// middleware
app.use(cors());
app.use(express.json()); // parse JSON body

// connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
  })
  .catch((err) => {
    console.error('❌ Database connection error:', err);
  });

// routes
app.use('/api/users', userRoutes);

// simple health check route
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'fit-fusion-backend',
  });
});

// basic error handler (keeps server from crashing on thrown errors in routes)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ message: 'Something went wrong on the server' });
});

// 404 for anything else
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
