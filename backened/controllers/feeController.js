
// const { log } = require('console');
// const Fee = require('../models/Fees');
// const Student = require('../models/student');// Adjust path as needed
// const { sendFeeSubmissionEmail,generatePDF,calculateAge }  = require('../utils/generalUtility'); // Move email logic to utility for reuse
// const {generateAndEmailFeeSlip}=require('../utils/generateAndEmailFeeSlip');
// const{isValidObjectId,getFeeStatus,isInInactivePeriod}=require('../utils/studentUtils')
// const path = require('path');
// const fs = require('fs').promises;


// const allMonths = [
//   'January', 'February', 'March', 'April', 'May', 'June',
//   'July', 'August', 'September', 'October', 'November', 'December'
// ];




// // Utility function to get fee slip file details
// const getFeeSlipFileDetails = (admissionNumber, month, year) => {
//   const fileName = `FeeSlip-${admissionNumber}-${month}-${year}.pdf`;
//   const filePath = path.join(__dirname, `../slips/${fileName}`);
//   return { fileName, filePath };
// };

// // Utility function to check file existence (async version)
// const checkFileExists = async (filePath) => {
//   try {
//     await fs.access(filePath);
//     return true;
//   } catch {
//     return false;
//   }
// };

// exports.downloadFeeSlip = async (req, res) => {
//   try {
//     const { admissionNumber, month, year } = req.query;
    
//     // Get file details
//     const { fileName, filePath } = getFeeSlipFileDetails(admissionNumber, month, year); 
//     const fileExists = await checkFileExists(filePath);
//     if (!fileExists) {
//       return res.status(404).json({ 
//         error: 'Fee slip not found',
//         suggestion: 'It may not have been generated yet or the parameters are incorrect'
//       });
//     }

//   res.setHeader('Content-Type', 'application/pdf');
//   res.setHeader('Content-Disposition', 'inline; filename="' + fileName + '"');
//   res.sendFile(filePath);

//   } catch (err) {
//     console.error('Download fee slip error:', err);
//     res.status(500).json({ 
//       error: 'Internal server error',
//       details: err.message 
//     });
//   }
// };

// exports.viewFeeSlip = async (req, res) => {
//   try {
//     const { admissionNumber, month, year } = req.query;
    
//     // Validate required parameters
//     if (!admissionNumber || !month || !year) {
//       return res.status(400).json({
//         success: false,
//         message: 'Missing required parameters: admissionNumber, month, year'
//       });
//     }

//     // Get file details
//     const { fileName, filePath } = getFeeSlipFileDetails(admissionNumber, month, year);
//     console.log(fileName+"and"+filePath)
    
//      const fileExists = await checkFileExists(filePath);
//     if (!fileExists) {
//       return res.status(404).json({ 
//         error: 'Fee slip not found',
//         suggestion: 'It may not have been generated yet or the parameters are incorrect'
//       });
//     }

//     // Set response headers
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `inline; filename="${fileName || 'FeeSlip.pdf'}"`);

//     // Create and pipe the file stream
//     const fileStream = fs.createReadStream(filePath);
    
//     // Handle stream errors
//     fileStream.on('error', (err) => {
//       console.error('Stream error:', err);
//       if (!res.headersSent) {
//         res.status(500).json({ 
//           success: false,
//           message: 'Error streaming fee slip'
//         });
//       }
//     });

//     fileStream.pipe(res);

//   } catch (error) {
//     console.error('Error viewing slip:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Internal server error while viewing fee slip' 
//     });
//   }
// };


// exports.resendFeeSlipEmail = async (req, res) => {
//   try {
//     const { admissionNumber, month, year } = req.body;

//     // Find student (with only necessary fields)
//     const student = await Student.findOne({ admissionNumber })
//       .select('email parentContact name')
//       .lean();

//     if (!student) {
//       return res.status(404).json({ 
//         error: 'Student not found',
//         admissionNumber 
//       });
//     }

