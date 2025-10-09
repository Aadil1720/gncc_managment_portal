
const Student = require('../models/student');
const Fee = require('../models/Fees');
const { calculateAge, sendFeeReminderEmail } = require('../utils/generalUtility');
const { isValidObjectId, getFeeStatus, isInInactivePeriod } = require('../utils/studentUtils');

// Helper function to get fee calculation start date
const getFeeCalculationStartDate = (dateOfJoining) => {
  const defaultStartDate = new Date(2025, 7, 1); // August 1, 2025 (month is 0-based)
  const joiningDate = new Date(dateOfJoining);
  
  // If student joined after default start date, use joining date
  // If student joined before default start date, use default start date
  return joiningDate > defaultStartDate ? joiningDate : defaultStartDate;
};

// Helper function to get academic year months
const getAcademicYearMonths = (startDate, endDate, inactivePeriods = []) => {
  const months = [];
  let current = new Date(startDate);
  current.setDate(1); // Ensure we start from the first day of month
  
  const end = new Date(endDate);
  end.setDate(1);

  while (current <= end) {
    const monthSnapshot = new Date(current.getFullYear(), current.getMonth(), 1);
    
    if (!isInInactivePeriod(monthSnapshot, inactivePeriods)) {
      months.push({
        label: current.toLocaleString('default', { month: 'long', year: 'numeric' }),
        year: current.getFullYear(),
        month: current.getMonth(),
        timestamp: new Date(monthSnapshot)
      });
    }
    
    current.setMonth(current.getMonth() + 1);
  }
  
  return months;
};

// Create Student - Updated with name and fatherName uniqueness check
exports.createStudent = async (req, res) => {
  try {
    const { name, fatherName } = req.body;

    // Check if student already exists with same name and father's name
    const existingStudent = await Student.findOne({ 
      name: name.trim(), 
      fatherName: fatherName.trim() 
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Student already exists with the same name and father's name.",
        student: {
          _id: existingStudent._id,
          name: existingStudent.name,
          fatherName: existingStudent.fatherName,
          admissionNumber: existingStudent.admissionNumber
        }
      });
    }

    const newStudent = new Student(req.body);
    await newStudent.save();

    res.status(201).json({
      success: true,
      message: "Student created successfully.",
      student: newStudent
    });

  } catch (err) {
    // Handle validation errors and other issues
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false, 
        message: "Validation error", 
        error: err.message 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Failed to create student.", 
      error: err.message 
    });
  }
};

// Update Student - Also check for duplicates during update
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, fatherName } = req.body;
    
    if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: "Invalid student ID" });

    // Check for duplicate student (excluding current student)
    if (name && fatherName) {
      const existingStudent = await Student.findOne({
        name: name.trim(),
        fatherName: fatherName.trim(),
        _id: { $ne: id }
      });

      if (existingStudent) {
        return res.status(409).json({
          success: false,
          message: "Another student already exists with the same name and father's name.",
          student: {
            _id: existingStudent._id,
            name: existingStudent.name,
            fatherName: existingStudent.fatherName,
            admissionNumber: existingStudent.admissionNumber
          }
        });
      }
    }

    const updatedStudent = await Student.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedStudent) return res.status(404).json({ success: false, message: 'Student not found' });

    res.json({ success: true, message: 'Student updated successfully', student: updatedStudent });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        success: false, 
        message: "Validation error", 
        error: err.message 
      });
    }
    
    res.status(500).json({ success: false, message: 'Failed to update student', error: err.message });
  }
};

// Rest of the controller functions remain the same...
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid student ID' });
    }

    const deleted = await Student.findOneAndDelete({ _id: id });
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, message: 'Student and associated fees deleted successfully' });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete student',
      error: err.message
    });
  }
};

