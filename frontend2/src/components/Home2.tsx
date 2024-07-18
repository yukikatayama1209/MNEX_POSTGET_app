import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NewPostButton from './NewPostButton';
import { AuthContext } from './AuthContext';
import '../assets/styles/Home.css';



interface User {
  username: string;
  point: number;
}

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      const fetchUser = async () => {
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
    }
  }, [navigate])
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="home-container">
      <h1>Home</h1>
      {user ? (
        <div className="user-info">
          <p>Username: {user.username}</p>
          <p>Points: {user.point}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
      <div className="button-group">
        <button onClick={() => navigate('/price_data')}>Price Data</button>
        <button onClick={() => navigate('/hobby_board')}>Hobby Board</button>
      </div>
      <NewPostButton />
    </div>
  );
};

export default Home;