const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: [true, 'Property ID is required']
    }
}, { timestamps: true });

// Prevent duplicate saves (User can't save the same property twice)
wishlistSchema.index({ user: 1, property: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);