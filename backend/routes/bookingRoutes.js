const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { bookEvent, getBookingDetails, deleteBooking} = require("../controllers/bookingController");

router.post("/", protect, authorize(['user']), bookEvent);
router.delete("/:id", protect, authorize(['user']), deleteBooking);
router.get("/:id", protect, authorize(['user']), getBookingDetails);

module.exports = router;