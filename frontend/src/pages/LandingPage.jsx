import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const LandingPage = () => {
  const { isAuthenticated, isPatient, isDoctor } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard if already logged in
    if (isAuthenticated) {
      if (isPatient) {
        navigate('/patient/dashboard');
      } else if (isDoctor) {
        navigate('/doctor/dashboard');
      }
    }
  }, [isAuthenticated, isPatient, isDoctor, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-3xl">🏥</span>
            <span className="ml-2 text-2xl font-bold text-primary-600">
              Quản Lý Phòng Khám
            </span>
          </div>
          <div className="space-x-4">
            <Link to="/login" className="btn-secondary">
              Đăng Nhập
            </Link>
            <Link to="/register" className="btn-primary">
              Bắt Đầu
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 sm:text-6xl">
            Quản Lý Y Tế
            <span className="text-primary-600"> Hiện Đại</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Hợp lý hóa hoạt động phòng khám tư của bạn với hệ thống quản lý
            toàn diện. Đặt lịch khám, quản lý hồ sơ bệnh nhân và cung cấp
            dịch vụ chăm sóc tốt hơn.
          </p>
          <div className="mt-10 flex justify-center space-x-4">
            <Link to="/register" className="btn-primary text-lg px-8 py-3">
              Đăng Ký Bệnh Nhân
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-3">
              Đăng Nhập Tài khoản
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="card text-center">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2">Đặt Lịch Dễ Dàng</h3>
            <p className="text-gray-600">
              Đặt và quản lý lịch hẹn với bác sĩ một cách liền mạch
            </p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-semibold mb-2">Hồ Sơ Bệnh Án</h3>
            <p className="text-gray-600">
              Truy cập lịch sử y tế đầy đủ của bạn mọi lúc, mọi nơi
            </p>
          </div>
          <div className="card text-center">
            <div className="text-4xl mb-4">👨‍⚕️</div>
            <h3 className="text-xl font-semibold mb-2">Bác Sĩ Chuyên Môn</h3>
            <p className="text-gray-600">
              Đội ngũ chuyên gia y tế giàu kinh nghiệm sẵn sàng hỗ trợ
            </p>
          </div>
        </div>

        {/* For Doctors Section */}
        <div className="mt-24 card bg-primary-50 border-2 border-primary-200">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Dành Cho Chuyên Gia Y Tế
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Quản lý phòng khám hiệu quả với các công cụ quản trị toàn diện
            </p>
            <ul className="text-left max-w-2xl mx-auto space-y-2 mb-6">
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Quản lý lịch hẹn và lên lịch
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Hồ sơ bệnh nhân và lịch sử y tế
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Theo dõi đơn thuốc và chẩn đoán
              </li>
              <li className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Quản lý toàn bộ phòng khám
              </li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-20 py-8 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600">
          <p>&copy; 2024 Hệ Thống Quản Lý Phòng Khám. Bảo lưu mọi quyền.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
