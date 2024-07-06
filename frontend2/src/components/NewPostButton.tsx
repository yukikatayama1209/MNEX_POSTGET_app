import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/NewPostButton.css';

const NewPostButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button 
      className="new-post-button" 
      onClick={() => navigate('/post-step-one')}
    >
      +
    </button>
  );
};

export default NewPostButton;
