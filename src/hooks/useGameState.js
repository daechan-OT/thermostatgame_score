import { useState, useCallback, useRef } from 'react'
import { CARD_DECK } from '../data/cards'

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function buildDeck() {
  const allChoices = shuffle(CARD_DECK.filter(c => c.type === 'choice'))
  const allEnvs = shuffle(CARD_DECK.filter(c => c.type === 'environment'))

  // First card is always a choice — placed before shuffling the rest
  const deck = [
    allChoices[0],
    ...shuffle([...allChoices.slice(1, 6), ...allEnvs.slice(0, 4)]),
  ]

  // Pass: No consecutive Environment cards (starts at 1 — index 0 is guaranteed choice)
  for (let i = 1; i < deck.length - 1; i++) {
    if (deck[i].type === 'environment' && deck[i + 1]?.type === 'environment') {
      const swapIdx = deck.findIndex((c, idx) => idx > i + 1 && c.type === 'choice')
      if (swapIdx !== -1) {
        ;[deck[i + 1], deck[swapIdx]] = [deck[swapIdx], deck[i + 1]]
      }
    }
  }

  return deck
}

const INITIAL_STATE = {
  screen: 'welcome',
  energy: 0,
  round: 0,
  deck: [],
  history: [],
  currentCard: null,
  phase: 'reading',
  selectedOption: null,
  autoplay: false,
  gaugeView: 'arc',
  historyOpen: false,
  score: 0,
  maxScore: 0,
  cardStartTime: null,
}

function resolveImpact(impact, energy) {
  if (impact === 'balance') return energy > 0 ? -1 : energy < 0 ? 1 : 0
  return impact
}

function calcChoicePoints(card, chosenId, energy, cardStartTime) {
  const chosen = card.options.find(o => o.id === chosenId)
  const other  = card.options.find(o => o.id !== chosenId)
  if (!chosen || !other) return { earned: 0, possible: 3 }

  const chosenResolved = resolveImpact(chosen.energyImpact, energy)
  const otherResolved  = resolveImpact(other.energyImpact,  energy)

  const chosenDist = Math.abs(energy + chosenResolved)
  const otherDist  = Math.abs(energy + otherResolved)

  let base = 0
  if (chosenDist < otherDist)       base = 2
  else if (chosenDist === otherDist) base = 1

  const timingBonus = cardStartTime && (Date.now() - cardStartTime) < 6000 ? 1 : 0

  return { earned: base + timingBonus, possible: 2 }
}

