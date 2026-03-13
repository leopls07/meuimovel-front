import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import {
  buscarComFiltros,
  buscarImovel,
  criarImovel,
  deletarImovel,
  listarImoveis,
  patchImovel,
} from '@/api/imoveis'

function normalizeApiError(err, fallback) {
  return err?.response?.data?.message || fallback || 'Erro inesperado.'
}

export function useImoveis({ autoLoad = true } = {}) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [filters, setFilters] = useState(null)

  const load = useCallback(
    async (nextFilters = null) => {
      setLoading(true)
      setFilters(nextFilters)
      try {
        const res = nextFilters ? await buscarComFiltros(nextFilters) : await listarImoveis()
        setItems(res.data || [])
      } catch (err) {
        toast.error(normalizeApiError(err, 'Erro ao carregar imóveis.'))
        setItems([])
      } finally {
        setLoading(false)
      }
    },
    [setItems]
  )

  useEffect(() => {
    if (autoLoad) load(null)
  }, [autoLoad, load])

  const actions = useMemo(
    () => ({
      load,
      async getById(id) {
        try {
          const res = await buscarImovel(id)
          return res.data
        } catch (err) {
          toast.error(normalizeApiError(err, 'Imóvel não encontrado.'))
          throw err
        }
      },
      async create(data, { onValidationErrors } = {}) {
        try {
          const res = await criarImovel(data)
          toast.success('Imóvel cadastrado com sucesso!')
          return res.data
        } catch (err) {
          if (
            err?.response?.status === 400 &&
            err?.response?.data?.validationErrors &&
            typeof onValidationErrors === 'function'
          ) {
            onValidationErrors(err.response.data.validationErrors)
            toast.error('Erro ao salvar. Verifique os campos.')
            return null
          }
          toast.error(normalizeApiError(err, 'Erro ao salvar.'))
          throw err
        }
      },
      async patch(id, data, { onValidationErrors } = {}) {
        try {
          const res = await patchImovel(id, data)
          toast.success('Imóvel atualizado!')
          return res.data
        } catch (err) {
          if (
            err?.response?.status === 400 &&
            err?.response?.data?.validationErrors &&
            typeof onValidationErrors === 'function'
          ) {
            onValidationErrors(err.response.data.validationErrors)
            toast.error('Erro ao salvar. Verifique os campos.')
            return null
          }
          toast.error(normalizeApiError(err, 'Erro ao atualizar.'))
          throw err
        }
      },
      async remove(id) {
        try {
          await deletarImovel(id)
          toast.success('Imóvel removido.')
          await load(filters)
          return true
        } catch (err) {
          toast.error(normalizeApiError(err, 'Erro ao remover imóvel.'))
          return false
        }
      },
    }),
    [filters, load]
  )

  return { items, loading, filters, ...actions }
}
