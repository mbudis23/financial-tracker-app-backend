const logger = require('../utils/logger'); 
const Transaction = require('../models/transaction');

exports.getAllTransaction = async (req, res) => {
    try {
        // Validasi apakah user id tersedia di req.user
        if (!req.user || !req.user.userId) {
            logger.warn('User ID not found in request. Authentication might have failed.');
            return res.status(400).json({
                message: 'User ID is required to fetch transactions.',
            });
        }

        // Ambil transaksi berdasarkan user_id
        const transactions = await Transaction.find({
            user_id: req.user.userId,
        });

        if (transactions.length === 0) {
            logger.info(`No transactions found for user: ${req.user.userId}`);
            return res.status(404).json({
                message: 'No transactions found for the user.',
            });
        }

        logger.info(`Fetched ${transactions.length} transactions for user: ${req.user.userId}`);
        res.status(200).json({
            transactions,
        });
    } catch (error) {
        logger.error(`Error fetching transactions for user: ${req.user?.userId || 'unknown'}`, {
            message: error.message,
            stack: error.stack,
        });
        res.status(500).json({
            message: 'An error occurred while fetching transactions. Please try again later.',
        });
    }
};

exports.createTransaction = async (req, res) => {
    try {
        const { amount, type, date, description } = req.body;

        // Validasi input
        if (!amount || !type || !date) {
            logger.warn('Validation failed: Missing required fields');
            return res.status(400).json({
                message: 'Amount, type, and date are required fields.',
            });
        }

        // Buat transaksi baru
        const newTransaction = new Transaction({
            user_id: req.user.userId,
            amount,
            type,
            date,
            description,
        });

        await newTransaction.save();

        logger.info(
            `Transaction created successfully for user: ${req.user.userId}, transaction ID: ${newTransaction._id}`
        );

        res.status(201).json({
            message: 'Transaction created successfully!',
            transaction: newTransaction,
        });
    } catch (error) {
        // Tangkap error MongoDB atau lainnya
        if (error.name === 'ValidationError') {
            logger.warn(`Validation error: ${error.message}`);
            return res.status(400).json({
                message: 'Invalid transaction data. Please check your input.',
            });
        }

        logger.error(
            `Error creating transaction for user: ${req.user?.userId || 'unknown'}`,
            { message: error.message, stack: error.stack }
        );

        res.status(500).json({
            message: 'An unexpected error occurred while creating the transaction. Please try again later.',
        });
    }
};



exports.getTransactionById = async (req, res) => {
    try {
        const transactionId = req.params.id;

        // Validasi ID transaksi
        if (!transactionId) {
            logger.warn('Transaction ID is missing in request parameters');
            return res.status(400).json({
                message: 'Transaction ID is required.',
            });
        }

        // Cari transaksi berdasarkan ID dan user_id
        const transaction = await Transaction.findOne({
            _id: transactionId,
            user_id: req.user.userId,
        });

        if (!transaction) {
            logger.info(`Transaction not found for user: ${req.user.userId}, transaction ID: ${transactionId}`);
            return res.status(404).json({
                message: 'Transaction not found.',
            });
        }

        logger.info(`Transaction retrieved successfully for user: ${req.user.userId}, transaction ID: ${transactionId}`);
        res.status(200).json({
            transaction,
        });
    } catch (error) {
        if (error.name === 'CastError') {
            logger.warn(`Invalid transaction ID format: ${req.params.id}`);
            return res.status(400).json({
                message: 'Invalid transaction ID format.',
            });
        }

        logger.error(`Error retrieving transaction for user: ${req.user?.userId || 'unknown'}, transaction ID: ${req.params.id}`, {
            message: error.message,
            stack: error.stack,
        });

        res.status(500).json({
            message: 'An unexpected error occurred while retrieving the transaction. Please try again later.',
        });
    }
};

