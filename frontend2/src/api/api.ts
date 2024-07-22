// // src/api/api.ts

// import axios from 'axios';

// const api = axios.create({
//   // baseURL: 'http://172.20.10.4:8000',  // FastAPIサーバーのベースURLをPCのIPアドレスに変更
//   baseURL: 'http://localhost:8000',
// });

// export default api;

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,  // 環境変数からベースURLを取得
});

export default api;

