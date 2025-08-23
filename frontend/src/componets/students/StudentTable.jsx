import React from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, TablePagination, Checkbox, Paper,
  IconButton, Tooltip, useMediaQuery, Chip
} from '@mui/material';
import { Edit, Delete, Visibility, Pause, PlayArrow } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { formatDate } from '../../utils/formatDate';
import MenuDropdown from './MenuDropdown';

const StudentTable = ({ 
  students, 
  onEdit, 
  onDelete, 
  onView, 
  onBulkSelect,
  onMarkInactive,
  onReactivate,
  page,
  rowsPerPage,
  totalCount,
  onPageChange,
  onRowsPerPageChange
}) => {
  const [selectedIds, setSelectedIds] = React.useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSelectAll = (event) => {
    const allIds = event.target.checked ? students.map(s => s._id) : [];
    setSelectedIds(allIds);
    onBulkSelect?.(allIds);
  };

  const handleSelectOne = (id) => {
    const newSelected = selectedIds.includes(id)
      ? selectedIds.filter(sid => sid !== id)
      : [...selectedIds, id];
    setSelectedIds(newSelected);
    onBulkSelect?.(newSelected);
  };

  const handleChangePage = (_, newPage) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    onRowsPerPageChange(parseInt(event.target.value, 10));
  };

  return (
    <Paper sx={{ mt: 2, mb: 6, width: '100%' }}>
      <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
        <Table
          size="small"
          stickyHeader
          sx={{
            minWidth: isMobile ? '100%' : 800,
            '& .MuiTableCell-root': {
              px: isMobile ? 1 : 2,
              py: isMobile ? 0.5 : 1,
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              whiteSpace: 'nowrap',
            },
          }}
        >
          <TableHead>
            <TableRow>
              {!isMobile && (
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.length === students.length && students.length > 0}
                    indeterminate={selectedIds.length > 0 && selectedIds.length < students.length}
                    onChange={handleSelectAll}
                    size="small"
                  />
                </TableCell>
              )}
              {!isMobile && <TableCell><strong>#</strong></TableCell>}
              <TableCell><strong>Name</strong></TableCell>
              {!isMobile && <TableCell><strong>Admission No</strong></TableCell>}
              {!isMobile && <TableCell><strong>DOB</strong></TableCell>}
              {!isMobile && <TableCell><strong>Joining Date</strong></TableCell>}
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>isDefaulter</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">No students found.</TableCell>
              </TableRow>
            ) : (
              students.map((student, index) => (
                
                <TableRow key={student._id} hover>
                  {!isMobile && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedIds.includes(student._id)}
                        onChange={() => handleSelectOne(student._id)}
                        size="small"
                      />
                    </TableCell>
                  )}
                  {!isMobile && (
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  )}
                  <TableCell>{student.name}</TableCell>
                  {!isMobile && <TableCell>{student.admissionNumber}</TableCell>}
                  {!isMobile && <TableCell>{formatDate(student.dob)}</TableCell>}
                  {!isMobile && <TableCell>{formatDate(student.dateOfJoining)}</TableCell>}
                  <TableCell>
                    <Chip
                      label={student.activityStatus || 'active'}
                      color={student.activityStatus === 'inactive' ? 'warning' : 'success'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>

                  <TableCell sx={{ color:student.totalDueMonths>0  ? 'error.main' : 'success.main' }}>
                 {student.totalDueMonths>0? `Yes – ${student.totalDueMonths}M due`: 'No'}
                 </TableCell>


                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    {isMobile ? (
                      <MenuDropdown 
                        student={student}
                        onView={onView}
                        onEdit={onEdit}
                        onMarkInactive={onMarkInactive}
                        onReactivate={onReactivate}
                        onDelete={onDelete}
                      />
                    ) : (
                      <>
                        {onView && (
                          <Tooltip title="View">
                            <IconButton onClick={() => onView(student._id)} size="small">
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {onEdit && (
                          <Tooltip title="Edit">
                            <IconButton onClick={() => onEdit(student)} size="small">
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {student.activityStatus === 'active' ? (
                          <Tooltip title="Set Inactive">
                            <IconButton 
                              onClick={() => onMarkInactive(student)} 
                              size="small"
                              color="warning"
                            >
                              <Pause fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Reactivate">
                            <IconButton 
                              onClick={() => onReactivate(student._id)} 
                              size="small"
                              color="success"
                            >
                              <PlayArrow fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {onDelete && (
                          <Tooltip title="Delete">
                            <IconButton onClick={() => onDelete(student._id)} size="small" color="error">
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        sx={{
          '& .MuiTablePagination-toolbar': {
            px: isMobile ? 1 : 2,
            py: isMobile ? 0.5 : 1,
            minHeight: isMobile ? '40px' : '56px',
            fontSize: isMobile ? '0.75rem' : '0.875rem',
            gap: isMobile ? 1 : 2,
          },
          '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
            fontSize: isMobile ? '0.75rem' : '0.875rem',
          },
          '& .MuiInputBase-root': {
            fontSize: isMobile ? '0.75rem' : '0.875rem',
          },
          '& .MuiTablePagination-actions': {
            gap: isMobile ? 0.5 : 1,
          },
        }}
      />
    </Paper>
  );
};

export default StudentTable;
