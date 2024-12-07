const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const { pool } = require('../database');

const router = express.Router();
const SECRET = 'mysecretkey';

// Signup route
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        await pool.query(
            `INSERT INTO users (email, password) VALUES ($1, $2)`,
            [email, hashedPassword]
        );
        res.status(201).send('User registered successfully.');
    } catch (err) {
        res.status(500).send('Error registering user.');
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