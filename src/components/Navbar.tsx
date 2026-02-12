import { useState, useEffect } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'Mine', href: '#mine' },
    { label: 'Tokenomics', href: '#tokenomics' },
    { label: 'Roadmap', href: '#roadmap' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-dark-bg/90 backdrop-blur-xl border-b border-dark-border' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-2 group">
            <span className="text-2xl">🫠</span>
            <span className="text-xl font-bold font-mono text-neon-green text-glow-green group-hover:text-neon-blue transition-colors">
              $VIBE
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {links.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-400 hover:text-neon-green transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#mine"
              className="px-4 py-2 rounded-lg bg-neon-green/10 border border-neon-green/30 text-neon-green text-sm font-semibold hover:bg-neon-green/20 hover:border-neon-green/50 transition-all duration-200 box-glow-green"
            >
              Start Vibing
            </a>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-dark-border mt-2 pt-4">
            {links.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm text-gray-400 hover:text-neon-green transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
