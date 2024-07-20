import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Home from './components/Home';
import PriceDataSelection from './components/PriceDataSelection';
import Login from './components/Login';
import Register from './components/Register';
import PriceData from './components/PriceData';
import HobbyBoard from './components/HobbyBoard';
import TopHobbyBoard from './components/TopHobbyBoard'; // Import TopHobbyBoard
import LatestHobbyBoard from './components/LatestHobbyBoard'; // Import LatestHobbyBoard
import PostStepOne from './components/PostStepOne';
import PostStepTwo from './components/PostStepTwo';
import NotFound from './components/NotFound';
import PrivateRoute from './components/PrivateRoute';
import PriceDataDetail from './components/PriceDataDetail';
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
      <Route path="/price_data" element={<PrivateRoute component={PriceDataSelection} />} />
      <Route path="/price_data/:product" element={<PrivateRoute component={PriceData} />} />
      <Route path="/price_data/:product/:id" element={<PrivateRoute component={PriceDataDetail} />} />
      <Route path="/hobby_board" element={<PrivateRoute component={HobbyBoard} />} />
      <Route path="/top_hobby_board" element={<PrivateRoute component={TopHobbyBoard} />} /> {/* Add TopHobbyBoard route */}
      <Route path="/latest_hobby_board" element={<PrivateRoute component={LatestHobbyBoard} />} /> {/* Add LatestHobbyBoard route */}
      <Route path="/post-step-one" element={<PrivateRoute component={PostStepOne} />} />
      <Route path="/post-step-two" element={<PrivateRoute component={PostStepTwo} />} />
      <Route path="*" element={<Navigate to="/not-found" />} />
    </Routes>
  );
}

export default App;
