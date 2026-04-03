const Property = require('../models/Property');

exports.getAllProperties = async (req, res) => {
    try {
        const properties = await Property.find().populate('owner', 'name email phone');
        res.status(200).json({ success: true, properties });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getPropertyDetails = async (req, res) => {
    try {
        // Check if ID is valid format before querying
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ success: false, message: 'Malformed Property ID' });
        }
        
        const property = await Property.findById(req.params.id).populate('owner', 'name email phone');
        if (!property) return res.status(404).json({ success: false, message: 'Property not found' });
        
        res.status(200).json({ success: true, property });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.addProperty = async (req, res) => {
    try {
        // Log to terminal to see who is adding
        console.log(">>> ADDING PROPERTY FOR USER:", req.user.id);

        const propertyData = {
            ...req.body,
            owner: req.user.id // Ensure this matches the ID in your User collection
        };

        const property = await Property.create(propertyData);
        res.status(201).json({ success: true, property });
    } catch (error) {
        console.error(">>> ADD ERROR:", error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};

// Placeholders for other routes
exports.updateProperty = async (req, res) => {
    try {
        let property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: "Not found" });

        if (property.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, property });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteProperty = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: "Not found" });

        if (property.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        await Property.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Property deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMyProperties = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(">>> FETCHING FOR OWNER ID:", userId);

        // This query is now ultra-specific
        const properties = await Property.find({ owner: userId }).sort({ createdAt: -1 });

        console.log(`>>> DB STATUS: Found ${properties.length} properties for this specific ID.`);

        res.status(200).json({ 
            success: true, 
            count: properties.length,
            properties: properties || [] 
        });
    } catch (error) {
        console.error(">>> FETCH ERROR:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.searchProperties = async (req, res) => res.json({ message: "Search logic" });
exports.toggleAvailability = async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) return res.status(404).json({ message: "Not found" });

        // Ensure only the owner can toggle
        if (property.owner.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized" });
        }

        property.isAvailable = !property.isAvailable;
        property.status = property.isAvailable ? 'Available' : 'Rented';
        await property.save();

        res.status(200).json({ success: true, isAvailable: property.isAvailable, status: property.status });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};