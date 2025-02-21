const mysql = require('mysql2/promise');
const dbConfig = require('../config/db.config');

// Create database connection pool
const pool = mysql.createPool(dbConfig);

// Initialize database - create tables if they don't exist
async function initDatabase() {
  try {
    // First, make sure the database exists
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await connection.end();
    
    // Create users table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        role ENUM('User', 'Admin', 'Editor') NOT NULL DEFAULT 'User',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await pool.query(createTableQuery);
    console.log('Database initialized successfully');
    
    // Insert sample data if table is empty
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM users');
    if (rows[0].count === 0) {
      await pool.query(`
        INSERT INTO users (name, email, role) VALUES
        ('John Doe', 'john@example.com', 'Admin'),
        ('Jane Smith', 'jane@example.com', 'User'),
        ('Bob Johnson', 'bob@example.com', 'User')
      `);
      console.log('Sample data inserted');
    }
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

module.exports = {
  pool,
  initDatabase
};