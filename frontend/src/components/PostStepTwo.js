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

  const handleFileChange = (e) => {
    setFormData({ ...formData, hobby_photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('username', initialData.username);
    data.append('product', initialData.product);
    data.append('purchase_date', initialData.purchase_date);
    data.append('shop_location', initialData.shop_location);
    data.append('comments', formData.comments);
    if (formData.hobby_photo) {
      data.append('hobby_photo', formData.hobby_photo);
    }
    const response = await axios.post('http://localhost:8000/hobbys/', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log(response.data); // 追加: レスポンスをコンソールに出力
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
