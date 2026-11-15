const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Specialty = require('../models/Specialty');
const MedicalRecord = require('../models/MedicalRecord');
const bcrypt = require('bcryptjs');

// @desc    Create a new doctor
// @route   POST /api/admin/doctors
// @access  Private (Admin)
exports.createDoctor = async (req, res, next) => {
  try {
    const { name, email, phone, password, specialty, bio, yearsOfExperience } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !password || !specialty) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc.'
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng.'
      });
    }
    
    // Check if specialty exists
    const specialtyDoc = await Specialty.findById(specialty);
    if (!specialtyDoc) {
      return res.status(404).json({
        success: false,
        message: 'Chuyên khoa không tồn tại.'
      });
    }
    
    // Create doctor
    const doctor = await User.create({
      role: 'doctor',
      name,
      email,
      phone,
      password,
      specialty,
      bio,
      yearsOfExperience: yearsOfExperience || 0,
      isActive: true
    });
    
    const populatedDoctor = await User.findById(doctor._id)
      .select('-password')
      .populate('specialty');
    
    res.status(201).json({
      success: true,
      data: populatedDoctor
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all doctors
// @route   GET /api/admin/doctors
// @access  Private (Admin)
exports.getAllDoctors = async (req, res, next) => {
  try {
    const doctors = await User.find({ role: 'doctor' })
      .select('-password')
      .populate('specialty')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update doctor
// @route   PUT /api/admin/doctors/:id
// @access  Private (Admin)
exports.updateDoctor = async (req, res, next) => {
  try {
    const { phone, password, specialty, bio, yearsOfExperience, isActive } = req.body;

    const doctor = await User.findOne({ _id: req.params.id, role: 'doctor' });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Bác sĩ không tồn tại.'
      });
    }

    // ===== PHONE UNIQUE =====
    if (phone && phone !== doctor.phone) {
      const phoneExists = await User.findOne({
        phone,
        _id: { $ne: doctor._id } // exclude current doctor
      });

      if (phoneExists) {
        return res.status(400).json({
          success: false,
          message: 'Số điện thoại đã được sử dụng.'
        });
      }

      doctor.phone = phone;
    }

    // ===== PASSWORD =====
    if (password) doctor.password = password;

    // ===== SPECIALTY =====
    if (specialty) {
      const specialtyDoc = await Specialty.findById(specialty);
      if (!specialtyDoc) {
        return res.status(404).json({
          success: false,
          message: 'Chuyên khoa không tồn tại.'
        });
      }
      doctor.specialty = specialty;
    }

    if (bio !== undefined) doctor.bio = bio;
    if (yearsOfExperience !== undefined) doctor.yearsOfExperience = yearsOfExperience;
    if (typeof isActive === 'boolean') doctor.isActive = isActive;

    await doctor.save();

    const updatedDoctor = await User.findById(doctor._id)
      .select('-password')
      .populate('specialty');

    res.status(200).json({
      success: true,
      data: updatedDoctor
    });
  } catch (error) {
    next(error);
  }
};


// @desc    Get all appointments
// @route   GET /api/admin/appointments
// @access  Private (Admin)
exports.getAllAppointments = async (req, res, next) => {
  try {
    const { status, date, doctor } = req.query;
    
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }
    
    if (doctor) {
      query.doctor = doctor;
    }
    
    const appointments = await Appointment.find(query)
      .populate('patient', 'name phone email gender dob')
      .populate('doctor', 'name specialty phone')
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

// @desc    Update appointment (by admin)
// @route   PUT /api/admin/appointments/:id
// @access  Private (Admin)
exports.updateAppointment = async (req, res, next) => {
  try {
    const { doctor, date, timeSlot, reason, status } = req.body;
    
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Lịch hẹn không tồn tại.'
      });
    }
    
    // Update fields
    if (doctor) {
      const doctorDoc = await User.findOne({ _id: doctor, role: 'doctor' });
      if (!doctorDoc) {
        return res.status(404).json({
          success: false,
          message: 'Bác sĩ không tồn tại.'
        });
      }
      appointment.doctor = doctor;
    }
    if (date) appointment.date = new Date(date);
    if (timeSlot) appointment.timeSlot = timeSlot;
    if (reason) appointment.reason = reason;
    if (status) {
      const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Trạng thái không hợp lệ.'
        });
      }

      // ===== XỬ LÝ GHI LÝ DO HỦY =====
      if (status === 'cancelled') {
        appointment.status = 'cancelled';

        appointment.cancelNote = req.body.cancelNote || 
            (req.user.role === 'admin' ? 'Hủy do bệnh nhân yêu cầu' :
            req.user.role === 'doctor' ? 'Hủy do bác sĩ' :
            'Hủy do bệnh nhân');
      }


      appointment.status = status;
    }

    
    await appointment.save();
    
    const updatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', 'name phone email')
      .populate('doctor', 'name specialty phone')
      .populate({
        path: 'doctor',
        populate: {
          path: 'specialty',
          select: 'name'
        }
      });
    
    res.status(200).json({
      success: true,
      data: updatedAppointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;
    
    const query = {};
    
    if (role) {
      query.role = role;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(query)
      .select('-password')
      .populate('specialty')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const count = await User.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
exports.getDashboardStats = async (req, res, next) => {
  try {
    const totalPatients = await User.countDocuments({ role: 'patient' });
    const totalDoctors = await User.countDocuments({ role: 'doctor' });
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
    const confirmedAppointments = await Appointment.countDocuments({ status: 'confirmed' });
    const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
    
    res.status(200).json({
      success: true,
      data: {
        totalPatients,
        totalDoctors,
        totalAppointments,
        pendingAppointments,
        confirmedAppointments,
        completedAppointments
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search patients
// @route   GET /api/admin/patients
// @access  Private (Admin)
exports.searchPatients = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 20 } = req.query;
    
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
// @route   GET /api/admin/patients/:id
// @access  Private (Admin)
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
    
    // Get patient's medical records (for viewing only, admin cannot create)
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
        medicalRecords
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update patient info (by admin)
// @route   PUT /api/admin/patients/:id
// @access  Private (Admin)
exports.updatePatient = async (req, res, next) => {
  try {
    const { name, phone, address, dob, gender, isActive } = req.body;

    // ===== PHONE UNIQUE =====
    if (phone) {
      // Check if another user has the same phone
      const phoneExists = await User.findOne({
        phone,
        _id: { $ne: req.params.id } // exclude current patient
      });

      if (phoneExists) {
        return res.status(400).json({
          success: false,
          message: 'Số điện thoại đã được sử dụng.'
        });
      }
    }

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
        message: 'Bệnh nhân không tồn tại.'
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


// ==================== CREATE PATIENT ====================
// @desc    Create a new patient
// @route   POST /api/admin/patients
// @access  Private (Admin)
exports.createPatient = async (req, res, next) => {
  try {
    const { name, email, phone, password, address, dob, gender } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc.'
      });
    }

    // Check if email or phone already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email hoặc số điện thoại đã được sử dụng.'
      });
    }

    // Create patient
    const patient = await User.create({
      role: 'patient',
      name,
      email,
      phone,
      password,
      address,
      dob,
      gender,
      isActive: true
    });

    const populatedPatient = await User.findById(patient._id)
      .select('-password');

    res.status(201).json({
      success: true,
      data: populatedPatient
    });
  } catch (error) {
    next(error);
  }
};