import api from './api';

export const adminService = {
  // Dashboard stats
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Doctor management
  createDoctor: async (data) => {
    const response = await api.post('/admin/doctors', data);
    return response.data;
  },

  getAllDoctors: async () => {
    const response = await api.get('/admin/doctors');
    return response.data;
  },

  updateDoctor: async (doctorId, data) => {
    const response = await api.put(`/admin/doctors/${doctorId}`, data);
    return response.data;
  },

  // Appointment management
  getAllAppointments: async (params) => {
    const response = await api.get('/admin/appointments', { params });
    return response.data;
  },

  updateAppointment: async (appointmentId, data) => {
    const response = await api.put(`/admin/appointments/${appointmentId}`, data);
    return response.data;
  },

  // User management
  getAllUsers: async (params) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  // Patient management
  searchPatients: async (params) => {
    const response = await api.get('/admin/patients', { params });
    return response.data;
  },

  getPatientById: async (patientId) => {
    const response = await api.get(`/admin/patients/${patientId}`);
    return response.data;
  },

  updatePatient: async (patientId, data) => {
    const response = await api.put(`/admin/patients/${patientId}`, data);
    return response.data;
  }
};

