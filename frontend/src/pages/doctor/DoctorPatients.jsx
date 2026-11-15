import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { doctorService } from '../../services/doctorService';
import { format } from 'date-fns';
import { translateGender } from '../../utils/translations';

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async (searchTerm = '') => {
    setLoading(true);
    try {
      const response = await doctorService.searchPatients({
        search: searchTerm,
        limit: 20
      });
      setPatients(response.data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách bệnh nhân:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPatients(search);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Quản lý bệnh nhân</h1>

        {/* Search */}
        <div className="card mb-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <input
              type="text"
              placeholder="Tìm theo tên, email hoặc số điện thoại..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field flex-1"
            />
            <button className="btn-primary" disabled={loading}>
              {loading ? 'Đang tìm...' : 'Tìm kiếm'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setSearch('');
                fetchPatients('');
              }}
            >
              Xóa
            </button>
          </form>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex justify-center h-64">
            <div className="animate-spin h-12 w-12 border-b-2 border-primary-600 rounded-full"></div>
          </div>
        ) : patients.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <p>Không tìm thấy bệnh nhân nào</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {patients.map((patient) => (
                <Link
                  key={patient._id}
                  to={`/doctor/patients/${patient._id}`}
                  className="card hover:shadow-lg"
                >
                  <h3 className="font-semibold text-lg truncate">
                    {patient.name}
                  </h3>

                  <div className="mt-2 text-sm text-gray-600 space-y-1">
                    <p>📧 {patient.email}</p>
                    <p>📞 {patient.phone}</p>
                    <p>🎂 {format(new Date(patient.dob), 'dd/MM/yyyy')}</p>
                    <p>⚧ {translateGender(patient.gender)}</p>
                  </div>

                  <div className="mt-3">
                    <span
                      className={`badge ${
                        patient.isActive
                          ? 'badge-completed'
                          : 'badge-cancelled'
                      }`}
                    >
                      {patient.isActive
                        ? 'Đang hoạt động'
                        : 'Ngưng hoạt động'}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="card mt-6 bg-blue-50">
              Tổng số bệnh nhân: <b>{patients.length}</b>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorPatients;
