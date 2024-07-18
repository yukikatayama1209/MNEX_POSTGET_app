import React, { useState, useEffect , useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={style.size}>
      <nav className={style.navi}>
        {user ? (
        <label>
          <div className={style.userdata}>
            <p>Username: {user.username}</p>
            <p>Points: {user.point}</p>
          </div>
        </label>  
      ) : (
        <p>Loading user data...</p>
      )}
        <button className = {style.button} onClick={handleLogout}>Logout</button>
      </nav>
      <h1 className={style.h1}>Home</h1>
      <div>
        <button onClick={() => navigate('/price_data')}>Price Data</button>
        {/* <button onClick={() => navigate('/hobby_board')}>Hobby Board</button> */}
        <div className={style.frame}>
        {/* <iframe className={style.iframe}
          src="/price_data"
          title="Price Data"
        ></iframe> */}
        <iframe className={style.iframe}
          src="/hobby_board"
          title="Hobby Board"
        ></iframe >
        </div>
      </div>
      <NewPostButton />
    </div>
  );
};

export default Home;
