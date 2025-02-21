const User = require('../models/user.model');

// Controller for handling user-related requests
exports.findAll = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving users', error: err.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving user', error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }
    
    // Check if email already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    const newUser = await User.create({ name, email, role });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const userId = req.params.id;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if email already exists for another user
    if (email && email !== user.email) {
      const existingUser = await User.findByEmail(email, userId);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use by another user' });
      }
    }
    
    // Update only the fields that were provided
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (role) updates.role = role;
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }
    
    const updatedUser = await User.update(userId, updates);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Error updating user', error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deletedUser = await User.delete(req.params.id);
    
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully', user: deletedUser });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
};