const nodemailer = require('nodemailer');
const path = require('path');

// Email transporter setup using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send email after fee is submitted
const sendFeeSubmissionEmail = async (toEmail, studentName, pdfPath) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: toEmail,
    subject: 'GNCC Academy Fee Submission Confirmation',
    text: `Dear Parent,\n\nWe have received the fee payment for your child, ${studentName}. Please find the attached fee slip for your records.\n\nThank you,\nGNCC Academy`,
    attachments: [
      {
        filename: path.basename(pdfPath),
        path: pdfPath,
      },
    ],
  };

  return transporter.sendMail(mailOptions);
};

// Send reminder email for due fee
const sendFeeReminderEmail = async (toEmail, studentName, dueMonths) => {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: toEmail,
    subject: 'GNCC Academy Fee Payment Reminder',
    text: `Dear Parent,\n\nThis is a gentle reminder that the fee for your child, ${studentName}, is still pending for the following months:\n\n${dueMonths.join(', ')}\n\nWe kindly request you to make the payment at the earliest to avoid any inconvenience.\n\nThank you,\nGNCC Academy`,
  };

  return transporter.sendMail(mailOptions);
};

// Return SMS-friendly message string for fee reminder
const generateDueFeeMessage = (studentName, dueMonths) => {
  return `Reminder: Fee is due for ${studentName} for ${dueMonths.join(', ')}. Please pay at the earliest. - GNCC Academy`;
};

// Helper: Calculate age
const calculateAge = (dob) => {
  const diffMs = Date.now() - new Date(dob).getTime();
  const ageDt = new Date(diffMs);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
};



module.exports = {
  sendFeeSubmissionEmail,
  sendFeeReminderEmail,
  generateDueFeeMessage,
  calculateAge
};
