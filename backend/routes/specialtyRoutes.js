const express = require('express');
const router = express.Router();
const {
  getAllSpecialties,
  getSpecialtyById,
  createSpecialty,
  updateSpecialty,
  deleteSpecialty
} = require('../controllers/specialtyController');
const { authMiddleware, adminOnlyMiddleware } = require('../middleware/auth');

// Public routes
router.get('/', getAllSpecialties);
router.get('/:id', getSpecialtyById);

// Admin-only routes
router.post('/', authMiddleware, adminOnlyMiddleware, createSpecialty);
router.put('/:id', authMiddleware, adminOnlyMiddleware, updateSpecialty);
router.delete('/:id', authMiddleware, adminOnlyMiddleware, deleteSpecialty);

module.exports = router;



