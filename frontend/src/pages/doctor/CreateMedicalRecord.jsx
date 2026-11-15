import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { doctorService } from '../../services/doctorService';
import { medicalRecordService } from '../../services/medicalRecordService';

const CreateMedicalRecord = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const preSelectedPatientId = searchParams.get('patientId');

  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    patient: preSelectedPatientId || '',
    diagnosis: '',
    symptoms: '',
    notes: '',
    prescriptions: []
  });
  const [currentPrescription, setCurrentPrescription] = useState({
    medicineName: '',
    dosage: '',
    frequency: '',
    duration: '',
    note: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (preSelectedPatientId) {
      fetchPatientById(preSelectedPatientId);
    }
  }, [preSelectedPatientId]);

  const fetchPatientById = async (id) => {
    try {
      const response = await doctorService.getPatientById(id);
      setPatients([response.data.patient]);
    } catch (error) {
      console.error('Lỗi khi tải thông tin bệnh nhân:', error);
    }
  };

  const handleSearchPatientByPhone = async () => {
    if (!searchTerm) return;

    setLoading(true);
    try {
      // Gọi API gốc tìm theo số điện thoại
      const response = await doctorService.searchPatients({ search: searchTerm, limit: 1 });
      const patientList = response.data;

      if (patientList.length === 0) {
        alert('Không tìm thấy bệnh nhân');
        setFormData({ ...formData, patient: '' });
        setPatients([]);
        return;
      }

      // Lấy bệnh nhân đầu tiên
      const patient = patientList[0];
      setFormData({ ...formData, patient: patient._id });
      setPatients([patient]);
    } catch (err) {
      console.error(err);
      alert('Lỗi khi tìm bệnh nhân');
      setFormData({ ...formData, patient: '' });
      setPatients([]);
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

  const handlePrescriptionChange = (e) => {
    setCurrentPrescription({
      ...currentPrescription,
      [e.target.name]: e.target.value
    });
  };

  const addPrescription = () => {
    if (
      !currentPrescription.medicineName ||
      !currentPrescription.dosage ||
      !currentPrescription.frequency ||
      !currentPrescription.duration
    ) {
      alert('Vui lòng nhập đầy đủ thông tin đơn thuốc bắt buộc');
      return;
    }

    setFormData({
      ...formData,
      prescriptions: [...formData.prescriptions, currentPrescription]
    });

    setCurrentPrescription({
      medicineName: '',
      dosage: '',
      frequency: '',
      duration: '',
      note: ''
    });
  };

  const removePrescription = (index) => {
    setFormData({
      ...formData,
      prescriptions: formData.prescriptions.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.patient) {
      setError('Vui lòng nhập số điện thoại bệnh nhân và tìm bệnh nhân');
      return;
    }

    setSubmitting(true);

    try {
      await medicalRecordService.createMedicalRecord(formData);
      alert('Tạo hồ sơ bệnh án thành công!');
      navigate(`/doctor/patients/${formData.patient}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tạo hồ sơ bệnh án');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Tạo hồ sơ bệnh án
        </h1>

        <div className="card">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Nhập số điện thoại bệnh nhân */}
            {!preSelectedPatientId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nhập số điện thoại bệnh nhân
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSearchPatientByPhone();
                      }
                    }}
                    placeholder="Ví dụ: 0912345678"
                    className="input-field flex-1"
                  />
                  <button
                    type="button"
                    onClick={handleSearchPatientByPhone}
                    className="btn-secondary"
                    disabled={loading}
                  >
                    {loading ? 'Đang tìm...' : 'Tìm'}
                  </button>
                </div>

                {/* Hiển thị tên bệnh nhân */}
                {patients.length > 0 && (
                  <div className="p-2 bg-green-50 border border-green-200 rounded-md text-sm">
                    Bệnh nhân: {patients[0].name} - {patients[0].phone}
                  </div>
                )}
              </div>
            )}

            {/* Thông tin khám */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chẩn đoán *
              </label>
              <input
                type="text"
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                className="input-field"
                placeholder="Ví dụ: Cảm cúm, Viêm họng..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Triệu chứng *
              </label>
              <textarea
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                rows={3}
                className="input-field"
                placeholder="Mô tả triệu chứng của bệnh nhân..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú / Lời khuyên
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="input-field"
                placeholder="Ghi chú thêm, hướng dẫn điều trị hoặc tái khám..."
              />
            </div>

            {/* Đơn thuốc */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Đơn thuốc
              </h3>

              {formData.prescriptions.length > 0 && (
                <div className="mb-4 space-y-2">
                  {formData.prescriptions.map((prescription, index) => (
                    <div
                      key={index}
                      className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex justify-between items-start"
                    >
                      <div className="text-sm">
                        <strong className="text-gray-900">
                          💊 {prescription.medicineName}
                        </strong>
                        <p className="text-gray-700 mt-1">
                          {prescription.dosage} – {prescription.frequency} trong {prescription.duration}
                        </p>
                        {prescription.note && (
                          <p className="text-gray-600 mt-1 italic">
                            {prescription.note}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removePrescription(index)}
                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                      >
                        Xóa
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Thêm đơn thuốc */}
              <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                <h4 className="font-medium text-gray-900">
                  Thêm thuốc
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên thuốc
                    </label>
                    <input
                      type="text"
                      name="medicineName"
                      value={currentPrescription.medicineName}
                      onChange={handlePrescriptionChange}
                      className="input-field"
                      placeholder="Ví dụ: Paracetamol"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Liều lượng
                    </label>
                    <input
                      type="text"
                      name="dosage"
                      value={currentPrescription.dosage}
                      onChange={handlePrescriptionChange}
                      className="input-field"
                      placeholder="Ví dụ: 500mg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tần suất
                    </label>
                    <input
                      type="text"
                      name="frequency"
                      value={currentPrescription.frequency}
                      onChange={handlePrescriptionChange}
                      className="input-field"
                      placeholder="Ví dụ: Mỗi 6 tiếng"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thời gian dùng
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={currentPrescription.duration}
                      onChange={handlePrescriptionChange}
                      className="input-field"
                      placeholder="Ví dụ: 5 ngày"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ghi chú (không bắt buộc)
                    </label>
                    <input
                      type="text"
                      name="note"
                      value={currentPrescription.note}
                      onChange={handlePrescriptionChange}
                      className="input-field"
                      placeholder="Ví dụ: Uống sau khi ăn"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addPrescription}
                  className="btn-secondary"
                >
                  + Thêm thuốc
                </button>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate(-1)}
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
                {submitting ? 'Đang tạo...' : 'Tạo hồ sơ bệnh án'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateMedicalRecord;