//     // Get file details
//     const { fileName, filePath } = getFeeSlipFileDetails(admissionNumber, month, year);

//     // Check file existence
//     const fileExists = await checkFileExists(filePath);
//     if (!fileExists) {
//       return res.status(404).json({ 
//         error: 'Fee slip PDF not found',
//         suggestion: 'Please generate the fee slip first'
//       });
//     }

//     // Determine recipient (non-blocking email send)
//     const recipient = student.email || student.parentContact;
//     if (!recipient) {
//       return res.status(400).json({ 
//         error: 'No contact email available',
//         studentName: student.name 
//       });
//     }

//     // Send email (fire and forget)
//     sendFeeSubmissionEmail(recipient, student.name, fileName)
//       .then(() => console.log(`Email sent to ${recipient}`))
//       .catch(err => console.error('Email send failed:', err));

//     res.json({ 
//       success: true,
//       message: 'Fee slip resend initiated',
//       recipient,
//       studentName: student.name 
//     });

//   } catch (err) {
//     console.error('Resend fee slip error:', err);
//     res.status(500).json({ 
//       error: 'Internal server error',
//       details: err.message 
//     });
//   }
// };

// exports.createFee = async (req, res) => {
//   try {
//     const { studentId, admissionFees = 0, tuitionFees = 0, transportFees = 0, month, year,remarks} = req.body;


//     const student = await Student.findById(studentId);
//     if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
//   if (admissionFees === 0 && tuitionFees === 0 && transportFees === 0) {
//   return res.status(400).json({ success: false, message: 'At least one fee component is required.' });
// }


//     const newFee = new Fee({
//        isPaid:true,
//       studentId,
//       admissionFees,
//       tuitionFees,
//       transportFees,
//       month,
//       year,
//       remarks,
//       datePaid: new Date(),
//     });
     
//     await newFee.save(); // save first

//     // // ⚙️ Fire-and-forget slip generation (non-blocking)
//     generateAndEmailFeeSlip(student, newFee)
//       .then(({ filePath }) => {
//         // ⏺️ Update Fee with slipPath when PDF is ready
//         Fee.findByIdAndUpdate(newFee._id, { slipPath: filePath }, { new: true }).catch(err =>
//           console.error('Failed to update slip path in DB:', err)
//         );
//       })
//       .catch(err => {
//         console.error('Slip generation/email failed:', err);
//         // You can notify or log somewhere if needed
//       });

//     // ✅ Return immediately (don’t wait for slip)
//     return res.status(201).json({
//       success: true,
//       message: 'Fee submitted successfully. Slip generation in progress.',
//       fee: newFee,
//     });
//   } catch (error) {
//     console.error('Error submitting fee:', error);
//     res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// };



// // Get fee history for a student by student ID
// exports.getFeeHistoryByStudent = async (req, res) => {
//   try {
//     const studentId = req.params.studentId.trim();
//     const fees = await Fee.find({ studentId }).sort({ year: 1, month: 1 });
//     res.json(fees);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };


// // List all fees with pagination and optional filtering by month/year
// exports.getFeeSummary = async (req, res) => {
//   try {
//     const student = await Student.findById(req.params.studentId)
//       .select('dateOfJoining inactivePeriods dob');
    
//     if (!student) {
//       return res.status(404).json({ success: false, message: 'Student not found' });
//     }

//     const fees = await Fee.find({ studentId: student._id });
//     const { paidMonths, dueMonths, totalPaid } = getFeeStatus(
//       fees, student.inactivePeriods
//     );

//     res.status(200).json({
//       success: true,
//       student: {
//         name: student.name,
//         admissionNumber: student.admissionNumber
//       },
//       age: calculateAge(student.dob),
//       feesSummary: {
//         totalPaid,
//         paidMonths,
//         dueMonths,
//         totalDueMonths: dueMonths.length
//       }
//     });
//   } catch (error) {
//     console.error('Error getting fee summary:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Internal server error',
//       error: process.env.NODE_ENV === 'development' ? error.message : undefined
//     });
//   }
// };

