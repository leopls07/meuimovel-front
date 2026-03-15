import api from './axios'

export const criarSimulacao = (id, data) =>
  api.post(`/api/imoveis/${id}/simulacao`, data)
export const buscarSimulacao = (id) => api.get(`/api/imoveis/${id}/simulacao`)
export const patchSimulacao = (id, data) =>
  api.patch(`/api/imoveis/${id}/simulacao`, data)
export const deletarSimulacao = (id) =>
  api.delete(`/api/imoveis/${id}/simulacao`)
export const listarSimulacoes = () =>
  api.get('/api/simulacoes')