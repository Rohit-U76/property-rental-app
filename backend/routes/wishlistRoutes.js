const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/', authenticate, async (req, res) => {
    try {
        const wishlist = await Wishlist.find({ user: req.user.id }).populate('property');
        res.status(200).json({ success: true, wishlist });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/toggle', authenticate, async (req, res) => {
  try {
    const { propertyId } = req.body;
    const userId = req.user.id;

    // Force check: If propertyId is an object, get the string ID
    const cleanPropertyId = typeof propertyId === 'object' ? propertyId._id : propertyId;

    if (!cleanPropertyId) {
      return res.status(400).json({ success: false, message: "No valid Property ID provided" });
    }

    const existing = await Wishlist.findOne({ user: userId, property: cleanPropertyId });

    if (existing) {
      await Wishlist.findByIdAndDelete(existing._id);
      return res.json({ success: true, message: "Removed" });
    }

    await Wishlist.create({ user: userId, property: cleanPropertyId });
    res.json({ success: true, message: "Added" });
  } catch (error) {
    console.error("WISHLIST CRASH:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;