import { useMemo, useState } from 'react'
import { Search, X, ChevronDown, ChevronUp } from 'lucide-react'

function toNumberOrNull(v) {
  if (v === '' || v == null) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        style={{
          fontSize: '0.65rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--color-muted)',
        }}
      >
        {label}
      </label>
      {children}
    </div>
  )
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

function CozyInput({ type = 'text', placeholder, value, onChange }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={inputStyle}
      onFocus={e => {
        e.target.style.borderColor = 'var(--color-accent)'
        e.target.style.boxShadow = '0 0 0 3px rgba(201,106,46,0.15)'
      }}
      onBlur={e => {
        e.target.style.borderColor = 'var(--color-border)'
        e.target.style.boxShadow = 'none'
      }}
    />
  )
}

function CheckboxField({ label, checked, onChange }) {
  return (
    <label
      className="flex items-center gap-2.5 cursor-pointer"
      style={{ fontSize: '0.875rem', color: 'var(--color-text)' }}
    >
      <div
        className="flex h-5 w-5 items-center justify-center rounded-md transition-all"
        style={{
          backgroundColor: checked ? 'var(--color-accent)' : 'var(--color-bg)',
          border: `1.5px solid ${checked ? 'var(--color-accent)' : 'var(--color-border)'}`,
        }}
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

export default function FiltrosBusca({ onSearch, onClear, disabled }) {
  const [open, setOpen] = useState(true)
  const [form, setForm] = useState({
    localizacao: '',
    precoMin: '',
    precoMax: '',
    metMin: '',
    quartos: '',
    banheiros: '',  
    vagas: '',
    areaLazer: false,
    vagaCoberta: false,
    distMaxMetro: '',
    notaMinLoc: '',
  })

  const params = useMemo(() => {
    const p = {
      localizacao: form.localizacao?.trim() || null,
      precoMin: toNumberOrNull(form.precoMin),
      precoMax: toNumberOrNull(form.precoMax),
      metMin: toNumberOrNull(form.metMin),
      quartos: toNumberOrNull(form.quartos),
      banheiros: toNumberOrNull(form.banheiros),
      vagas: toNumberOrNull(form.vagas),
      areaLazer: form.areaLazer ? true : null,
      vagaCoberta: form.vagaCoberta ? true : null,
      distMaxMetro: toNumberOrNull(form.distMaxMetro),
      notaMinLoc: toNumberOrNull(form.notaMinLoc),
    }
    Object.keys(p).forEach((k) => { if (p[k] == null || p[k] === '') delete p[k] })
    return p
  }, [form])

  const hasAnyFilter = Object.keys(params).length > 0

  function handleChange(key) {
    return (e) => {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
      setForm((f) => ({ ...f, [key]: value }))
    }
  }

  function handleClear() {
    setForm({ localizacao: '', precoMin: '', precoMax: '', metMin: '', quartos: '', vagas: '', areaLazer: false, vagaCoberta: false, distMaxMetro: '', notaMinLoc: '' })
    onClear?.()
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '20px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <button
        type="button"
        className="flex w-full items-center justify-between px-5 py-4"
        onClick={() => setOpen((o) => !o)}
        style={{ backgroundColor: 'transparent', cursor: 'pointer', border: 'none' }}
      >
        <div className="flex items-center gap-2.5">
          <Search style={{ width: 16, height: 16, color: 'var(--color-accent)' }} />
          <span
            style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text)' }}
          >
            Filtros de busca
          </span>
          {hasAnyFilter && (
            <span
              className="rounded-full px-2 py-0.5 text-xs font-semibold"
              style={{ backgroundColor: 'var(--color-accent)', color: '#fff' }}
            >
              {Object.keys(params).length}
            </span>
          )}
        </div>
        {open
          ? <ChevronUp style={{ width: 16, height: 16, color: 'var(--color-muted)' }} />
          : <ChevronDown style={{ width: 16, height: 16, color: 'var(--color-muted)' }} />
        }
      </button>

      {open && (
        <div style={{ borderTop: '1px solid var(--color-border)', padding: '20px' }}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="md:col-span-3">
              <Field label="Localização">
                <CozyInput
                  value={form.localizacao}
                  onChange={handleChange('localizacao')}
                  placeholder="Ex: Vila Mariana, SP"
                />
              </Field>
            </div>

            <Field label="Preço mín.">
              <CozyInput type="number" placeholder="0" value={form.precoMin} onChange={handleChange('precoMin')} />
            </Field>
            <Field label="Preço máx.">
              <CozyInput type="number" placeholder="0" value={form.precoMax} onChange={handleChange('precoMax')} />
            </Field>
            <Field label="Metragem mín. (m²)">
              <CozyInput type="number" placeholder="0" value={form.metMin} onChange={handleChange('metMin')} />
            </Field>

            <Field label="Quartos">
              <CozyInput type="number" placeholder="0" value={form.quartos} onChange={handleChange('quartos')} />
            </Field>

            <Field label="Banheiros">
              <CozyInput type="number" placeholder="0" value={form.banheiros} onChange={handleChange('banheiros')} />
            </Field>

            <Field label="Vagas">
              <CozyInput type="number" placeholder="0" value={form.vagas} onChange={handleChange('vagas')} />
            </Field>
            <Field label="Dist. máx. metrô (km)">
              <CozyInput type="number" placeholder="0" value={form.distMaxMetro} onChange={handleChange('distMaxMetro')} />
            </Field>

            <Field label="Nota mín. localização">
              <CozyInput type="number" placeholder="0" value={form.notaMinLoc} onChange={handleChange('notaMinLoc')} />
            </Field>

            <div className="flex items-end gap-5 md:col-span-2 pb-1">
              <CheckboxField label="Área de lazer" checked={form.areaLazer} onChange={handleChange('areaLazer')} />
              <CheckboxField label="Vaga coberta" checked={form.vagaCoberta} onChange={handleChange('vagaCoberta')} />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={disabled}
              className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all"
              style={{ backgroundColor: 'var(--color-accent)', color: '#fff', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.7 : 1 }}
              onClick={() => onSearch(hasAnyFilter ? params : null)}
              onMouseEnter={e => { if (!disabled) e.currentTarget.style.filter = 'brightness(1.08)' }}
              onMouseLeave={e => e.currentTarget.style.filter = ''}
            >
              <Search className="h-3.5 w-3.5" /> Buscar
            </button>

            {hasAnyFilter && (
              <button
                type="button"
                className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all"
                style={{ border: '1.5px solid var(--color-border)', color: 'var(--color-muted)', backgroundColor: 'transparent', cursor: 'pointer' }}
                onClick={handleClear}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-accent)'; e.currentTarget.style.color = 'var(--color-accent)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-muted)' }}
              >
                <X className="h-3.5 w-3.5" /> Limpar filtros
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
