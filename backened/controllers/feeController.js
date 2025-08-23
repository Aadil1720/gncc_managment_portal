
const { log } = require('console');
const Fee = require('../models/Fees');
const Student = require('../models/student');// Adjust path as needed
const { sendFeeSubmissionEmail,generatePDF,calculateAge }  = require('../utils/generalUtility'); // Move email logic to utility for reuse
const {generateAndEmailFeeSlip}=require('../utils/generateAndEmailFeeSlip');
const{isValidObjectId,getFeeStatus,isInInactivePeriod}=require('../utils/studentUtils')
const path = require('path');
const fs = require('fs').promises;


const allMonths = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];




// Utility function to get fee slip file details
const getFeeSlipFileDetails = (admissionNumber, month, year) => {
  const fileName = `FeeSlip-${admissionNumber}-${month}-${year}.pdf`;
  const filePath = path.join(__dirname, `../slips/${fileName}`);
  return { fileName, filePath };
};

// Utility function to check file existence (async version)
const checkFileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

exports.downloadFeeSlip = async (req, res) => {
  try {
    const { admissionNumber, month, year } = req.query;
    
    // Get file details
    const { fileName, filePath } = getFeeSlipFileDetails(admissionNumber, month, year); 
    const fileExists = await checkFileExists(filePath);
    if (!fileExists) {
      return res.status(404).json({ 
        error: 'Fee slip not found',
        suggestion: 'It may not have been generated yet or the parameters are incorrect'
      });
    }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename="' + fileName + '"');
  res.sendFile(filePath);

  } catch (err) {
    console.error('Download fee slip error:', err);
    res.status(500).json({ 
      error: 'Internal server error',
      details: err.message 
    });
  }
};

exports.viewFeeSlip = async (req, res) => {
  try {
    const { admissionNumber, month, year } = req.query;
    
    // Validate required parameters
    if (!admissionNumber || !month || !year) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: admissionNumber, month, year'
      });
    }

    // Get file details
    const { fileName, filePath } = getFeeSlipFileDetails(admissionNumber, month, year);
    console.log(fileName+"and"+filePath)
    
     const fileExists = await checkFileExists(filePath);
    if (!fileExists) {
      return res.status(404).json({ 
        error: 'Fee slip not found',
        suggestion: 'It may not have been generated yet or the parameters are incorrect'
      });
    }

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${fileName || 'FeeSlip.pdf'}"`);

    // Create and pipe the file stream
    const fileStream = fs.createReadStream(filePath);
    
    // Handle stream errors
    fileStream.on('error', (err) => {
      console.error('Stream error:', err);
      if (!res.headersSent) {
        res.status(500).json({ 
          success: false,
          message: 'Error streaming fee slip'
        });
      }
    });

    fileStream.pipe(res);

  } catch (error) {
    console.error('Error viewing slip:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error while viewing fee slip' 
    });
  }
};


exports.resendFeeSlipEmail = async (req, res) => {
  try {
    const { admissionNumber, month, year } = req.body;

    // Find student (with only necessary fields)
    const student = await Student.findOne({ admissionNumber })
      .select('email parentContact name')
      .lean();

    if (!student) {
      return res.status(404).json({ 
        error: 'Student not found',
        admissionNumber 
      });
    }

    // Get file details
    const { fileName, filePath } = getFeeSlipFileDetails(admissionNumber, month, year);

    // Check file existence
    const fileExists = await checkFileExists(filePath);
    if (!fileExists) {
      return res.status(404).json({ 
        error: 'Fee slip PDF not found',
        suggestion: 'Please generate the fee slip first'
      });
    }

    // Determine recipient (non-blocking email send)
    const recipient = student.email || student.parentContact;
    if (!recipient) {
      return res.status(400).json({ 
        error: 'No contact email available',
        studentName: student.name 
      });
    }

    // Send email (fire and forget)
    sendFeeSubmissionEmail(recipient, student.name, fileName)
      .then(() => console.log(`Email sent to ${recipient}`))
      .catch(err => console.error('Email send failed:', err));

    res.json({ 
      success: true,
      message: 'Fee slip resend initiated',
      recipient,
      studentName: student.name 
    });

  } catch (err) {
    console.error('Resend fee slip error:', err);
    res.status(500).json({ 
      error: 'Internal server error',
      details: err.message 
    });
  }
};

