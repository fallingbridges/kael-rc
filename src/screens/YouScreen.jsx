import { useState } from 'react'
import { Sparkle, BellSimple, LockKey, Moon } from '@phosphor-icons/react'
import { PROFILE } from '../journal.js'

function Toggle({ on, onChange }) {
  return <button className="ka-toggle" data-on={on || undefined} onClick={onChange} aria-pressed={on}><span /></button>
}
function Row({ Icon, label, sub, on, onChange }) {
  return (
    <div className="ka-set">
      <span className="ka-set-ic"><Icon size={18} weight="duotone" /></span>
      <div className="ka-set-tx"><b>{label}</b><span>{sub}</span></div>
      <Toggle on={on} onChange={onChange} />
    </div>
  )
}

export default function YouScreen({ theme, onToggleTheme }) {
  const [reminder, setReminder] = useState(true)
  const [lock, setLock] = useState(false)
  return (
    <div className="ka-screen ka-you">
      <div className="ka-scroll">
        <div className="ka-you-hero">
          <div className="ka-you-avatar">{PROFILE.initial}</div>
          <h1 className="ka-you-name">{PROFILE.name}</h1>
          <span className="ka-you-stat">Day {PROFILE.day} · {PROFILE.reflections} reflections · {PROFILE.daysActive} days active</span>
        </div>

        <section className="ka-block">
          <h2 className="ka-sec-label">Your companion</h2>
          <div className="ka-companion">
            <span className="ka-companion-mark"><Sparkle size={20} weight="fill" /></span>
            <div className="ka-companion-tx">
              <b>Kael</b>
              <span>Tuned <i>gentle &amp; curious</i></span>
            </div>
          </div>
        </section>

        <section className="ka-block">
          <h2 className="ka-sec-label">Settings</h2>
          <div className="ka-settings">
            <Row Icon={BellSimple} label="Evening reminder" sub="A gentle nudge at 9pm" on={reminder} onChange={() => setReminder((v) => !v)} />
            <Row Icon={LockKey} label="Private lock" sub="Face ID to open Kael" on={lock} onChange={() => setLock((v) => !v)} />
            <Row Icon={Moon} label="Dusk theme" sub="Easier on late nights" on={theme === 'dark'} onChange={onToggleTheme} />
          </div>
        </section>
        <div className="ka-foot-sp" />
      </div>
    </div>
  )
}
