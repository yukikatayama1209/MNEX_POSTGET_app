import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import PostStepOne from './components/PostStepOne';
import PostStepTwo from './components/PostStepTwo';
import PrivateRoute from './components/PrivateRoute';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/post-step-one" element={<PrivateRoute component={PostStepOne} />} />
        <Route path="/post-step-two" element={<PrivateRoute component={PostStepTwo} />} />
      </Routes>
    </Router>
  );
}

export default App;
