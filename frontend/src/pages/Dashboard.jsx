// // // Dashboard.js (Responsive)
// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   Grid,
//   Paper,
//   Card,
//   CardContent,
//   CircularProgress,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Select,
//   Container
// } from '@mui/material';
// import {
//   AccountTree as StudentsIcon,
//   AttachMoney as FeesIcon,
//   MoneyOff as ExpendituresIcon,
//   TrendingUp as IncomeIcon
// } from '@mui/icons-material';

// import studentService from '../services/studentService';
// import { getFees } from '../services/feeService';
// import { getMatchIncomes } from '../services/matchIncomeService';
// import { getExpenditures } from '../services/expenditureService';

// import MonthlyChart from '../componets/dashboard/MonthlyChart';
// import RecentActivities from '../componets/dashboard/RecentActivities';
// import { useSnackbar } from 'notistack';
// // const Dashboard = () => {
// //   const [stats, setStats] = useState({
// //     totalStudents: 0,
// //     feeDefaulters: 0,
// //     totalFees: 0,
// //     totalExpenditures: 0,
// //     totalIncome: 0,
// //     loading: true
// //   });

// //   const [monthlyData, setMonthlyData] = useState([]);
// //   const [recentActivities, setRecentActivities] = useState([]);

// //   const [filters, setFilters] = useState({
// //     month: new Date().toLocaleString('default', { month: 'long' }),
// //     year: new Date().getFullYear().toString()
// //   });

// //   const years = Array.from({ length: 6 }, (_, i) =>
// //     (new Date().getFullYear() - i).toString()
// //   );

// //   const months = [
// //     'January', 'February', 'March', 'April', 'May', 'June',
// //     'July', 'August', 'September', 'October', 'November', 'December'
// //   ];

// //   useEffect(() => {
// //     fetchDashboardData();
// //   }, [filters.month, filters.year]);

// //   const fetchDashboardData = async () => {
// //     try {
// //       setStats(prev => ({ ...prev, loading: true }));

// //       const [
// //         studentsRes,
// //         defaultersRes,
// //         feesRes,
// //         expendituresRes,
// //         incomesRes,
// //         monthlyRes
// //       ] = await Promise.all([
// //         studentService.getStudents(),
// //         studentService.getFeeDefaulters('true', {
// //           limit: 1,
// //           month: filters.month,
// //           year: parseInt(filters.year)
// //         }),
// //         getFees({
// //           limit: 1,
// //           month: filters.month,
// //           year: parseInt(filters.year)
// //         }),
// //         getExpenditures({
// //           limit: 1,
// //           month: filters.month,
// //           year: parseInt(filters.year)
// //         }),
// //         getMatchIncomes({
// //           limit: 1,
// //           month: filters.month,
// //           year: parseInt(filters.year)
// //         }),
// //         studentService.getMonthlyReport({
// //           month: filters.month,
// //           year: parseInt(filters.year)
// //         })
// //       ]);
        
// //       setStats({
// //         totalStudents: studentsRes.data.total,
// //         feeDefaulters: defaultersRes.data.total,
// //         totalFees: feesRes.data?.totalCollected || 0,
// //         totalExpenditures: expendituresRes.data.data.meta?.totalAmount || 0,
// //         totalIncome: incomesRes.data.data.meta?.totalAmount || 0,
// //         loading: false
// //       });
// //       console.log(stats.totalFees)

// //       setMonthlyData(monthlyRes.data);
// //       setRecentActivities([
// //         ...studentsRes.data.expenditures?.slice(0, 3) || [],
// //         ...feesRes.data.expenditures?.slice(0, 3) || [],
// //         ...expendituresRes.data.expenditures?.slice(0, 2) || [],
// //         ...incomesRes.data.expenditures?.slice(0, 2) || []
// //       ]);
// //     } catch (error) {
// //       console.error('Error fetching dashboard data:', error);
// //       setStats(prev => ({ ...prev, loading: false }));
// //     }
// //   };

// //   const handleFilterChange = (e) => {
// //     const { name, value } = e.target;
// //     setFilters(prev => ({
// //       ...prev,
// //       [name]: value
// //     }));
// //   };

// //   const StatCard = ({ icon, title, value, color }) => (
// //     <Card sx={{ height: '100%', boxShadow: 2 }}>
// //       <CardContent>
// //         <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
// //           {React.cloneElement(icon, {
// //             fontSize: 'large',
// //             color: color,
// //             sx: { mr: 1 }
// //           })}
// //           <Typography variant="h6" color="textSecondary">
// //             {title}
// //           </Typography>
// //         </Box>
// //         <Typography variant="h5">
// //           {stats.loading ? <CircularProgress size={24} /> : value}
// //         </Typography>
// //       </CardContent>
// //     </Card>
// //   );

