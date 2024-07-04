import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PostStepTwo: React.FC = () => {
  const [formData, setFormData] = useState<{
    hobby_photo: File | null;
    comments: string;
  }>({
    hobby_photo: null,
    comments: ''
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, hobby_photo: e.target.files ? e.target.files[0] : null });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSubmit = new FormData();
    if (formData.hobby_photo) {
      formDataToSubmit.append('hobby_photo', formData.hobby_photo);
    }
    formDataToSubmit.append('comments', formData.comments);
    try {
      await axios.post('http://localhost:8000/hobbys/', formDataToSubmit, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      navigate('/home');
    } catch (error) {
      console.error(error);
      alert('Submission failed');
    }
  };

  return (
    <div>
      <h2>Post Step Two</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" name="hobby_photo" onChange={handleFileChange} />
        <textarea name="comments" placeholder="Comments" value={formData.comments} onChange={handleChange}></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default PostStepTwo;
