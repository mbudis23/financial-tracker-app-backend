const express = require('express');
const { getAllBudgetById, createBudget } = require('../controllers/budgetController');

const router = express.Router();

router.get('/', getAllBudgetById);
router.post('/', createBudget);

module.exports = router;