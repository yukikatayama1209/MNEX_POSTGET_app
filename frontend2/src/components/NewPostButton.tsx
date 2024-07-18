import React from 'react';
import { useNavigate } from 'react-router-dom';
import style from '../assets/styles/NewPostButton.module.css';

const NewPostButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button 
      className= {style.newpostbutton}
      onClick={() => navigate('/post-step-one')}
    >
      <p className ={style.plus}>+</p>
    </button>
  );
};

export default NewPostButton;
