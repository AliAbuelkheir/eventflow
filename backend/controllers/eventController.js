const Event = require('../models/eventSchema');

exports.createEvent = async (req, res) => {
    const { 
        title, 
        description, 
        eventDate, 
        location, 
        category, 
        imageUrl, 
        ticketTypes,
        ticketsAvailable,
        organizer 
    } = req.body;

    // Validate input
    if (!title || !eventDate || !location || !category || !organizer || !organizer.userId || !organizer.fullName || !organizer.profileUrl) {
        return res.status(400).json({ message: 'All required fields must be provided' });
    }

    try {
        // Create new event
        const newEvent = await Event.create({
            title,
            description,
            eventDate,
            location,
            category,
            imageUrl,
            ticketTypes: ticketTypes || [],
            ticketsAvailable: ticketsAvailable || 0,
            organizer
        });

        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   
}

exports.getAllApprovedEvents = async (req, res) => {
    try {
        // Add pagination support
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Add filtering by date - default to upcoming events
        const dateFilter = req.query.showPast === 'true' 
            ? {} 
            : { eventDate: { $gte: new Date() } };
            
        
        const filter = {
            ...dateFilter,
            status: "approved"
        };
        // Get events with pagination
        const events = await Event.find(filter)
            .sort({ eventDate: 1 })  // Sort by date ascending (soonest first)
            .skip(skip)
            .limit(limit);
            
        // Get total count for pagination
        const total = await Event.countDocuments(filter);
        
        res.status(200).json({
            events,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getAllEvents = async (req, res) => {
    try {
        // Add pagination support
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get events with pagination
        const events = await Event.find()
            .sort({ eventDate: 1 })  // Sort by date ascending (soonest first)
            .skip(skip)
            .limit(limit);

        // Get total count for pagination
        const total = await Event.countDocuments();

        res.status(200).json({
            events,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateEventById = async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id, 
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!updatedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteEventById = async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        
        if (!deletedEvent) {
            return res.status(404).json({ message: 'Event not found' });
        }
        
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
