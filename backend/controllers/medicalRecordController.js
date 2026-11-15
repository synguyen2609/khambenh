const MedicalRecord = require('../models/MedicalRecord');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

// @desc    Get medical records for a patient
// @route   GET /api/medical-records/patient/:patientId
// @access  Private (Doctor)
exports.getPatientMedicalRecords = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    
    // Verify patient exists
    const patient = await User.findOne({ _id: patientId, role: 'patient' });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found.'
      });
    }
    
    const medicalRecords = await MedicalRecord.find({ patient: patientId })
      .populate('doctor', 'name specialty')
      .populate({
        path: 'doctor',
        populate: {
          path: 'specialty',
          select: 'name'
        }
      })
      .populate('appointment')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: medicalRecords.length,
      data: medicalRecords
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get medical record by ID
// @route   GET /api/medical-records/:id
// @access  Private
exports.getMedicalRecordById = async (req, res, next) => {
  try {
    const medicalRecord = await MedicalRecord.findById(req.params.id)
      .populate('patient', 'name email phone gender dob')
      .populate('doctor', 'name specialty')
      .populate({
        path: 'doctor',
        populate: {
          path: 'specialty',
          select: 'name'
        }
      })
      .populate('appointment');
    
    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found.'
      });
    }
    
    // Check authorization
    if (req.user.role === 'patient' && medicalRecord.patient._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this medical record.'
      });
    }
    
    res.status(200).json({
      success: true,
      data: medicalRecord
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new medical record
// @route   POST /api/medical-records
// @access  Private (Doctor)
exports.createMedicalRecord = async (req, res, next) => {
  try {
    const { patient, appointment, diagnosis, symptoms, notes, prescriptions } = req.body;
    
    // Validate required fields
    if (!patient || !diagnosis || !symptoms) {
      return res.status(400).json({
        success: false,
        message: 'Please provide patient, diagnosis, and symptoms.'
      });
    }
    
    // Verify patient exists
    const patientUser = await User.findOne({ _id: patient, role: 'patient' });
    if (!patientUser) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found.'
      });
    }
    
    // If appointment is provided, verify it exists
    if (appointment) {
      const appointmentDoc = await Appointment.findById(appointment);
      if (!appointmentDoc) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found.'
        });
      }
    }
    
    // Create medical record
    const medicalRecord = await MedicalRecord.create({
      patient,
      doctor: req.user._id,
      appointment,
      diagnosis,
      symptoms,
      notes,
      prescriptions: prescriptions || []
    });
    
    const populatedRecord = await MedicalRecord.findById(medicalRecord._id)
      .populate('patient', 'name email phone gender dob')
      .populate('doctor', 'name specialty')
      .populate({
        path: 'doctor',
        populate: {
          path: 'specialty',
          select: 'name'
        }
      })
      .populate('appointment');
    
    res.status(201).json({
      success: true,
      data: populatedRecord
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update medical record
// @route   PUT /api/medical-records/:id
// @access  Private (Doctor)
exports.updateMedicalRecord = async (req, res, next) => {
  try {
    const { diagnosis, symptoms, notes, prescriptions } = req.body;
    
    const medicalRecord = await MedicalRecord.findById(req.params.id);
    
    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found.'
      });
    }
    
    // Only the doctor who created the record can update it
    if (medicalRecord.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this medical record.'
      });
    }
    
    // Update fields
    if (diagnosis) medicalRecord.diagnosis = diagnosis;
    if (symptoms) medicalRecord.symptoms = symptoms;
    if (notes !== undefined) medicalRecord.notes = notes;
    if (prescriptions) medicalRecord.prescriptions = prescriptions;
    
    await medicalRecord.save();
    
    const updatedRecord = await MedicalRecord.findById(medicalRecord._id)
      .populate('patient', 'name email phone gender dob')
      .populate('doctor', 'name specialty')
      .populate({
        path: 'doctor',
        populate: {
          path: 'specialty',
          select: 'name'
        }
      })
      .populate('appointment');
    
    res.status(200).json({
      success: true,
      data: updatedRecord
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete medical record
// @route   DELETE /api/medical-records/:id
// @access  Private (Doctor)
exports.deleteMedicalRecord = async (req, res, next) => {
  try {
    const medicalRecord = await MedicalRecord.findById(req.params.id);
    
    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found.'
      });
    }
    
    // Only the doctor who created the record can delete it
    if (medicalRecord.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this medical record.'
      });
    }
    
    await medicalRecord.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Medical record deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};



