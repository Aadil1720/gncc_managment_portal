const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { validateCreateStudent, validateUpdateStudent } = require('../middleware/validate');

router.post('/create', validateCreateStudent, studentController.createStudent);
router.get('/all', studentController.getAllStudents);
router.get('/description/:id',studentController.getStudentDescription)
router.put('/update/:id', studentController.updateStudent);
router.delete('/delete/:id', studentController.deleteStudent);
router.get('/:id', studentController.getStudentById);
router.get('/defaulters/:defaulter', studentController.filterByFeeDefaulter);

// Inactive status management routes
router.post('/:id/set-inactive', studentController.setInactivePeriod);
router.post('/:id/reactivate', studentController.reactivateStudent);
router.get('/:id/inactive-periods', studentController.getInactivePeriods);
router.delete('/:id/inactive-periods/:periodId', studentController.removeInactivePeriod);
router.put('/:id/inactive-periods/:periodId', studentController.updateInactivePeriod);
router.put('/:id/inactive-periods/:periodId/reason', studentController.updateInactivePeriodReason);



module.exports = router;

