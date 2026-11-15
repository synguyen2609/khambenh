import api from './api';

export const medicalRecordService = {
  // Get patient medical records (doctor)
  getPatientMedicalRecords: async (patientId) => {
    const response = await api.get(`/medical-records/patient/${patientId}`);
    return response.data;
  },

  // Get medical record by ID
  getMedicalRecordById: async (recordId) => {
    const response = await api.get(`/medical-records/${recordId}`);
    return response.data;
  },

  // Create medical record
  createMedicalRecord: async (data) => {
    const response = await api.post('/medical-records', data);
    return response.data;
  },

  // Update medical record
  updateMedicalRecord: async (recordId, data) => {
    const response = await api.put(`/medical-records/${recordId}`, data);
    return response.data;
  },

  // Delete medical record
  deleteMedicalRecord: async (recordId) => {
    const response = await api.delete(`/medical-records/${recordId}`);
    return response.data;
  }
};



