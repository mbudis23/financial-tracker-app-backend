const express = require('express');
const { getAllBudget, createBudget, updateBudgetById } = require('../controllers/budgetController');

const router = express.Router();

router.get('/', getAllBudget);
router.post('/', createBudget);
router.put('/:id', updateBudgetById)

module.exports = router;