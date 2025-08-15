const express = require('express');
const router = express.Router();
const matchIncomeController = require('../controllers/matchIncomeController');

// Create a new match income
router.post('/', matchIncomeController.createMatchIncome);

// Get all match incomes (with pagination and filtering)
router.get('/', matchIncomeController.listMatchIncomes);

// Get a specific match income by ID
router.get('/:id', matchIncomeController.getMatchIncomeById);

// Update a match income by ID
router.put('/:id', matchIncomeController.updateMatchIncome);

// Delete a match income by ID
router.delete('/:id', matchIncomeController.deleteMatchIncome);

module.exports = router;