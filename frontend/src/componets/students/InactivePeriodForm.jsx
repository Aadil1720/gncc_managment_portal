import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const InactivePeriodForm = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    from: null,
    to: null,
    reason: 'medical',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    
    if (!formData.from) newErrors.from = 'From date is required';
    if (formData.to && formData.to < formData.from) {
      newErrors.to = 'To date must be after from date';
    }
    if (!formData.reason) newErrors.reason = 'Reason is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (name, date) => {
    setFormData(prev => ({
      ...prev,
      [name]: date
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        from: formData.from.toISOString(),
        to: formData.to ? formData.to.toISOString() : null,
        reason: formData.reason,
        notes: formData.notes
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Set Inactive Period</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="From Date"
                  value={formData.from}
                  onChange={(date) => handleDateChange('from', date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      margin="normal"
                      error={!!errors.from}
                      helperText={errors.from}
                      required
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="To Date (optional)"
                  value={formData.to}
                  onChange={(date) => handleDateChange('to', date)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      margin="normal"
                      error={!!errors.to}
                      helperText={errors.to}
                    />
                  )}
                  minDate={formData.from}
                />
              </LocalizationProvider>
              <FormHelperText>Leave empty for indefinite period</FormHelperText>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal" error={!!errors.reason}>
                <InputLabel>Reason</InputLabel>
                <Select
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  label="Reason"
                  required
                >
                  <MenuItem value="medical">Medical</MenuItem>
                  <MenuItem value="vacation">Vacation</MenuItem>
                  <MenuItem value="transfer">Transfer</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
                {errors.reason && <FormHelperText>{errors.reason}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" color="primary" variant="contained">
            Set Inactive
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default InactivePeriodForm;

// InactivePeriodForm.js
// import React, { useState } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
//   Box,
//   Typography
// } from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers';
// import dayjs from 'dayjs';

// const InactivePeriodForm = ({ open, onClose, onSubmit }) => {
//   const [period, setPeriod] = useState({
//     from: dayjs(),
//     to: null,
//     reason: ''
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const formattedPeriod = {
//       from: period.from.toISOString(),
//       to: period.to?.toISOString(),
//       reason: period.reason
//     };
//     onSubmit(formattedPeriod);
//   };

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
//       <DialogTitle>Set Inactive Period</DialogTitle>
//       <form onSubmit={handleSubmit}>
//         <DialogContent>
//           <Box sx={{ mb: 2 }}>
//             <Typography variant="subtitle2" gutterBottom>
//               Student will be marked inactive immediately
//             </Typography>
//           </Box>
          
//           <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
//             <DatePicker
//               label="From Date"
//               value={period.from}
//               onChange={(newValue) => setPeriod({...period, from: newValue})}
//               renderInput={(params) => <TextField {...params} fullWidth required />}
//             />
//             <DatePicker
//               label="To Date (optional)"
//               value={period.to}
//               onChange={(newValue) => setPeriod({...period, to: newValue})}
//               renderInput={(params) => <TextField {...params} fullWidth />}
//               minDate={period.from}
//             />
//           </Box>
          
//           <TextField
//             label="Reason (optional)"
//             value={period.reason}
//             onChange={(e) => setPeriod({...period, reason: e.target.value})}
//             fullWidth
//             multiline
//             rows={3}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={onClose}>Cancel</Button>
//           <Button type="submit" variant="contained" color="primary">
//             Confirm Inactive
//           </Button>
//         </DialogActions>
//       </form>
//     </Dialog>
//   );
// };

// export default InactivePeriodForm;
