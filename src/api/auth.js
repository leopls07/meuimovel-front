import api from './axios'

export const loginComGoogle = (idToken) =>
  api.post('/api/auth/google', { idToken })