exports.updateTransactionById = async (req, res) => {
    try {
        const transactionId = req.params.id;

        // Validasi ID transaksi
        if (!transactionId) {
            logger.warn('Transaction ID is missing in request parameters');
            return res.status(400).json({
                message: 'Transaction ID is required.',
            });
        }

        // Validasi data yang akan diupdate
        if (Object.keys(req.body).length === 0) {
            logger.warn('Validation failed: No update data provided');
            return res.status(400).json({
                message: 'Update data is required.',
            });
        }

        // Update transaksi berdasarkan ID dan user_id
        const updatedTransaction = await Transaction.findOneAndUpdate(
            { _id: transactionId, user_id: req.user.userId },
            req.body,
            { new: true, runValidators: true } // `new: true` untuk mengembalikan data yang sudah diperbarui
        );

        if (!updatedTransaction) {
            logger.info(`Transaction not found for user: ${req.user.userId}, transaction ID: ${transactionId}`);
            return res.status(404).json({
                message: 'Transaction not found.',
            });
        }

        logger.info(
            `Transaction updated successfully for user: ${req.user.userId}, transaction ID: ${transactionId}`
        );

        res.status(200).json({
            message: 'Transaction updated successfully!',
            transaction: updatedTransaction,
        });
    } catch (error) {
        if (error.name === 'CastError') {
            logger.warn(`Invalid transaction ID format: ${req.params.id}`);
            return res.status(400).json({
                message: 'Invalid transaction ID format.',
            });
        }

        if (error.name === 'ValidationError') {
            logger.warn(`Validation error while updating transaction: ${error.message}`);
            return res.status(400).json({
                message: 'Invalid data provided for update. Please check your input.',
            });
        }

        logger.error(`Error updating transaction for user: ${req.user?.userId || 'unknown'}, transaction ID: ${req.params.id}`, {
            message: error.message,
            stack: error.stack,
        });

        res.status(500).json({
            message: 'An unexpected error occurred while updating the transaction. Please try again later.',
        });
    }
};


exports.deleteTransactionById = async (req, res) => {
    try {
        const transactionId = req.params.id;

        // Validasi ID transaksi
        if (!transactionId) {
            logger.warn('Transaction ID is missing in request parameters');
            return res.status(400).json({
                message: 'Transaction ID is required.',
            });
        }

        // Hapus transaksi berdasarkan ID dan user_id
        const deletedTransaction = await Transaction.findOneAndDelete({
            _id: transactionId,
            user_id: req.user.userId,
        });

        if (!deletedTransaction) {
            logger.info(`Transaction not found for user: ${req.user.userId}, transaction ID: ${transactionId}`);
            return res.status(404).json({
                message: 'Transaction not found.',
            });
        }

        logger.info(`Transaction deleted successfully for user: ${req.user.userId}, transaction ID: ${transactionId}`);
        res.status(200).json({
            message: 'Transaction deleted successfully!',
        });
    } catch (error) {
        if (error.name === 'CastError') {
            logger.warn(`Invalid transaction ID format: ${req.params.id}`);
            return res.status(400).json({
                message: 'Invalid transaction ID format.',
            });
        }

        logger.error(`Error deleting transaction for user: ${req.user?.userId || 'unknown'}, transaction ID: ${req.params.id}`, {
            message: error.message,
            stack: error.stack,
        });

        res.status(500).json({
            message: 'An unexpected error occurred while deleting the transaction. Please try again later.',
        });
    }
};

exports.getMonthlyReport = async (req, res) => {
    try {
        // Validasi apakah user ID tersedia
        if (!req.user || !req.user.userId) {
            logger.warn('User ID not found in request. Authentication might have failed.');
            return res.status(400).json({
                message: 'User ID is required to fetch the monthly report.',
            });
        }

        // Hitung tanggal awal dan akhir bulan
        const startOfMonth = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
        );
        const endOfMonth = new Date(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            0
        );

        logger.info(
            `Fetching transactions for user: ${req.user.userId} from ${startOfMonth} to ${endOfMonth}`
        );

        // Ambil transaksi berdasarkan user_id dan tanggal
        const transactions = await Transaction.find({
            user_id: req.user.userId,
            date: {
                $gte: startOfMonth,
                $lte: endOfMonth,
            },
        });

        if (!transactions || transactions.length === 0) {
            logger.info(`No transactions found for user: ${req.user.userId} in the current month.`);
            return res.status(404).json({
                message: 'No transactions found for the current month.',
            });
        }

        logger.info(`Fetched ${transactions.length} transactions for user: ${req.user.userId}`);
        res.status(200).json({
            transactions,
        });
    } catch (error) {
        logger.error(
            `Error fetching monthly report for user: ${req.user?.userId || 'unknown'}`, 
            {
                message: error.message,
                stack: error.stack,
            }
        );

        res.status(500).json({
            message: 'An unexpected error occurred while fetching the monthly report. Please try again later.',
        });
    }
};

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