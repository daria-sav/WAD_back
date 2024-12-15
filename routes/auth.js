const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const { pool } = require('../database');

const router = express.Router();
const SECRET = 'mysecretkey';

// Signup route
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required.');
    }

    try {
        // Check for user existence
        const existingUser = await pool.query(`SELECT id FROM users WHERE email = $1`, [email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).send('Email already exists.');
        }

        // Password hashing        
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert a new user
        const result = await pool.query(
            `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email`,
            [email, hashedPassword]
        );

        const user = result.rows[0];
        const token = jwt.encode({ id: user.id, email: user.email }, SECRET);
        res.status(201).json({ token });

    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).send('Internal server error.');
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
        const user = result.rows[0];
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send('Invalid credentials.');
        }
        const token = jwt.encode({ id: user.id, email: user.email }, SECRET);
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).send('Error logging in.');
    }
});

module.exports = router;