const mongoose = require('mongoose');

// Validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Check if date falls in an inactive period
const isInInactivePeriod = (date, inactivePeriods = []) => {
  return inactivePeriods.some(period => {
    return date >= new Date(period.from) && date <= new Date(period.to);
  });
};

// Get paid and due months
const getFeeStatus = (startDate, fees = [], inactivePeriods = []) => {
  const currentDate = new Date();
  const start = new Date(startDate);

  const year = start.getFullYear();
  const month = start.getMonth();
  const day = start.getDate();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Start from next month if joined in last 5 days
  if (day >= daysInMonth - 4) {
    start.setMonth(start.getMonth() + 1);
    start.setDate(1);
  }

  const paidMonthsSet = new Set(
    fees.map(f => {
      const y = Number(f.year);
      const m = Number(f.month);
      if (isNaN(y) || isNaN(m)) return null;
      const date = new Date(y, m - 1);
      return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    }).filter(Boolean)
  );

  const dueMonths = [];
  let current = new Date(start);

  while (current <= currentDate) {
    const label = current.toLocaleString('default', { month: 'long', year: 'numeric' });
    const snapshotDate = new Date(current.getFullYear(), current.getMonth(), 1);

    if (!paidMonthsSet.has(label) && !isInInactivePeriod(snapshotDate, inactivePeriods)) {
      dueMonths.push(label);
    }

    current.setMonth(current.getMonth() + 1);
  }

  return {
    paidMonths: Array.from(paidMonthsSet),
    dueMonths,
    totalPaid: fees.reduce((sum, f) => sum + (f.totalAmountPaid || 0), 0),
  };
};

module.exports = {
  isValidObjectId,
  isInInactivePeriod,
  getFeeStatus,
};
