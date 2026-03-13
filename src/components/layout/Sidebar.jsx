import SidebarNav from './SidebarNav'

export default function Sidebar() {
  return (
    <aside
      className="hidden w-64 shrink-0 overflow-hidden md:block"
      style={{ backgroundColor: 'var(--color-sidebar)', borderRight: '1px solid rgba(245,239,230,0.08)' }}
    >
      <SidebarNav />
    </aside>
  )
}
