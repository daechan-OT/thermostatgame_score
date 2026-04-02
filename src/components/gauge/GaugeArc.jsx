// GaugeArc — filled half-circle with smooth gradient + rotating needle
// Design: smooth blue→pink gradient fill, clean needle, no tick marks/labels

const CX = 140
const CY = 138
const R  = 122

// -5 → −90° (left), 0 → 0° (top/12 o'clock), +5 → +90° (right)
function energyToAngle(e) {
  return (e / 5) * 90
}

export default function GaugeArc({ energy }) {
  const angle = energyToAngle(energy)

  // Semicircle flat-bottom path
  const lx = CX - R   // left base point
  const rx = CX + R   // right base point
  const semicircle = `M ${lx} ${CY} A ${R} ${R} 0 0 1 ${rx} ${CY} Z`

  return (
    <div className="flex flex-col items-center w-full" style={{ padding: '12px 0 4px' }}>
      <svg
        viewBox="0 0 280 165"
        width="100%"
        style={{ maxWidth: 340, display: 'block', overflow: 'visible' }}
        aria-label={`Store Energy: ${energy}`}
      >
        <defs>
          {/* Smooth gradient: periwinkle blue → lavender → blush → salmon pink */}
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#B0BAFA" />
            <stop offset="28%"  stopColor="#CEC5F5" />
            <stop offset="50%"  stopColor="#F2E4EE" />
            <stop offset="72%"  stopColor="#FFCDD6" />
            <stop offset="100%" stopColor="#F2A0AB" />
          </linearGradient>

          {/* Subtle inner shadow effect via radial gradient overlay */}
          <radialGradient id="gaugeVignette" cx="50%" cy="100%" r="85%" fx="50%" fy="100%">
            <stop offset="0%"   stopColor="#FFF9EF" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#FFF9EF" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Filled semicircle — gradient */}
        <path d={semicircle} fill="url(#gaugeGrad)" />

        {/* Vignette overlay for depth */}
        <path d={semicircle} fill="url(#gaugeVignette)" />

        {/* Thin bottom edge line */}
        <line
          x1={lx} y1={CY}
          x2={rx} y2={CY}
          stroke="#FFF9EF"
          strokeWidth="3"
        />

        {/* End Labels */}
        <text
          x={lx} y={CY + 18}
          textAnchor="start"
          style={{
            fontFamily: '"DM Sans", system-ui, sans-serif',
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fill: '#40000F',
            opacity: 0.4,
          }}
        >
          Deepfreeze
        </text>
        <text
          x={rx} y={CY + 18}
          textAnchor="end"
          style={{
            fontFamily: '"DM Sans", system-ui, sans-serif',
            fontSize: 10,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fill: '#40000F',
            opacity: 0.4,
          }}
        >
          Meltdown
        </text>

        {/* Needle */}
        <g
          style={{
            transform: `rotate(${angle}deg)`,
            transformOrigin: `${CX}px ${CY}px`,
            transition: 'transform 600ms ease-in-out',
          }}
        >
          {/* Needle shaft — tapered look via two overlapping lines */}
          <line
            x1={CX} y1={CY - 4}
            x2={CX} y2={CY - R + 16}
            stroke="#40000F"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>

        {/* Pivot dot (drawn on top, not rotated) */}
        <circle cx={CX} cy={CY} r="7"  fill="#FFF9EF" />
        <circle cx={CX} cy={CY} r="4"  fill="#40000F" />
        <circle cx={CX} cy={CY} r="2"  fill="#FFF9EF" />
      </svg>

      {/* Energy value below arc */}
      <div
        style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: 30,
          fontWeight: 700,
          color: '#930018',
          lineHeight: 1,
          marginTop: 2,
          transition: 'all 600ms ease-in-out',
          letterSpacing: '-0.01em',
        }}
      >
        {energy > 0 ? `+${energy}` : energy}
      </div>
    </div>
  )
}
