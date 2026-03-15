import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Edit3, Trash2, ExternalLink, TrendingUp, Clock, Wallet, ArrowUpRight } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import SimulacaoForm from './SimulacaoForm'
import { formatBRL, formatPct } from '@/utils/formatters'

function MetricBox({ label, value, accent, small }) {
  return (
    <div
      className="rounded-xl px-3 py-2.5"
      style={{ backgroundColor: 'var(--color-surface-2)' }}
    >
      <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
        {label}
      </div>
      <div style={{
        fontSize: small ? '0.85rem' : '1rem',
        fontWeight: 700,
        color: accent ? 'var(--color-accent)' : 'var(--color-text)',
        marginTop: 2,
        letterSpacing: '-0.01em',
      }}>
        {value}
      </div>
    </div>
  )
}

function CozyButton({ children, onClick, variant = 'primary', style: extra, ...props }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
    borderRadius: '9999px', padding: '0.45rem 1rem',
    fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
    transition: 'filter 150ms, transform 150ms', border: 'none',
  }
  const variants = {
    primary: { backgroundColor: 'var(--color-accent)', color: '#fff' },
    outline: { backgroundColor: 'transparent', border: '1.5px solid var(--color-border)', color: 'var(--color-muted)' },
    danger: { backgroundColor: '#ef4444', color: '#fff' },
    ghost: { backgroundColor: 'transparent', border: '1.5px solid var(--color-border)', color: 'var(--color-muted)' },
  }
  return (
    <button
      style={{ ...base, ...variants[variant], ...extra }}
      onClick={onClick}
      onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.08)'; e.currentTarget.style.transform = 'scale(1.01)' }}
      onMouseLeave={e => { e.currentTarget.style.filter = ''; e.currentTarget.style.transform = '' }}
      {...props}
    >
      {children}
    </button>
  )
}

