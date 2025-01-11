const express = require('express');
const { getAllTransaction, createTransaction, getTransactionById, updateTransactionById, deleteTransactionById } = require('../controllers/transactionController');

const router = express.Router();

router.get('/', getAllTransaction);
router.get('/:id', getTransactionById);
router.post('/', createTransaction);
router.put('/:id', updateTransactionById);
router.delete('/:id', deleteTransactionById);

module.exports = router;