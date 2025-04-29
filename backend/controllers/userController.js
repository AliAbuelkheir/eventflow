const User = require("../models/userSchema");
const Booking = require("../models/bookingSchema");
const Event = require("../models/eventSchema");


exports.getAllUsers = async (req, res) => {
  try {
    // Add pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Execute query
    const users = await User.find()
      .select('-password')
      .skip(startIndex)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Get total count for pagination
    const total = await User.countDocuments({});

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      data: users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getUserById = async (req, res, id) => {
    try{
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            data: user
        });
    }catch(error){
        console.error('Get user by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

exports.updateUserById = async (req, res, id) => {
    try{
        const { firstName, lastName, profilePicture } = req.body;
        const updateData = { firstName, lastName, profilePicture };
        const user = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            data: user
        });
    }catch(error){
        console.error('Update user by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

exports.updateUserRoleById = async (req, res, id) => {
    try{
        const {role} = req.body;
        const updateData = {role};
        const user = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        res.status(200).json({
            success: true,
            data: user
        });
    }catch(error){
        console.error('Update user by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

exports.deleteUserById = async (req, res, id) => {
    try {
        const user = await User.findByIdAndDelete(id);
        
        if (!user) {
          return res.status(404).json({
            success: false,
            message: 'User not found'
          });
        }
    
        res.status(200).json({
          success: true,
          message: 'User deleted successfully'
        });
      } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
          success: false,
          message: 'Server error',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

exports.getBookingsByUserId = async (req, res, id) => {
    try {
        const userId = id;
        const bookings = await Booking.find({ 'customer.userId' : userId })
            .populate('event.eventId', 'title date location')
            .populate('customer.userId', 'firstName lastName email profilePicture')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        })
    }
    catch (error) {
        console.error('Get Bookings by user error:', error);
        res.status(500).json({
          success: false,
          message: 'Server error',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

exports.getEventsByUserId = async (req, res, id) => {
    try {
        const userId = id;
        const bookings = await Event.find({ 'organizer.userId' : userId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        })
    }
    catch (error) {
        console.error('Get Events by user error:', error);
        res.status(500).json({
          success: false,
          message: 'Server error',
          error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}


