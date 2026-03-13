import { Link } from 'react-router-dom'
import { formatBRL, formatM2 } from '@/utils/formatters'
import { Car, Ruler, BedDouble, Trash2, Eye } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

function safeNumber(v) {
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function StatPill({ icon: Icon, value }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
      style={{
        backgroundColor: 'var(--color-surface-2)',
        color: 'var(--color-muted)',
        fontSize: '0.7rem',
        fontWeight: 500,
      }}
    >
      <Icon style={{ width: 12, height: 12 }} />
      {value}
    </span>
  )
}

export default function ImovelCard({ imovel, onRemove }) {
  const preco = safeNumber(imovel?.preco)
  const metragem = safeNumber(imovel?.metragem)
  const precoM2 = preco != null && metragem ? preco / metragem : null
  const custoFixo =
    (safeNumber(imovel?.condominioMensal) || 0) +
    (safeNumber(imovel?.iptuMensal) || 0)
  const hasSimulacao = Boolean(imovel?.simulacao || imovel?.temSimulacao)

  return (
    <div
      className="flex flex-col overflow-hidden transition-all duration-250"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '20px',
        boxShadow: '0 2px 12px rgba(44,32,23,0.07)',
        transition: 'transform 250ms ease, box-shadow 250ms ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(44,32,23,0.13)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(44,32,23,0.07)'
      }}
    >
      {/* Top accent bar */}
      <div
        className="h-1 w-full"
        style={{ backgroundColor: hasSimulacao ? 'var(--color-accent-2)' : 'var(--color-border)' }}
      />

      <div className="flex flex-col gap-4 p-5 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div
              className="font-display font-semibold leading-tight truncate"
              style={{ fontSize: '1.1rem', color: 'var(--color-text)' }}
            >
              {imovel?.localizacao || '—'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)', marginTop: 2 }}>
              ID #{imovel?.id ?? '—'}
            </div>
          </div>
          <span
            className="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{
              backgroundColor: hasSimulacao ? 'rgba(107,143,110,0.15)' : 'var(--color-surface-2)',
              color: hasSimulacao ? 'var(--color-accent-2)' : 'var(--color-muted)',
            }}
          >
            {hasSimulacao ? 'Simulado' : 'Sem sim.'}
          </span>
        </div>

        {/* Price */}
        <div>
          <div
            style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-muted)' }}
          >
            Preço
          </div>
          <div
            className="font-display font-semibold"
            style={{ fontSize: '1.6rem', color: 'var(--color-accent)', letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            {formatBRL(preco)}
          </div>
          {precoM2 != null && (
            <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)', marginTop: 2 }}>
              {formatBRL(precoM2)}/m²
            </div>
          )}
        </div>

        {/* Stats pills */}
        <div className="flex flex-wrap gap-1.5">
          <StatPill icon={BedDouble} value={`${imovel?.quartos ?? '—'} qts`} />
          <StatPill icon={Car} value={`${imovel?.vagas ?? '—'} vag`} />
          <StatPill icon={Ruler} value={formatM2(metragem)} />
        </div>

        {/* Custo fixo */}
        {custoFixo > 0 && (
          <div
            className="rounded-xl px-3 py-2.5"
            style={{ backgroundColor: 'var(--color-surface-2)' }}
          >
            <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
              Custo fixo mensal
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text)', marginTop: 2 }}>
              {formatBRL(custoFixo)}
            </div>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1" style={{ borderTop: '1px solid var(--color-border)' }}>
          <Link
            to={`/imoveis/${imovel?.id}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-full py-2 text-sm font-semibold transition-all"
            style={{ backgroundColor: 'var(--color-accent)', color: '#fff' }}
            onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.08)'}
            onMouseLeave={e => e.currentTarget.style.filter = ''}
          >
            <Eye className="h-3.5 w-3.5" /> Ver detalhes
          </Link>

          <Dialog>
            <DialogTrigger asChild>
              <button
                className="flex items-center justify-center rounded-full p-2 transition-all"
                style={{
                  border: '1.5px solid var(--color-border)',
                  color: 'var(--color-muted)',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#ef4444'
                  e.currentTarget.style.color = '#ef4444'
                  e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--color-border)'
                  e.currentTarget.style.color = 'var(--color-muted)'
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </DialogTrigger>
            <DialogContent style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '20px' }}>
              <DialogHeader>
                <DialogTitle style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: 'var(--color-text)' }}>
                  Remover imóvel?
                </DialogTitle>
                <DialogDescription style={{ color: 'var(--color-muted)' }}>
                  Essa ação não pode ser desfeita. O imóvel será excluído permanentemente.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" style={{ borderRadius: '9999px', borderColor: 'var(--color-border)' }}>
                  Cancelar
                </Button>
                <Button
                  style={{ borderRadius: '9999px', backgroundColor: '#ef4444', color: '#fff', border: 'none' }}
                  onClick={() => onRemove?.(imovel?.id)}
                >
                  Confirmar remoção
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
