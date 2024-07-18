// App.tsx
import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Home from './components/Home';

import Login from './components/Login';
import Register from './components/Register';
import PriceData from './components/PriceData';
import HobbyBoard from './components/HobbyBoard';
import PostStepOne from './components/PostStepOne';
import PostStepTwo from './components/PostStepTwo';
import NotFound from './components/NotFound';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider, AuthContext } from './components/AuthContext';

const App: React.FC = () => {
  useEffect(() => {
    axios.interceptors.request.use(
      (config) => {
        const token = Cookies.get('token');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }, []);

  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

const AppRoutes: React.FC = () => {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/home" /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/home" /> : <Register />} />
      <Route path="/" element={<Navigate replace to={isAuthenticated ? "/home" : "/login"} />} />
      <Route path="/not-found" element={<NotFound />} />
      
      <Route path="/home" element={<PrivateRoute component={Home} />} />
      <Route path="/price_data" element={<PrivateRoute component={PriceData} />} />
      <Route path="/hobby_board" element={<PrivateRoute component={HobbyBoard} />} />
      <Route path="/post-step-one" element={<PrivateRoute component={PostStepOne} />} />
      <Route path="/post-step-two" element={<PrivateRoute component={PostStepTwo} />} />
      <Route path="*" element={<Navigate to="/not-found" />} />
    </Routes>
  );
}

export default App;