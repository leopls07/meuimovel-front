import { useState } from 'react'

function Spinner() {
  return <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
}

function num(v) {
  if (v === '' || v == null) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

const inputStyle = {
  backgroundColor: 'var(--color-bg)',
  border: '1px solid var(--color-border)',
  borderRadius: '10px',
  padding: '0.5rem 0.75rem',
  fontSize: '0.875rem',
  color: 'var(--color-text)',
  width: '100%',
  outline: 'none',
  transition: 'border-color 150ms, box-shadow 150ms',
}

function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
        {label}
      </label>
      {children}
      {hint && <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>{hint}</div>}
    </div>
  )
}

function CozyInput(props) {
  return (
    <input
      style={inputStyle}
      onFocus={e => { e.target.style.borderColor = 'var(--color-accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(201,106,46,0.15)' }}
      onBlur={e => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.boxShadow = 'none' }}
      {...props}
    />
  )
}

export default function SimulacaoForm({ initialData, onSubmit, onCancel, submitLabel = 'Salvar' }) {
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    entrada: initialData?.entrada ?? '',
    taxaJurosAnual: initialData?.taxaJurosAnual != null ? Number(initialData.taxaJurosAnual) * 100 : '',
    prazoMeses: initialData?.prazoMeses ?? '',
    amortizacaoExtraMes: initialData?.amortizacaoExtraMes ?? '',
  })

  function setField(key) {
    return (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await onSubmit?.({
        entrada: num(form.entrada),
        taxaJurosAnual: num(form.taxaJurosAnual) != null ? num(form.taxaJurosAnual) / 100 : null,
        prazoMeses: num(form.prazoMeses),
        amortizacaoExtraMes: num(form.amortizacaoExtraMes),
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Entrada">
          <CozyInput type="number" placeholder="0,00" value={form.entrada} onChange={setField('entrada')} />
        </Field>
        <Field label="Taxa de juros anual (%)">
          <CozyInput type="number" placeholder="12" value={form.taxaJurosAnual} onChange={setField('taxaJurosAnual')} />
        </Field>
        <Field label="Prazo (meses)">
          <CozyInput type="number" placeholder="360" value={form.prazoMeses} onChange={setField('prazoMeses')} />
        </Field>
        <Field label="Amortização extra/mês">
          <CozyInput type="number" placeholder="0,00" value={form.amortizacaoExtraMes} onChange={setField('amortizacaoExtraMes')} />
        </Field>
      </div>

      <div className="flex flex-wrap gap-3 pt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center rounded-full px-6 py-2.5 text-sm font-semibold"
          style={{ backgroundColor: 'var(--color-accent)', color: '#fff', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}
          onMouseEnter={e => { if (!saving) e.currentTarget.style.filter = 'brightness(1.08)' }}
          onMouseLeave={e => e.currentTarget.style.filter = ''}
        >
          {saving && <Spinner />} {saving ? 'Salvando...' : submitLabel}
        </button>
        <button
          type="button"
          disabled={saving}
          className="flex items-center rounded-full px-6 py-2.5 text-sm font-semibold"
          style={{ backgroundColor: 'transparent', border: '1.5px solid var(--color-border)', color: 'var(--color-muted)', cursor: 'pointer' }}
          onClick={onCancel}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-accent)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-muted)' }}
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
