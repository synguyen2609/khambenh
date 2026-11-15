import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated, isPatient, isDoctor, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo + Phòng Khám */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary-600">🏥</span>
            <span className="ml-2 text-xl font-semibold text-gray-800 whitespace-nowrap">
              Phòng Khám 
            </span>
          </Link>

          {/* Menu bên phải */}
          <div
            className={`flex items-center space-x-4 whitespace-nowrap ${
              isAdmin ? '' : 'overflow-x-auto'
            }`}
          >
            {isAuthenticated ? (
              <>
                {/* Menu Bệnh Nhân */}
                {isPatient && (
                  <>
                    <Link to="/patient/dashboard" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                      Trang Chủ
                    </Link>
                    <Link to="/patient/appointments" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                      Lịch Hẹn
                    </Link>
                    <Link to="/patient/medical-records" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                      Hồ Sơ Bệnh Án
                    </Link>
                    <Link to="/patient/profile" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                      Tài Khoản
                    </Link>
                  </>
                )}

                {/* Menu Bác Sĩ */}
                {isDoctor && (
                  <>
                    <Link to="/doctor/dashboard" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                      Trang Chủ
                    </Link>
                    <Link to="/doctor/appointments" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                      Lịch Hẹn
                    </Link>
                    {/* <Link to="/doctor/medical-records/create" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                      Hồ sơ bệnh án
                    </Link> */}
                    <Link to="/doctor/account" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                      Tài Khoản
                    </Link>
                  </>
                )}

                {/* Menu Admin */}
                {isAdmin && (
                  <>
                  <div className="flex items-center space-x-4 whitespace-nowrap">

                  {/* Trang Chủ */}
                  <Link to="/admin/dashboard" className="text-gray-700 hover:text-primary-600 px-2 py-2 rounded-md text-sm font-medium">
                    Trang Chủ
                  </Link>

                  {/* Khám Bệnh */}
                  <div className="relative group">
                    <button className="flex items-center text-gray-700 hover:text-primary-600 px-2 py-2 rounded-md text-sm font-medium">
                      Khám Bệnh
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <div className="absolute left-0 mt-2 w-56 bg-white border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <Link to="/admin/appointments" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" >
                        Quản Lý Lịch Hẹn
                      </Link>
                      <Link to="/admin/patients" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Quản Lý Bệnh Nhân
                      </Link>
                    </div>
                  </div>

                  {/* Hệ Thống */}
                  <div className="relative group">
                    <button className="flex items-center text-gray-700 hover:text-primary-600 px-2 py-2 rounded-md text-sm font-medium">
                      Hệ Thống
                      <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    <div className="absolute left-0 mt-2 w-56 bg-white border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <Link to="/admin/specialties" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Quản Lý Chuyên Khoa
                      </Link>
                      <Link to="/admin/doctors" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Quản Lý Bác Sĩ
                      </Link>
                      <Link to="/admin/users" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Quản Lý Người Dùng
                      </Link>
                    </div>
                  </div>
                </div>

                  </>
                )}

                {/* Tên user + Đăng Xuất */}
                <div className="flex items-center space-x-3 pl-4 border-l border-gray-300">
                  <span className="text-sm text-gray-700">{user?.name}</span>
                  <button onClick={handleLogout} className="btn-secondary text-sm">
                    Đăng Xuất
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">
                  Đăng Nhập
                </Link>
                <Link to="/register" className="btn-primary">
                  Đăng Ký
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
