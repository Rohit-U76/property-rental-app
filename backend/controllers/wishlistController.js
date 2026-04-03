const Wishlist = require('../models/Wishlist');
const Property = require('../models/Property');

// Helper function to keep YOUR specific data flow consistent across all responses
const getSynchronizedWishlist = async (userId) => {
    const wishlistItems = await Wishlist.find({ user: userId }).populate('property');
    return wishlistItems
        .filter(item => item.property) // Remove broken links
        .map(item => ({
            ...item.property._doc,
            _id: item.property._id,   // Ensure ID is at root for clickability
            wishlistId: item._id      // Keep for internal reference
        }));
};

/**
 * Toggle Property in Wishlist (Heart Icon Logic)
 */
exports.addToWishlist = async (req, res) => {
    try {
        const { propertyId } = req.body;
        const userId = req.user._id || req.user.id;

        if (!propertyId) {
            return res.status(400).json({ success: false, message: 'Please provide property ID' });
        }

        const existing = await Wishlist.findOne({ user: userId, property: propertyId });

        if (existing) {
            await Wishlist.findByIdAndDelete(existing._id);
            const wishlist = await getSynchronizedWishlist(userId);
            return res.status(200).json({
                success: true,
                message: 'Removed from wishlist',
                status: 'removed',
                wishlist 
            });
        }

        await Wishlist.create({ user: userId, property: propertyId });
        const wishlist = await getSynchronizedWishlist(userId);

        res.status(200).json({
            success: true,
            message: 'Added to wishlist',
            status: 'added',
            wishlist 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Wishlist Error', error: error.message });
    }
};

/**
 * Get User's Wishlist (For Profile Page)
 */
exports.getWishlist = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const wishlist = await getSynchronizedWishlist(userId);
        res.status(200).json({ success: true, wishlist });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Remove Property from Wishlist (Explicit Trash Icon)
 */
exports.removeFromWishlist = async (req, res) => {
    try {
        const { propertyId } = req.body;
        const userId = req.user._id || req.user.id;
        
        await Wishlist.findOneAndDelete({ user: userId, property: propertyId });
        const wishlist = await getSynchronizedWishlist(userId);

        res.status(200).json({
            success: true,
            message: 'Removed',
            wishlist
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Map toggleWishlist to your existing route naming
exports.toggleWishlist = exports.addToWishlist;

exports.checkWishlist = async (req, res) => { 
    try {
        const { propertyId } = req.query;
        const userId = req.user._id || req.user.id;
        const exists = await Wishlist.findOne({ user: userId, property: propertyId });
        res.json({ success: true, isInWishlist: !!exists }); 
    } catch (e) { res.status(500).json({ success: false }); }
};

exports.clearWishlist = async (req, res) => { 
    try {
        const userId = req.user._id || req.user.id;
        await Wishlist.deleteMany({ user: userId });
        res.json({ success: true, message: 'Wishlist cleared' }); 
    } catch (e) { res.status(500).json({ success: false }); }
};