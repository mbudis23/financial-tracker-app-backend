const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password_hash: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now 
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);