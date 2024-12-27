const express = require('express');
const { getAllBudgetById } = require('../controllers/budgetController');

const router = express.Router();

router.get('/', getAllBudgetById);

module.exports = router;