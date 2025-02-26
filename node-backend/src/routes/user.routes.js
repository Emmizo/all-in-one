const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const upload = require('../middlewares/upload');
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

const upload = multer({ dest: 'uploads/' });

router.post('/users', upload.single('image'), userController.create);
router.put('/users/:id', upload.single('image'), userController.update);
router.delete('/users/:id/image', userController.deleteImage);
module.exports = router;