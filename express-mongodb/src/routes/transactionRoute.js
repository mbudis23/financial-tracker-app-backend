const express = require('express');
const { getAllTransactionById } = require('../controllers/transactionController');

const router = express.Router();

router.get('/', getAllTransactionById);

module.exports = router;