// exports.listFees = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, month, year, search = '' } = req.query;
//     const query = {};
    
//     if (month) query.month = month;
//     if (year) query.year = parseInt(year);
    
//     if (search) {
//       const students = await Student.find({
//         $or: [
//           { name: { $regex: search, $options: 'i' } },
//           { admissionNumber: { $regex: search, $options: 'i' } }
//         ]
//       }).select('_id').lean();
//       query.studentId = { $in: students.map(s => s._id) };
//     }

//     const [fees, total, aggregateResult] = await Promise.all([
//       Fee.find(query)
//         .populate({
//           path: 'studentId',
//           select: 'name fatherName admissionNumber inactivePeriods dateOfJoining'
//         })
//         .skip((page - 1) * limit)
//         .limit(parseInt(limit))
//         .sort({ year: -1, month: -1 })
//         .lean(),
//       Fee.countDocuments(query),
//       Fee.aggregate([
//         { $match: query },
//         { $group: { _id: null, totalCollected: { $sum: '$totalAmountPaid' } } }
//       ])
//     ]);

//     const formattedFees = fees.map(fee => {
//       const { paidMonths, dueMonths } = getFeeStatus(
//         [fee],
//         fee.studentId.inactivePeriods
//       );

//       return {
//         ...fee,
//         studentName: fee.studentId?.name,
//         fatherName: fee.studentId?.fatherName,
//         admissionNumber: fee.studentId?.admissionNumber,
//         paidMonths,
//         dueMonths,
//       };
//     });

//     res.json({
//       success: true,
//       total,
//       page: parseInt(page),
//       limit: parseInt(limit),
//       totalCollected: aggregateResult[0]?.totalCollected || 0,
//       fees: formattedFees
//     });
//   } catch (err) {
//     console.error('Error listing fees:', err);
//     res.status(500).json({ 
//       success: false,
//       error: err.message,
//       stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
//     });
//   }
// };


// // Shared error handler
// const handleFeeError = (res, error) => {
//   if (error.name === 'CastError') {
//     return res.status(400).json({ error: 'Invalid fee ID format' });
//   }
//   if (error.name === 'ValidationError') {
//     return res.status(400).json({ error: error.message });
//   }
//   console.error('Fee operation error:', error);
//   res.status(500).json({ error: 'Internal server error' });
// };

// exports.getFeeById = async (req, res) => {
//   try {
//     const fee = await Fee.findById(req.params.id)
//       .populate('studentId', 'name admissionNumber');
    
//     if (!fee) return res.status(404).json({ error: 'Fee not found' });
//     res.json(fee);
//   } catch (err) {
//     handleFeeError(res, err);
//   }
// };

// exports.updateFee = async (req, res) => {
//   // const session = await mongoose.startSession();
//   // session.startTransaction();
  
//   try {
//     const fee = await Fee.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { 
//         new: true,
//         runValidators: true,
//         session
//       }
//     ).populate('studentId', 'name admissionNumber');
    
//     if (!fee) {
//       await session.abortTransaction();
//       return res.status(404).json({ error: 'Fee not found' });
//     }

//     // Regenerate slip if amount changed
//     // if (req.body.admissionFees || req.body.tuitionFees || req.body.transportFees) {
//     //   generateAndEmailFeeSlip(fee.studentId, fee).catch(console.error);
//     // }

//     // await session.commitTransaction();
//     res.json(fee);
//   } catch (err) {
//     await session.abortTransaction();
//     handleFeeError(res, err);
//   } finally {
//     session.endSession();
//   }
// };

// exports.deleteFee = async (req, res) => {
//   try {
//     const fee = await Fee.findByIdAndDelete(req.params.id);
//     if (!fee) return res.status(404).json({ error: 'Fee record not found' });
//     res.json({ message: 'Fee record deleted' });
//   } catch (err) {
//     handleFeeError(res, err);
//   }
// };