// //   return (
// //     <Container maxWidth="xl" sx={{ py: 3 }}>
// //       <Box sx={{ mb: 3 }}>
// //         <Box
// //           sx={{
// //             display: 'flex',
// //             flexDirection: { xs: 'column', sm: 'row' },
// //             justifyContent: 'space-between',
// //             alignItems: { xs: 'flex-start', sm: 'center' },
// //             gap: 2,
// //             mb: 3
// //           }}
// //         >
// //           <Typography variant="h5" fontWeight={600}>
// //             Dashboard Overview
// //           </Typography>
// //           <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
// //             <FormControl size="small" sx={{ minWidth: 110 }}>
// //               <InputLabel>Month</InputLabel>
// //               <Select
// //                 name="month"
// //                 value={filters.month}
// //                 onChange={handleFilterChange}
// //                 label="Month"
// //               >
// //                 {months.map(month => (
// //                   <MenuItem key={month} value={month}>{month}</MenuItem>
// //                 ))}
// //               </Select>
// //             </FormControl>
// //             <FormControl size="small" sx={{ minWidth: 110 }}>
// //               <InputLabel>Year</InputLabel>
// //               <Select
// //                 name="year"
// //                 value={filters.year}
// //                 onChange={handleFilterChange}
// //                 label="Year"
// //               >
// //                 {years.map(year => (
// //                   <MenuItem key={year} value={year}>{year}</MenuItem>
// //                 ))}
// //               </Select>
// //             </FormControl>
// //           </Box>
// //         </Box>

// //         <Grid container spacing={2}>
// //           <Grid item xs={12} sm={6} md={3}>
// //             <StatCard
// //               icon={<StudentsIcon />}
// //               title="Total Students"
// //               value={stats.totalStudents}
// //               color="primary"
// //             />
// //           </Grid>
// //           <Grid item xs={12} sm={6} md={3}>
// //             <StatCard
// //               icon={<FeesIcon />}
// //               title="Fee Defaulters"
// //               value={stats.feeDefaulters}
// //               color="warning"
// //             />
// //           </Grid>
// //           <Grid item xs={12} sm={6} md={3}>
// //             <StatCard
// //               icon={<IncomeIcon />}
// //               title="Total Income"
// //               value={`₹${stats.totalIncome+stats.totalFees}`}
// //               color="success"
// //             />
// //           </Grid>
// //           <Grid item xs={12} sm={6} md={3}>
// //             <StatCard
// //               icon={<ExpendituresIcon />}
// //               title="Total Expenses"
// //               value={`₹${stats.totalExpenditures}`}
// //               color="error"
// //             />
// //           </Grid>
// //         </Grid>
// //       </Box>

// //       <Grid container spacing={2}>
// //         <Grid item xs={12} md={8}>
// //           <Paper sx={{ p: 2, height: '100%', boxShadow: 2 }}>
// //             <Typography variant="h6" mb={2}>
// //               {`Monthly Financial Overview (${filters.month} ${filters.year})`}
// //             </Typography>
// //             <MonthlyChart data={monthlyData} />
// //           </Paper>
// //         </Grid>
// //         <Grid item xs={12} md={4}>
// //           <Paper sx={{ p: 2, height: '100%', boxShadow: 2 }}>
// //             <Typography variant="h6" mb={2}>
// //               Recent Activities
// //             </Typography>
// //             <RecentActivities activities={recentActivities} />
// //           </Paper>
// //         </Grid>
// //       </Grid>
// //     </Container>
// //   );
// // };

// // export default Dashboard;

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
//   const [error, setError] = useState(null);

//   const [filters, setFilters] = useState({
//     month: new Date().toLocaleString('default', { month: 'long' }),
//     year: new Date().getFullYear().toString()
//   });

//   const { enqueueSnackbar } = useSnackbar();

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
//       setError(null);
//       setStats(prev => ({ ...prev, loading: true }));

//       const [
//         studentsRes,
//         defaultersRes,
//         feesRes,
//         expendituresRes,
//         incomesRes,
//         monthlyRes
//       ] = await Promise.all([
//         studentService.getStudents({ limit: 1 }),
//         studentService.getFeeDefaulters('true', {
//           limit: 1,
//           month: filters.month,
//           year: parseInt(filters.year)
//         }).catch(error => {
//           console.warn('Fee defaulters API error, using fallback:', error);
//           return { success: true, data: { total: 0 } };
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
//         }).catch(error => {
//           console.warn('Monthly report API error:', error);
//           return { success: true, data: [] };
//         })
//       ]);
      
//       // Debug responses
//       console.log("Students response:", studentsRes);
//       console.log("Fees response:", feesRes);
//       console.log("Expenditures response:", expendituresRes);
//       console.log("Incomes response:", incomesRes);

//       // Extract values from responses with fallbacks
//       const totalStudents = studentsRes?.data?.total || studentsRes?.data?.length || 0;
//       const feeDefaulters = defaultersRes?.data?.total || 0;
      
