const Booking = require('../models/Booking');
const Property = require('../models/Property');

// 1. Request a Booking (Tenant)
exports.requestBooking = async (req, res) => {
    try {
        const { propertyId, message } = req.body;

        const property = await Property.findById(propertyId);
        if (!property) return res.status(404).json({ success: false, message: "Property not found" });

        if (property.owner.toString() === req.user.id) {
            return res.status(400).json({ success: false, message: "You cannot book your own property!" });
        }

        // --- LOGICAL FIX FOR VALIDATION ERRORS ---
        // Defaulting to 1 month stay if no dates are picked
        const checkIn = new Date();
        const checkOut = new Date();
        checkOut.setMonth(checkOut.getMonth() + 1); 

        const booking = await Booking.create({
            property: propertyId,
            tenant: req.user.id,
            propertyOwner: property.owner,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            totalAmount: property.price, // Setting the required totalAmount
            message: message || "I am interested in this property.",
            status: 'Pending'
        });

        res.status(201).json({ 
            success: true, 
            message: "Request sent successfully!", 
            booking 
        });
    } catch (error) {
        // This will now catch any database validation errors specifically
        console.error("Booking Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Get Tenant Bookings
exports.getTenantBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ tenant: req.user.id })
            .populate('property', 'title location price images')
            .populate('propertyOwner', 'name email phone');
        res.status(200).json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. Get Owner Booking Requests
exports.getOwnerBookingRequests = async (req, res) => {
    try {
        const bookings = await Booking.find({ propertyOwner: req.user.id })
            .populate('tenant', 'name email phone')
            .populate('property', 'title location price images');
        res.status(200).json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. Accept/Reject/Cancel Placeholders (To prevent Route crashes)
exports.acceptBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'Accepted' }, { new: true });
        res.status(200).json({ success: true, booking });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.rejectBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'Rejected' }, { new: true });
        res.status(200).json({ success: true, booking });
    } catch (err) { res.status(500).json({ message: err.message }); }
};

// Add this to your existing exports in bookingController.js
// ADD THIS TO YOUR BOOKING CONTROLLER
exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ success: false, message: "Request not found" });

        // Security check
        if (booking.tenant.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        await Booking.findByIdAndDelete(req.params.id);
        return res.status(200).json({ success: true, message: "Request cancelled" });
    } catch (error) {
       return res.status(500).json({ success: false, message: error.message });
    }
};

exports.getBookingDetails = async (req, res) => res.json({ message: "Details logic" });