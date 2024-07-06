import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const PostStepTwo: React.FC = () => {
  const [formData, setFormData] = useState({
    comments: ''
  });
  const [hobbyPhoto, setHobbyPhoto] = useState<File | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { price_id } = location.state;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHobbyPhoto(e.target.files ? e.target.files[0] : null);
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
    <form onSubmit={handleSubmit}>
      <input type="file" name="hobby_photo" onChange={handleFileChange} />
      <textarea name="comments" placeholder="Comments" value={formData.comments} onChange={handleChange} />
      <button type="submit">Submit</button>
      <button type="button" onClick={handleSkip}>Skip</button>
    </form>
  );
};

export default PostStepTwo;
