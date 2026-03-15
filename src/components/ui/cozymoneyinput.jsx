import { useState, useEffect } from 'react'

/**
 * Input com formatação monetária BRL em tempo real.
 * - Aceita `value` como número (ex: 650000)
 * - Chama `onChange(numericValue)` com o número puro
 * - Exibe "R$ 650.000,00" enquanto o usuário digita
 */

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

function toDisplay(num) {
  if (num === '' || num == null) return ''
  const n = typeof num === 'string' ? parseFloat(num) : num
  if (!Number.isFinite(n)) return ''
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function parseInput(raw) {
  // Remove tudo exceto dígitos e vírgula
  const digits = raw.replace(/[^\d,]/g, '')
  // Trata vírgula como separador decimal
  const normalized = digits.replace(',', '.')
  const n = parseFloat(normalized)
  return Number.isFinite(n) ? n : null
}

export default function CozyMoneyInput({ value, onChange, placeholder = 'R$ 0,00', readOnly, style: extraStyle, ...props }) {
  const [display, setDisplay] = useState(() => toDisplay(value))
  const [focused, setFocused] = useState(false)

  // Sync external value changes (ex: quando buildInitial seta o valor)
  useEffect(() => {
    if (!focused) {
      setDisplay(toDisplay(value))
    }
  }, [value, focused])

  function handleChange(e) {
    const raw = e.target.value
    setDisplay(raw)
    const num = parseInput(raw)
    onChange?.(num)
  }

  function handleFocus(e) {
    setFocused(true)
    // Mostra só o número puro para facilitar a edição
    const n = typeof value === 'string' ? parseFloat(value) : value
    if (Number.isFinite(n) && n !== 0) {
      setDisplay(String(n).replace('.', ','))
    } else {
      setDisplay('')
    }
    e.target.style.borderColor = 'var(--color-accent)'
    e.target.style.boxShadow = '0 0 0 3px rgba(201,106,46,0.15)'
  }

  function handleBlur(e) {
    setFocused(false)
    // Formata ao sair do campo
    const num = parseInput(display)
    if (num != null) {
      setDisplay(toDisplay(num))
      onChange?.(num)
    } else {
      setDisplay('')
      onChange?.(null)
    }
    e.target.style.borderColor = 'var(--color-border)'
    e.target.style.boxShadow = 'none'
  }

  return (
    <input
      type="text"
      inputMode="decimal"
      value={display}
      onChange={readOnly ? undefined : handleChange}
      onFocus={readOnly ? undefined : handleFocus}
      onBlur={readOnly ? undefined : handleBlur}
      placeholder={placeholder}
      readOnly={readOnly}
      style={{
        ...inputStyle,
        ...(readOnly ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
        ...extraStyle,
      }}
      {...props}
    />
  )
}