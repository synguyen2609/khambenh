import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { patientService } from '../../services/patientService';
import { appointmentService } from '../../services/appointmentService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all'); // all | upcoming | past
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  // ===== PHÂN TRANG =====
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    fetchAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const getStartDateTime = (apt) => {
    // timeSlot có thể là: "08:00 - 09:00", "08:00-09:00", "08:00 – 09:00",...
    const slot = (apt.timeSlot || '').trim();
    const m = slot.match(/\b\d{1,2}:\d{2}\b/); // lấy HH:mm đầu tiên
    const startTime = m ? m[0].padStart(5, '0') : '00:00';

    // apt.date kỳ vọng: "YYYY-MM-DD"
    // nếu backend trả ISO "2025-01-01T00:00:00.000Z" thì new Date(apt.date) vẫn ok,
    // nhưng template `${apt.date}T${startTime}` chỉ hợp khi apt.date là YYYY-MM-DD.
    // Để bền vững: chuẩn hóa date về YYYY-MM-DD trước.
    const d = new Date(apt.date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const ymd = `${yyyy}-${mm}-${dd}`;

    return new Date(`${ymd}T${startTime}`);
  };

  const isUpcoming = (apt) => apt.status === 'pending' || apt.status === 'confirmed';
  const isPast = (apt) => apt.status === 'completed' || apt.status === 'cancelled';

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await patientService.getMyAppointments();
      let data = response.data || [];

      const now = new Date();

      // ===== FILTER + SORT (tối thiểu theo yêu cầu) =====
      const sortAsc = (a, b) => getStartDateTime(a) - getStartDateTime(b); // quá khứ -> tương lai

      if (filter === 'upcoming') {
        // Sắp tới: pending/confirmed và từ hiện tại -> tương lai
        data = data.filter((apt) => isUpcoming(apt) && getStartDateTime(apt) >= now);
        data.sort(sortAsc);
      } else if (filter === 'past') {
        // Đã qua: completed/cancelled, sắp xếp quá khứ -> hiện tại
        data = data.filter((apt) => isPast(apt));
        data.sort(sortAsc);
      } else {
        // All: hiện tất cả và sắp xếp theo ngày giờ tăng dần
        data.sort(sortAsc);
      }

      setAppointments(data);
      setCurrentPage(1);
    } catch (error) {
      console.error('Lỗi khi lấy lịch hẹn:', error);
    } finally {
      setLoading(false);
    }
  };

  const canCancel = (appointment) => {
    // giữ nguyên logic gốc của bạn (so theo ngày)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const aptDate = new Date(appointment.date);
    aptDate.setHours(0, 0, 0, 0);

    return appointment.status === 'pending' && aptDate >= today;
  };

  const handleCancel = async (appointmentId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy lịch hẹn này không?')) return;

    setCancellingId(appointmentId);
    try {
      await appointmentService.cancelAppointment(appointmentId, {
        cancelNote: 'Hủy bởi bệnh nhân',
      });
      fetchAppointments();
    } catch (error) {
      alert(error.response?.data?.message || 'Hủy lịch hẹn thất bại');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return `px-3 py-1 rounded-full text-sm font-medium ${
      classes[status] || 'bg-gray-100 text-gray-800'
    }`;
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

  // ===== PHÂN TRANG =====
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Lịch Hẹn Của Tôi</h1>
          <Link to="/patient/book-appointment" className="btn-primary">
            + Đặt Lịch Mới
          </Link>
        </div>

        {/* FILTER */}
        <div className="card mb-6 flex space-x-4">
          {['all', 'upcoming', 'past'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === type
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {type === 'all' ? 'Tất Cả' : type === 'upcoming' ? 'Sắp Tới' : 'Đã Qua'}
            </button>
          ))}
        </div>

        {/* LIST */}
        {currentAppointments.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <p className="text-gray-600">Không có lịch hẹn</p>
          </div>
        ) : (
          <div className="space-y-4">
            {currentAppointments.map((apt) => (
              <div key={apt._id} className="card">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg">{apt.doctor?.name}</h3>
                      <span className={getStatusBadgeClass(apt.status)}>
                        {getStatusLabel(apt.status)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600">{apt.doctor?.specialty?.name}</p>

                    <div className="mt-2 text-sm space-y-1">
                      <div>
                        📅{' '}
                        {format(new Date(apt.date), 'EEEE, dd/MM/yyyy', {
                          locale: vi,
                        })}
                      </div>
                      <div>⏰ {apt.timeSlot}</div>
                      <div>📝 {apt.reason}</div>
                    </div>

                    {apt.cancelNote && (
                      <div className="mt-3 text-sm text-red-700 bg-red-50 p-2 rounded">
                        <strong>Lý do hủy:</strong> {apt.cancelNote}
                      </div>
                    )}
                  </div>

                  {canCancel(apt) && (
                    <button
                      onClick={() => handleCancel(apt._id)}
                      className="btn-danger text-sm"
                      disabled={cancellingId === apt._id}
                    >
                      {cancellingId === apt._id ? 'Đang hủy...' : 'Hủy'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
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
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1 ? 'bg-primary-600 text-white' : 'btn-secondary'
                }`}
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
    </div>
  );
};

export default PatientAppointments;
