import { NavLink } from 'react-router-dom'
import { Building2, Home, Plus, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

function Item({ to, icon: Icon, children, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
          isActive ? 'text-white' : 'hover:opacity-100'
        )
      }
      style={({ isActive }) => ({
        backgroundColor: isActive ? 'var(--color-sidebar-active)' : 'transparent',
        color: isActive ? 'var(--color-sidebar-text)' : 'var(--color-sidebar-muted)',
      })}
      onMouseEnter={e => {
        if (!e.currentTarget.classList.contains('active')) {
          e.currentTarget.style.backgroundColor = 'var(--color-sidebar-hover)'
          e.currentTarget.style.color = 'var(--color-sidebar-text)'
        }
      }}
      onMouseLeave={e => {
        if (!e.currentTarget.getAttribute('aria-current')) {
          e.currentTarget.style.backgroundColor = ''
          e.currentTarget.style.color = 'var(--color-sidebar-muted)'
        }
      }}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{children}</span>
    </NavLink>
  )
}

export default function SidebarNav({ variant = 'desktop' }) {
  return (
    <div className={cn('flex h-full min-w-0 flex-col', variant === 'mobile' && 'pt-2')}>
      {/* Logo area */}
      <div className="px-5 py-6">
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl shrink-0"
            style={{ backgroundColor: 'var(--color-surface-2)', color: '#fff' }}
          >
            <img src="src/assets/favicon.png" alt="Logo" className="h-10 w-10" />
          </div>
          <div className="leading-tight">
            <div
              className="font-display font-semibold"
              style={{ color: 'var(--color-sidebar-text)', fontSize: '1.0rem', letterSpacing: '-0.01em', lineHeight: 1.2 }}
            > Sacada<br/>
            </div>
            <div style={{ color: 'var(--color-sidebar-muted)', fontSize: '0.75rem', letterSpacing: '0.04em', lineHeight: 1.3, marginTop: 1 }}>
              Simulador de financiamento imobiliário
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', backgroundColor: 'rgba(245,239,230,0.08)', margin: '0 20px' }} />

      {/* Label */}
      <div
        className="px-5 pt-5 pb-2"
        style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-sidebar-muted)' }}
      >
        Menu
      </div>

      <nav className="flex flex-col gap-1 px-3 pb-3">
        <Item to="/imoveis" icon={Building2} end>
          Imóveis
        </Item>
        <Item to="/simulacoes" icon={BarChart3}>
          Simulações
        </Item>
        <Item to="/imoveis/novo" icon={Plus}>
          Novo imóvel
        </Item>
      </nav>

      <div
        className="mt-auto px-5 py-5"
        style={{ fontSize: '0.7rem', color: 'var(--color-sidebar-muted)', borderTop: '1px solid rgba(245,239,230,0.08)' }}
      >
        <div style={{ marginBottom: '2px', fontWeight: 500 }}>API</div>
        <div style={{ wordBreak: 'break-all', opacity: 0.7 }}>
          {import.meta.env.VITE_API_URL || 'http://localhost:8080'}
        </div>
      </div>
    </div>
  )
}