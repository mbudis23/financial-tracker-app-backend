const transaction = require('../models/transaction');
const Transaction = require('../models/transaction');

exports.getAllTransactionById = async (req, res) => {
    try{
        const transaction = await Transaction.find({
            user_id: req.user.userId
        });
        res.status(200).json({
            transaction
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.createTransaction = async (req, res) => {
    try {
        const {amount, type, date, description} = req.body;
        const newTransaction = new Transaction({
            user_id: req.user.userId,
            amount,
            type,
            date,
            description
        });
        await newTransaction.save();
        res.status(201).json({
            message: "Create transaction successfully!",
            newTransaction
        })
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

exports.getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            user_id: req.user.userId
        });
        if (!transaction) {
            res.json({
                transaction
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}