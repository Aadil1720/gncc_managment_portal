const Expenditure = require('../models/Expenditure');

// Create new expenditure
exports.createExpenditure = async (req, res) => {
  try {
    const { month, year, amount, description, category } = req.body;

    const expenditure = new Expenditure({
      month,
      year,
      amount,
      description,
      category
    });

    await expenditure.save();
    res.status(201).json({
      success: true,
      message: 'Expenditure recorded successfully',
      data: expenditure
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Failed to record expenditure',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Get expenditure by ID
exports.getExpenditureById = async (req, res) => {
  try {
    const expenditure = await Expenditure.findById(req.params.id);
    if (!expenditure) {
      return res.status(404).json({
        success: false,
        message: 'Expenditure not found'
      });
    }
    res.json({
      success: true,
      data: expenditure
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Failed to get expenditure',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Update expenditure by ID
exports.updateExpenditure = async (req, res) => {
  try {
    const expenditure = await Expenditure.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!expenditure) {
      return res.status(404).json({
        success: false,
        message: 'Expenditure not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Expenditure updated successfully',
      data: expenditure
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Failed to update expenditure',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Delete expenditure by ID
exports.deleteExpenditure = async (req, res) => {
  try {
    const expenditure = await Expenditure.findByIdAndDelete(req.params.id);
    if (!expenditure) {
      return res.status(404).json({
        success: false,
        message: 'Expenditure not found'
      });
    }
    res.json({
      success: true,
      message: 'Expenditure deleted successfully'
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Failed to delete expenditure',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// List all expenditures with pagination and filtering
exports.listExpenditures = async (req, res) => {
  try {
    const { page = 1, limit = 10, month, year, category } = req.query;
    const query = {};
    
    if (month) query.month = month;
    if (year) query.year = parseInt(year);
    if (category) query.category = category;

    const [expenditures, total, aggregateResult] = await Promise.all([
      Expenditure.find(query)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ year: -1, month: -1 }),
      Expenditure.countDocuments(query),
      Expenditure.aggregate([
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
        expenditures
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: 'Failed to fetch expenditures',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}; 