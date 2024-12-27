const Budget = require('../models/budget');

exports.getAllBudgetById = async (req, res) => {
    try {
        const budgets = await Budget.find({
            user_id: req.user.userId
        })
        res.status(200).json({
            budgets
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.createBudget = async (req, res) => {
    try {
        const { monthly_limit } = req.body;
        const newBudget = new Budget({
            user_id: req.user.userId,
            monthly_limit
        });
        await newBudget.save();
        res.status(201).json({
            message: 'Create budget successfully!',
            monthly_limit
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
}

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