const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple');
const { pool } = require('../database');

const router = express.Router();
const SECRET = 'mysecretkey';

// // Signup route
// router.post('/signup', async (req, res) => {
//     const { email, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     try {
//         await pool.query(
//             `INSERT INTO users (email, password) VALUES ($1, $2)`,
//             [email, hashedPassword]
//         );
//         res.status(201).send('User registered successfully.');
//     } catch (err) {
//         console.error('Error registering user:', err);
//         res.status(500).send('Error registering user.');
//     }
// });
// router.post('/signup', async (req, res) => {
//     const { email, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     try {
//         const result = await pool.query(
//             `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email`,
//             [email, hashedPassword]
//         );
//         const user = result.rows[0];
//         const token = jwt.encode({ id: user.id, email: user.email }, SECRET);
//         res.status(201).json({ token });
//     } catch (err) {
//         if (err.code === '23505') {
//             return res.status(409).send('Error registering user: Email already exists.');
//         }
//         res.status(500).send('Error registering user.');
//     }
// });

// Signup route
router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required.');
    }

    try {
        // Проверка на существование пользователя
        const existingUser = await pool.query(`SELECT id FROM users WHERE email = $1`, [email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).send('Email already exists.');
        }

        // Хэширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // Вставка нового пользователя
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

// // Check for user existence (for LoginPage.vue)
// router.post('/signup', async (req, res) => {
//     const { email, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     try {
//         const result = await pool.query( // Выполняем запрос и сохраняем результат
//             `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email`, // Добавляем RETURNING 
//             [email, hashedPassword]
//         );
//         const user = result.rows[0]; // Получаем данные нового пользователя
//         const token = jwt.encode({ id: user.id, email: user.email }, SECRET); // Генерируем токен
//         res.status(201).json({ token }); // Отправляем токен в ответе
//     } catch (err) {
//         if (err.code === '23505') { // Проверяем, если ошибка связана с уникальностью email
//             return res.status(409).send('Error registering user: Email already exists.'); // Отправляем более информативную ошибку
//         }
//         res.status(500).send('Error registering user.');
//     }
// });

module.exports = router;

/*
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
        const result = await pool.query(
            `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email`,
            [email, hashedPassword]
        );
        const user = result.rows[0];
        const token = jwt.encode({ id: user.id, email: user.email }, SECRET);
        res.status(201).json({ token });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).send('Error registering user: Email already exists.');
        }
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

// Check for user existence (for LoginPage.vue)
router.get('/check-user/:email', async (req, res) => {
    const { email } = req.params;
    try {
        const result = await pool.query(`SELECT 1 FROM users WHERE email = $1`, [email]);
        if (result.rows.length > 0) {
            res.status(200).send('User exists');
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        res.status(500).send('Error checking user');
    }
});

module.exports = router;*/