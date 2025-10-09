const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');
const { validateFeeSubmission } = require('../middleware/validate');

// Student-based queries
router.get('/student/:studentId', feeController.getFeeHistoryByStudent);
// Fee summary by student with paid/due months
router.get('/summary/:studentId', feeController.getFeeSummary);

// CRUD operations
router.post('/submit', validateFeeSubmission, feeController.createFee);
router.get('/by/monthAndYear/all', feeController.listFees);
router.get('/:id', feeController.getFeeById);
router.put('/:id', feeController.updateFee);
router.delete('/:id', feeController.deleteFee);
router.post('/bulk', feeController.createBulkFees);

module.exports = router;