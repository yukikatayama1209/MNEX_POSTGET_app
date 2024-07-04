import React from 'react'
import { Routes, Route } from 'react-router-dom'
import PostStepOne from './components/PostStepOne'
import PostStepTwo from './components/PostStepTwo'
import Home from './components/Home'

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/post-step-one" element={<PostStepOne />} />
      <Route path="/post-step-two" element={<PostStepTwo />} />
    </Routes>
  )
}

export default App
