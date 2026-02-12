import { useState, useRef, useCallback } from 'react'
import { formatNumber, formatCompact } from '../utils/formatting'
import { useVibeGame, type Upgrade } from '../hooks/useVibeGame'

interface FloatingText {
  id: number
  x: number
  y: number
  text: string
  color: string
}

export default function VibeMachine() {
  const { state, mine, buyUpgrade, stake, unstake, rugPullRoulette, dismissRugPull, prestigeReset, getShareText } = useVibeGame()
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([])
  const [stakeAmount, setStakeAmount] = useState('')
  const [activeTab, setActiveTab] = useState<'mine' | 'upgrades' | 'staking'>('mine')
  const [showRoulette, setShowRoulette] = useState(false)
  const [rouletteResult, setRouletteResult] = useState<'win' | 'lose' | null>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const nextId = useRef(0)

  const handleMine = useCallback((e: React.MouseEvent) => {
    mine()
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const comboBonus = 1 + (state.combo * 0.1)
    const earned = state.vibesPerClick * state.multiplier * comboBonus
    const id = nextId.current++

    setFloatingTexts(prev => [...prev, {
      id, x, y,
      text: `+${formatCompact(earned)}`,
      color: state.combo > 10 ? '#ff006e' : state.combo > 5 ? '#bf00ff' : '#39ff14'
    }])

    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id))
    }, 1000)
  }, [mine, state.combo, state.vibesPerClick, state.multiplier])

  const handleRugPull = () => {
    setShowRoulette(true)
    setRouletteResult(null)
    setTimeout(() => {
      const prevStaked = state.stakedReturns
      rugPullRoulette()
      setTimeout(() => {
        setRouletteResult(state.stakedReturns > prevStaked ? 'win' : 'lose')
      }, 50)
    }, 1500)
  }

  const handleShare = () => {
    const text = encodeURIComponent(getShareText())
    window.open(`https://x.com/intent/tweet?text=${text}`, '_blank')
  }

  const handleStake = () => {
    const amount = stakeAmount === 'max' ? state.vibes : parseFloat(stakeAmount)
    if (amount > 0) {
      stake(amount)
      setStakeAmount('')
    }
  }

  return (
    <section id="mine" className="relative py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="gradient-text">The Vibe Machine</span>
          </h2>
          <p className="text-gray-500 text-lg">Mine. Stake. Rug. Repeat.</p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="$VIBE Balance" value={formatNumber(state.vibes)} color="green" />
          <StatCard label="Per Click" value={formatCompact(state.vibesPerClick * state.multiplier)} color="blue" />
          <StatCard label="Per Second" value={formatCompact(state.vibesPerSecond * state.multiplier)} color="purple" />
          <StatCard label="Level" value={state.level.toString()} color="pink" sub={state.prestige > 0 ? `P${state.prestige}` : undefined} />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 justify-center">
          {(['mine', 'upgrades', 'staking'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                activeTab === tab
                  ? 'bg-neon-green/10 border border-neon-green/50 text-neon-green box-glow-green'
                  : 'bg-dark-card border border-dark-border text-gray-500 hover:text-gray-300 hover:border-gray-600'
              }`}
            >
              {tab === 'mine' ? '🫠 Mine' : tab === 'upgrades' ? '⬆️ Upgrades' : '📈 Staking'}
            </button>
          ))}
        </div>

        {/* Mine Tab */}
        {activeTab === 'mine' && (
          <div className="flex flex-col items-center">
            {/* Combo indicator */}
            {state.combo > 0 && (
              <div className={`mb-4 text-center transition-all duration-200 ${state.combo > 20 ? 'scale-125' : ''}`}>
                <span className={`text-2xl font-bold font-mono ${
                  state.combo > 20 ? 'text-neon-pink gradient-text-fire' :
                  state.combo > 10 ? 'text-neon-purple text-glow-purple' :
                  'text-neon-green text-glow-green'
                }`}>
                  {state.combo}x COMBO
                </span>
                {state.combo > 10 && <span className="ml-2 text-lg">{state.combo > 30 ? '🔥🔥🔥' : state.combo > 20 ? '🔥🔥' : '🔥'}</span>}
              </div>
            )}

            {/* Big mine button */}
            <div className="relative mb-8">
              <button
                ref={buttonRef}
                onClick={handleMine}
                className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-dark-card border-4 border-neon-green text-neon-green text-glow-green box-glow-green hover:scale-105 active:scale-95 transition-all duration-100 select-none cursor-pointer"
                style={{
                  boxShadow: state.combo > 10
                    ? `0 0 ${20 + state.combo * 2}px rgba(57, 255, 20, ${0.3 + state.combo * 0.01}), 0 0 ${40 + state.combo * 3}px rgba(191, 0, 255, 0.2)`
                    : undefined
                }}
              >
                <span className="text-6xl sm:text-7xl block mb-2">🫠</span>
                <span className="text-lg sm:text-xl font-bold font-mono block">VIBE</span>
              </button>

              {/* Floating texts */}
              {floatingTexts.map(ft => (
                <span
                  key={ft.id}
                  className="absolute pointer-events-none font-bold font-mono text-lg"
                  style={{
                    left: ft.x,
                    top: ft.y,
                    color: ft.color,
                    textShadow: `0 0 10px ${ft.color}`,
                    animation: 'float-up 1s ease-out forwards',
                  }}
                >
                  {ft.text}
                </span>
              ))}
            </div>

            <style>{`
              @keyframes float-up {
                0% { transform: translateY(0) scale(1); opacity: 1; }
                100% { transform: translateY(-80px) scale(1.5); opacity: 0; }
              }
            `}</style>

            {/* Stats row */}
            <div className="flex flex-wrap gap-4 justify-center text-center text-sm text-gray-500">
              <div>Total Mined: <span className="text-neon-green font-mono">{formatCompact(state.totalVibesMined)}</span></div>
              <div>Clicks: <span className="text-neon-blue font-mono">{state.clickCount.toLocaleString()}</span></div>
              <div>Multiplier: <span className="text-neon-purple font-mono">{state.multiplier.toFixed(1)}x</span></div>
            </div>

            {/* Share + Prestige */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleShare}
                className="px-6 py-3 rounded-xl bg-[#1DA1F2]/10 border border-[#1DA1F2]/30 text-[#1DA1F2] font-semibold text-sm hover:bg-[#1DA1F2]/20 transition-all"
              >
                Share on X
              </button>
              {state.totalVibesMined >= 1_000_000 && (
                <button
                  onClick={prestigeReset}
                  className="px-6 py-3 rounded-xl bg-neon-purple/10 border border-neon-purple/30 text-neon-purple font-semibold text-sm hover:bg-neon-purple/20 transition-all box-glow-purple"
                >
                  Prestige (P{state.prestige + 1})
                </button>
              )}
            </div>
          </div>
        )}

        {/* Upgrades Tab */}
        {activeTab === 'upgrades' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {state.upgrades.map(upgrade => (
              <UpgradeCard
                key={upgrade.id}
                upgrade={upgrade}
                canAfford={state.vibes >= upgrade.cost}
                onBuy={() => buyUpgrade(upgrade.id)}
              />
            ))}
          </div>
        )}

        {/* Staking Tab */}
        {activeTab === 'staking' && (
          <div className="max-w-lg mx-auto">
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6 mb-6">
              <div className="text-center mb-6">
                <div className="text-sm text-gray-500 mb-1">Staked $VIBE</div>
                <div className="text-3xl font-bold font-mono text-neon-purple text-glow-purple">
                  {formatNumber(state.stakedVibes)}
                </div>
                <div className="text-sm text-gray-500 mt-2">Earned Returns</div>
                <div className="text-2xl font-bold font-mono text-neon-green text-glow-green">
                  +{formatNumber(state.stakedReturns)}
                </div>
              </div>

              <div className="bg-dark-bg/50 rounded-xl p-4 mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">APY</span>
                  <span className="text-neon-green font-mono font-bold">{formatCompact(state.stakingAPY)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Rug Pull Risk</span>
                  <span className={`font-mono font-bold ${
                    state.rugPullRisk > 50 ? 'text-neon-pink' : state.rugPullRisk > 25 ? 'text-neon-yellow' : 'text-neon-green'
                  }`}>
                    {state.rugPullRisk.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-2 w-full bg-dark-border rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${state.rugPullRisk}%`,
                      background: state.rugPullRisk > 50
                        ? 'linear-gradient(90deg, #ff006e, #ff0000)'
                        : state.rugPullRisk > 25
                          ? 'linear-gradient(90deg, #ffe600, #ff006e)'
                          : 'linear-gradient(90deg, #39ff14, #ffe600)',
                    }}
                  />
                </div>
              </div>

              {/* Stake input */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={stakeAmount}
                  onChange={e => setStakeAmount(e.target.value)}
                  placeholder="Amount to stake..."
                  className="flex-1 bg-dark-bg border border-dark-border rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-neon-purple transition-colors"
                />
                <button
                  onClick={() => setStakeAmount('max')}
                  className="px-3 py-3 rounded-xl border border-dark-border text-gray-500 text-xs hover:border-neon-green hover:text-neon-green transition-all"
                >
                  MAX
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleStake}
                  className="flex-1 px-4 py-3 rounded-xl bg-neon-purple/10 border border-neon-purple/30 text-neon-purple font-semibold hover:bg-neon-purple/20 transition-all"
                >
                  Stake
                </button>
                <button
                  onClick={unstake}
                  disabled={state.stakedVibes <= 0}
                  className="flex-1 px-4 py-3 rounded-xl bg-dark-bg border border-dark-border text-gray-400 font-semibold hover:border-gray-500 transition-all disabled:opacity-30"
                >
                  Unstake All
                </button>
              </div>
            </div>

            {/* Rug Pull Roulette */}
            {state.stakedVibes > 0 && (
              <button
                onClick={handleRugPull}
                className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-neon-pink/10 via-neon-purple/10 to-neon-blue/10 border-2 border-neon-pink/30 text-neon-pink font-bold text-lg hover:border-neon-pink/60 transition-all duration-300 animate-pulse-glow"
              >
                🎰 RUG PULL ROULETTE 🎰
                <span className="block text-xs text-gray-500 font-normal mt-1">
                  Win big or get rugged. No in between.
                </span>
              </button>
            )}
          </div>
        )}

        {/* Rug Pull Overlay */}
        {state.isRugPulled && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={dismissRugPull}>
            <div className="text-center p-8 animate-shake">
              <div className="text-8xl mb-4">🧶</div>
              <h3 className="text-4xl font-bold text-neon-pink mb-4">RUG PULLED!</h3>
              <p className="text-gray-400 text-lg mb-2">The dev did a little trolling</p>
              <p className="text-gray-500 mb-8">You lost 90% of your staked vibes lmao</p>
              <p className="text-neon-green font-mono text-sm">click anywhere to cope</p>
            </div>
          </div>
        )}

        {/* Roulette Animation Overlay */}
        {showRoulette && !state.isRugPulled && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
            <div className="text-center">
              {rouletteResult === null ? (
                <div className="animate-spin-slow">
                  <span className="text-8xl">🎰</span>
                  <p className="text-gray-400 mt-4">Spinning the wheel of degeneracy...</p>
                </div>
              ) : (
                <div className="animate-bounce" onClick={() => setShowRoulette(false)}>
                  <div className="text-8xl mb-4">{rouletteResult === 'win' ? '🤑' : '💀'}</div>
                  <h3 className={`text-4xl font-bold mb-4 ${rouletteResult === 'win' ? 'text-neon-green text-glow-green' : 'text-neon-pink'}`}>
                    {rouletteResult === 'win' ? 'MASSIVE W!' : 'Down Bad...'}
                  </h3>
                  <p className="text-gray-400">{rouletteResult === 'win' ? 'Your returns just multiplied. WAGMI!' : 'It could have been worse... right?'}</p>
                  <p className="text-neon-green font-mono text-sm mt-4">click to continue</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function StatCard({ label, value, color, sub }: { label: string; value: string; color: string; sub?: string }) {
  const colorMap: Record<string, string> = {
    green: 'text-neon-green text-glow-green',
    blue: 'text-neon-blue text-glow-blue',
    purple: 'text-neon-purple text-glow-purple',
    pink: 'text-neon-pink',
  }
  return (
    <div className="bg-dark-card border border-dark-border rounded-xl p-4 text-center">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className={`text-xl sm:text-2xl font-bold font-mono ${colorMap[color]}`}>
        {value}
        {sub && <span className="text-xs text-neon-purple ml-1">{sub}</span>}
      </div>
    </div>
  )
}

function UpgradeCard({ upgrade, canAfford, onBuy }: { upgrade: Upgrade; canAfford: boolean; onBuy: () => void }) {
  const maxed = upgrade.level >= upgrade.maxLevel
  return (
    <button
      onClick={onBuy}
      disabled={!canAfford || maxed}
      className={`text-left p-4 rounded-xl border transition-all duration-200 ${
        maxed
          ? 'bg-dark-card/50 border-neon-green/20 opacity-60'
          : canAfford
            ? 'bg-dark-card border-dark-border hover:border-neon-green/50 hover:box-glow-green cursor-pointer'
            : 'bg-dark-card border-dark-border opacity-50 cursor-not-allowed'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{upgrade.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white text-sm">{upgrade.name}</span>
            <span className="text-xs font-mono text-gray-500">Lv.{upgrade.level}/{upgrade.maxLevel}</span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">{upgrade.description}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className={`text-xs font-mono ${canAfford ? 'text-neon-green' : 'text-gray-600'}`}>
              {maxed ? 'MAXED' : `${formatCompact(upgrade.cost)} $VIBE`}
            </span>
            <span className="text-xs text-gray-600">
              {upgrade.type === 'click' && `+${upgrade.value}/click`}
              {upgrade.type === 'passive' && `+${upgrade.value}/s`}
              {upgrade.type === 'multiplier' && `+${upgrade.value}x`}
              {upgrade.type === 'staking' && `+${formatCompact(upgrade.value)}% APY`}
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}
