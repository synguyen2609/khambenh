import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { adminService } from '../../services/adminService';
import { specialtyService } from '../../services/specialtyService';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    specialty: '',
    bio: '',
    yearsOfExperience: 0,
    isActive: true
  });
  const [errors, setErrors] = useState({}); // 🔹 state lưu lỗi

  useEffect(() => {
    fetchSpecialties();
    fetchDoctors();
  }, []);

  const fetchSpecialties = async () => {
    try {
      const response = await specialtyService.getAllSpecialties();
      setSpecialties(response.data);
    } catch (error) {
      console.error('Error fetching specialties:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await adminService.getAllDoctors();
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // 🔹 Xóa lỗi tương ứng khi user sửa
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await adminService.createDoctor(formData);
      alert('Tạo bác sĩ thành công!');
      resetForm();
      fetchDoctors();
    } catch (error) {
      if (error.response?.data?.message?.includes('Số điện thoại')) {
        setErrors({ phone: 'Số điện thoại này đã được sử dụng bởi người khác' });
      } else {
        alert(error.response?.data?.message || 'Tạo bác sĩ thất bại');
      }
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor._id);
    setFormData({
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone,
      password: '',
      specialty: doctor.specialty?._id || '',
      bio: doctor.bio || '',
      yearsOfExperience: doctor.yearsOfExperience || 0,
      isActive: doctor.isActive
    });
    setErrors({});
    setShowForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        phone: formData.phone,
        password: formData.password,
        specialty: formData.specialty,
        bio: formData.bio,
        yearsOfExperience: formData.yearsOfExperience,
        isActive: formData.isActive
      };

      if (!updateData.password) delete updateData.password;

      await adminService.updateDoctor(editingDoctor, updateData);

      alert('Cập nhật bác sĩ thành công!');
      resetForm();
      fetchDoctors();
    } catch (error) {
      // 🔹 Kiểm tra lỗi trùng phone
      if (error.response?.data?.message?.includes('Số điện thoại đã được sử dụng')) {
        setErrors({ phone: 'Số điện thoại này đã được sử dụng bởi người khác' });
      } else {
        alert(error.response?.data?.message || 'Cập nhật bác sĩ thất bại');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      specialty: '',
      bio: '',
      yearsOfExperience: 0,
      isActive: true
    });
    setErrors({});
    setShowForm(false);
    setEditingDoctor(null);
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Bác Sĩ</h1>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="btn-primary"
          >
            + Thêm Bác Sĩ
          </button>
        </div>

        {/* Create/Edit Form */}
        {showForm && (
          <div className="card mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingDoctor ? 'Chỉnh Sửa Bác Sĩ' : 'Thêm Bác Sĩ Mới'}
            </h2>
            <form onSubmit={editingDoctor ? handleUpdate : handleCreate} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên Bác Sĩ *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                     disabled={!!editingDoctor} // false khi tạo mới => input có thể điền
                    />
                    {editingDoctor && (
                      <p className="text-xs text-gray-500 mt-1">
                        Họ và tên không thể thay đổi
                      </p>
                    )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                     disabled={!!editingDoctor}
                  />
                  {editingDoctor && (
                    <p className="text-xs text-gray-500 mt-1">
                      Email không thể thay đổi
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số Điện Thoại *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`input-field ${errors.phone ? 'border-red-600' : ''}`}
                    required
                  />
                  {errors.phone && (
                    <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {editingDoctor ? 'Mật Khẩu Mới (để trống nếu không đổi)' : 'Mật Khẩu *'}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="input-field"
                    required={!editingDoctor}
                    minLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chuyên Khoa *
                  </label>
                  <select
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  >
                    <option value="">Chọn Chuyên Khoa</option>
                    {specialties.map((specialty) => (
                      <option key={specialty._id} value={specialty._id}>
                        {specialty.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số Năm Kinh Nghiệm
                  </label>
                  <input
                    type="number"
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleInputChange}
                    className="input-field"
                    min="0"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiểu Sử
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="input-field"
                    rows="3"
                  />
                </div>

                {editingDoctor && (
                  <div className="md:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Kích Hoạt</span>
                    </label>
                  </div>
                )}
              </div>

              <div className="flex space-x-2">
                <button type="submit" className="btn-primary">
                  {editingDoctor ? 'Cập Nhật' : 'Tạo Mới'}
                </button>
                <button type="button" onClick={resetForm} className="btn-secondary">
                  Hủy
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Doctors List */}
        <div className="card">
          {doctors.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👨‍⚕️</div>
              <p className="text-gray-600">Chưa có bác sĩ nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chuyên Khoa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kinh Nghiệm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng Thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao Tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {doctors.map((doctor) => (
                    <tr key={doctor._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                        <div className="text-sm text-gray-500">{doctor.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{doctor.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{doctor.specialty?.name || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{doctor.yearsOfExperience || 0} năm</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          doctor.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {doctor.isActive ? 'Hoạt Động' : 'Vô Hiệu Hóa'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(doctor)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          Chỉnh Sửa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageDoctors;
