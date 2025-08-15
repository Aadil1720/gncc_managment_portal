const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

router.post('/login', login);



// TEMPORARY ROUTE TO CREATE ADMIN ONCE
// router.post('/create-admin', async (req, res) => {
//   const Admin = require('../models/Admin');
//   const admin = new Admin({ email: 'mohadil1j2@gmail.com', password: 'cncg@4132' });
//   console.log("Admin Created");
  
//   await admin.save();
//    console.log("Admin Created");
//   res.send('Admin created');
// });

module.exports = router;


