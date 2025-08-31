import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['axios', 'lucide-react']
        }
      }
    }
  },
  define: {
    // 在构建时注入环境变量
    'import.meta.env.VITE_AUTHOR_NAME': JSON.stringify(process.env.AUTHOR_NAME || 'Yuccc'),
    'import.meta.env.VITE_BLOG_URL': JSON.stringify(process.env.BLOG_URL || ''),
    'import.meta.env.VITE_BLOG_NAME': JSON.stringify(process.env.BLOG_NAME || 'Blog')
  }
})
