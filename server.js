const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const fileRoutes = require('./routes/fileRoutes');
app.use('/api', fileRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const connectDB = require('./db');
connectDB();
// Middleware
app.use(cors());
app.use(express.json());  // For parsing JSON bodies
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
