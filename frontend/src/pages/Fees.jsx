import React, { useEffect, useState } from 'react';
import {
  Box, Button, Chip, MenuItem, Paper,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField,
  Typography, useMediaQuery, useTheme, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Stack, Alert
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Receipt as ReceiptIcon,
  Close as CloseIcon,
  WhatsApp as WhatsAppIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import FeeForm from '../componets/fees/FeeForm';
import BulkFeeUpload from '../componets/fees/BulkFeeUpload';
import { 
  createFee, 
  getFees, 
  deleteFee, 
  updateFee,
  viewFeeSlipFrontend,
  downloadFeeSlipFrontend,
  shareFeeSlipOnWhatsAppFrontend,
  createBulkFees
} from '../services/feeService';
import studentService from '../services/studentService';

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [students, setStudents] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [openBulkUpload, setOpenBulkUpload] = useState(false);
  const [editData, setEditData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [slipModalOpen, setSlipModalOpen] = useState(false);
  const [currentFee, setCurrentFee] = useState(null);
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

  const handleBulkUpload = () => {
    setOpenBulkUpload(true);
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

  // INSTANT frontend slip generation
  const handleGenerateSlip = async (fee) => {
    setCurrentFee(fee);
    setSlipModalOpen(true);
    enqueueSnackbar('Fee slip is ready for download!', { variant: 'success' });
  };

  const handleViewSlip = async () => {
    if (!currentFee) return;
    
    const studentData = {
      name: currentFee.studentId?.name,
      admissionNumber: currentFee.studentId?.admissionNumber,
      fatherName: currentFee.studentId?.fatherName
    };

    const result = await viewFeeSlipFrontend(currentFee, studentData);
    if (!result.success) {
      enqueueSnackbar(result.error || 'Failed to view fee slip', { variant: 'error' });
    }
  };

  const handleDownloadSlip = async () => {
    if (!currentFee) return;
    
    const studentData = {
      name: currentFee.studentId?.name,
      admissionNumber: currentFee.studentId?.admissionNumber,
      fatherName: currentFee.studentId?.fatherName
    };

    const result = await downloadFeeSlipFrontend(currentFee, studentData);
    if (result.success) {
      enqueueSnackbar('Fee slip downloaded successfully!', { variant: 'success' });
    } else {
      enqueueSnackbar(result.error || 'Failed to download fee slip', { variant: 'error' });
    }
  };

  const handleShareOnWhatsApp = async () => {
    if (!currentFee) return;
    
    const studentData = {
      name: currentFee.studentId?.name,
      admissionNumber: currentFee.studentId?.admissionNumber
    };

    const result = await shareFeeSlipOnWhatsAppFrontend(currentFee, studentData);
    if (!result.success) {
      enqueueSnackbar(result.error || 'Failed to share fee slip', { variant: 'error' });
    }
  };

  const handleFormSubmit = async (feeData) => {
    try {
      let response;
      if (editData) {
        response = await updateFee(editData._id, feeData);
      } else {
        response = await createFee(feeData);
      }

      if (response.success) {
        enqueueSnackbar(response.message ||
          (editData ? 'Fee updated successfully' : 'Fee added successfully'),
          { variant: 'success' }
        );
        setOpenForm(false);
        setEditData(null);
        loadFees();
      } else {
        enqueueSnackbar(response.error || 'Failed to save fee', { variant: 'error' });
      }

    } catch (error) {
      const msg = error.response?.data?.message || 'Error saving fee';
      console.error('handleFormSubmit error:', msg);
      enqueueSnackbar(msg, { variant: 'error' });
    }
  };

  const handleBulkSubmit = async (feesData) => {
    try {
      const response = await createBulkFees(feesData);
      if (response.success) {
        enqueueSnackbar(
          `Successfully processed ${response.data.results.successful} fees. ${response.data.results.failed > 0 ? `${response.data.results.failed} failed.` : ''}`,
          { variant: 'success' }
        );
        setOpenBulkUpload(false);
        loadFees();
      } else {
        enqueueSnackbar(response.error || 'Failed to process bulk fees', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Error processing bulk fees', { variant: 'error' });
    }
  };

  const handleCloseSlipModal = () => {
    setSlipModalOpen(false);
    setCurrentFee(null);
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  // Calculate total collected amount
  const totalCollected = fees.reduce((sum, fee) => sum + (fee.totalAmountPaid || 0), 0);

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

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Paper sx={{ p: 2, minWidth: 120, textAlign: 'center' }}>
          <Typography variant="h6" color="primary">
            {totalCount}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Total Fees
          </Typography>
        </Paper>
        <Paper sx={{ p: 2, minWidth: 120, textAlign: 'center' }}>
          <Typography variant="h6" color="success.main">
            ₹{totalCollected.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Total Collected
          </Typography>
        </Paper>
      </Box>

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
            gap: isMobile ? 1 : 2,
            alignItems: isMobile ? 'stretch' : 'center'
          }}
        >
          <Box sx={{ display: 'flex', gap: isMobile ? 1 : 2, flexWrap: 'wrap' }}>
            <TextField
              select
              label="Month"
              size="small"
              value={monthFilter}
              onChange={(e) => {
                setMonthFilter(e.target.value);
                setPage(0);
              }}
              sx={{
                fontSize: isMobile ? '0.75rem' : '0.875rem',
                minWidth: isMobile ? '100%' : 120
              }}
            >
              <MenuItem value="">All Months</MenuItem>
              {months.map(month => (
                <MenuItem key={month} value={month}>{month}</MenuItem>
              ))}
            </TextField>
            
            <TextField
              select
              label="Year"
              size="small"
              value={yearFilter}
              onChange={(e) => {
                setYearFilter(e.target.value);
                setPage(0);
              }}
              sx={{ minWidth: isMobile ? '100%' : 100 }}
            >
              <MenuItem value="">All Years</MenuItem>
              {years.map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </TextField>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexDirection: isMobile ? 'column' : 'row' }}>
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={handleBulkUpload}
            fullWidth={isMobile}
            sx={{
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              py: isMobile ? 1 : 1.5,
              minWidth: isMobile ? '100%' : 120
            }}
          >
            Bulk Upload
          </Button>
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
              {[
                'Student', 
                'Month/Year', 
                'Amount', 
                'Remarks',
                'Actions'
              ].map((head) => (
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
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {fee.studentId?.name || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {fee.studentId?.admissionNumber}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: isMobile ? '0.7rem' : '0.85rem' }}>
                    {fee.month} {fee.year}
                  </TableCell>
                  <TableCell sx={{ fontSize: isMobile ? '0.7rem' : '0.85rem', fontWeight: 'medium' }}>
                    ₹{fee.totalAmountPaid?.toLocaleString() || '0'}
                  </TableCell>
                  <TableCell sx={{ fontSize: isMobile ? '0.7rem' : '0.85rem' }}>
                    {fee.remarks || '-'}
                  </TableCell>
                 
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      <Button 
                        size="small" 
                        sx={{ fontSize: '0.65rem', px: 1, minWidth: 0 }} 
                        onClick={() => handleEditFee(fee)}
                      >
                        <EditIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                        {!isMobile && 'Edit'}
                      </Button>
                      <Button 
                        size="small" 
                        color="info" 
                        sx={{ fontSize: '0.65rem', px: 1, minWidth: 0 }} 
                        onClick={() => handleGenerateSlip(fee)}
                      >
                        <ReceiptIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                        {!isMobile && 'Slip'}
                      </Button>
                      <Button 
                        size="small" 
                        color="error" 
                        sx={{ fontSize: '0.65rem', px: 1, minWidth: 0 }} 
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
                <TableCell 
                  colSpan={6} 
                  align="center" 
                  sx={{ py: 4 }}
                >
                  {loading ? 'Loading...' : 'No fee records found'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Fee Form Dialog */}
      <FeeForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditData(null);
        }}
        onSubmit={handleFormSubmit}
        students={students}
        editData={editData}
      />

      {/* Bulk Fee Upload Dialog */}
      <BulkFeeUpload
        open={openBulkUpload}
        onClose={() => setOpenBulkUpload(false)}
        onSubmit={handleBulkSubmit}
        students={students}
      />

      {/* Fee Slip Modal - INSTANT GENERATION */}
      <Dialog
        open={slipModalOpen}
        onClose={handleCloseSlipModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">
              Fee Receipt
            </Typography>
            <IconButton onClick={handleCloseSlipModal} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          {currentFee && (
            <Box>
              {/* Fee Details */}
              <Box mb={2}>
                <Typography variant="subtitle1" gutterBottom>
                  Student: {currentFee.studentId?.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Admission No: {currentFee.studentId?.admissionNumber}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Period: {currentFee.month} {currentFee.year}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Amount: ₹{currentFee.totalAmountPaid?.toLocaleString()}
                </Typography>
                {currentFee.remarks && (
                  <Typography variant="body2" color="textSecondary">
                    Remarks: {currentFee.remarks}
                  </Typography>
                )}
              </Box>

              {/* Instant Generation Notice */}
              <Alert severity="success" sx={{ mb: 2 }}>
                Fee slip can be generated instantly in your browser!
              </Alert>

              {/* Action Buttons */}
              <Stack spacing={1}>
                <Button
                  variant="contained"
                  startIcon={<ViewIcon />}
                  onClick={handleViewSlip}
                  fullWidth
                >
                  View Receipt
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownloadSlip}
                  fullWidth
                >
                  Download PDF
                </Button>
                <Button
                  variant="contained"
                  startIcon={<WhatsAppIcon />}
                  onClick={handleShareOnWhatsApp}
                  fullWidth
                  sx={{
                    backgroundColor: '#25D366',
                    '&:hover': {
                      backgroundColor: '#128C7E',
                    }
                  }}
                >
                  Share on WhatsApp
                </Button>
              </Stack>
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseSlipModal}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Fees;