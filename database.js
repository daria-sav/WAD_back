const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    password: "chlen",
    database: "WADdb",
    host: "localhost",
    port: "5433"
});

const createTables = async () => {
    try {
      // users table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL
        )
      `);
  
      // posts table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS posts (
          id SERIAL PRIMARY KEY,
          body TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          user_id INTEGER REFERENCES users(id)
        )
      `);
  
      console.log('Tables created or verified successfully.');
    } catch (err) {
      console.error('Error creating tables:', err);
    }
  };
  
  module.exports = { pool, createTables };