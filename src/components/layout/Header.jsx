import { LogOut, Menu, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import SidebarNav from './SidebarNav'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Header({ title }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header
      className="sticky top-0 z-20"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-8">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                style={{
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'transparent',
                  color: 'var(--color-text)',
                  borderRadius: '10px',
                }}
                aria-label="Abrir menu"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0" style={{ backgroundColor: 'var(--color-sidebar)' }}>
              <SidebarNav variant="mobile" />
            </SheetContent>
          </Sheet>

          <h1
            className="font-display font-semibold"
            style={{ fontSize: '1.5rem', color: 'var(--color-text)', letterSpacing: '-0.01em' }}
          >
            {title}
          </h1>
        </div>

        {/* Área do usuário */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden sm:flex items-center gap-2">
              {user.pictureUrl ? (
                <img
                  src={user.pictureUrl}
                  alt={user.name}
                  className="h-8 w-8 rounded-full object-cover"
                  style={{ border: '2px solid var(--color-border)' }}
                />
              ) : (
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: 'var(--color-accent)',
                    color: '#fff',
                  }}
                >
                  <User className="h-4 w-4" />
                </div>
              )}
              <span
                className="text-sm font-medium max-w-[120px] truncate"
                style={{ color: 'var(--color-text)' }}
              >
                {user.name}
              </span>
            </div>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={handleLogout}
            title="Sair"
            style={{
              border: '1px solid var(--color-border)',
              backgroundColor: 'transparent',
              color: 'var(--color-muted)',
              borderRadius: '10px',
            }}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
