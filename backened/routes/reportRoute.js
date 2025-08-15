const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report');

router.get('/monthly', reportController.monthlyReport);  // ?month=May&year=2025

module.exports = router;
