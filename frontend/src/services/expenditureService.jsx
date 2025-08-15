import api from './api';

// Create a new expenditure
export const createExpenditure = async (expenditureData) => {
  try {
    const response = await api.post('/expenditures', expenditureData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to create expenditure'
    };
  }
};

// Get all expenditures (with pagination and filtering)
export const getExpenditures = async (params = {}) => {
  try {
    const response = await api.get('/expenditures/all', { params });
    return { success:true,data:response.data};
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch expenditures'
    };
  }
};

// Get a specific expenditure by ID
export const getExpenditureById = async (id) => {
  try {
    const response = await api.get(`/expenditures/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Expenditure not found'
    };
  }
};

// Update an expenditure
export const updateExpenditure = async (id, expenditureData) => {
  try {
    const response = await api.put(`/expenditures/${id}`, expenditureData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update expenditure'
    };
  }
};

// Delete an expenditure
export const deleteExpenditure = async (id) => {
  try {
    await api.delete(`/expenditures/${id}`);
    return { success: true, message: 'Expenditure deleted successfully' };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete expenditure'
    };
  }
};
