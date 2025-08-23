// // Dashboard.js (Responsive)
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
import { useSnackbar } from 'notistack';
// const Dashboard = () => {
//   const [stats, setStats] = useState({
//     totalStudents: 0,
//     feeDefaulters: 0,
//     totalFees: 0,
//     totalExpenditures: 0,
//     totalIncome: 0,
//     loading: true
//   });

//   const [monthlyData, setMonthlyData] = useState([]);
//   const [recentActivities, setRecentActivities] = useState([]);

//   const [filters, setFilters] = useState({
//     month: new Date().toLocaleString('default', { month: 'long' }),
//     year: new Date().getFullYear().toString()
//   });

//   const years = Array.from({ length: 6 }, (_, i) =>
//     (new Date().getFullYear() - i).toString()
//   );

//   const months = [
//     'January', 'February', 'March', 'April', 'May', 'June',
//     'July', 'August', 'September', 'October', 'November', 'December'
//   ];

//   useEffect(() => {
//     fetchDashboardData();
//   }, [filters.month, filters.year]);

//   const fetchDashboardData = async () => {
//     try {
//       setStats(prev => ({ ...prev, loading: true }));

//       const [
//         studentsRes,
//         defaultersRes,
//         feesRes,
//         expendituresRes,
//         incomesRes,
//         monthlyRes
//       ] = await Promise.all([
//         studentService.getStudents(),
//         studentService.getFeeDefaulters('true', {
//           limit: 1,
//           month: filters.month,
//           year: parseInt(filters.year)
//         }),
//         getFees({
//           limit: 1,
//           month: filters.month,
//           year: parseInt(filters.year)
//         }),
//         getExpenditures({
//           limit: 1,
//           month: filters.month,
//           year: parseInt(filters.year)
//         }),
//         getMatchIncomes({
//           limit: 1,
//           month: filters.month,
//           year: parseInt(filters.year)
//         }),
//         studentService.getMonthlyReport({
//           month: filters.month,
//           year: parseInt(filters.year)
//         })
//       ]);
        
//       setStats({
//         totalStudents: studentsRes.data.total,
//         feeDefaulters: defaultersRes.data.total,
//         totalFees: feesRes.data?.totalCollected || 0,
//         totalExpenditures: expendituresRes.data.data.meta?.totalAmount || 0,
//         totalIncome: incomesRes.data.data.meta?.totalAmount || 0,
//         loading: false
//       });
//       console.log(stats.totalFees)

