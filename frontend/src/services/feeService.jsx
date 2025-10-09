import api from './api';
import { pdf } from '@react-pdf/renderer';
import FeeSlipDocument from '../utils/FeeSlipDocument';

// ==================== FRONTEND PDF GENERATION FUNCTIONS ====================

// Generate PDF using React-PDF
export const generateFeeSlipReactPDF = async (feeData, studentData) => {
  try {
    const blob = await pdf(<FeeSlipDocument feeData={feeData} studentData={studentData} />).toBlob();
    return { success: true, blob };
  } catch (error) {
    console.error('React PDF generation error:', error);
    return { 
      success: false, 
      error: 'Failed to generate PDF' 
    };
  }
};

// View PDF in new tab
export const viewFeeSlipFrontend = async (feeData, studentData) => {
  try {
    const result = await generateFeeSlipReactPDF(feeData, studentData);
    
    if (!result.success) {
      return result;
    }

    const pdfUrl = URL.createObjectURL(result.blob);
    window.open(pdfUrl, '_blank');
    
    // Clean up after some time
    setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);

    return { success: true, message: 'Fee slip opened in new tab' };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to view fee slip'
    };
  }
};

// Download PDF
export const downloadFeeSlipFrontend = async (feeData, studentData, filename = null) => {
  try {
    const result = await generateFeeSlipReactPDF(feeData, studentData);
    
    if (!result.success) {
      return result;
    }

    const defaultFilename = `FeeReceipt_${studentData.name}_${feeData.month}_${feeData.year}.pdf`;
    const downloadFilename = filename || defaultFilename;
    
    // Create download link
    const url = URL.createObjectURL(result.blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    return { success: true, message: 'Fee slip downloaded' };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to download fee slip'
    };
  }
};

// Share via WhatsApp with direct number support
export const shareFeeSlipOnWhatsAppFrontend = async (feeData, studentData) => {
  try {
    const message = `Fee Receipt for ${studentData.name}
📅 Month: ${feeData.month} ${feeData.year}
💰 Amount Paid: ₹${feeData.totalAmountPaid?.toLocaleString() || '0'}
    
Generated from Greater Noida Cricket Club Management System`;

    let whatsappUrl;
    
    // If parent contact number is available, open WhatsApp directly with that number
    if (studentData.parentContact) {
      // Clean the phone number - remove any non-digit characters
      const cleanPhone = studentData.parentContact.replace(/\D/g, '');
      
      // Format: https://wa.me/<number>?text=<message>
      whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    } else {
      // Fallback to regular WhatsApp share
      whatsappUrl = `https://wa.intent/?text=${encodeURIComponent(message)}`;
    }
    
    window.open(whatsappUrl, '_blank');

    return { 
      success: true, 
      message: studentData.parentContact ? 
        `Opening WhatsApp for ${studentData.parentContact}` : 
        'Opening WhatsApp...' 
    };
  } catch (error) {
    return {
      success: false,
      error: 'Failed to share fee slip'
    };
  }
};

// Frontend Fee Slip Manager
export const FrontendFeeSlipManager = {
  // Generate and view slip immediately
  async viewSlip(feeData, studentData) {
    return await viewFeeSlipFrontend(feeData, studentData);
  },

  // Generate and download slip immediately
  async downloadSlip(feeData, studentData, filename = null) {
    return await downloadFeeSlipFrontend(feeData, studentData, filename);
  },

  // Share slip via WhatsApp
  async shareOnWhatsApp(feeData, studentData) {
    return await shareFeeSlipOnWhatsAppFrontend(feeData, studentData);
  },

  // Handle fee creation with instant slip generation
  async createFeeWithInstantSlip(feeData, studentData, onSuccess = null) {
    try {
      // Create fee record first
      const createResponse = await createFee(feeData);
      
      if (!createResponse.success) {
        return createResponse;
      }

      // Immediately generate slip on frontend
      if (onSuccess) {
        onSuccess('slip_ready', 'Fee submitted! Slip is ready for download.');
      }

      return {
        success: true,
        fee: createResponse.fee,
        slipStatus: 'ready',
        message: 'Fee submitted successfully. Slip can be generated instantly.'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to process fee submission'
      };
    }
  }
};

// ==================== BACKEND API FUNCTIONS ====================

// Create a new fee record
export const createFee = async (feeData) => {
  try {
    const response = await api.post('/fees/submit', feeData);
    const { success, message, fee } = response.data;
    return { 
      success, 
      message, 
      fee
    };
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

// Bulk fee operations
export const createBulkFees = async (fees) => {
  try {
    const response = await api.post('/fees/bulk', { fees });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to create bulk fees'
    };
  }
};

// ==================== EXPORT DEFAULT ====================

export default {
  // Frontend PDF Generation (Primary)
  generateFeeSlipReactPDF,
  viewFeeSlipFrontend,
  downloadFeeSlipFrontend,
  shareFeeSlipOnWhatsAppFrontend,
  FrontendFeeSlipManager,
  
  // Core Fee Operations
  createFee,
  getFees,
  getFeeById,
  updateFee,
  deleteFee,
  getFeeHistoryByStudent,
  getFeeSummary,
  createBulkFees
};