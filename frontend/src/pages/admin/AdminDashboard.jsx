import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { adminService } from '../../services/adminService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    completedAppointments: 0
  });
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Cập nhật đồng hồ mỗi giây
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await adminService.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section + Đồng hồ */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard 👨‍💼
            </h1>
            <p className="text-gray-600 mt-2">Quản lý toàn bộ hệ thống phòng khám</p>
          </div>
          <div className="text-right text-gray-700">
            <p className="font-medium">{format(currentTime, 'EEEE, dd MMMM yyyy', { locale: vi })}</p>
            <p className="text-lg font-semibold">{format(currentTime, 'HH:mm:ss')}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Tổng Bệnh Nhân</p>
                <p className="text-3xl font-bold mt-2">{stats.totalPatients}</p>
              </div>
              <div className="text-4xl opacity-80">👥</div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Tổng Bác Sĩ</p>
                <p className="text-3xl font-bold mt-2">{stats.totalDoctors}</p>
              </div>
              <div className="text-4xl opacity-80">👨‍⚕️</div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Tổng Lịch Hẹn</p>
                <p className="text-3xl font-bold mt-2">{stats.totalAppointments}</p>
              </div>
              <div className="text-4xl opacity-80">📅</div>
            </div>
          </div>
        </div>

        {/* Appointment Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Chờ Xác Nhận</p>
                <p className="text-3xl font-bold mt-2">{stats.pendingAppointments}</p>
              </div>
              <div className="text-4xl opacity-80">⏳</div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm">Đã Xác Nhận</p>
                <p className="text-3xl font-bold mt-2">{stats.confirmedAppointments}</p>
              </div>
              <div className="text-4xl opacity-80">✅</div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-teal-500 to-teal-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-100 text-sm">Đã Hoàn Thành</p>
                <p className="text-3xl font-bold mt-2">{stats.completedAppointments}</p>
              </div>
              <div className="text-4xl opacity-80">🎉</div>
            </div>
          </div>
        </div>

       {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/admin/appointments"
            className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                📅
              </div>
              <h3 className="font-semibold text-lg text-gray-900">
                Quản Lý Lịch Hẹn
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Xem và chỉnh sửa tất cả lịch hẹn
              </p>
            </div>
          </Link>

          <Link
            to="/admin/doctors"
            className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                👨‍⚕️
              </div>
              <h3 className="font-semibold text-lg text-gray-900">
                Quản Lý Bác Sĩ
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Thêm và quản lý bác sĩ
              </p>
            </div>
          </Link>

          <Link
            to="/admin/patients"
            className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                👥
              </div>
              <h3 className="font-semibold text-lg text-gray-900">
                Quản Lý Bệnh Nhân
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Xem và quản lý bệnh nhân
              </p>
            </div>
          </Link>

          <Link
            to="/admin/specialties"
            className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex flex-col items-center text-center">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                🏥
              </div>
              <h3 className="font-semibold text-lg text-gray-900">
                Quản Lý Chuyên Khoa
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Thêm, sửa, xóa chuyên khoa
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
