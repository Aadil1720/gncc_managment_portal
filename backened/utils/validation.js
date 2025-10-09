// utils/validation.js
const Joi = require('joi');
const { ValidationError } = require('./errors');

// Student Validation
const studentSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().optional(),
  image: Joi.string().uri().optional(),
  fatherName: Joi.string().required(),
  fatherOccupation: Joi.string().optional(), // ✅ Already present
  category: Joi.string().optional(),
  motherName: Joi.string().required(),
  dob: Joi.date().required(),
  // ✅ New fields
  activityStatus: Joi.string().valid('active', 'inactive').optional(),
  inactivePeriods: Joi.array().items(
    Joi.object({
      from: Joi.date().required(),
      to: Joi.date().optional(),
      reason: Joi.string().allow('').optional() // ✅ New optional field
    })
  ).optional(),
  contactNumber: Joi.string().optional(), // ✅ Optional
  parentContact: Joi.string().required(),
  address: Joi.string().required(),
  meansOfTransport: Joi.string().valid('self', 'academy').required(),
  admissionFees: Joi.number().positive().required(),
  tuitionFees: Joi.number().positive().required(), // ✅ Include if part of your model
  dateOfJoining: Joi.date().optional() // Optional since it has a default in model
});

const validateStudent = (data) => {
  const { error } = studentSchema.validate(data);
  return error ? new ValidationError(error.details[0].message) : null;
};

const validateUpdateStudent = (data) => {
  const { error } = studentSchema.validate(data, { stripUnknown: true });
  return error ? new ValidationError(error.details[0].message) : null;
};

// Fee Validation
const feeSchema = Joi.object({
  studentId: Joi.string().required(),
  month: Joi.string().required(),
  year: Joi.number().integer().required(),
  tuitionFees: Joi.number().min(0),
  transportFees: Joi.number().min(0),
  admissionFees:Joi.number().min(0),
  totalAmountPaid: Joi.number().positive(),
  remarks: Joi.string().allow('').optional(), // <-- New field added
  datePaid: Joi.date().optional(),
   notes: Joi.string().allow('').optional(),
  isPaid:Joi.boolean()
});

const validateFee = (data) => {
  const { error } = feeSchema.validate(data);
  return error ? new ValidationError(error.details[0].message) : null;
};

module.exports = {
  validateStudent,
  validateUpdateStudent,
  validateFee
};
