import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NewPostButton from './NewPostButton';
import useAuth from '../hooks/useAuth';
import axios from 'axios';

interface User {
  username: string;
  point: number;
}

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8000/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null; // 認証中の状態
  }

  return (
    <div>
      <h1>Home</h1>
      {user ? (
        <div>
          <p>Username: {user.username}</p>
          <p>Points: {user.point}</p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
      <button onClick={() => navigate('/price_data')}>Price Data</button>
      <button onClick={() => navigate('/hobby_board')}>Hobby Board</button>
      <NewPostButton />
    </div>
  );
};

export default Home;
