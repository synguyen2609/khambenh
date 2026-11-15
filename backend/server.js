const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorHandler');

// Load biến môi trường từ file .env
dotenv.config();

// Khởi tạo ứng dụng Express
const app = express();

// Middleware
app.use(cors()); // Cho phép CORS
app.use(express.json()); // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse form-urlencoded

// Khai báo các route API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/doctors', require('./routes/doctorRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/medical-records', require('./routes/medicalRecordRoutes'));
app.use('/api/specialties', require('./routes/specialtyRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Route gốc
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API Quản Lý Phòng Khám Tư Nhân',
    version: '1.0.0'
  });
});

// Xử lý route không tồn tại (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Không tìm thấy route'
  });
});

// Middleware xử lý lỗi (luôn đặt ở cuối)
app.use(errorHandler);

// Kết nối cơ sở dữ liệu
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/clinic_management';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Kết nối MongoDB thành công');
    app.listen(PORT, () => {
      console.log(`🚀 Server đang chạy tại cổng ${PORT}`);
      console.log(`📍 API endpoint: http://localhost:${PORT}/api`);
    });
  })
  .catch((error) => {
    console.error('❌ Lỗi kết nối MongoDB:', error);
    process.exit(1);
  });

// Bắt lỗi Promise chưa được xử lý
process.on('unhandledRejection', (err) => {
  console.error('❌ Lỗi Promise chưa được xử lý:', err);
  process.exit(1);
});
