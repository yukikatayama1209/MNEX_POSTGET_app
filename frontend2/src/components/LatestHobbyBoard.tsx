import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

const LatestHobbyBoard: React.FC = () => {
  const [latestHobbies, setLatestHobbies] = useState<Hobby[]>([]);

  useEffect(() => {
    const fetchHobbies = async () => {
      try {
        const response = await axios.get('http://localhost:8000/hobbys/latest');
        console.log('Latest Hobbies:', response.data);
        setLatestHobbies(response.data);
      } catch (error) {
        console.error('Error fetching hobbies:', error);
      }
    };

    fetchHobbies();
  }, []);

  return (
    <div className={style.hobbyBoard}>
      <h2>Latest Hobbys</h2>
      <div className={style.hobbyContainer}>
        {latestHobbies.length > 0 ? (
          latestHobbies.map(hobby => (
            <div key={hobby.id} className={style.hobby}>
              <img src={`http://localhost:8000/photos/${hobby.hobby_photo}`} alt="Hobby" className={style.hobbyPhoto} />
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

export default LatestHobbyBoard;
