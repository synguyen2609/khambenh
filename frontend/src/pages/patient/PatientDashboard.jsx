import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { patientService } from '../../services/patientService';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

const PatientDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
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
      const [profileData, appointmentsData] = await Promise.all([
        patientService.getMyProfile(),
        patientService.getMyAppointments({ upcoming: 'true' })
      ]);

      setProfile(profileData.data);

      const now = new Date();

      // ✅ confirmed + pending
      const ALLOWED_STATUSES = new Set(['pending', 'confirmed']);
      const statusPriority = { confirmed: 0, pending: 1 };

      const upcomingAppointments = (appointmentsData.data || [])
        .filter((apt) => ALLOWED_STATUSES.has((apt.status || '').toLowerCase()))
        .map((apt) => {
          // timeSlot luôn kiểu "08:00 - 08:30"
          const slot = (apt.timeSlot || '').trim();
          const [startStrRaw, endStrRaw] = slot.split('-').map((s) => s.trim());

          const startStr = startStrRaw || '00:00';
          const endStr = endStrRaw || startStr; // phòng hờ

          const [sh = '00', sm = '00'] = startStr.split(':');
          const [eh = '00', em = '00'] = endStr.split(':');

          const dateObj = parseISO(apt.date);

          const start = new Date(
            dateObj.getFullYear(),
            dateObj.getMonth(),
            dateObj.getDate(),
            Number(sh),
            Number(sm),
            0
          );

          const end = new Date(
            dateObj.getFullYear(),
            dateObj.getMonth(),
            dateObj.getDate(),
            Number(eh),
            Number(em),
            0
          );

          return {
            ...apt,
            _statusLower: (apt.status || '').toLowerCase(),
            _startDateTime: start,
            _endDateTime: end
          };
        })
        .filter((apt) => {
          const isFuture = apt._startDateTime >= now;
          const isOngoing = apt._startDateTime <= now && now <= apt._endDateTime;

          // confirmed: hiện "đang diễn ra" + "tương lai"
          if (apt._statusLower === 'confirmed') return isFuture || isOngoing;

          // pending: chỉ tương lai (bạn muốn pending cũng "đang diễn ra" thì thêm || isOngoing)
          if (apt._statusLower === 'pending') return isFuture;

          return false;
        })
        .sort((a, b) => {
          const t = a._startDateTime - b._startDateTime;
          if (t !== 0) return t;

          const pa = statusPriority[a._statusLower] ?? 99;
          const pb = statusPriority[b._statusLower] ?? 99;
          if (pa !== pb) return pa - pb;

          return (a._id || '').localeCompare(b._id || '');
        });

      setAppointments(upcomingAppointments);
    } catch (error) {
      console.error('Lỗi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) =>
    ({
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }[status] || 'bg-gray-100 text-gray-800');

  const getStatusLabel = (status) =>
    ({
      pending: 'Chờ duyệt',
      confirmed: 'Đã xác nhận',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy'
    }[status] || status);

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
        {/* Welcome + đồng hồ */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Chào mừng, {profile?.patient?.name}! 👋
            </h1>
            <p className="text-gray-600 mt-2">Đây là tổng quan sức khỏe của bạn</p>
          </div>
          <div className="text-right text-gray-700">
            <p className="font-medium">
              {format(currentTime, 'EEEE, dd MMMM yyyy', { locale: vi })}
            </p>
            <p className="text-lg font-semibold">{format(currentTime, 'HH:mm:ss')}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <p className="text-blue-100 text-sm">Tổng Lịch Hẹn</p>
            <p className="text-3xl font-bold mt-2">
              {profile?.summary?.totalAppointments || 0}
            </p>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <p className="text-green-100 text-sm">Lịch đã hẹn</p>
            <p className="text-3xl font-bold mt-2">
              {profile?.summary?.upcomingAppointments || 0}
            </p>
          </div>

          <Link to="/patient/book-appointment" className="card bg-purple-600 text-white">
            <p className="text-purple-100 text-sm">Hành Động Nhanh</p>
            <p className="text-xl font-semibold mt-2">Đặt Lịch Hẹn</p>
          </Link>
        </div>

        {/* Upcoming Appointments */}
        <div className="card mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Lịch Hẹn Sắp Tới</h2>
            <Link
              to="/patient/appointments"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Xem tất cả →
            </Link>
          </div>

          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-gray-600 mb-4">Không có lịch hẹn sắp tới</p>
              <Link to="/patient/book-appointment" className="btn-primary">
                Đặt Lịch Hẹn
              </Link>
            </div>
          ) : (
            <div
              className={`space-y-4 ${
                appointments.length > 3 ? 'max-h-[360px] overflow-y-auto pr-2' : ''
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
                        <div className="text-2xl">👨‍⚕️</div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {appointment.doctor?.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {appointment.doctor?.specialty?.name}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-4 text-sm">
                        <span className="text-gray-600">
                          📅 {format(parseISO(appointment.date), 'dd MMM yyyy', { locale: vi })}
                        </span>
                        <span className="text-gray-600">⏰ {appointment.timeSlot}</span>
                        <span className="text-gray-600">📝 {appointment.reason}</span>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(
                        appointment.status
                      )}`}
                    >
                      {getStatusLabel(appointment.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/patient/medical-records" className="card hover:shadow-lg">
            <div className="flex items-center">
              <div className="text-4xl mr-4">📋</div>
              <div>
                <h3 className="font-semibold text-lg">Hồ Sơ Bệnh Án</h3>
                <p className="text-gray-600 text-sm">Xem lịch sử y tế</p>
              </div>
            </div>
          </Link>

          <Link to="/patient/profile" className="card hover:shadow-lg">
            <div className="flex items-center">
              <div className="text-4xl mr-4">👤</div>
              <div>
                <h3 className="font-semibold text-lg">Tài Khoản</h3>
                <p className="text-gray-600 text-sm">Cập nhật thông tin</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
