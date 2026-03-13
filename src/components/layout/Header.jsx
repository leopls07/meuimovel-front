import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import SidebarNav from './SidebarNav'

export default function Header({ title }) {
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

        <div
          className="hidden sm:block text-xs font-medium tracking-widest uppercase"
          style={{ color: 'var(--color-muted)' }}
        >
          Cadastro &amp; análise
        </div>
      </div>
    </header>
  )
}
