import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

const TITLES = [
  { match: /^\/imoveis$/, title: 'Imóveis' },
  { match: /^\/imoveis\/novo$/, title: 'Cadastrar imóvel' },
  { match: /^\/imoveis\/.+/, title: 'Detalhe do imóvel' },
  { match: /^\/simulacoes$/, title: 'Simulações' },
  { match: /^\/simulacoes\/novo$/, title: 'Cadastrar simulação' },
  { match: /^\/simulacoes\/.+/, title: 'Detalhe da simulação' },
]

function usePageTitle() {
  const { pathname } = useLocation()
  const found = TITLES.find((t) => t.match.test(pathname))
  return found?.title || 'Sacada'
}

export default function Layout() {
  const title = usePageTitle()

  return (
    <div className="flex min-h-svh" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header title={title} />
        <main className="flex-1 p-4 sm:p-8 relative z-10">
          <div className="mx-auto max-w-screen-xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
