const User = require('../models/User');
const Property = require('../models/Property');

/**
 * Get All Users Controller (Admin only)
 * Returns list of all users with option to filter by role
 */
exports.getAllUsers = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access this resource',
      });
    }

    const { role } = req.query;
    const filter = {};

    // Filter by role if provided
    if (role) {
      filter.role = role;
    }

    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
      count: users.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message,
    });
  }
};

/**
 * Block User Controller (Admin only)
 * Prevents a user from logging in and using the platform
 */
exports.blockUser = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can block users',
      });
    }

    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.isBlocked = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User blocked successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error blocking user',
      error: error.message,
    });
  }
};

/**
 * Unblock User Controller (Admin only)
 * Allows a previously blocked user to access the platform again
 */
exports.unblockUser = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can unblock users',
      });
    }

    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.isBlocked = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User unblocked successfully',
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error unblocking user',
      error: error.message,
    });
  }
};

/**
 * Get All Pending Properties Controller (Admin only)
 * Returns list of properties awaiting admin approval
 */
exports.getPendingProperties = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access this resource',
      });
    }

    const properties = await Property.find({ isApproved: false })
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      properties,
      count: properties.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pending properties',
      error: error.message,
    });
  }
};

/**
 * Approve Property Controller (Admin only)
 * Approves a property listing and makes it visible to tenants
 */
exports.approveProperty = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can approve properties',
      });
    }

    const property = await Property.findById(req.params.propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    property.isApproved = true;
    await property.save();

    res.status(200).json({
      success: true,
      message: 'Property approved successfully',
      property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving property',
      error: error.message,
    });
  }
};

/**
 * Reject/Remove Property Controller (Admin only)
 * Removes a property listing from the platform
 */
exports.removeProperty = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can remove properties',
      });
    }

    const property = await Property.findById(req.params.propertyId);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    await Property.findByIdAndDelete(req.params.propertyId);

    res.status(200).json({
      success: true,
      message: 'Property removed successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing property',
      error: error.message,
    });
  }
};

/**
 * Get Platform Statistics Controller (Admin only)
 * Returns overall platform statistics
 */
exports.getPlatformStats = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can access this resource',
      });
    }

    // Get various counts
    const totalUsers = await User.countDocuments();
    const totalTenants = await User.countDocuments({ role: 'Tenant' });
    const totalOwners = await User.countDocuments({ role: 'Property Owner' });
    const totalProperties = await Property.countDocuments();
    const approvedProperties = await Property.countDocuments({ isApproved: true });
    const pendingProperties = await Property.countDocuments({ isApproved: false });
    const blockedUsers = await User.countDocuments({ isBlocked: true });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalTenants,
        totalOwners,
        totalProperties,
        approvedProperties,
        pendingProperties,
        blockedUsers,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message,
    });
  }
};

/**
 * Delete User Controller (Admin only)
 * Permanently removes a user from the system
 */
exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can delete users',
      });
    }

    const user = await User.findByIdAndDelete(req.params.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message,
    });
  }
};
