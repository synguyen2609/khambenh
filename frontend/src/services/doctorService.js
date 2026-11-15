import api from './api';

export const doctorService = {
  // Get all doctors
  getAllDoctors: async () => {
    const response = await api.get('/doctors');
    return response.data;
  },

  // Get doctor's appointments
  getMyAppointments: async (params) => {
    const response = await api.get('/doctors/me/appointments', { params });
    return response.data;
  },

  // Search patients
  searchPatients: async (params) => {
    const response = await api.get('/doctors/patients', { params });
    return response.data;
  },

  // Get patient by ID
  getPatientById: async (patientId) => {
    const response = await api.get(`/doctors/patients/${patientId}`);
    return response.data;
  },

  // Update patient
  updatePatient: async (patientId, data) => {
    const response = await api.put(`/doctors/patients/${patientId}`, data);
    return response.data;
  }
};



