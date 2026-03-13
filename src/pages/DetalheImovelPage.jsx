import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Edit3, Trash2, Plus, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import ImovelPatchForm from '@/components/imovel/ImovelPatchForm'
import SimulacaoForm from '@/components/simulacao/SimulacaoForm'
import SimulacaoResultado from '@/components/simulacao/SimulacaoResultado'
import { useImoveis } from '@/hooks/useImoveis'
import { useSimulacao } from '@/hooks/useSimulacao'
import { formatBRL } from '@/utils/formatters'


const LABELS = {
  id: 'ID',
  localizacao: 'Localização',
  notaLocalizacao: 'Nota localização',
  metragem: 'Metragem (m²)',
  quartos: 'Quartos',
  vagas: 'Vagas',
  qtdBanheiros: 'Banheiros',
  varanda: 'Varanda',
  andar: 'Andar',
  areaLazer: 'Área de lazer',
  vagaCoberta: 'Vaga coberta',
  distanciaMetroKm: 'Distância metrô (km)',
  preco: 'Preço',
  precoM2: 'Preço/m²',
  iptuMensal: 'IPTU mensal',
  condominioMensal: 'Condomínio mensal',
  custoFixoMensal: 'Custo fixo mensal',
  anoConstrucao: 'Ano de construção',
  estadoConservacao: 'Estado de conservação',
  aliquotaIptu: 'Alíquota IPTU (%)',
  observacoes: 'Observações',
}

function kv(obj) {
  if (!obj) return []
  return Object.entries(obj)
}

function StatCard({ label, value, accent }) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
      }}
    >
      <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
        {label}
      </div>
      <div
        className="font-display font-semibold mt-1"
        style={{ fontSize: '1.3rem', color: accent ? 'var(--color-accent)' : 'var(--color-text)', letterSpacing: '-0.01em' }}
      >
        {value}
      </div>
    </div>
  )
}

function CozyButton({ children, onClick, variant = 'primary', style: extraStyle, ...props }) {
  const base = {
    display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
    borderRadius: '9999px', padding: '0.5rem 1.25rem',
    fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
    transition: 'filter 150ms, transform 150ms',
    border: 'none',
  }
  const variants = {
    primary: { backgroundColor: 'var(--color-accent)', color: '#fff' },
    outline: { backgroundColor: 'transparent', border: '1.5px solid var(--color-border)', color: 'var(--color-muted)' },
    danger: { backgroundColor: '#ef4444', color: '#fff' },
  }
  return (
    <button
      style={{ ...base, ...variants[variant], ...extraStyle }}
      onClick={onClick}
      onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.08)'; e.currentTarget.style.transform = 'scale(1.01)' }}
      onMouseLeave={e => { e.currentTarget.style.filter = ''; e.currentTarget.style.transform = '' }}
      {...props}
    >
      {children}
    </button>
  )
}

