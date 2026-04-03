// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDatabase = require('./config/database');

// Import all route files
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes'); // Logic Hub for "Saved Properties"
const adminRoutes = require('./routes/adminRoutes');

// Initialize Express application
const app = express();

// ==================== MIDDLEWARE ====================
// Enable CORS - Matches your Vite frontend port
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}));

// Parse incoming JSON request bodies
app.use(express.json());

// Parse incoming form data
app.use(express.urlencoded({ extended: true }));

// ==================== ROUTES ====================
/**
 * All routes are prefixed with /api to maintain professional API standards.
 */

// Auth: Register and Login
app.use('/api/auth', authRoutes);

// Properties: Marketplace and Management
app.use('/api/properties', propertyRoutes);

// Bookings: Tenant requests and Owner approvals
app.use('/api/bookings', bookingRoutes);

// Wishlist: Tenant saved/favorite properties
app.use('/api/wishlist', wishlistRoutes);

// Admin: Platform oversight
app.use('/api/admin', adminRoutes);

// ==================== HEALTH CHECK ====================
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PropHub Server is healthy and running',
    timestamp: new Date().toISOString(),
  });
});

// ==================== 404 HANDLER ====================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'The requested API endpoint does not exist',
    path: req.originalUrl,
  });
});

// ==================== ERROR HANDLER ====================
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err.stack);
  res.status(500).json({
    success: false,
    message: 'An internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ==================== START SERVER ====================
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`
        ================================================
        🚀 PropHub Luxury Rental Server Started
        ================================================
        📍 API URL: http://localhost:${PORT}/api
        🌍 MODE: ${process.env.NODE_ENV || 'development'}
        ================================================
        
        ACTIVE MODULES:
        ✓ AUTH      : /api/auth
        ✓ INVENTORY : /api/properties
        ✓ BOOKINGS  : /api/bookings
        ✓ WISHLIST  : /api/wishlist
        ✓ ADMIN     : /api/admin
        ================================================
      `);
    });
  } catch (error) {
    console.error('CRITICAL STARTUP ERROR:', error.message);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;