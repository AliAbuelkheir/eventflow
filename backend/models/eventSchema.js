const mongoose = require('mongoose');

const ticketTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  eventDate: {
    type: Date,
    required: true,
    index: true
  },
  location: {
    venue: { type: String, required: true },
    city: { type: String, required: true, index: true },
    country: { type: String, required: true }
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  ticketTypes: {
    type: [ticketTypeSchema],
    default: []
  },
  ticketsAvailable: {
    type: Number,
    default: 0,
    min: 0
  },
  ticketsSold: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'declined'],
    default: 'pending'
  },
  organizer: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    fullName: {
      type: String,
      required: true
    },
    profilePicture: {
      type: String,
      default: 'https://www.w3schools.com/howto/img_avatar.png'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

eventSchema.virtual('totalTickets').get(function() {
  return this.ticketsAvailable + this.ticketsSold;
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;