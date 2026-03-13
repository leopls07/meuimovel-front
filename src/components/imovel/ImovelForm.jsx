import { useMemo, useState } from 'react'

function Spinner() {
  return (
    <span
      className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
      aria-hidden="true"
    />
  )
}

function numberOrNull(v) {
  if (v === '' || v == null) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function calcularIptuMensal(precoValor, aliquotaValor) {
  const preco = numberOrNull(precoValor)
  const aliquota = numberOrNull(aliquotaValor)
  if (preco == null || aliquota == null) return null
  return (preco * (aliquota / 100)) / 12
}

function buildInitial(mode, initialData) {
  const base = {
    localizacao: '', metragem: '', quartos: '', vagas: '', qtdBanheiros: '',
    andar: '', anoConstrucao: '', areaLazer: false, vagaCoberta: false, varanda: false,
    preco: '', condominioMensal: '', iptuMensal: '', aliquotaIptu: '',
    distanciaMetroKm: '', notaLocalizacao: '', estadoConservacao: '', observacoes: '',
  }
  if (!initialData) return base
  const merged = { ...base, ...initialData }
  if (mode === 'patch') {
    Object.keys(base).forEach((k) => { merged[k] = '' })
    ;['areaLazer', 'vagaCoberta', 'varanda'].forEach((k) => { merged[k] = false })
  }
  return merged
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

function Field({ label, children, error, hint }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
        {label}
      </label>
      {children}
      {hint && <div style={{ fontSize: '0.72rem', color: 'var(--color-muted)' }}>{hint}</div>}
      {error && <div style={{ fontSize: '0.72rem', color: '#ef4444' }}>{error}</div>}
    </div>
  )
}

function CozyInput({ readOnly, ...props }) {
  return (
    <input
      style={{ ...inputStyle, ...(readOnly ? { opacity: 0.6, cursor: 'not-allowed' } : {}) }}
      readOnly={readOnly}
      onFocus={e => { if (!readOnly) { e.target.style.borderColor = 'var(--color-accent)'; e.target.style.boxShadow = '0 0 0 3px rgba(201,106,46,0.15)' } }}
      onBlur={e => { e.target.style.borderColor = 'var(--color-border)'; e.target.style.boxShadow = 'none' }}
      {...props}
    />
  )
}

function CheckboxField({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer" style={{ fontSize: '0.875rem', color: 'var(--color-text)' }}>
      <div
        className="flex h-5 w-5 items-center justify-center rounded-md transition-all shrink-0"
        style={{ backgroundColor: checked ? 'var(--color-accent)' : 'var(--color-bg)', border: `1.5px solid ${checked ? 'var(--color-accent)' : 'var(--color-border)'}` }}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      </div>
      {label}
    </label>
  )
}

function SectionTitle({ children }) {
  return (
    <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-muted)', paddingBottom: '0.5rem', borderBottom: '1px solid var(--color-border)' }}>
      {children}
    </div>
  )
}

