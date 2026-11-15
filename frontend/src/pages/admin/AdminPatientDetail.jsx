import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { adminService } from '../../services/adminService';
import { format } from 'date-fns';

const AdminPatientDetail = () => {
  const { id } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info'); // info, records
  const [showEditForm, setShowEditForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    dob: '',
    gender: '',
    isActive: true
  });
  const [errors, setErrors] = useState({}); // Lưu lỗi form

  useEffect(() => {
    fetchPatientDetail();
  }, [id]);

  const fetchPatientDetail = async () => {
    try {
      const response = await adminService.getPatientById(id);
      setPatientData(response.data);
      setFormData({
        name: response.data.patient.name,
        phone: response.data.patient.phone,
        address: response.data.patient.address || '',
        dob: response.data.patient.dob ? format(new Date(response.data.patient.dob), 'yyyy-MM-dd') : '',
        gender: response.data.patient.gender || '',
        isActive: response.data.patient.isActive
      });
    } catch (error) {
      console.error('Lỗi khi tải chi tiết bệnh nhân:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGenderLabel = (gender) => {
    if (!gender) return '';
    const g = gender.toLowerCase();
    if (g === 'male' || g === 'm') return 'Nam';
    if (g === 'female' || g === 'f') return 'Nữ';
    return gender;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Xóa lỗi khi người dùng sửa input
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setErrors({}); // reset lỗi
      await adminService.updatePatient(id, formData);
      setShowEditForm(false);
      fetchPatientDetail();
    } catch (error) {
      const msg = error.response?.data?.message || 'Cập nhật thất bại';
      // Nếu lỗi liên quan số điện thoại
      if (msg.toLowerCase().includes('số điện thoại')) {
        setErrors({ phone: 'Số điện thoại này đã được sử dụng bởi người khác' });
      } else {
        setErrors({ general: msg });
      }
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

  if (!patientData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="card text-center py-12">
            <p className="text-gray-600">Không tìm thấy bệnh nhân</p>
          </div>
        </div>
      </div>
    );
  }

  const { patient, medicalRecords } = patientData;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            to="/admin/patients"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Quay lại danh sách bệnh nhân
          </Link>
        </div>

        {/* Thông tin tổng quan bệnh nhân */}
        <div className="card mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="text-5xl">👤</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{patient.name}</h1>
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-medium text-gray-900">{patient.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Số điện thoại:</span>
                    <p className="font-medium text-gray-900">{patient.phone}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Ngày sinh:</span>
                    <p className="font-medium text-gray-900">
                      {format(new Date(patient.dob), 'dd/MM/yyyy')}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Giới tính:</span>
                    <p className="font-medium text-gray-900">{getGenderLabel(patient.gender)}</p>
                  </div>
                </div>
                {patient.address && (
                  <div className="mt-3">
                    <span className="text-sm text-gray-600">Địa chỉ:</span>
                    <p className="text-sm text-gray-900">{patient.address}</p>
                  </div>
                )}
              </div>
            </div>
            <span
              className={`badge ${patient.isActive ? 'badge-completed' : 'badge-cancelled'}`}
            >
              {patient.isActive ? 'Đang hoạt động' : 'Ngưng hoạt động'}
            </span>
          </div>

          {!showEditForm && (
            <div className="mt-4">
              <button
                onClick={() => setShowEditForm(true)}
                className="btn-primary"
              >
                Chỉnh sửa thông tin
              </button>
            </div>
          )}
        </div>

        {/* Form chỉnh sửa */}
        {showEditForm && (
          <div className="card mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Chỉnh sửa thông tin bệnh nhân</h2>
            {errors.general && <p className="text-red-600 text-sm mb-2">{errors.general}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Họ và tên */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    className="input-field bg-gray-100"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Họ và tên không thể thay đổi</p>
                </div>

                {/* Số điện thoại */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`input-field ${errors.phone ? 'border-red-600' : ''}`}
                    required
                  />
                  {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                </div>

                {/* Ngày sinh */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày sinh
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    className="input-field bg-gray-100"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Ngày sinh không thể thay đổi</p>
                </div>

                {/* Giới tính */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giới tính
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    className="input-field bg-gray-100"
                    disabled
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Giới tính không thể thay đổi</p>
                </div>

                {/* Địa chỉ */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="input-field"
                  />
                </div>

                {/* Trạng thái */}
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Đang hoạt động</span>
                  </label>
                </div>
              </div>

              <div className="flex space-x-2">
                <button type="submit" className="btn-primary">
                  Lưu thay đổi
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="btn-secondary"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabs */}
        <div className="card mb-6">
          <div className="flex space-x-4 border-b">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'info'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Thông tin bệnh nhân
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'records'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Hồ sơ bệnh án ({medicalRecords.length})
            </button>
          </div>
        </div>

        {/* Nội dung tab */}
        {activeTab === 'info' && (
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Thông tin chi tiết bệnh nhân
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-gray-700">Họ và tên</label>
                <p className="text-gray-900 mt-1">{patient.name}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Email</label>
                <p className="text-gray-900 mt-1">{patient.email}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Số điện thoại</label>
                <p className="text-gray-900 mt-1">{patient.phone}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Ngày sinh</label>
                <p className="text-gray-900 mt-1">
                  {format(new Date(patient.dob), 'dd/MM/yyyy')}
                </p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Giới tính</label>
                <p className="text-gray-900 mt-1">{getGenderLabel(patient.gender)}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700">Tham gia từ</label>
                <p className="text-gray-900 mt-1">
                  {format(new Date(patient.createdAt), 'dd/MM/yyyy')}
                </p>
              </div>
              {patient.address && (
                <div className="md:col-span-2">
                  <label className="text-sm font-semibold text-gray-700">Địa chỉ</label>
                  <p className="text-gray-900 mt-1">{patient.address}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'records' && (
          <div className="space-y-4">
            {medicalRecords.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-600 mb-4">Chưa có hồ sơ bệnh án</p>
              </div>
            ) : (
              medicalRecords.map((record) => (
                <div key={record._id} className="card">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {record.diagnosis}
                      </h3>
                      <span className="text-sm text-gray-600">
                        {format(new Date(record.createdAt), 'dd/MM/yyyy')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Bác sĩ {record.doctor?.name}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Triệu chứng</label>
                      <p className="text-gray-900 mt-1">{record.symptoms}</p>
                    </div>
                    {record.notes && (
                      <div>
                        <label className="text-sm font-semibold text-gray-700">Ghi chú</label>
                        <p className="text-gray-900 mt-1">{record.notes}</p>
                      </div>
                    )}
                    {record.prescriptions && record.prescriptions.length > 0 && (
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-2 block">Đơn thuốc</label>
                        <div className="space-y-2">
                          {record.prescriptions.map((prescription, index) => (
                            <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                              <strong>{prescription.medicineName}</strong> - {prescription.dosage}
                              <br />
                              {prescription.frequency} trong {prescription.duration}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPatientDetail;
