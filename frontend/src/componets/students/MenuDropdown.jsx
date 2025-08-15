import { useState } from 'react';
import { 
  IconButton, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText,
  Tooltip
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { 
  Visibility, 
  Edit, 
  Pause, 
  PlayArrow, 
  Delete 
} from '@mui/icons-material';

const MenuDropdown = ({ 
  student, 
  onView, 
  onEdit, 
  onMarkInactive, 
  onReactivate, 
  onDelete 
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Actions">
        <IconButton
          onClick={handleClick}
          size="small"
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {onView && (
          <MenuItem onClick={() => onView(student._id)}>
            <ListItemIcon>
              <Visibility fontSize="small" />
            </ListItemIcon>
            <ListItemText>View</ListItemText>
          </MenuItem>
        )}
        {onEdit && (
          <MenuItem onClick={() => onEdit(student)}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
        )}
        {student.activityStatus === 'active' ? (
          <MenuItem onClick={() => onMarkInactive(student)}>
            <ListItemIcon>
              <Pause fontSize="small" color="warning" />
            </ListItemIcon>
            <ListItemText>Set Inactive</ListItemText>
          </MenuItem>
        ) : (
          <MenuItem onClick={() => onReactivate(student._id)}>
            <ListItemIcon>
              <PlayArrow fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>Reactivate</ListItemText>
          </MenuItem>
        )}
        {onDelete && (
          <MenuItem onClick={() => onDelete(student._id)}>
            <ListItemIcon>
              <Delete fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};
export default MenuDropdown;