import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@mui/material';
import { Delete as DeleteIcon, CloudUpload as UploadIcon } from '@mui/icons-material';

const BulkFeeUpload = ({ open, onClose, onSubmit, students }) => {
  const [feesData, setFeesData] = useState([]);
  const [errors, setErrors] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvData = e.target.result;
        const lines = csvData.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        const parsedData = lines.slice(1)
          .filter(line => line.trim())
          .map((line, index) => {
            const values = line.split(',').map(v => v.trim());
            const fee = {
              studentId: values[0],
              month: values[1],
              year: parseInt(values[2]),
              admissionFees: parseFloat(values[3]) || 0,
              tuitionFees: parseFloat(values[4]) || 0,
              transportFees: parseFloat(values[5]) || 0,
              remarks: values[6] || ''
            };
            
            // Validate
            const student = students.find(s => s._id === fee.studentId || s.admissionNumber === fee.studentId);
            if (student) {
              fee.studentId = student._id;
            } else {
              throw new Error(`Student not found: ${values[0]}`);
            }
            
            return fee;
          });
        
        setFeesData(parsedData);
        setErrors([]);
      } catch (error) {
        setErrors([error.message]);
      }
    };
    reader.readAsText(file);
  };

  const handleRemoveFee = (index) => {
    setFeesData(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (feesData.length === 0) {
      setErrors(['Please upload fee data first']);
      return;
    }
    onSubmit(feesData);
  };

  const downloadTemplate = () => {
    const headers = ['StudentID/AdmissionNo', 'Month', 'Year', 'AdmissionFees', 'TuitionFees', 'TransportFees', 'Remarks'];
    const example = ['STU001', 'January', '2024', '1000', '2000', '500', 'Paid via UPI'];
    const csvContent = [headers, example].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fee_upload_template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Bulk Fee Upload</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            Upload a CSV file with fee data. Download the template for reference.
          </Alert>
          
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            component="label"
            sx={{ mr: 2 }}
          >
            Upload CSV
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={handleFileUpload}
            />
          </Button>
          
          <Button
            variant="text"
            onClick={downloadTemplate}
          >
            Download Template
          </Button>
        </Box>

        {errors.length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </Alert>
        )}

        {feesData.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Preview ({feesData.length} fees)
            </Typography>
            <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Month</TableCell>
                    <TableCell>Year</TableCell>
                    <TableCell>Admission</TableCell>
                    <TableCell>Tuition</TableCell>
                    <TableCell>Transport</TableCell>
                    <TableCell>Remarks</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {feesData.map((fee, index) => {
                    const student = students.find(s => s._id === fee.studentId);
                    return (
                      <TableRow key={index}>
                        <TableCell>{student?.name}</TableCell>
                        <TableCell>{fee.month}</TableCell>
                        <TableCell>{fee.year}</TableCell>
                        <TableCell>₹{fee.admissionFees}</TableCell>
                        <TableCell>₹{fee.tuitionFees}</TableCell>
                        <TableCell>₹{fee.transportFees}</TableCell>
                        <TableCell>{fee.remarks}</TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveFee(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={feesData.length === 0}
        >
          Upload {feesData.length} Fees
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BulkFeeUpload;