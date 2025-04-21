const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  ticketQuantity: {
    type: Number,
    required: true,
    min: 1
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  discountPercent: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  customer: {
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
  event: {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true
    },
    location: {
      venue: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true }
    },
    category: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'canceled'],
    default: 'pending',
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

bookingSchema.virtual('finalPrice').get(function () {
    const discount = (this.totalAmount * this.discountPercent) / 100;
    return this.totalAmount - discount;
  });

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;