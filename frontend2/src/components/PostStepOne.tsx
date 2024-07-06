import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PostStepOne: React.FC = () => {
  const [formData, setFormData] = useState({
    product: '',
    purchase_date: '',
    shop_location: '',
    comments: ''
  });
  const [productPhoto, setProductPhoto] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProductPhoto(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e: FormEvent) => {
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

    try {
      const response = await axios.post('http://localhost:8000/prices/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      const priceId = response.data.price_id;
      navigate('/post-step-two', { state: { price_id: priceId } });
    } catch (error) {
      console.error('Error submitting form', error);
    }
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
};

export default PostStepOne;
