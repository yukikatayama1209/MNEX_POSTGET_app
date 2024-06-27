import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Welcome to MNEX</h1>
      <Link to="/post-step-one">
        <button>+</button>
      </Link>
    </div>
  );
}

export default Home;
