const mongoose = require('mongoose');

// Validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Check if date falls in an inactive period



// Month conversion helper function
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
    const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 
                   'july', 'august', 'september', 'october', 'november', 'december'];
    const idx = MONTHS.findIndex(mm => mm.toLowerCase() === m.toLowerCase());
    if (idx !== -1) return idx;
    
    // Fallback: Date parse (e.g., "Aug")
    const parsed = new Date(`${m} 1, ${y}`);
    if (!Number.isNaN(parsed.valueOf())) return parsed.getMonth();
  }
  
  return null;
}

// Helper function to check if a date falls within inactive periods
function isInInactivePeriod(date, inactivePeriods = []) {
  if (!inactivePeriods || inactivePeriods.length === 0) return false;
  
  const checkDate = new Date(date);
  checkDate.setHours(12, 0, 0, 0); // Set to midday for inclusive range
  
  return inactivePeriods.some(period => {
    const from = new Date(period.from);
    const to = period.to ? new Date(period.to) : new Date(); // If no end date, assume still inactive
    
    // Set time to midnight for accurate comparison
    from.setHours(0, 0, 0, 0);
    to.setHours(23, 59, 59, 999);
    
    return checkDate >= from && checkDate <= to;
  });
}

// Fee status calculation function
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
