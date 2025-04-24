const User = require("../models/userSchema");
const Booking = require("../models/bookingSchema");
const Event = require("../models/eventSchema");

exports.bookEvent = async (req, res) => {
    // Expect eventId, ticketQuantity, ticketTypeName, and optionally discountPercent
    const { eventId, tickets, discountPercent } = req.body;
    // Assuming user ID is available in req.user after authentication middleware
    const userId = req.user.id;

    if (!eventId || !tickets || !Array.isArray(tickets) || tickets.length === 0) {
        return res.status(400).json({ message: "Event ID and non-empty array ticket are required." });
    }

    let totalQuantityBooked = 0;    
    const session = await Booking.startSession();
    session.startTransaction();

    try {
        const event = await Event.findById(eventId).session(session);
        const customer = await User.findById(userId).select('fullName profilePicture').session(session);
        if (!customer) {
            return res.status(404).json({ message: "User not found." });
        }

        if (!event) {
            return res.status(404).json({ message: "Event not found." });
        }

        for (const ticket of tickets) {
            if (!ticket.ticketTypeName || !ticket.ticketQuantity || typeof ticket.ticketQuantity !== 'number' || ticket.ticketQuantity < 1) {
                return res.status(400).json({ message: "Each ticket entry must include a valid ticketTypeName and a ticketQuantity of at least 1." });
            }
    
            const ticketType = event.ticketTypes.find(tt => tt.name === ticket.ticketTypeName);
            if (!ticketType) {
                return res.status(404).json({ message: `Ticket type '${ticket.ticketTypeName}' not found for this event.` });
            }
            if (ticketType.quantity < ticket.ticketQuantity) {
                return res.status(400).json({ message: `Not enough tickets available for type '${ticket.ticketTypeName}'. Only ${ticketType.quantity} left.` });
            }
    
            totalQuantityBooked += ticket.ticketQuantity;
        }
    

        let totalAmount = 0;
        let totalTicketAmounts = 0;
        for (let i = 0; i < tickets.length; i++) {
            const requestedTicket = tickets[i];
            const selectedTicketType = event.ticketTypes.find(tt => tt.name === requestedTicket.ticketTypeName);

            // Add to total amount
            totalAmount += selectedTicketType.price * requestedTicket.ticketQuantity;
            totalTicketAmounts += requestedTicket.ticketQuantity;

            // Decrement the ticket type quantity
            selectedTicketType.quantity -= requestedTicket.ticketQuantity;
        }


        // Create the new booking document
        const newBooking = new Booking({
            bookedTickets: tickets.map(ticket => ({
                ticketTypeName: ticket.ticketTypeName,
                quantity: ticket.ticketQuantity
            })),
            totalAmount,
            discountPercent: discountPercent || 0, // Use provided discount or default to 0
            customer: {
                userId: customer._id,
                fullName: customer.fullName,
                profilePicture: customer.profilePicture // Uses default if not set on user
            },
            event: {
                eventId: event._id,
                title: event.title,
                location: event.location, // Make sure event.location structure matches bookingSchema.event.location
                category: event.category
            },
            status: "confirmed" // Assuming a default status for new bookings
        });

        event.ticketsAvailable -= totalTicketAmounts; // Decrease available tickets count
        event.ticketsSold += totalTicketAmounts; // Increase sold tickets count
        // Save the booking document
        const savedBooking = await newBooking.save({ session: session});
        await event.save({ session: session }); // Save the updated event document

        await session.commitTransaction();
        session.endSession();

        const bookingResponse = savedBooking.toObject({ virtuals: true });

        res.status(201).json({ message: "Booking created successfully", booking: bookingResponse });

    } catch (error) {

        if(session) {
            await session.abortTransaction();
            session.endSession();
        }
        console.error("Error booking event:", error);
        // Handle potential validation errors from Mongoose
        if (error.name === 'VersionError') {
            return res.status(409).json({ // 409 Conflict is appropriate
                message: "Booking conflict: The event details were updated by someone else. Please try again."
            });
        }
        if (error.name === 'ValidationError') {
             return res.status(400).json({ message: "Validation Error", errors: error.errors });
        }
        // Handle CastError (e.g., invalid ObjectId format for eventId)
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid ID format provided." });
        }
        res.status(500).json({ message: "Server error while creating booking." });
    }
};

exports.deleteBooking = async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
        return res.status(400).json({ message: "Booking ID is required." });
    }
    
    const session = await Booking.startSession();
    session.startTransaction();
    
    try {
        // Find the booking to delete
        const booking = await Booking.findById(id).session(session);
        
        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }
        
        // Check if the user is authorized to delete this booking
        // Assuming req.user.id comes from auth middleware
        if (booking.customer.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to delete this booking." });
        }
        
        // Find the event to update ticket quantities
        const event = await Event.findById(booking.event.eventId).session(session);
        
        if (!event) {
            return res.status(404).json({ message: "Associated event not found." });
        }
        
        const totalTicketAmounts = 0;
        // Restore the ticket quantities in the event
        booking.bookedTickets.forEach(bookedTicket => {
            const ticketTypeToUpdate = event.ticketTypes.find(
                tt => tt.name === bookedTicket.ticketTypeName
            );
            
            if (ticketTypeToUpdate) {
                ticketTypeToUpdate.quantity += bookedTicket.quantity;
            }
            totalTicketAmounts+= bookedTicket.quantity;
        });
        
        event.ticketsAvailable += totalTicketAmounts; // Restore the available tickets count
        event.ticketsSold -= totalTicketAmounts; // Decrease the sold tickets count
        // Save the updated event and delete the booking
        await event.save({ session });
        await Booking.findByIdAndDelete(id).session(session);
        
        await session.commitTransaction();
        session.endSession();
        
        res.status(200).json({ message: "Booking deleted successfully and tickets restored." });
        
    } catch (error) {
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }
        
        console.error("Error deleting booking:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid booking ID format." });
        }
        
        res.status(500).json({ message: "Server error while deleting booking." });
    }
};

exports.getBookingDetails = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ message: "Booking ID is required." });
        }
        
        const booking = await Booking.findById(id);
        
        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }
        
        // Check authorization: only allow the booking customer or admin to view details
        if (booking.customer.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to view this booking." });
        }
        
        // Create a response with combined booking data and additional event details
        const bookingDetails = booking.toObject({virtuals: true});
        
        res.status(200).json({ booking: bookingDetails });
        
    } catch (error) {
        console.error("Error fetching booking details:", error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid booking ID format." });
        }
        
        res.status(500).json({ message: "Server error while fetching booking details." });
    }
}


