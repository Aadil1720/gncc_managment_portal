import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
  Chip,
  Grid,
  Backdrop,
  CircularProgress,
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import {
  getExpenditures,
  createExpenditure,
  updateExpenditure,
  deleteExpenditure
} from '../services/expenditureService';
import ExpenditureForm from '../componets/expenditures/ExpenditureForm';

const Expenditures = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { enqueueSnackbar } = useSnackbar();

  const [expenditures, setExpenditures] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [currentExpenditure, setCurrentExpenditure] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);

  const categories = [
    'Salaries',
    'Maintenance',
    'Utilities',
    'Equipment',
    'Supplies',
    'Other'
  ];

  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  const fetchExpenditures = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(monthFilter && { month: monthFilter }),
        ...(yearFilter && { year: yearFilter }),
        ...(categoryFilter && { category: categoryFilter })
      };
      const response = await getExpenditures(params);
      const{success,data}=response
      if (success) {
        setExpenditures(data.data.expenditures || []);
        setTotal(response.meta?.total || 0);
      } else {
        enqueueSnackbar(response.error || 'Failed to load expenditures', { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar('Error fetching expenditures', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, monthFilter, yearFilter, categoryFilter, enqueueSnackbar]);

  useEffect(() => {
    fetchExpenditures();
  }, [fetchExpenditures]);

  const handleAddExpenditure = () => {
    setCurrentExpenditure(null);
    setOpenForm(true);
  };

  const handleEditExpenditure = (exp) => {
    setCurrentExpenditure(exp);
    setOpenForm(true);
  };

  const handleSaveExpenditure = async (data) => {
    setLoading(true);
    try {
      let response;
      if (currentExpenditure) {
        response = await updateExpenditure(currentExpenditure._id, data);
      } else {
        response = await createExpenditure(data);
      }
      if (response.success) {
        enqueueSnackbar(currentExpenditure ? 'Expenditure updated' : 'Expenditure added', { variant: 'success' });
        setOpenForm(false);
        fetchExpenditures();
      } else {
        enqueueSnackbar(response.error || 'Failed to save expenditure', { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar('Error saving expenditure', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpenditure = async (id) => {
    setLoading(true);
    try {
      const response = await deleteExpenditure(id);
      if (response.success) {
        enqueueSnackbar('Expenditure deleted', { variant: 'info' });
        fetchExpenditures();
      } else {
        enqueueSnackbar(response.error || 'Failed to delete expenditure', { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar('Error deleting expenditure', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setMonthFilter('');
    setYearFilter('');
    setCategoryFilter('');
    setPage(0);
  };

  return (
    <Box sx={{ p: isMobile ? 1 : 3, position: 'relative' }}>
      <Typography
        variant={isMobile ? 'h6' : 'h4'}
        gutterBottom
        sx={{ fontWeight: 700, mb: isMobile ? 2 : 3 }}
      >
        Expenditure Management
      </Typography>

      {/* Filters & Actions */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Search"
              size="small"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              InputProps={{ startAdornment: <SearchIcon sx={{ mr: 1 }} /> }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={8} sx={{ textAlign: 'right' }}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{ mr: 2 }}
            >
              Filters
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddExpenditure}
            >
              Add Expenditure
            </Button>
          </Grid>
        </Grid>

        {showFilters && (
          <Paper sx={{ p: 2, mt: 2, mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Month"
                  size="small"
                  value={monthFilter}
                  onChange={e => setMonthFilter(e.target.value)}
                >
                  <MenuItem value="">All Months</MenuItem>
                  {months.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Year"
                  size="small"
                  type="number"
                  value={yearFilter}
                  onChange={e => setYearFilter(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Category"
                  size="small"
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', alignItems: 'center' }}>
                <Button variant="text" color="secondary" onClick={handleResetFilters} sx={{ ml: 'auto' }}>
                  Clear Filters
                </Button>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Description</TableCell>
              {!isMobile && <TableCell>Category</TableCell>}
              <TableCell>Amount</TableCell>
              {!isMobile && <TableCell>Date</TableCell>}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenditures.map(exp => (
              <TableRow key={exp._id} hover>
                <TableCell>
                  <Typography>{exp.description}</Typography>
                  {isMobile && (
                    <Typography variant="caption" color="text.secondary">
                      {exp.category} • {exp.month} {exp.year}
                    </Typography>
                  )}
                </TableCell>
                {!isMobile && <TableCell><Chip label={exp.category} size="small" /></TableCell>}
                <TableCell>₹{exp.amount.toLocaleString()}</TableCell>
                {!isMobile && <TableCell>{exp.month} {exp.year}</TableCell>}
                <TableCell align="right">
                  <Button size="small" startIcon={<EditIcon />} onClick={() => handleEditExpenditure(exp)}>
                    {!isMobile && 'Edit'}
                  </Button>
                  <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteExpenditure(exp._id)}>
                    {!isMobile && 'Delete'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={e => { setRowsPerPage(+e.target.value); setPage(0); }}
        rowsPerPageOptions={[5,10,25]}
      />

      {/* Form Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} fullWidth maxWidth="sm">
        <DialogTitle>{currentExpenditure ? 'Edit Expenditure' : 'Add New Expenditure'}</DialogTitle>
        <DialogContent>
          <ExpenditureForm
            expenditure={currentExpenditure}
            onSubmit={handleSaveExpenditure}
            onCancel={() => setOpenForm(false)}
            categories={categories}
          />
        </DialogContent>
      </Dialog>

      {/* Loading Backdrop */}
      <Backdrop open={loading} sx={{ color: '#fff', zIndex: theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default Expenditures;
