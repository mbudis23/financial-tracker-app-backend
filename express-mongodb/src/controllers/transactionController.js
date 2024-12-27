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

exports.updateTransactionById = async (req, res) => {
    try {
        const updatedTransaction = await Transaction.findOneAndUpdate(
            {_id: req.params.id, user_id: req.user.userId},
            req.body,
            {new: true}
        );
        if (!updatedTransaction) {
            return res.status(404).json({
                message: 'Transaction not found.'
            });
        };
        res.status(200).json({
            message: 'Update transaction successfully!'
        });
    } catch (error){
        res.status(400).json({
            message: error.message
        });
    }
}

exports.deleteTransactionById = async (req, res) => {
    try {
        const deletedTransaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            user_id: req.user.userId
        })
        if (!deletedTransaction) {
            return res.status(404).json({
                message: 'Transaction not found.'
            });
        }
        res.status(200).json({
            message: 'Delete a transaction successfully!'
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.getMonthlyReport = async (req, res) => {
    try {
        const startOfMonth = new Date(
            new Date().getFullYear, 
            new Date().getMonth(), 
            1
        );
        const endOfMonth = new Date(
            new Date().getFullYear(),
            new Date().getMonth +1,
            0
        );
        const transaction = await Transaction.find({
            user_id: req.user.userId,
            date: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        });
        res.status(201).json({
            transaction
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

exports.getYearlyReport = async (req, res) => {
    try {
        const startOfYear = new Date(new Date().getFullYear(), 0, 1);
        const endOfYear = new Date(new Date().getFullYear(), 11, 31);
        const transactions = await Transaction.find({
            user_id: req.user.userId,
            date: {
                $gte: startOfYear, 
                $lte: endOfYear
            },
        });
        res.status(201).json({
            transactions
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}