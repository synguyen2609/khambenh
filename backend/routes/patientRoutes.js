const express = require('express');
const router = express.Router();
const {
  getMyProfile,
  updateMyProfile,
  getMyAppointments,
  getMyMedicalRecords
} = require('../controllers/patientController');
const { authMiddleware, patientOnlyMiddleware } = require('../middleware/auth');

// All routes require authentication and patient role
router.use(authMiddleware);
router.use(patientOnlyMiddleware);

router.get('/me', getMyProfile);
router.put('/me', updateMyProfile);
router.get('/me/appointments', getMyAppointments);
router.get('/me/medical-records', getMyMedicalRecords);

module.exports = router;



