const express = require("express");
const {
  getAllBudget,
  createBudget,
  updateBudgetById,
  deleteBudgetById,
} = require("../controllers/budgetController");

const router = express.Router();

router.get("/", getAllBudget);
router.post("/", createBudget);
router.put("/:id", updateBudgetById);
router.delete("/:id", deleteBudgetById);

module.exports = router;
