const mongoose = require('mongoose');

const expenditureSchema = new mongoose.Schema({
  description: String,
  amount: { type: Number, required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expenditure', expenditureSchema);
