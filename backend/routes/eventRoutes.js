const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    createEvent,
    getAllApprovedEvents,
    getAllEvents,
    getEventById,
    updateEventById,
    deleteEventById
} = require('../controllers/eventController');

router.post("/", protect, authorize(['organizer']), createEvent);
router.get("/", getAllApprovedEvents);
router.get("/all", protect, authorize(['admin']), getAllEvents);
router.get("/:id", getEventById);
router.put("/:id", protect, authorize(['organizer', 'admin']), updateEventById);
router.delete("/:id", protect, authorize(['organizer', 'admin']), deleteEventById);


module.exports = router;
