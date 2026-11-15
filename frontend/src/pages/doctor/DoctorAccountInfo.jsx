import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { format } from 'date-fns';

const DoctorAccountInfo = () => {
  const { user, updateUser } = useAuth();
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctorInfo();
  }, []);

  const fetchDoctorInfo = async () => {
    try {
      // Get fresh data from backend
      const response = await authService.getMe();
      setDoctorData(response.data);
      updateUser(response.data); // Update context with fresh data
    } catch (error) {
      console.error('Lỗi khi tải thông tin tài khoản:', error);
      // Fallback to user from context
      setDoctorData(user);
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

  const doctor = doctorData || user;

  if (!doctor || doctor.role !== 'doctor') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card text-center py-12">
            <p className="text-gray-600">Không tìm thấy thông tin tài khoản</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Thông tin tài khoản</h1>

        <div className="card">
          <div className="flex items-start space-x-6 mb-6">
            <div className="text-6xl">👨‍⚕️</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{doctor.name}</h2>
              <p className="text-gray-600">Thông tin chi tiết tài khoản bác sĩ</p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                doctor.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {doctor.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6 pt-6 border-t">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Họ và tên
              </label>
              <p className="text-gray-900 text-lg">{doctor.name}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <p className="text-gray-900 text-lg">{doctor.email}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Số điện thoại
              </label>
              <p className="text-gray-900 text-lg">{doctor.phone}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Chuyên khoa
              </label>
              <p className="text-gray-900 text-lg">
                {doctor.specialty?.name || 'Chưa có chuyên khoa'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kinh nghiệm
              </label>
              <p className="text-gray-900 text-lg">
                {doctor.yearsOfExperience || 0} năm
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Loại tài khoản
              </label>
              <p className="text-gray-900 text-lg">Bác sĩ</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tham gia từ
              </label>
              <p className="text-gray-900 text-lg">
                {format(new Date(doctor.createdAt), 'dd/MM/yyyy')}
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Trạng thái tài khoản
              </label>
              <p className="text-gray-900 text-lg">
                {doctor.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}
              </p>
            </div>

            {doctor.bio && (
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tiểu sử
                </label>
                <p className="text-gray-900">{doctor.bio}</p>
              </div>
            )}

            {doctor.address && (
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Địa chỉ
                </label>
                <p className="text-gray-900">{doctor.address}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorAccountInfo;

