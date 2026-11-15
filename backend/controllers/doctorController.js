const User = require('../models/User');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');

// @desc    Get doctor's appointments
// @route   GET /api/doctors/me/appointments
// @access  Private (Doctor)
exports.getMyAppointments = async (req, res, next) => {
  try {
    const { status, date } = req.query;
    
    // Doctor can only see their own appointments
    const query = { doctor: req.user._id };
    
    if (status) {
      query.status = status;
    }
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }
    
    const appointments = await Appointment.find(query)
      .populate('patient', 'name phone email gender dob')
      .populate('doctor', 'name specialty')
      .populate({
        path: 'doctor',
        populate: {
          path: 'specialty',
          select: 'name'
        }
      })
      .sort({ date: -1, timeSlot: 1 });
    
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search patients
// @route   GET /api/doctors/patients
// @access  Private (Doctor)
exports.searchPatients = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    
    const query = { role: 'patient' };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    const patients = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const count = await User.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: patients
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get patient details by ID
// @route   GET /api/doctors/patients/:id
// @access  Private (Doctor)
exports.getPatientById = async (req, res, next) => {
  try {
    const patient = await User.findOne({
      _id: req.params.id,
      role: 'patient'
    }).select('-password');
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found.'
      });
    }
    
    // Get patient's appointments
    const appointments = await Appointment.find({ patient: patient._id })
      .populate('doctor', 'name specialty')
      .populate({
        path: 'doctor',
        populate: {
          path: 'specialty',
          select: 'name'
        }
      })
      .sort({ date: -1 })
      .limit(10);
    
    // Get patient's medical records
    const medicalRecords = await MedicalRecord.find({ patient: patient._id })
      .populate('doctor', 'name specialty')
      .populate({
        path: 'doctor',
        populate: {
          path: 'specialty',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.status(200).json({
      success: true,
      data: {
        patient,
        appointments,
        medicalRecords
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update patient info (by doctor)
// @route   PUT /api/doctors/patients/:id
// @access  Private (Doctor)
exports.updatePatient = async (req, res, next) => {
  try {
    const { name, phone, address, dob, gender, isActive } = req.body;
    
    const updateFields = {};
    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;
    if (address !== undefined) updateFields.address = address;
    if (dob) updateFields.dob = dob;
    if (gender) updateFields.gender = gender;
    if (typeof isActive === 'boolean') updateFields.isActive = isActive;
    
    const patient = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'patient' },
      updateFields,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found.'
      });
    }
    
    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public (for patients to see available doctors)
exports.getAllDoctors = async (req, res, next) => {
  try {
    const doctors = await User.find({ role: 'doctor', isActive: true })
      .select('-password')
      .populate('specialty');
    
    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    next(error);
  }
};



