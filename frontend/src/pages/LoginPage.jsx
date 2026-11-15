import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
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
    setLoading(true);

    try {
      const response = await login(formData);

      if (response.data.user.role === 'patient') {
        navigate('/patient/dashboard');
      } else if (response.data.user.role === 'doctor') {
        navigate('/doctor/dashboard');
      } else if (response.data.user.role === 'admin') {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Đăng nhập thất bại.';

      setError(message);
    } finally {
      setLoading(false); // ✅ BẮT BUỘC chạy
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center">
            <span className="text-4xl">🏥</span>
            <span className="ml-2 text-2xl font-bold text-primary-600">
              Phòng Khám
            </span>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Đăng nhập vào tài khoản
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Hoặc{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
              đăng ký tài khoản bệnh nhân mới
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
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Địa chỉ Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input-field mt-1"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@clinic.com, doctor@clinic.com hoặc patient@test.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input-field mt-1"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary"
              disabled={loading}
            >
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-semibold text-gray-700 mb-2">Tài khoản Demo:</p>
            <div className="text-xs space-y-1 text-gray-600">
              <p><strong>Admin:</strong> admin@clinic.com / admin123</p>
              <p><strong>Bác sĩ:</strong> doctor1@clinic.com / doctor123</p>
              <p><strong>Bệnh nhân:</strong> patient1@test.com / patient123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