//       // Fees data structure: { data: { totalCollected: number } }
//       const totalFeesValue = feesRes.data?.totalCollected || 0;
      
//       // Expenditures data structure: { data: { meta: { totalAmount: number } } }
//       const expendituresData = expendituresRes?.data?.data || expendituresRes?.data;
//       const totalExpendituresValue = expendituresData?.meta?.totalAmount || 
//                                     expendituresData?.totalAmount || 0;
      
//       // Incomes data structure: { data: { meta: { totalAmount: number } } }
//       const incomesData = incomesRes?.data?.data || incomesRes?.data;
//       const totalIncomeValue = incomesData?.meta?.totalAmount || 
//                               incomesData?.totalAmount || 0;

//       console.log("Calculated values:", {
//         totalStudents,
//         feeDefaulters,
//         totalFees: totalFeesValue,
//         totalExpenditures: totalExpendituresValue,
//         totalIncome: totalIncomeValue
//       });

//       setStats({
//         totalStudents,
//         feeDefaulters,
//         totalFees: totalFeesValue,
//         totalExpenditures: totalExpendituresValue,
//         totalIncome: totalIncomeValue,
//         loading: false
//       });

//       setMonthlyData(monthlyRes?.data || []);

//       // Create recent activities from all data sources
//       const activities = [
//         ...(studentsRes?.data?.students?.slice(0, 2) || []).map(student => ({
//           type: 'student',
//           title: `New student: ${student.name}`,
//           timestamp: student.createdAt || new Date(),
//           description: `Admission no: ${student.admissionNumber}`
//         })),
//         ...(feesRes?.data?.fees?.slice(0, 2) || []).map(fee => ({
//           type: 'fee',
//           title: `Fee payment received`,
//           timestamp: fee.createdAt || new Date(),
//           description: `Amount: ₹${fee.totalAmountPaid}`
//         })),
//         ...(expendituresData?.expenditures?.slice(0, 2) || []).map(expense => ({
//           type: 'expense',
//           title: `Expense recorded`,
//           timestamp: expense.date || new Date(),
//           description: `Amount: ₹${expense.amount}`
//         })),
//         ...(incomesData?.incomes?.slice(0, 2) || []).map(income => ({
//           type: 'income',
//           title: `Income recorded`,
//           timestamp: income.date || new Date(),
//           description: `Amount: ₹${income.amount}`
//         }))
//       ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
//        .slice(0, 5);

