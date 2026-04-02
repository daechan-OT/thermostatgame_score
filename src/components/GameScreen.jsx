// GameScreen — main game layout: header, gauge, active card, history tab

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GaugeArc from './gauge/GaugeArc.jsx'
import GaugeBar from './gauge/GaugeBar.jsx'
import EnvironmentCard from './cards/EnvironmentCard.jsx'
import ChoiceCard from './cards/ChoiceCard.jsx'
import HistoryPanel from './history/HistoryPanel.jsx'
import GaugeToggle from './ui/GaugeToggle.jsx'
import ActionFooter from './ui/ActionFooter.jsx'

import logo from '../assets/logo.png'

export default function GameScreen({
  state,
  displayEnergy,
  onSelectOption,
  onConfirm,
  onAcknowledgeEnv,
  onAcknowledgeChoice,
  onToggleAutoplay,
  onToggleGaugeView,
  onOpenHistory,
  onCloseHistory,
}) {
  const {
    round,
    energy,
    currentCard,
    phase,
    selectedOption,
    autoplay,
    gaugeView,
    history,
    historyOpen,
  } = state

  if (!currentCard) return null

  return (
    <div
      style={{
        minHeight: '100dvh',
        backgroundColor: '#FFF9EF',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 480,
        margin: '0 auto',
        width: '100%',
        position: 'relative',
      }}
    >
      {/* Header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 30,
          backgroundColor: '#FFF9EF',
          borderBottom: '1px solid rgba(147,0,24,0.1)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontFamily: '"DM Sans", system-ui, sans-serif',
            fontSize: 14,
            fontWeight: 600,
            color: '#40000F',
          }}
        >
          Round {round + 1} / 10
        </span>

        {/* Small Logo Centered */}
        <img
          src={logo}
          alt="Logo"
          style={{ height: 28, width: 'auto', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}
        />

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <GaugeToggle view={gaugeView} onToggle={onToggleGaugeView} />
        </div>
      </header>

      {/* Gauge Container (Flexible but smooth) */}
      <div
        style={{
          backgroundColor: 'transparent',
          borderBottom: '1px solid rgba(147,0,24,0.06)',
          minHeight: 160,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          transition: 'all 0.4s ease-in-out'
        }}
      >
        <AnimatePresence mode="wait">
          {gaugeView === 'arc' ? (
            <motion.div
              key="arc"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%' }}
            >
              <GaugeArc energy={displayEnergy} />
            </motion.div>
          ) : (
            <motion.div
              key="bar"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%' }}
            >
              <GaugeBar energy={displayEnergy} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card area */}
      <div className="flex-1 px-8 pt-4 pb-2">
        {currentCard.type === 'environment' ? (
          <EnvironmentCard
            key={currentCard.id}
            card={currentCard}
          />
        ) : (
          <ChoiceCard
            key={currentCard.id}
            card={currentCard}
            selectedOption={selectedOption}
            phase={phase}
            onSelectOption={onSelectOption}
          />
        )}
      </div>

      {/* Action Footer */}
      <ActionFooter
        card={currentCard}
        phase={phase}
        selectedOption={selectedOption}
        autoplay={autoplay}
        onConfirm={onConfirm}
        onAcknowledge={currentCard.type === 'environment' ? onAcknowledgeEnv : onAcknowledgeChoice}
      />

      {/* History panel */}
      <HistoryPanel
        history={history}
        isOpen={historyOpen}
        onOpen={onOpenHistory}
        onClose={onCloseHistory}
      />
    </div>
  )
}
