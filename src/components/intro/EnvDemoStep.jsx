import { useState } from 'react'
import { motion } from 'framer-motion'
import GaugeArc from '../gauge/GaugeArc'
import EnvironmentCard from '../cards/EnvironmentCard'
import DemoFeedbackModal from './DemoFeedbackModal'

const MOCK_ENV = {
  id: 'demo-env',
  type: 'environment',
  title: 'Morning Rush',
  description:
    'Three team members called out sick. The line is out the door and guests are growing restless.',
  energyImpact: 2,
}

export default function EnvDemoStep({ onNext, startEnergy = 0 }) {
  const [understood, setUnderstood] = useState(false)
  const [energy, setEnergy] = useState(startEnergy)

  const handleUnderstood = () => {
    setEnergy(prev => Math.max(-5, Math.min(5, prev + MOCK_ENV.energyImpact)))
    setUnderstood(true)
  }

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '4px 20px 8px',
        minHeight: 0,
      }}
    >
      {/* Step badge */}
      <p
        style={{
          fontFamily: '"DM Sans", system-ui, sans-serif',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.11em',
          textTransform: 'uppercase',
          color: '#004E93',
          textAlign: 'center',
          marginBottom: 10,
        }}
      >
        Demo · Round 2 — Environment Card
      </p>

      {/* Gauge — inherits energy from choice demo */}
      <GaugeArc energy={energy} />

      {/* Context line */}
      <p
        style={{
          fontFamily: '"DM Sans", system-ui, sans-serif',
          fontSize: 13,
          color: 'rgba(64,0,15,0.55)',
          textAlign: 'center',
          lineHeight: 1.6,
          margin: '6px 8px 16px',
        }}
      >
        {understood
          ? 'This shifted the store energy — outside your control.'
          : "Now something happens that you didn't choose and can't stop."}
      </p>

      {/* Card */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative' }}>
        <EnvironmentCard card={MOCK_ENV} />
        <DemoFeedbackModal
          visible={understood}
          impact={`+${MOCK_ENV.energyImpact} Store Energy`}
          body="Environment cards happen regardless of what you do. You can't choose them — but every round, your response to them is still yours to own."
          onNext={onNext}
        />
      </div>

      {/* Action button — matches fixed footer position */}
      <div style={{ marginTop: 16, flexShrink: 0, paddingBottom: 32 }}>
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: understood ? 0.3 : 1, y: 0 }}
          whileTap={understood ? {} : { scale: 0.97 }}
          onClick={understood ? undefined : handleUnderstood}
          disabled={understood}
          style={{
            width: '100%',
            padding: '17px',
            borderRadius: 16,
            border: 'none',
            backgroundColor: '#930018',
            color: '#fff',
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 18,
            fontWeight: 700,
            cursor: understood ? 'default' : 'pointer',
            boxShadow: understood ? 'none' : '0 4px 18px rgba(147,0,24,0.28)',
          }}
        >
          Understood
        </motion.button>
      </div>
    </div>
  )
}
