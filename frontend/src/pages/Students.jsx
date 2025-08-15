
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  Backdrop,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { Add as AddIcon, RepeatOneSharp } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

import studentService from '../services/studentService';
import StudentForm from '../componets/students/StudentForm';
import SearchAndFilter from '../componets/students/SearchAndFilterForm';
import StudentTable from '../componets/students/StudentTable';
import StudentDetailsDialog from '../componets/students/StudentDetails';

const InactivePeriodForm = ({ open, onClose, onSubmit }) => {
  const [period, setPeriod] = useState({
    from: dayjs(),
    to: null,
    reason: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedPeriod = {
      from: period.from.toISOString(),
      to: period.to?.toISOString(),
      reason: period.reason
    };
    onSubmit(formattedPeriod);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Set Inactive Period</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Student will be marked inactive immediately
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <DatePicker
              label="From Date"
              value={period.from}
              onChange={(newValue) => setPeriod({...period, from: newValue})}
              renderInput={(params) => <TextField {...params} fullWidth required />}
            />
            <DatePicker
              label="To Date (optional)"
              value={period.to}
              onChange={(newValue) => setPeriod({...period, to: newValue})}
              renderInput={(params) => <TextField {...params} fullWidth />}
              minDate={period.from}
            />
          </Box>
          
          <TextField
            label="Reason (optional)"
            value={period.reason}
            onChange={(e) => setPeriod({...period, reason: e.target.value})}
            fullWidth
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Confirm Inactive
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const InactivePeriodsDialog = ({ open, onClose, periods, studentId, onRemove }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Inactive Periods</DialogTitle>
      <DialogContent>
        {periods.length === 0 ? (
          <Typography>No inactive periods</Typography>
        ) : (
          <List>
            {periods.map((period) => (
              <React.Fragment key={period._id}>
                <ListItem>
                  <ListItemText
                    primary={`${format(new Date(period.from), 'MMM d, yyyy')} - 
                      ${period.to ? format(new Date(period.to), 'MMM d, yyyy') : 'Present'}`}
                    secondary={period.reason || 'No reason provided'}
                  />
                  <Button 
                    color="error" 
                    size="small"
                    onClick={() => onRemove(studentId, period._id)}
                  >
                    Remove
                  </Button>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const Students = () => {
  const [students, setStudents] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [openInactiveForm, setOpenInactiveForm] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [showDefaulters, setShowDefaulters] = useState(false);
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewData, setViewData] = useState(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [inactivePeriodsDialog, setInactivePeriodsDialog] = useState({
    open: false,
    periods: [],
    studentId: null
  });

 

  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
        sortBy: sortField,
        order: sortOrder,
        activityStatus: statusFilter
      };
      
      const response = showDefaulters
        ? await studentService.getFeeDefaulters('true', params)
        : await studentService.getStudents(params);

        console.log(response.data)
      if (response.success) {
        
        const total = showDefaulters ? response.data.total : response.data.total;
             setTotalStudents(total); 
        showDefaulters?setStudents(response.data.students)
        :setStudents(response.data.data)
      } else {
        enqueueSnackbar(response.error || 'Failed to load students', { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar('Unexpected error loading students', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, showDefaulters, sortField, sortOrder, statusFilter, enqueueSnackbar]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);



  const handleAddStudent = () => {
    setCurrentStudent(null);
    setOpenForm(true);
  };

  const handleEditStudent = (student) => {
    setCurrentStudent(student);
    setOpenForm(true);
  };

  const handleSaveStudent = async (studentData) => {
    setLoading(true);
    const action = currentStudent
      ? studentService.updateStudent(currentStudent._id, studentData)
      : studentService.createStudent(studentData);

    try {
      const response = await action;
      if (response.success) {
        enqueueSnackbar(`Student ${currentStudent ? 'updated' : 'added'} successfully`, { variant: 'success' });
        setOpenForm(false);
        fetchStudents();
      } else {
        enqueueSnackbar(response.error, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Error saving student', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (id) => {
    setLoading(true);
    try {
      const response = await studentService.deleteStudent(id);
      if (response.success) {
        enqueueSnackbar('Student deleted', { variant: 'info' });
        fetchStudents();
      } else {
        enqueueSnackbar(response.error, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Error deleting student', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (id) => {
    setLoading(true);
    try {
      const response = await studentService.getStudentDecriptionById(id);
      if (response.success) {
        setViewData(response.data);
        setOpenViewDialog(true);
      } else {
        enqueueSnackbar(response.error, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Failed to fetch student details', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenInactiveForm = (student) => {
    setCurrentStudent(student);
    setOpenInactiveForm(true);
  };

  const handleSaveInactivePeriod = async (periodData) => {
    setLoading(true);
    try {
      const response = await studentService.setInactivePeriod(currentStudent._id, periodData);
      if (response.success) {
        enqueueSnackbar('Student marked inactive', { variant: 'info' });
        setOpenInactiveForm(false);
        fetchStudents();
      } else {
        enqueueSnackbar(response.error, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Error setting inactive period', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleReactivate = async (id) => {
    setLoading(true);
    try {
      const response = await studentService.reactivateStudent(id);
      if (response.success) {
        enqueueSnackbar('Student reactivated', { variant: 'success' });
        fetchStudents();
      } else {
        enqueueSnackbar(response.error, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Error reactivating student', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleViewInactivePeriods = async (id) => {
    setLoading(true);
    try {
      const response = await studentService.getInactivePeriods(id);
      if (response.success) {
        setInactivePeriodsDialog({
          open: true,
          periods: response.data.inactivePeriods,
          studentId: id
        });
      } else {
        enqueueSnackbar(response.error, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Failed to fetch inactive periods', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveInactivePeriod = async (studentId, periodId) => {
    setLoading(true);
    try {
      const response = await studentService.removeInactivePeriod(studentId, periodId);
      
      if (response.success) {
        enqueueSnackbar('Inactive period removed', { variant: 'success' });
        fetchStudents();
        setInactivePeriodsDialog(prev => ({ ...prev, periods: prev.periods.filter(p => p._id !== periodId) }));
      } else {
        enqueueSnackbar(response.error, { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Failed to remove inactive period', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography
        variant={isMobile ? 'h6' : 'h4'}
        gutterBottom
        sx={{
          fontWeight: isMobile ? 600 : 700,
          fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem', lg: '2.5rem' },
          lineHeight: { xs: 1.3, md: 1.5 },
          mb: { xs: 2, md: 3 }
        }}
      >
        Student Management
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'stretch' : 'center',
          gap: isMobile ? 2 : 3,
          mb: 2,
        }}
      >
        <SearchAndFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortField={sortField}
          setSortField={setSortField}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? 1.2 : 1.5,
            alignItems: isMobile ? 'stretch' : 'center',
          }}
        >
          <Button
            variant={showDefaulters ? 'outlined' : 'contained'}
            onClick={() => setShowDefaulters(false)}
            sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', fontWeight: 600, py: 1 }}
          >
            All Students
          </Button>

          <Button
            variant={!showDefaulters ? 'outlined' : 'contained'}
            color="warning"
            onClick={() => setShowDefaulters(true)}
            sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', fontWeight: 600, py: 1 }}
          >
            Fee Defaulters
          </Button>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddStudent}
            sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem', fontWeight: 600, py: 1 }}
          >
            Add Student
          </Button>
        </Box>
      </Box>

   <StudentTable
  students={students}
  onView={handleView}
  onEdit={handleEditStudent}
  onDelete={handleDeleteStudent}
  onMarkInactive={handleOpenInactiveForm}
  onReactivate={handleReactivate}
  onViewInactivePeriods={handleViewInactivePeriods}
  page={page}
  rowsPerPage={rowsPerPage}
  totalCount={totalStudents}
  onPageChange={(newPage) => {
    setPage(newPage); // This was missing
  }}
  onRowsPerPageChange={(newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  }}
/>

      <StudentForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSubmit={handleSaveStudent}
        student={currentStudent}
      />

      <InactivePeriodForm
        open={openInactiveForm}
        onClose={() => setOpenInactiveForm(false)}
        onSubmit={handleSaveInactivePeriod}
      />

      <StudentDetailsDialog
        open={openViewDialog}
        onClose={() => setOpenViewDialog(false)}
        data={viewData}
      />

      <InactivePeriodsDialog
        open={inactivePeriodsDialog.open}
        onClose={() => setInactivePeriodsDialog({...inactivePeriodsDialog, open: false})}
        periods={inactivePeriodsDialog.periods}
        studentId={inactivePeriodsDialog.studentId}
        onRemove={handleRemoveInactivePeriod}
      />

      <Backdrop
        sx={{ color: '#fff', zIndex: theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default Students;