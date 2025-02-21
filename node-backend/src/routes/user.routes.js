const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Create a new user
router.post('/users', userController.create);

// Retrieve all users
router.get('/users', userController.findAll);

// Retrieve a single user with id
router.get('/users/:id', userController.findOne);

// Update a user with id
router.put('/users/:id', userController.update);

// Delete a user with id
router.delete('/users/:id', userController.delete);

module.exports = router;