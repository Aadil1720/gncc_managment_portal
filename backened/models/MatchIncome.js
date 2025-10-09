const mongoose = require('mongoose');

const matchIncomeSchema = new mongoose.Schema({
  description: { type: String, default: 'Match Fees Income' },
  amount: { type: Number, required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  date: { type: Date, default: Date.now }
},
{
  timestamps:true
});

module.exports = mongoose.model('MatchIncome', matchIncomeSchema);
