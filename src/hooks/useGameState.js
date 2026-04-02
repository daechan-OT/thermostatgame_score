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
  const choices = shuffle(CARD_DECK.filter(c => c.type === 'choice'))
  const envs = shuffle(CARD_DECK.filter(c => c.type === 'environment'))

  const deck = []
  
  // Interleave choices and envs, starting with Choice
  // For 10 cards, we aim for 5 Choices + 5 Envs
  const poolChoices = choices.slice(0, 5)
  const poolEnvs = envs.slice(0, 5)

  for (let i = 0; i < 5; i++) {
    if (poolChoices[i]) deck.push(poolChoices[i])
    if (poolEnvs[i]) deck.push(poolEnvs[i])
  }

  // Fallback if we have fewer than 10 cards
  if (deck.length < 10) {
    const remaining = CARD_DECK.filter(c => !deck.find(d => d.id === c.id))
    const shuffledRemaining = shuffle(remaining)
    while (deck.length < 10 && shuffledRemaining.length > 0) {
      deck.push(shuffledRemaining.shift())
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
      if (!prev.selectedOption) return prev
      return { ...prev, phase: 'revealed' }
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
  // Called after user taps "Understood" on either card type (post-reveal for choice, post-reading for env)
  const applyEnergy = useCallback((impact) => {
    setState(prev => {
      // Handle the 'balance' impact type: moves energy 1 step towards 0
      let delta = impact
      if (impact === 'balance') {
        delta = prev.energy > 0 ? -1 : prev.energy < 0 ? 1 : 0
      }

      const rawNext = prev.energy + delta
      const newEnergy = Math.max(-5, Math.min(5, rawNext))
      const newRound = prev.round + 1

      // Animate the display gauge
      setDisplayEnergy(newEnergy)

      // Determine next screen after animation
      let nextScreen = 'game'
      if (Math.abs(newEnergy) >= 5) {
        nextScreen = 'lose'
      } else if (newRound >= 10) {
        nextScreen = 'win'
      }

      // Push current card to history
      const historyEntry = {
        ...prev.currentCard,
        roundNumber: prev.round + 1,
        appliedEnergy: newEnergy,
        energyDelta: delta,
        chosenOptionId: prev.selectedOption,
      }

      if (nextScreen !== 'game') {
        // Game over — update state after animation delay
        if (animationTimer.current) clearTimeout(animationTimer.current)
        animationTimer.current = setTimeout(() => {
          setState(s => ({
            ...s,
            screen: nextScreen,
            energy: newEnergy,
            round: newRound,
            history: [...s.history, historyEntry],
            phase: 'reading',
          }))
        }, 700)

        return {
          ...prev,
          phase: 'animating',
          energy: newEnergy,
          round: newRound,
          history: [...prev.history, historyEntry],
        }
      }

      // Continue — next card after animation
      const nextCard = prev.deck[newRound] || null
      if (animationTimer.current) clearTimeout(animationTimer.current)
      animationTimer.current = setTimeout(() => {
        setState(s => ({
          ...s,
          currentCard: nextCard,
          phase: 'reading',
          selectedOption: null,
        }))
      }, 700)

      return {
        ...prev,
        phase: 'animating',
        energy: newEnergy,
        round: newRound,
        history: [...prev.history, historyEntry],
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
