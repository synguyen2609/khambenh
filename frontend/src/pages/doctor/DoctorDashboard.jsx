import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { doctorService } from '../../services/doctorService';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    today: 0,
    pending: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Cập nhật đồng hồ
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusBadgeClass = (status) => {
    const classes = {
      pending: 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm',
      confirmed: 'bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm',
      completed: 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm',
      cancelled: 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm'
    };
    return classes[status] || 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Chờ Xác Nhận',
      confirmed: 'Đã Xác Nhận',
      completed: 'Đã Hoàn Thành',
      cancelled: 'Đã Hủy'
    };
    return labels[status] || status;
  };

  const getGenderLabel = (gender) => {
    const map = {
      male: 'Nam',
      female: 'Nữ'
    };
    return map[gender] || gender;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await doctorService.getMyAppointments({});
      const allAppts = res.data || [];

      // ===== MỐC THỜI GIAN CHUẨN (LOCAL) =====
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      // ===== LỌC: hôm nay + confirmed | ngày mai + pending =====
      const filtered = allAppts.filter((apt) => {
        if (!apt.date) return false;

        const aptDate = new Date(apt.date);
        aptDate.setHours(0, 0, 0, 0);

        const isTodayConfirmed =
          aptDate.getTime() === today.getTime() &&
          apt.status === 'confirmed';

        const isTomorrowPending =
          aptDate.getTime() === tomorrow.getTime() &&
          apt.status === 'pending';

        return isTodayConfirmed || isTomorrowPending;
      });

      // ===== SẮP XẾP: confirmed trước, rồi theo ngày + timeSlot =====
      filtered.sort((a, b) => {
        if (a.status !== b.status) {
          return a.status === 'confirmed' ? -1 : 1;
        }

        const dateDiff = new Date(a.date) - new Date(b.date);
        if (dateDiff !== 0) return dateDiff;

        return (a.timeSlot || '').localeCompare(b.timeSlot || '');
      });

      setAppointments(filtered);

      setStats({
        today: filtered.filter(
          (a) =>
            new Date(a.date).toDateString() === today.toDateString()
        ).length,
        pending: allAppts.filter((a) => a.status === 'pending').length,
        total: allAppts.filter((a) => a.status === 'confirmed').length
      });
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
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
        {/* Phần chào mừng và đồng hồ */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Bảng điều khiển Bác sĩ 👨‍⚕️
            </h1>
            <p className="text-gray-600 mt-2">
              Quản lý phòng khám hiệu quả
            </p>
          </div>

          <div className="text-right text-gray-700">
            <p className="font-medium">
              {format(currentTime, 'EEEE, dd MMMM yyyy', { locale: vi })}
            </p>
            <p className="text-lg font-semibold">
              {format(currentTime, 'HH:mm:ss')}
            </p>
          </div>
        </div>

        {/* Thẻ thống kê */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Lịch hẹn hôm nay</p>
                <p className="text-3xl font-bold mt-2">{stats.today}</p>
              </div>
              <div className="text-4xl opacity-80">📅</div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Chờ xác nhận</p>
                <p className="text-3xl font-bold mt-2">{stats.pending}</p>
              </div>
              <div className="text-4xl opacity-80">⏳</div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">
                  Tổng số lịch đã xác nhận
                </p>
                <p className="text-3xl font-bold mt-2">{stats.total}</p>
              </div>
              <div className="text-4xl opacity-80">📊</div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <Link to="/doctor/patients" className="block">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Quản lý</p>
                  <p className="text-xl font-semibold mt-2">Bệnh nhân</p>
                </div>
                <div className="text-4xl opacity-80">👥</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Lịch hẹn */}
        <div className="card mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Lịch làm việc
            </h2>
            <Link
              to="/doctor/appointments"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Xem tất cả →
            </Link>
          </div>

          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <p className="text-gray-600">
                Không có lịch hẹn phù hợp
              </p>
            </div>
          ) : (
            <div
              className={`space-y-4 ${
                appointments.length > 4
                  ? 'max-h-[400px] overflow-y-auto pr-2'
                  : ''
              }`}
            >
              {appointments.map((appointment) => (
                <div
                  key={appointment._id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">👤</div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {appointment.patient?.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {getGenderLabel(appointment.patient?.gender)} •{' '}
                            {appointment.patient?.phone}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-4 text-sm">
                        <span className="flex items-center text-gray-600">
                          📅{' '}
                          {format(
                            parseISO(appointment.date),
                            'dd MMM yyyy',
                            { locale: vi }
                          )}
                        </span>
                        <span className="flex items-center text-gray-600">
                          ⏰ {appointment.timeSlot}
                        </span>
                        <span className="flex items-center text-gray-600">
                          📝 {appointment.reason}
                        </span>
                      </div>
                    </div>

                    <span
                      className={getStatusBadgeClass(appointment.status)}
                    >
                      {getStatusLabel(appointment.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
