const express = require('express');
const router = express.Router();
const {
  getMyAppointments,
  searchPatients,
  getPatientById,
  updatePatient,
  getAllDoctors
} = require('../controllers/doctorController');
const { authMiddleware, doctorOnlyMiddleware } = require('../middleware/auth');

// Public route to get all doctors (for patients)
router.get('/', getAllDoctors);

// Protected routes (doctor only)
router.use(authMiddleware);
router.use(doctorOnlyMiddleware);

router.get('/me/appointments', getMyAppointments);
router.get('/patients', searchPatients);
router.get('/patients/:id', getPatientById);
router.put('/patients/:id', updatePatient);

module.exports = router;



