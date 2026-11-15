const User = require('../models/User');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');

// @desc    Get patient profile (self)
// @route   GET /api/patients/me
// @access  Private (Patient)
exports.getMyProfile = async (req, res, next) => {
  try {
    const patient = await User.findById(req.user._id);
    
    // Get appointment summary
    const totalAppointments = await Appointment.countDocuments({ patient: req.user._id });
    const upcomingAppointments = await Appointment.countDocuments({
      patient: req.user._id,
      date: { $gte: new Date() },
      status: { $in: ['pending', 'confirmed'] }
    });
    
    res.status(200).json({
      success: true,
      data: {
        patient,
        summary: {
          totalAppointments,
          upcomingAppointments
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update patient profile (self)
// @route   PUT /api/patients/me
// @access  Private (Patient)
exports.updateMyProfile = async (req, res, next) => {
  try {
    const { name, phone, address, dob, gender } = req.body;
    
    const updateFields = {};
    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;
    if (address !== undefined) updateFields.address = address;
    if (dob) updateFields.dob = dob;
    if (gender) updateFields.gender = gender;

    // Kiểm tra số điện thoại trùng
    if (phone) {
      const existingUser = await User.findOne({ phone, _id: { $ne: req.user._id } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Số điện thoại này đã được sử dụng bởi người khác'
        });
      }
    }

    const patient = await User.findByIdAndUpdate(
      req.user._id,
      updateFields,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: patient
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get patient's own appointments
// @route   GET /api/patients/me/appointments
// @access  Private (Patient)
exports.getMyAppointments = async (req, res, next) => {
  try {
    const { status, upcoming, todayCompleted } = req.query;
    
    const query = { patient: req.user._id };
    
    if (status) {
      query.status = status;
    }
    
    if (upcoming === 'true') {
      query.date = { $gte: new Date() };
    }

    // Nếu muốn hiển thị trên trang chủ: lịch hẹn hôm nay và đã hoàn thành
    if (todayCompleted === 'true') {
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
      query.status = 'confirmed'; // hoặc 'hoàn thành' tùy giá trị status trong DB
    }
    
    const appointments = await Appointment.find(query)
      .populate('doctor', 'name specialty phone email')
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


// @desc    Get patient's own medical records
// @route   GET /api/patients/me/medical-records
// @access  Private (Patient)
exports.getMyMedicalRecords = async (req, res, next) => {
  try {
    const medicalRecords = await MedicalRecord.find({ patient: req.user._id })
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
