import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Welcome to Home Page</h1>
      <Link to="/post-step-one">Go to Post Step One</Link>
    </div>
  );
}

export default Home;
