import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        navigate('/not-found');
      } else {
        try {
          const response = await axios.get('http://localhost:8000/users/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.status === 200) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            navigate('/not-found');
          }
        } catch (error) {
          setIsAuthenticated(false);
          navigate('/not-found');
        }
      }
    };

    checkAuth();
  }, [navigate]);

  return isAuthenticated;
};

export default useAuth;
