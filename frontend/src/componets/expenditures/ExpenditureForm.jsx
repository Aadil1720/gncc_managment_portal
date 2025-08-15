import React from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  MenuItem,
  Typography
} from '@mui/material';

const ExpenditureForm = ({ expenditure, onSubmit, onCancel, categories }) => {
  const [formData, setFormData] = React.useState({
    description: '',
    amount: '',
    category: '',
    month: '',
    year: ''
  });

  React.useEffect(() => {
    if (expenditure) {
      setFormData({
        description: expenditure.description,
        amount: expenditure.amount,
        category: expenditure.category,
        month: expenditure.month,
        year: expenditure.year
      });
    }
  }, [expenditure]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Month"
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
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Year"
            name="year"
            type="number"
            value={formData.year}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {expenditure ? 'Update' : 'Save'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExpenditureForm;