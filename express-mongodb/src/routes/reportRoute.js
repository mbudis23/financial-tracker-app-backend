const express = require('express');
const { getMonthlyReport } = require('../controllers/transactionController');

const router = express.Router();

router.get('/monthly', getMonthlyReport);

module.exports = router;