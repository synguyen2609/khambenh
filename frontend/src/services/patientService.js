import api from './api';

export const patientService = {
  // Get patient profile
  getMyProfile: async () => {
    const response = await api.get('/patients/me');
    return response.data;
  },

  // Update patient profile
  updateMyProfile: async (data) => {
    const response = await api.put('/patients/me', data);
    return response.data;
  },

  // Get patient appointments
  getMyAppointments: async (params) => {
    const response = await api.get('/patients/me/appointments', { params });
    return response.data;
  },

  // Get patient medical records
  getMyMedicalRecords: async () => {
    const response = await api.get('/patients/me/medical-records');
    return response.data;
  }
};



