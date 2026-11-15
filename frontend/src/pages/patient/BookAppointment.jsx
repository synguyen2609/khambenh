import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { doctorService } from '../../services/doctorService';
import { appointmentService } from '../../services/appointmentService';

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    doctor: '',
    date: '',
    timeSlot: '',
    reason: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const timeSlots = [
    '09:00-09:30', '09:30-10:00', '10:00-10:30', '10:30-11:00',
    '11:00-11:30', '11:30-12:00', '14:00-14:30', '14:30-15:00',
    '15:00-15:30', '15:30-16:00', '16:00-16:30', '16:30-17:00'
  ];

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await doctorService.getAllDoctors();
      setDoctors(response.data);
    } catch (error) {
      console.error('Lỗi tải danh sách bác sĩ:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await appointmentService.createAppointment(formData);
      alert('Đặt lịch hẹn thành công!');
      navigate('/patient/appointments');
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể đặt lịch hẹn');
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

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
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Đặt Lịch Hẹn Mới</h1>

        <div className="card">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chọn Bác Sĩ *
              </label>
              <select
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Chọn bác sĩ</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name} - {doctor.specialty?.name}
                  </option>
                ))}
              </select>
            </div>

            {formData.doctor && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                {doctors.find(d => d._id === formData.doctor) && (
                  <div>
                    <p className="font-semibold text-gray-900">
                      {doctors.find(d => d._id === formData.doctor).name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {doctors.find(d => d._id === formData.doctor).specialty?.name}
                    </p>
                    {doctors.find(d => d._id === formData.doctor).bio && (
                      <p className="text-sm text-gray-600 mt-2">
                        {doctors.find(d => d._id === formData.doctor).bio}
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mt-2">
                      Kinh nghiệm: {doctors.find(d => d._id === formData.doctor).yearsOfExperience} năm
                    </p>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày Khám *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={today}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Khung Giờ *
              </label>
              <select
                name="timeSlot"
                value={formData.timeSlot}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Chọn khung giờ</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lý Do Khám *
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows={4}
                className="input-field"
                placeholder="Vui lòng mô tả triệu chứng hoặc lý do khám..."
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/patient/appointments')}
                className="btn-secondary"
                disabled={submitting}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Đang đặt lịch...' : 'Đặt Lịch Hẹn'}
              </button>
            </div>
          </form>
        </div>

        {/* Information Card */}
        <div className="card mt-6 bg-yellow-50 border border-yellow-200">
          <h3 className="font-semibold text-gray-900 mb-2">📌 Lưu Ý Quan Trọng</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Lịch hẹn có thể hủy trước 24 giờ</li>
            <li>• Vui lòng đến sớm 10 phút trước giờ hẹn</li>
            <li>• Mang theo giấy tờ y tế liên quan (nếu có)</li>
            <li>• Bạn sẽ nhận được xác nhận sau khi bác sĩ duyệt lịch hẹn</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
