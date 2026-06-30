import { motion } from 'framer-motion'
import { Sun, Route, Pulse, Person, Sparkle } from './Icons.jsx'

// 2-1-2 layout: the centre is an elevated medallion — talking to Kael is the point.
const LEFT = [
  { id: 'home', label: 'Today', Icon: Sun },
  { id: 'journey', label: 'Journey', Icon: Route },
]
const RIGHT = [
  { id: 'patterns', label: 'Insight', Icon: Pulse },
  { id: 'you', label: 'You', Icon: Person },
]

function NavItem({ id, label, Icon, active, onSelect }) {
  return (
    <motion.button
      className="nav-item"
      data-active={active === id}
      onClick={() => onSelect?.(id)}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    >
      <Icon size={23} sw={active === id ? 1.9 : 1.6} />
      <span className="nav-label">{label}</span>
      <span className="nav-dot" />
    </motion.button>
  )
}

export default function BottomNav({ active, onSelect }) {
  return (
    <nav className="nav">
      {LEFT.map((t) => (
        <NavItem key={t.id} {...t} active={active} onSelect={onSelect} />
      ))}

      <motion.button
        className="nav-kael"
        data-active={active === 'chat'}
        onClick={() => onSelect?.('chat')}
        whileTap={{ scale: 0.92 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        aria-label="Talk to Kael"
      >
        <span className="nav-medallion">
          <Sparkle size={24} sw={1.5} />
        </span>
        <span className="nav-label">Kael</span>
      </motion.button>

      {RIGHT.map((t) => (
        <NavItem key={t.id} {...t} active={active} onSelect={onSelect} />
      ))}
    </nav>
  )
}
