import React, { useState, useEffect } from 'react';
import api from '../api/api';  // axiosインスタンスをインポート
import style from '../assets/styles/HobbyBoard.module.css';

interface Hobby {
  id: number;
  username: string;
  product: string;
  purchase_date: string;
  shop_location: string;
  hobby_photo: string;
  comments: string;
  good: number;
}

const TopHobbyBoard: React.FC = () => {
  const [topHobbies, setTopHobbies] = useState<Hobby[]>([]);

  useEffect(() => {
    const fetchHobbies = async () => {
      try {
        const response = await api.get('/hobbys/top');
        console.log('Top Hobbies:', response.data);
        setTopHobbies(response.data);
      } catch (error) {
        console.error('Error fetching hobbies:', error);
      }
    };

    fetchHobbies();
  }, []);

  return (
    <div className={style.hobbyBoard}>
      <h2>Top Hobbies</h2>
      <div className={style.hobbyContainer}>
        {topHobbies.length > 0 ? (
          topHobbies.map(hobby => (
            <div key={hobby.id} className={style.hobby}>
              <img src={`${import.meta.env.VITE_API_BASE_URL}/photos/${encodeURIComponent(hobby.hobby_photo)}`} alt="Hobby" className={style.hobbyPhoto} />
              <p>{hobby.comments}</p>
              <button>❤️ {hobby.good}</button>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default TopHobbyBoard;
