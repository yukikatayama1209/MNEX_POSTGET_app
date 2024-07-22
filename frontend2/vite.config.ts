import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // 環境変数をロード
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      open: true,
      port: 5500
    },
    define: {
      'process.env': {
        VITE_API_BASE_URL: env.VITE_API_BASE_URL
      }
    }
  }
})
