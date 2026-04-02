// EnvironmentCard — fixed outcome, no player choice
// Shows autoplay countdown ring when autoplay is ON

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Pill from '../ui/Pill.jsx'

export default function EnvironmentCard({ card }) {
  const impactVariant = card.energyImpact > 0 ? 'negative' : card.energyImpact < 0 ? 'positive' : 'neutral'

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="w-full rounded-2xl shadow-lg overflow-hidden"
      style={{ backgroundColor: '#fff', border: '1px solid rgba(147,0,24,0.08)' }}
    >
      <div className="p-5">
        {/* Pills row */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Pill variant="env">{card.label}</Pill>
          <Pill variant={impactVariant}>{card.impactLabel}</Pill>
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
          style={{
            fontFamily: '"DM Sans", system-ui, sans-serif',
            fontSize: 15,
            lineHeight: 1.65,
            color: '#40000F',
          }}
        >
          {card.description}
        </p>
      </div>
    </motion.div>
  )
}
