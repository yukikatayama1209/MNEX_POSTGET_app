import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Board() {
  const [latestHobby, setLatestHobby] = useState(null);

  useEffect(() => {
    const fetchLatestHobby = async () => {
      const response = await axios.get('http://localhost:8000/hobbys/latest');
      setLatestHobby(response.data);
    };
    fetchLatestHobby();
  }, []);

  const handleLike = async () => {
    if (latestHobby) {
      await axios.post(`http://localhost:8000/hobbys/${latestHobby.id}/like`);
      setLatestHobby({ ...latestHobby, good: latestHobby.good + 1 });
    }
  };

  return (
    <div>
      {latestHobby ? (
        <div>
          <img src={`http://localhost:8000/photos/${latestHobby.hobby_photo}`} alt="Hobby" style={{ width: '100%' }} />
          <p>{latestHobby.comments}</p>
          <button onClick={handleLike}>❤️ {latestHobby.good}</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Board;
