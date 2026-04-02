// ChoiceCard — two-option choice card with reveal phase

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Pill from '../ui/Pill.jsx'

export default function ChoiceCard({
  card,
  selectedOption,
  phase,         // 'reading' | 'revealed' | 'animating'
  onSelectOption,
}) {
  const chosen = card.options.find(o => o.id === selectedOption)
  const impactVariant = chosen
    ? (chosen.energyImpact === 'balance' ? 'neutral' : (chosen.energyImpact > 0 ? 'negative' : (chosen.energyImpact < 0 ? 'positive' : 'neutral')))
    : 'neutral'

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full rounded-2xl shadow-lg overflow-hidden"
      style={{ backgroundColor: '#fff', border: '1px solid rgba(147,0,24,0.08)' }}
    >
      <div className="p-5">
        {/* Pill */}
        <div className="flex items-center gap-2 mb-4">
          <Pill variant="choice">{card.label}</Pill>
        </div>

        {/* Title */}
        <h2
          className="mb-3 leading-tight"
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 22,
            fontWeight: 700,
            color: '#930018',
          }}
        >
          {card.title}
        </h2>

        {/* Description */}
        <p
          className="mb-5"
          style={{
            fontFamily: '"DM Sans", system-ui, sans-serif',
            fontSize: 15,
            lineHeight: 1.65,
            color: '#40000F',
          }}
        >
          {card.description}
        </p>

        {/* Options */}
        <div className="flex flex-col gap-3 mb-4">
          {card.options.map(opt => {
            const isSelected = selectedOption === opt.id
            const isRevealed = phase === 'revealed' || phase === 'animating'
            const isUnchosen = isRevealed && selectedOption !== opt.id

            return (
              <motion.button
                key={opt.id}
                onClick={() => phase === 'reading' && onSelectOption(opt.id)}
                disabled={phase !== 'reading'}
                whileTap={phase === 'reading' ? { scale: 0.98 } : {}}
                animate={{
                  opacity: isUnchosen ? 0.35 : 1,
                  scale: isSelected ? 1.02 : 1,
                }}
                transition={{ duration: 0.2 }}
                className="w-full text-left p-4 rounded-xl border-2 transition-colors"
                style={{
                  backgroundColor: isSelected ? '#FFDEE5' : '#FFF9EF',
                  borderColor: isSelected ? '#930018' : 'rgba(147,0,24,0.25)',
                  cursor: phase === 'reading' ? 'pointer' : 'default',
                  fontFamily: '"DM Sans", system-ui, sans-serif',
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: '#40000F',
                  fontWeight: isSelected ? 500 : 400,
                }}
              >
                <span style={{ color: '#930018', fontWeight: 700, marginRight: 8 }}>
                  {opt.id}.
                </span>
                {opt.text}
              </motion.button>
            )
          })}
        </div>

        {/* Educational message — slides in after reveal */}
        <AnimatePresence>
          {(phase === 'revealed' || phase === 'animating') && chosen && (
            <motion.div
              initial={{ opacity: 0, y: -12, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="overflow-hidden"
            >
              <div
                className="rounded-xl p-4 mb-4"
                style={{ backgroundColor: '#FFF9EF', border: '1px solid rgba(147,0,24,0.12)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ fontSize: 16 }}>💡</span>
                  <Pill variant={impactVariant}>
                    {chosen.energyImpact === 'balance' 
                      ? 'Back to Balance' 
                      : `Energy ${chosen.energyImpact > 0 ? `+${chosen.energyImpact}` : chosen.energyImpact}`}
                  </Pill>
                </div>
                <p
                  style={{
                    fontFamily: '"DM Sans", system-ui, sans-serif',
                    fontSize: 14,
                    lineHeight: 1.65,
                    color: '#40000F',
                  }}
                >
                  {chosen.educationalMessage}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
