// GaugeBar — horizontal segmented bar gauge, -5 to +5

function getZoneColor(val) {
  if (val <= -3) return '#D6E0FF'
  if (val <= -1) return '#9BB4FF'
  if (val <=  1) return '#D0FCA1'
  if (val <=  3) return '#FFADB0'
  return '#930018'
}

// Each segment: integer slot from -5 to +4 (10 slots)
const SLOTS = [-5,-4,-3,-2,-1,0,1,2,3,4]

export default function GaugeBar({ energy }) {
  return (
    <div className="w-full px-4 py-3">
      {/* Segmented bar */}
      <div className="relative flex items-center w-full" style={{ height: 40 }}>
        {SLOTS.map((slot) => {
          const isActive = energy > 0
            ? slot >= 0 && slot < energy
            : energy < 0
              ? slot >= energy && slot < 0
              : false

          const segColor = isActive ? getZoneColor(slot < 0 ? slot : slot + 1) : '#E5E0D8'
          const isCenter = slot === -1 // left of zero → center marker between -1 and 0

          return (
            <div key={slot} className="flex-1 relative flex items-center" style={{ height: '100%' }}>
              <div
                style={{
                  width: '100%',
                  height: 22,
                  backgroundColor: segColor,
                  borderRadius:
                    slot === -5 ? '8px 0 0 8px' :
                    slot === 4  ? '0 8px 8px 0' : 0,
                  border: '1px solid rgba(64,0,15,0.08)',
                  transition: 'background-color 600ms ease-in-out',
                  position: 'relative',
                }}
              />
              {/* Tick marks above bar */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: slot === 0 ? 2 : 1,
                  height: slot === 0 ? 32 : 24,
                  backgroundColor: slot === 0 ? '#40000F' : 'rgba(64,0,15,0.25)',
                  transform: 'translateX(50%)',
                  zIndex: 2,
                }}
              />
            </div>
          )
        })}
        {/* Right edge tick for +5 */}
        <div
          style={{
            position: 'absolute',
            top: 0, right: 0,
            width: 1, height: 24,
            backgroundColor: 'rgba(64,0,15,0.25)',
          }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between items-center mt-1 px-0" style={{ position: 'relative' }}>
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#40000F',
            opacity: 0.4,
            fontFamily: '"DM Sans", sans-serif',
          }}
        >
          Deepfreeze
        </span>

        <div className="flex flex-1 justify-between px-4">
          {[-5,-4,-3,-2,-1,0,1,2,3,4,5].map(val => (
            <span
              key={val}
              style={{
                fontSize: 10,
                color: val === 0 ? '#40000F' : 'rgba(64,0,15,0.45)',
                fontWeight: val === 0 ? '700' : '400',
                fontFamily: '"DM Sans", sans-serif',
              }}
            >
              {val}
            </span>
          ))}
        </div>

        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#40000F',
            opacity: 0.4,
            fontFamily: '"DM Sans", sans-serif',
          }}
        >
          Meltdown
        </span>
      </div>

      {/* Floating current value label */}
      <div className="flex justify-center mt-1">
        <span
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 28,
            fontWeight: 700,
            color: '#930018',
            transition: 'all 600ms ease-in-out',
          }}
        >
          {energy > 0 ? `+${energy}` : energy}
        </span>
      </div>
    </div>
  )
}
