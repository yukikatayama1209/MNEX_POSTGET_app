import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function PostStepTwo() {
  const [formData, setFormData] = useState({
    hobby_photo: '',
    comments: ''
  });
  const navigate = useNavigate();
  const location = useLocation();
  const initialData = location.state;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...initialData,
      hobby_photo: formData.hobby_photo,
      comments: formData.comments,
      good: 0
    };
    await axios.post('http://localhost:8000/hobbys/', data);
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="hobby_photo" placeholder="Hobby Photo URL" value={formData.hobby_photo} onChange={handleChange} />
      <textarea name="comments" placeholder="Comments" value={formData.comments} onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
}

export default PostStepTwo;
