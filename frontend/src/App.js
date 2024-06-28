import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import PostStepOne from './components/PostStepOne';
import PostStepTwo from './components/PostStepTwo';
import Board from './components/Board';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post-step-one" element={<PostStepOne />} />
          <Route path="/post-step-two" element={<PostStepTwo />} />
          <Route path="/board" element={<Board />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
