import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
})

// ─── Request: injeta o Bearer token em todas as chamadas ──────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('meuimovel:token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ─── Response: se a API devolver 401, limpa a sessão e redireciona ────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('meuimovel:token')
      localStorage.removeItem('meuimovel:user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
