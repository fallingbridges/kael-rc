import { useState, useEffect } from 'react'
import {
  Sparkle, PaperPlaneTilt, Microphone,
  Spiral, Heartbeat, BatteryLow, CloudRain, Cloud, Moon,
} from '@phosphor-icons/react'

/* a Sunday-night exchange, weeks in: Kael remembers, you handle it differently now */
const THREAD = [
  { who: 'kael', text: 'It’s Sunday. You said these nights used to feel impossible.' },
  { who: 'user', text: 'Felt it coming. Went for a walk instead of spiraling.' },
  { who: 'kael', text: 'A month ago this was 3am, wide awake. Look at you.' },
]

const MOODS = [
  { Ic: Spiral, label: 'Spiraling', seed: 'I can’t stop spiraling.' },
  { Ic: Heartbeat, label: 'Anxious', seed: 'I’m anxious for no reason.' },
  { Ic: BatteryLow, label: 'Burnt out', seed: 'I’ve got nothing left.' },
  { Ic: CloudRain, label: 'Feeling low', seed: 'Everything feels heavy.' },
  { Ic: Cloud, label: 'Numb', seed: 'I just feel numb.' },
  { Ic: Moon, label: 'Can’t sleep', seed: 'I can’t sleep again.' },
]

const STEPS = ['safety', 'recognition', 'hope']
const CTAS = ['Continue', 'Continue', 'Let’s begin']

function useTypewriter(text, speed = 26, delay = 480) {
  const [out, setOut] = useState('')
  useEffect(() => {
    setOut('')
    let i = 0, iv
    const t = setTimeout(() => {
      iv = setInterval(() => { i++; setOut(text.slice(0, i)); if (i >= text.length) clearInterval(iv) }, speed)
    }, delay)
    return () => { clearTimeout(t); clearInterval(iv) }
  }, [text, speed, delay])
  return out
}

export default function IntroConcept({ noanim = false }) {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const total = STEPS.length
  const go = (n) => { const c = Math.max(0, Math.min(total - 1, n)); setDir(c >= step ? 1 : -1); setStep(c) }
  const next = () => go(step >= total - 1 ? 0 : step + 1)
  const kind = STEPS[step]
  return (
    <div className={`lib-page ov-page ov4-page ov7-page io-page${noanim ? ' ov-noanim' : ''}`}>
      <div className="ob-devbar">
        <span className="ob-dev-title">Intro concept · {step + 1}/{total} · {kind}</span>
        <div className="ob-dev-controls">
          <button className="ob-dev-btn" onClick={() => go(step - 1)} disabled={step === 0}>Prev</button>
          <button className="ob-dev-btn" onClick={() => go(step + 1)} disabled={step === total - 1}>Next</button>
        </div>
      </div>
      <div className="ov-stage">
        <div className="ov-screen ov4-screen" data-theme="light">
          <header className="ov-head io-head">
            <div className="io-dots">
              {STEPS.map((_, n) => <span key={n} className="io-dot" data-on={n === step || undefined} />)}
            </div>
          </header>
          <div className="ov-body">
            <div key={step} data-dir={dir} className="ov-flow ov4-flow io-flow">
              {kind === 'safety' && <Safety />}
              {kind === 'recognition' && <Recognition />}
              {kind === 'hope' && <Hope />}
            </div>
          </div>
          <footer className="ov-foot">
            <button className="ov-cta" onClick={next}>{CTAS[step]}</button>
          </footer>
        </div>
      </div>
    </div>
  )
}

const INTRO = 'Hey. I’m Kael. Someone in your corner, any hour. No judgment, no waiting room.'
export function Safety() {
  const typed = useTypewriter(INTRO)
  return (
    <div className="io-screen io-safety">
      <div className="io-orb">
        <span className="io-orb-ring" />
        <span className="io-orb-ring io-orb-ring-2" />
        <span className="io-orb-core"><Sparkle size={28} weight="fill" /></span>
      </div>
      <h1 className="io-title">Your pocket mental wellness coach.</h1>
      <div className="io-bubble">
        <span className="io-bubble-av"><Sparkle size={12} weight="fill" /></span>
        <p className="io-bubble-text">{typed}{typed.length < INTRO.length && <span className="io-caret" />}</p>
      </div>
      <p className="io-contrast">Not a chatbot. Not a journal that sits there. <b>A coach who pays attention.</b></p>
    </div>
  )
}

export function Recognition() {
  const [picked, setPicked] = useState(null)
  return (
    <div className="io-screen io-recog">
      <h1 className="io-title io-recog-title">Any mood.<br />Any moment.<br />Kael <em>meets</em> you there.</h1>
      <div className="io-entry">
      <div className="io-pills">
        {MOODS.map((m, k) => (
          <button key={m.label} className="io-pill"
            style={{ '--d': `${0.06 * k + 0.42}s` }} onClick={() => setPicked(m)}>
            <span className="io-pill-ic"><m.Ic size={13} weight="duotone" /></span>
            <span className="io-pill-name">{m.label}</span>
          </button>
        ))}
      </div>
      <div className="io-ask" data-filled={picked ? true : undefined}>
        <span className="io-ask-av"><Sparkle size={13} weight="fill" /></span>
        <span className="io-ask-text">{picked ? picked.seed : 'Tell Kael anything…'}</span>
        <span className="io-ask-action">
          {picked ? <PaperPlaneTilt size={16} weight="fill" /> : <Microphone size={17} weight="fill" />}
        </span>
      </div>
      </div>
      <p className="io-ask-note">Any hour. Type it, or just say it out loud.</p>
    </div>
  )
}

export function Hope() {
  return (
    <div className="io-screen io-hope">
      <h1 className="io-title io-hope-title">Break the <em>patterns</em> keeping you stuck.</h1>
      <p className="io-sub">Kael remembers, so the same loop plays out differently.</p>
      <div className="io-chat">
        <span className="io-chat-when">Sunday · 9:14 PM</span>
        {THREAD.map((m, k) => (
          <div key={k} className={`io-cmsg io-cmsg-${m.who}`} style={{ '--d': `${0.6 * k + 0.4}s` }}>
            {m.who === 'kael' && <span className="io-cmsg-av"><Sparkle size={12} weight="fill" /></span>}
            <p>{m.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
