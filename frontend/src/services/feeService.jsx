import api from './api';

// Create a new fee record
export const createFee = async (feeData) => {
  try {
    const response = await api.post('/fees/submit', feeData);
    const { success, message, fee } = response.data;
    return { success, message, fee };
  } catch (error) {
    console.error('createFee API error:', error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to create fee record'
    };
  }
};

// Get all fees with pagination and filtering
export const getFees = async (params = {}) => {

  
  try {
    const response = await api.get('/fees/by/monthAndYear/all', { params });
    console.log(response)
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch fees'
    };
  }
};

// Get fee by ID
export const getFeeById = async (id) => {
  try {
    const response = await api.get(`/fees/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Fee record not found'
    };
  }
};

// Update fee record
export const updateFee = async (id, feeData) => {
  try {
    const response = await api.put(`/fees/${id}`, feeData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update fee record'
    };
  }
};

// Delete fee record
export const deleteFee = async (id) => {
  try {
    await api.delete(`/fees/${id}`);
    return { success: true, message: 'Fee record deleted successfully' };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete fee record'
    };
  }
};

// Get fee history for a student
export const getFeeHistoryByStudent = async (studentId) => {
  try {
    const response = await api.get(`/fees/student/${studentId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch fee history'
    };
  }
};

// Get fee summary
export const getFeeSummary = async (studentId) => {
  try {
    const response = await api.get(`/fees/summary/${studentId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch fee summary'
    };
  }
};

// View fee slip
export const viewFeeSlip = async (id) => {
  try {
    const response = await api.get(`/fees/${id}/slip/view`, {
      params: { admissionNumber, month, year },
      responseType: 'blob'
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to download fee slip'
    };
  }
};

// Resend fee slip email
export const resendFeeSlipEmail = async (admissionNumber, month, year) => {
  try {
    const response = await api.post('/fees/resend-slip', {
      admissionNumber, month, year
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to resend fee slip'
    };
  }
};

// Generate fee slip
export const generateFeeSlip = async (feeId) => {
  try {
    const response = await api.post(`/fees/generate-slip/${feeId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to generate fee slip'
    };
  }
};

// Filter defaulters
export const filterByFeeDefaulter = async (defaulterStatus, params = {}) => {
  try {
    const response = await api.get(`/students/defaulters/${defaulterStatus}`, { params });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to filter defaulters'
    };
  }
};

// Monthly fee report
export const getMonthlyFeeReport = async (month, year) => {
  try {
    const response = await api.get('/fees/monthly-report', {
      params: { month, year }
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to generate monthly report'
    };
  }
};
