const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment
} = require('../controllers/appointmentController');
const { authMiddleware, doctorOnlyMiddleware, patientOnlyMiddleware, adminOrDoctorMiddleware } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Patient can create appointment
router.post('/', patientOnlyMiddleware, createAppointment);

// Both can view appointments
router.get('/', getAllAppointments);
router.get('/:id', getAppointmentById);

// Doctor or Admin can update appointment status
router.patch('/:id/status', adminOrDoctorMiddleware, updateAppointmentStatus);

// Patient can cancel their own appointment
router.patch('/:id/cancel', patientOnlyMiddleware, cancelAppointment);

module.exports = router;



