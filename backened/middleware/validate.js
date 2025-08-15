// controllers/validationController.js
const { ValidationError } = require('../utils/errors');
const { validateStudent, validateUpdateStudent, validateFee } = require('../utils/validation');
const Student = require('../models/student');
const Fee = require('../models/Fees');

// Middleware for creating a student
exports.validateCreateStudent = (req, res, next) => {
  const error = validateStudent(req.body);
  if (error) return next(new ValidationError(error.message));
  next();
};

// Middleware for updating a student
exports.validateUpdateStudent = (req, res, next) => {
  const error = validateUpdateStudent(req.body);
  if (error) return next(new ValidationError(error.message));
  next();
};

// Middleware for submitting a fee
exports.validateFeeSubmission = (req, res, next) => {
  const error = validateFee(req.body);
  if (error) return next(new ValidationError(error.message));
  next();
};
