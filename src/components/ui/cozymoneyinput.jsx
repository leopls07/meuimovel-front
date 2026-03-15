import { useState, useEffect } from 'react'

/**
 * Formata em tempo real enquanto digita.
 * - Recebe `value` como número (ex: 650000)
 * - Chama `onChange(number)` com o número puro — nunca com caracteres de formatação
 * - Exibe "R$ 650.000" enquanto digita, "R$ 650.000,50" se tiver centavos
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

/** Converte número para string formatada BRL sem símbolo de moeda */
function formatDisplay(num) {
  if (num == null || num === '') return ''
  const n = typeof num === 'string' ? parseFloat(String(num).replace(',', '.')) : num
  if (!Number.isFinite(n)) return ''
  // Formata com separadores mas sem "R$" para exibir no input
  return n.toLocaleString('pt-BR', {
    minimumFractionDigits: n % 1 !== 0 ? 2 : 0,
    maximumFractionDigits: 2,
  })
}

/**
 * Converte o que o usuário digitou para número.
 * Suporta "650.000,50" → 650000.50
 *        "650000,50"  → 650000.50
 *        "650000"     → 650000
 */
function parseDisplay(raw) {
  if (!raw || raw.trim() === '') return null
  // Remove "R$" e espaços que possam ter entrado
  let clean = raw.replace(/R\$\s*/g, '').trim()
  // Remove pontos de milhar (qualquer ponto seguido de 3 dígitos é separador)
  // Troca vírgula decimal por ponto
  clean = clean.replace(/\./g, '').replace(',', '.')
  const n = parseFloat(clean)
  return Number.isFinite(n) ? n : null
}

/**
 * Formata a string bruta enquanto o usuário digita:
 * mantém apenas dígitos e uma vírgula, aplica separadores de milhar na parte inteira.
 */
function formatWhileTyping(raw) {
  // Remove tudo exceto dígitos e vírgula
  const clean = raw.replace(/[^\d,]/g, '')

  // Separa parte inteira e decimal
  const commaIdx = clean.indexOf(',')
  let intPart, decPart

  if (commaIdx === -1) {
    intPart = clean
    decPart = null
  } else {
    intPart = clean.slice(0, commaIdx)
    decPart = clean.slice(commaIdx + 1, commaIdx + 3) // máx 2 casas decimais
  }

  // Aplica pontos de milhar na parte inteira
  const intFormatted = intPart
    ? parseInt(intPart, 10).toLocaleString('pt-BR')
    : ''

  if (decPart !== null) {
    return `${intFormatted},${decPart}`
  }
  return intFormatted
}

export default function CozyMoneyInput({
  value,
  onChange,
  placeholder = 'R$ 0,00',
  readOnly,
  style: extraStyle,
  ...props
}) {
  const [display, setDisplay] = useState(() => formatDisplay(value))

  // Sincroniza quando o valor externo muda (ex: reset do form)
  useEffect(() => {
    setDisplay(formatDisplay(value))
  }, [value])

  function handleChange(e) {
    const raw = e.target.value
    const formatted = formatWhileTyping(raw)
    setDisplay(formatted)

    // Envia número puro para o pai — nunca a string formatada
    const num = parseDisplay(formatted)
    onChange?.(num)
  }

  function handleBlur(e) {
    // No blur, aplica formatação completa (arredonda centavos, etc.)
    const num = parseDisplay(display)
    if (num != null) {
      setDisplay(formatDisplay(num))
      onChange?.(num)
    } else {
      setDisplay('')
      onChange?.(null)
    }
    e.target.style.borderColor = 'var(--color-border)'
    e.target.style.boxShadow = 'none'
  }

  function handleFocus(e) {
    e.target.style.borderColor = 'var(--color-accent)'
    e.target.style.boxShadow = '0 0 0 3px rgba(201,106,46,0.15)'
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