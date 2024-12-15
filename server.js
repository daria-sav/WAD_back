require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { pool, createTables } = require('./database');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: 'http://localhost:8081',
  credentials: true,
}));

app.use(bodyParser.json());

// Creating tables on server startup
createTables();

// Routes
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
