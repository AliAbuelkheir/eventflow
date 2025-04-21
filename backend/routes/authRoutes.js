const express = require('express');
const router = express.Router();
const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { register, login, forgetPassword } = require('../controllers/authController');

/**
 * @route   POST auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register',register);

/**
 *  * @route   POST auth/login
 * * @desc    Login user
 * * @access  Public
 */
router.post('/login', login);

/**
 * * @route   PUT forget-password
 * * @desc    Change user's password
 * * @access  Public
 */
router.put('/forget-password',forgetPassword);

module.exports = router;

