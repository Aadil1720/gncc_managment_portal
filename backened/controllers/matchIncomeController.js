const MatchIncome = require('../models/MatchIncome');

// Create new match income
exports.createMatchIncome = async (req, res) => {
  try {
    const { month, year, amount, description, source } = req.body;

    const matchIncome = new MatchIncome({
      month,
      year,
      amount,
      description,
      source
    });

    await matchIncome.save();
    res.status(201).json({
      success: true,
      message: 'Match income recorded successfully',
      data: matchIncome
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Failed to record match income',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Get match income by ID
exports.getMatchIncomeById = async (req, res) => {
  try {
    const matchIncome = await MatchIncome.findById(req.params.id);
    if (!matchIncome) {
      return res.status(404).json({
        success: false,
        message: 'Match income not found'
      });
    }
    res.json({
      success: true,
      data: matchIncome
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Failed to get match income',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Update match income by ID
exports.updateMatchIncome = async (req, res) => {
  try {
    const matchIncome = await MatchIncome.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!matchIncome) {
      return res.status(404).json({
        success: false,
        message: 'Match income not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Match income updated successfully',
      data: matchIncome
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Failed to update match income',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Delete match income by ID
exports.deleteMatchIncome = async (req, res) => {
  try {
    const matchIncome = await MatchIncome.findByIdAndDelete(req.params.id);
    if (!matchIncome) {
      return res.status(404).json({
        success: false,
        message: 'Match income not found'
      });
    }
    res.json({
      success: true,
      message: 'Match income deleted successfully'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Failed to delete match income',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// List all match incomes with pagination and filtering
exports.listMatchIncomes = async (req, res) => {
  try {
    const { page = 1, limit = 10, month, year, source } = req.query;
    const query = {};
    
    if (month) query.month = month;
    if (year) query.year = parseInt(year);
    if (source) query.source = source;

    const [matchIncomes, total, aggregateResult] = await Promise.all([
      MatchIncome.find(query)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ year: -1, month: -1 }),
      MatchIncome.countDocuments(query),
      MatchIncome.aggregate([
        { $match: query },
        { $group: { _id: null, totalAmount: { $sum: '$amount' } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        meta: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalAmount: aggregateResult[0]?.totalAmount || 0
        },
        matchIncomes
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Failed to fetch match incomes',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};