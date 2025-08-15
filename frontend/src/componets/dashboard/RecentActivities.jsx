// components/dashboard/RecentActivities.js
import React from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemAvatar, 
  Avatar, 
  ListItemText,
  Divider,
  Chip
} from '@mui/material';
import {
  School as StudentIcon,
  Receipt as FeeIcon,
  MoneyOff as ExpenseIcon,
  AttachMoney as IncomeIcon,
  Event as DateIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

const iconMap = {
  student: <StudentIcon color="primary" />,
  fee: <FeeIcon color="success" />,
  expense: <ExpenseIcon color="error" />,
  income: <IncomeIcon color="info" />
};

const RecentActivities = ({ activities }) => {
  const getActivityText = (activity) => {
    if (activity.date) {
      return format(new Date(activity.date), 'MMM d, yyyy');
    }
    if (activity.dateOfJoining) {
      return `Joined on ${format(new Date(activity.dateOfJoining), 'MMM d, yyyy')}`;
    }
    if (activity.datePaid) {
      return `Paid on ${format(new Date(activity.datePaid), 'MMM d, yyyy')}`;
    }
    return '';
  };

  const getActivityType = (activity) => {
    if (activity.admissionNumber) return 'student';
    if (activity.totalAmountPaid) return 'fee';
    if (activity.source) return 'income';
    return 'expense';
  };

  return (
    <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
      <List sx={{ width: '100%' }}>
        {activities.slice(0, 8).map((activity, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start" sx={{ py: 1.5 }}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'background.paper' }}>
                  {iconMap[getActivityType(activity)]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                      {activity.name || activity.description || activity.source || 'New Activity'}
                    </Typography>
                    {activity.amount && (
                      <Chip 
                        label={`₹${activity.amount.toLocaleString()}`} 
                        size="small"
                        color={getActivityType(activity) === 'expense' ? 'error' : 'success'}
                        sx={{ fontWeight: 600 }}
                      />
                    )}
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <DateIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {getActivityText(activity)}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
            {index < activities.length - 1 && (
              <Divider variant="inset" component="li" sx={{ ml: 7 }} />
            )}
          </React.Fragment>
        ))}
        {activities.length === 0 && (
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ p: 3, textAlign: 'center' }}
          >
            No recent activities found for the selected period
          </Typography>
        )}
      </List>
    </Box>
  );
};

export default RecentActivities;