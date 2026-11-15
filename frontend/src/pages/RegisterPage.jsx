import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dob: '',
    gender: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registrationData } = formData;
      await register(registrationData);
      navigate('/patient/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center">
            <span className="text-4xl">🏥</span>
            <span className="ml-2 text-2xl font-bold text-primary-600">
              Phòng Khám
            </span>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Đăng Ký Bệnh Nhân
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Đăng nhập
            </Link>
          </p>
        </div>

        <div className="card">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Họ và Tên *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="input-field mt-1"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="input-field mt-1"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Số Điện Thoại *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="input-field mt-1"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                  Ngày Sinh *
                </label>
                <input
                  id="dob"
                  name="dob"
                  type="date"
                  required
                  className="input-field mt-1"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Giới Tính *
                </label>
                <select
                  id="gender"
                  name="gender"
                  required
                  className="input-field mt-1"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mật Khẩu *
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="input-field mt-1"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={6}
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Xác Nhận Mật Khẩu *
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="input-field mt-1"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  minLength={6}
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Địa Chỉ (Tùy chọn)
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  className="input-field mt-1"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-primary"
              disabled={loading}
            >
              {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
