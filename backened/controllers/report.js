const Expenditure = require('../models/Expenditure');
const MatchIncome = require('../models/MatchIncome');
const Fee = require('../models/Fees');
const Student = require('../models/student');
const moment = require('moment');

exports.monthlyReport = async (req, res) => {
  try {
    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).json({ error: 'Please provide both month and year' });
    }

    const yearNum = parseInt(year);
    const monthIndex = moment().month(month).format('M') - 1; // Convert month name to 0-11 index
    const startDate = new Date(yearNum, monthIndex, 1);
    const endDate = new Date(yearNum, monthIndex + 1, 1);

    // Parallel data fetching
    const [expenditures, matchIncomes, fees, admittedStudents, prevMonthData] = await Promise.all([
      Expenditure.find({ month, year: yearNum }).sort({ category: 1 }),
      MatchIncome.find({ month, year: yearNum }).sort({ source: 1 }),
      Fee.find({ month, year: yearNum }).populate('studentId', 'name admissionNumber'),
      Student.find({
        dateOfJoining: { $gte: startDate, $lt: endDate }
      }).select('name admissionNumber admissionFees dateOfJoining'),
      
      // Get previous month data for comparison
      this.getPreviousMonthData(monthIndex, yearNum)
    ]);

    // Calculate totals
    const totalExpenditure = expenditures.reduce((sum, exp) => sum + exp.amount, 0);
    const totalMatchIncome = matchIncomes.reduce((sum, inc) => sum + inc.amount, 0);
    const totalFeesCollected = fees.reduce((sum, fee) => sum + fee.totalAmountPaid, 0);
    const totalAdmissionFees = admittedStudents.reduce((sum, student) => sum + (student.admissionFees || 0), 0);
    const totalFees = totalFeesCollected + totalAdmissionFees;
    const netIncome = totalMatchIncome + totalFees - totalExpenditure;

    // Additional business insights
    const insights = {
      feePerformance: this.calculateFeePerformance(fees, prevMonthData.fees),
      expenditureAnalysis: this.analyzeExpenditures(expenditures),
      studentGrowth: this.calculateGrowthMetrics(admittedStudents, prevMonthData.students),
      incomeSources: this.analyzeIncomeSources(matchIncomes, totalFees),
      financialHealth: this.assessFinancialHealth(netIncome, totalExpenditure)
    };

    res.json({
      metadata: {
        month,
        year: yearNum,
        reportGenerated: new Date(),
        timePeriod: `${month} ${yearNum}`
      },
      financialSummary: {
        totalIncome: totalMatchIncome + totalFees,
        totalExpenditure,
        netIncome,
        profitMargin: ((netIncome / (totalMatchIncome + totalFees)) * 100)
      },
      detailedData: {
        expenditures: {
          items: expenditures,
          byCategory: this.groupByCategory(expenditures)
        },
        incomes: {
          matchIncomes,
          feeIncome: {
            monthlyFees: totalFeesCollected,
            admissionFees: totalAdmissionFees
          }
        },
        students: {
          newAdmissions: admittedStudents.length,
          list: admittedStudents
        }
      },
      insights,
      comparisons: {
        previousMonth: prevMonthData,
        percentageChange: this.calculatePercentageChanges({
          currentIncome: totalMatchIncome + totalFees,
          currentExpenses: totalExpenditure,
          prevIncome: prevMonthData.totalIncome,
          prevExpenses: prevMonthData.totalExpenditure
        })
      }
    });

  } catch (err) {
    console.error('Monthly report error:', err);
    res.status(500).json({ 
      error: 'Failed to generate report',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Helper methods
exports.getPreviousMonthData = async (currentMonthIndex, currentYear) => {
  const prevMonth = currentMonthIndex === 0 ? 11 : currentMonthIndex - 1;
  const prevYear = currentMonthIndex === 0 ? currentYear - 1 : currentYear;

  const [expenditures, matchIncomes, fees, students] = await Promise.all([
    Expenditure.find({ month: { $gte: prevMonth, $lte: currentMonthIndex }, year: prevYear }),
    MatchIncome.find({ month: { $gte: prevMonth, $lte: currentMonthIndex }, year: prevYear }),
    Fee.find({ month: { $gte: prevMonth, $lte: currentMonthIndex }, year: prevYear }),
    Student.find({ 
      dateOfJoining: { 
        $gte: new Date(prevYear, prevMonth, 1),
        $lt: new Date(currentYear, currentMonthIndex, 1)
      }
    })
  ]);

  return {
    totalIncome: matchIncomes.reduce((sum, inc) => sum + inc.amount, 0) + 
                fees.reduce((sum, fee) => sum + fee.totalAmountPaid, 0),
    totalExpenditure: expenditures.reduce((sum, exp) => sum + exp.amount, 0),
    fees: fees,
    students: students
  };
};

exports.calculateFeePerformance = (currentFees, previousFees) => {
  const currentTotal = currentFees.reduce((sum, fee) => sum + fee.totalAmountPaid, 0);
  const prevTotal = previousFees.reduce((sum, fee) => sum + fee.totalAmountPaid, 0);
  const change = prevTotal ? ((currentTotal - prevTotal) / prevTotal) * 100 : 100;

  return {
    total: currentTotal,
    percentageChange: change,
    trend: change >= 0 ? 'up' : 'down',
    paidStudents: currentFees.length,
    averageFee: currentFees.length ? currentTotal / currentFees.length : 0
  };
};

exports.analyzeExpenditures = (expenditures) => {
  const byCategory = expenditures.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const total = Object.values(byCategory).reduce((sum, amount) => sum + amount, 0);
  const categories = Object.entries(byCategory).map(([name, amount]) => ({
    name,
    amount,
    percentage: (amount / total) * 100
  })).sort((a, b) => b.amount - a.amount);

  return {
    topCategory: categories[0] || null,
    categories,
    total
  };
};

exports.calculateGrowthMetrics = (currentStudents, previousStudents) => {
  const growthRate = previousStudents.length ? 
    ((currentStudents.length - previousStudents.length) / previousStudents.length) * 100 :
    currentStudents.length ? 100 : 0;

  return {
    newStudents: currentStudents.length,
    growthRate,
    trend: growthRate >= 0 ? 'up' : 'down',
    averageAdmissionFee: currentStudents.length ? 
      currentStudents.reduce((sum, s) => sum + (s.admissionFees || 0), 0) / currentStudents.length :
      0
  };
};

exports.analyzeIncomeSources = (matchIncomes, totalFees) => {
  const totalMatchIncome = matchIncomes.reduce((sum, inc) => sum + inc.amount, 0);
  const totalIncome = totalMatchIncome + totalFees;

  return {
    feeContribution: (totalFees / totalIncome) * 100,
    matchContribution: (totalMatchIncome / totalIncome) * 100,
    topMatchSource: matchIncomes.reduce((top, inc) => 
      !top || inc.amount > top.amount ? inc : top, null)
  };
};

exports.assessFinancialHealth = (netIncome, totalExpenditure) => {
  const ratio = totalExpenditure > 0 ? netIncome / totalExpenditure : 1;
  let status;

  if (ratio > 0.5) status = 'excellent';
  else if (ratio > 0.2) status = 'good';
  else if (ratio > 0) status = 'warning';
  else status = 'critical';

  return {
    status,
    netIncome,
    expenseRatio: ratio
  };
};

exports.calculatePercentageChanges = ({currentIncome, currentExpenses, prevIncome, prevExpenses}) => {
  return {
    incomeChange: prevIncome ? ((currentIncome - prevIncome) / prevIncome) * 100 : 100,
    expenseChange: prevExpenses ? ((currentExpenses - prevExpenses) / prevExpenses) * 100 : 100,
    netChange: (prevIncome && prevExpenses) ? 
      (((currentIncome - currentExpenses) - (prevIncome - prevExpenses)) / (prevIncome - prevExpenses) * 100) :
      100
  };
};

exports.groupByCategory = (items) => {
  return items.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});
};