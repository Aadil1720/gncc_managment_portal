const express = require('express');
const router = express.Router();
const expenditureController = require('../controllers/expenditureController');

// Create a new expenditure
router.post('/', expenditureController.createExpenditure);

// Get all expenditures (with pagination and filtering)
router.get('/all', expenditureController.listExpenditures);

// Get a specific expenditure by ID
router.get('/:id', expenditureController.getExpenditureById);

// Update an expenditure by ID
router.put('/:id', expenditureController.updateExpenditure);

// Delete an expenditure by ID
router.delete('/:id', expenditureController.deleteExpenditure);

module.exports = router;