const Fee = require('../models/Fees');
const Student = require('../models/student');
const { sendFeeSubmissionEmail, calculateAge } = require('../utils/generalUtility');
const { isValidObjectId, getFeeStatus, isInInactivePeriod } = require('../utils/studentUtils');

// Cache for frequently accessed data
const studentCache = new Map();
const feeCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Clear cache periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of feeCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      feeCache.delete(key);
    }
  }
  for (const [key, value] of studentCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      studentCache.delete(key);
    }
  }
}, CACHE_TTL);

// Utility functions
const getCachedStudent = async (query, selectFields = '') => {
  const cacheKey = JSON.stringify({ query, selectFields });
  const cached = studentCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const student = await Student.findOne(query).select(selectFields).lean();
  if (student) {
    studentCache.set(cacheKey, { data: student, timestamp: Date.now() });
  }
  return student;
};

const invalidateStudentCache = (studentId) => {
  for (const [key, value] of studentCache.entries()) {
    if (value.data._id?.toString() === studentId?.toString()) {
      studentCache.delete(key);
    }
  }
};

const invalidateFeeCache = (studentId) => {
  for (const [key] of feeCache.entries()) {
    if (key.includes(studentId)) {
      feeCache.delete(key);
    }
  }
};

// Enhanced error handling
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

const handleError = (error, res) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message
    });
  }

  console.error('Controller Error:', error);

  if (error.name === 'CastError') {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid ID format' 
    });
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: error.message })
  });
};

// Middleware for async error handling
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Create fee - simplified without slip generation
exports.createFee = asyncHandler(async (req, res) => {
  const { studentId, admissionFees = 0, tuitionFees = 0, transportFees = 0, month, year, remarks } = req.body;

  // Validate fee amounts
  if (admissionFees === 0 && tuitionFees === 0 && transportFees === 0) {
    throw new AppError('At least one fee component is required', 400);
  }

  // Check for duplicate fee entry for same month/year
  const existingFee = await Fee.findOne({ studentId, month, year });
  if (existingFee) {
    throw new AppError(`Fee for ${month} ${year} already exists`, 409);
  }

  const student = await getCachedStudent({ _id: studentId });
  if (!student) {
    throw new AppError('Student not found', 404);
  }

  const totalAmountPaid = admissionFees + tuitionFees + transportFees;
  const paymentStatus = totalAmountPaid > 0 ? (isPaid !== undefined ? isPaid : true) : false;


  const newFee = new Fee({
   isPaid:paymentStatus,
    studentId,
    admissionFees,
    tuitionFees,
    transportFees,
    totalAmountPaid,
    month,
    year,
    remarks,
    datePaid: new Date(),
  });

  await newFee.save();

  // Invalidate caches
  invalidateStudentCache(studentId);
  invalidateFeeCache(studentId);

  res.status(201).json({
    success: true,
    message: 'Fee submitted successfully.',
    fee: {
      _id: newFee._id,
      studentId: newFee.studentId,
      month: newFee.month,
      year: newFee.year,
      totalAmountPaid: newFee.totalAmountPaid,
      datePaid: newFee.datePaid,
      remarks: newFee.remarks
    }
  });
});

// Get fee by ID
exports.getFeeById = asyncHandler(async (req, res) => {
  const feeId = req.params.id;
  const cacheKey = `fee_${feeId}`;

  const cached = feeCache.get(cacheKey);
  if (cached) {
    return res.json(cached.data);
  }

  const fee = await Fee.findById(feeId)
    .populate('studentId', 'name admissionNumber email contactNumber fatherName contactNumber')
    .select('-__v')
    .lean();

  if (!fee) {
    throw new AppError('Fee not found', 404);
  }

  feeCache.set(cacheKey, { data: fee, timestamp: Date.now() });
  res.json(fee);
});

