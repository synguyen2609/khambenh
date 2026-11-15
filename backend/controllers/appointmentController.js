const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Tạo lịch hẹn mới (do bệnh nhân tạo)
// @route   POST /api/appointments
// @access  Riêng tư (Bệnh nhân)
exports.createAppointment = async (req, res, next) => {
  try {
    const { doctor, date, timeSlot, reason } = req.body;
    
    // Kiểm tra các trường bắt buộc
    if (!doctor || !date || !timeSlot || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp đầy đủ các trường bắt buộc.'
      });
    }
    
    // Kiểm tra bác sĩ có tồn tại và đang hoạt động hay không
    const doctorUser = await User.findOne({
      _id: doctor,
      role: 'doctor',
      isActive: true
    });
    
    if (!doctorUser) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bác sĩ hoặc bác sĩ không hoạt động.'
      });
    }
    
    // Kiểm tra khung giờ đã được đặt hay chưa
    // ===== FIX DUY NHẤT Ở ĐÂY =====
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const existingAppointment = await Appointment.findOne({
      doctor,
      date: { $gte: startDate, $lte: endDate },
      timeSlot,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'Khung giờ này đã được đặt. Vui lòng chọn khung giờ khác.'
      });
    }
    // ===== HẾT FIX =====
    
    // Tạo lịch hẹn
    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor,
      date: new Date(date),
      timeSlot,
      reason
    });
    
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', 'name phone email')
      .populate('doctor', 'name specialty phone')
      .populate({
        path: 'doctor',
        populate: {
          path: 'specialty',
          select: 'name'
        }
      });
    
    res.status(201).json({
      success: true,
      data: populatedAppointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy tất cả lịch hẹn (có bộ lọc)
// @route   GET /api/appointments
// @access  Riêng tư (Admin xem tất cả, Bác sĩ xem lịch của mình, Bệnh nhân xem lịch của mình)
exports.getAllAppointments = async (req, res, next) => {
  try {
    const { status, date } = req.query;
    
    const query = {};
    
    // Nếu là bệnh nhân, chỉ hiển thị lịch hẹn của họ
    if (req.user.role === 'patient') {
      query.patient = req.user._id;
    }
    // Nếu là bác sĩ (không phải admin), chỉ hiển thị lịch hẹn của họ
    else if (req.user.role === 'doctor') {
      query.doctor = req.user._id;
    }
    // Admin có thể xem tất cả lịch hẹn
    
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

// @desc    Lấy lịch hẹn theo ID
// @route   GET /api/appointments/:id
// @access  Riêng tư
exports.getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name phone email gender dob address')
      .populate('doctor', 'name specialty phone email')
      .populate({
        path: 'doctor',
        populate: {
          path: 'specialty',
          select: 'name'
        }
      });
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lịch hẹn.'
      });
    }
    
    // Kiểm tra quyền truy cập
    if (req.user.role === 'patient' && appointment.patient._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền xem lịch hẹn này.'
      });
    }
    
    // Bác sĩ chỉ được xem lịch của mình (admin được xem tất cả)
    if (req.user.role === 'doctor' && appointment.doctor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền xem lịch hẹn này.'
      });
    }
    
    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cập nhật trạng thái lịch hẹn (bác sĩ hoặc admin)
// @route   PATCH /api/appointments/:id/status
// @access  Riêng tư (Bác sĩ hoặc Admin)
exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status, cancelNote } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng cung cấp trạng thái.'
      });
    }
    
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Giá trị trạng thái không hợp lệ.'
      });
    }
    
    // Kiểm tra lịch hẹn có tồn tại và quyền cập nhật
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctor', '_id');
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lịch hẹn.'
      });
    }
    
    // Bác sĩ chỉ được cập nhật lịch của mình, admin được cập nhật tất cả
    if (req.user.role === 'doctor' && appointment.doctor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền cập nhật lịch hẹn này.'
      });
    }
    
    const updateData = { status };
    if (status === 'cancelled' && cancelNote) {
      updateData.cancelNote = cancelNote;
    }
    
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
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

// @desc    Hủy lịch hẹn (do bệnh nhân)
// @route   PATCH /api/appointments/:id/cancel
// @access  Riêng tư (Bệnh nhân)
exports.cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lịch hẹn.'
      });
    }
    
    // Kiểm tra bệnh nhân có sở hữu lịch hẹn này không
    if (appointment.patient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền hủy lịch hẹn này.'
      });
    }
    
    // Kiểm tra trạng thái có thể hủy hay không
    if (appointment.status === 'completed' || appointment.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: `Không thể hủy lịch hẹn với trạng thái: ${appointment.status}.`
      });
    }
    
    // Tùy chọn: chỉ cho phép hủy trước ít nhất 24 giờ
    const appointmentDate = new Date(appointment.date);
    const now = new Date();
    const hoursDifference = (appointmentDate - now) / (1000 * 60 * 60);
    
    if (hoursDifference < 24 && hoursDifference > 0) {
      return res.status(400).json({
        success: false,
        message: 'Chỉ có thể hủy lịch hẹn trước ít nhất 24 giờ.'
      });
    }
    
    appointment.status = 'cancelled';
    appointment.cancelNote = req.body.cancelNote || 'Bệnh nhân đã hủy lịch';
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
