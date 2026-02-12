export default function Footer() {
  return (
    <footer className="py-16 px-4 border-t border-dark-border">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <span className="text-5xl mb-4 block">🫠</span>
          <h3 className="text-2xl font-bold gradient-text mb-2">$VIBE</h3>
          <p className="text-gray-500">Vibe coded with zero planning and maximum vibes</p>
        </div>

        {/* Social links */}
        <div className="flex justify-center gap-6 mb-12">
          <SocialLink icon="X" label="Twitter" />
          <SocialLink icon="TG" label="Telegram" />
          <SocialLink icon="DS" label="Discord" />
          <SocialLink icon="GH" label="GitHub" />
        </div>

        {/* Scrolling ticker */}
        <div className="overflow-hidden mb-8 py-3 border-y border-dark-border">
          <div className="flex gap-8 animate-marquee whitespace-nowrap">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className="flex gap-8 text-sm font-mono text-gray-600">
                <span>WAGMI</span>
                <span className="text-neon-green">$VIBE</span>
                <span>TO THE MOON</span>
                <span className="text-neon-purple">NFA</span>
                <span>DYOR</span>
                <span className="text-neon-blue">LFG</span>
                <span>NO UTILITY</span>
                <span className="text-neon-pink">JUST VIBES</span>
                <span>SER</span>
                <span className="text-neon-yellow">GM</span>
                <span>PROBABLY NOTHING</span>
                <span className="text-neon-green">VIBE CODED</span>
              </span>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.33%); }
          }
          .animate-marquee {
            animation: marquee 20s linear infinite;
          }
        `}</style>

        <div className="space-y-2 text-sm text-gray-600">
          <p>
            This is a meme. Not financial advice. Not a security. Not even a real token (yet?).
          </p>
          <p>
            Built by vibes, for vibes, with vibes. No devs were harmed in the making of this website.
          </p>
          <p className="text-gray-700 mt-4">
            &copy; 2025 $VIBE | All vibes reserved | Powered by hopium and energy drinks
          </p>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({ icon, label }: { icon: string; label: string }) {
  return (
    <button
      className="w-12 h-12 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center text-gray-500 hover:text-neon-green hover:border-neon-green/30 hover:box-glow-green transition-all duration-300 cursor-pointer"
      title={label}
    >
      <span className="text-sm font-bold font-mono">{icon}</span>
    </button>
  )
}
