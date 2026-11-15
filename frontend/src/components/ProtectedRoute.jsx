import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    // Redirect to appropriate dashboard based on role
    let redirectPath = '/patient/dashboard';
    if (user.role === 'doctor') {
      redirectPath = '/doctor/dashboard';
    } else if (user.role === 'admin') {
      redirectPath = '/admin/dashboard';
    }
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;



