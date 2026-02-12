import { useState, useEffect, useCallback, useRef } from 'react'

interface GameState {
  vibes: number
  totalVibesMined: number
  vibesPerClick: number
  vibesPerSecond: number
  stakedVibes: number
  stakedReturns: number
  stakingAPY: number
  rugPullRisk: number
  level: number
  prestige: number
  clickCount: number
  upgrades: Upgrade[]
  isRugPulled: boolean
  rugPullCountdown: number | null
  multiplier: number
  combo: number
  lastClickTime: number
}

export interface Upgrade {
  id: string
  name: string
  description: string
  cost: number
  baseCost: number
  level: number
  maxLevel: number
  type: 'click' | 'passive' | 'multiplier' | 'staking'
  value: number
  emoji: string
}

const INITIAL_UPGRADES: Upgrade[] = [
  { id: 'cursor', name: 'Auto-Cursor', description: 'AI writes code for you', cost: 15, baseCost: 15, level: 0, maxLevel: 50, type: 'passive', value: 0.1, emoji: '🖱️' },
  { id: 'copilot', name: 'Vibe Copilot', description: 'GitHub Copilot but vibes', cost: 100, baseCost: 100, level: 0, maxLevel: 50, type: 'passive', value: 1, emoji: '🤖' },
  { id: 'claude', name: 'Claude Instance', description: 'Claude vibe codes for you', cost: 500, baseCost: 500, level: 0, maxLevel: 50, type: 'passive', value: 5, emoji: '🧠' },
  { id: 'clickpower', name: 'Mechanical Keyboard', description: 'More vibes per keystroke', cost: 50, baseCost: 50, level: 0, maxLevel: 30, type: 'click', value: 1, emoji: '⌨️' },
  { id: 'energy', name: 'Energy Drink', description: '2x vibe output', cost: 1000, baseCost: 1000, level: 0, maxLevel: 10, type: 'multiplier', value: 0.5, emoji: '⚡' },
  { id: 'server', name: 'Server Farm', description: 'Industrial vibe mining', cost: 5000, baseCost: 5000, level: 0, maxLevel: 50, type: 'passive', value: 25, emoji: '🏭' },
  { id: 'quantum', name: 'Quantum Compiler', description: 'Vibes in superposition', cost: 25000, baseCost: 25000, level: 0, maxLevel: 30, type: 'passive', value: 100, emoji: '⚛️' },
  { id: 'stakeboost', name: 'Staking Boost', description: 'More APY for your vibes', cost: 2000, baseCost: 2000, level: 0, maxLevel: 20, type: 'staking', value: 5000, emoji: '📈' },
]

const SAVE_KEY = 'vibe-game-state'

function loadState(): GameState | null {
  try {
    const saved = localStorage.getItem(SAVE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      return { ...parsed, isRugPulled: false, rugPullCountdown: null }
    }
  } catch { /* ignore */ }
  return null
}

function saveState(state: GameState) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state))
  } catch { /* ignore */ }
}

const defaultState: GameState = {
  vibes: 0,
  totalVibesMined: 0,
  vibesPerClick: 1,
  vibesPerSecond: 0,
  stakedVibes: 0,
  stakedReturns: 0,
  stakingAPY: 42069,
  rugPullRisk: 0,
  level: 1,
  prestige: 0,
  clickCount: 0,
  upgrades: INITIAL_UPGRADES,
  isRugPulled: false,
  rugPullCountdown: null,
  multiplier: 1,
  combo: 0,
  lastClickTime: 0,
}

