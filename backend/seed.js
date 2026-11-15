const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Specialty = require('./models/Specialty');
const Appointment = require('./models/Appointment');
const MedicalRecord = require('./models/MedicalRecord');

// Load biến môi trường
dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/clinic_management';

const seedData = async () => {
  try {
    // Kết nối MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Kết nối MongoDB thành công');

    // Xóa dữ liệu cũ
    await User.deleteMany({});
    await Specialty.deleteMany({});
    await Appointment.deleteMany({});
    await MedicalRecord.deleteMany({});
    console.log('🧹 Đã xóa dữ liệu cũ');

    // --- Mốc thời gian chuẩn ---
    const now = new Date();
    const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(now); lastWeek.setDate(lastWeek.getDate() - 7);
    const lastMonth = new Date(now); lastMonth.setDate(lastMonth.getDate() - 30);
    const today = new Date(now);
    const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(now); nextWeek.setDate(nextWeek.getDate() + 7);

    // Tạo admin
    const admin = await User.create({
      role: 'admin',
      name: 'Quản Trị Viên',
      email: 'admin@clinic.com',
      phone: '0900000000',
      password: 'admin123',
      isActive: true
    });
    console.log('✅ Tạo thành công tài khoản Quản trị viên');

    // ✅ Tạo chuyên khoa (PHẢI ĐẶT TRƯỚC khi tạo bác sĩ)
    const specialties = await Specialty.insertMany([
      { name: 'Nội Tổng Quát', description: 'Chăm sóc sức khỏe ban đầu và tư vấn sức khỏe tổng quát' },
      { name: 'Tim Mạch', description: 'Chuyên khoa tim mạch và hệ thống tuần hoàn' },
      { name: 'Nhi Khoa', description: 'Chăm sóc y tế cho trẻ sơ sinh, trẻ em và thanh thiếu niên' },
      { name: 'Da Liễu', description: 'Chuyên khoa chăm sóc da, tóc và móng' }
    ]);
    console.log(`✅ Tạo thành công ${specialties.length} chuyên khoa`);

    // Tạo bác sĩ
    const doctor1 = await User.create({
      role: 'doctor',
      name: 'BS. Nguyễn Văn An',
      email: 'doctor1@clinic.com',
      phone: '0901000001',
      password: 'doctor123',
      specialty: specialties[0]._id,
      yearsOfExperience: 10,
      isActive: true
    });

    const doctor2 = await User.create({
      role: 'doctor',
      name: 'BS. Trần Thị Bình',
      email: 'doctor2@clinic.com',
      phone: '0901000002',
      password: 'doctor123',
      specialty: specialties[1]._id,
      yearsOfExperience: 8,
      isActive: true
    });

    const doctor3 = await User.create({
      role: 'doctor',
      name: 'BS. Lê Văn Cường',
      email: 'doctor3@clinic.com',
      phone: '0901000003',
      password: 'doctor123',
      specialty: specialties[2]._id,
      yearsOfExperience: 7,
      isActive: true
    });

    const doctor4 = await User.create({
      role: 'doctor',
      name: 'BS. Phạm Thị Dung',
      email: 'doctor4@clinic.com',
      phone: '0901000004',
      password: 'doctor123',
      specialty: specialties[3]._id,
      yearsOfExperience: 9,
      isActive: true
    });

    const doctor5 = await User.create({
      role: 'doctor',
      name: 'BS. Hoàng Minh',
      email: 'doctor5@clinic.com',
      phone: '0901000005',
      password: 'doctor123',
      specialty: specialties[0]._id,
      yearsOfExperience: 6,
      isActive: true
    });

    const doctor6 = await User.create({
      role: 'doctor',
      name: 'BS. Trịnh Lan',
      email: 'doctor6@clinic.com',
      phone: '0901000006',
      password: 'doctor123',
      specialty: specialties[2]._id,
      yearsOfExperience: 5,
      isActive: true
    });

    const doctors = [doctor1, doctor2, doctor3, doctor4, doctor5, doctor6];
    console.log(`✅ Tạo thành công ${doctors.length} bác sĩ`);

    // Tạo bệnh nhân
    const patient1 = await User.create({
      role: 'patient',
      name: 'Nguyễn Thị Hoa',
      email: 'patient1@test.com',
      phone: '0912000001',
      password: 'patient123',
      gender: 'female',
      dob: new Date('1990-05-15'),
      address: '123 Đường A',
      isActive: true
    });

    const patient2 = await User.create({
      role: 'patient',
      name: 'Trần Văn Nam',
      email: 'patient2@test.com',
      phone: '0912000002',
      password: 'patient123',
      gender: 'male',
      dob: new Date('1985-08-22'),
      address: '456 Đường B',
      isActive: true
    });

    const patient3 = await User.create({
      role: 'patient',
      name: 'Lê Thị Mai',
      email: 'patient3@test.com',
      phone: '0912000003',
      password: 'patient123',
      gender: 'female',
      dob: new Date('1995-03-10'),
      address: '789 Đường C',
      isActive: true
    });

    const patient4 = await User.create({
      role: 'patient',
      name: 'Phạm Văn Hùng',
      email: 'patient4@test.com',
      phone: '0912000004',
      password: 'patient123',
      gender: 'male',
      dob: new Date('1992-07-18'),
      address: '101 Đường D',
      isActive: true
    });

    const patients = [patient1, patient2, patient3, patient4];
    console.log(`✅ Tạo thành công ${patients.length} bệnh nhân`);

    // --- Tạo lịch hẹn ---
    const appointmentsData = [
      // Patient 1
      { patient: patients[0]._id, doctor: doctors[3]._id, date: tomorrow, timeSlot: '13:00-13:30', reason: 'Ngứa da toàn thân', status: 'pending' },
      { patient: patients[0]._id, doctor: doctors[1]._id, date: nextWeek, timeSlot: '10:00-10:30', reason: 'Đau ngực thoáng qua', status: 'confirmed' },
      { patient: patients[0]._id, doctor: doctors[0]._id, date: yesterday, timeSlot: '09:00-09:30', reason: 'Ho và mệt mỏi', status: 'completed' },
      { patient: patients[0]._id, doctor: doctors[2]._id, date: lastMonth, timeSlot: '11:00-11:30', reason: 'Sốt cao, quấy khóc', status: 'cancelled', cancelNote: 'Hủy do bệnh nhân' },
      { patient: patients[0]._id, doctor: doctors[0]._id, date: lastWeek, timeSlot: '14:00-14:30', reason: 'Đau đầu nhẹ, chóng mặt', status: 'cancelled', cancelNote: 'Hủy do bác sĩ' },
      { patient: patients[0]._id, doctor: doctors[4]._id, date: lastMonth, timeSlot: '15:00-15:30', reason: 'Mệt mỏi kéo dài', status: 'cancelled', cancelNote: 'Hủy do bệnh nhân yêu cầu' },

      // Patient 2
      { patient: patients[1]._id, doctor: doctors[0]._id, date: today, timeSlot: '09:00-09:30', reason: 'Mệt mỏi, đau cơ', status: 'confirmed' },
      { patient: patients[1]._id, doctor: doctors[0]._id, date: lastMonth, timeSlot: '10:00-10:30', reason: 'Khám tổng quát', status: 'cancelled', cancelNote: 'Hủy do bệnh nhân' },
      { patient: patients[1]._id, doctor: doctors[1]._id, date: yesterday, timeSlot: '13:00-13:30', reason: 'Đau ngực khi vận động', status: 'completed' },
      { patient: patients[1]._id, doctor: doctors[1]._id, date: tomorrow, timeSlot: '15:00-15:30', reason: 'Tái khám tim mạch', status: 'pending' },
      { patient: patients[1]._id, doctor: doctors[2]._id, date: lastWeek, timeSlot: '16:00-16:30', reason: 'Ho kéo dài', status: 'cancelled', cancelNote: 'Hủy do bác sĩ' },
      { patient: patients[1]._id, doctor: doctors[1]._id, date: today, timeSlot: '13:00-13:30', reason: 'Tái khám huyết áp và mỡ máu', status: 'completed' },

      // Patient 3
      { patient: patients[2]._id, doctor: doctors[0]._id, date: tomorrow, timeSlot: '11:00-11:30', reason: 'Đau đầu từng cơn', status: 'pending' },
      { patient: patients[2]._id, doctor: doctors[0]._id, date: lastWeek, timeSlot: '15:00-15:30', reason: 'Tái khám', status: 'cancelled', cancelNote: 'Hủy do bệnh nhân yêu cầu' },
      { patient: patients[2]._id, doctor: doctors[2]._id, date: lastWeek, timeSlot: '09:00-09:30', reason: 'Đau họng, ho', status: 'completed' },
      { patient: patients[2]._id, doctor: doctors[3]._id, date: nextWeek, timeSlot: '10:00-10:30', reason: 'Ngứa da, phát ban tái phát', status: 'confirmed' },
      { patient: patients[2]._id, doctor: doctors[1]._id, date: tomorrow, timeSlot: '16:30-17:00', reason: 'Khó thở nhẹ khi gắng sức', status: 'pending' },

      // Patient 4
      { patient: patients[3]._id, doctor: doctors[0]._id, date: tomorrow, timeSlot: '09:00-09:30', reason: 'Mệt mỏi kéo dài', status: 'pending' },
      { patient: patients[3]._id, doctor: doctors[0]._id, date: nextWeek, timeSlot: '11:00-11:30', reason: 'Theo dõi sức khỏe tổng quát', status: 'confirmed' },
      { patient: patients[3]._id, doctor: doctors[3]._id, date: lastMonth, timeSlot: '10:00-10:30', reason: 'Mẩn đỏ, ngứa da', status: 'completed' },
      { patient: patients[3]._id, doctor: doctors[1]._id, date: yesterday, timeSlot: '16:00-16:30', reason: 'Đau dạ dày tái phát', status: 'cancelled', cancelNote: 'Hủy do bệnh nhân' },
      { patient: patients[3]._id, doctor: doctors[2]._id, date: tomorrow, timeSlot: '13:30-14:00', reason: 'Ho kéo dài', status: 'confirmed' },
    ];

    const appointments = await Appointment.insertMany(appointmentsData);
    console.log(`✅ Tạo thành công ${appointments.length} lịch hẹn`);

    // --- Tạo hồ sơ bệnh án ---
    const medicalRecordsData = [
      // Patient 1
      {
        patient: patient1._id,
        doctor: doctor1._id,
        date: yesterday,
        diagnosis: 'Viêm đường hô hấp trên',
        symptoms: 'Ho khan, sổ mũi, mệt mỏi nhẹ',
        notes: `Nghỉ ngơi, uống nhiều nước. Tái khám vào ngày ${new Date(yesterday.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')}.`,
        prescriptions: [
          { medicineName: 'Paracetamol', dosage: '500mg', frequency: 'Mỗi 6 giờ', duration: '5 ngày', note: 'Uống sau bữa ăn' },
          { medicineName: 'Vitamin C', dosage: '1000mg', frequency: 'Mỗi ngày 1 lần', duration: '7 ngày', note: 'Buổi sáng sau ăn' }
        ]
      },

      // Patient 2
      {
        patient: patient2._id,
        doctor: doctor2._id,
        date: today,
        diagnosis: 'Rối loạn mỡ máu kèm huyết áp cao',
        symptoms: 'Đau đầu nhẹ, chóng mặt, mệt mỏi',
        notes: `Duy trì chế độ ăn giảm muối, giảm mỡ. Đo huyết áp mỗi ngày. Tái khám vào ngày ${new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')}.`,
        prescriptions: [
          { medicineName: 'Amlodipine', dosage: '5mg', frequency: 'Mỗi ngày 1 lần', duration: '30 ngày', note: 'Uống buổi sáng' },
          { medicineName: 'Losartan', dosage: '50mg', frequency: 'Mỗi ngày 1 lần', duration: '30 ngày', note: 'Uống buổi tối' },
          { medicineName: 'Atorvastatin', dosage: '20mg', frequency: 'Mỗi ngày 1 lần', duration: '30 ngày', note: 'Uống buổi tối, giúp giảm cholesterol' }
        ]
      },
      {
        patient: patient2._id,
        doctor: doctor2._id,
        date: yesterday,
        diagnosis: 'Đau thắt ngực ổn định',
        symptoms: 'Đau ngực khi gắng sức, hồi hộp nhẹ',
        notes: `Theo dõi huyết áp và nhịp tim tại nhà. Tái khám vào ngày ${new Date(yesterday.getTime() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')}.`,
        prescriptions: [
          { medicineName: 'Aspirin', dosage: '81mg', frequency: 'Mỗi ngày 1 lần', duration: '14 ngày', note: 'Uống sau ăn sáng' },
          { medicineName: 'Nitroglycerin', dosage: '0.4mg', frequency: 'Khi đau ngực', duration: '14 ngày', note: 'Ngậm dưới lưỡi, nếu không giảm sau 5 phút có thể lặp lại 1 lần' }
        ]
      },

      // Patient 3
      {
        patient: patient3._id,
        doctor: doctor3._id,
        date: lastWeek,
        diagnosis: 'Viêm họng cấp',
        symptoms: 'Đau họng, sốt nhẹ, ho',
        notes: 'Uống đủ nước ấm, nghỉ ngơi. Tái khám nếu sốt kéo dài quá 48 giờ.',
        prescriptions: [
          { medicineName: 'Amoxicillin', dosage: '500mg', frequency: 'Mỗi 8 giờ', duration: '7 ngày', note: 'Uống sau ăn, đủ liệu trình' },
          { medicineName: 'Paracetamol', dosage: '500mg', frequency: 'Khi sốt/đau', duration: '3 ngày', note: 'Mỗi 6–8 giờ nếu cần, không quá 4 viên/ngày' }
        ]
      },

      // Patient 4
      {
        patient: patient4._id,
        doctor: doctor4._id,
        date: lastMonth,
        diagnosis: 'Viêm da dị ứng',
        symptoms: 'Ngứa, mẩn đỏ vùng tay/cổ',
        notes: 'Tránh tác nhân gây kích ứng (xà phòng, mỹ phẩm). Tái khám sau 7 ngày nếu không giảm.',
        prescriptions: [
          { medicineName: 'Hydrocortisone cream', dosage: '1%', frequency: 'Bôi 2 lần/ngày', duration: '7 ngày', note: 'Bôi lớp mỏng, tránh vùng mắt' },
          { medicineName: 'Cetirizine', dosage: '10mg', frequency: 'Mỗi ngày 1 lần', duration: '7 ngày', note: 'Uống buổi tối, có thể gây buồn ngủ' }
        ]
      }
    ];

    const medicalRecords = await MedicalRecord.insertMany(medicalRecordsData);
    console.log(`✅ Tạo thành công ${medicalRecords.length} hồ sơ bệnh án`);

    // --- Thông tin đăng nhập ---
    console.log('\n🎉 Khởi tạo database thành công!');
    console.log('\n📧 Thông tin đăng nhập:');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('👨‍💼 TÀI KHOẢN QUẢN TRỊ VIÊN (ADMIN)');
    console.log('   Email: admin@clinic.com');
    console.log('   Mật khẩu: admin123');
    console.log('   Quyền hạn: Quản lý toàn bộ hệ thống');

    console.log('\n👨‍⚕️ TÀI KHOẢN BÁC SĨ (DOCTOR)');
    console.log('   Email: doctor1@clinic.com');
    console.log('   Mật khẩu: doctor123');
    console.log('   Chuyên khoa: Nội Tổng Quát');

    console.log('\n👤 TÀI KHOẢN BỆNH NHÂN (PATIENT)');
    console.log('   Email: patient1@test.com');
    console.log('   Mật khẩu: patient123');
    console.log('═══════════════════════════════════════════════════════════');

    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi khởi tạo database:', error);
    process.exit(1);
  }
};

seedData();
