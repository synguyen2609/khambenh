const express = require('express');
const router = express.Router();
const {
  createDoctor,
  getAllDoctors,
  updateDoctor,
  getAllAppointments,
  updateAppointment,
  getAllUsers,
  getDashboardStats,
  searchPatients,
  getPatientById,
  updatePatient
} = require('../controllers/adminController');
const { authMiddleware, adminOnlyMiddleware } = require('../middleware/auth');

// All routes require authentication and admin role
router.use(authMiddleware);
router.use(adminOnlyMiddleware);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Doctor management
router.post('/doctors', createDoctor);
router.get('/doctors', getAllDoctors);
router.put('/doctors/:id', updateDoctor);

// Appointment management
router.get('/appointments', getAllAppointments);
router.put('/appointments/:id', updateAppointment);

// User management
router.get('/users', getAllUsers);

// Patient management
router.get('/patients', searchPatients);
router.get('/patients/:id', getPatientById);
router.put('/patients/:id', updatePatient);

module.exports = router;

