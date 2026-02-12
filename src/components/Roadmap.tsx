const PHASES = [
  {
    phase: 'Phase 1',
    title: 'The Vibes Begin',
    emoji: '🫠',
    status: 'completed' as const,
    items: [
      'Vibe code the website',
      'Deploy token (trust the vibes)',
      'Shill on CT until banned',
      'Get listed on CoinGecko (bribe someone)',
    ],
  },
  {
    phase: 'Phase 2',
    title: 'Vibe Escalation',
    emoji: '🚀',
    status: 'active' as const,
    items: [
      'Partnerships with other vibe coders',
      'NFT collection (AI generated, obviously)',
      'CEX listings (we DM\'d Binance)',
      'The Vibe Machine goes live',
    ],
  },
  {
    phase: 'Phase 3',
    title: 'Peak Vibes',
    emoji: '👑',
    status: 'upcoming' as const,
    items: [
      'Vibe DAO (everyone votes, nothing happens)',
      'Metaverse integration (just a Discord server)',
      'Staking v2 with 420,069% APY',
      'Billboard in Times Square (maybe)',
    ],
  },
  {
    phase: 'Phase 4',
    title: 'Endgame',
    emoji: '🧶',
    status: 'upcoming' as const,
    items: [
      '???',
      'Definitely not a rug pull',
      'World domination through vibes',
      'Dev goes on permanent vacation',
    ],
  },
]

export default function Roadmap() {
  return (
    <section id="roadmap" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="gradient-text">Roadmap</span>
          </h2>
          <p className="text-gray-500 text-lg">Subject to change based on vibes</p>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-neon-green via-neon-purple to-dark-border" />

          <div className="space-y-12">
            {PHASES.map((phase, i) => (
              <div key={i} className="relative pl-16 sm:pl-20">
                {/* Dot on timeline */}
                <div className={`absolute left-4 sm:left-6 w-4 h-4 rounded-full border-2 ${
                  phase.status === 'completed'
                    ? 'bg-neon-green border-neon-green box-glow-green'
                    : phase.status === 'active'
                      ? 'bg-neon-purple border-neon-purple box-glow-purple animate-pulse-glow'
                      : 'bg-dark-card border-dark-border'
                }`} style={{ top: '1.5rem' }} />

                <div className={`p-6 rounded-2xl border transition-all duration-300 ${
                  phase.status === 'active'
                    ? 'bg-dark-card border-neon-purple/30 box-glow-purple'
                    : phase.status === 'completed'
                      ? 'bg-dark-card/80 border-neon-green/20'
                      : 'bg-dark-card/50 border-dark-border'
                }`}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">{phase.emoji}</span>
                    <div>
                      <div className={`text-xs font-mono ${
                        phase.status === 'completed' ? 'text-neon-green' :
                        phase.status === 'active' ? 'text-neon-purple' : 'text-gray-600'
                      }`}>
                        {phase.phase}
                        {phase.status === 'completed' && ' ✓'}
                        {phase.status === 'active' && ' (current)'}
                      </div>
                      <h3 className="text-xl font-bold text-white">{phase.title}</h3>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {phase.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                        <span className={`mt-1 flex-shrink-0 ${
                          phase.status === 'completed' ? 'text-neon-green' : 'text-gray-600'
                        }`}>
                          {phase.status === 'completed' ? '✓' : '○'}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
