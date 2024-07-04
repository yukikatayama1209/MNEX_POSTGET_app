import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PostStepOne: React.FC = () => {
  const [formData, setFormData] = useState<{
    product: string;
    purchase_date: string;
    shop_location: string;
    comments: string;
    product_photo: File | null;
  }>({
    product: '',
    purchase_date: '',
    shop_location: '',
    comments: '',
    product_photo: null
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, product_photo: e.target.files ? e.target.files[0] : null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('product', formData.product);
    formDataToSubmit.append('purchase_date', formData.purchase_date);
    formDataToSubmit.append('shop_location', formData.shop_location);
    formDataToSubmit.append('comments', formData.comments);
    if (formData.product_photo) {
      formDataToSubmit.append('product_photo', formData.product_photo);
    }
    try {
      await axios.post('http://localhost:8000/prices/', formDataToSubmit, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      navigate('/post-step-two');
    } catch (error) {
      console.error(error);
      alert('Submission failed');
    }
  };

  return (
    <div>
      <h2>Post Step One</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="product" placeholder="Product" value={formData.product} onChange={handleChange} />
        <input type="date" name="purchase_date" placeholder="Purchase Date" value={formData.purchase_date} onChange={handleChange} />
        <input type="text" name="shop_location" placeholder="Shop Location" value={formData.shop_location} onChange={handleChange} />
        <textarea name="comments" placeholder="Comments" value={formData.comments} onChange={handleChange}></textarea>
        <input type="file" name="product_photo" onChange={handleFileChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default PostStepOne;