// List fees
exports.listFees = asyncHandler(async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    month, 
    year, 
    search = '',
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const skip = (page - 1) * limit;
  const cacheKey = `list_${page}_${limit}_${month}_${year}_${search}_${sortBy}_${sortOrder}`;

  const cached = feeCache.get(cacheKey);
  if (cached) {
    return res.json(cached.data);
  }

  // Build query
  const query = {};
  if (month) query.month = month;
  if (year) query.year = parseInt(year);

  if (search) {
    const students = await Student.find({
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { admissionNumber: { $regex: search, $options: 'i' } },
        { fatherName: { $regex: search, $options: 'i' } }
      ]
    }).select('_id').lean();

    if (students.length === 0) {
      return res.json({
        success: true,
        total: 0,
        page: parseInt(page),
        limit: parseInt(limit),
        totalCollected: 0,
        fees: []
      });
    }

    query.studentId = { $in: students.map(s => s._id) };
  }

  // Execute parallel queries
  const [fees, total, aggregateResult] = await Promise.all([
    Fee.find(query)
      .populate({
        path: 'studentId',
        select: 'name fatherName admissionNumber inactivePeriods dateOfJoining contactNumber',
        options: { lean: true }
      })
      .select('admissionFees tuitionFees transportFees totalAmountPaid month year datePaid remarks')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .lean(),
    Fee.countDocuments(query),
    Fee.aggregate([
      { $match: query },
      { 
        $group: { 
          _id: null, 
          totalCollected: { $sum: '$totalAmountPaid' },
          averageFee: { $avg: '$totalAmountPaid' }
        } 
      }
    ])
  ]);

  // Process fees
  const formattedFees = fees.map((fee) => {
    const { paidMonths, dueMonths } = getFeeStatus(
      [fee],
      fee.studentId?.inactivePeriods || []
    );

    return {
      ...fee,
      studentName: fee.studentId?.name,
      fatherName: fee.studentId?.fatherName,
      admissionNumber: fee.studentId?.admissionNumber,
      paidMonths,
      dueMonths,
    };
  });

  const response = {
    success: true,
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalCollected: aggregateResult[0]?.totalCollected || 0,
    averageFee: aggregateResult[0]?.averageFee || 0,
    fees: formattedFees
  };

  feeCache.set(cacheKey, { data: response, timestamp: Date.now() });
  res.json(response);
});

// Update fee
exports.updateFee = asyncHandler(async (req, res) => {
  const feeId = req.params.id;
  const updateData = req.body;

  const fee = await Fee.findById(feeId).populate('studentId');
  if (!fee) {
    throw new AppError('Fee not found', 404);
  }

  // Calculate total if fee components are updated
  if (updateData.admissionFees !== undefined || 
      updateData.tuitionFees !== undefined || 
      updateData.transportFees !== undefined) {
    
    const admissionFees = updateData.admissionFees ?? fee.admissionFees;
    const tuitionFees = updateData.tuitionFees ?? fee.tuitionFees;
    const transportFees = updateData.transportFees ?? fee.transportFees;
    
    updateData.totalAmountPaid = admissionFees + tuitionFees + transportFees;
  }

  const updatedFee = await Fee.findByIdAndUpdate(
    feeId,
    updateData,
    { 
      new: true,
      runValidators: true 
    }
  ).populate('studentId', 'name admissionNumber');

  // Invalidate caches
  invalidateFeeCache(updatedFee.studentId._id);
  feeCache.delete(`fee_${feeId}`);

  res.json(updatedFee);
});

