import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function PostStepOne() {
  const [formData, setFormData] = useState({
    product: '',
    purchase_date: '',
    shop_location: '',
    comments: ''
  });
  const [productPhoto, setProductPhoto] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProductPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = new FormData();
    data.append('product', formData.product);
    data.append('purchase_date', formData.purchase_date);
    data.append('shop_location', formData.shop_location);
    data.append('comments', formData.comments);
    if (productPhoto) {
      data.append('product_photo', productPhoto);
    }
    const response = await axios.post('http://localhost:8000/prices/', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      }
    });
    navigate('/post-step-two', { state: { ...response.data } });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="product" placeholder="Product" value={formData.product} onChange={handleChange} />
      <input type="date" name="purchase_date" value={formData.purchase_date} onChange={handleChange} />
      <input type="text" name="shop_location" placeholder="Shop Location" value={formData.shop_location} onChange={handleChange} />
      <input type="file" name="product_photo" onChange={handleFileChange} />
      <textarea name="comments" placeholder="Comments" value={formData.comments} onChange={handleChange} />
      <button type="submit">Next</button>
    </form>
  );
}

export default PostStepOne;
