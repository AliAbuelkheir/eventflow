const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { protect, authorize } = require('../middleware/auth');
const {
  getAllUsers,
  getUserById,
  updateUserById,
  updateUserByIdAdmin,
  deleteUserById,
  getBookingsByUserId,
  getEventsByUserId,
  updateUserRoleById
} = require('../controllers/userController');


/**
 * @route   GET /users
 * @desc    Get a list of all users
 * @access  Admin
 */
router.get('/', protect, authorize('admin'), (req, res) => {  
    getAllUsers(req, res);  
});

/**
 * @route   GET /users/profile
 * @desc    Get current user’s profile
 * @access  Authenticated Users
 */
router.get('/profile', protect, (req, res) => {
    getUserById(req, res, req.user.id);
});

/**
 * @route   PUT /users/profile
 * @desc    Update current user’s profile
 * @access  Authenticated Users
 */
router.put('/profile', protect, (req, res) => {
    updateUserById(req, res, req.user.id);
});

/**
 * @route   GET /users/:id
 * @desc    Get details of a single user
 * @access  Admin
 */
router.get('/:id', protect, authorize('admin'), (req, res) => {
    getUserById(req, res, req.params.id);

});

/**
 * @route   PUT /users/:id
 * @desc    Update user’s role
 * @access  Admin
 */
router.put('/:id', protect, authorize('admin'), (req, res) => {
    updateUserRoleById(req, res, req.params.id);
});

/**
 * @route   DELETE /users/:id
 * @desc    Delete a user
 * @access  Admin
 */
router.delete('/:id', protect, authorize('admin'), (req, res) => {
    deleteUserById(req, res, req.params.id);
});

/**
 * @route   GET /users/bookings
 * @desc    Get current user’s bookings
 * @access  Standard User
 */
router.get('/bookings', protect, authorize('user'), (req, res) => {
    getBookingsByUserId(req, res, req.user.id);
});

/**
 * @route   GET /users/events
 * @desc    Get current user’s events
 * @access  Event Organizer
 */
router.get('/events', protect, authorize('organizer'), (req, res) => {
    getEventsByUserId(req, res, req.user.id);
});


module.exports = router;