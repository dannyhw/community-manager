import { Link } from '@tanstack/react-router'
import { MotifAtom } from '../system/MotifAtom'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--rnp-line)] bg-[var(--rnp-bg-elevated)]/85 px-4 backdrop-blur-lg">
      <nav className="page-wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4">
        <h2 className="m-0 flex-shrink-0 text-base font-semibold tracking-tight">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--rnp-chip-line)] bg-[var(--rnp-chip-bg)] px-3 py-1.5 text-sm text-[var(--rnp-fg)] no-underline sm:px-4 sm:py-2"
          >
            <MotifAtom color="var(--rnp-accent)" size={18} strokeWidth={1.5} />
            <span className="font-mono uppercase tracking-[0.16em] text-xs sm:text-sm">
              RN Porto · graphics
            </span>
          </Link>
        </h2>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-semibold sm:flex-nowrap">
          <Link
            to="/"
            className="nav-link"
            activeProps={{ className: 'nav-link is-active' }}
          >
            Studio
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
