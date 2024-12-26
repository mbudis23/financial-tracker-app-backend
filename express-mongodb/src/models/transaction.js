const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema);