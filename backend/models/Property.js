const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Title is required'], 
        trim: true 
    },
    description: { 
        type: String, 
        required: [true, 'Description is required'] 
    },
    propertyType: { 
        type: String, 
        enum: ['House', 'PG', 'Apartment', 'Flat'], 
        required: true 
    },
    bhk: { 
        type: String, 
        enum: ['1', '2', '3', '4', '1RK', 'Sharing'], 
        required: true 
    },
    location: { 
        type: String, 
        required: [true, 'City/Location is required'] 
    },
    address: { 
        type: String, 
        required: [true, 'Full address is required'] 
    },
    price: { 
        type: Number, 
        required: [true, 'Monthly rent is required'] 
    },
    images: [{ 
        type: String // Array for multiple Cloudinary URLs
    }],
    amenities: [{ 
        type: String 
    }],
    isAvailable: { 
        type: Boolean, 
        default: true 
    },
    status: { 
        type: String, 
        enum: ['Available', 'Rented', 'Pending'], 
        default: 'Available' 
    },
    owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
},
    isApproved: { 
        type: Boolean, 
        default: false 
    },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 }
}, { timestamps: true });

// Indexes for high-speed searching in Solapur
propertySchema.index({ location: 1, price: 1, bhk: 1 });

module.exports = mongoose.model('Property', propertySchema);