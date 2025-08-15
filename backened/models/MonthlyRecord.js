const mongoose = require('mongoose');

const monthlyRecordSchema = new mongoose.Schema({
  month: { type: String, required: true },
  year: { type: Number, required: true },
  totalFees: { type: Number, required: true },
  totalExpenditure: { type: Number, required: true },
  netIncome: { type: Number, required: true },
});

module.exports = mongoose.model('MonthlyRecord', monthlyRecordSchema);
