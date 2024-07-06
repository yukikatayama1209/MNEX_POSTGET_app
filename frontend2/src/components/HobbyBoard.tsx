import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
    <div>
      <h2>Latest Hobbies</h2>
      <div>
        {latestHobbies.length > 0 ? (
          latestHobbies.map(hobby => (
            <div key={hobby.id} style={{ marginBottom: '20px' }}>
              <img src={`http://localhost:8000/photos/${hobby.hobby_photo}`} alt="Hobby" style={{ width: '25%' }} />
              <p>{hobby.comments}</p>
              <button onClick={() => handleLike(hobby.id, true)}>❤️ {hobby.good}</button>
            </div>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>

      <h2>Top Hobbies</h2>
      <div>
        {topHobbies.length > 0 ? (
          topHobbies.map(hobby => (
            <div key={hobby.id} style={{ marginBottom: '20px' }}>
              <img src={`http://localhost:8000/photos/${hobby.hobby_photo}`} alt="Hobby" style={{ width: '25%' }} />
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
