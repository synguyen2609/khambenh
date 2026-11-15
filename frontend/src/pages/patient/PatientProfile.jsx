import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { patientService } from '../../services/patientService';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

const PatientProfile = () => {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    dob: '',
    gender: ''
  });
  const [errors, setErrors] = useState({}); // 🔹 state lưu lỗi
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await patientService.getMyProfile();
      const patient = response.data.patient;

      setProfile(patient);
      setFormData({
        name: patient.name || '',
        phone: patient.phone || '',
        address: patient.address || '',
        dob: patient.dob ? format(new Date(patient.dob), 'yyyy-MM-dd') : '',
        gender: patient.gender || ''
      });
    } catch (error) {
      console.error('Lỗi khi tải hồ sơ:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // 🔹 Xóa lỗi tương ứng khi sửa
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      // Chỉ gửi những trường được phép cập nhật
      const { name, dob, gender, ...updateData } = formData;

      const response = await patientService.updateMyProfile(updateData);
      updateUser(response.data);

      setMessage({ type: 'success', text: 'Cập nhật hồ sơ thành công!' });
    } catch (error) {
      // 🔹 Xử lý lỗi trùng số điện thoại
      if (error.response?.status === 400 && error.response?.data?.error) {
        setErrors({ phone: error.response.data.error });
        setMessage({ type: 'error', text: '' }); // không hiển thị message chung
      } else {
        setMessage({
          type: 'error',
          text: 'Cập nhật hồ sơ thất bại'
        });
      }
    } finally {
      setSaving(false);
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Hồ sơ cá nhân
        </h1>

        <div className="card">
          {message.text && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Họ và tên (không cho sửa) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={formData.name}
                  className="input-field bg-gray-100"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">
                  Họ và tên không thể thay đổi
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profile?.email || ''}
                  className="input-field bg-gray-100"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email không thể thay đổi
                </p>
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`input-field ${errors.phone ? 'border-red-600' : ''}`}
                  required
                />
                {errors.phone && (
                  <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Ngày sinh (không cho sửa) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  value={formData.dob}
                  className="input-field bg-gray-100"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ngày sinh không thể thay đổi
                </p>
              </div>

              {/* Giới tính (không cho sửa) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giới tính
                </label>
                <select
                  value={formData.gender}
                  className="input-field bg-gray-100"
                  disabled
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Giới tính không thể thay đổi
                </p>
              </div>

              {/* Địa chỉ */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="input-field"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={fetchProfile}
                className="btn-secondary"
                disabled={saving}
              >
                Đặt lại
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={saving}
              >
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        </div>

        {/* Thông tin tài khoản */}
        <div className="card mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Thông tin tài khoản
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Loại tài khoản:</span>
              <span className="font-medium">Bệnh nhân</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Tham gia từ:</span>
              <span className="font-medium">
                {profile?.createdAt &&
                  format(new Date(profile.createdAt), 'dd/MM/yyyy')}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Trạng thái:</span>
              <span className="font-medium text-green-600">Hoạt động</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
