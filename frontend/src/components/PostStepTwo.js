import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

function PostStepTwo() {
  const [formData, setFormData] = useState({
    comments: ''
  });
  const [hobbyPhoto, setHobbyPhoto] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const initialData = location.state;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setHobbyPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = new FormData();
    data.append('product', initialData.product);
    data.append('purchase_date', initialData.purchase_date);
    data.append('shop_location', initialData.shop_location);
    data.append('comments', formData.comments);
    if (hobbyPhoto) {
      data.append('hobby_photo', hobbyPhoto);
    }
    await axios.post('http://localhost:8000/hobbys/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" name="hobby_photo" onChange={handleFileChange} />
      <textarea name="comments" placeholder="Comments" value={formData.comments} onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
}

export default PostStepTwo;
