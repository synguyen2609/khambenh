import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { specialtyService } from '../../services/specialtyService';

const ManageSpecialties = () => {
  const [specialties, setSpecialties] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const fetchSpecialties = async () => {
    try {
      const response = await specialtyService.getAllSpecialties();
      setSpecialties(response.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách chuyên khoa:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (specialty = null) => {
    if (specialty) {
      setEditingId(specialty._id);
      setFormData({
        name: specialty.name,
        description: specialty.description || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        description: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      name: '',
      description: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        await specialtyService.updateSpecialty(editingId, formData);
      } else {
        await specialtyService.createSpecialty(formData);
      }
      fetchSpecialties();
      handleCloseModal();
    } catch (error) {
      alert(error.response?.data?.message || 'Lưu chuyên khoa thất bại');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa chuyên khoa này không?')) {
      return;
    }

    try {
      await specialtyService.deleteSpecialty(id);
      fetchSpecialties();
    } catch (error) {
      alert(error.response?.data?.message || 'Xóa chuyên khoa thất bại');
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
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý chuyên khoa
          </h1>
          <button onClick={() => handleOpenModal()} className="btn-primary">
            + Thêm chuyên khoa
          </button>
        </div>

        {specialties.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">🏥</div>
            <p className="text-gray-600 mb-4">
              Chưa có chuyên khoa nào
            </p>
            <button onClick={() => handleOpenModal()} className="btn-primary">
              Tạo chuyên khoa đầu tiên
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {specialties.map((specialty) => (
              <div key={specialty._id} className="card">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {specialty.name}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleOpenModal(specialty)}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(specialty._id)}
                      className="text-red-600 hover:text-red-700 font-medium text-sm"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  {specialty.description || 'Chưa có mô tả'}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Hộp thoại */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {editingId ? 'Chỉnh sửa chuyên khoa' : 'Thêm chuyên khoa mới'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên chuyên khoa *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Ví dụ: Tim mạch"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="input-field"
                    placeholder="Mô tả ngắn gọn về chuyên khoa..."
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
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
                    {submitting ? 'Đang lưu...' : 'Lưu'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageSpecialties;

