import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';  // axiosインスタンスをインポート
import style from '../assets/styles/Register.module.css';
import TextField from '@mui/material/TextField';

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
      await api.post('/register', {
        username: username,
        password: password
      });
      navigate('/login');
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <div className={style.body1}>
      <div className={style.register1}>
        <form onSubmit={handleSubmit} className={style.registerform1}>
          <h2>アカウント作成</h2>
          <div className={style.formgroup1}>
            <TextField
              type="text"
              id="username"
              label="ユーザー名"
              variant="outlined"
              className={style.field}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className={style.formgroup1}>
            <TextField
              type="password"
              id="password"
              label="パスワード"
              variant="outlined"
              className={style.field}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className={style.formgroup1}>
            <TextField
              type="password"
              id="confirm-password"
              label="パスワード確認"
              variant="outlined"
              className={style.field}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit" className={style.registerbutton1}>登録</button>
          <p className={style.p}>
            既にアカウントをお持ちですか？ <a href="/login">サインイン</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
