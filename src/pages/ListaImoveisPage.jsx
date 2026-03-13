import { useNavigate } from 'react-router-dom'
import { Building2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ImovelCard from '@/components/imovel/ImovelCard'
import FiltrosBusca from '@/components/imovel/FiltrosBusca'
import { useImoveis } from '@/hooks/useImoveis'

function CardSkeleton() {
  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '20px',
        overflow: 'hidden',
      }}
    >
      <div className="shimmer h-1 w-full" />
      <div className="p-5 space-y-4">
        <div className="shimmer h-4 w-3/4 rounded-full" />
        <div className="shimmer h-8 w-1/2 rounded-full" />
        <div className="flex gap-2">
          <div className="shimmer h-6 w-16 rounded-full" />
          <div className="shimmer h-6 w-16 rounded-full" />
          <div className="shimmer h-6 w-16 rounded-full" />
        </div>
        <div className="shimmer h-12 w-full rounded-xl" />
        <div className="shimmer h-10 w-full rounded-full mt-2" />
      </div>
    </div>
  )
}

export default function ListaImoveisPage() {
  const navigate = useNavigate()
  const { items, loading, load, remove } = useImoveis({ autoLoad: true })

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Page header */}
      <div className="flex items-end justify-between gap-3">
        <div>
          <p
            style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: 4 }}
          >
            Gestão
          </p>
          <h2
            className="font-display font-semibold"
            style={{ fontSize: '2rem', color: 'var(--color-text)', letterSpacing: '-0.02em', lineHeight: 1 }}
          >
            Meus imóveis
          </h2>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginTop: 4 }}>
            Pesquise, compare e simule seus imóveis
          </p>
        </div>
        <button
          className="shrink-0 flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all"
          style={{ backgroundColor: 'var(--color-accent)', color: '#fff' }}
          onClick={() => navigate('/imoveis/novo')}
          onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.08)'; e.currentTarget.style.transform = 'scale(1.02)' }}
          onMouseLeave={e => { e.currentTarget.style.filter = ''; e.currentTarget.style.transform = '' }}
        >
          <Plus className="h-4 w-4" />
          Novo imóvel
        </button>
      </div>

      {/* Filters */}
      <div className="animate-fade-up-1">
        <FiltrosBusca disabled={loading} onSearch={(p) => load(p)} onClear={() => load(null)} />
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => <CardSkeleton key={i} />)}
        </div>
      ) : items?.length ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((imovel, i) => (
            <div key={imovel.id} className={`animate-fade-up-${Math.min(i + 1, 5)}`}>
              <ImovelCard imovel={imovel} onRemove={remove} />
            </div>
          ))}
        </div>
      ) : (
        <div
          className="animate-fade-up-2 flex flex-col items-center justify-center py-20 text-center"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '20px',
          }}
        >
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl mb-4"
            style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-accent)' }}
          >
            <Building2 className="h-6 w-6" />
          </div>
          <div
            className="font-display font-semibold"
            style={{ fontSize: '1.3rem', color: 'var(--color-text)' }}
          >
            Nenhum imóvel encontrado
          </div>
          <div style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginTop: 6 }}>
            Ajuste os filtros ou cadastre um novo imóvel.
          </div>
          <button
            className="mt-6 flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all"
            style={{ border: '1.5px solid var(--color-accent)', color: 'var(--color-accent)', backgroundColor: 'transparent' }}
            onClick={() => navigate('/imoveis/novo')}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-accent-soft)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Plus className="h-4 w-4" /> Cadastrar imóvel
          </button>
        </div>
      )}
    </div>
  )
}
