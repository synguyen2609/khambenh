const User = require('../models/User');
const Specialty = require('../models/Specialty');
const generateToken = require('../utils/generateToken');

// @desc    Register a new patient
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password, dob, gender, address } = req.body;
    
    // Validate required fields
    if (!name || !email || !phone || !password || !dob || !gender) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc.'
      });
    }

    // Check if email or phone already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({
          success: false,
          message: 'Email đã được đăng ký.'
        });
      } else if (existingUser.phone === phone) {
        return res.status(400).json({
          success: false,
          message: 'Số điện thoại đã được đăng ký.'
        });
      }
    }
    
    // Create new patient
    const user = await User.create({
      role: 'patient',
      name,
      email,
      phone,
      password,
      dob,
      gender,
      address
    });
    
    // Generate token
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user (patient or doctor)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập email và mật khẩu.'
      });
    }
    
    // Find user and include password
    const user = await User.findOne({ email }).select('+password').populate('specialty');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng.'
      });
    }
    
    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.'
      });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng.'
      });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    // Remove password from response
    user.password = undefined;
    
    res.status(200).json({
      success: true,
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('specialty');
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};
