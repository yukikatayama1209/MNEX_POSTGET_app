import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import PriceData from './components/PriceData';
import HobbyBoard from './components/HobbyBoard';
import PostStepOne from './components/PostStepOne';
import PostStepTwo from './components/PostStepTwo';
import NotFound from './components/NotFound';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './components/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate replace to="/login" />} />
          <Route path="/not-found" element={<NotFound />} />
          
          <Route path="/home" element={<PrivateRoute component={Home} />} />
          <Route path="/price_data" element={<PrivateRoute component={PriceData} />} />
          <Route path="/hobby_board" element={<PrivateRoute component={HobbyBoard} />} />
          <Route path="/post-step-one" element={<PrivateRoute component={PostStepOne} />} />
          <Route path="/post-step-two" element={<PrivateRoute component={PostStepTwo} />} />
          <Route path="*" element={<Navigate to="/not-found" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
