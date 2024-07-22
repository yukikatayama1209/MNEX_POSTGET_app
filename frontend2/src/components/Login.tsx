import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import style from '../assets/styles/Login.module.css';
import logo from '../assets/images/logo.png';
import TextField from '@mui/material/TextField';
import api from '../api/api';  // axiosインスタンスをインポート

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/token', new URLSearchParams({
        username: username,
        password: password
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      console.log('Login response:', response.data);
      const token = response.data.access_token;
      localStorage.setItem('token', token);  // アクセストークンをローカルストレージに保存
      login(token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      navigate('/home');  // ログイン成功後にホームページへリダイレクト
    } catch (error) {
      console.error('Error logging in:', error);
      setError('ログインに失敗しました。ユーザー名またはパスワードが正しくありません。');
    }
  };

  return (
    <div className={style.body}>
      <div className={style.logincontainer}>
        <form onSubmit={handleSubmit} className={style.loginform}>
          <img src={logo} alt="Logo" className={style.logo} />
          <h2>Sign In</h2>
          <div className={style.formgroup}>
            <TextField 
              type="text" 
              id="username" 
              label="ユーザー名" 
              variant="outlined"
              value={username}
              className={style.field}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className={style.formgroup}>
            <TextField 
              type="password" 
              id="password" 
              label="パスワード" 
              variant="outlined"
              value={password}
              className={style.field}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className={style.loginbutton}>Sign in</button>
          {error && <p className={style.error}>{error}</p>}
          <p>
            アカウントを作成していませんか？ <a href="/register">Register</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
