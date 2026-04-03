const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Hides password from API responses by default
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'], // Made required for better property management
    },
    role: {
      type: String,
      enum: ['Tenant', 'Property Owner', 'Admin'],
      default: 'Tenant',
    },
    profilePicture: {
      type: String,
      default: null,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// --- PRE-SAVE HOOK: Password Hashing ---
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// --- METHOD: Password Verification ---
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Since password has 'select: false', we must ensure it's available when this is called
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);