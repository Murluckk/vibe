import { useEffect, useRef, useState } from 'react'

const CA = 'A4J6LAiSbvUz2c66urmCQEfrbPBQu6ebSwaZgcfqpump'

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [copied, setCopied] = useState(false)

  const copyCA = () => {
    navigator.clipboard.writeText(CA)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles: { x: number; y: number; vx: number; vy: number; size: number; color: string; alpha: number }[] = []
    const colors = ['#39ff14', '#bf00ff', '#00f0ff']

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.1,
      })
    }

    let animId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - p.x
          const dy = particles[j].y - p.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 150) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = p.color
            ctx.globalAlpha = (1 - dist / 150) * 0.1
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      })
      ctx.globalAlpha = 1
      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="absolute inset-0 bg-radial-glow z-1" />

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="animate-float mb-8">
          <span className="text-8xl sm:text-9xl block" role="img" aria-label="melting face">🫠</span>
        </div>

        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
          <span className="gradient-text">$VIBE</span>
        </h1>

        <p className="text-xl sm:text-2xl text-gray-400 mb-2 font-light">
          The First Meme Coin That Was Entirely
        </p>
        <p className="text-2xl sm:text-4xl font-bold mb-8">
          <span className="text-neon-green text-glow-green">Vibe Coded</span>
        </p>

        <p className="text-gray-500 text-lg mb-8 max-w-2xl mx-auto">
          No utility. No whitepaper. No dev team. Just pure, unfiltered vibes.
          <br />
          <span className="text-neon-purple">This is financial advice.*</span>
        </p>

        <div className="mb-10 flex justify-center">
          <button
            onClick={copyCA}
            className="group flex items-center gap-3 px-5 py-3 rounded-xl bg-dark-card border border-dark-border hover:border-neon-green/50 transition-all duration-300 cursor-pointer"
          >
            <span className="text-xs text-gray-500 uppercase tracking-wider">CA</span>
            <span className="font-mono text-sm sm:text-base text-gray-300 group-hover:text-neon-green transition-colors">
              {CA.slice(0, 6)}...{CA.slice(-4)}
            </span>
            <span className={`text-xs font-semibold transition-all duration-200 ${copied ? 'text-neon-green' : 'text-gray-500 group-hover:text-gray-300'}`}>
              {copied ? '✓ Copied!' : 'Copy'}
            </span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <a
            href={`https://pump.fun/coin/${CA}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-8 py-4 rounded-xl bg-neon-green/10 border-2 border-neon-green text-neon-green font-bold text-lg hover:bg-neon-green/20 transition-all duration-300 box-glow-green"
          >
            <span className="relative z-10">Buy on Pump.fun</span>
          </a>
          <a
            href="#mine"
            className="px-8 py-4 rounded-xl border border-dark-border text-gray-400 font-medium text-lg hover:border-neon-purple hover:text-neon-purple transition-all duration-300"
          >
            Start Mining $VIBE
          </a>
        </div>

        <div className="flex justify-center gap-8 sm:gap-16 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-neon-green text-glow-green">$0.00</div>
            <div className="text-xs text-gray-500 mt-1">Price (real)</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-neon-purple text-glow-purple">$69B</div>
            <div className="text-xs text-gray-500 mt-1">Market Cap (vibes)</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-neon-blue text-glow-blue">42069%</div>
            <div className="text-xs text-gray-500 mt-1">APY (trust me)</div>
          </div>
        </div>

        <p className="text-gray-600 text-xs mt-16">
          *This is not financial advice. This is a meme. DYOR. NFA. WAGMI. NGMI. LFG. GG. 🫠
        </p>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
