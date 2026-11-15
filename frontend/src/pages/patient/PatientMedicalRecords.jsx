import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { patientService } from '../../services/patientService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const PatientMedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await patientService.getMyMedicalRecords();
      setRecords(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy hồ sơ:', error);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Hồ sơ bệnh án của tôi</h1>

        {records.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-600">Không tìm thấy hồ sơ bệnh án</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Danh sách hồ sơ */}
            <div className="space-y-4">
              {records.map((record) => (
                <div
                  key={record._id}
                  onClick={() =>
                    setSelectedRecord(
                      selectedRecord?._id === record._id ? null : record
                    )
                  }
                  className={`card cursor-pointer transition-all ${
                    selectedRecord?._id === record._id
                      ? 'ring-2 ring-primary-500 shadow-lg'
                      : 'hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xl">📋</span>
                        <h3 className="font-semibold text-gray-900">
                          {record.diagnosis}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Bs. {record.doctor?.name} - {record.doctor?.specialty?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {record.appointment?.date
                          ? format(new Date(record.appointment.date), 'dd/MM/yyyy', { locale: vi })
                          : format(new Date(record.createdAt), 'dd/MM/yyyy', { locale: vi })}
                      </p>
                    </div>
                    {selectedRecord?._id === record._id && (
                      <span className="text-primary-600 font-semibold">→</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Chi tiết hồ sơ */}
            <div className="lg:sticky lg:top-8 lg:h-fit transition-all duration-300">
              {selectedRecord ? (
                <div className="card">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Chi tiết hồ sơ
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-semibold text-gray-700">Ngày</label>
                      <p className="text-gray-900 mt-1">
                        {selectedRecord.appointment?.date
                          ? format(
                              new Date(selectedRecord.appointment.date),
                              "EEEE, dd 'Tháng' MM, yyyy",
                              { locale: vi }
                            )
                          : format(
                              new Date(selectedRecord.createdAt),
                              "EEEE, dd 'Tháng' MM, yyyy",
                              { locale: vi }
                            )}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700">Bác sĩ</label>
                      <p className="text-gray-900 mt-1">
                        {selectedRecord.doctor?.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedRecord.doctor?.specialty?.name}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700">Chẩn đoán</label>
                      <p className="text-gray-900 mt-1">{selectedRecord.diagnosis}</p>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700">Triệu chứng</label>
                      <p className="text-gray-900 mt-1">{selectedRecord.symptoms}</p>
                    </div>

                    {selectedRecord.notes && (
                      <div>
                        <label className="text-sm font-semibold text-gray-700">Ghi chú</label>
                        <p className="text-gray-900 mt-1">{selectedRecord.notes}</p>
                      </div>
                    )}

                    {selectedRecord.prescriptions && selectedRecord.prescriptions.length > 0 && (
                      <div>
                        <label className="text-sm font-semibold text-gray-700 mb-3 block">
                          Đơn thuốc
                        </label>

                        <div
                          className={`space-y-3 ${
                            selectedRecord.prescriptions.length > 2 ? 'max-h-80 overflow-y-auto' : ''
                          }`}
                        >
                          {selectedRecord.prescriptions.map((prescription, index) => (
                            <div
                              key={index}
                              className="p-4 bg-blue-50 border border-blue-200 rounded-lg"
                            >
                              <h4 className="font-semibold text-gray-900 mb-2">
                                💊 {prescription.medicineName}
                              </h4>
                              <div className="text-sm space-y-1 text-gray-700">
                                <p><strong>Liều lượng:</strong> {prescription.dosage}</p>
                                <p><strong>Tần suất:</strong> {prescription.frequency}</p>
                                <p><strong>Thời gian:</strong> {prescription.duration}</p>
                                {prescription.note && (
                                  <p><strong>Ghi chú:</strong> {prescription.note}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="card text-center py-12">
                  <div className="text-4xl mb-4">👈</div>
                  <p className="text-gray-600">
                    Chọn một hồ sơ để xem chi tiết
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientMedicalRecords;
