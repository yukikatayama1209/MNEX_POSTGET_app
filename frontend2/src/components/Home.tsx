import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';  // axiosインスタンスをインポート
import NewPostButton from './NewPostButton';
import style from '../assets/styles/Home.module.css';
import { AuthContext } from './AuthContext';

interface User {
  username: string;
  point: number;
}

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const response = await api.get('/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        logout();
        navigate('/login');
      }
    };
    fetchUser();
  }, [logout, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={style.container}>
      <nav className={style.navbar}>
        {user ? (
          <div className={style.userdata}>
            <p>Username: {user.username}</p>
            <p>Point: {user.point}</p>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
        <button className={style.logoutButton} onClick={handleLogout}>Logout</button>
      </nav>
      <h1 className={style.title}>Home</h1>
      <div className={style.hobbiesSection}>
        <div className={style.hobbies}>
          <iframe className={style.iframe} src="/top_hobby_board" title="Top Hobbys"></iframe>
        </div>
        <div className={style.hobbies}>
          <iframe className={style.iframe} src="/latest_hobby_board" title="Latest Hobbys"></iframe>
        </div>
      </div>
      <button className={style.hobbyBoardButton} onClick={() => navigate('/hobby_board')}>Hobby Board</button>
      <div className={style.quoteSection}>
        <p>今日は何を食べますか？</p>
        <p>ドライブにでも行きますか？</p>
      </div>
      <button className={style.priceDataButton} onClick={() => navigate('/price_data')}>価格情報を見る</button>
      <footer className={style.footer}>
        <p>管理人: yuka</p>
        <p>お問い合わせ: 090-XXXX-XXXX</p>
      </footer>
      <NewPostButton />
    </div>
  );
};

export default Home;
