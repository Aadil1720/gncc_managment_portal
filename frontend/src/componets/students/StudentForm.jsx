import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const StudentForm = ({ open, onClose, onSubmit, student }) => {
  const [formData, setFormData] = useState({
    name: '',
    dob: null,
    dateOfJoining: null,
    email: '',
    fatherName: '',
    fatherOccupation: '',
    motherName: '',
    contactNumber: '',
    parentContact: '',
    address: '',
    meansOfTransport: 'self',
    admissionFees: 3500,
    tuitionFees: 3000,
    category: 'general',
    activityStatus: 'active'
  });  

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (student) {
      // Convert date strings to dayjs objects for the date pickers
      setFormData({
        name: student.name || '',
        dob: student.dob ? dayjs(student.dob) : null,
        dateOfJoining: student.dateOfJoining ? dayjs(student.dateOfJoining) : dayjs(),
        email: student.email || '',
        fatherName: student.fatherName || '',
        fatherOccupation: student.fatherOccupation || '',
        motherName: student.motherName || '',
        contactNumber: student.contactNumber || '',
        parentContact: student.parentContact || '',
        address: student.address || '',
        meansOfTransport: student.meansOfTransport || 'self',
        admissionFees: student.admissionFees || 3500,
        tuitionFees: student.tuitionFees || 3000,
        category: student.category || 'general',
        activityStatus: student.activityStatus || 'active'
      });
    } else {
      // Reset to default values for new student
      setFormData({
        name: '',
        dob: null,
        dateOfJoining: dayjs(),
        email: '',
        fatherName: '',
        fatherOccupation: '',
        motherName: '',
        contactNumber: '',
        parentContact: '',
        address: '',
        meansOfTransport: 'self',
        admissionFees: 3500,
        tuitionFees: 3000,
        category: 'general',
        activityStatus: 'active'
      });
    }
  }, [student, open]); // Added open to dependencies to reset when reopening

  const validate = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.fatherName) newErrors.fatherName = 'Father name is required';
    if (!formData.motherName) newErrors.motherName = 'Mother name is required';
    if (!formData.parentContact) newErrors.parentContact = 'Parent contact is required';
    if (!formData.address) newErrors.address = 'Address is required';

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (key, date) => {
    setFormData((prev) => ({
      ...prev,
      [key]: date
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        dob: formData.dob ? formData.dob.toISOString() : null,
        dateOfJoining: formData.dateOfJoining
          ? formData.dateOfJoining.toISOString()
          : new Date().toISOString(),
        admissionFees: Number(formData.admissionFees),
        tuitionFees: Number(formData.tuitionFees)
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{student ? 'Edit Student' : 'Add New Student'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                margin="normal"
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Date of Birth"
                value={formData.dob}
                onChange={(date) => handleDateChange('dob', date)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    margin="normal"
                    error={!!errors.dob}
                    helperText={errors.dob}
                    required
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Date of Joining"
                value={formData.dateOfJoining}
                onChange={(date) => handleDateChange('dateOfJoining', date)}
                renderInput={(params) => (
                  <TextField {...params} fullWidth margin="normal" />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Father's Name"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                error={!!errors.fatherName}
                helperText={errors.fatherName}
                margin="normal"
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mother's Name"
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
                error={!!errors.motherName}
                helperText={errors.motherName}
                margin="normal"
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Father Occupation"
                name="fatherOccupation"
                value={formData.fatherOccupation}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Student Contact"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Parent Contact"
                name="parentContact"
                value={formData.parentContact}
                onChange={handleChange}
                error={!!errors.parentContact}
                helperText={errors.parentContact}
                margin="normal"
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Admission Fees"
                name="admissionFees"
                type="number"
                value={formData.admissionFees}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tuition Fees"
                name="tuitionFees"
                type="number"
                value={formData.tuitionFees}
                onChange={handleChange}
                margin="normal"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={!!errors.address}
                helperText={errors.address}
                margin="normal"
                required
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Transport</InputLabel>
                <Select
                  name="meansOfTransport"
                  value={formData.meansOfTransport}
                  onChange={handleChange}
                  label="Transport"
                >
                  <MenuItem value="self">Self</MenuItem>
                  <MenuItem value="academy">Academy</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Category"
                >
                  <MenuItem value="general">General</MenuItem>
                  <MenuItem value="sc">SC</MenuItem>
                  <MenuItem value="st">ST</MenuItem>
                  <MenuItem value="obc">OBC</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {student && (
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="activityStatus"
                    value={formData.activityStatus}
                    onChange={handleChange}
                    label="Status"
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" color="primary" variant="contained">
            {student ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default StudentForm;