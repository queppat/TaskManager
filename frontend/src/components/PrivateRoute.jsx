import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../hooks/useAuth';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        Loading...
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default PrivateRoute;