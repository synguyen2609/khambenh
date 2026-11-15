import api from './api';

export const authService = {
  // Register new patient
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },


  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);

      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }

      return response.data;
    } catch (error) {
      throw error; // 🔥 DÒNG QUAN TRỌNG NHẤT
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get token from localStorage
  getToken: () => {
    return localStorage.getItem('token');
  }
};



