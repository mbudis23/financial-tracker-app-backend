const express = require('express');
const { getAllBudgetById, createBudget, updateBudgetById } = require('../controllers/budgetController');

const router = express.Router();

router.get('/', getAllBudgetById);
router.post('/', createBudget);
router.put('/:id', updateBudgetById)

module.exports = router;