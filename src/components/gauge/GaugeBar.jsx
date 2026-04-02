// GaugeBar — horizontal segmented bar gauge, -5 to +5

function getZoneColor(val) {
  if (val <= -3) return '#D6E0FF'
  if (val <= -1) return '#9BB4FF'
  if (val <=  1) return '#D0FCA1'
  if (val <=  3) return '#FFADB0'
  return '#930018'
}

// Each segment: integer slot from -5 to +4 (10 slots)
const SLOTS = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5]

export default function GaugeBar({ energy }) {
  return (
    <div className="w-full px-8 py-5">
      {/* Container for the bar and its markers */}
      <div className="relative mb-8">
        
        {/* Ticker Labels (Top) */}
        <div className="flex justify-between w-full mb-3 px-[2px]">
          {SLOTS.map((val) => (
            <div 
              key={val} 
              className="flex flex-col items-center"
              style={{ width: 0, overflow: 'visible' }}
            >
              <span
                style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: val === 0 || Math.abs(val) === 5 ? 8 : 6,
                  fontWeight: val === 0 || Math.abs(val) === 5 ? 800 : 700,
                  fill: val === 0 ? '#40000F' : (val > 0 ? '#930018' : '#004E93'),
                  color: val === 0 ? '#40000F' : (val > 0 ? '#930018' : '#004E93'),
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                  transform: 'translateY(-2px)'
                }}
              >
                {val === 0 ? 'Balance' : (Math.abs(val) === 5 ? 'Lost' : (val > 0 ? `+${val}` : val))}
              </span>
            </div>
          ))}
        </div>

        {/* The Gradient Bar */}
        <div 
          className="w-full h-8 rounded-full relative overflow-hidden"
          style={{
            background: 'linear-gradient(to right, #AABBFF 0%, #E6ECFF 42%, #FFFFFF 50%, #FFE6E9 58%, #FF667D 100%)',
            boxShadow: 'inset 0 0 0 1px rgba(64,0,15,0.1), inset 0 2px 4px rgba(64,0,15,0.06)',
            backgroundClip: 'padding-box'
          }}
        >
          {/* Active indicator overlay (Highlighting the current energy zone) */}
          <div 
            className="absolute top-0 bottom-0 transition-all duration-700 ease-out"
            style={{
              left: energy >= 0 ? '50%' : `${50 + (energy / 10) * 100}%`,
              right: energy >= 0 ? `${50 - (energy / 10) * 100}%` : '50%',
              backgroundColor: energy === 0 
                ? 'transparent' 
                : (energy > 0 ? 'rgba(147,0,24,0.22)' : 'rgba(0,78,147,0.22)'),
              // More visible edge markers at the "current" level
              borderLeft: energy < 0 ? '2.5px solid #004E93' : 'none',
              borderRight: energy > 0 ? '2.5px solid #930018' : 'none',
              zIndex: 5
            }}
          />

          {/* Tick Marks (Overlaid on bar) */}
          <div className="absolute top-0 bottom-0 left-0 right-0 flex justify-between pointer-events-none px-[1.5px]">
            {SLOTS.map((val) => (
              <div 
                key={val}
                style={{
                  width: 1,
                  height: val === 0 ? '100%' : '50%',
                  backgroundColor: val === 0 
                    ? '#40000F' 
                    : (val > 0 ? 'rgba(147,0,24,0.12)' : 'rgba(0,78,147,0.12)'),
                  marginTop: 'auto',
                  marginBottom: 'auto'
                }}
              />
            ))}
          </div>
        </div>

        {/* Bottom Semantic Labels */}
        <div className="flex justify-between w-full mt-3">
          <span
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 9,
              fontWeight: 800,
              color: '#004E93',
              opacity: 0.8,
              lineHeight: 1.2
            }}
          >
            Disengaged<br />Deepfreeze
          </span>
          <span
            style={{
              fontFamily: '"DM Sans", sans-serif',
              fontSize: 9,
              fontWeight: 800,
              color: '#930018',
              opacity: 0.8,
              textAlign: 'right',
              lineHeight: 1.2
            }}
          >
            Messy<br />Meltdown
          </span>
        </div>
      </div>

      {/* Energy Value Feedback */}
      <div className="flex justify-center">
        <span
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 32,
            fontWeight: 700,
            color: energy === 0 ? '#40000F' : (energy > 0 ? '#930018' : '#004E93'),
            lineHeight: 1,
            transition: 'all 600ms ease-in-out',
          }}
        >
          {energy > 0 ? `+${energy}` : energy}
        </span>
      </div>
    </div>
  )
}
