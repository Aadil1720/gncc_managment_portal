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
  DialogActions,
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
  getMatchIncomes,
  createMatchIncome,
  updateMatchIncome,
  deleteMatchIncome
} from '../services/matchIncomeService';
import MatchIncomeForm from '../componets/matchIncomes/IncomeForm';

const MatchIncomes = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { enqueueSnackbar } = useSnackbar();

  const [incomes, setIncomes] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [currentIncome, setCurrentIncome] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);

  const sources = [
    'Sponsorship',
    'Ticket Sales',
    'Merchandise',
    'Donations',
    'Other'
  ];

  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  const fetchIncomes = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(monthFilter && { month: monthFilter }),
        ...(yearFilter && { year: yearFilter }),
        ...(sourceFilter && { source: sourceFilter })
      };
      const response = await getMatchIncomes(params);
      const{success,data}=response
      if (success) {
        setIncomes(data.data.matchIncomes || []);
        setTotal(response.meta?.total || 0);
      } else {
        enqueueSnackbar(response.error || 'Failed to load incomes', { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar('Error fetching match incomes', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, monthFilter, yearFilter, sourceFilter, enqueueSnackbar]);

  useEffect(() => {
    fetchIncomes();
  }, [fetchIncomes]);

  const handleAddIncome = () => {
    setCurrentIncome(null);
    setOpenForm(true);
  };

  const handleEditIncome = (income) => {
    setCurrentIncome(income);
    setOpenForm(true);
  };

  const handleSaveIncome = async (incomeData) => {
    setLoading(true);
    try {
      let response;
      if (currentIncome) {
        response = await updateMatchIncome(currentIncome._id, incomeData);
      } else {
        response = await createMatchIncome(incomeData);
      }
      if (response.success) {
        enqueueSnackbar(currentIncome ? 'Income updated' : 'Income added', { variant: 'success' });
        setOpenForm(false);
        fetchIncomes();
      } else {
        enqueueSnackbar(response.error || 'Failed to save income', { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar('Error saving match income', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteIncome = async (id) => {
    setLoading(true);
    try {
      const response = await deleteMatchIncome(id);
      if (response.success) {
        enqueueSnackbar('Income deleted', { variant: 'info' });
        fetchIncomes();
      } else {
        enqueueSnackbar(response.error || 'Failed to delete income', { variant: 'error' });
      }
    } catch (err) {
      enqueueSnackbar('Error deleting match income', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setMonthFilter('');
    setYearFilter('');
    setSourceFilter('');
    setPage(0);
  };

  return (
    <Box sx={{ p: isMobile ? 1 : 3, position: 'relative' }}>
      <Typography
        variant={isMobile ? 'h6' : 'h4'}
        gutterBottom
        sx={{ fontWeight: 700, mb: isMobile ? 2 : 3 }}
      >
        Income Management
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
              onClick={handleAddIncome}
            >
              Add Income
            </Button>
          </Grid>
        </Grid>

        {showFilters && (
          <Paper sx={{ p: 2, mt: 2, mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select fullWidth label="Month" size="small"
                  value={monthFilter} onChange={e => setMonthFilter(e.target.value)}
                >
                  <MenuItem value="">All Months</MenuItem>
                  {months.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>)}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth label="Year" size="small" type="number"
                  value={yearFilter}
                  onChange={e => setYearFilter(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  select fullWidth label="Source" size="small"
                  value={sourceFilter}
                  onChange={e => setSourceFilter(e.target.value)}
                >
                  <MenuItem value="">All Sources</MenuItem>
                  {sources.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
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
              {!isMobile && <TableCell>Source</TableCell>}
              <TableCell>Amount</TableCell>
              {!isMobile && <TableCell>Date</TableCell>}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {incomes.map(inc => (
              <TableRow key={inc._id} hover>
                <TableCell>
                  <Typography>{inc.description}</Typography>
                  {isMobile && (
                    <Typography variant="caption" color="text.secondary">
                      {inc.source} • {inc.month} {inc.year}
                    </Typography>
                  )}
                </TableCell>
                {!isMobile && <TableCell><Chip label={inc.source} size="small" /></TableCell>}
                <TableCell>₹{inc.amount.toLocaleString()}</TableCell>
                {!isMobile && <TableCell>{inc.month} {inc.year}</TableCell>}
                <TableCell align="right">
                  <Button size="small" startIcon={<EditIcon />} onClick={() => handleEditIncome(inc)}>
                    {!isMobile && 'Edit'}
                  </Button>
                  <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteIncome(inc._id)}>
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
        <DialogTitle>{currentIncome ? 'Edit Match Income' : 'Add New Match Income'}</DialogTitle>
        <DialogContent>
          <MatchIncomeForm
            income={currentIncome}
            onSubmit={handleSaveIncome}
            onCancel={() => setOpenForm(false)}
            sources={sources}
          />
        </DialogContent>
      </Dialog>

      {/* Backdrop Loading */}
      <Backdrop open={loading} sx={{ color: '#fff', zIndex: theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
};

export default MatchIncomes;
