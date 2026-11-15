import api from './api';

export const appointmentService = {
  // Create appointment
  createAppointment: async (data) => {
    const response = await api.post('/appointments', data);
    return response.data;
  },

  // Get all appointments
  getAllAppointments: async (params) => {
    const response = await api.get('/appointments', { params });
    return response.data;
  },

  // Get appointment by ID
  getAppointmentById: async (appointmentId) => {
    const response = await api.get(`/appointments/${appointmentId}`);
    return response.data;
  },

  // Update appointment status (doctor)
  updateAppointmentStatus: async (appointmentId, data) => {
    const response = await api.patch(`/appointments/${appointmentId}/status`, data);
    return response.data;
  },

  // Cancel appointment (patient)
  cancelAppointment: async (appointmentId, data) => {
    const response = await api.patch(`/appointments/${appointmentId}/cancel`, data);
    return response.data;
  }
};



