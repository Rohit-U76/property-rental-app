const mongoose = require('mongoose');

// Booking Schema - Stores booking/rental request information
const bookingSchema = new mongoose.Schema(
  {
    // Tenant making the booking request
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Property being booked
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },

    // Property Owner (owner of the property)
    propertyOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Booking status: Pending, Accepted, Rejected, or Cancelled
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected', 'Cancelled'],
      default: 'Pending',
    },

    // Check-in date (when tenant wants to move in)
    checkInDate: {
      type: Date,
      required: [true, 'Please provide check-in date'],
      default: Date.now, // Logical Fix: Defaults to today if not provided
    },

    // Check-out date (estimated lease end date)
    checkOutDate: {
      type: Date,
      required: [true, 'Please provide check-out date'],
      // Logical Fix: Defaults to 1 month from now if not provided
      default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000), 
    },

    // Total rent amount for the booking period
    totalAmount: {
      type: Number,
      required: [true, 'Please provide total amount'],
      min: [0, 'Amount cannot be negative'],
    },

    // Tenant's additional message or requirements
    message: {
      type: String,
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
      default: 'I am interested in renting this property.',
    },

    // Number of occupants/tenants for this booking
    numberOfTenants: {
      type: Number,
      default: 1,
      min: [1, 'At least 1 tenant required'],
    },
  },
  { 
    timestamps: true // This automatically handles createdAt and updatedAt
  }
);

// --- PERFORMANCE INDEXING ---
bookingSchema.index({ tenant: 1 });
bookingSchema.index({ propertyOwner: 1 });
bookingSchema.index({ property: 1 });
bookingSchema.index({ status: 1 });

// --- PRE-SAVE LOGIC ---
// Ensure the propertyOwner is not the same as the tenant
bookingSchema.pre('save', function(next) {
  if (this.tenant.equals(this.propertyOwner)) {
    const err = new Error('Owners cannot book their own properties.');
    return next(err);
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);