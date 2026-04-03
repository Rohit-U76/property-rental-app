const express = require('express');
const router = express.Router();
const {
    requestBooking,
    acceptBooking,
    rejectBooking,
    getTenantBookings,
    getOwnerBookingRequests,
    getBookingDetails,
    cancelBooking
} = require('../controllers/bookingController');

const { authenticate } = require('../middleware/authMiddleware');

// All booking routes should be protected
router.use(authenticate);

router.post('/', requestBooking);
router.get('/tenant/my-bookings', getTenantBookings);
router.get('/owner/requests', getOwnerBookingRequests);
router.get('/:id', getBookingDetails);
router.put('/:id/accept', acceptBooking);
router.put('/:id/reject', rejectBooking);
router.put('/:id/cancel', cancelBooking);

module.exports = router;