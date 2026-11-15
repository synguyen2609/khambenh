import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Patient pages
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientProfile from './pages/patient/PatientProfile';
import PatientAppointments from './pages/patient/PatientAppointments';
import BookAppointment from './pages/patient/BookAppointment';
import PatientMedicalRecords from './pages/patient/PatientMedicalRecords';

// Doctor pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import DoctorPatients from './pages/doctor/DoctorPatients';
import PatientDetail from './pages/doctor/PatientDetail';
import CreateMedicalRecord from './pages/doctor/CreateMedicalRecord';
import DoctorAccountInfo from './pages/doctor/DoctorAccountInfo';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageAppointments from './pages/admin/ManageAppointments';
import ManageDoctors from './pages/admin/ManageDoctors';
import ManageUsers from './pages/admin/ManageUsers';
import ManageSpecialties from './pages/admin/ManageSpecialties';
import ManagePatients from './pages/admin/ManagePatients';
import AdminPatientDetail from './pages/admin/AdminPatientDetail';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Patient routes */}
          <Route
            path="/patient/dashboard"
            element={
              <ProtectedRoute role="patient">
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/profile"
            element={
              <ProtectedRoute role="patient">
                <PatientProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/appointments"
            element={
              <ProtectedRoute role="patient">
                <PatientAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/book-appointment"
            element={
              <ProtectedRoute role="patient">
                <BookAppointment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/medical-records"
            element={
              <ProtectedRoute role="patient">
                <PatientMedicalRecords />
              </ProtectedRoute>
            }
          />

          {/* Doctor routes */}
          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute role="doctor">
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/appointments"
            element={
              <ProtectedRoute role="doctor">
                <DoctorAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/patients"
            element={
              <ProtectedRoute role="doctor">
                <DoctorPatients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/patients/:id"
            element={
              <ProtectedRoute role="doctor">
                <PatientDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/medical-records/create"
            element={
              <ProtectedRoute role="doctor">
                <CreateMedicalRecord />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor/account"
            element={
              <ProtectedRoute role="doctor">
                <DoctorAccountInfo />
              </ProtectedRoute>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/appointments"
            element={
              <ProtectedRoute role="admin">
                <ManageAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/doctors"
            element={
              <ProtectedRoute role="admin">
                <ManageDoctors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="admin">
                <ManageUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/specialties"
            element={
              <ProtectedRoute role="admin">
                <ManageSpecialties />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/patients"
            element={
              <ProtectedRoute role="admin">
                <ManagePatients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/patients/:id"
            element={
              <ProtectedRoute role="admin">
                <AdminPatientDetail />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;



