// Login.tsx
import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import style from '../assets/styles/Login.module.css';
import logo from '../assets/images/logo.png';
import TextField from '@mui/material/TextField';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/token', new URLSearchParams({
        username: username,
        password: password
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      console.log('Login response:', response.data);
      const token = response.data.access_token;
      login(token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      navigate('/home');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };
  return (
    <body className ={style.body}>
    <div className={style.logincontainer}>
      <form onSubmit={handleSubmit} className={style.loginform}>
        <img src={logo} alt="Logo" className={style.logo} />
        <h2>Sign In</h2>
        <div className={style.formgroup}>
          {/* <label>ユーザー名</label> */}
          <TextField type = "text" id="outlined-basic" label="ユーザー名" variant="outlined"
            value={username}
            className= {style.field}
            onChange={(e) => setUsername(e.target.value)}
            />
          {/* <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          /> */}
        </div>
        <div className={style.formgroup}>
          {/* <label>パスワード</label> */}
          <TextField type = "password" id="outlined-basic" label="パスワード" variant="outlined"
            value={password}
            className= {style.field}
            onChange={(e) => setPassword(e.target.value)}
            />
          {/* <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          /> */}
        </div>
        <button type="submit" className={style.loginbutton}>Sign in</button>
        <p>
          アカウントを作成していませんか？ <a href="/register">Resister</a>
        </p>
      </form>
    </div>
    </body>
  );
};

export default Login;
