import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from '../assets/styles/PostStepTwo.module.css';

const PostStepTwo: React.FC = () => {
  const [formData, setFormData] = useState({
    comments: ''
  });
  const [hobbyPhoto, setHobbyPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { price_id } = location.state;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setHobbyPhoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const data = new FormData();
    data.append('price_id', price_id);
    data.append('comments', formData.comments);
    if (hobbyPhoto) {
      data.append('hobby_photo', hobbyPhoto);
    }
    try {
      await axios.post('http://localhost:8000/hobbys/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      navigate('/home'); // POSTが完了したらホームに戻る
    } catch (error) {
      console.error('Error submitting form', error);
    }
  };

  const handleSkip = () => {
    navigate('/home'); // スキップボタンをクリックしたらホームに戻る
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <div className={styles.fileInputContainer}>
        <label htmlFor="hobby_photo" className={styles.fileInputLabel}>ファイルを選択</label>
        <input type="file" name="hobby_photo" onChange={handleFileChange} className={styles.fileInput} />
        <div className={styles.photoPreview}>
          {photoPreview ? <img src={photoPreview} alt="Hobby Preview" /> : '写真'}
        </div>
      </div>
      <div className={styles.textAreaContainer}>
        <label htmlFor="comments" className={styles.textAreaLabel}>Comments</label>
        <textarea
          id="comments"
          name="comments"
          className={styles.textArea}
          placeholder="Comments"
          value={formData.comments}
          onChange={handleChange}
        />
      </div>
      <div className={styles.buttonContainer}>
        <button type="button" onClick={handleSkip} className={`${styles.button} ${styles.skipButton}`}>Skip</button>
        <button type="submit" className={styles.button}>Submit</button>
      </div>
    </form>
  );
};

export default PostStepTwo;
