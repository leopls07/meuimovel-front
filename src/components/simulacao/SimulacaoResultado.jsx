import { formatBRL, formatPct } from '@/utils/formatters'

function Field({ label, value, highlight }) {
  return (
    <div className="rounded-xl p-3" style={{ backgroundColor: 'var(--color-surface-2)' }}>
      <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
        {label}
      </div>
      <div style={{ fontWeight: 600, fontSize: '0.95rem', marginTop: 2, color: highlight ? 'var(--color-accent)' : 'var(--color-text)' }}>
        {value}
      </div>
    </div>
  )
}

export default function SimulacaoResultado({ simulacao }) {
  if (!simulacao) return null

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
    >
      <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
          Resultado da simulação
        </div>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Valor financiado"        value={formatBRL(simulacao.valorFinanciado)}    highlight />
          <Field label="Parcela mensal (Price)"  value={formatBRL(simulacao.parcelaMensalPrice)} highlight />
          <Field label="Pagamento total/mês"     value={formatBRL(simulacao.pagamentoTotalMes)} />
          <Field label="Nº parcelas efetivas"    value={simulacao.nparcelasEfetivas ?? '—'} />
          <Field label="Tempo de pagamento (anos)" value={simulacao.tempoPagamentoAnos ?? '—'} />
          <Field label="Custo total mensal"      value={formatBRL(simulacao.custoTotalMensal)} />
          <Field label="Total pago"              value={formatBRL(simulacao.totalPago + simulacao.entrada)} />
          <Field label="Total de juros"          value={formatBRL(simulacao.totalJuros)} />
          <Field label="Juros % do financiado"   value={formatPct(simulacao.jurosPctFinanciado)} />
        </div>
      </div>
    </div>
  )
}
