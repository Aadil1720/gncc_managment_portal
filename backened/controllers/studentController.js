

const Student = require('../models/student');
const Fee = require('../models/Fees');
const { calculateAge,sendFeeReminderEmail } = require('../utils/generalUtility');
const{isValidObjectId,getFeeStatus,isInInactivePeriod}=require('../utils/studentUtils')

// Create Student
exports.createStudent = async (req, res) => {
  try {
    const { name, dob } = req.body;

    const existingStudent = await Student.findOne({ name, dob });
    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Student already exists with the same name and date of birth.",
        student: existingStudent
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
    res.status(500).json({ success: false, message: "Failed to create student.", error: err.message });
  }
};

// Update Student
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: "Invalid student ID" });

    const updatedStudent = await Student.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedStudent) return res.status(404).json({ success: false, message: 'Student not found' });

    res.json({ success: true, message: 'Student updated successfully', student: updatedStudent });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update student', error: err.message });
  }
};


exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid student ID' });
    }

    const deleted = await Student.findOneAndDelete({ _id: id }); // ✅ triggers pre hook
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

    const fees = await Fee.find({ studentId: id }).select('month year totalAmountPaid');
    const { paidMonths, dueMonths, totalPaid } = getFeeStatus(fees, student.inactivePeriods);
    const age = calculateAge(student.dob);

    res.json({
      success: true,
      student,
      age,
      feesSummary: { totalPaid, paidMonths, dueMonths, totalDueMonths: dueMonths.length }
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

    const fees = await Fee.find({ studentId: id }).select('month year');
    const { paidMonths } = getFeeStatus(fees, student.inactivePeriods);
    const startDate = new Date(student.dateOfJoining);
    const currentDate = new Date();

    let current = new Date(startDate);
    let totalMonths = 0;
    while (current <= currentDate) {
      if (!isInInactivePeriod(current, student.inactivePeriods)) {
        totalMonths++;
      }
      current.setMonth(current.getMonth() + 1);
    }

    const isFeeDefaulter = paidMonths.length < totalMonths;

    res.json({
      success: true,
      student: { ...student.toObject(), isFeeDefaulter }
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
      .select('studentId month year totalAmountPaid');

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
      
      // Use the getFeeStatus function for consistent calculation
      const { paidMonths, dueMonths, totalPaid } = getFeeStatus(studentFees, student.inactivePeriods || []);
      
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
          tuitionFees: student.tuitionFees || 0
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
      feeStatus = '' // Add fee status filter
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
      .select('studentId month year totalAmountPaid');

    // Organize fees by student ID
    const feesByStudent = fees.reduce((acc, fee) => {
      const key = fee.studentId.toString();
      if (!acc[key]) acc[key] = [];
      acc[key].push(fee);
      return acc;
    }, {});

    // Enrich student data with fee status using the same logic as getStudentDescription
    const enrichedStudents = students.map(student => {
      const studentFees = feesByStudent[student._id.toString()] || [];
      
      // Use the same getFeeStatus function that works correctly
      const { paidMonths, dueMonths, totalPaid } = getFeeStatus(studentFees, student.inactivePeriods || []);
      const isFeeDefaulter = dueMonths.length > 0;

      return {
        ...student.toObject(),
        isFeeDefaulter,
        totalDueMonths: dueMonths.length,
        totalPaid,
        dueMonths: dueMonths.slice(0, 3), // Show first 3 due months for preview
        totalDueMonthsCount: dueMonths.length // Full count
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



// Set Inactive Period (existing)
exports.setInactivePeriod = async (req, res) => {
  try {
    const { id } = req.params;
    const { from, to, reason } = req.body;

    // Validate inputs
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid student ID' });
    }
    if (!from) {
      return res.status(400).json({ success: false, message: 'From date is required' });
    }

    // Find student and validate
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Convert dates to comparable format
    const newFrom = new Date(from);
    const newTo = to ? new Date(to) : null;

    // Check for overlapping/duplicate periods
    const hasConflict = student.inactivePeriods.some(period => {
      const existingFrom = new Date(period.from);
      const existingTo = period.to ? new Date(period.to) : null;

      // Check if new period overlaps with existing period
      return (
        (newTo === null && existingTo === null) || // Both are open-ended
        (newTo === null && newFrom <= existingTo) || // New is open-ended and overlaps
        (existingTo === null && existingFrom <= newTo) || // Existing is open-ended and overlaps
        (newFrom <= existingTo && newTo >= existingFrom) // Standard overlap
      );
    });

    if (hasConflict) {
      return res.status(400).json({
        success: false,
        message: 'This period conflicts with an existing inactive period'
      });
    }

    // Add new inactive period
    student.inactivePeriods.push({ 
      from: newFrom, 
      to: newTo,
      reason: reason || undefined 
    });
    
    // Update status if not already inactive
    if (student.activityStatus !== 'inactive') {
      student.activityStatus = 'inactive';
    }

    await student.save();

    res.json({ 
      success: true, 
      message: 'Inactive period set successfully', 
      data: {
        inactivePeriods: student.inactivePeriods,
        status: student.activityStatus
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to set inactive period', 
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Reactivate Student (new)
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

    // Update the latest inactive period if it's open-ended
    const openPeriod = student.inactivePeriods.find(p => !p.to);
    if (openPeriod) {
      openPeriod.to = new Date();
    }

    student.activityStatus = 'active';
    await student.save();

    res.json({
      success: true,
      message: 'Student reactivated successfully',
      data: {
        status: student.status,
        inactivePeriods: student.inactivePeriods
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to reactivate student',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Get Inactive Periods (new)
exports.getInactivePeriods = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid student ID' });
    }

    const student = await Student.findById(id)
      .select('inactivePeriods status name admissionNumber');
    
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({
      success: true,
      data: {
        student: {
          name: student.name,
          admissionNumber: student.admissionNumber,
          status: student.status
        },
        inactivePeriods: student.inactivePeriods
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to get inactive periods',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Remove Inactive Period (new)
exports.removeInactivePeriod = async (req, res) => {
  try {
    const { id, periodId } = req.params;
    
    if (!isValidObjectId(id) || !isValidObjectId(periodId)) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }

    const student = await Student.findByIdAndUpdate(
      id,
      { $pull: { inactivePeriods: { _id: periodId } } },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Update status if no remaining inactive periods
    if (student.inactivePeriods.length === 0) {
      student.status = 'active';
      await student.save();
    }

    res.json({
      success: true,
      message: 'Inactive period removed successfully',
      data: {
        inactivePeriods: student.inactivePeriods,
        status: student.activityStatus
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove inactive period',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};
