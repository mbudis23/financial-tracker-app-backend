const express = require('express');
const { getAllTransactionById, createTransaction, getTransactionById } = require('../controllers/transactionController');

const router = express.Router();

router.get('/', getAllTransactionById);
router.get('/:id', getTransactionById);
router.post('/', createTransaction);

module.exports = router;