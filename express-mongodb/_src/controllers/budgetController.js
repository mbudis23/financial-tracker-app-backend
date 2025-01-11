const Budget = require('../models/budget');
const logger = require('../utils/logger');

exports.getAllBudget = async (req, res) => {
    try {
        // Validasi user ID
        if (!req.user || !req.user.userId) {
            logger.warn('User ID not found in request. Authentication might have failed.');
            return res.status(400).json({
                message: 'User ID is required to fetch budgets.',
            });
        }

        // Ambil semua budget berdasarkan user_id
        const budgets = await Budget.find({
            user_id: req.user.userId,
        });

        if (!budgets || budgets.length === 0) {
            logger.info(`No budgets found for user: ${req.user.userId}`);
            return res.status(404).json({
                message: 'No budgets found.',
            });
        }

        logger.info(`Fetched ${budgets.length} budgets for user: ${req.user.userId}`);
        res.status(200).json({
            budgets,
        });
    } catch (error) {
        logger.error(`Error fetching budgets for user: ${req.user?.userId || 'unknown'}`, {
            message: error.message,
            stack: error.stack,
        });

        res.status(500).json({
            message: 'An unexpected error occurred while fetching budgets. Please try again later.',
        });
    }
};

exports.createBudget = async (req, res) => {
    try {
        const { monthly_limit } = req.body;

        // Validasi input
        if (!monthly_limit || typeof monthly_limit !== 'number' || monthly_limit <= 0) {
            logger.warn('Validation failed: Invalid or missing monthly_limit');
            return res.status(400).json({
                message: 'Monthly limit is required and must be a positive number.',
            });
        }

        // Buat budget baru
        const newBudget = new Budget({
            user_id: req.user.userId,
            monthly_limit,
        });

        await newBudget.save();

        logger.info(`Budget created successfully for user: ${req.user.userId}, budget ID: ${newBudget._id}`);

        res.status(201).json({
            message: 'Budget created successfully!',
            budget: newBudget,
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            logger.warn(`Validation error while creating budget: ${error.message}`);
            return res.status(400).json({
                message: 'Invalid budget data. Please check your input.',
            });
        }

        logger.error(`Error creating budget for user: ${req.user?.userId || 'unknown'}`, {
            message: error.message,
            stack: error.stack,
        });

        res.status(500).json({
            message: 'An unexpected error occurred while creating the budget. Please try again later.',
        });
    }
};

exports.updateBudgetById = async (req, res) => {
    try {
        const updatedBudget = await Budget.findOneAndUpdate(
            {
                _id: req.params.id,
                user_id: req.user.userId 
            }, 
            req.body, 
            {
                new: true
            }
        );
        if (!updatedBudget) {
            return res.status(404).json({
                message: 'Budget not found.'
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}