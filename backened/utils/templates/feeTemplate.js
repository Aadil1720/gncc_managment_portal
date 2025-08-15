module.exports = (student, fee) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      padding: 40px;
      background-color: #fefefe;
      color: #2c3e50;
    }
    .container {
      max-width: 700px;
      margin: auto;
      border: 1px solid #ccc;
      border-radius: 10px;
      padding: 30px;
      box-shadow: 0 0 10px rgba(0,0,0,0.05);
    }
    .logo {
      text-align: center;
      margin-bottom: 10px;
    }
    .logo img {
      max-width: 120px;
    }
    h1 {
      text-align: center;
      color: #007bff;
      margin: 10px 0 5px 0;
    }
    h2 {
      text-align: center;
      font-size: 1rem;
      font-weight: normal;
      color: #555;
      margin-bottom: 20px;
    }
    .info p {
      margin: 8px 0;
      font-size: 1rem;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 25px;
      font-size: 1rem;
    }
    th, td {
      border: 1px solid #ccc;
      padding: 12px;
      text-align: left;
    }
    th {
      background-color: #f1f1f1;
    }
    .total {
      background-color: #e8f4fd;
      font-weight: bold;
    }
    .signature {
      margin-top: 50px;
      text-align: right;
      font-style: italic;
      font-size: 1rem;
    }
    .signature::before {
      content: "__________________________";
      display: block;
      margin-bottom: 5px;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      color: #666;
      font-size: 0.95rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="https://i.imgur.com/GNCCLogo.png" alt="GNCC Logo" />
    </div>
    <h1>GNCC Academy Fee Slip</h1>
    <h2>(Official Record of Fee Payment)</h2>

    <div class="info">
      <p><strong>Student Name:</strong> ${student.name}</p>
      <p><strong>Father's Name:</strong> ${student.fatherName}</p>
      <p><strong>Admission Number:</strong> ${student.admissionNumber}</p>
      <p><strong>Month & Year:</strong> ${fee.month} ${fee.year}</p>
      <p><strong>Date Paid:</strong> ${new Date(fee.datePaid).toDateString()}</p>
    </div>

    <table>
      <tr><th>Fee Type</th><th>Amount (INR)</th></tr>
      <tr><td>Admission Fees</td><td>₹${fee.admissionFees}</td></tr>
      <tr><td>Tuition Fees</td><td>₹${fee.tuitionFees}</td></tr>
      <tr><td>Transport Fees</td><td>₹${fee.transportFees}</td></tr>
      <tr class="total"><td>Total Paid</td><td>₹${fee.totalAmountPaid}</td></tr>
    </table>

    <div class="signature">
      Authorized Signature<br/>
      GNCC Academy
    </div>

    <div class="footer">
      Thank you for your payment. This receipt is auto-generated and valid without signature.
    </div>
  </div>
</body>
</html>
`;
