import api from './api';

const studentService = {
  getStudents: async (params) => {
    try {
      const response = await api.get('/students/all', { params });
      return { success: response.data.success, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch students'
      };
    }
  },

  getStudentById: async (id) => {
    try {
      const response = await api.get(`/students/${id}`);
      return { success: response.data.success, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch student by ID'
      };
    }
  },

  getStudentDecriptionById: async (id) => {
    try {
      const response = await api.get(`/students/description/${id}`);
      return { success: response.data.success, data: response.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch student description'
      };
    }
  },

  createStudent: async (data) => {
    try {
      const response = await api.post('/students/create', data);
      return { success: response.data.success, data: response.data.data };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create student'
      };
    }
  },

  updateStudent: async (id, data) => {
    try {
      const response = await api.put(`/students/update/${id}`, data);
      return { success: response.data.success, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update student'
      };
    }
  },

  deleteStudent: async (id) => {
    try {
      const response = await api.delete(`/students/delete/${id}`);
      return { success: response.data.success, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete student'
      };
    }
  },

  getFeeDefaulters: async (defaulter, params) => {
    try {
      const response = await api.get(`/students/defaulters/${defaulter}`, { params });
      return { success: response.data.success, data: response.data};
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch fee defaulters'
      };
    }
  },

  // Inactive status management methods
  setInactivePeriod: async (id, data) => {
    try {
      const response = await api.post(`/students/${id}/set-inactive`, data);
      console.log(response);
      return { success: response.data.success, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to set inactive period'
      };
    }
  },

  reactivateStudent: async (id) => {
    try {
      const response = await api.post(`/students/${id}/reactivate`);
      return { success: response.data.success, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to reactivate student'
      };
    }
  },

  getInactivePeriods: async (id) => {
    try {
      const response = await api.get(`/students/${id}/inactive-periods`);
      return { 
        success: response.data.success, 
        data: response.data.data,
        inactivePeriods: response.data.inactivePeriods
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get inactive periods'
      };
    }
  },

  removeInactivePeriod: async (studentId, periodId) => {
    try {
      const response = await api.delete(`/students/${studentId}/inactive-periods/${periodId}`);
      return { 
        success: response.data.success, 
        message: response.data.message,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to remove inactive period'
      };
    }
  },

  getMonthlyReport: async (params) => {
    try {
      const response = await api.get('/reports/monthly', { params });
      return { success: response.data.success, data: response.data.data };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to fetch monthly report'
      };
    }
  }
};

export default studentService;