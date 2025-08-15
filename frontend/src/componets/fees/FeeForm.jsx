import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  useMediaQuery,
  useTheme
} from '@mui/material';
import studentService from '../../services/studentService';

const FeeForm = ({ open, onClose, onSubmit, fee }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    month: '',
    year: new Date().getFullYear(),
    admissionFees: 0,
    tuitionFees: 0,
    transportFees: 0,
    datePaid: new Date().toISOString().split('T')[0], // "YYYY-MM-DD"
    notes: ''
  });

  // Populate when editing
  useEffect(() => {
    if (fee) {
      setFormData({
        studentId: fee.studentId._id,
        month: fee.month,
        year: fee.year,
        admissionFees: fee.admissionFees,
        tuitionFees: fee.tuitionFees,
        transportFees: fee.transportFees,
        datePaid: fee.datePaid
          ? new Date(fee.datePaid).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
           notes: fee.notes || '',
      });
    } else {
      setFormData(prev => ({
        ...prev,
        studentId: '',
        month: '',
        year: new Date().getFullYear(),
        admissionFees: 0,
        tuitionFees: 0,
        transportFees: 0,
        datePaid: new Date().toISOString().split('T')[0],
      }));
    }
  }, [fee]);

  // Load students list
  useEffect(() => {
    (async () => {
      try {
        const response = await studentService.getStudents({ limit: 1000 });
        setStudents(response.data.data || []);
      } catch (err) {
        console.error('Error fetching students:', err);
      }
    })();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth="sm"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>{fee ? 'Edit Fee' : 'Add New Fee'}</DialogTitle>
      <DialogContent sx={{ pb: 20 }}>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Student */}
          <Grid item xs={12} sm={6}>
            <TextField
              select fullWidth label="Student"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              required
            >
              {students.map(s => (
                <MenuItem key={s._id} value={s._id}>
                  {s.name} ({s.admissionNumber})
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Month */}
          <Grid item xs={12} sm={6}>
            <TextField
              select fullWidth label="Month"
              name="month"
              value={formData.month}
              onChange={handleChange}
              required
            >
              {[
                "January","February","March","April","May","June",
                "July","August","September","October","November","December"
              ].map(m => (
                <MenuItem key={m} value={m}>{m}</MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Year */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Year"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleChange}
              required
            />
          </Grid>

          {/* Paid Date */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth label="Paid Date"
              name="datePaid"
              type="date"
              value={formData.datePaid}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
            />
          </Grid>

          {/* Fees Inputs */}
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth label="Admission Fees"
              name="admissionFees"
              type="number"
              value={formData.admissionFees}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth label="Tuition Fees"
              name="tuitionFees"
              type="number"
              value={formData.tuitionFees}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth label="Transport Fees"
              name="transportFees"
              type="number"
              value={formData.transportFees}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
  <TextField
    fullWidth
    multiline
    rows={2}
    label="Notes"
    name="notes"
    value={formData.notes}
    onChange={handleChange}
    placeholder="Add any remarks, payment details, etc."
  />
</Grid>

        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {fee ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeeForm;
