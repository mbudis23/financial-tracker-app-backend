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