export const formatBRL = (v) =>
  v != null
    ? new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(v)
    : '—'

export const formatPct = (v) =>
  v != null
    ? new Intl.NumberFormat('pt-BR', {
        style: 'percent',
        minimumFractionDigits: 2,
      }).format(v)
    : '—'

export const formatM2 = (v) =>
  v != null ? `${new Intl.NumberFormat('pt-BR').format(v)} m²` : '—'