export default function SimulacaoCard({ simulacao, onPatch, onRemove }) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const {
    imovelId, localizacao, preco, parcelaMensalPrice,
    totalPago, totalJuros, entrada, percentualEntrada,
    pagamentoTotalMes, tempoPagamentoAnos, custoTotalMensal,
    taxaJurosAnual, prazoMeses, valorFinanciado,
  } = simulacao

  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '20px',
        boxShadow: '0 2px 12px rgba(44,32,23,0.07)',
        transition: 'transform 250ms ease, box-shadow 250ms ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(44,32,23,0.12)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 12px rgba(44,32,23,0.07)' }}
    >
      {/* Accent top bar */}
      <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, var(--color-accent), var(--color-accent-3))' }} />

      <div className="flex flex-col gap-4 p-5 flex-1">

        {/* Header — imóvel */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-display font-semibold truncate" style={{ fontSize: '1.05rem', color: 'var(--color-text)', letterSpacing: '-0.01em' }}>
              {localizacao || '—'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)', marginTop: 2 }}>
              Imóvel #{imovelId?.slice(-6)}
            </div>
          </div>
          <Link
            to={`/imoveis/${imovelId}`}
            className="shrink-0 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-all"
            style={{ backgroundColor: 'var(--color-surface-2)', color: 'var(--color-muted)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-accent)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-muted)' }}
          >
            Ver imóvel <ArrowUpRight style={{ width: 11, height: 11 }} />
          </Link>
        </div>

        {/* Preço do imóvel destaque */}
        <div>
          <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
            Valor do imóvel
          </div>
          <div className="font-display font-semibold" style={{ fontSize: '1.55rem', color: 'var(--color-accent)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {formatBRL(preco)}
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--color-muted)', marginTop: 2 }}>
            Financiado: {formatBRL(valorFinanciado)} · Juros: {taxaJurosAnual != null ? `${(taxaJurosAnual * 100).toFixed(2)}% a.a.` : '—'}
          </div>
        </div>

        {/* Métricas principais — grid 2x2 */}
        <div className="grid grid-cols-2 gap-2">
          <MetricBox label="Parcela mensal" value={formatBRL(parcelaMensalPrice)} accent />
          <MetricBox label="Pgto total/mês" value={formatBRL(pagamentoTotalMes)} />
          <MetricBox label="Entrada" value={`${formatBRL(entrada)} ${percentualEntrada != null ? `(${(percentualEntrada * 100).toFixed(0)}%)` : ''}`} small />
          <MetricBox label="Prazo efetivo" value={`${tempoPagamentoAnos?.toFixed(1)} anos`} />
        </div>

        {/* Total pago e juros */}
        <div
          className="rounded-xl px-3 py-3 flex items-center justify-between gap-3"
          style={{ backgroundColor: 'rgba(201,106,46,0.07)', border: '1px solid rgba(201,106,46,0.15)' }}
        >
          <div>
            <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>Total pago</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-text)', letterSpacing: '-0.01em' }}>{formatBRL(totalPago + entrada)}</div>
          </div>
          <div style={{ width: '1px', alignSelf: 'stretch', backgroundColor: 'rgba(201,106,46,0.2)' }} />
          <div>
            <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>Total em juros</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#ef4444', letterSpacing: '-0.01em' }}>{formatBRL(totalJuros)}</div>
          </div>
          <div style={{ width: '1px', alignSelf: 'stretch', backgroundColor: 'rgba(201,106,46,0.2)' }} />
          <div>
            <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>Custo/mês total</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--color-accent-2)', letterSpacing: '-0.01em' }}>{formatBRL(custoTotalMensal)}</div>
          </div>
        </div>

        <div className="flex-1" />

        {/* Actions */}
         <div className="flex items-center gap-2 pt-6" style={{ borderTop: '1px solid var(--color-border)' }}>

          {/* Sheet editar */}
          <Sheet open={editOpen} onOpenChange={setEditOpen}>
            <SheetTrigger asChild>
              <CozyButton onClick={() => setEditOpen(true)} style={{ flex: 1, justifyContent: 'center' }}>
                <Edit3 style={{ width: 13, height: 13 }} /> Editar
              </CozyButton>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto" style={{ backgroundColor: 'var(--color-surface)', borderLeft: '1px solid var(--color-border)' }}>
              <SheetHeader>
                <SheetTitle className="font-display" style={{ fontSize: '1.3rem', color: 'var(--color-text)' }}>Editar simulação</SheetTitle>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-muted)', marginTop: 4 }}>{localizacao}</p>
              </SheetHeader>
              <div className="p-6">
                <SimulacaoForm
                  initialData={simulacao}
                  submitLabel="Salvar"
                  onCancel={() => setEditOpen(false)}
                  onSubmit={async (payload) => {
                    await onPatch(imovelId, payload)
                    setEditOpen(false)
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* Dialog remover */}
          <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
            <DialogTrigger asChild>
              <button
                className="flex items-center justify-center rounded-full p-2 transition-all"
                onClick={() => setDeleteOpen(true)}
                style={{ border: '1.5px solid var(--color-border)', color: 'var(--color-muted)', backgroundColor: 'transparent', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-muted)'; e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <Trash2 style={{ width: 15, height: 15 }} />
              </button>
            </DialogTrigger>
            <DialogContent style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '20px' }}>
              <DialogHeader>
                <DialogTitle className="font-display" style={{ fontSize: '1.3rem', color: 'var(--color-text)' }}>Remover simulação?</DialogTitle>
                <DialogDescription style={{ color: 'var(--color-muted)' }}>
                  A simulação de <strong>{localizacao}</strong> será removida permanentemente.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <CozyButton variant="outline" onClick={() => setDeleteOpen(false)}>Cancelar</CozyButton>
                <CozyButton variant="danger" onClick={async () => { await onRemove(imovelId); setDeleteOpen(false) }}>
                  Confirmar remoção
                </CozyButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>
      </div>
    </div>
  )
}