// Get Student Description
exports.getStudentDescription = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'Invalid student ID' });

    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const fees = await Fee.find({ studentId: id }).select('month year totalAmountPaid paymentDate');
    
    // Calculate fee status with dynamic start date
    const feeStartDate = getFeeCalculationStartDate(student.dateOfJoining);
    const { paidMonths, dueMonths, totalPaid } = getFeeStatus(fees, student.inactivePeriods, feeStartDate);
    
    const age = calculateAge(student.dob);

    res.json({
      success: true,
      student,
      age,
      feesSummary: { 
        totalPaid, 
        paidMonths, 
        dueMonths, 
        totalDueMonths: dueMonths.length,
        feeCalculationStart: feeStartDate
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get student description', error: err.message });
  }
};

// Get Student By ID
exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'Invalid student ID' });

    const student = await Student.findById(id).select('name dob admissionNumber category status dateOfJoining inactivePeriods');
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const fees = await Fee.find({ studentId: id }).select('month year paymentDate');
    
    // Calculate fee status with dynamic start date
    const feeStartDate = getFeeCalculationStartDate(student.dateOfJoining);
    const { paidMonths } = getFeeStatus(fees, student.inactivePeriods, feeStartDate);
    
    const currentDate = new Date();
    
    // Get all expected months considering inactive periods
    const expectedMonths = getAcademicYearMonths(feeStartDate, currentDate, student.inactivePeriods);
    const totalExpectedMonths = expectedMonths.length;

    const isFeeDefaulter = paidMonths.length < totalExpectedMonths;

    res.json({
      success: true,
      student: { 
        ...student.toObject(), 
        isFeeDefaulter,
        totalExpectedMonths,
        paidMonthsCount: paidMonths.length
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get student', error: err.message });
  }
};

// Filter by Fee Defaulter
exports.filterByFeeDefaulter = async (req, res) => {
  try {
    const defaulterParam = req.params.defaulter;
    const { page = 1, limit = 10, search = '', sortBy = 'name', order = 'asc', notify = 'false' } = req.query;

    if (defaulterParam !== 'true' && defaulterParam !== 'false') {
      return res.status(400).json({ success: false, message: 'Invalid defaulter parameter' });
    }

    // Build search filter
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { admissionNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Fetch students with basic info
    const students = await Student.find(query)
      .select('name admissionNumber dateOfJoining email category status inactivePeriods dob dateOfJoining tuitionFees')
      .sort({ createdAt: -1 });

    const studentIds = students.map(s => s._id);

    // Fetch all relevant fees in one query
    const fees = await Fee.find({ studentId: { $in: studentIds } })
      .select('studentId month year totalAmountPaid paymentDate');

    // Organize fees by student ID
    const feesByStudent = fees.reduce((acc, fee) => {
      const key = fee.studentId.toString();
      if (!acc[key]) acc[key] = [];
      acc[key].push(fee);
      return acc;
    }, {});

    const result = [];

    for (const student of students) {
      const studentFees = feesByStudent[student._id.toString()] || [];
      
      // Calculate fee status with dynamic start date
      const feeStartDate = getFeeCalculationStartDate(student.dateOfJoining);
      const { paidMonths, dueMonths, totalPaid } = getFeeStatus(studentFees, student.inactivePeriods, feeStartDate);
      
      const isDefaulter = dueMonths.length > 0;

      if ((defaulterParam === 'true' && isDefaulter) || (defaulterParam === 'false' && !isDefaulter)) {
        let emailNotified = false;
        if (notify === 'true' && student.email) {
          try {
            await sendFeeReminderEmail(student.email, student.name, dueMonths, student.tuitionFees || 0);
            emailNotified = true;
          } catch (e) {
            console.error(`Email failed for ${student.email}:`, e.message);
          }
        }

        result.push({
          _id: student._id,
          name: student.name,
          admissionNumber: student.admissionNumber,
          isFeeDefaulter: isDefaulter,
          category: student.category,
          status: student.status,
          totalPaid,
          paidMonths,
          dueMonths,
          totalDueMonths: dueMonths.length,
          emailNotified,
          tuitionFees: student.tuitionFees || 0,
          feeCalculationStart: feeStartDate
        });
      }
    }

    const sorted = result.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (typeof aValue === 'string') {
        return order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      } else {
        return order === 'asc' ? aValue - bValue : bValue - aValue;
      }
    });

    const startIndex = (page - 1) * limit;
    const paginated = sorted.slice(startIndex, startIndex + parseInt(limit));

    res.json({
      success: true,
      count: paginated.length,
      total: result.length,
      page: parseInt(page),
      limit: parseInt(limit),
      students: paginated
    });
  } catch (err) {
    console.error('Error filtering by fee defaulter:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error filtering students',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Get All Students with defaulter status and due months count
exports.getAllStudents = async (req, res) => {
  try {
    // Get query params
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'name',
      order = 'asc',
      activityStatus = '',
      feeStatus = ''
    } = req.query;

    // Build search filter
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { admissionNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Add activityStatus filter if provided
    if (activityStatus) {
      query.activityStatus = activityStatus;
    }

    // Fetch students with basic info
    const students = await Student.find(query)
      .select('name admissionNumber contactNumber email fatherName motherName dateOfJoining activityStatus dob parentContact address inactivePeriods')
      .sort({ createdAt: -1 });

    const studentIds = students.map(s => s._id);

    // Fetch all relevant fees in one query
    const fees = await Fee.find({ studentId: { $in: studentIds } })
      .select('studentId month year totalAmountPaid paymentDate');

    // Organize fees by student ID
    const feesByStudent = fees.reduce((acc, fee) => {
      const key = fee.studentId.toString();
      if (!acc[key]) acc[key] = [];
      acc[key].push(fee);
      return acc;
    }, {});

    // Enrich student data with fee status
    const enrichedStudents = students.map(student => {
      const studentFees = feesByStudent[student._id.toString()] || [];
      
      // Calculate fee status with dynamic start date
      const feeStartDate = getFeeCalculationStartDate(student.dateOfJoining);
      const { paidMonths, dueMonths, totalPaid } = getFeeStatus(studentFees, student.inactivePeriods, feeStartDate);
      
      const isFeeDefaulter = dueMonths.length > 0;

      return {
        ...student.toObject(),
        isFeeDefaulter,
        totalDueMonths: dueMonths.length,
        totalPaid,
        dueMonths: dueMonths.slice(0, 3),
        totalDueMonthsCount: dueMonths.length,
        feeCalculationStart: feeStartDate
      };
    });

    // Apply fee status filter if provided
    let filteredStudents = enrichedStudents;
    if (feeStatus === 'defaulter') {
      filteredStudents = enrichedStudents.filter(s => s.isFeeDefaulter);
    } else if (feeStatus === 'paid') {
      filteredStudents = enrichedStudents.filter(s => !s.isFeeDefaulter);
    }

    // Apply sorting
    const sortedStudents = filteredStudents.sort((a, b) => {
      const fieldA = a[sortBy];
      const fieldB = b[sortBy];

      if (typeof fieldA === 'string') {
        return order === 'asc'
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }

      return order === 'asc' ? fieldA - fieldB : fieldB - fieldA;
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const paginatedStudents = sortedStudents.slice(startIndex, startIndex + parseInt(limit));

    res.json({
      success: true,
      message: 'Students fetched successfully',
      data: paginatedStudents,
      total: filteredStudents.length,
      page: parseInt(page),
      limit: parseInt(limit),
      totalStudents: students.length
    });

  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching students',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};



// 1. Set Inactive Period (POST /api/students/:id/set-inactive)
exports.setInactivePeriod = async (req, res) => {
  try {
    const { id } = req.params;
    const { from, to, reason } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid student ID' });
    }
    if (!from) {
      return res.status(400).json({ success: false, message: 'From date is required' });
    }

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const newFrom = new Date(from);
    const newTo = to ? new Date(to) : null;

    // Check for overlapping periods
    const hasConflict = student.inactivePeriods.some(period => {
      const existingFrom = new Date(period.from);
      const existingTo = period.to ? new Date(period.to) : null;

      return (
        (newTo === null && existingTo === null) ||
        (newTo === null && newFrom <= existingTo) ||
        (existingTo === null && existingFrom <= newTo) ||
        (newFrom <= existingTo && newTo >= existingFrom)
      );
    });

    if (hasConflict) {
      return res.status(400).json({
        success: false,
        message: 'This period conflicts with an existing inactive period'
      });
    }

    const updatedInactivePeriods = [
      ...student.inactivePeriods,
      { from: newFrom, to: newTo, reason: reason || '' }
    ];

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      {
        $set: {
          inactivePeriods: updatedInactivePeriods,
          activityStatus: 'inactive'
        }
      },
      { new: true, runValidators: false }
    );

    res.json({ 
      success: true, 
      message: 'Inactive period set successfully', 
      data: {
        inactivePeriods: updatedStudent.inactivePeriods,
        status: updatedStudent.activityStatus
      }
    });
  } catch (err) {
    console.error('Set inactive error:', err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to set inactive period', 
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// 2. Reactivate Student (PUT /api/students/:id/reactivate)
exports.reactivateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid student ID' });
    }

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Close any open-ended inactive periods
    const openPeriod = student.inactivePeriods.find(p => !p.to);
    if (openPeriod) {
      openPeriod.to = new Date();
    }

    await Student.findByIdAndUpdate(
      id,
      {
        $set: {
          activityStatus: 'active',
          inactivePeriods: student.inactivePeriods
        }
      },
      { new: true, runValidators: false }
    );

    res.json({
      success: true,
      message: 'Student reactivated successfully',
      data: {
        status: 'active',
        inactivePeriods: student.inactivePeriods
      }
    });
  } catch (err) {
    console.error('Reactivate error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to reactivate student',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// 3. Get Inactive Periods (GET /api/students/:id/inactive-periods)
exports.getInactivePeriods = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid student ID' });
    }

    const student = await Student.findById(id)
      .select('inactivePeriods activityStatus name admissionNumber');
    
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({
      success: true,
      data: {
        student: {
          name: student.name,
          admissionNumber: student.admissionNumber,
          status: student.activityStatus
        },
        inactivePeriods: student.inactivePeriods
      }
    });
  } catch (err) {
    console.error('Get inactive periods error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get inactive periods',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// 4. Remove Inactive Period (DELETE /api/students/:id/inactive-periods/:periodId)
exports.removeInactivePeriod = async (req, res) => {
  try {
    const { id, periodId } = req.params;
    
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid student ID' });
    }

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { $pull: { inactivePeriods: { _id: periodId } } },
      { new: true }
    );

    let needsStatusUpdate = false;
    if (updatedStudent.inactivePeriods.length === 0 && updatedStudent.activityStatus === 'inactive') {
      needsStatusUpdate = true;
      await Student.findByIdAndUpdate(
        id,
        { $set: { activityStatus: 'active' } },
        { new: true }
      );
    }

    const finalStudent = needsStatusUpdate 
      ? await Student.findById(id) 
      : updatedStudent;

    res.json({
      success: true,
      message: 'Inactive period removed successfully',
      data: {
        inactivePeriods: finalStudent.inactivePeriods,
        status: finalStudent.activityStatus
      }
    });
  } catch (err) {
    console.error('Remove inactive period error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to remove inactive period',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// 5. Update Inactive Period (PUT /api/students/:id/inactive-periods/:periodId)
exports.updateInactivePeriod = async (req, res) => {
  try {
    const { id, periodId } = req.params;
    const { from, to, reason } = req.body;
    
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid student ID' });
    }

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const period = student.inactivePeriods.id(periodId);
    if (!period) {
      return res.status(404).json({ success: false, message: 'Inactive period not found' });
    }

    if (from) period.from = new Date(from);
    if (to !== undefined) period.to = to ? new Date(to) : null;
    if (reason !== undefined) period.reason = reason;

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { $set: { inactivePeriods: student.inactivePeriods } },
      { new: true, runValidators: false }
    );

    res.json({
      success: true,
      message: 'Inactive period updated successfully',
      data: {
        inactivePeriods: updatedStudent.inactivePeriods
      }
    });
  } catch (err) {
    console.error('Update inactive period error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update inactive period',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// 6. Update Inactive Period Reason Only (PUT /api/students/:id/inactive-periods/:periodId/reason)
exports.updateInactivePeriodReason = async (req, res) => {
  try {
    const { id, periodId } = req.params;
    const { reason } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid student ID' });
    }

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const period = student.inactivePeriods.id(periodId);
    if (!period) {
      return res.status(404).json({ success: false, message: 'Inactive period not found' });
    }

    period.reason = reason || '';

    await Student.findByIdAndUpdate(
      id,
      { $set: { inactivePeriods: student.inactivePeriods } },
      { new: true, runValidators: false }
    );

    res.json({ 
      success: true, 
      message: 'Reason updated successfully'
    });
  } catch (err) {
    console.error('Update reason error:', err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update reason', 
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
