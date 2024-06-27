import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PostStepOne() {
  const [formData, setFormData] = useState({
    username: '',
    product: '',
    purchase_date: '',
    shop_location: '',
    product_photo: '',
    comments: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:8000/prices/', formData);
    navigate('/post-step-two', { state: { ...formData } });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
      <input type="text" name="product" placeholder="Product" value={formData.product} onChange={handleChange} />
      <input type="date" name="purchase_date" value={formData.purchase_date} onChange={handleChange} />
      <input type="text" name="shop_location" placeholder="Shop Location" value={formData.shop_location} onChange={handleChange} />
      <input type="text" name="product_photo" placeholder="Product Photo URL" value={formData.product_photo} onChange={handleChange} />
      <textarea name="comments" placeholder="Comments" value={formData.comments} onChange={handleChange} />
      <button type="submit">Next</button>
    </form>
  );
}

export default PostStepOne;
