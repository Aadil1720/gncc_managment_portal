// Dashboard.js (Responsive)
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Container
} from '@mui/material';
import {
  AccountTree as StudentsIcon,
  AttachMoney as FeesIcon,
  MoneyOff as ExpendituresIcon,
  TrendingUp as IncomeIcon
} from '@mui/icons-material';

import studentService from '../services/studentService';
import { getFees } from '../services/feeService';
import { getMatchIncomes } from '../services/matchIncomeService';
import { getExpenditures } from '../services/expenditureService';

import MonthlyChart from '../componets/dashboard/MonthlyChart';
import RecentActivities from '../componets/dashboard/RecentActivities';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    feeDefaulters: 0,
    totalFees: 0,
    totalExpenditures: 0,
    totalIncome: 0,
    loading: true
  });

  const [monthlyData, setMonthlyData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  const [filters, setFilters] = useState({
    month: new Date().toLocaleString('default', { month: 'long' }),
    year: new Date().getFullYear().toString()
  });

  const years = Array.from({ length: 6 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    fetchDashboardData();
  }, [filters.month, filters.year]);

  const fetchDashboardData = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true }));

      const [
        studentsRes,
        defaultersRes,
        feesRes,
        expendituresRes,
        incomesRes,
        monthlyRes
      ] = await Promise.all([
        studentService.getStudents(),
        studentService.getFeeDefaulters('true', {
          limit: 1,
          month: filters.month,
          year: parseInt(filters.year)
        }),
        getFees({
          limit: 1,
          month: filters.month,
          year: parseInt(filters.year)
        }),
        getExpenditures({
          limit: 1,
          month: filters.month,
          year: parseInt(filters.year)
        }),
        getMatchIncomes({
          limit: 1,
          month: filters.month,
          year: parseInt(filters.year)
        }),
        studentService.getMonthlyReport({
          month: filters.month,
          year: parseInt(filters.year)
        })
      ]);
        
      setStats({
        totalStudents: studentsRes.data.total,
        feeDefaulters: defaultersRes.data.total,
        totalFees: feesRes.data?.totalCollected || 0,
        totalExpenditures: expendituresRes.data.data.meta?.totalAmount || 0,
        totalIncome: incomesRes.data.data.meta?.totalAmount || 0,
        loading: false
      });

      setMonthlyData(monthlyRes.data);
      setRecentActivities([
        ...studentsRes.data.expenditures?.slice(0, 3) || [],
        ...feesRes.data.expenditures?.slice(0, 3) || [],
        ...expendituresRes.data.expenditures?.slice(0, 2) || [],
        ...incomesRes.data.expenditures?.slice(0, 2) || []
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const StatCard = ({ icon, title, value, color }) => (
    <Card sx={{ height: '100%', boxShadow: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {React.cloneElement(icon, {
            fontSize: 'large',
            color: color,
            sx: { mr: 1 }
          })}
          <Typography variant="h6" color="textSecondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h5">
          {stats.loading ? <CircularProgress size={24} /> : value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            mb: 3
          }}
        >
          <Typography variant="h5" fontWeight={600}>
            Dashboard Overview
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControl size="small" sx={{ minWidth: 110 }}>
              <InputLabel>Month</InputLabel>
              <Select
                name="month"
                value={filters.month}
                onChange={handleFilterChange}
                label="Month"
              >
                {months.map(month => (
                  <MenuItem key={month} value={month}>{month}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 110 }}>
              <InputLabel>Year</InputLabel>
              <Select
                name="year"
                value={filters.year}
                onChange={handleFilterChange}
                label="Year"
              >
                {years.map(year => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<StudentsIcon />}
              title="Total Students"
              value={stats.totalStudents}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<FeesIcon />}
              title="Fee Defaulters"
              value={stats.feeDefaulters}
              color="warning"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<IncomeIcon />}
              title="Total Income"
              value={`₹${stats.totalIncome+stats.totalFees}`}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<ExpendituresIcon />}
              title="Total Expenses"
              value={`₹${stats.totalExpenditures}`}
              color="error"
            />
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: '100%', boxShadow: 2 }}>
            <Typography variant="h6" mb={2}>
              {`Monthly Financial Overview (${filters.month} ${filters.year})`}
            </Typography>
            <MonthlyChart data={monthlyData} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%', boxShadow: 2 }}>
            <Typography variant="h6" mb={2}>
              Recent Activities
            </Typography>
            <RecentActivities activities={recentActivities} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
