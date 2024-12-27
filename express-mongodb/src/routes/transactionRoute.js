const express = require('express');
const { getAllTransactionById, createTransaction } = require('../controllers/transactionController');

const router = express.Router();

router.get('/', getAllTransactionById);
router.post('/', createTransaction);

module.exports = router;