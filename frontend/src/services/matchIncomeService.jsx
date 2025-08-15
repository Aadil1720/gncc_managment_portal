import api from './api';

// Create a new match income
export const createMatchIncome = async (incomeData) => {
  try {
    const response = await api.post('/match-incomes', incomeData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to create match income'
    };
  }
};

// Get all match incomes (with pagination and filtering)
export const getMatchIncomes = async (params = {}) => {
  try {
    const response = await api.get('/match-incomes', { params });
      return { success:true,data:response.data};
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to fetch match incomes'
    };
  }
};

// Get match income by ID
export const getMatchIncomeById = async (id) => {
  try {
    const response = await api.get(`/match-incomes/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Match income not found'
    };
  }
};

// Update match income
export const updateMatchIncome = async (id, incomeData) => {
  try {
    const response = await api.put(`/match-incomes/${id}`, incomeData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update match income'
    };
  }
};

// Delete match income
export const deleteMatchIncome = async (id) => {
  try {
    await api.delete(`/match-incomes/${id}`);
    return { success: true, message: 'Match income deleted successfully' };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to delete match income'
    };
  }
};
