import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../assets/styles/PostStepOne.module.css';

interface FormData {
  product: string;
  purchase_date: string;
  shop_location: string;
  price: number;
  importance: boolean;
  comments: string;
}

const PostStepOne: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    product: '',
    purchase_date: '',
    shop_location: '',
    price: 0,
    importance: false,
    comments: ''
  });
  const [productPhoto, setProductPhoto] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: type === 'checkbox' ? checked : name === 'price' ? parseFloat(value) : value
    }));
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
    data.append('price', formData.price.toString());
    data.append('importance', formData.importance.toString());
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
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="product">Product</label>
        <input id="product" type="text" name="product" className={styles.input} placeholder="Product" value={formData.product} onChange={handleChange} />
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="purchase_date">Date</label>
        <input id="purchase_date" type="date" name="purchase_date" className={styles.input} value={formData.purchase_date} onChange={handleChange} />
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="shop_location">Shop Location</label>
        <input id="shop_location" type="text" name="shop_location" className={styles.input} placeholder="Shop Location" value={formData.shop_location} onChange={handleChange} />
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="price">Price</label>
        <input id="price" type="number" name="price" className={styles.input} placeholder="Price" value={formData.price} onChange={handleChange} />
      </div>
      <div className={styles.checkboxGroup}>
        <input id="importance" type="checkbox" name="importance" className={styles.checkbox} checked={formData.importance} onChange={handleChange} />
        <label htmlFor="importance">Mark as important</label>
      </div>
      <div className={styles.fileInput}>
        <input type="file" name="product_photo" onChange={handleFileChange} />
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="comments">Comments</label>
        <textarea id="comments" name="comments" className={styles.textarea} placeholder="Comments" value={formData.comments} onChange={handleChange} />
      </div>
      <button type="submit" className={styles.submitButton}>Next</button>
    </form>
  );
};

export default PostStepOne;
