import { useState } from 'react'

const SLICES = [
  { label: 'Vibes', pct: 42, color: '#39ff14', emoji: '🫠' },
  { label: 'More Vibes', pct: 25, color: '#bf00ff', emoji: '✨' },
  { label: 'Dev\'s Lambo', pct: 15, color: '#00f0ff', emoji: '🏎️' },
  { label: 'Rug Pull Fund', pct: 10, color: '#ff006e', emoji: '🧶' },
  { label: 'Copium Reserve', pct: 5, color: '#ffe600', emoji: '🤡' },
  { label: 'Actual Utility', pct: 3, color: '#666', emoji: '💀' },
]

export default function Tokenomics() {
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null)

  // Build SVG pie chart
  let cumulativePercent = 0
  const paths = SLICES.map((slice, i) => {
    const startAngle = cumulativePercent * 3.6 * (Math.PI / 180)
    cumulativePercent += slice.pct
    const endAngle = cumulativePercent * 3.6 * (Math.PI / 180)

    const x1 = 50 + 40 * Math.cos(startAngle - Math.PI / 2)
    const y1 = 50 + 40 * Math.sin(startAngle - Math.PI / 2)
    const x2 = 50 + 40 * Math.cos(endAngle - Math.PI / 2)
    const y2 = 50 + 40 * Math.sin(endAngle - Math.PI / 2)

    const largeArc = slice.pct > 50 ? 1 : 0

    const isHovered = hoveredSlice === i
    const scale = isHovered ? 'scale(1.05)' : 'scale(1)'

    return (
      <path
        key={i}
        d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
        fill={slice.color}
        opacity={hoveredSlice !== null && !isHovered ? 0.4 : 0.8}
        stroke="var(--color-dark-bg)"
        strokeWidth="0.5"
        style={{ transform: scale, transformOrigin: '50px 50px', transition: 'all 0.3s ease' }}
        onMouseEnter={() => setHoveredSlice(i)}
        onMouseLeave={() => setHoveredSlice(null)}
        className="cursor-pointer"
      />
    )
  })

  return (
    <section id="tokenomics" className="py-20 px-4 bg-grid">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="gradient-text">Tokenomics</span>
          </h2>
          <p className="text-gray-500 text-lg">Meticulously designed by clicking "Generate" in ChatGPT</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Pie Chart */}
          <div className="flex justify-center">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                {paths}
                <circle cx="50" cy="50" r="20" fill="var(--color-dark-bg)" />
                <text x="50" y="47" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold" fontFamily="Space Mono, monospace">
                  $VIBE
                </text>
                <text x="50" y="56" textAnchor="middle" fill="#888" fontSize="3.5" fontFamily="Space Mono, monospace">
                  {hoveredSlice !== null ? `${SLICES[hoveredSlice].pct}%` : '100%'}
                </text>
              </svg>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3">
            {SLICES.map((slice, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredSlice(i)}
                onMouseLeave={() => setHoveredSlice(null)}
                className={`flex items-center gap-4 p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                  hoveredSlice === i
                    ? 'bg-dark-card border-gray-600 scale-[1.02]'
                    : 'border-transparent hover:bg-dark-card/50'
                }`}
              >
                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: slice.color, boxShadow: `0 0 10px ${slice.color}40` }} />
                <span className="text-lg">{slice.emoji}</span>
                <div className="flex-1">
                  <span className="text-white font-medium">{slice.label}</span>
                </div>
                <span className="font-mono text-sm" style={{ color: slice.color }}>{slice.pct}%</span>
              </div>
            ))}

            <div className="mt-8 p-4 rounded-xl bg-dark-card border border-dark-border">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xs text-gray-500">Total Supply</div>
                  <div className="font-mono font-bold text-neon-green">420.69T</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Tax</div>
                  <div className="font-mono font-bold text-neon-purple">6.9%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">LP</div>
                  <div className="font-mono font-bold text-neon-blue">Burned 🔥</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Audit</div>
                  <div className="font-mono font-bold text-neon-pink">Trust me bro</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