export function useGameState() {
  const [state, setState] = useState(INITIAL_STATE)
  // Track energy animation target separately so gauge can animate
  const [displayEnergy, setDisplayEnergy] = useState(0)
  const animationTimer = useRef(null)

  const update = useCallback((patch) => {
    setState(prev => ({ ...prev, ...patch }))
  }, [])

  // ── startGame ──────────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    const deck = buildDeck()
    setState({
      ...INITIAL_STATE,
      screen: 'game',
      energy: 0,
      round: 0,
      deck,
      history: [],
      currentCard: deck[0],
      phase: 'reading',
      selectedOption: null,
      autoplay: false,
      gaugeView: 'arc',
      historyOpen: false,
      score: 0,
      maxScore: 0,
      cardStartTime: Date.now(),
    })
    setDisplayEnergy(0)
  }, [])

  // ── selectOption ───────────────────────────────────────────────────────────
  const selectOption = useCallback((id) => {
    setState(prev => {
      if (prev.phase !== 'reading') return prev
      return { ...prev, selectedOption: id }
    })
  }, [])

  // ── confirmChoice ──────────────────────────────────────────────────────────
  const confirmChoice = useCallback(() => {
    setState(prev => {
      if (prev.phase !== 'reading' || !prev.selectedOption) return prev
      const { earned, possible } = calcChoicePoints(
        prev.currentCard, prev.selectedOption, prev.energy, prev.cardStartTime
      )
      return {
        ...prev,
        phase: 'revealed',
        score: prev.score + earned,
        maxScore: prev.maxScore + possible,
      }
    })
  }, [])

  // ── acknowledgeEnv ─────────────────────────────────────────────────────────
  const acknowledgeEnv = useCallback(() => {
    setState(prev => {
      if (prev.phase !== 'reading') return prev
      return { ...prev, phase: 'animating' }
    })
  }, [])

  // ── applyEnergy ────────────────────────────────────────────────────────────
  // Called after user taps "Understood".
  // IMPORTANT: history is NOT updated synchronously here.
  // It is pushed atomically inside the timeout — at the exact same moment
  // currentCard changes — so the card never appears in both places at once.
  const applyEnergy = useCallback((impact) => {
    setState(prev => {
      if (prev.phase === 'animating') return prev   // already processing — ignore extra taps
      let delta = impact
      if (impact === 'balance') {
        delta = prev.energy > 0 ? -1 : prev.energy < 0 ? 1 : 0
      }

      const rawNext = prev.energy + delta
      const newEnergy = Math.max(-5, Math.min(5, rawNext))
      const newRound = prev.round + 1

      setDisplayEnergy(newEnergy)

      let nextScreen = 'game'
      if (Math.abs(newEnergy) >= 5) nextScreen = 'lose'
      else if (newRound >= 10) nextScreen = 'win'

      const historyEntry = {
        ...prev.currentCard,
        roundNumber: prev.round + 1,
        appliedEnergy: newEnergy,
        energyDelta: delta,
        chosenOptionId: prev.selectedOption,
      }

      const nextCard = prev.deck[newRound] || null

      if (animationTimer.current) clearTimeout(animationTimer.current)
      animationTimer.current = setTimeout(() => {
        // Single atomic update: advance card AND push history at the same time.
        // This triggers the AnimatePresence key change (card exit) and history
        // stack gain in the same render — the card visually "becomes" the top
        // of the history stack rather than disappearing separately.
        setState(s => ({
          ...s,
          screen: nextScreen,
          currentCard: nextScreen === 'game' ? nextCard : s.currentCard,
          phase: 'reading',
          selectedOption: null,
          energy: newEnergy,
          round: newRound,
          history: [...s.history, historyEntry],
          cardStartTime: Date.now(),
        }))
      }, 650)

      // Synchronous: only lock the card in animating phase.
      // round and history stay unchanged until the timeout fires.
      return {
        ...prev,
        phase: 'animating',
        energy: newEnergy,
      }
    })
  }, [])

  // ── nextCard ───────────────────────────────────────────────────────────────
  // Not needed separately — applyEnergy handles transition — kept for API completeness
  const nextCard = useCallback(() => {}, [])

  // ── restartGame ────────────────────────────────────────────────────────────
  const restartGame = useCallback(() => {
    if (animationTimer.current) clearTimeout(animationTimer.current)
    setDisplayEnergy(0)
    setState({
      ...INITIAL_STATE,
    })
  }, [])

  // ── toggleAutoplay ─────────────────────────────────────────────────────────
  const toggleAutoplay = useCallback(() => {
    setState(prev => ({ ...prev, autoplay: !prev.autoplay }))
  }, [])

  // ── toggleGaugeView ────────────────────────────────────────────────────────
  const toggleGaugeView = useCallback(() => {
    setState(prev => ({ ...prev, gaugeView: prev.gaugeView === 'arc' ? 'bar' : 'arc' }))
  }, [])

  // ── openHistory / closeHistory ─────────────────────────────────────────────
  const openHistory = useCallback(() => update({ historyOpen: true }), [update])
  const closeHistory = useCallback(() => update({ historyOpen: false }), [update])

  return {
    state,
    displayEnergy,
    startGame,
    selectOption,
    confirmChoice,
    acknowledgeEnv,
    applyEnergy,
    nextCard,
    restartGame,
    toggleAutoplay,
    toggleGaugeView,
    openHistory,
    closeHistory,
  }
}
