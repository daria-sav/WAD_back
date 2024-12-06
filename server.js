// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { pool, createTables } = require('./database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true,
}));
app.use(express.json());

// Creating tables on server startup
createTables();

// Маршруты
// ... здесь будут маршруты

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