//       setMonthlyData(monthlyRes.data);
//       setRecentActivities([
//         ...studentsRes.data.expenditures?.slice(0, 3) || [],
//         ...feesRes.data.expenditures?.slice(0, 3) || [],
//         ...expendituresRes.data.expenditures?.slice(0, 2) || [],
//         ...incomesRes.data.expenditures?.slice(0, 2) || []
//       ]);
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       setStats(prev => ({ ...prev, loading: false }));
//     }
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const StatCard = ({ icon, title, value, color }) => (
//     <Card sx={{ height: '100%', boxShadow: 2 }}>
//       <CardContent>
//         <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
//           {React.cloneElement(icon, {
//             fontSize: 'large',
//             color: color,
//             sx: { mr: 1 }
//           })}
//           <Typography variant="h6" color="textSecondary">
//             {title}
//           </Typography>
//         </Box>
//         <Typography variant="h5">
//           {stats.loading ? <CircularProgress size={24} /> : value}
//         </Typography>
//       </CardContent>
//     </Card>
//   );

//   return (
//     <Container maxWidth="xl" sx={{ py: 3 }}>
//       <Box sx={{ mb: 3 }}>
//         <Box
//           sx={{
//             display: 'flex',
//             flexDirection: { xs: 'column', sm: 'row' },
//             justifyContent: 'space-between',
//             alignItems: { xs: 'flex-start', sm: 'center' },
//             gap: 2,
//             mb: 3
//           }}
//         >
//           <Typography variant="h5" fontWeight={600}>
//             Dashboard Overview
//           </Typography>
//           <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
//             <FormControl size="small" sx={{ minWidth: 110 }}>
//               <InputLabel>Month</InputLabel>
//               <Select
//                 name="month"
//                 value={filters.month}
//                 onChange={handleFilterChange}
//                 label="Month"
//               >
//                 {months.map(month => (
//                   <MenuItem key={month} value={month}>{month}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             <FormControl size="small" sx={{ minWidth: 110 }}>
//               <InputLabel>Year</InputLabel>
//               <Select
//                 name="year"
//                 value={filters.year}
//                 onChange={handleFilterChange}
//                 label="Year"
//               >
//                 {years.map(year => (
//                   <MenuItem key={year} value={year}>{year}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Box>
//         </Box>

//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={6} md={3}>
//             <StatCard
//               icon={<StudentsIcon />}
//               title="Total Students"
//               value={stats.totalStudents}
//               color="primary"
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <StatCard
//               icon={<FeesIcon />}
//               title="Fee Defaulters"
//               value={stats.feeDefaulters}
//               color="warning"
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <StatCard
//               icon={<IncomeIcon />}
//               title="Total Income"
//               value={`₹${stats.totalIncome+stats.totalFees}`}
//               color="success"
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <StatCard
//               icon={<ExpendituresIcon />}
//               title="Total Expenses"
//               value={`₹${stats.totalExpenditures}`}
//               color="error"
//             />
//           </Grid>
//         </Grid>
//       </Box>

//       <Grid container spacing={2}>
//         <Grid item xs={12} md={8}>
//           <Paper sx={{ p: 2, height: '100%', boxShadow: 2 }}>
//             <Typography variant="h6" mb={2}>
//               {`Monthly Financial Overview (${filters.month} ${filters.year})`}
//             </Typography>
//             <MonthlyChart data={monthlyData} />
//           </Paper>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <Paper sx={{ p: 2, height: '100%', boxShadow: 2 }}>
//             <Typography variant="h6" mb={2}>
//               Recent Activities
//             </Typography>
//             <RecentActivities activities={recentActivities} />
//           </Paper>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };

// export default Dashboard;

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
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    month: new Date().toLocaleString('default', { month: 'long' }),
    year: new Date().getFullYear().toString()
  });

  const { enqueueSnackbar } = useSnackbar();

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
      setError(null);
      setStats(prev => ({ ...prev, loading: true }));

      const [
        studentsRes,
        defaultersRes,
        feesRes,
        expendituresRes,
        incomesRes,
        monthlyRes
      ] = await Promise.all([
        studentService.getStudents({ limit: 1 }),
        studentService.getFeeDefaulters('true', {
          limit: 1,
          month: filters.month,
          year: parseInt(filters.year)
        }).catch(error => {
          console.warn('Fee defaulters API error, using fallback:', error);
          return { success: true, data: { total: 0 } };
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
        }).catch(error => {
          console.warn('Monthly report API error:', error);
          return { success: true, data: [] };
        })
      ]);
      
      // Debug responses
      console.log("Students response:", studentsRes);
      console.log("Fees response:", feesRes);
      console.log("Expenditures response:", expendituresRes);
      console.log("Incomes response:", incomesRes);

      // Extract values from responses with fallbacks
      const totalStudents = studentsRes?.data?.total || studentsRes?.data?.length || 0;
      const feeDefaulters = defaultersRes?.data?.total || 0;
      
      // Fees data structure: { data: { totalCollected: number } }
      const totalFeesValue = feesRes.data?.totalCollected || 0;
      
      // Expenditures data structure: { data: { meta: { totalAmount: number } } }
      const expendituresData = expendituresRes?.data?.data || expendituresRes?.data;
      const totalExpendituresValue = expendituresData?.meta?.totalAmount || 
                                    expendituresData?.totalAmount || 0;
      
      // Incomes data structure: { data: { meta: { totalAmount: number } } }
      const incomesData = incomesRes?.data?.data || incomesRes?.data;
      const totalIncomeValue = incomesData?.meta?.totalAmount || 
                              incomesData?.totalAmount || 0;

      console.log("Calculated values:", {
        totalStudents,
        feeDefaulters,
        totalFees: totalFeesValue,
        totalExpenditures: totalExpendituresValue,
        totalIncome: totalIncomeValue
      });

      setStats({
        totalStudents,
        feeDefaulters,
        totalFees: totalFeesValue,
        totalExpenditures: totalExpendituresValue,
        totalIncome: totalIncomeValue,
        loading: false
      });

      setMonthlyData(monthlyRes?.data || []);

      // Create recent activities from all data sources
      const activities = [
        ...(studentsRes?.data?.students?.slice(0, 2) || []).map(student => ({
          type: 'student',
          title: `New student: ${student.name}`,
          timestamp: student.createdAt || new Date(),
          description: `Admission no: ${student.admissionNumber}`
        })),
        ...(feesRes?.data?.fees?.slice(0, 2) || []).map(fee => ({
          type: 'fee',
          title: `Fee payment received`,
          timestamp: fee.createdAt || new Date(),
          description: `Amount: ₹${fee.totalAmountPaid}`
        })),
        ...(expendituresData?.expenditures?.slice(0, 2) || []).map(expense => ({
          type: 'expense',
          title: `Expense recorded`,
          timestamp: expense.date || new Date(),
          description: `Amount: ₹${expense.amount}`
        })),
        ...(incomesData?.incomes?.slice(0, 2) || []).map(income => ({
          type: 'income',
          title: `Income recorded`,
          timestamp: income.date || new Date(),
          description: `Amount: ₹${income.amount}`
        }))
      ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
       .slice(0, 5);

      setRecentActivities(activities);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message || 'Failed to load dashboard data');
      setStats(prev => ({ ...prev, loading: false }));
      enqueueSnackbar('Failed to load dashboard data', { variant: 'error' });
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const StatCard = ({ icon, title, value, color = 'primary' }) => (
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
        <Typography variant="h5" component="div">
          {stats.loading ? <CircularProgress size={24} /> : value}
        </Typography>
      </CardContent>
    </Card>
  );

  // Calculate derived values
  const totalIncome = stats.totalFees + stats.totalIncome;
  const netBalance = totalIncome - stats.totalExpenditures;

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error loading dashboard: {error}
        </Alert>
        <Button variant="contained" onClick={fetchDashboardData}>
          Retry
        </Button>
      </Container>
    );
  }

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
              value={`₹${totalIncome.toLocaleString()}`}
              color="success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              icon={<ExpendituresIcon />}
              title="Total Expenses"
              value={`₹${stats.totalExpenditures.toLocaleString()}`}
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
