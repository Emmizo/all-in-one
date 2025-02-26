const { pool } = require('../utils/db.init');

class UserModel {
  // Get all users
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    return rows;
  }

  // Get single user by id
  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows.length ? rows[0] : null;
  }

  // Check if email exists
  async findByEmail(email, excludeId = null) {
    let query = 'SELECT * FROM users WHERE email = ?';
    let params = [email];
    
    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }
    
    const [rows] = await pool.query(query, params);
    return rows.length ? rows[0] : null;
  }

  // Create new user
  async create(userData) {
    const { name, email, role = 'User', image } = userData;

    const [result] = await pool.query(
        'INSERT INTO users (name, email, role, image) VALUES (?, ?, ?, ?)',
        [name, email, role, image]
    );

    const [newUser] = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
    return newUser[0];
}

async update(id, updates) {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);

    if (fields.length === 0) {
        return null;
    }

    await pool.query(
        `UPDATE users SET ${fields} WHERE id = ?`,
        [...values, id]
    );

    const [updatedUser] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return updatedUser.length ? updatedUser[0] : null;
}


  // Delete user
  async delete(id) {
    const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    
    if (user.length === 0) {
      return null;
    }
    
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return user[0];
  }
}

module.exports = new UserModel();