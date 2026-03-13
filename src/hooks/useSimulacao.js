import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  buscarSimulacao,
  criarSimulacao,
  deletarSimulacao,
  patchSimulacao,
} from '@/api/simulacao'

function normalizeApiError(err, fallback) {
  return err?.response?.data?.message || fallback || 'Erro inesperado.'
}

export function useSimulacao(imovelId) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!imovelId) return
    setLoading(true)
    try {
      const res = await buscarSimulacao(imovelId)
      setData(res.data)
    } catch (err) {
      if (err?.response?.status === 404) {
        setData(null)
      } else {
        toast.error(normalizeApiError(err, 'Erro ao carregar simulação.'))
      }
    } finally {
      setLoading(false)
    }
  }, [imovelId])

  useEffect(() => {
    load()
  }, [load])

  async function create(payload) {
    setLoading(true)
    try {
      const res = await criarSimulacao(imovelId, payload)
      toast.success('Simulação salva!')
      setData(res.data)
      return res.data
    } catch (err) {
      toast.error(normalizeApiError(err, 'Erro ao salvar. Verifique os campos.'))
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function patch(payload) {
    setLoading(true)
    try {
      const res = await patchSimulacao(imovelId, payload)
      toast.success('Simulação salva!')
      setData(res.data)
      return res.data
    } catch (err) {
      toast.error(normalizeApiError(err, 'Erro ao salvar. Verifique os campos.'))
      throw err
    } finally {
      setLoading(false)
    }
  }

  async function remove() {
    setLoading(true)
    try {
      await deletarSimulacao(imovelId)
      toast.success('Simulação removida.')
      setData(null)
      return true
    } catch (err) {
      toast.error(normalizeApiError(err, 'Erro ao remover simulação.'))
      return false
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, load, create, patch, remove }
}