//       setRecentActivities(activities);
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       setError(error.message || 'Failed to load dashboard data');
//       setStats(prev => ({ ...prev, loading: false }));
//       enqueueSnackbar('Failed to load dashboard data', { variant: 'error' });
//     }
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const StatCard = ({ icon, title, value, color = 'primary' }) => (
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
//         <Typography variant="h5" component="div">
//           {stats.loading ? <CircularProgress size={24} /> : value}
//         </Typography>
//       </CardContent>
//     </Card>
//   );

//   // Calculate derived values
//   const totalIncome = stats.totalFees + stats.totalIncome;
//   const netBalance = totalIncome - stats.totalExpenditures;

//   if (error) {
//     return (
//       <Container maxWidth="xl" sx={{ py: 3 }}>
//         <Alert severity="error" sx={{ mb: 2 }}>
//           Error loading dashboard: {error}
//         </Alert>
//         <Button variant="contained" onClick={fetchDashboardData}>
//           Retry
//         </Button>
//       </Container>
//     );
//   }

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
//               value={`₹${totalIncome.toLocaleString()}`}
//               color="success"
//             />
//           </Grid>
//           <Grid item xs={12} sm={6} md={3}>
//             <StatCard
//               icon={<ExpendituresIcon />}
//               title="Total Expenses"
//               value={`₹${stats.totalExpenditures.toLocaleString()}`}
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

// Dashboard.js (Enhanced Responsive Version)
// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   Grid,
//   Paper,
//   Card,
//   CardContent,
//   CircularProgress,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Select,
//   Container,
//   Alert,
//   Button,
//   useTheme,
//   useMediaQuery,
//   alpha
// } from '@mui/material';
// import {
//   AccountTree as StudentsIcon,
//   AttachMoney as FeesIcon,
//   MoneyOff as ExpendituresIcon,
//   TrendingUp as IncomeIcon
// } from '@mui/icons-material';
// import { useSnackbar } from 'notistack';

// // Mock services for demonstration - replace with your actual services
// const studentService = {
//   getStudents: () => Promise.resolve({ 
//     data: { total: 82, students: Array(5).fill().map((_, i) => ({
//       name: `Student ${i+1}`,
//       admissionNumber: `ADM${1000 + i}`,
//       createdAt: new Date(Date.now() - i * 86400000).toISOString()
//     }))} 
//   }),
//   getFeeDefaulters: () => Promise.resolve({ data: { total: 81 } }),
//   getMonthlyReport: () => Promise.resolve({ 
//     data: [
//       { week: 'Week 1', fees: 800, expenses: 300, income: 500 },
//       { week: 'Week 2', fees: 650, expenses: 400, income: 700 },
//       { week: 'Week 3', fees: 900, expenses: 350, income: 600 },
//       { week: 'Week 4', fees: 750, expenses: 450, income: 550 }
//     ]
//   })
// };

// const feeService = {
//   getFees: () => Promise.resolve({ 
//     data: { 
//       totalCollected: 2500,
//       fees: Array(2).fill().map((_, i) => ({
//         totalAmountPaid: 500 + i * 200,
//         createdAt: new Date(Date.now() - i * 172800000).toISOString()
//       }))
//     } 
//   })
// };

// const expenditureService = {
//   getExpenditures: () => Promise.resolve({ 
//     data: { 
//       data: {
//         meta: { totalAmount: 0 },
//         expenditures: Array(2).fill().map((_, i) => ({
//           amount: 150 + i * 100,
//           date: new Date(Date.now() - i * 259200000).toISOString()
//         }))
//       }
//     } 
//   })
// };

// const matchIncomeService = {
//   getMatchIncomes: () => Promise.resolve({ 
//     data: { 
//       data: {
//         meta: { totalAmount: 0 },
//         incomes: Array(2).fill().map((_, i) => ({
//           amount: 200 + i * 150,
//           date: new Date(Date.now() - i * 345600000).toISOString()
//         }))
//       }
//     } 
//   })
// };

// // MonthlyChart Component with proper data handling
// const MonthlyChart = ({ data, isMobile }) => {
//   const theme = useTheme();
  
//   if (!data || data.length === 0) {
//     return (
//       <Box 
//         sx={{ 
//           height: isMobile ? 250 : 300, 
//           display: 'flex', 
//           alignItems: 'center', 
//           justifyContent: 'center',
//           flexDirection: 'column',
//           gap: 2
//         }}
//       >
//         <Typography color="textSecondary">
//           No financial data available for the selected period
//         </Typography>
//         <Button variant="outlined" size="small">
//           Refresh Data
//         </Button>
//       </Box>
//     );
//   }

//   // Calculate max value for scaling
//   const maxValue = Math.max(...data.map(item => 
//     Math.max(item.fees || 0, item.expenses || 0, item.income || 0)
//   ));

//   return (
//     <Box sx={{ height: isMobile ? 250 : 300, position: 'relative' }}>
//       <Box sx={{ 
//         display: 'flex', 
//         height: '100%', 
//         alignItems: 'flex-end',
//         justifyContent: 'space-between',
//         gap: 1,
//         px: 1
//       }}>
//         {data.map((item, index) => (
//           <Box key={index} sx={{ 
//             display: 'flex', 
//             flexDirection: 'column', 
//             alignItems: 'center',
//             width: `${100 / data.length}%`,
//             height: '100%'
//           }}>
//             {/* Fees Bar */}
//             <Box sx={{
//               width: '30%',
//               height: `${((item.fees || 0) / maxValue) * 80}%`,
//               backgroundColor: theme.palette.success.main,
//               borderRadius: '4px 4px 0 0',
//               marginBottom: '2px',
//               position: 'relative',
//               '&:hover': {
//                 backgroundColor: theme.palette.success.dark,
//               }
//             }} title={`Fees: $${item.fees || 0}`} />
            
//             {/* Income Bar */}
//             <Box sx={{
//               width: '30%',
//               height: `${((item.income || 0) / maxValue) * 80}%`,
//               backgroundColor: theme.palette.info.main,
//               borderRadius: '4px 4px 0 0',
//               marginBottom: '2px',
//               position: 'relative',
//               '&:hover': {
//                 backgroundColor: theme.palette.info.dark,
//               }
//             }} title={`Income: $${item.income || 0}`} />
            
//             {/* Expenses Bar */}
//             <Box sx={{
//               width: '30%',
//               height: `${((item.expenses || 0) / maxValue) * 80}%`,
//               backgroundColor: theme.palette.error.main,
//               borderRadius: '4px 4px 0 0',
//               position: 'relative',
//               '&:hover': {
//                 backgroundColor: theme.palette.error.dark,
//               }
//             }} title={`Expenses: $${item.expenses || 0}`} />
            
//             <Typography variant="caption" sx={{ mt: 1, textAlign: 'center' }}>
//               {item.week || `Week ${index + 1}`}
//             </Typography>
//           </Box>
//         ))}
//       </Box>
      
//       {/* Legend */}
//       <Box sx={{ 
//         display: 'flex', 
//         justifyContent: 'center', 
//         gap: 2, 
//         mt: 2,
//         flexWrap: 'wrap'
//       }}>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//           <Box sx={{ width: 12, height: 12, backgroundColor: theme.palette.success.main }} />
//           <Typography variant="caption">Fees</Typography>
//         </Box>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//           <Box sx={{ width: 12, height: 12, backgroundColor: theme.palette.info.main }} />
//           <Typography variant="caption">Income</Typography>
//         </Box>
//         <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
//           <Box sx={{ width: 12, height: 12, backgroundColor: theme.palette.error.main }} />
//           <Typography variant="caption">Expenses</Typography>
//         </Box>
//       </Box>
//     </Box>
//   );
// };

// // RecentActivities Component
// const RecentActivities = ({ activities, isMobile }) => {
//   if (!activities || activities.length === 0) {
//     return (
//       <Box sx={{ 
//         height: isMobile ? 200 : 300, 
//         display: 'flex', 
//         alignItems: 'center', 
//         justifyContent: 'center' 
//       }}>
//         <Typography color="textSecondary">
//           No recent activities
//         </Typography>
//       </Box>
//     );
//   }

//   const getActivityIcon = (type) => {
//     switch(type) {
//       case 'student': return <StudentsIcon color="primary" sx={{ fontSize: 20 }} />;
//       case 'fee': return <FeesIcon color="success" sx={{ fontSize: 20 }} />;
//       case 'expense': return <ExpendituresIcon color="error" sx={{ fontSize: 20 }} />;
//       case 'income': return <IncomeIcon color="info" sx={{ fontSize: 20 }} />;
//       default: return <FeesIcon color="disabled" sx={{ fontSize: 20 }} />;
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { 
//       month: 'short', 
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   return (
//     <Box sx={{ maxHeight: isMobile ? 200 : 300, overflow: 'auto' }}>
//       {activities.map((activity, index) => (
//         <Box 
//           key={index}
//           sx={{
//             display: 'flex',
//             alignItems: 'flex-start',
//             gap: 1.5,
//             py: 1.5,
//             borderBottom: index < activities.length - 1 ? '1px solid' : 'none',
//             borderColor: 'divider'
//           }}
//         >
//           <Box sx={{ mt: 0.5 }}>
//             {getActivityIcon(activity.type)}
//           </Box>
//           <Box sx={{ flexGrow: 1 }}>
//             <Typography variant="body2" fontWeight={500}>
//               {activity.title}
//             </Typography>
//             <Typography variant="caption" color="textSecondary">
//               {activity.description}
//             </Typography>
//             <Typography variant="caption" display="block" color="textSecondary">
//               {formatDate(activity.timestamp)}
//             </Typography>
//           </Box>
//         </Box>
//       ))}
//     </Box>
//   );
// };

// // Main Dashboard Component
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
//   const [error, setError] = useState(null);

//   const [filters, setFilters] = useState({
//     month: new Date().toLocaleString('default', { month: 'long' }),
//     year: new Date().getFullYear().toString()
//   });

//   const { enqueueSnackbar } = useSnackbar();
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const isTablet = useMediaQuery(theme.breakpoints.down('md'));

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
//       setError(null);
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
//         studentService.getFeeDefaulters(),
//         feeService.getFees(),
//         expenditureService.getExpenditures(),
//         matchIncomeService.getMatchIncomes(),
//         studentService.getMonthlyReport()
//       ]);
      
//       // Extract values from responses with fallbacks
//       const totalStudents = studentsRes?.data?.total || 0;
//       const feeDefaulters = defaultersRes?.data?.total || 0;
//       const totalFeesValue = feesRes.data?.totalCollected || 0;
      
//       const expendituresData = expendituresRes?.data?.data || expendituresRes?.data;
//       const totalExpendituresValue = expendituresData?.meta?.totalAmount || 0;
      
//       const incomesData = incomesRes?.data?.data || incomesRes?.data;
//       const totalIncomeValue = incomesData?.meta?.totalAmount || 0;

//       setStats({
//         totalStudents,
//         feeDefaulters,
//         totalFees: totalFeesValue,
//         totalExpenditures: totalExpendituresValue,
//         totalIncome: totalIncomeValue,
//         loading: false
//       });

//       setMonthlyData(monthlyRes?.data || []);

//       // Create recent activities from all data sources
//       const activities = [
//         ...(studentsRes?.data?.students?.slice(0, 2) || []).map(student => ({
//           type: 'student',
//           title: `New student: ${student.name}`,
//           timestamp: student.createdAt || new Date(),
//           description: `Admission no: ${student.admissionNumber}`
//         })),
//         ...(feesRes?.data?.fees?.slice(0, 2) || []).map(fee => ({
//           type: 'fee',
//           title: `Fee payment received`,
//           timestamp: fee.createdAt || new Date(),
//           description: `Amount: ₹${fee.totalAmountPaid}`
//         })),
//         ...((expendituresData?.expenditures || []).slice(0, 2).map(expense => ({
//           type: 'expense',
//           title: `Expense recorded`,
//           timestamp: expense.date || new Date(),
//           description: `Amount: ₹${expense.amount}`
//         }))),
//         ...((incomesData?.incomes || []).slice(0, 2).map(income => ({
//           type: 'income',
//           title: `Income recorded`,
//           timestamp: income.date || new Date(),
//           description: `Amount: ₹${income.amount}`
//         })))
//       ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
//        .slice(0, 5);

//       setRecentActivities(activities);
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//       setError(error.message || 'Failed to load dashboard data');
//       setStats(prev => ({ ...prev, loading: false }));
//       enqueueSnackbar('Failed to load dashboard data', { variant: 'error' });
//     }
//   };

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const StatCard = ({ icon, title, value, color = 'primary' }) => (
//     <Card sx={{ 
//       height: '100%', 
//       boxShadow: 2,
//       borderRadius: 2,
//       background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.1)} 0%, ${alpha(theme.palette[color].main, 0.05)} 100%)`,
//       transition: 'transform 0.2s, box-shadow 0.2s',
//       '&:hover': {
//         transform: 'translateY(-4px)',
//         boxShadow: 4
//       }
//     }}>
//       <CardContent sx={{ p: isMobile ? 1.5 : 2 }}>
//         <Box sx={{ 
//           display: 'flex', 
//           alignItems: 'center', 
//           mb: 1,
//           flexDirection: isMobile ? 'column' : 'row',
//           textAlign: isMobile ? 'center' : 'left'
//         }}>
//           {React.cloneElement(icon, {
//             fontSize: isMobile ? 'medium' : 'large',
//             color: color,
//             sx: { 
//               mr: isMobile ? 0 : 1, 
//               mb: isMobile ? 0.5 : 0,
//               background: alpha(theme.palette[color].main, 0.2),
//               p: 1,
//               borderRadius: '50%'
//             }
//           })}
//           <Typography 
//             variant={isMobile ? "body2" : "h6"} 
//             color="textSecondary"
//             sx={{ fontWeight: isMobile ? 500 : 600 }}
//           >
//             {title}
//           </Typography>
//         </Box>
//         <Typography 
//           variant={isMobile ? "h6" : "h5"} 
//           component="div"
//           sx={{ 
//             textAlign: isMobile ? 'center' : 'left',
//             fontWeight: 700,
//             color: theme.palette[color].dark
//           }}
//         >
//           {stats.loading ? <CircularProgress size={isMobile ? 20 : 24} /> : value}
//         </Typography>
//       </CardContent>
//     </Card>
//   );

//   // Calculate derived values
//   const totalIncome = stats.totalFees + stats.totalIncome;

//   if (error) {
//     return (
//       <Container maxWidth="xl" sx={{ py: 2 }}>
//         <Alert severity="error" sx={{ mb: 2 }}>
//           Error loading dashboard: {error}
//         </Alert>
//         <Button variant="contained" onClick={fetchDashboardData}>
//           Retry
//         </Button>
//       </Container>
//     );
//   }

//   return (
//     <Container maxWidth="xl" sx={{ py: isMobile ? 2 : 3 }}>
//       {/* Header Section */}
//       <Box sx={{ mb: 3 }}>
//         <Box
//           sx={{
//             display: 'flex',
//             flexDirection: isMobile ? 'column' : 'row',
//             justifyContent: 'space-between',
//             alignItems: isMobile ? 'flex-start' : 'center',
//             gap: 2,
//             mb: 3
//           }}
//         >
//           <Typography variant={isMobile ? "h6" : "h5"} fontWeight={600}>
//             Dashboard Overview
//           </Typography>
//           <Box sx={{ 
//             display: 'flex', 
//             gap: 1, 
//             flexWrap: 'wrap',
//             width: isMobile ? '100%' : 'auto'
//           }}>
//             <FormControl 
//               size="small" 
//               sx={{ 
//                 minWidth: isMobile ? '48%' : 110,
//                 flexGrow: isMobile ? 1 : 0
//               }}
//             >
//               <InputLabel>Month</InputLabel>
//               <Select
//                 name="month"
//                 value={filters.month}
//                 onChange={handleFilterChange}
//                 label="Month"
//               >
//                 {months.map(month => (
//                   <MenuItem key={month} value={month}>
//                     {isMobile ? month.substring(0, 3) : month}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             <FormControl 
//               size="small" 
//               sx={{ 
//                 minWidth: isMobile ? '48%' : 110,
//                 flexGrow: isMobile ? 1 : 0
//               }}
//             >
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

//         {/* Stats Cards */}
//         <Grid container spacing={isMobile ? 1 : 2}>
//           <Grid item xs={6} sm={6} md={3}>
//             <StatCard
//               icon={<StudentsIcon />}
//               title="Total Students"
//               value={stats.totalStudents}
//               color="primary"
//             />
//           </Grid>
//           <Grid item xs={6} sm={6} md={3}>
//             <StatCard
//               icon={<FeesIcon />}
//               title="Fee Defaulters"
//               value={stats.feeDefaulters}
//               color="warning"
//             />
//           </Grid>
//           <Grid item xs={6} sm={6} md={3}>
//             <StatCard
//               icon={<IncomeIcon />}
//               title="Total Income"
//               value={`₹${totalIncome.toLocaleString()}`}
//               color="success"
//             />
//           </Grid>
//           <Grid item xs={6} sm={6} md={3}>
//             <StatCard
//               icon={<ExpendituresIcon />}
//               title="Total Expenses"
//               value={`₹${stats.totalExpenditures.toLocaleString()}`}
//               color="error"
//             />
//           </Grid>
//         </Grid>
//       </Box>

//       {/* Charts and Activities Section */}
//       <Grid container spacing={isMobile ? 1 : 2}>
//         <Grid item xs={12} md={8}>
//           <Paper sx={{ 
//             p: isMobile ? 1.5 : 2, 
//             height: '100%', 
//             boxShadow: 2,
//             borderRadius: 2
//           }}>
//             <Typography variant={isMobile ? "subtitle1" : "h6"} mb={2} fontWeight={600}>
//               {`Monthly Financial Overview (${filters.month} ${filters.year})`}
//             </Typography>
//             <MonthlyChart data={monthlyData} isMobile={isMobile} />
//           </Paper>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <Paper sx={{ 
//             p: isMobile ? 1.5 : 2, 
//             height: '100%', 
//             boxShadow: 2,
//             borderRadius: 2
//           }}>
//             <Typography variant={isMobile ? "subtitle1" : "h6"} mb={2} fontWeight={600}>
//               Recent Activities
//             </Typography>
//             <RecentActivities activities={recentActivities} isMobile={isMobile} />
//           </Paper>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// };

// export default Dashboard;













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
  Container,
  Alert,
  Button,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import {
  AccountTree as StudentsIcon,
  AttachMoney as FeesIcon,
  MoneyOff as ExpendituresIcon,
  TrendingUp as IncomeIcon
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';

// Import your actual services
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
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    month: new Date().toLocaleString('default', { month: 'long' }),
    year: new Date().getFullYear().toString()
  });

  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
        
      // Extract values from responses with proper error handling
      const totalStudents = studentsRes?.data?.total || 0;
      const feeDefaulters = defaultersRes?.data?.total || 0;
      
      // Handle different response structures
      const totalFeesValue = feesRes.data?.totalCollected || 
                            feesRes.data?.meta?.totalCollected || 0;
      
      const totalExpendituresValue = expendituresRes?.data?.meta?.totalAmount || 
                                   expendituresRes?.data?.totalAmount || 0;
      
      const totalIncomeValue = incomesRes?.data?.meta?.totalAmount || 
                             incomesRes?.data?.totalAmount || 0;

      setStats({
        totalStudents,
        feeDefaulters,
        totalFees: totalFeesValue,
        totalExpenditures: totalExpendituresValue,
        totalIncome: totalIncomeValue,
        loading: false
      });

      // Set monthly data with fallback
      setMonthlyData(monthlyRes?.data || []);

      // Create recent activities from all data sources with proper fallbacks
      const activities = [
        ...(studentsRes?.data?.students?.slice(0, 2) || []).map(student => ({
          type: 'student',
          title: `New student: ${student.name}`,
          timestamp: student.createdAt || new Date(),
          description: `Admission no: ${student.admissionNumber}`
        })),
        ...((feesRes?.data?.fees || feesRes?.data?.data?.fees || []).slice(0, 2).map(fee => ({
          type: 'fee',
          title: `Fee payment received`,
          timestamp: fee.createdAt || fee.date || new Date(),
          description: `Amount: ₹${fee.amount || fee.totalAmountPaid}`
        }))),
        ...((expendituresRes?.data?.expenditures || expendituresRes?.data?.data?.expenditures || []).slice(0, 2).map(expense => ({
          type: 'expense',
          title: `Expense recorded`,
          timestamp: expense.date || expense.createdAt || new Date(),
          description: `Amount: ₹${expense.amount}`
        }))),
        ...((incomesRes?.data?.incomes || incomesRes?.data?.data?.incomes || []).slice(0, 2).map(income => ({
          type: 'income',
          title: `Income recorded`,
          timestamp: income.date || income.createdAt || new Date(),
          description: `Amount: ₹${income.amount}`
        })))
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
    <Card sx={{ 
      height: '100%', 
      boxShadow: 2,
      borderRadius: 2,
      background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.1)} 0%, ${alpha(theme.palette[color].main, 0.05)} 100%)`,
      transition: 'transform 0.2s, box-shadow 0.2s',
      minHeight: isMobile ? 120 : 140,
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 4
      }
    }}>
      <CardContent sx={{ p: isMobile ? 1.5 : 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 1,
          flexDirection: isMobile ? 'column' : 'row',
          textAlign: isMobile ? 'center' : 'left'
        }}>
          {React.cloneElement(icon, {
            fontSize: isMobile ? 'medium' : 'large',
            color: color,
            sx: { 
              mr: isMobile ? 0 : 1, 
              mb: isMobile ? 0.5 : 0,
              background: alpha(theme.palette[color].main, 0.2),
              p: 1,
              borderRadius: '50%'
            }
          })}
          <Typography 
            variant={isMobile ? "body2" : "h6"} 
            color="textSecondary"
            sx={{ fontWeight: isMobile ? 500 : 600 }}
          >
            {title}
          </Typography>
        </Box>
        <Typography 
          variant={isMobile ? "h6" : "h5"} 
          component="div"
          sx={{ 
            textAlign: isMobile ? 'center' : 'left',
            fontWeight: 700,
            color: theme.palette[color].dark
          }}
        >
          {stats.loading ? <CircularProgress size={isMobile ? 20 : 24} /> : value}
        </Typography>
      </CardContent>
    </Card>
  );

  // Calculate derived values
  const totalIncome = stats.totalFees + stats.totalIncome;
  const netBalance = totalIncome - stats.totalExpenditures;

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 2 }}>
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
    <Container maxWidth="xl" sx={{ py: isMobile ? 2 : 3, px: isMobile ? 1 : 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: 2,
            mb: 3
          }}
        >
          <Typography variant={isMobile ? "h6" : "h5"} fontWeight={600}>
            Dashboard Overview
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            flexWrap: 'wrap',
            width: isMobile ? '100%' : 'auto'
          }}>
            <FormControl 
              size="small" 
              sx={{ 
                minWidth: isMobile ? '48%' : 110,
                flexGrow: isMobile ? 1 : 0
              }}
            >
              <InputLabel>Month</InputLabel>
              <Select
                name="month"
                value={filters.month}
                onChange={handleFilterChange}
                label="Month"
              >
                {months.map(month => (
                  <MenuItem key={month} value={month}>
                    {isMobile ? month.substring(0, 3) : month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl 
              size="small" 
              sx={{ 
                minWidth: isMobile ? '48%' : 110,
                flexGrow: isMobile ? 1 : 0
              }}
            >
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

        {/* Stats Cards */}
        <Grid container spacing={isMobile ? 1 : 2}>
          <Grid item xs={6} sm={6} md={3}>
            <StatCard
              icon={<StudentsIcon />}
              title="Total Students"
              value={stats.totalStudents}
              color="primary"
            />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <StatCard
              icon={<FeesIcon />}
              title="Fee Defaulters"
              value={stats.feeDefaulters}
              color="warning"
            />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <StatCard
              icon={<IncomeIcon />}
              title="Total Income"
              value={`₹${totalIncome.toLocaleString()}`}
              color="success"
            />
          </Grid>
          <Grid item xs={6} sm={6} md={3}>
            <StatCard
              icon={<ExpendituresIcon />}
              title="Total Expenses"
              value={`₹${stats.totalExpenditures.toLocaleString()}`}
              color="error"
            />
          </Grid>
        </Grid>
      </Box>

      {/* Charts and Activities Section */}
      <Grid container spacing={isMobile ? 1 : 2}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ 
            p: isMobile ? 1.5 : 2, 
            height: '100%', 
            boxShadow: 2,
            borderRadius: 2
          }}>
            <Typography variant={isMobile ? "subtitle1" : "h6"} mb={2} fontWeight={600}>
              {`Monthly Financial Overview (${filters.month} ${filters.year})`}
            </Typography>
            <MonthlyChart data={monthlyData} isMobile={isMobile} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: isMobile ? 1.5 : 2, 
            height: '100%', 
            boxShadow: 2,
            borderRadius: 2
          }}>
            <Typography variant={isMobile ? "subtitle1" : "h6"} mb={2} fontWeight={600}>
              Recent Activities
            </Typography>
            <RecentActivities activities={recentActivities} isMobile={isMobile} />
          </Paper>
        </Grid>
      </Grid>

      {/* Net Balance Card */}
      <Grid container spacing={isMobile ? 1 : 2} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <Card sx={{ 
            boxShadow: 2,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
          }}>
            <CardContent sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Net Balance
              </Typography>
              <Typography 
                variant="h4" 
                color={netBalance >= 0 ? 'success.main' : 'error.main'}
                fontWeight={700}
              >
                {stats.loading ? <CircularProgress size={28} /> : `₹${netBalance.toLocaleString()}`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
