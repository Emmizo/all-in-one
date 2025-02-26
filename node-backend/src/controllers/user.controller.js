const User = require('../models/user.model');
const multer = require('multer');
const path = require('path');

/// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

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

// Create User with Image
exports.create = async (req, res) => {
  try {
      const { name, email, role } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : null;

      if (!name || !email) {
          return res.status(400).json({ message: 'Name and email are required' });
      }

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
          return res.status(400).json({ message: 'Email already in use' });
      }

      const newUser = await User.create({ name, email, role, image });
      res.status(201).json(newUser);
  } catch (err) {
      res.status(500).json({ message: 'Error creating user', error: err.message });
  }
};

// Update User with Image
exports.update = async (req, res) => {
  try {
      const { name, email, role } = req.body;
      const image = req.file ? `/uploads/${req.file.filename}` : null;
      const userId = req.params.id;

      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      if (email && email !== user.email) {
          const existingUser = await User.findByEmail(email, userId);
          if (existingUser) {
              return res.status(400).json({ message: 'Email already in use by another user' });
          }
      }

      const updates = {};
      if (name) updates.name = name;
      if (email) updates.email = email;
      if (role) updates.role = role;
      if (image) updates.image = image;

      const updatedUser = await User.update(userId, updates);
      res.json(updatedUser);
  } catch (err) {
      res.status(500).json({ message: 'Error updating user', error: err.message });
  }
};

// Delete Image
exports.deleteImage = async (req, res) => {
  try {
      const userId = req.params.id;
      const user = await User.findById(userId);

      if (!user || !user.image) {
          return res.status(404).json({ message: 'Image not found' });
      }

      const imagePath = path.join(__dirname, '..', user.image);
      fs.unlinkSync(imagePath);

      await User.update(userId, { image: null });

      res.json({ message: 'Image deleted successfully' });
  } catch (err) {
      res.status(500).json({ message: 'Error deleting image', error: err.message });
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