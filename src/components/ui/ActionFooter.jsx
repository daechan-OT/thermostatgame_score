import { useEffect, useRef, useState } from 'react'

const COUNTDOWN_S = 5
const CIRCUMFERENCE = 2 * Math.PI * 18

export default function ActionFooter({
  card,
  phase,
  selectedOption,
  autoplay,
  onConfirm,
  onAcknowledge,
}) {
  const [countdown, setCountdown] = useState(COUNTDOWN_S)
  const intervalRef = useRef(null)
  const firedRef = useRef(false)

  // Autoplay countdown: applies to all environment cards, and choice cards in 'revealed' phase
  const isAcknowledgePhase = card?.type === 'environment' || phase === 'revealed'

  useEffect(() => {
    if (!isAcknowledgePhase || !autoplay) {
      setCountdown(COUNTDOWN_S)
      return
    }
    
    firedRef.current = false
    setCountdown(COUNTDOWN_S)

    intervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          if (!firedRef.current) {
            firedRef.current = true
            onAcknowledge()
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [isAcknowledgePhase, autoplay, card?.id])

  if (!card) return null

  const handleUnderstood = () => {
    clearInterval(intervalRef.current)
    firedRef.current = true
    onAcknowledge()
  }

  // Theme color for Understood button
  // For choice cards in revealed phase we always use brand red (both options are shown)
  // For environment cards: warm (positive impact) = red, cool (negative) = blue
  const envImpact = card.type === 'environment' ? card.energyImpact : 0
  const understoodColor = envImpact < 0 ? '#004E93' : '#930018'
  
  // Progress for autoplay ring
  const progress = (isAcknowledgePhase && autoplay)
    ? (countdown / COUNTDOWN_S) * CIRCUMFERENCE
    : CIRCUMFERENCE

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        maxWidth: 480,
        marginInline: 'auto',
        zIndex: 20,
        padding: '0 16px 32px 16px',
        backgroundColor: '#FFF9EF',
      }}
    >
      {card.type === 'choice' && phase === 'reading' ? (
        <button
          onClick={onConfirm}
          disabled={!selectedOption}
          className="w-full py-4 rounded-2xl font-semibold text-white transition-all active:scale-95 shadow-lg"
          style={{
            backgroundColor: selectedOption ? '#930018' : '#C9A0A8',
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 20,
            cursor: selectedOption ? 'pointer' : 'not-allowed',
            border: 'none',
            boxShadow: selectedOption ? '0 4px 20px rgba(147,0,24,0.3)' : 'none',
          }}
        >
          Confirm
        </button>
      ) : (
        <button
          onClick={handleUnderstood}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-semibold text-white transition-all active:scale-95 shadow-lg"
          style={{
            backgroundColor: understoodColor,
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 20,
            border: 'none',
            boxShadow: `0 4px 20px ${envImpact < 0 ? 'rgba(0,78,147,0.3)' : 'rgba(147,0,24,0.3)'}`,
            cursor: 'pointer',
          }}
        >
          <span>Understood</span>
          <span style={{ opacity: 0.8 }}>→</span>

          {/* Autoplay countdown ring */}
          {autoplay && (
            <svg width="28" height="28" viewBox="0 0 40 40" style={{ flexShrink: 0 }}>
              <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
              <circle
                cx="20" cy="20" r="18"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={CIRCUMFERENCE - progress}
                style={{
                  transform: 'rotate(-90deg)',
                  transformOrigin: '20px 20px',
                  transition: 'stroke-dashoffset 1s linear',
                }}
              />
              <text x="20" y="25" textAnchor="middle" fontSize="14" fontWeight="700" fill="white" fontFamily="DM Sans, sans-serif">
                {countdown}
              </text>
            </svg>
          )}
        </button>
      )}
    </div>
  )
}
