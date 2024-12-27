const express = require('express');
const { getAllTransactionById, createTransaction, getTransactionById, updateTransactionById } = require('../controllers/transactionController');

const router = express.Router();

router.get('/', getAllTransactionById);
router.get('/:id', getTransactionById);
router.post('/', createTransaction);
router.put('/:id', updateTransactionById);

module.exports = router;