export function useVibeGame() {
  const [state, setState] = useState<GameState>(() => loadState() || defaultState)
  const stateRef = useRef(state)
  stateRef.current = state

  // Save every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => saveState(stateRef.current), 5000)
    return () => clearInterval(interval)
  }, [])

  // Passive income + staking returns tick
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        const passiveIncome = prev.vibesPerSecond * prev.multiplier / 10
        const stakingReturn = prev.stakedVibes > 0
          ? (prev.stakedVibes * prev.stakingAPY / 100) / (365 * 24 * 3600 * 10)
          : 0

        const newRisk = prev.stakedVibes > 0
          ? Math.min(99.9, prev.rugPullRisk + 0.01)
          : Math.max(0, prev.rugPullRisk - 0.1)

        return {
          ...prev,
          vibes: prev.vibes + passiveIncome,
          totalVibesMined: prev.totalVibesMined + passiveIncome,
          stakedReturns: prev.stakedReturns + stakingReturn,
          rugPullRisk: newRisk,
        }
      })
    }, 100)
    return () => clearInterval(interval)
  }, [])

  // Combo decay
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => {
        if (Date.now() - prev.lastClickTime > 2000 && prev.combo > 0) {
          return { ...prev, combo: Math.max(0, prev.combo - 1) }
        }
        return prev
      })
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const mine = useCallback(() => {
    setState(prev => {
      const comboBonus = 1 + (prev.combo * 0.1)
      const earned = prev.vibesPerClick * prev.multiplier * comboBonus
      const newCombo = Math.min(50, prev.combo + 1)
      const newTotal = prev.totalVibesMined + earned
      const newLevel = Math.floor(Math.log2(newTotal + 1)) + 1

      return {
        ...prev,
        vibes: prev.vibes + earned,
        totalVibesMined: newTotal,
        clickCount: prev.clickCount + 1,
        combo: newCombo,
        lastClickTime: Date.now(),
        level: Math.max(prev.level, newLevel),
      }
    })
  }, [])

  const buyUpgrade = useCallback((upgradeId: string) => {
    setState(prev => {
      const idx = prev.upgrades.findIndex(u => u.id === upgradeId)
      if (idx === -1) return prev
      const upgrade = prev.upgrades[idx]
      if (prev.vibes < upgrade.cost || upgrade.level >= upgrade.maxLevel) return prev

      const newUpgrades = [...prev.upgrades]
      const newLevel = upgrade.level + 1
      newUpgrades[idx] = {
        ...upgrade,
        level: newLevel,
        cost: Math.floor(upgrade.baseCost * Math.pow(1.15, newLevel)),
      }

      let newVibesPerClick = prev.vibesPerClick
      let newVibesPerSecond = prev.vibesPerSecond
      let newMultiplier = prev.multiplier
      let newAPY = prev.stakingAPY

      if (upgrade.type === 'click') newVibesPerClick += upgrade.value
      if (upgrade.type === 'passive') newVibesPerSecond += upgrade.value
      if (upgrade.type === 'multiplier') newMultiplier += upgrade.value
      if (upgrade.type === 'staking') newAPY += upgrade.value

      return {
        ...prev,
        vibes: prev.vibes - upgrade.cost,
        upgrades: newUpgrades,
        vibesPerClick: newVibesPerClick,
        vibesPerSecond: newVibesPerSecond,
        multiplier: newMultiplier,
        stakingAPY: newAPY,
      }
    })
  }, [])

  const stake = useCallback((amount: number) => {
    setState(prev => {
      const toStake = Math.min(amount, prev.vibes)
      if (toStake <= 0) return prev
      return {
        ...prev,
        vibes: prev.vibes - toStake,
        stakedVibes: prev.stakedVibes + toStake,
      }
    })
  }, [])

  const unstake = useCallback(() => {
    setState(prev => {
      const total = prev.stakedVibes + prev.stakedReturns
      return {
        ...prev,
        vibes: prev.vibes + total,
        stakedVibes: 0,
        stakedReturns: 0,
        rugPullRisk: 0,
      }
    })
  }, [])

  const rugPullRoulette = useCallback(() => {
    setState(prev => {
      const roll = Math.random()
      const riskThreshold = prev.rugPullRisk / 100

      if (roll < riskThreshold * 0.7) {
        // Rug pulled! Lose 90% of staked
        return {
          ...prev,
          isRugPulled: true,
          stakedVibes: prev.stakedVibes * 0.1,
          stakedReturns: 0,
          rugPullRisk: 0,
          rugPullCountdown: 3,
        }
      } else {
        // Lucky! 2-10x staked returns
        const multi = 2 + Math.random() * 8
        return {
          ...prev,
          stakedReturns: prev.stakedReturns * multi,
          rugPullRisk: Math.min(99.9, prev.rugPullRisk + 10),
        }
      }
    })
  }, [])

  const dismissRugPull = useCallback(() => {
    setState(prev => ({ ...prev, isRugPulled: false, rugPullCountdown: null }))
  }, [])

  const prestigeReset = useCallback(() => {
    setState(prev => {
      if (prev.totalVibesMined < 1000000) return prev
      const prestigeBonus = Math.floor(Math.log10(prev.totalVibesMined))
      return {
        ...defaultState,
        prestige: prev.prestige + 1,
        multiplier: 1 + prestigeBonus * 0.5,
        level: 1,
      }
    })
  }, [])

  const getShareText = useCallback(() => {
    const { totalVibesMined, level, prestige, clickCount } = stateRef.current
    const formatted = totalVibesMined >= 1e9
      ? (totalVibesMined / 1e9).toFixed(1) + 'B'
      : totalVibesMined >= 1e6
        ? (totalVibesMined / 1e6).toFixed(1) + 'M'
        : totalVibesMined >= 1e3
          ? (totalVibesMined / 1e3).toFixed(1) + 'K'
          : Math.floor(totalVibesMined).toString()

    return `I've mined ${formatted} $VIBE with ${clickCount} clicks!\n\nLevel ${level} ${prestige > 0 ? `| Prestige ${prestige} ` : ''}| Pure vibes only\n\nAre you even vibing? 🫠\n\n$VIBE`
  }, [])

  return {
    state,
    mine,
    buyUpgrade,
    stake,
    unstake,
    rugPullRoulette,
    dismissRugPull,
    prestigeReset,
    getShareText,
  }
}
