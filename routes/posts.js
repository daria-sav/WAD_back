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
        const result = await pool.query('SELECT * FROM posts ORDER BY id ASC');
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

// Fetch a specific post by ID
router.get('/:id', authenticate, async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
      if (result.rows.length === 0) return res.status(404).send('Post not found');
      res.status(200).json(result.rows[0]);
    } catch (err) {
      res.status(500).send('Error fetching post.');
    }
});

// Update a specific post by ID
router.put('/:id', authenticate, async (req, res) => {
    try {
      const { id } = req.params;
      const { body } = req.body;
      await pool.query('UPDATE posts SET body = $1 WHERE id = $2', [body, id]);
      res.status(200).send('Post updated successfully.');
    } catch (err) {
      res.status(500).send('Error updating post.');
    }
});
  
// Delete a specific post by ID
router.delete('/:id', authenticate, async (req, res) => {
    try {
      const { id } = req.params;
      await pool.query('DELETE FROM posts WHERE id = $1', [id]);
      res.status(200).send('Post deleted successfully.');
    } catch (err) {
      res.status(500).send('Error deleting post.');
    }
});

module.exports = router;