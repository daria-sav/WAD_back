const express = require('express');
const jwt = require('jwt-simple');
const { pool } = require('../database');

const router = express.Router();
const SECRET = 'mysecretkey';

// Middleware to check authentication
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    try {
        const user = jwt.decode(token, SECRET);
        req.user = user;
        next();
    } catch {
        res.status(401).send('Unauthorized.');
    }
};

// Fetch all posts
router.get('/', authenticate, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM posts');
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).send('Error fetching posts.');
    }
});

// Add a new post
router.post('/add', authenticate, async (req, res) => {
    const { body } = req.body;
    try {
        await pool.query(
            `INSERT INTO posts (body, user_id) VALUES ($1, $2)`,
            [body, req.user.id]
        );
        res.status(201).send('Post added successfully.');
    } catch (err) {
        res.status(500).send('Error adding post.');
    }
});

// Delete all posts
router.delete('/delete-all', authenticate, async (req, res) => {
    try {
        await pool.query(`DELETE FROM posts`);
        res.status(200).send('All posts deleted.');
    } catch (err) {
        res.status(500).send('Error deleting posts.');
    }
});

module.exports = router;