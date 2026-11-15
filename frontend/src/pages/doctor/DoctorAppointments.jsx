import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { doctorService } from '../../services/doctorService';
import { appointmentService } from '../../services/appointmentService';
import { format, parseISO } from 'date-fns';

const DoctorAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [filters, setFilters] = useState({ status: '', date: '' });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const getStatusBadgeClass = (status) =>
    ({
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }[status] || 'bg-gray-100 text-gray-800');

  const getStatusLabel = (status) =>
    ({
      pending: 'Chờ Xác Nhận',
      confirmed: 'Đã Xác Nhận',
      completed: 'Đã Hoàn Thành',
      cancelled: 'Đã Hủy'
    }[status] || status);

  // --- Helpers: parse datetime from (date + timeSlot) ---
  const getStartTimeFromSlot = (timeSlot = '') => timeSlot.split('-')[0].trim(); // "08:00"
  const toSortDateTime = (apt) => {
    const dateObj = parseISO(apt.date); // ổn định hơn new Date(string)
    const start = getStartTimeFromSlot(apt.timeSlot || '');
    const [hh = '00', mm = '00'] = start.split(':');

    return new Date(
      dateObj.getFullYear(),
      dateObj.getMonth(),
      dateObj.getDate(),
      Number(hh),
      Number(mm),
      0
    );
  };

  const isToday = (date) => {
    const today = new Date();
    const aptDate = parseISO(date);
    return (
      today.getFullYear() === aptDate.getFullYear() &&
      today.getMonth() === aptDate.getMonth() &&
      today.getDate() === aptDate.getDate()
    );
  };

  const isTimeReached = (date, timeSlot) => {
    const now = new Date();
    const aptDateTime = toSortDateTime({ date, timeSlot });
    return now >= aptDateTime;
  };

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = { all: 'true' };
      if (filters.status) params.status = filters.status;
      if (filters.date) params.date = filters.date;

      const response = await doctorService.getMyAppointments(params);

      // ✅ SORT TĂNG DẦN THEO (date + timeSlot)
      const sorted = (response.data || [])
        .map((apt) => ({ ...apt, _sortDateTime: toSortDateTime(apt) }))
        .sort((a, b) => a._sortDateTime - b._sortDateTime);

      setAppointments(sorted);
      setFilteredAppointments(sorted);
      setCurrentPage(1);
    } catch (error) {
      console.error('Lỗi khi tải lịch hẹn:', error);
    } finally {
      setLoading(false);
    }
  };

  // Search frontend (giữ sort sẵn có, chỉ filter)
  useEffect(() => {
    const keyword = search.toLowerCase();
    const result = appointments.filter(
      (apt) =>
        apt.patient?.name?.toLowerCase().includes(keyword) ||
        apt.patient?.phone?.includes(keyword)
    );
    setFilteredAppointments(result);
    setCurrentPage(1);
  }, [search, appointments]);

  const handleStatusUpdate = async (appointmentId, newStatus, cancelNote = '') => {
    setUpdatingId(appointmentId);
    try {
      await appointmentService.updateAppointmentStatus(appointmentId, {
        status: newStatus,
        cancelNote
      });
      fetchAppointments();
    } catch (error) {
      alert(error.response?.data?.message || 'Cập nhật trạng thái lịch hẹn thất bại');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCancel = (appointmentId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy không?')) return;
    handleStatusUpdate(appointmentId, 'cancelled', 'Hủy bởi bác sĩ');
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Quản lý lịch hẹn</h1>

        {/* Filter + search */}
        <div className="card mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tìm kiếm bệnh nhân</label>
              <input
                type="text"
                placeholder="Tên hoặc số điện thoại"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Lọc theo trạng thái</label>
              <select name="status" value={filters.status} onChange={handleFilterChange} className="input-field">
                <option value="">Tất cả trạng thái</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Lọc theo ngày</label>
              <input type="date" name="date" value={filters.date} onChange={handleFilterChange} className="input-field" />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilters({ status: '', date: '' });
                  setSearch('');
                }}
                className="btn-secondary w-full"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>

        {/* List */}
        {currentAppointments.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-gray-600">Không tìm thấy lịch hẹn nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentAppointments.map((apt) => {
              const showCompleteButton = apt.status === 'confirmed';

              // ✅ Disable nếu lịch còn ở tương lai (ngày/giờ)
              const disabledBeforeDateTime = toSortDateTime(apt) > new Date();

              const showAlertBeforeTime = isToday(apt.date) && !isTimeReached(apt.date, apt.timeSlot);

              return (
                <div
                  key={apt._id}
                  className="card hover:shadow-md cursor-pointer"
                  onClick={() => navigate(`/doctor/patients/${apt.patient?._id}`)}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl">👤</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">{apt.patient?.name}</h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(apt.status)}`}>
                              {getStatusLabel(apt.status)}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm mb-3">
                            <div className="flex items-center text-gray-700">
                              <span className="mr-2">👨‍⚕️</span>Bác sĩ {apt.doctor?.name}
                            </div>
                            <div className="flex items-center text-gray-700">
                              <span className="mr-2">📞</span>{apt.patient?.phone}
                            </div>
                            <div className="flex items-center text-gray-700">
                              <span className="mr-2">📅</span>{format(parseISO(apt.date), 'dd/MM/yyyy')}
                            </div>
                            <div className="flex items-center text-gray-700">
                              <span className="mr-2">⏰</span>{apt.timeSlot}
                            </div>
                          </div>

                          <div className="p-3 bg-gray-50 rounded-lg text-sm mb-2">
                            <div className="flex items-start gap-2">
                              <strong className="text-gray-700">📝 Lý do khám:</strong>
                              <p className="text-gray-600">{apt.reason}</p>
                            </div>
                          </div>

                          {apt.status === 'cancelled' && (
                            <div className="p-3 bg-red-50 rounded-lg text-sm">
                              <div className="flex items-start gap-2">
                                <strong className="text-red-700">Lý do hủy:</strong>
                                <p className="text-red-600">{apt.cancelNote || 'Hủy bởi bác sĩ'}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-wrap gap-2">
                      {apt.status === 'pending' && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusUpdate(apt._id, 'confirmed');
                            }}
                            className="btn-primary text-sm"
                            disabled={updatingId === apt._id}
                          >
                            Xác nhận
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancel(apt._id);
                            }}
                            className="btn-danger text-sm"
                            disabled={updatingId === apt._id}
                          >
                            Hủy
                          </button>
                        </>
                      )}

                      {showCompleteButton && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (showAlertBeforeTime) {
                              alert('Chưa tới giờ hẹn, chưa thể đánh dấu hoàn thành');
                              return;
                            }
                            handleStatusUpdate(apt._id, 'completed');
                          }}
                          className="btn-primary text-sm"
                          disabled={disabledBeforeDateTime}
                        >
                          Đánh dấu hoàn thành
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-4 space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="btn-secondary px-3 py-1 rounded"
                >
                  ◀
                </button>

                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'btn-secondary'}`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="btn-secondary px-3 py-1 rounded"
                >
                  ▶
                </button>
              </div>
            )}
          </div>
        )}

        <div className="card mt-6 bg-blue-50 border border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Tổng số lịch hẹn:</span>
            <span className="font-bold text-xl text-gray-900">{filteredAppointments.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointments;
