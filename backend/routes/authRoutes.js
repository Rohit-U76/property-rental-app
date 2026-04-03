const express = require('express');
const {
  signup,
  login,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes (Requires valid Bearer Token)
// These handle fetching and updating the specific user authenticated by the token
router.get('/profile', authenticate, getUserProfile);
router.put('/profile', authenticate, updateUserProfile);

module.exports = router;