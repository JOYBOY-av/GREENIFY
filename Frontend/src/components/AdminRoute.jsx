import { useAdmin } from '../context/AdminContext';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const { adminToken } = useAdmin();
  const { user } = useContext(AuthContext);

  if (!adminToken && user?.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
}