exports.createFee = async (req, res) => {
  try {
    const { studentId, admissionFees = 0, tuitionFees = 0, transportFees = 0, month, year,remarks} = req.body;


    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
  if (admissionFees === 0 && tuitionFees === 0 && transportFees === 0) {
  return res.status(400).json({ success: false, message: 'At least one fee component is required.' });
}


    const newFee = new Fee({
       isPaid:true,
      studentId,
      admissionFees,
      tuitionFees,
      transportFees,
      month,
      year,
      remarks,
      datePaid: new Date(),
    });
     
    await newFee.save(); // save first

    // // ⚙️ Fire-and-forget slip generation (non-blocking)
    // generateAndEmailFeeSlip(student, newFee)
    //   .then(({ filePath }) => {
    //     // ⏺️ Update Fee with slipPath when PDF is ready
    //     Fee.findByIdAndUpdate(newFee._id, { slipPath: filePath }, { new: true }).catch(err =>
    //       console.error('Failed to update slip path in DB:', err)
    //     );
    //   })
    //   .catch(err => {
    //     console.error('Slip generation/email failed:', err);
    //     // You can notify or log somewhere if needed
    //   });

    // ✅ Return immediately (don’t wait for slip)
    return res.status(201).json({
      success: true,
      message: 'Fee submitted successfully. Slip generation in progress.',
      fee: newFee,
    });
  } catch (error) {
    console.error('Error submitting fee:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};



// Get fee history for a student by student ID
exports.getFeeHistoryByStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId.trim();
    const fees = await Fee.find({ studentId }).sort({ year: 1, month: 1 });
    res.json(fees);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// List all fees with pagination and optional filtering by month/year
exports.getFeeSummary = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId)
      .select('dateOfJoining inactivePeriods dob');
    
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const fees = await Fee.find({ studentId: student._id });
    const { paidMonths, dueMonths, totalPaid } = getFeeStatus(
      fees, student.inactivePeriods
    );

    res.status(200).json({
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
        totalDueMonths: dueMonths.length
      }
    });
  } catch (error) {
    console.error('Error getting fee summary:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.listFees = async (req, res) => {
  try {
    const { page = 1, limit = 10, month, year, search = '' } = req.query;
    const query = {};
    
    if (month) query.month = month;
    if (year) query.year = parseInt(year);
    
    if (search) {
      const students = await Student.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { admissionNumber: { $regex: search, $options: 'i' } }
        ]
      }).select('_id').lean();
      query.studentId = { $in: students.map(s => s._id) };
    }

    const [fees, total, aggregateResult] = await Promise.all([
      Fee.find(query)
        .populate({
          path: 'studentId',
          select: 'name fatherName admissionNumber inactivePeriods dateOfJoining'
        })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))
        .sort({ year: -1, month: -1 })
        .lean(),
      Fee.countDocuments(query),
      Fee.aggregate([
        { $match: query },
        { $group: { _id: null, totalCollected: { $sum: '$totalAmountPaid' } } }
      ])
    ]);

    const formattedFees = fees.map(fee => {
      const { paidMonths, dueMonths } = getFeeStatus(
        [fee],
        fee.studentId.inactivePeriods
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

    res.json({
      success: true,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalCollected: aggregateResult[0]?.totalCollected || 0,
      fees: formattedFees
    });
  } catch (err) {
    console.error('Error listing fees:', err);
    res.status(500).json({ 
      success: false,
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};


// Shared error handler
const handleFeeError = (res, error) => {
  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'Invalid fee ID format' });
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }
  console.error('Fee operation error:', error);
  res.status(500).json({ error: 'Internal server error' });
};

exports.getFeeById = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id)
      .populate('studentId', 'name admissionNumber');
    
    if (!fee) return res.status(404).json({ error: 'Fee not found' });
    res.json(fee);
  } catch (err) {
    handleFeeError(res, err);
  }
};

exports.updateFee = async (req, res) => {
  // const session = await mongoose.startSession();
  // session.startTransaction();
  
  try {
    const fee = await Fee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { 
        new: true,
        runValidators: true,
        session
      }
    ).populate('studentId', 'name admissionNumber');
    
    if (!fee) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Fee not found' });
    }

    // Regenerate slip if amount changed
    // if (req.body.admissionFees || req.body.tuitionFees || req.body.transportFees) {
    //   generateAndEmailFeeSlip(fee.studentId, fee).catch(console.error);
    // }

    // await session.commitTransaction();
    res.json(fee);
  } catch (err) {
    await session.abortTransaction();
    handleFeeError(res, err);
  } finally {
    session.endSession();
  }
};

exports.deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndDelete(req.params.id);
    if (!fee) return res.status(404).json({ error: 'Fee record not found' });
    res.json({ message: 'Fee record deleted' });
  } catch (err) {
    handleFeeError(res, err);
  }
};




