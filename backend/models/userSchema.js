const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        index: true
    },
    profilePicture:{
        type: String,
        default: "https://www.w3schools.com/howto/img_avatar.png"
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ['admin', 'user', 'organizer'],
        default: 'user',
        index: true
    },
    createdAt: {
        type: Date ,
        default: Date.now
    }
    });

// Optional: Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });


userSchema.virtual("fullName").get(function() {
    return `${this.firstName} ${this.lastName}`;
});

const User = mongoose.model('user', userSchema);
module.exports = User;