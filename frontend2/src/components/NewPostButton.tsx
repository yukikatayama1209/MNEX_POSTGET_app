import React from 'react';
import { useNavigate } from 'react-router-dom';

const NewPostButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate('/post-step-one')} style={{ position: 'fixed', bottom: '20px', right: '20px', backgroundColor: '#d14836', color: '#fff', borderRadius: '50%', width: '60px', height: '60px', fontSize: '30px', textAlign: 'center', lineHeight: '60px' }}>
      +
    </button>
  );
};

export default NewPostButton;
