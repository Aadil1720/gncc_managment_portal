const { boolean } = require('joi');
const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  month: {
    type: String,
    required: true,
    enum: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ]
  },
  year: {
    type: Number,
    required: true
  },
  tuitionFees: {
    type: Number,
  },
  admissionFees: {
    type: Number,
    default: 0
  },
  transportFees: {
    type: Number,
    default: 0
  },
  totalAmountPaid: {
    type: Number
  },
  datePaid: {
    type: Date,
    default: Date.now
  },
  slipPath:{
    type:String,
  },
  notes:{
    type:String
  },
  isPaid:{
    type:Boolean
  },
  remarks: {        // <-- New field added
    type: String,
  }
});

// Automatically calculate totalAmountPaid before saving
feeSchema.pre('save', function (next) {
  this.totalAmountPaid = this.tuitionFees + this.admissionFees + this.transportFees;
  next();
});

// Prevent duplicate entries for the same student, month, and year
feeSchema.index({ studentId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Fee', feeSchema);