// Bulk operations
exports.createBulkFees = asyncHandler(async (req, res) => {
  const { fees } = req.body;

  if (!Array.isArray(fees) || fees.length === 0) {
    throw new AppError('Fees array is required', 400);
  }

  if (fees.length > 50) {
    throw new AppError('Cannot process more than 50 fees at once', 400);
  }

  const results = {
    successful: [],
    failed: []
  };

  // Process in smaller batches for better performance
  for (let i = 0; i < fees.length; i += 10) {
    const batch = fees.slice(i, i + 10);
    
    const batchPromises = batch.map(async (feeData) => {
      try {
        // Validate fee data
        if ((feeData.admissionFees || 0) + (feeData.tuitionFees || 0) + (feeData.transportFees || 0) === 0) {
          throw new AppError('At least one fee component is required', 400);
        }

        const student = await getCachedStudent({ _id: feeData.studentId });
        if (!student) {
          throw new AppError('Student not found', 404);
        }

        // Check for duplicate
        const existingFee = await Fee.findOne({
          studentId: feeData.studentId,
          month: feeData.month,
          year: feeData.year
        });

        if (existingFee) {
          throw new AppError(`Fee for ${feeData.month} ${feeData.year} already exists`, 409);
        }

        const totalAmountPaid = (feeData.admissionFees || 0) + 
                               (feeData.tuitionFees || 0) + 
                               (feeData.transportFees || 0);

        const newFee = new Fee({
          ...feeData,
          totalAmountPaid,
          isPaid: true,
          datePaid: new Date(),
        });

        await newFee.save();
        invalidateFeeCache(feeData.studentId);

        return { success: true, fee: newFee };
      } catch (error) {
        return { 
          success: false, 
          error: error.message,
          data: feeData 
        };
      }
    });

    const batchResults = await Promise.all(batchPromises);
    batchResults.forEach(result => {
      if (result.success) {
        results.successful.push(result);
      } else {
        results.failed.push(result);
      }
    });
  }

  res.json({
    success: true,
    message: `Processed ${fees.length} fees`,
    results: {
      successful: results.successful.length,
      failed: results.failed.length,
      details: {
        successful: results.successful.map(r => ({
          feeId: r.fee._id,
          studentId: r.fee.studentId,
          month: r.fee.month,
          year: r.fee.year
        })),
        failed: results.failed
      }
    }
  });
});

// Get fee history by student
exports.getFeeHistoryByStudent = asyncHandler(async (req, res) => {
  const studentId = req.params.studentId.trim();
  const cacheKey = `history_${studentId}`;
  
  const cached = feeCache.get(cacheKey);
  if (cached) {
    return res.json(cached.data);
  }

  const fees = await Fee.find({ studentId })
    .select('-__v')
    .sort({ year: 1, month: 1 })
    .lean();

  feeCache.set(cacheKey, { data: fees, timestamp: Date.now() });
  res.json(fees);
});

// Get fee summary
exports.getFeeSummary = asyncHandler(async (req, res) => {
  const studentId = req.params.studentId;
  const cacheKey = `summary_${studentId}`;

  const cached = feeCache.get(cacheKey);
  if (cached) {
    return res.json(cached.data);
  }

  const student = await Student.findById(studentId)
    .select('dateOfJoining inactivePeriods dob name admissionNumber')
    .lean();

  if (!student) {
    throw new AppError('Student not found', 404);
  }

  const fees = await Fee.find({ studentId }).lean();
  const { paidMonths, dueMonths, totalPaid } = getFeeStatus(fees, student.inactivePeriods, student.dateOfJoining);

  const response = {
    success: true,
    student: {
      name: student.name,
      admissionNumber: student.admissionNumber
    },
    age: calculateAge(student.dob),
    feesSummary: {
      totalPaid,
      paidMonths,
      dueMonths,
      totalDueMonths: dueMonths.length,
      totalFees: fees.length
    }
  };

  feeCache.set(cacheKey, { data: response, timestamp: Date.now() });
  res.json(response);
});

// Delete fee
exports.deleteFee = asyncHandler(async (req, res) => {
  const feeId = req.params.id;

  const fee = await Fee.findById(feeId);
  if (!fee) {
    throw new AppError('Fee record not found', 404);
  }

  await Fee.findByIdAndDelete(feeId);

  // Invalidate caches
  invalidateFeeCache(fee.studentId);
  feeCache.delete(`fee_${feeId}`);

  res.json({ 
    success: true,
    message: 'Fee record deleted successfully' 
  });
});

// Error handling middleware
exports.errorHandler = (err, req, res, next) => {
  handleError(err, res);
};

module.exports = exports;
