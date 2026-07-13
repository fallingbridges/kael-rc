import { useState } from 'react'
import {
  ArrowLeft, X, DoorOpen, Star, ShieldCheck, BellSimple, Gift,
  PenNib, Fingerprint, HandHeart,
} from '@phosphor-icons/react'
import { PlanSheet } from './ProgramPaywall.jsx'

/* ──────────────────────────────────────────────────────────────────────────
   3-Step Paywall — the close as three small yeses instead of one big ask.
   1 · Ready: possession. Kael is built, calibrated, waiting.
   2 · Gift: the trial sold as generosity. Everything unlocked, $0 today.
   3 · Close: terms, the reminder promise, one review, the ask.
   Each screen is one idea; every Continue shrinks the final tap.
   ────────────────────────────────────────────────────────────────────────── */

const NAME = 'Sumit'
const STEPS = ['ready', 'gift', 'close']

const OUTCOMES = [
  { Icon: PenNib, t: 'Set down what’s on your mind' },
  { Icon: Fingerprint, t: 'See recurring patterns more clearly' },
  { Icon: HandHeart, t: 'Feel more understood over time' },
]

/* 1 · readiness — the thing is made, and it is yours */
function ReadyStep() {
  return (
    <div className="pp2 pp2-c tp-ready">
      <span className="ov4-badge"><DoorOpen size={26} weight="duotone" /></span>
      <h1 className="pp2-title">{NAME}, Kael is ready<br />for you.</h1>
      <p className="tp-sub">A private place to reflect, understand what you’re feeling, and notice the patterns shaping your life.</p>
      <div className="tp-rows">
        {OUTCOMES.map((o, k) => (
          <div key={o.t} className="tp-row" style={{ '--d': `${0.12 * k + 0.25}s` }}>
            <span className="tp-row-ic"><o.Icon size={19} weight="duotone" /></span>
            <p>{o.t}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* 2 · the gift — sell the trial itself, not the usage of it */
function GiftStep() {
  return (
    <div className="pp2 pp2-c tp-gift">
      <span className="ov4-badge"><Gift size={26} weight="duotone" /></span>
      <span className="ov4-kicker">Your free week</span>
      <h1 className="pp2-title">A full week of Kael.<br />Free.</h1>
      <p className="tp-sub tp-gift-sub">Everything unlocked from the first minute. Unlimited reflections, full memory, every pattern read. Nothing held back, nothing charged today.</p>
      <p className="tp-gift-coda">By next week, you’ll feel the difference.</p>
    </div>
  )
}

/* 3 · the close — the settled paywall plus the one honest anxiety-killer */
function CloseStep({ onNext, onPlans }) {
  return (
    <div className="pp2 pp2-c pp2-offer pp2-paywall">
      <h1 className="pp2-title pp2-title-lg">Continue with Kael.<br />Your first week is free.</h1>
      <div className="pp2-review">
        <span className="pp2-review-stars">{[0, 1, 2, 3, 4].map((k) => <Star key={k} size={15} weight="fill" />)}</span>
        <p>“For the first time, I don’t feel<br />alone in my own head.”</p>
      </div>
      <div className="pp2-offer-foot">
        <p className="pp2-freehead">Free for 7 days</p>
        <p className="pp2-priceline">Then $69.99/year · $5.83/month</p>
        {onPlans && <button className="pp2-seeplans" onClick={onPlans}>View all plans</button>}
        <div className="tp-trusts">
          <p className="pp2-trust"><BellSimple size={15} weight="fill" />We’ll remind you before your trial ends.</p>
          <p className="pp2-trust"><ShieldCheck size={15} weight="fill" />No commitment. Cancel anytime.</p>
        </div>
        <button className="ov-cta" onClick={onNext}>Start my free week</button>
        <div className="pp2-legal"><button>Restore</button><button>Terms</button><button>Privacy</button></div>
      </div>
    </div>
  )
}

export default function TrialSteps({ noanim = false }) {
  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  const [sheet, setSheet] = useState(false)
  const total = STEPS.length
  const step = STEPS[i]
  const go = (n) => { const t = Math.max(0, Math.min(total - 1, n)); setDir(t >= i ? 1 : -1); setI(t) }
  const next = () => go(i >= total - 1 ? 0 : i + 1)
  const back = () => go(i - 1)

  return (
    <div className={`lib-page ov-page ov4-page ov6-page ov7-page${noanim ? ' ov-noanim' : ''}`}>
      <div className="ob-devbar">
        <span className="ob-dev-title">3-Step Paywall · {i + 1}/{total} · {step}</span>
        <div className="ob-dev-controls">
          <button className="ob-dev-btn" onClick={() => go(i - 1)} disabled={i === 0}>Prev</button>
          <button className="ob-dev-btn" onClick={() => go(i + 1)} disabled={i === total - 1}>Next</button>
          <select className="ob-dev-jump" value={i} onChange={(e) => go(Number(e.target.value))}>
            {STEPS.map((sc, idx) => (<option key={sc} value={idx}>{idx + 1}. {sc}</option>))}
          </select>
        </div>
      </div>

      <div className="ov-stage">
        <div className="ov-screen ov4-screen" data-theme="light">
          <header className="ov-head">
            <div className="ov-head-row">
              <button className="ov-back" data-hide={i === 0 || undefined} onClick={back} aria-label="Back"><ArrowLeft size={20} /></button>
              <button className="ov-back ov-x" onClick={() => setSheet(true)} aria-label="Close"><X size={20} /></button>
            </div>
          </header>

          <div className="ov-body">
            <div key={i} data-dir={dir} className="ov-flow ov4-flow">
              {step === 'ready' ? <ReadyStep />
                : step === 'gift' ? <GiftStep />
                : <CloseStep onNext={next} onPlans={() => setSheet(true)} />}
            </div>
          </div>

          {step !== 'close' && (
            <footer className="ov-foot">
              <button className="ov-cta" onClick={next}>Continue</button>
            </footer>
          )}
          {sheet && <PlanSheet onClose={() => setSheet(false)} />}
        </div>
      </div>
    </div>
  )
}
