import api from './api';

export const specialtyService = {
  // Get all specialties
  getAllSpecialties: async () => {
    const response = await api.get('/specialties');
    return response.data;
  },

  // Get specialty by ID
  getSpecialtyById: async (specialtyId) => {
    const response = await api.get(`/specialties/${specialtyId}`);
    return response.data;
  },

  // Create specialty
  createSpecialty: async (data) => {
    const response = await api.post('/specialties', data);
    return response.data;
  },

  // Update specialty
  updateSpecialty: async (specialtyId, data) => {
    const response = await api.put(`/specialties/${specialtyId}`, data);
    return response.data;
  },

  // Delete specialty
  deleteSpecialty: async (specialtyId) => {
    const response = await api.delete(`/specialties/${specialtyId}`);
    return response.data;
  }
};



