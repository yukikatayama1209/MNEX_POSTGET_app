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

const HobbyBoard: React.FC = () => {
  const [latestHobbies, setLatestHobbies] = useState<Hobby[]>([]);
  const [topHobbies, setTopHobbies] = useState<Hobby[]>([]);

  useEffect(() => {
    const fetchHobbies = async () => {
      try {
        const latestResponse = await axios.get('http://localhost:8000/hobbys/latest');
        console.log('Latest Hobbies:', latestResponse.data);
        setLatestHobbies(latestResponse.data);

        const topResponse = await axios.get('http://localhost:8000/hobbys/top');
        console.log('Top Hobbies:', topResponse.data);
        setTopHobbies(topResponse.data);
      } catch (error) {
        console.error('Error fetching hobbies:', error);
      }
    };

    fetchHobbies();
  }, []);

  const handleLike = async (hobbyId: number, isLatest: boolean) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:8000/hobbys/${hobbyId}/like`, null, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (isLatest) {
        setLatestHobbies(latestHobbies.map(hobby =>
          hobby.id === hobbyId ? { ...hobby, good: hobby.good + 1 } : hobby
        ));
      } else {
        setTopHobbies(topHobbies.map(hobby =>
          hobby.id === hobbyId ? { ...hobby, good: hobby.good + 1 } : hobby
        ));
      }
    } catch (error) {
      console.error('Error liking hobby:', error);
    }
  };

  return (
    <div className={style.hobbyBoard}>
      <h2>Latest Hobbies</h2>
      <div className={style.hobbyContainer}>
        {latestHobbies.length > 0 ? (
          latestHobbies.map(hobby => (
            <div key={hobby.id} className={style.hobby}>
              <img src={`http://localhost:8000/photos/${hobby.hobby_photo}`} alt="Hobby" className={style.hobbyPhoto} />
              <p>{hobby.comments}</p>
              <button onClick={() => handleLike(hobby.id, true)}>❤️ {hobby.good}</button>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>

      <h2>Top Hobbies</h2>
      <div className={style.hobbyContainer}>
        {topHobbies.length > 0 ? (
          topHobbies.map(hobby => (
            <div key={hobby.id} className={style.hobby}>
              <img src={`http://localhost:8000/photos/${hobby.hobby_photo}`} alt="Hobby" className={style.hobbyPhoto} />
              <p>{hobby.comments}</p>
              <button onClick={() => handleLike(hobby.id, false)}>❤️ {hobby.good}</button>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default HobbyBoard;
