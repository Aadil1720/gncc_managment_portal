

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
    const { paidMonths, dueMonths, totalPaid } = getFeeStatus(student.dateOfJoining, fees, student.inactivePeriods);
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
    const { paidMonths } = getFeeStatus(student.dateOfJoining, fees, student.inactivePeriods);
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

    const allStudents = await Student.find({
      name: { $regex: search, $options: 'i' }
    }).select('name admissionNumber dateOfJoining email category status inactivePeriods');

    const fees = await Fee.find({
      studentId: { $in: allStudents.map(s => s._id) }
    }).select('studentId month year totalAmountPaid');

    const feesByStudent = fees.reduce((acc, fee) => {
      const key = fee.studentId.toString();
      if (!acc[key]) acc[key] = [];
      acc[key].push(fee);
      return acc;
    }, {});

    const result = [];

    for (const student of allStudents) {
      const studentFees = feesByStudent[student._id.toString()] || [];
      const paidMonths = studentFees.map(f =>
        new Date(f.year, f.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })
      );
      const paidSet = new Set(paidMonths);

      const startDate = new Date(student.dateOfJoining);
      const currentDate = new Date();
      let current = new Date(startDate);
      const dueMonths = [];

      while (current <= currentDate) {
        const label = current.toLocaleString('default', { month: 'long', year: 'numeric' });
        const snapshotDate = new Date(current);
        if (!paidSet.has(label) && !isInInactivePeriod(snapshotDate, student.inactivePeriods)) {
          dueMonths.push(label);
        }
        current.setMonth(current.getMonth() + 1);
      }

      const isDefaulter = dueMonths.length > 0;

      if ((defaulterParam === 'true' && isDefaulter) || (defaulterParam === 'false' && !isDefaulter)) {
        let emailNotified = false;
        if (notify === 'true' && student.email) {
          try {
            await sendFeeReminderEmail(student.email, student.name);
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
          totalPaid: studentFees.reduce((sum, f) => sum + f.totalAmountPaid, 0),
          paidMonths,
          dueMonths,
          totalDueMonths: dueMonths.length,
          emailNotified
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

    const paginated = sorted.slice((page - 1) * limit, page * limit);

    res.json({
      success: true,
      count: paginated.length,
      total: result.length,
      students: paginated
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
      activityStatus = '' // Add activityStatus filter
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

    // Fetch students
    const students = await Student.find(query)
      .select('name admissionNumber contactNumber email fatherName motherName dateOfJoining activityStatus dob parentContact address')
      .sort({ createdAt: -1 }); // Initial sort (will apply additional sort after enrichment)

    const studentIds = students.map(s => s._id);

    const fees = await Fee.find({ studentId: { $in: studentIds } })
      .select('studentId month year');

    const feesByStudent = fees.reduce((acc, fee) => {
      const key = fee.studentId.toString();
      if (!acc[key]) acc[key] = [];
      acc[key].push(fee);
      return acc;
    }, {});

 const enrichedStudents = students.map(student => {
  const studentFees = feesByStudent[student._id.toString()] || [];

  const paidMonthsSet = new Set(
    studentFees.map(f =>
      new Date(f.year, f.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })
    )
  );

  let startDate = new Date(student.dateOfJoining);

  // 💡 Shift start date to 1st of next month if joining is after 24th
  if (startDate.getDate() >= 25) {
    startDate.setMonth(startDate.getMonth() + 1);
    startDate.setDate(1);
  }

  const currentDate = new Date();
  const dueMonths = [];

  let current = new Date(startDate);
  while (current <= currentDate) {
    const label = current.toLocaleString('default', { month: 'long', year: 'numeric' });
    const snapshot = new Date(current);

    if (
      !paidMonthsSet.has(label) &&
      !isInInactivePeriod(snapshot, student.inactivePeriods)
    ) {
      dueMonths.push(label);
    }

    current.setMonth(current.getMonth() + 1);
  }

  const isFeeDefaulter = dueMonths.length > 0;

  return {
    _id: student._id,
    name: student.name,
    admissionNumber: student.admissionNumber,
    contactNumber: student.contactNumber,
    email: student.email,
    fatherName: student.fatherName,
    motherName: student.motherName,
    dateOfJoining: student.dateOfJoining,
    dob: student.dob,
    activityStatus: student.activityStatus || 'active',
    isFeeDefaulter,
    totalDueMonths: dueMonths.length
  };
});


    // Apply sorting
    const sortedStudents = enrichedStudents.sort((a, b) => {
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
      total: enrichedStudents.length,
      page: parseInt(page),
      limit: parseInt(limit)
    });

  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Helper function to check if date falls within inactive period
// function isInInactivePeriod(date, inactivePeriods) {
//   if (!inactivePeriods || inactivePeriods.length === 0) return false;
  
//   return inactivePeriods.some(period => {
//     const from = new Date(period.from);
//     const to = period.to ? new Date(period.to) : new Date(9999, 11, 31); // Far future date if no end date
    
//     return date >= from && date <= to;
//   });
// }



// Set Inactive Period
exports.setInactivePeriod = async (req, res) => {
  try {
    const { id } = req.params;
    const { from, to } = req.body;

    if (!isValidObjectId(id)) return res.status(400).json({ success: false, message: 'Invalid student ID' });
    if (!from || !to) return res.status(400).json({ success: false, message: 'Both from and to dates are required' });

    const student = await Student.findById(id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    student.activityStatus='inactive',
    student.inactivePeriods.push({ from, to });
    await student.save();

    res.json({ success: true, message: 'Inactive period set successfully', student });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to set inactive period', error: err.message });
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