export default function DetalheImovelPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getById, patch, remove } = useImoveis({ autoLoad: false })
  const simulacao = useSimulacao(id)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  useEffect(() => {
    let ignore = false
    async function run() {
      setLoading(true)
      try {
        const d = await getById(id)
        if (!ignore) setData(d)
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    run()
    return () => { ignore = true }
  }, [id, getById])

  const computed = useMemo(() => {
    const preco = Number(data?.preco)
    const metragem = Number(data?.metragem)
    const precoM2 = Number.isFinite(preco) && Number.isFinite(metragem) && metragem ? preco / metragem : null
    const custoFixo = (Number(data?.condominioMensal) || 0) + (Number(data?.iptuMensal) || 0)
    return { precoM2, custoFixo }
  }, [data])

  const hasSimulacao = Boolean(simulacao.data)

  if (loading) {
    return (
      <div className="space-y-4 animate-fade-up">
        <div className="shimmer h-8 w-1/3 rounded-xl" />
        <div className="shimmer h-40 w-full rounded-2xl" />
        <div className="shimmer h-48 w-full rounded-2xl" />
      </div>
    )
  }

  if (!data) {
    return (
      <div
        className="rounded-2xl p-10 text-center animate-fade-up"
        style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
      >
        <div className="font-display text-xl font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
          Imóvel não encontrado
        </div>
        <CozyButton variant="outline" onClick={() => navigate('/imoveis')}>
          <ArrowLeft className="h-4 w-4" /> Voltar
        </CozyButton>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Top bar */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <button
            onClick={() => navigate('/imoveis')}
            className="flex items-center gap-1.5 mb-3 transition-all"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-muted)', fontSize: '0.8rem', fontWeight: 500, padding: 0 }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-muted)'}
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Voltar
          </button>
          <h2
            className="font-display font-semibold"
            style={{ fontSize: '1.75rem', color: 'var(--color-text)', letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            {data.localizacao}
          </h2>
          <span
            className="inline-block mt-2 rounded-full px-3 py-0.5 text-xs font-semibold"
            style={{
              backgroundColor: hasSimulacao ? 'rgba(107,143,110,0.15)' : 'var(--color-surface-2)',
              color: hasSimulacao ? 'var(--color-accent-2)' : 'var(--color-muted)',
            }}
          >
            {hasSimulacao ? 'Com simulação' : 'Sem simulação'}
          </span>
        </div>

        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <CozyButton>
                <Edit3 className="h-3.5 w-3.5" /> Editar
              </CozyButton>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto" style={{ backgroundColor: 'var(--color-surface)',borderLeft: '1px solid var(--color-border)' }}>
              <SheetHeader>
                <SheetTitle className="font-display" style={{ fontSize: '1.4rem', color: 'var(--color-text)' }}>Editar imóvel</SheetTitle>
              </SheetHeader>
              <div className="p-6">
                <ImovelPatchForm
                  onCancel={() => {}}
                  onSubmit={async (payload, applyValidationErrors) => {
                    const updated = await patch(id, payload, { onValidationErrors: applyValidationErrors })
                    if (updated) setData(updated)
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>

          <Dialog>
            <DialogTrigger asChild>
              <CozyButton variant="danger">
                <Trash2 className="h-3.5 w-3.5" /> Remover
              </CozyButton>
            </DialogTrigger>
            <DialogContent style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '20px' }}>
              <DialogHeader>
                <DialogTitle className="font-display" style={{ fontSize: '1.4rem', color: 'var(--color-text)' }}>Remover imóvel?</DialogTitle>
                <DialogDescription style={{ color: 'var(--color-muted)' }}>Essa ação não pode ser desfeita.</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <CozyButton variant="outline">Cancelar</CozyButton>
                <CozyButton variant="danger" onClick={async () => { const ok = await remove(id); if (ok) navigate('/imoveis') }}>
                  Confirmar remoção
                </CozyButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 animate-fade-up-1">
        <StatCard label="Preço" value={formatBRL(data.preco)} accent />
        <StatCard label="Preço/m² (calculado)" value={computed.precoM2 != null ? formatBRL(computed.precoM2) : '—'} />
        <StatCard label="Custo fixo mensal" value={formatBRL(computed.custoFixo || null)} />
      </div>

      {/* Fields */}
      <div
        className="animate-fade-up-2 rounded-2xl overflow-hidden"
        style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
      >
        <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div className="font-semibold" style={{ color: 'var(--color-text)', fontSize: '0.875rem' }}>
            Campos do imóvel
          </div>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {kv(data).filter(([k]) => k !== 'simulacao').map(([k, v]) => (
              <div
                key={k}
                className="rounded-xl px-3 py-2.5"
                style={{ backgroundColor: 'var(--color-surface-2)' }}
              >
                <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
                  {LABELS[k] ?? k}
                </div>
                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text)', marginTop: 2, wordBreak: 'break-words' }}>
                  {v == null ? '—' : typeof v === 'boolean' ? (v ? 'Sim' : 'Não') : String(v)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Simulation */}
      <div className="animate-fade-up-3">
        <div
          className="font-display font-semibold mb-4"
          style={{ fontSize: '1.3rem', color: 'var(--color-text)' }}
        >
          Simulação de financiamento
        </div>

        {!hasSimulacao ? (
          <div
            className="rounded-2xl p-10 text-center"
            style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
          >
            <div style={{ color: 'var(--color-muted)', fontSize: '0.875rem', marginBottom: 16 }}>
              Nenhuma simulação cadastrada.
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <CozyButton>
                  <Plus className="h-3.5 w-3.5" /> Criar simulação
                </CozyButton>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto" style={{ backgroundColor: 'var(--color-surface)' }}>
                <SheetHeader>
                  <SheetTitle className="font-display" style={{ fontSize: '1.4rem', color: 'var(--color-text)' }}>Criar simulação</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  <SimulacaoForm onCancel={() => {}} onSubmit={async (payload) => { await simulacao.create(payload) }} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <CozyButton>
                    <Edit3 className="h-3.5 w-3.5" /> Editar simulação
                  </CozyButton>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto" style={{ backgroundColor: 'var(--color-surface)', borderLeft: '1px solid var(--color-border)'}}>
                  <SheetHeader>
                    <SheetTitle className="font-display" style={{ fontSize: '1.4rem', color: 'var(--color-text)' }}>Editar simulação</SheetTitle>
                  </SheetHeader>
                  <div className="p-6">
                    <SimulacaoForm initialData={simulacao.data} submitLabel="Salvar" onCancel={() => {}} onSubmit={async (payload) => { await simulacao.patch(payload) }} />
                  </div>
                </SheetContent>
              </Sheet>

              <Dialog>
                <DialogTrigger asChild>
                  <CozyButton variant="danger">
                    <Trash2 className="h-3.5 w-3.5" /> Remover simulação
                  </CozyButton>
                </DialogTrigger>
                <DialogContent style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '20px' }}>
                  <DialogHeader>
                    <DialogTitle className="font-display" style={{ fontSize: '1.4rem', color: 'var(--color-text)' }}>Remover simulação?</DialogTitle>
                    <DialogDescription style={{ color: 'var(--color-muted)' }}>Essa ação não pode ser desfeita.</DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <CozyButton variant="outline">Cancelar</CozyButton>
                    <CozyButton variant="danger" onClick={async () => { await simulacao.remove() }}>Confirmar remoção</CozyButton>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <SimulacaoResultado simulacao={simulacao.data} />
          </div>
        )}
      </div>
    </div>
  )
}