export default function ImovelForm({ mode = 'create', initialData, onSubmit, onCancel, submitLabel = 'Salvar' }) {
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState(() => buildInitial(mode, initialData))

  const computed = useMemo(() => {
    const preco = numberOrNull(form.preco)
    const met = numberOrNull(form.metragem)
    const iptuMensalCalculado = calcularIptuMensal(form.preco, form.aliquotaIptu)
    const custoFixo = (numberOrNull(form.condominioMensal) || 0) + (iptuMensalCalculado || 0)
    return { precoM2: preco != null && met ? preco / met : null, custoFixo, iptuMensalCalculado }
  }, [form])

  function setField(key) {
    return (e) => {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
      setForm((f) => {
        const next = { ...f, [key]: value }
        if (key === 'preco' || key === 'aliquotaIptu') {
          const iptuMensal = calcularIptuMensal(next.preco, next.aliquotaIptu)
          next.iptuMensal = iptuMensal != null ? iptuMensal.toFixed(2) : ''
        }
        return next
      })
      setErrors((prev) => ({ ...prev, [key]: undefined }))
    }
  }

  function applyValidationErrors(validationErrors) {
    const next = {}
    validationErrors.forEach((e) => { next[e.field] = e.message })
    setErrors(next)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    const payload = {
      localizacao: form.localizacao || undefined,
      metragem: numberOrNull(form.metragem),
      quartos: numberOrNull(form.quartos),
      vagas: numberOrNull(form.vagas),
      qtdBanheiros: numberOrNull(form.qtdBanheiros),
      andar: numberOrNull(form.andar),
      anoConstrucao: numberOrNull(form.anoConstrucao),
      areaLazer: form.areaLazer || undefined,
      vagaCoberta: form.vagaCoberta || undefined,
      varanda: form.varanda || undefined,
      preco: numberOrNull(form.preco),
      condominioMensal: numberOrNull(form.condominioMensal),
      iptuMensal: computed.iptuMensalCalculado ?? null,
      aliquotaIptu: numberOrNull(form.aliquotaIptu),
      distanciaMetroKm: numberOrNull(form.distanciaMetroKm),
      notaLocalizacao: numberOrNull(form.notaLocalizacao),
      estadoConservacao: numberOrNull(form.estadoConservacao),
      observacoes: form.observacoes || undefined,
    }
    if (mode === 'patch') {
      Object.keys(payload).forEach((k) => { if (payload[k] == null || payload[k] === '' || payload[k] === false) delete payload[k] })
    }
    try {
      await onSubmit?.(payload, applyValidationErrors)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">

      <section className="space-y-4">
        <SectionTitle>Localização</SectionTitle>
        <Field label="Endereço" error={errors.localizacao}>
          <CozyInput value={form.localizacao} onChange={setField('localizacao')} placeholder="Rua, bairro, cidade" />
        </Field>
      </section>

      <section className="space-y-4">
        <SectionTitle>Características</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[['metragem','Metragem (m²)'],['quartos','Quartos'],['vagas','Vagas'],['qtdBanheiros','Banheiros'],['andar','Andar'],['anoConstrucao','Ano de construção']].map(([k, label]) => (
            <Field key={k} label={label} error={errors[k]}>
              <CozyInput type="number" value={form[k]} onChange={setField(k)} placeholder="0" />
            </Field>
          ))}
        </div>
        <div className="flex flex-wrap gap-5 pt-1">
          {[['areaLazer','Área de lazer'],['vagaCoberta','Vaga coberta'],['varanda','Varanda']].map(([k, label]) => (
            <CheckboxField key={k} label={label} checked={form[k]} onChange={setField(k)} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle>Financeiro</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Preço" error={errors.preco}>
            <CozyInput type="number" placeholder="0,00" value={form.preco} onChange={setField('preco')} />
          </Field>
          <Field label="Condomínio mensal" error={errors.condominioMensal}>
            <CozyInput type="number" placeholder="0,00" value={form.condominioMensal} onChange={setField('condominioMensal')} />
          </Field>
          <Field label="Alíquota IPTU (%)" error={errors.aliquotaIptu}>
            <CozyInput type="number" placeholder="0" value={form.aliquotaIptu} onChange={setField('aliquotaIptu')} />
          </Field>
          <Field label="IPTU mensal" hint="Calculado automaticamente: (preço × alíquota) ÷ 12">
            <CozyInput type="number" placeholder="0,00" value={form.iptuMensal} readOnly />
          </Field>
          <Field label="Distância do metrô (km)" error={errors.distanciaMetroKm}>
            <CozyInput type="number" placeholder="0" value={form.distanciaMetroKm} onChange={setField('distanciaMetroKm')} />
          </Field>

          {/* Computed summary */}
          <div className="rounded-xl p-3 space-y-2" style={{ backgroundColor: 'var(--color-surface-2)' }}>
            <div>
              <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>Preço/m²</div>
              <div style={{ fontWeight: 600, color: 'var(--color-accent)', fontSize: '0.9rem' }}>
                {computed.precoM2 != null ? computed.precoM2.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '—'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>Custo fixo mensal</div>
              <div style={{ fontWeight: 600, color: 'var(--color-text)', fontSize: '0.9rem' }}>
                {computed.custoFixo ? computed.custoFixo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '—'}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <SectionTitle>Avaliação</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nota localização (1-10)" error={errors.notaLocalizacao}>
            <CozyInput type="number" value={form.notaLocalizacao} onChange={setField('notaLocalizacao')} placeholder="0" />
          </Field>
          <Field label="Estado de conservação (1-5)" error={errors.estadoConservacao}>
            <CozyInput type="number" value={form.estadoConservacao} onChange={setField('estadoConservacao')} placeholder="0" />
          </Field>
          <Field label="Observações" error={errors.observacoes} className="sm:col-span-2">
            <CozyInput value={form.observacoes} onChange={setField('observacoes')} placeholder="Detalhes adicionais" />
          </Field>
        </div>
      </section>

      <div className="flex flex-wrap gap-3 pt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center rounded-full px-6 py-2.5 text-sm font-semibold transition-all"
          style={{ backgroundColor: 'var(--color-accent)', color: '#fff', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}
          onMouseEnter={e => { if (!saving) e.currentTarget.style.filter = 'brightness(1.08)' }}
          onMouseLeave={e => e.currentTarget.style.filter = ''}
        >
          {saving && <Spinner />} {saving ? 'Salvando...' : submitLabel}
        </button>
        <button
          type="button"
          disabled={saving}
          className="flex items-center rounded-full px-6 py-2.5 text-sm font-semibold transition-all"
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
