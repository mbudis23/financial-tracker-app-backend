const mongoose = require("mongoose");

const BudgetSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  monthly_limit: {
    type: Number,
    required: true,
  },
  month: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Budget", BudgetSchema);
