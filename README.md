# 🏥 Hệ Thống Quản Lý Phòng Khám

Hệ thống quản lý phòng khám tư nhân đầy đủ với 3 quyền: **Admin**, **Bác Sĩ**, và **Bệnh Nhân**. Được xây dựng với Node.js, Express, MongoDB, và React.

## 📋 Mục Lục

- [Tính Năng](#tính-năng)
- [Công Nghệ Sử Dụng](#công-nghệ-sử-dụng)
- [Cấu Trúc Dự Án](#cấu-trúc-dự-án)
- [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
- [Cài Đặt](#cài-đặt)
- [Chạy Ứng Dụng](#chạy-ứng-dụng)
- [Tài Khoản Demo](#tài-khoản-demo)
- [Quyền Hạn Chi Tiết](#quyền-hạn-chi-tiết)
- [API Documentation](#api-documentation)
- [Bảo Mật](#bảo-mật)
- [Triển Khai Production](#triển-khai-production)

## ✨ Tính Năng

### 👨‍💼 Quản Trị Viên (Admin)
- ✅ Quản lý toàn bộ hệ thống
- ✅ Xem và chỉnh sửa **TẤT CẢ** lịch hẹn của mọi bác sĩ
- ✅ Thêm và quản lý bác sĩ mới
- ✅ Cập nhật thông tin bác sĩ (tên, email, chuyên khoa, v.v.)
- ✅ Quản lý chuyên khoa ( thêm, xóa, sửa)
- ✅ Xem thông tin, hồ sơ bệnh án, chỉnh sửa thông tin bệnh nhân
- ✅ Xem danh sách tất cả người dùng
- ✅ Xem thống kê tổng quan (số bệnh nhân, bác sĩ, lịch hẹn)
- ✅ Quản lý trạng thái tài khoản

### 👨‍⚕️ Bác Sĩ (Doctor)
- ✅ **CHỈ** xem lịch hẹn của bệnh nhân đã đặt với mình
- ✅ Cập nhật trạng thái lịch hẹn (pending → confirmed/cancel → completed )
- ✅ Tìm kiếm và xem thông tin bệnh nhân
- ✅ Xem lịch sử khám bệnh của bệnh nhân
- ✅ Tạo và quản lý hồ sơ bệnh án
- ✅ Kê đơn thuốc cho bệnh nhân
- ✅ Xem thông tin cá nhân

### 👤 Bệnh Nhân (Patient)
- ✅ Đăng ký tài khoản
- ✅ Xem và cập nhật thông tin cá nhân
- ✅ Đặt lịch hẹn với bác sĩ
- ✅ Xem lịch sử lịch hẹn
- ✅ Hủy lịch hẹn (trước 24 giờ)
- ✅ Xem hồ sơ bệnh án và đơn thuốc

## 🛠️ Công Nghệ Sử Dụng

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB với Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: express-validator

### Frontend
- **Library**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **Date Handling**: date-fns

## 📁 Cấu Trúc Dự Án

```
phongkham/
├── backend/
│   ├── controllers/       # Xử lý request
│   │   ├── adminController.js      # Quản lý admin
│   │   ├── appointmentController.js # Quản lý lịch hẹn
│   │   ├── authController.js       # Xác thực
│   │   ├── doctorController.js     # Quản lý bác sĩ
│   │   ├── medicalRecordController.js
│   │   ├── patientController.js
│   │   └── specialtyController.js
│   ├── middleware/        # Middleware
│   │   ├── auth.js        # Xác thực JWT & phân quyền theo vai trò
│   │   └── errorHandler.js
│   ├── models/           # Mongoose schemas
│   │   ├── User.js       # User model (admin/doctor/patient)
│   │   ├── Appointment.js
│   │   ├── MedicalRecord.js
│   │   └── Specialty.js
│   ├── routes/           #  Các tuyến API (API routes)
│   │   ├── adminRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── authRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── medicalRecordRoutes.js
│   │   ├── patientRoutes.js
│   │   └── specialtyRoutes.js
│   ├── utils/            # Các hàm hỗ trợ (Helper functions)
│   │   └── generateToken.js
│   ├── server.js         # Entry point
│   ├── seed.js           # Khởi tạo dữ liệu ban đầu (Database seeding)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Components tái sử dụng
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/      # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── pages/         # Trang
│   │   │   ├── admin/     # Trang admin
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── ManageAppointments.jsx
│   │   │   │   ├── ManageDoctors.jsx
│   │   │   │   └── ManageUsers.jsx
│   │   │   ├── doctor/    # Trang bác sĩ
│   │   │   └── patient/   # Trang bệnh nhân
│   │   ├── services/      # API services
│   │   │   ├── adminService.js
│   │   │   ├── api.js
│   │   │   └── ...
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   └── package.json
│
└── README.md
```

## 📦 Yêu Cầu Hệ Thống

Trước khi bắt đầu, đảm bảo bạn đã cài đặt:
- **Node.js** (v16 trở lên) - [Download](https://nodejs.org/)
- **MongoDB** (v5 trở lên) - [Download](https://www.mongodb.com/try/download/community)
- **npm** hoặc **yarn**

## 🚀 Cài Đặt

### 1. Clone repository

```bash
git clone <repository-url>
cd phongkham
```

### 2. Cài đặt Backend Dependencies

```bash
cd backend
npm install
```

### 3. Cài đặt Frontend Dependencies

```bash
cd ../frontend
npm install
```

### 4. Cấu hình Environment Variables

Tạo file `.env` trong thư mục `backend`:

```bash
cd ../backend
cp .env.example .env
```

Chỉnh sửa `.env` với cấu hình của bạn:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/clinic_management

# JWT Secret Key (thay đổi trong production)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development
```

## 🏃 Chạy Ứng Dụng

### Khởi động MongoDB

Đảm bảo MongoDB đang chạy:

```bash
# macOS với Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
# MongoDB sẽ tự động chạy như một service
```

### Khởi tạo Database (Lần đầu tiên)

```bash
cd backend
npm run seed
```

Script này sẽ tạo:
- 1 tài khoản admin
- 6 bác sĩ
- 4 bệnh nhân
- 4 chuyên khoa
- 22 lịch hẹn và 5 hồ sơ bệnh án

### Khởi động Backend Server

```bash
cd backend
npm run dev
```

Backend sẽ chạy tại `http://localhost:5000`

### Khởi động Frontend Development Server

Mở terminal mới:

```bash
cd frontend
npm run dev
```

Frontend sẽ chạy tại `http://localhost:3000` (hoặc port khác nếu 3000 đã được sử dụng)

## 👥 Tài Khoản Demo

Sau khi chạy seed script, bạn có thể sử dụng các tài khoản sau:

### 👨‍💼 Quản Trị Viên (Admin)
- **Email**: `admin1@clinic.com`
- **Password**: `admin123`
- **Quyền hạn**: Quản lý toàn bộ hệ thống

### 👨‍⚕️ Bác Sĩ (Doctor)
- **Email**: `doctor1@clinic.com`
- **Password**: `doctor123`
- **Chuyên khoa**: Nội Tổng Quát
- **Quyền hạn**: Chỉ xem lịch hẹn của mình

- **Email**: `doctor2@clinic.com`/ **Password**: `doctor123`/ **Chuyên khoa**: Tim Mạch
- **Email**: `doctor3@clinic.com`/ **Password**: `doctor123`/ **Chuyên khoa**: Nhi Khoa
- **Email**: `doctor4@clinic.com`/ **Password**: `doctor123`/ **Chuyên khoa**: Da Liễu
- **Email**: `doctor5@clinic.com`/ **Password**: `doctor123`/ **Chuyên khoa**: Nội Tổng Quát
- **Email**: `doctor6@clinic.com`/ **Password**: `doctor123`/ **Chuyên khoa**: Da Liễu

### 👤 Bệnh Nhân (Patient)
- **Email**: `patient1@test.com`
- **Password**: `patient123`

Tài khoản bệnh nhân khác:
- **Email**: `patient2@test.com` / **Password** `patient123` **TÀI KHOẢN VÔ HIỆU HÓA**
- **Email**: `patient3@test.com` / **Password** `patient123`
- **Email**: `patient4@test.com` / **Password** `patient123`

## 🔐 Quyền Hạn Chi Tiết

### Admin (Quản Trị Viên)

**Quản lý Lịch Hẹn:**
- ✅ Xem **TẤT CẢ** lịch hẹn của mọi bác sĩ
- ✅ Chỉnh sửa lịch hẹn (thay đổi bác sĩ, ngày, giờ, trạng thái)
- ✅ Lọc lịch hẹn theo bác sĩ, ngày, trạng thái

**Quản lý Bác Sĩ:**
- ✅ Thêm bác sĩ mới
- ✅ Cập nhật thông tin bác sĩ (số điện thoại, chuyên khoa, v.v.)
- ✅ Kích hoạt/vô hiệu hóa tài khoản bác sĩ
- ✅ Xem danh sách tất cả bác sĩ

**Chuyên Khoa:**
- ✅ Quản lý chuyên khoa (thêm, xóa, sửa)

**Quản lý Bác Sĩ:**
- ✅ Xem danh sách và tìm  bệnh nhân
- ✅ Xem thông tin và **CHỈ XEM** hồ sơ bệnh nhân 
- ✅ Cập nhật thông tin bác sĩ (số điện thoại, địa chỉ)
- ✅ Kích hoạt/vô hiệu hóa tài khoản bệnh nhân

**Quản lý Người Dùng:**
- ✅ Xem danh sách tất cả người dùng (admin, bác sĩ, bệnh nhân)
- ✅ Tìm kiếm người dùng
- ✅ Lọc theo vai trò

**Thống Kê:**
- ✅ Xem tổng số bệnh nhân, bác sĩ, lịch hẹn
- ✅ Xem số lịch hẹn theo trạng thái

### Doctor (Bác Sĩ)

**Lịch Hẹn:**
- ✅ **CHỈ** xem lịch hẹn của bệnh nhân đã đặt với mình
- ✅ Cập nhật trạng thái lịch hẹn của mình (pending → confirmed → completed)
- ✅ Không thể xem hoặc sửa lịch hẹn của bác sĩ khác

**Quản lý Bệnh Nhân:**
- ✅ Tìm kiếm bệnh nhân
- ✅ Xem thông tin chi tiết bệnh nhân
- ✅ Xem lịch sử khám bệnh của bệnh nhân


**Hồ Sơ Bệnh Án:**
- ✅ Tạo hồ sơ bệnh án mới
- ✅ Kê đơn thuốc
- ✅ Xem lịch sử hồ sơ bệnh án


### Patient (Bệnh Nhân)

**Tài Khoản:**
- ✅ Đăng ký tài khoản
- ✅ Xem và cập nhật thông tin cá nhân

**Lịch Hẹn:**
- ✅ Đặt lịch hẹn với bác sĩ
- ✅ Xem lịch sử lịch hẹn của mình
- ✅ Hủy lịch hẹn (trước 24 giờ)

**Hồ Sơ Bệnh Án:**
- ✅ Xem hồ sơ bệnh án của mình
- ✅ Xem đơn thuốc

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Đăng Ký Bệnh Nhân
```http
POST /auth/register
Content-Type: application/json

{
  "name": "Nguyễn Văn A",
  "email": "nguyenvana@example.com",
  "phone": "0912345678",
  "password": "password123",
  "dob": "1990-01-01",
  "gender": "male",
  "address": "123 Đường ABC"
}
```

#### Đăng Nhập
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@clinic.com",
  "password": "admin123"
}
```

#### Lấy Thông Tin Người Dùng Hiện Tại
```http
GET /auth/me
Authorization: Bearer <token>
```

### Admin Endpoints

Tất cả endpoint admin yêu cầu authentication với role admin.

```http
GET    /admin/dashboard              # Thống kê tổng quan
GET    /admin/doctors                # Danh sách tất cả bác sĩ
POST   /admin/doctors                # Tạo bác sĩ mới
PUT    /admin/doctors/:id            # Cập nhật bác sĩ
GET    /admin/appointments           # Tất cả lịch hẹn
PUT    /admin/appointments/:id       # Cập nhật lịch hẹn
GET    /admin/users                  # Tất cả người dùng
```

### Doctor Endpoints

Tất cả endpoint doctor yêu cầu authentication với role doctor.

```http
GET    /doctors                      # Danh sách bác sĩ (public)
GET    /doctors/me/appointments      # Lịch hẹn của bác sĩ
GET    /doctors/patients             # Tìm kiếm bệnh nhân
GET    /doctors/patients/:id         # Chi tiết bệnh nhân
PUT    /doctors/patients/:id         # Cập nhật bệnh nhân
```

### Patient Endpoints

Tất cả endpoint patient yêu cầu authentication với role patient.

```http
GET    /patients/me                  # Thông tin cá nhân
PUT    /patients/me                  # Cập nhật thông tin
GET    /patients/me/appointments     # Lịch hẹn của bệnh nhân
GET    /patients/me/medical-records  # Hồ sơ bệnh án
```

### Appointment Endpoints

```http
POST   /appointments                 # Tạo lịch hẹn (patient)
GET    /appointments                 # Lấy lịch hẹn
GET    /appointments/:id             # Chi tiết lịch hẹn
PATCH  /appointments/:id/status      # Cập nhật trạng thái (doctor/admin)
PATCH  /appointments/:id/cancel      # Hủy lịch hẹn (patient)
```

**Lưu ý về quyền hạn:**
- **Admin**: Có thể xem và sửa TẤT CẢ lịch hẹn
- **Doctor**: CHỈ có thể xem và sửa lịch hẹn của mình
- **Patient**: CHỈ có thể xem và hủy lịch hẹn của mình

### Medical Record Endpoints

```http
GET    /medical-records/patient/:patientId  # Hồ sơ bệnh án của bệnh nhân (doctor)
GET    /medical-records/:id                # Chi tiết hồ sơ
POST   /medical-records                    # Tạo hồ sơ (doctor)
PUT    /medical-records/:id               # Cập nhật hồ sơ (doctor)
DELETE /medical-records/:id               # Xóa hồ sơ (doctor)
```

### Specialty Endpoints

```http
GET    /specialties            # Danh sách chuyên khoa (public)
GET    /specialties/:id        # Chi tiết chuyên khoa (public)
POST   /specialties           # Tạo chuyên khoa (doctor)
PUT    /specialties/:id        # Cập nhật chuyên khoa (doctor)
DELETE /specialties/:id       # Xóa chuyên khoa (doctor)
```

## 🔒 Bảo Mật

- ✅ Mã hóa mật khẩu với bcrypt (10 salt rounds)
- ✅ JWT token authentication với token expiry
- ✅ Protected API routes với role-based access control
- ✅ Input validation
- ✅ Error handling tập trung
- ✅ CORS enabled
- ✅ Password không bao giờ được trả về trong response

## 🚀 Triển Khai Production

### Backend Deployment

1. Thiết lập environment variables cho production
2. Sử dụng process manager như PM2
3. Thiết lập MongoDB Atlas hoặc managed MongoDB
4. Bật HTTPS
5. Cấu hình CORS cho domain của bạn

```bash
npm install -g pm2
cd backend
pm2 start server.js --name clinic-api
```

### Frontend Deployment

1. Build production bundle:
```bash
cd frontend
npm run build
```

2. Deploy thư mục `dist` lên:
   - Netlify
   - Vercel
   - AWS S3 + CloudFront
   - Bất kỳ static hosting service nào

3. Cập nhật API URL trong production:
   - Thiết lập biến môi trường `VITE_API_URL`

## 🧪 Testing

### Test Đăng Ký Bệnh Nhân
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Patient",
    "email": "test@patient.com",
    "phone": "0912345678",
    "password": "password123",
    "dob": "1995-05-15",
    "gender": "male"
  }'
```

### Test Đăng Nhập
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@clinic.com",
    "password": "admin123"
  }'
```

## 📝 Ghi Chú Phát Triển

### Backend Development
- API được xây dựng theo chuẩn RESTful
- Dữ liệu trao đổi sử dụng định dạng JSON thống nhất
- Xử lý lỗi tập trung thông qua middleware
- Sử dụng Mongoose hooks để mã hóa mật khẩu
- Áp dụng populate để liên kết và truy xuất dữ liệu liên quan

### Frontend Development
- Kiến trúc dựa trên component của React
- Quản lý trạng thái toàn cục bằng React Context (Auth)
- Bảo vệ các trang bằng Protected Route theo vai trò người dùng
- Thiết kế giao diện responsive, phù hợp nhiều thiết bị
- Sử dụng Tailwind CSS để xây dựng giao diện nhanh và nhất quán
- Định dạng và xử lý ngày tháng bằng date-fns

## 🤝 Đóng Góp

Đóng góp rất được hoan nghênh! Vui lòng làm theo các bước:

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Mở Pull Request

## 📄 License

Dự án này là mã nguồn mở và có sẵn dưới MIT License.

## 👨‍💻 Tác Giả

Được tạo với ❤️ cho hệ thống quản lý phòng khám tư nhân

## 🆘 Hỗ Trợ

Nếu gặp vấn đề hoặc có câu hỏi:

1. Kiểm tra trang [Issues](https://github.com/yourusername/clinic-management/issues)
2. Tạo issue mới với thông tin chi tiết
3. Liên hệ đội phát triển

## 🎯 Tính Năng Tương Lai

- [ ] Thông báo email cho lịch hẹn
- [ ] SMS nhắc nhở
- [ ] Tích hợp thanh toán
- [ ] Báo cáo và phân tích nâng cao
- [ ] Tính năng tư vấn video
- [ ] Ứng dụng mobile (React Native)
- [ ] Hỗ trợ đa ngôn ngữ
- [ ] Xuất hồ sơ bệnh án dạng PDF

---

**Lưu ý**: Đây là dự án demo. Để sử dụng trong production, đảm bảo kiểm tra bảo mật đầy đủ, tuân thủ HIPAA (nếu áp dụng), và cập nhật thường xuyên.
