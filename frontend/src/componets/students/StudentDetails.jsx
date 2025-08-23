

import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Typography,
  Divider,
  Chip,
  Avatar,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
  Button,
  Tooltip,
  Stack
} from '@mui/material';
import {
  Person,
  School,
  Email,
  Phone,
  Home,
  Work,
  DateRange,
  DirectionsBus,
  Event,
  Paid,
  Close,
  Call,
  Mail,
  WhatsApp
} from '@mui/icons-material';
import { formatDate } from '../../utils/formatDate';

const DetailItem = ({ icon, label, value, color = 'text.primary' }) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'flex-start', 
      mb: isMobile ? 1.5 : 2,
      gap: isMobile ? 1 : 2
    }}>
      <Avatar sx={{ 
        bgcolor: 'action.selected', 
        width: isMobile ? 28 : 32, 
        height: isMobile ? 28 : 32 
      }}>
        {React.cloneElement(icon, { fontSize: isMobile ? 'small' : 'medium' })}
      </Avatar>
      <Box sx={{ flex: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography 
          variant={isMobile ? 'body2' : 'body1'} 
          color={color}
          sx={{ wordBreak: 'break-word' }}
        >
          {value || 'N/A'}
        </Typography>
      </Box>
    </Box>
  );
};

const StatusChip = ({ status }) => {
  const theme = useTheme();
  const color = status === 'active' ? 'success' : 'error';
  return (
    <Chip
      label={status}
      color={color}
      size="small"
      sx={{ 
        fontWeight: 600,
        textTransform: 'capitalize',
        px: 1,
        borderRadius: 1
      }}
    />
  );
};

