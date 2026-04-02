// GameScreen — main game layout: header, gauge, active card, history tab

import { useEffect } from 'react'
import GaugeArc from './gauge/GaugeArc.jsx'
import GaugeBar from './gauge/GaugeBar.jsx'
import EnvironmentCard from './cards/EnvironmentCard.jsx'
import ChoiceCard from './cards/ChoiceCard.jsx'
import HistoryPanel from './history/HistoryPanel.jsx'
import GaugeToggle from './ui/GaugeToggle.jsx'
import AutoplayButton from './ui/AutoplayButton.jsx'
import ActionFooter from './ui/ActionFooter.jsx'

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

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <GaugeToggle view={gaugeView} onToggle={onToggleGaugeView} />
          <AutoplayButton active={autoplay} onToggle={onToggleAutoplay} />
        </div>
      </header>

      {/* Gauge */}
      <div
        style={{
          backgroundColor: 'transparent',
          borderBottom: '1px solid rgba(147,0,24,0.06)',
        }}
      >
        {gaugeView === 'arc'
          ? <GaugeArc energy={displayEnergy} />
          : <GaugeBar energy={displayEnergy} />
        }
      </div>

      {/* Card area */}
      <div className="flex-1 p-4 pb-2">
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
