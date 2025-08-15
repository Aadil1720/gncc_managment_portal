import React, { useEffect, useState } from 'react';
import {
  Box, Button, Chip, MenuItem, Paper,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, TextField,
  Typography, useMediaQuery, useTheme, CircularProgress
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Receipt as ReceiptIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import FeeForm from '../componets/fees/FeeForm';
import { generateFeeSlip, createFee, getFees, deleteFee, updateFee,viewFeeSlip } from '../services/feeService';
import studentService from '../services/studentService';

const Fees = () => {
   const [fees, setFees] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [students, setStudents] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const loadFees = async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        ...(monthFilter && { month: monthFilter }),
        ...(yearFilter && { year: yearFilter })
      };
      
      const response = await getFees(params);
      if (response.success) {
        setFees(response.data.fees || []);
        setTotalCount(response.data.total || 0);
      } else {
        enqueueSnackbar(response.error || 'Failed to load fees', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Error loading fees', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      const response = await studentService.getStudents();
      console.log(response);
      console.log(response.success)
      if (response.success) {
        setStudents(response.data.data || []);
      }
    } catch (error) {
      enqueueSnackbar('Error loading students', { variant: 'error' });
    }
  };

  useEffect(() => {
    loadFees();
    loadStudents();
  }, [page, rowsPerPage, monthFilter, yearFilter]);

  const handleAddFee = () => {
    setEditData(null);
    setOpenForm(true);
  };

  const handleEditFee = (fee) => {
    setEditData(fee);
    setOpenForm(true);
  };

  const handleDeleteFee = async (id) => {
    if (window.confirm('Are you sure you want to delete this fee record?')) {
      const response = await deleteFee(id);
      if (response.success) {
        enqueueSnackbar('Fee deleted successfully', { variant: 'success' });
        loadFees();
      } else {
        enqueueSnackbar(response.error || 'Failed to delete fee', { variant: 'error' });
      }
    }
  };

  const handleGenerateSlip = async (id) => {
    const response = await viewFeeSlip(id);
    if (response.success) {
      enqueueSnackbar('Fee slip fetched successfully!', { variant: 'success' });
    } else {
      
      enqueueSnackbar(response.error || 'Failed to generate fee slip', { variant: 'error' });
    }
  };

// in Fees.jsx
const handleFormSubmit = async (feeData) => {
  try {
    let response;
    if (editData) {
      response = await updateFee(editData._id, feeData);
    } else {
      response = await createFee(feeData);
    }

    console.log('FeesPage response:', response);

    if (response.success) {
      // use response.message if provided
      enqueueSnackbar(response.message ||
        (editData ? 'Fee updated successfully' : 'Fee added successfully'),
        { variant: 'success' }
      );
      setOpenForm(false);
      setEditData(null);
      loadFees();
    } else {
      // show the exact error from the API
      enqueueSnackbar(response.error || 'Failed to save fee', { variant: 'error' });
    }

  } catch (error) {
    // this catch now only fires on truly unexpected errors
    const msg = error.response?.data?.message || 'Error saving fee';
    console.error('handleFormSubmit error:', msg);
    enqueueSnackbar(msg, { variant: 'error' });
  }
};


  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return (
    <Box p={isMobile ? 1 : 3}>
      <Typography
        variant={isMobile ? 'h6' : 'h4'}
        gutterBottom
        sx={{
          fontWeight: isMobile ? 600 : 700,
          fontSize: {
            xs: '1.25rem',
            sm: '1.5rem',
            md: '2rem',
            lg: '2.5rem'
          },
          lineHeight: {
            xs: 1.3,
            md: 1.5
          },
          mb: {
            xs: 2,
            md: 3
          }
        }}
      >
        Fees Management
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'stretch' : 'center',
          gap: isMobile ? 1 : 2,
          mb: 2
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 1 : 2
          }}
        >
          <Box sx={{ display: 'flex', gap: isMobile ? 1 : 2 }}>
            <TextField
              select
              label="Month"
              size="small"
              value={monthFilter}
              onChange={(e) => {
                setMonthFilter(e.target.value);
                setPage(0); // Reset to first page when filter changes
              }}
              sx={{
                fontSize: isMobile ? '0.75rem' : '0.875rem',
                width: isMobile ? '50%' : '100%'
              }}
            >
              <MenuItem value="">All Months</MenuItem>
              {months.map(month => (
                <MenuItem key={month} value={month}>{month}</MenuItem>
              ))}
            </TextField>
            
            <TextField
              label="Year"
              type="number"
              size="small"
              value={yearFilter}
              onChange={(e) => {
                setYearFilter(e.target.value);
                setPage(0); // Reset to first page when filter changes
              }}
              sx={{ width: isMobile ? '50%' : '100%' }}
              InputProps={{
                inputProps: { min: 2000, max: 2100 }
              }}
            />
          </Box>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddFee}
          fullWidth={isMobile}
          sx={{
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            py: isMobile ? 1 : 1.5,
            fontWeight: 500,
            minWidth: isMobile ? '100%' : 140
          }}
        >
          Add Fee
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ position: 'relative', minHeight: 200 }}>
        {loading && (
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.7)',
            zIndex: 1
          }}>
            <CircularProgress />
          </Box>
        )}

        <Table size="small">
          <TableHead>
            <TableRow>
              {['Student', 'Month/Year', 'Amount', 'Status', 'Actions'].map((head) => (
                <TableCell 
                  key={head} 
                  sx={{ 
                    fontSize: isMobile ? '0.7rem' : '0.85rem', 
                    fontWeight: 600,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {fees.length > 0 ? (
              fees.map((fee) => (
                <TableRow key={fee._id} hover>
                  <TableCell sx={{ fontSize: isMobile ? '0.7rem' : '0.85rem' }}>
                    {fee.studentId?.name || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ fontSize: isMobile ? '0.7rem' : '0.85rem' }}>
                    {fee.month} {fee.year}
                  </TableCell>
                  <TableCell sx={{ fontSize: isMobile ? '0.7rem' : '0.85rem' }}>
                    ₹{fee.totalAmountPaid?.toLocaleString() || '0'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={fee.isPaid ? 'Paid' : 'Pending'}
                      size="small"
                      color={fee.isPaid ? 'success' : 'warning'}
                      sx={{ 
                        fontSize: isMobile ? '0.65rem' : '0.75rem',
                        fontWeight: 500
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      <Button 
                        size="small" 
                        sx={{ 
                          fontSize: '0.65rem', 
                          px: 1,
                          minWidth: 0 
                        }} 
                        onClick={() => handleEditFee(fee)}
                      >
                        <EditIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                        {!isMobile && 'Edit'}
                      </Button>
                      <Button 
                        size="small" 
                        color="info" 
                        sx={{ 
                          fontSize: '0.65rem', 
                          px: 1,
                          minWidth: 0 
                        }} 
                        onClick={() => handleGenerateSlip(fee._id)}
                      >
                        <ReceiptIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                        {!isMobile && 'Slip'}
                      </Button>
                      <Button 
                        size="small" 
                        color="error" 
                        sx={{ 
                          fontSize: '0.65rem', 
                          px: 1,
                          minWidth: 0 
                        }} 
                        onClick={() => handleDeleteFee(fee._id)}
                      >
                        <DeleteIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                        {!isMobile && 'Delete'}
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  {loading ? 'Loading...' : 'No fee records found'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
        sx={{
          '& .MuiTablePagination-toolbar': {
            px: isMobile ? 1 : 2,
            py: isMobile ? 0.5 : 1,
            minHeight: isMobile ? '40px' : '56px',
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            gap: isMobile ? 1 : 2,
          }
        }}
      />

      <FeeForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleFormSubmit}
        students={students}
        editData={editData}
      />
    </Box>
  );
};

export default Fees;