import api from './axios'

export const listarImoveis = () => api.get('/api/imoveis')
export const buscarImovel = (id) => api.get(`/api/imoveis/${id}`)
export const criarImovel = (data) => api.post('/api/imoveis', data)
export const patchImovel = (id, data) => api.patch(`/api/imoveis/${id}`, data)
export const deletarImovel = (id) => api.delete(`/api/imoveis/${id}`)
export const buscarComFiltros = (params) =>
  api.get('/api/imoveis/buscar', { params })
