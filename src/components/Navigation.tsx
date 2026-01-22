'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Dashboard', icon: 'home' },
  { href: '/games', label: 'Spiele', icon: 'games' },
  { href: '/leaderboard', label: 'Rangliste', icon: 'trophy' },
  { href: '/stats', label: 'Statistiken', icon: 'stats' },
  { href: '/new-game', label: 'Neu', icon: 'plus', highlight: true },
]

function NavIcon({ icon, className }: { icon: string; className?: string }) {
  const icons: Record<string, JSX.Element> = {
    home: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    games: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 3h-8l-2 4h12z" />
      </svg>
    ),
    trophy: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 22V8a4 4 0 0 0-4-4H6a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4h-4a4 4 0 0 0-4 4v14" />
        <path d="M12 8v14" />
      </svg>
    ),
    stats: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    plus: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
  }
  return icons[icon] || null
}

export default function Navigation() {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop Navigation - Top Bar */}
      <nav className="nav-bar sticky top-0 z-50 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative">
                <span className="nav-logo text-xl tracking-tight">
                  7<span className="font-normal">WONDERS</span> DUEL
                </span>
                <div className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-50" />
              </div>
            </Link>

            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 rounded-md transition-all duration-200 text-sm font-medium ${
                      item.highlight
                        ? 'bg-gradient-to-r from-[var(--teal)] to-[var(--teal-dark)] text-white shadow-md hover:shadow-lg hover:from-[var(--teal-light)] hover:to-[var(--teal)]'
                        : isActive
                          ? 'nav-item-active'
                          : 'nav-item'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Top Header */}
      <header className="nav-bar sticky top-0 z-50 md:hidden">
        <div className="flex items-center justify-center h-12">
          <Link href="/" className="flex items-center">
            <span className="nav-logo text-lg tracking-tight">
              7<span className="font-normal">WONDERS</span> DUEL
            </span>
          </Link>
        </div>
      </header>

      {/* Mobile Navigation - Bottom Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#1a1510] border-t border-[rgba(184,115,51,0.3)]">
        <div className="flex items-center justify-around h-16 px-2 pb-safe">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center min-w-[56px] py-2 px-1 rounded-lg transition-all ${
                  item.highlight
                    ? 'bg-gradient-to-r from-[var(--teal)] to-[var(--teal-dark)] text-white -mt-4 shadow-lg'
                    : isActive
                      ? 'text-[var(--gold)]'
                      : 'text-[var(--foreground-muted)]'
                }`}
              >
                <NavIcon icon={item.icon} className={`w-6 h-6 ${item.highlight ? 'w-7 h-7' : ''}`} />
                <span className={`text-[10px] mt-1 font-medium ${item.highlight ? 'text-white' : ''}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
