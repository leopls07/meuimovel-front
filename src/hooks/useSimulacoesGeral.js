import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { listarSimulacoes, patchSimulacao, deletarSimulacao } from '@/api/simulacao'

function normalizeApiError(err, fallback) {
  return err?.response?.data?.message || fallback || 'Erro inesperado.'
}

export function useSimulacoesGeral() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await listarSimulacoes()
      setData(res.data)
    } catch (err) {
      toast.error(normalizeApiError(err, 'Erro ao carregar simulações.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function patch(imovelId, payload) {
    try {
      const res = await patchSimulacao(imovelId, payload)
      toast.success('Simulação atualizada!')
      setData(prev => prev.map(s =>
        s.imovelId === imovelId ? { ...s, ...res.data } : s
      ))
      return res.data
    } catch (err) {
      toast.error(normalizeApiError(err, 'Erro ao atualizar simulação.'))
      throw err
    }
  }

  async function remove(imovelId) {
    try {
      await deletarSimulacao(imovelId)
      toast.success('Simulação removida.')
      setData(prev => prev.filter(s => s.imovelId !== imovelId))
      return true
    } catch (err) {
      toast.error(normalizeApiError(err, 'Erro ao remover simulação.'))
      return false
    }
  }

  return { data, loading, load, patch, remove }
}