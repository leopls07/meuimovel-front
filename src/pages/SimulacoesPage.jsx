import { useMemo, useState } from 'react'
import { BarChart3, SlidersHorizontal, X } from 'lucide-react'
import SimulacaoCard from '@/components/simulacao/SimulacaoCard'
import CozyMoneyInput from '@/components/ui/cozymoneyinput'
import { useSimulacoesGeral } from '@/hooks/useSimulacoesGeral'

const inputStyle = {
  backgroundColor: 'var(--color-bg)',
  border: '1px solid var(--color-border)',
  borderRadius: '10px',
  padding: '0.45rem 0.75rem',
  fontSize: '0.85rem',
  color: 'var(--color-text)',
  width: '100%',
  outline: 'none',
  transition: 'border-color 150ms, box-shadow 150ms',
}

function FilterLabel({ children }) {
  return (
    <label style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
      {children}
    </label>
  )
}

function FilterNumber({ label, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      <FilterLabel>{label}</FilterLabel>
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
        onFocus={e => { e.target.style.borderColor = 'var(--color-accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(201,106,46,0.12)' }}
        onBlur={e => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.boxShadow = 'none' }}
      />
    </div>
  )
}

function FilterMoney({ label, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <FilterLabel>{label}</FilterLabel>
      <CozyMoneyInput
        value={value}
        onChange={onChange}
        placeholder="R$ 0,00"
        style={{ padding: '0.45rem 0.75rem', fontSize: '0.85rem' }}
      />
    </div>
  )
}

const EMPTY_FILTERS = { parcelaMax: null, totalPagoMax: null, entradaMax: null, prazoMax: '' }

function hasActiveFilters(f) {
  return f.parcelaMax != null || f.totalPagoMax != null || f.entradaMax != null || f.prazoMax !== ''
}

export default function SimulacoesPage() {
  const { data, loading, patch, remove } = useSimulacoesGeral()
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [filtersOpen, setFiltersOpen] = useState(false)

  function setFilter(key) {
    return (val) => setFilters(f => ({ ...f, [key]: val }))
  }

  const filtered = useMemo(() => {
    return data.filter(s => {
      if (filters.parcelaMax != null && s.parcelaMensalPrice > filters.parcelaMax) return false
      if (filters.totalPagoMax != null && s.totalPago > filters.totalPagoMax) return false
      if (filters.entradaMax != null && s.entrada > filters.entradaMax) return false
      if (filters.prazoMax !== '' && s.tempoPagamentoAnos > Number(filters.prazoMax)) return false
      return true
    })
  }, [data, filters])

  const active = hasActiveFilters(filters)
  const activeCount = [filters.parcelaMax, filters.totalPagoMax, filters.entradaMax, filters.prazoMax !== '' ? filters.prazoMax : null].filter(v => v != null).length

  return (
    <div className="space-y-6 animate-fade-up">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2
            className="font-display font-semibold"
            style={{ fontSize: '1.75rem', color: 'var(--color-text)', letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            Simulações
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginTop: 4 }}>
            {loading ? 'Carregando...' : `${filtered.length} simulaç${filtered.length !== 1 ? 'ões' : 'ão'}${active ? ' filtradas' : ''}`}
          </p>
        </div>

        <div className="flex gap-2 items-center">
          {active && (
            <button
              onClick={() => setFilters(EMPTY_FILTERS)}
              className="flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-all"
              style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.18)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'}
            >
              <X style={{ width: 12, height: 12 }} /> Limpar filtros
            </button>
          )}
          <button
            onClick={() => setFiltersOpen(f => !f)}
            className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all"
            style={{
              backgroundColor: filtersOpen ? 'var(--color-accent)' : 'var(--color-surface)',
              color: filtersOpen ? '#fff' : 'var(--color-text)',
              border: `1.5px solid ${filtersOpen ? 'var(--color-accent)' : 'var(--color-border)'}`,
              cursor: 'pointer',
            }}
            onMouseEnter={e => { if (!filtersOpen) e.currentTarget.style.borderColor = 'var(--color-accent)' }}
            onMouseLeave={e => { if (!filtersOpen) e.currentTarget.style.borderColor = 'var(--color-border)' }}
          >
            <SlidersHorizontal style={{ width: 14, height: 14 }} />
            Filtros
            {activeCount > 0 && (
              <span
                className="flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold"
                style={{ backgroundColor: filtersOpen ? 'rgba(255,255,255,0.25)' : 'var(--color-accent)', color: '#fff' }}
              >
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Painel de filtros */}
      {filtersOpen && (
        <div
          className="rounded-2xl p-5 animate-fade-up"
          style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        >
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <FilterMoney
              label="Parcela máx"
              value={filters.parcelaMax}
              onChange={setFilter('parcelaMax')}
            />
            <FilterMoney
              label="Total pago máx"
              value={filters.totalPagoMax}
              onChange={setFilter('totalPagoMax')}
            />
            <FilterMoney
              label="Entrada máx"
              value={filters.entradaMax}
              onChange={setFilter('entradaMax')}
            />
            <FilterNumber
              label="Prazo máx (anos)"
              value={filters.prazoMax}
              onChange={setFilter('prazoMax')}
              placeholder="ex: 30"
            />
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
              <div className="shimmer h-1 w-full" />
              <div className="p-5 space-y-4">
                <div className="shimmer h-5 w-3/4 rounded-lg" />
                <div className="shimmer h-8 w-1/2 rounded-lg" />
                <div className="grid grid-cols-2 gap-2">
                  {[1,2,3,4].map(j => <div key={j} className="shimmer h-14 rounded-xl" />)}
                </div>
                <div className="shimmer h-16 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div
          className="rounded-2xl p-14 text-center"
          style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        >
          <BarChart3 className="mx-auto mb-4" style={{ width: 36, height: 36, color: 'var(--color-muted)', opacity: 0.5 }} />
          <div className="font-display font-semibold mb-2" style={{ fontSize: '1.1rem', color: 'var(--color-text)' }}>
            {active ? 'Nenhuma simulação com esses filtros' : 'Nenhuma simulação encontrada'}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)' }}>
            {active ? 'Tente ajustar os filtros.' : 'Crie simulações nas páginas de detalhe dos imóveis.'}
          </p>
        </div>
      )}

      {/* Grid de cards */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 animate-fade-up-1">
          {filtered.map(s => (
            <SimulacaoCard
              key={s.imovelId}
              simulacao={s}
              onPatch={patch}
              onRemove={remove}
            />
          ))}
        </div>
      )}

    </div>
  )
}