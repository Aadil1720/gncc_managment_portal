const mongoose = require('mongoose');
const Fee=require('./Fees')

const studentSchema = new mongoose.Schema({
  admissionNumber: { type: String, unique: true },
  name: { type: String, required: true },
  email: { type: String },
  image: { type: String },
  fatherName: { type: String, required:true },
  fatherOccupation:{type:String},
  motherName: { type: String, required:true },
  dob: { type: Date ,required:true},
  contactNumber: { type: String },
  category:{type:String},
  parentContact: { type: String , required:true},
  address: { type: String, required:true},
  meansOfTransport: {
    type: String,
    enum: ['self', 'academy'],
    default: 'self'
  },
  activityStatus: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  inactivePeriods: [
    {
      from: { type: Date, required: true },
      to: { type: Date }, // Can be null if student is still inactive
      reason: { type: String } 
    }
  ],
  admissionFees: { type: Number},
  tuitionFees: { type: Number},
  dateOfJoining: { type: Date, default: Date.now }
},
{
  timestamps: true  // 👈 yaha add karo
}
);


studentSchema.index({ name: 1, dob: 1,fatherName: 1 }, { unique: true }); 


 
// 📌 Pre-save hook: Auto-generate admission number
studentSchema.pre('validate', async function (next) {
  if (!this.admissionNumber) {
    const year = new Date().getFullYear();
    const regex = new RegExp(`^GNCC${year}(\\d{3})$`);

    // Find the student with the highest serial for this year
    const lastStudent = await this.constructor.findOne({ admissionNumber: regex })
      .sort({ admissionNumber: -1 })
      .exec();

    let serial = 1;
    if (lastStudent) {
      const lastAdmissionNumber = lastStudent.admissionNumber; // e.g. GNCC2025003
      const lastSerialStr = lastAdmissionNumber.slice(-3); // last 3 digits: '003'
      const lastSerialNum = parseInt(lastSerialStr, 10);
      serial = lastSerialNum + 1;
    }

    this.admissionNumber = `GNCC${year}${String(serial).padStart(3, '0')}`;
  }
  next();
});



// 📌 Automatically delete related fees on student delete
studentSchema.pre('findOneAndDelete', async function (next) {
  const student = await this.model.findOne(this.getFilter());
  if (student) {
    await Fee.deleteMany({ studentId: student._id });
  }
  next();
});
module.exports = mongoose.model('Student', studentSchema);
