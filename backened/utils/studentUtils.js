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
// put this near getFeeStatus (same file)
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

function monthToIndex(m, y) {
  // Accept 0-11 or 1-12 numbers
  if (typeof m === 'number') {
    if (m >= 0 && m <= 11) return m;
    if (m >= 1 && m <= 12) return m - 1;
    return null;
  }
  // Accept numeric strings
  const num = Number(m);
  if (!Number.isNaN(num)) {
    if (num >= 0 && num <= 11) return num;
    if (num >= 1 && num <= 12) return num - 1;
  }
  // Accept month-name strings ("August", case-insensitive)
  if (typeof m === 'string') {
    const idx = MONTHS.findIndex(mm => mm.toLowerCase() === m.toLowerCase());
    if (idx !== -1) return idx;
    // Fallback: Date parse (e.g., "Aug")
    const parsed = new Date(`${m} 1, ${y}`);
    if (!Number.isNaN(parsed.valueOf())) return parsed.getMonth();
  }
  return null;
}

const getFeeStatus = (fees = [], inactivePeriods = []) => {
  const currentDate = new Date();
  const start = new Date(2025, 7, 1); // 1 Aug 2025 (month is 0-based)

  // Build a set of "Month YYYY" labels for paid months
  const paidMonthsSet = new Set();
  for (const f of fees) {
    const y = Number(f.year);
    if (!Number.isFinite(y)) continue;
    const mIdx = monthToIndex(f.month, y);
    if (mIdx === null) continue;
    const label = new Date(y, mIdx, 1).toLocaleString('default', { month: 'long', year: 'numeric' });
    paidMonthsSet.add(label);
  }

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
