const express = require('express');
const {
  getAllUsers,
  blockUser,
  unblockUser,
  getPendingProperties,
  approveProperty,
  removeProperty,
  getPlatformStats,
  deleteUser,
} = require('../controllers/adminController');
const { authenticate, adminOnly } = require('../middleware/authMiddleware');

// Create router instance
const router = express.Router();

/**
 * @route   GET /admin/users
 * @desc    Get all users (optional role filter)
 * @access  Private (Admin only)
 * @query   role
 */
router.get('/users', authenticate, adminOnly, getAllUsers);

/**
 * @route   PUT /admin/users/:userId/block
 * @desc    Block a user account
 * @access  Private (Admin only)
 */
router.put('/users/:userId/block', authenticate, adminOnly, blockUser);

/**
 * @route   PUT /admin/users/:userId/unblock
 * @desc    Unblock a user account
 * @access  Private (Admin only)
 */
router.put('/users/:userId/unblock', authenticate, adminOnly, unblockUser);

/**
 * @route   DELETE /admin/users/:userId
 * @desc    Delete a user account
 * @access  Private (Admin only)
 */
router.delete('/users/:userId', authenticate, adminOnly, deleteUser);

/**
 * @route   GET /admin/properties/pending
 * @desc    Get all pending property approvals
 * @access  Private (Admin only)
 */
router.get('/properties/pending', authenticate, adminOnly, getPendingProperties);

/**
 * @route   PUT /admin/properties/:propertyId/approve
 * @desc    Approve a property listing
 * @access  Private (Admin only)
 */
router.put('/properties/:propertyId/approve', authenticate, adminOnly, approveProperty);

/**
 * @route   DELETE /admin/properties/:propertyId
 * @desc    Remove a property from the platform
 * @access  Private (Admin only)
 */
router.delete('/properties/:propertyId', authenticate, adminOnly, removeProperty);

/**
 * @route   GET /admin/stats
 * @desc    Get platform statistics
 * @access  Private (Admin only)
 */
router.get('/stats', authenticate, adminOnly, getPlatformStats);

module.exports = router;
