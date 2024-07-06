import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  component: React.ComponentType;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component }) => {
  const token = localStorage.getItem('token');

  return token ? <Component /> : <Navigate to="/login" />;
};

export default PrivateRoute;