const StudentDetailsDialog = ({ open, onClose, data }) => { 
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  if (!data) return null;

  const {
    name,
    admissionNumber,
    email,
    fatherName,
    fatherOccupation,
    motherName,
    dob,
    contactNumber,
    parentContact,
    address,
    meansOfTransport,
    admissionFees,
    tuitionFees,
    dateOfJoining,
    activityStatus,
    inactivePeriods,
  } = data.student || {};
  
  const age = data.age;
  const { totalPaid, paidMonths, dueMonths, totalDueMonths } = data.feesSummary || {};

  const handleCall = () => {
    if (contactNumber) {
      window.open(`tel:${contactNumber}`, '_blank');
    }
  };

  const handleEmail = () => {
    if (email) {
      const subject = `Fee Reminder for ${name} (${admissionNumber})`;
      const body = `Dear 'Parent/Guardian',

This is a kind reminder regarding the pending coaching fees for ${name}.

Pending Months: ${dueMonths?.join(', ') || 'Not specified'}

Total Due Amount: ₹${totalDueMonths ? totalDueMonths * tuitionFees : '0'}

We kindly request you to clear the dues at your earliest convenience. Your support helps us continue providing the best training experience to all our students.

Thank you for your understanding and cooperation.
Warm regards,
GNCC Team`;

      window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
    }
  };

  const handleWhatsApp = () => {
    if (contactNumber) {
      const message = `
Dear Parent,
This is a kind reminder regarding the pending coaching fees for ${name}.

Pending Months: ${dueMonths?.join(', ') || 'Not specified'}
Total Due Amount: ₹${totalDueMonths ? totalDueMonths * tuitionFees : '0'}

We kindly request you to clear the dues at your earliest convenience. Your support helps us continue providing the best training experience to all our students.
Thank you for your understanding and cooperation.
Warm regards,
GNCC Team`;

      window.open(`https://wa.me/${contactNumber}?text=${encodeURIComponent(message)}`, '_blank');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      fullScreen={isMobile}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: isMobile ? 0 : theme.shape.borderRadius,
          overflowX: 'hidden',
          maxHeight: isMobile ? 'none' : 'calc(100vh - 64px)'
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        py: isMobile ? 1.5 : 2,
        position: 'relative',
        px: isMobile ? 2 : 3
      }}>
        <Box display="flex" alignItems="center">
          <School sx={{ mr: 1, fontSize: isMobile ? '1.25rem' : '1.5rem' }} />
          <Typography variant={isMobile ? 'subtitle1' : 'h6'} fontWeight="600">
            Student Details
          </Typography>
        </Box>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: isMobile ? 8 : 16,
            top: '50%',
            transform: 'translateY(-50%)',
            p: isMobile ? 0.5 : 1
          }}
        >
          <Close fontSize={isMobile ? 'small' : 'medium'} />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers sx={{ 
        p: isMobile ? 1.5 : 3,
        overflowY: 'auto'
      }}>
        {/* Header Section */}
        <Box sx={{ mb: 3 }}>
          <Stack 
            direction={isMobile ? 'column' : 'row'} 
            spacing={isMobile ? 1 : 3}
            alignItems={isMobile ? 'center' : 'flex-start'}
            sx={{ mb: 2 }}
          >
            <Avatar sx={{ 
              width: isMobile ? 60 : 72, 
              height: isMobile ? 60 : 72, 
              fontSize: isMobile ? 28 : 32,
              bgcolor: 'primary.main'
            }}>
              {name?.charAt(0)}
            </Avatar>
            
            <Box sx={{ 
              textAlign: isMobile ? 'center' : 'left',
              width: '100%'
            }}>
              <Typography 
                variant={isMobile ? 'h6' : 'h5'} 
                fontWeight="600"
                sx={{ mb: 0.5 }}
              >
                {name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {admissionNumber}
              </Typography>
              <Box sx={{ mt: 1, mb: isMobile ? 1.5 : 2 }}>
                <StatusChip status={activityStatus} />
              </Box>
              
{/* Action Buttons */}
<Stack 
  direction="row" 
  spacing={1}
  justifyContent={isMobile ? 'center' : 'flex-start'}
  flexWrap="wrap"
  useFlexGap
>
  <Tooltip 
    title={!contactNumber ? "No parent contact number available" : "Call parent"} 
    arrow
  >
    <span> {/* Wrap button for tooltip to work when disabled */}
      <Button
        variant="contained"
        color="primary"
        size={isMobile ? 'small' : 'medium'}
        startIcon={<Call />}
        onClick={handleCall}
        disabled={!contactNumber}
        sx={{ 
          minWidth: 'max-content',
          px: isMobile ? 1 : 2
        }}
      >
        {isMobile ? '' : 'Call'}
      </Button>
    </span>
  </Tooltip>
  
  <Tooltip title={!email ? "No email available" : "Send email"} arrow>
    <span>
      <Button
        variant="outlined"
        color="primary"
        size={isMobile ? 'small' : 'medium'}
        startIcon={<Mail />}
        onClick={handleEmail}
        disabled={!email}
        sx={{ 
          minWidth: 'max-content',
          px: isMobile ? 1 : 2
        }}
      >
        {isMobile ? '' : 'Email'}
      </Button>
    </span>
  </Tooltip>
  
  <Tooltip 
    title={!contactNumber ? "No parent contact number available" : "WhatsApp message"} 
    arrow
  >
    <span>
      <Button
        variant="contained"
        size={isMobile ? 'small' : 'medium'}
        startIcon={<WhatsApp />}
        onClick={handleWhatsApp}
        disabled={!contactNumber}
        sx={{ 
          minWidth: 'max-content',
          px: isMobile ? 1 : 2,
          bgcolor: '#25D366',
          '&:hover': { bgcolor: '#128C7E' }
        }}
      >
        {isMobile ? '' : 'WhatsApp'}
      </Button>
    </span>
  </Tooltip>
</Stack>
            </Box>
          </Stack>
        </Box>

        {/* Main Content */}
        <Grid container spacing={isMobile ? 1.5 : 3}>
          {/* Personal Info Column */}
          <Grid item xs={12} md={6}>
            <Typography 
              variant={isMobile ? 'body1' : 'subtitle1'} 
              fontWeight="600" 
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Person sx={{ mr: 1, fontSize: isMobile ? '1rem' : '1.25rem' }} />
              Personal Information
            </Typography>
            
            <DetailItem 
              icon={<DateRange />} 
              label="Date of Birth" 
              value={dob && formatDate(dob)} 
            />
            <DetailItem 
              icon={<Typography sx={{ fontWeight: 'bold' }}>Age</Typography>} 
              label="Age" 
              value={age} 
            />
            <DetailItem 
              icon={<Email />} 
              label="Email" 
              value={email} 
            />
            <DetailItem 
              icon={<Phone />} 
              label="Contact" 
              value={contactNumber} 
            />
            <DetailItem 
              icon={<Home />} 
              label="Address" 
              value={address} 
            />
          </Grid>

          {/* Family Info Column */}
          <Grid item xs={12} md={6}>
            <Typography 
              variant={isMobile ? 'body1' : 'subtitle1'} 
              fontWeight="600" 
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Work sx={{ mr: 1, fontSize: isMobile ? '1rem' : '1.25rem' }} />
              Family Information
            </Typography>
            
            <DetailItem 
              icon={<Person />} 
              label="Father" 
              value={`${fatherName}${fatherOccupation ? ` (${fatherOccupation})` : ''}`} 
            />
            <DetailItem 
              icon={<Person />} 
              label="Mother" 
              value={motherName} 
            />
            <DetailItem 
              icon={<Phone />} 
              label="Parent Contact" 
              value={parentContact} 
            />
            <DetailItem 
              icon={<DirectionsBus />} 
              label="Transport" 
              value={meansOfTransport} 
            />
            <DetailItem 
              icon={<Event />} 
              label="Date of Joining" 
              value={dateOfJoining && formatDate(dateOfJoining)} 
            />
          </Grid>

          {/* Fees Section */}
          <Grid item xs={12}>
            <Divider sx={{ my: isMobile ? 1.5 : 2 }} />
            <Typography 
              variant={isMobile ? 'body1' : 'subtitle1'} 
              fontWeight="600" 
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Paid sx={{ mr: 1, fontSize: isMobile ? '1rem' : '1.25rem' }} />
              Fee Summary
            </Typography>
            
            <Grid container spacing={isMobile ? 1 : 2} sx={{ mb: isMobile ? 1.5 : 2 }}>
              {[
                { label: 'Total Paid', value: `₹${totalPaid || 0}`, color: 'success.light' },
                { label: 'Due Months', value: totalDueMonths || 0, color: 'error.light' },
                { label: 'Monthly Fee', value: `₹${tuitionFees || 0}`, color: 'warning.light' },
                { label: 'Total Due', value: `₹${totalDueMonths ? totalDueMonths * tuitionFees : 0}`, color: 'info.light' }
              ].map((item, index) => (
                <Grid item xs={6} sm={6} md={3} key={index}>
                  <Box sx={{ 
                    p: isMobile ? 1 : 1.5, 
                    borderRadius: 2, 
                    bgcolor: item.color, 
                    textAlign: 'center',
                    height: '100%'
                  }}>
                    <Typography variant={isMobile ? 'caption' : 'subtitle2'}>
                      {item.label}
                    </Typography>
                    <Typography variant={isMobile ? 'body1' : 'h6'} fontWeight="700">
                      {item.value}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={isMobile ? 1 : 2}>
              <Grid item xs={12} sm={6}>
                <Typography variant={isMobile ? 'caption' : 'subtitle2'} gutterBottom>
                  Paid Months
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {paidMonths?.length ? (
                    paidMonths.map((month, i) => (
                      <Chip 
                        key={i} 
                        label={month} 
                        color="success"
                        size={isMobile ? 'small' : 'medium'}
                        sx={{ fontWeight: 500 }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No payment records
                    </Typography>
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant={isMobile ? 'caption' : 'subtitle2'} gutterBottom>
                  Due Months
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {dueMonths?.length ? (
                    dueMonths.map((month, i) => (
                      <Chip 
                        key={i} 
                        label={month} 
                        color="error"
                        size={isMobile ? 'small' : 'medium'}
                        sx={{ fontWeight: 500 }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No dues
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Grid>

          {/* Inactive Periods */}
          {inactivePeriods?.length > 0 && (
            <Grid item xs={12}>
              <Divider sx={{ my: isMobile ? 1.5 : 2 }} />
              <Typography 
                variant={isMobile ? 'body1' : 'subtitle1'} 
                fontWeight="600" 
                gutterBottom
              >
                Inactive Periods
              </Typography>
              <Stack spacing={1}>
                {inactivePeriods.map((period, i) => (
                  <Box key={i} sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: isMobile ? 1 : 1.5,
                    borderRadius: 1,
                    bgcolor: 'action.hover',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? 0.5 : 1,
                    textAlign: isMobile ? 'center' : 'left'
                  }}>
                    <Typography variant="body2">
                      {period.from && formatDate(period.from)}
                    </Typography>
                    <Typography variant="body2">
                      to
                    </Typography>
                    <Typography variant="body2">
                      {period.to && formatDate(period.to)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Grid>
          )}
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDetailsDialog;