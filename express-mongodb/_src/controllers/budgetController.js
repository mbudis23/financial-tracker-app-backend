const Budget = require("../models/budget");
const logger = require("../utils/logger");

exports.getAllBudget = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      logger.warn(
        "User ID not found in request. Authentication might have failed."
      );
      return res.status(400).json({
        message: "User ID is required to fetch budgets.",
      });
    }

    const budgets = await Budget.find({
      user_id: req.user.userId,
    });

    if (!budgets || budgets.length === 0) {
      logger.info(`No budgets found for user: ${req.user.userId}`);
      return res.status(404).json({
        message: "No budgets found.",
      });
    }

    logger.info(
      `Fetched ${budgets.length} budgets for user: ${req.user.userId}`
    );
    res.status(200).json({
      budgets,
    });
  } catch (error) {
    logger.error(
      `Error fetching budgets for user: ${req.user?.userId || "unknown"}`,
      {
        message: error.message,
        stack: error.stack,
      }
    );

    res.status(500).json({
      message:
        "An unexpected error occurred while fetching budgets. Please try again later.",
    });
  }
};

exports.createBudget = async (req, res) => {
  try {
    const { monthly_limit, month } = req.body;

    if (
      !monthly_limit ||
      typeof monthly_limit !== "number" ||
      monthly_limit <= 0
    ) {
      return res.status(400).json({
        message: "Monthly limit is required and must be a positive number.",
      });
    }

    if (!month) {
      return res.status(400).json({
        message: "Month is required.",
      });
    }

    const parsedMonth = new Date(month);

    if (isNaN(parsedMonth.getTime())) {
      return res.status(400).json({
        message: "Invalid month format. Please provide a valid date.",
      });
    }

    const existingBudget = await Budget.findOne({
      user_id: req.user.userId,
      month: parsedMonth,
    });

    if (existingBudget) {
      return res.status(400).json({
        message:
          "A budget for this month already exists. Please choose a different month.",
      });
    }

    const newBudget = new Budget({
      user_id: req.user.userId,
      monthly_limit,
      month: parsedMonth,
    });

    await newBudget.save();

    res.status(201).json({
      message: "Budget created successfully!",
      budget: newBudget,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid budget data. Please check your input.",
      });
    }

    res.status(500).json({
      message:
        "An unexpected error occurred while creating the budget. Please try again later.",
      error: error.message,
    });
  }
};

exports.updateBudgetById = async (req, res) => {
  try {
    const { month, monthly_limit } = req.body;

    if (
      !monthly_limit ||
      typeof monthly_limit !== "number" ||
      monthly_limit <= 0
    ) {
      return res.status(400).json({
        message: "Monthly limit is required and must be a positive number.",
      });
    }

    if (!month) {
      return res.status(400).json({
        message: "Month is required.",
      });
    }

    const parsedMonth = new Date(month);

    if (isNaN(parsedMonth.getTime())) {
      return res.status(400).json({
        message: "Invalid month format. Please provide a valid date.",
      });
    }

    const existingBudget = await Budget.findOne({
      user_id: req.user.userId,
      month: parsedMonth,
      _id: { $ne: req.params.id },
    });

    if (existingBudget) {
      return res.status(400).json({
        message:
          "A budget for this month already exists. Please choose a different month.",
      });
    }

    const updatedBudget = await Budget.findOneAndUpdate(
      {
        _id: req.params.id,
        user_id: req.user.userId,
      },
      { month: parsedMonth, monthly_limit },
      { new: true }
    );

    if (!updatedBudget) {
      return res.status(404).json({
        message: "Budget not found.",
      });
    }

    res.status(200).json({
      message: "Budget updated successfully!",
      budget: updatedBudget,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while updating the budget.",
      error: error.message,
    });
  }
};

exports.deleteBudgetById = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      logger.warn(
        "User ID not found in request. Authentication might have failed."
      );
      return res.status(400).json({
        message: "User ID is required to delete a budget.",
      });
    }

    const deletedBudget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user.userId,
    });

    // Jika budget tidak ditemukan
    if (!deletedBudget) {
      logger.info(
        `Budget not found or unauthorized attempt to delete. User: ${req.user.userId}, Budget ID: ${req.params.id}`
      );
      return res.status(404).json({
        message:
          "Budget not found or you do not have permission to delete this budget.",
      });
    }

    logger.info(
      `Budget deleted successfully. User: ${req.user.userId}, Budget ID: ${req.params.id}`
    );
    res.status(200).json({
      message: "Budget deleted successfully!",
    });
  } catch (error) {
    logger.error(
      `Error deleting budget. User: ${
        req.user?.userId || "unknown"
      }, Budget ID: ${req.params.id}`,
      {
        message: error.message,
        stack: error.stack,
      }
    );

    res.status(500).json({
      message:
        "An unexpected error occurred while deleting the budget. Please try again later.",
    });
  }
};
