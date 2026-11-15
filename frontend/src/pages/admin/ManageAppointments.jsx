import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { adminService } from '../../services/adminService';
import { format } from 'date-fns';

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filters, setFilters] = useState({ status: '', date: '', doctor: '' });
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [editForm, setEditForm] = useState({ doctor: '', date: '', timeSlot: '', status: '' });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // mỗi trang 5 item

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const fetchDoctors = async () => {
    try {
      const response = await adminService.getAllDoctors();
      setDoctors(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách bác sĩ:', error);
    }
  };

  // ✅ Hàm lấy thời gian bắt đầu của lịch hẹn (dựa vào date + timeSlot)
  // Bền vững cho timeSlot: "09:00-09:30", "09:00 - 09:30", "09:00 – 09:30",...
  const getStartDateTime = (apt) => {
    const slot = (apt.timeSlot || '').trim();
    const m = slot.match(/\b\d{1,2}:\d{2}\b/); // lấy HH:mm đầu tiên
    const startTime = m ? m[0].padStart(5, '0') : '00:00';

    // Chuẩn hóa date về YYYY-MM-DD cho chắc (phòng trường hợp date là ISO)
    const d = new Date(apt.date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const ymd = `${yyyy}-${mm}-${dd}`;

    return new Date(`${ymd}T${startTime}`);
  };

  const fetchAppointments = async () => {
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.date) params.date = filters.date;
      if (filters.doctor) params.doctor = filters.doctor;

      const response = await adminService.getAllAppointments(params);

      // ✅ SẮP XẾP: gần hiện tại trước, xa hơn sau (tăng dần theo ngày giờ)
      const sorted = [...(response.data || [])].sort(
        (a, b) => getStartDateTime(a) - getStartDateTime(b)
      );

      setAppointments(sorted);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách lịch hẹn:', error);
    } finally {
      setLoading(false);
      setCurrentPage(1); // reset page khi filter thay đổi
    }
  };

  const handleEdit = (appointment) => {
    if (appointment.status === 'completed' || appointment.status === 'cancelled') return;

    setEditingAppointment(appointment._id);
    setEditForm({
      doctor: appointment.doctor._id,
      date: format(new Date(appointment.date), 'yyyy-MM-dd'),
      timeSlot: appointment.timeSlot,
      status: appointment.status,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdatingId(editingAppointment);
    try {
      await adminService.updateAppointment(editingAppointment, editForm);
      setEditingAppointment(null);
      fetchAppointments();
      alert('Cập nhật lịch hẹn thành công!');
    } catch (error) {
      alert(error.response?.data?.message || 'Cập nhật lịch hẹn thất bại');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Chờ Xác Nhận',
      confirmed: 'Đã Xác Nhận',
      completed: 'Đã Hoàn Thành',
      cancelled: 'Đã Hủy',
    };
    return labels[status] || status;
  };

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentAppointments = appointments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(appointments.length / itemsPerPage);

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Quản Lý Lịch Hẹn</h1>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Trạng Thái</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">Tất Cả</option>
                <option value="pending">Chờ Xác Nhận</option>
                <option value="confirmed">Đã Xác Nhận</option>
                <option value="completed">Đã Hoàn Thành</option>
                <option value="cancelled">Đã Hủy</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ngày</label>
              <input
                type="date"
                name="date"
                value={filters.date}
                onChange={handleFilterChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bác Sĩ</label>
              <select
                name="doctor"
                value={filters.doctor}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">Tất Cả Bác Sĩ</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFilters({ status: '', date: '', doctor: '' })}
                className="btn-secondary w-full"
              >
                Xóa Bộ Lọc
              </button>
            </div>
          </div>
        </div>

        {/* Appointments */}
        <div className="card">
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-gray-600">Không có lịch hẹn nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentAppointments.map((appointment) => (
                <div key={appointment._id} className="border border-gray-200 rounded-lg p-4">
                  {editingAppointment === appointment._id ? (
                    <form onSubmit={handleUpdate} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Bác Sĩ</label>
                          <select
                            value={editForm.doctor}
                            onChange={(e) => setEditForm({ ...editForm, doctor: e.target.value })}
                            className="input-field"
                            required
                          >
                            {doctors.map((doctor) => (
                              <option key={doctor._id} value={doctor._id}>
                                {doctor.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Ngày</label>
                          <input
                            type="date"
                            value={editForm.date}
                            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                            className="input-field"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Giờ</label>
                          <input
                            type="text"
                            value={editForm.timeSlot}
                            onChange={(e) => setEditForm({ ...editForm, timeSlot: e.target.value })}
                            className="input-field"
                            placeholder="09:00-09:30"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Trạng Thái</label>
                          <select
                            value={editForm.status}
                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                            className="input-field"
                            required
                          >
                            <option value="pending" disabled={appointment.status !== 'confirmed'}>
                              Chờ Xác Nhận
                            </option>
                            <option value="confirmed" disabled={appointment.status !== 'pending'}>
                              Đã Xác Nhận
                            </option>
                            <option value="completed" disabled>
                              Đã Hoàn Thành
                            </option>
                            <option
                              value="cancelled"
                              disabled={appointment.status === 'completed' || appointment.status === 'cancelled'}
                            >
                              Đã Hủy
                            </option>
                          </select>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button type="submit" disabled={updatingId === appointment._id} className="btn-primary">
                          {updatingId === appointment._id ? 'Đang Lưu...' : 'Lưu'}
                        </button>
                        <button type="button" onClick={() => setEditingAppointment(null)} className="btn-secondary">
                          Hủy
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex justify-between">
                      <div>
                        <p className="font-semibold">👤 {appointment.patient?.name}</p>
                        <p>👨‍⚕️ {appointment.doctor?.name}</p>
                        <p>
                          📅 {format(new Date(appointment.date), 'dd/MM/yyyy')} ⏰ {appointment.timeSlot}
                        </p>
                      </div>

                      <div className="text-right space-y-2">
                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusBadgeClass(appointment.status)}`}>
                          {getStatusLabel(appointment.status)}
                        </span>
                        <div>
                          {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                            <button onClick={() => handleEdit(appointment)} className="btn-secondary text-sm">
                              Chỉnh Sửa
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

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
        </div>
      </div>
    </div>
  );
};

export default ManageAppointments;
