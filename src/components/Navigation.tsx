'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/games', label: 'Spiele' },
  { href: '/leaderboard', label: 'Rangliste' },
  { href: '/stats', label: 'Statistiken' },
  { href: '/new-game', label: '+ Neu', highlight: true },
]

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="nav-bar sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo - 7 Wonders Duel Style */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <span className="nav-logo text-xl tracking-tight">
                7<span className="font-normal">WONDERS</span> DUEL
              </span>
              <div className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-50" />
            </div>
          </Link>

          {/* Navigation Items */}
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
  )
}
