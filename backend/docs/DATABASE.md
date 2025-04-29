# Event Ticketing System - NoSQL Database Schema

This document outlines the NoSQL database schema design for our event ticketing platform. The schema is optimized for MongoDB with Mongoose and follows document-oriented design principles for efficient querying and scalability.

## Collections

### User Collection

```javascript
{
  _id: ObjectId,                    // Auto-generated unique identifier
  firstName: String,                // User's first name
  lastName: String,                 // User's last name
  email: String,                    // Unique email address (indexed)
  profilePicture: String,           // URL to stored image
  password: String,                 // Bcrypt hashed password
  role: {
    type: String,
    enum: ["user", "organizer", "admin"]
  },                                // User access role
  createdAt: Date                   // Account creation timestamp
}
```

**Virtual Properties:**
- **fullName**: String - Concatenated first and last name

**Indexes:**
- **email**: Unique index
- **role**: Standard index

### Event Collection

```javascript
{
  _id: ObjectId,                    // Auto-generated unique identifier
  title: String,                    // Event title
  description: String,              // Full event description
  eventDate: Date,                  // Event date and time
  location: {                       // Embedded location object
    venue: String,                  // Venue name
    city: String,                   // City name
    country: String                 // Country name
  },
  category: String,                 // Event category
  imageUrl: String,                 // URL to stored event image
  ticketTypes: [{                   // Array of ticket options
    name: String,                   // Ticket type name (e.g., "VIP", "Standard")
    price: Number,                  // Price per ticket of this type
    quantity: Number                // Available tickets count
  }],
  ticketsAvailable: Number,         // Available tickets count
  ticketsSold: Number,              // Sold tickets count
  organizer: {                      // Embedded organizer reference
    userId: ObjectId,               // Reference to user ID
    fullName: String,               // Denormalized full name
    profilePicture: String          // Denormalized profile image URL
  },
  createdAt: Date                   // Event creation timestamp
}
```

**Virtual Properties:**
- **totalTickets**: Number - Sum of ticketsAvailable and ticketsSold

**Indexes:**
- **eventDate**: Standard index 
- **category**: Standard index 
- **"organizer.userId"**: Standard index
- **"location.city"**: Standard index




### Booking Collection

```javascript
{
  _id: ObjectId,                    // Auto-generated unique identifier
  bookedTickets: [                 // Array of ticket types and their quantities
    {
      ticketTypeName: String,      // Name of the ticket type (e.g., VIP, Regular)
      quantity: Number             // Quantity of this ticket type (minimum 1)
    }
  ],
  totalAmount: Number,             // Total amount before discount
  discountPercent: Number,         // Discount percentage (0-100)
  customer: {                      // Embedded user reference
    userId: ObjectId,              // Reference to user ID
    fullName: String,              // Denormalized user's full name
    profilePicture: String         // Denormalized profile image URL
  },
  event: {                         // Embedded event reference
    eventId: ObjectId,             // Reference to event ID
    title: String,                 // Denormalized event title
    location: {
      venue: String,               // Venue name
      city: String,                // City of the event
      country: String              // Country of the event
    },
    category: String               // Denormalized event category
  },
  status: "pending" | "confirmed" | "canceled", // Booking status
  createdAt: Date                  // Booking creation timestamp
}
```

**Virtual Properties:**
- **totalQuantityBooked**: Number — Sum of all ticket quantities
- **finalPrice**: Number - Calculated price after discount application

**Indexes:**
- **"event.eventId"**: Standard index 
- **"customer.userId"**: Standard index 
- **status**: Standard index 
- **createdAt**: Standard index

## Design Principles

### 1. Denormalization Strategy

We've strategically denormalized data to optimize for common read patterns:
- **User details** embedded in bookings and events
- **Event details** embedded in bookings
- **Organizer details** embedded in events

This approach reduces the need for expensive joins and additional database queries.

### 2. Performance Considerations

The schema is optimized for these common operations:
- **User profile retrieval**
- **Event listings and filtering**
- **Booking history** for users (filtering by status)
- **Event management** for organizers
- **Booking status tracking** and updates

### 3. Data Integrity

Despite denormalization, we maintain data integrity through:
- **Clear references** between collections
- **Consistent ID fields** for data relationships
- **Limited duplication** of critical data
- **Enum types** for constrained fields like status and roles