// import React from 'react';
// import {
//   Grid,
//   TextField,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   useMediaQuery,
//   useTheme,
// } from '@mui/material';

// const SearchAndFilter = ({
//   searchTerm,
//   setSearchTerm,
//   sortField,
//   setSortField,
//   sortOrder,
//   setSortOrder,
//    statusFilter,
//   setStatusFilter // Add this new prop
// }) => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

//   const handleSearchChange = (e) => setSearchTerm(e.target.value);
//   const handleSortFieldChange = (e) => setSortField(e.target.value);
//   const handleSortOrderChange = (e) => setSortOrder(e.target.value);

//   const inputProps = isMobile
//     ? {
//         sx: { fontSize: '0.75rem' },
//         InputLabelProps: { sx: { fontSize: '0.75rem' } },
//         InputProps: { sx: { fontSize: '0.75rem' } },
//       }
//     : {};

//   return (
//     <Grid
//       container
//       spacing={isMobile ? 1 : 2}
//       alignItems="center"
//       sx={{ my: isMobile ? 1 : 2 }}
//     >
//       <Grid item xs={12} sm={6} md={4}>
//         <TextField
//           fullWidth
//           label="Search by Name or Admission No"
//           value={searchTerm}
//           onChange={handleSearchChange}
//           variant="outlined"
//           size={isMobile ? 'small' : 'medium'}
//           {...inputProps}
//         />
//       </Grid>

//       <Grid item xs={6} sm={3} md={2}>
//         <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
//           <InputLabel sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>Sort By</InputLabel>
//           <Select
//             value={sortField}
//             onChange={handleSortFieldChange}
//             label="Sort By"
//             sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}
//           >
//             <MenuItem value="">None</MenuItem>
//             <MenuItem value="name">Name</MenuItem>
//             <MenuItem value="admissionNumber">Admission</MenuItem>
//             <MenuItem value="dateOfJoining">Joining Date</MenuItem>
//           </Select>
//         </FormControl>
//       </Grid>

//       <Grid item xs={6} sm={3} md={2}>
//         <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
//           <InputLabel sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>Order</InputLabel>
//           <Select
//             value={sortOrder}
//             onChange={handleSortOrderChange}
//             label="Order"
//             sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}
//           >
//             <MenuItem value="">None</MenuItem>
//             <MenuItem value="asc">Ascending</MenuItem>
//             <MenuItem value="desc">Descending</MenuItem>
//           </Select>
//         </FormControl>
//       </Grid>

//       <Grid item xs={6} sm={3} md={2}>
//       <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
//         <InputLabel sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>Status</InputLabel>
//         <Select
//           value={statusFilter}
//           onChange={(e) => setStatusFilter(e.target.value)}
//           label="Status"
//            sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}
//         >
//           <MenuItem value="active">Active</MenuItem>
//           <MenuItem value="inactive">Inactive</MenuItem>
//         </Select>
//       </FormControl>
//       </Grid>
//     </Grid>
//   );
// };

// export default SearchAndFilter;
import React from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';

const SearchAndFilter = ({
  searchTerm,
  setSearchTerm,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
  statusFilter,
  setStatusFilter
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortFieldChange = (e) => {
    setSortField(e.target.value);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const inputProps = isMobile
    ? {
        sx: { fontSize: '0.75rem' },
        InputLabelProps: { sx: { fontSize: '0.75rem' } },
        InputProps: { sx: { fontSize: '0.75rem' } },
      }
    : {};

  return (
    <Grid
      container
      spacing={isMobile ? 1 : 2}
      alignItems="center"
      sx={{ my: isMobile ? 1 : 2 }}
    >
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          fullWidth
          label="Search by Name or Admission No"
          value={searchTerm}
          onChange={handleSearchChange}
          variant="outlined"
          size={isMobile ? 'small' : 'medium'}
          {...inputProps}
        />
      </Grid>

      <Grid item xs={6} sm={3} md={2}>
        <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
          <InputLabel sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>Sort By</InputLabel>
          <Select
            value={sortField}
            onChange={handleSortFieldChange}
            label="Sort By"
            sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="admissionNumber">Admission</MenuItem>
            <MenuItem value="dateOfJoining">Joining Date</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={6} sm={3} md={2}>
        <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
          <InputLabel sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>Order</InputLabel>
          <Select
            value={sortOrder}
            onChange={handleSortOrderChange}
            label="Order"
            sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={6} sm={3} md={2}>
        <FormControl fullWidth size={isMobile ? 'small' : 'medium'}>
          <InputLabel sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={handleStatusChange}
            label="Status"
            sx={{ fontSize: isMobile ? '0.75rem' : 'inherit' }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default SearchAndFilter;
