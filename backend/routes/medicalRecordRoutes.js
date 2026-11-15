const express = require('express');
const router = express.Router();
const {
  getPatientMedicalRecords,
  getMedicalRecordById,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord
} = require('../controllers/medicalRecordController');
const { authMiddleware, doctorOnlyMiddleware } = require('../middleware/auth');

// All routes require authentication
router.use(authMiddleware);

// Anyone can view a specific record (with authorization check in controller)
router.get('/:id', getMedicalRecordById);

// Doctor-only routes
router.get('/patient/:patientId', doctorOnlyMiddleware, getPatientMedicalRecords);
router.post('/', doctorOnlyMiddleware, createMedicalRecord);
router.put('/:id', doctorOnlyMiddleware, updateMedicalRecord);
router.delete('/:id', doctorOnlyMiddleware, deleteMedicalRecord);

module.exports = router;



