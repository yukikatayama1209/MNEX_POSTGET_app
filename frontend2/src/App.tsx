import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import PriceData from './components/PriceData';
import HobbyBoard from './components/HobbyBoard';
import PostStepOne from './components/PostStepOne';
import PostStepTwo from './components/PostStepTwo';
import PrivateRoute from './components/PrivateRoute';
import Board from './components/Board';
import NotFound from './components/NotFound';  // 404ページコンポーネントのインポート

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/price_data" element={<PriceData />} />
        <Route path="/hobby_board" element={<HobbyBoard />} />
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/board" element={<Board />} />
      <Route path="/post-step-one" element={<PrivateRoute component={PostStepOne} />} />
      <Route path="/post-step-two" element={<PrivateRoute component={PostStepTwo} />} />
      <Route path="/not-found" element={<NotFound />} />
    </Routes>
  );
}

export default App;
