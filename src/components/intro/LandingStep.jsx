import { motion } from 'framer-motion'
import logo from '../../assets/logo.png'

export default function LandingStep() {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 28px 24px',
        textAlign: 'center',
        gap: 0,
      }}
    >
      {/* Top: brand logo */}
      <motion.img
        src={logo}
        alt="Smoothie King"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.45, ease: 'easeOut' }}
        style={{ width: 120, height: 'auto', display: 'block', marginBottom: 40 }}
      />

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.45 }}
        style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: 40,
          fontWeight: 800,
          color: '#930018',
          lineHeight: 1.1,
          marginBottom: 20,
        }}
      >
        The Thermostat<br />Challenge
      </motion.h1>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.3, duration: 0.4, ease: 'easeOut' }}
        style={{
          width: 40,
          height: 2,
          backgroundColor: 'rgba(147,0,24,0.25)',
          borderRadius: 99,
          marginBottom: 20,
        }}
      />

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38, duration: 0.4 }}
        style={{
          fontFamily: '"DM Sans", system-ui, sans-serif',
          fontSize: 15,
          color: '#40000F',
          lineHeight: 1.75,
          opacity: 0.7,
          maxWidth: 300,
          margin: 0,
        }}
      >
        Your team reads your energy every shift.
        This simulation puts you through real store moments
        to practice the skill that shapes everything —
        staying regulated when it counts.
      </motion.p>
    </div>
  )
}
