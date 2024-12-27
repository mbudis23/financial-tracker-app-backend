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
