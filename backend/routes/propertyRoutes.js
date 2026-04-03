const express = require('express');
const router = express.Router();
const {
  addProperty,
  updateProperty,
  deleteProperty,
  getPropertyDetails,
  getAllProperties,
  getMyProperties,
  searchProperties,
  toggleAvailability 
} = require('../controllers/propertyController');

const { authenticate, ownerOnly } = require('../middleware/authMiddleware');

// --- PUBLIC ROUTES ---
router.get('/', getAllProperties);
router.get('/search', searchProperties);

// --- PROTECTED OWNER ROUTES ---
// IMPORTANT: Specific routes like 'my-properties' MUST come BEFORE generic ':id' routes
router.get('/my-properties', authenticate, ownerOnly, getMyProperties);

router.post('/', authenticate, ownerOnly, addProperty);
router.put('/:id', authenticate, ownerOnly, updateProperty);
router.patch('/:id/toggle-status', authenticate, ownerOnly, toggleAvailability);
router.delete('/:id', authenticate, ownerOnly, deleteProperty);

// --- GENERIC DETAIL ROUTE (Keep this at the bottom) ---
router.get('/:id', getPropertyDetails);

module.exports = router;