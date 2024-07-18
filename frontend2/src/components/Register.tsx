import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import style from'../assets/styles/Register.module.css';
import TextField from '@mui/material/TextField';
import styled from '@emotion/styled';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }
    try {
      await axios.post('http://localhost:8000/register', {
        username: username,
        password: password
      });
      navigate('/login');
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <body className={style.body1}>
    <div className={style.register1}>
      <form onSubmit={handleSubmit} className={style.registerform1}>
        <h2>アカウント作成</h2>
        <div className={style.formgroup1}>
          {/* <label>ユーザー名</label> */}
          <TextField type = "text" id="outlined-basic" label="ユーザー名" variant="outlined"
           className= {style.field} onChange={(e) => setUsername(e.target.value)}/>
          {/* <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          /> */}
        </div>
        <div className={style.formgroup1}>
          {/* <label>パスワード</label> */}
          <TextField type = "password" id="outlined-basic" label="パスワード" variant="outlined"
            className= {style.field}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          /> */}
        </div>
        <div className={style.formgroup1}>
          {/* <label>パスワード確認</label> */}
          <TextField type = "password" id="outlined-basic" label="パスワード確認" variant="outlined"
            className= {style.field}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {/* <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          /> */}
        </div>
        <button type="submit" className={style.registerbutton1}>登録</button>
        <p className ={style.p}>
          既にアカウントをお持ちですか？ <a href="/login">サインイン</a>
        </p>
      </form>
    </div>
    </body>
  );
};

export default Register;
