import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Spiral, Lightning, Quotes, Sun, Sparkle, CloudRain, Check, X, Star,
} from '@phosphor-icons/react'

/* ──────────────────────────────────────────────────────────────────────────
   V8 Close — the post-read conversion tail as a standalone artifact.
   Liven's structure, Kael's craft: an editorial ceremony, not an app form.

     1. Kael is ready   seal masthead + burst, the calibration read back
     2. The difference  Now vs With Kael, their pillars answered
     3. The promise     a two-party document: they sign, Kael has signed
     4. The moment      confetti + the pact, dated like a keepsake
     5. The paywall     Liven's sheet (trial toggle) set like a menu, not a grid

   Demo data stands in for the quiz (name, pattern, goals).
   ────────────────────────────────────────────────────────────────────────── */

const NAME = 'Maya'
const PATTERN = { name: 'The Overloaded', Glyph: Spiral }

const TUNED = [
  { Icon: Spiral, text: <>Knows your pattern, <b>The Overloaded</b></> },
  { Icon: Lightning, text: <>Understands what sets you off, and when</> },
  { Icon: Quotes, text: <>Speaks to the voice in your head, gently</> },
  { Icon: Sun, text: <>Checks in for a few honest minutes a day</> },
  { Icon: Sparkle, text: <>Pointed at <i>a calmer mind</i></>, gold: true },
]

const NOW = [
  'A mind that races and replays',
  'Drained before the day starts',
  'A voice that is never satisfied',
  'Feelings muted instead of met',
]
const WITH = [
  'A mind that settles when you ask',
  'Energy that lasts the whole day',
  'An inner voice on your side',
  'Feelings you can sit with',
]

const VOWS = [
  'Show up for a few honest minutes a day',
  'Bring the real days, not just the good ones',
  'Let this be pointed at a calmer mind',
]

const TONES = ['#c2734f', '#c2a06a', '#869a7f', '#6d82a0', '#b8748a', '#8a82a0']

/* deterministic confetti pieces — burst (radial) or rain (fall) */
function pieces(n, mode) {
  return Array.from({ length: n }, (_, k) => {
    const r = (a, b) => a + (((k * 2654435761) >>> (a % 7)) % 1000) / 1000 * (b - a)
    return {
      left: (k * 61) % 100,
      dx: r(-130, 130),
      delay: mode === 'rain' ? (((k * 37) % 100) / 100) * 2.4 : (((k * 17) % 10) / 10) * 0.14,
      dur: mode === 'rain' ? 2.6 + (((k * 13) % 10) / 10) * 2.2 : 1.6 + (((k * 13) % 10) / 10) * 1.0,
      w: 5 + ((k * 7) % 4) * 2,
      tone: TONES[k % TONES.length],
      tilt: (k * 83) % 360,
    }
  })
}

function Burst({ n = 30 }) {
  const ps = useMemo(() => pieces(n, 'burst'), [n])
  return (
    <div className="k8-burst" aria-hidden="true">
      {ps.map((p, k) => (
        <span
          key={k}
          style={{
            width: p.w, height: Math.round(p.w * 0.62), background: p.tone,
            animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`,
            '--dx': `${p.dx}px`, '--tilt': `${p.tilt}deg`,
          }}
        />
      ))}
    </div>
  )
}

function Rain({ n = 70 }) {
  const ps = useMemo(() => pieces(n, 'rain'), [n])
  return (
    <div className="k8-rain" aria-hidden="true">
      {ps.map((p, k) => (
        <span
          key={k}
          style={{
            left: `${p.left}%`, width: p.w, height: Math.round(p.w * 0.62), background: p.tone,
            animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`, '--tilt': `${p.tilt}deg`,
          }}
        />
      ))}
    </div>
  )
}

/* ── 1 · Kael is ready — a seal, a burst, the calibration read back ── */
function Ready({ onNext }) {
  const { Glyph } = PATTERN
  return (
    <div className="k8-shell">
      <div className="k8-body k8-center">
        <div className="k8-celebrate">
          <Burst />
          <span className="k8-seal"><Glyph size={30} weight="duotone" /></span>
        </div>
        <span className="k8-eyebrow" style={{ '--d': '0.35s' }}>Calibrated to you</span>
        <h1 className="k8-title" style={{ '--d': '0.42s' }}>Kael is ready, <em>{NAME}.</em></h1>
        <p className="k8-lede" style={{ '--d': '0.5s' }}>Three minutes of honest answers, and your coach knows where to start.</p>
        <div className="k8-tuned">
          {TUNED.map((t, k) => (
            <div className={`k8-tune${t.gold ? ' k8-tune-gold' : ''}`} key={k} style={{ '--d': `${0.58 + k * 0.08}s` }}>
              <span className="k8-tune-ic"><t.Icon size={17} weight="duotone" /></span>
              <span className="k8-tune-tx">{t.text}</span>
            </div>
          ))}
        </div>
      </div>
      <footer className="k8-foot">
        <button className="ov-cta" onClick={onNext}>Continue</button>
      </footer>
    </div>
  )
}

/* ── 2 · The difference — two versions of the same days ── */
function Difference({ onNext }) {
  return (
    <div className="k8-shell">
      <div className="k8-body k8-center">
        <span className="k8-eyebrow" style={{ '--d': '0.08s' }}>The difference</span>
        <h1 className="k8-title k8-title-sm" style={{ '--d': '0.15s' }}>See the difference <em>with Kael.</em></h1>
        <div className="k8-mir">
          <div className="k8-mir-card k8-mir-now" style={{ '--d': '0.26s' }}>
            <div className="k8-mir-head">
              <span className="k8-mir-ic"><CloudRain size={17} weight="duotone" /></span>
              <h3>Now</h3>
            </div>
            {NOW.map((l) => (
              <span className="k8-mir-line" key={l}><X size={10} weight="bold" />{l}</span>
            ))}
          </div>
          <div className="k8-mir-card k8-mir-after" style={{ '--d': '0.38s' }}>
            <div className="k8-mir-head">
              <span className="k8-mir-ic"><Sun size={17} weight="duotone" /></span>
              <h3>With Kael</h3>
            </div>
            {WITH.map((l) => (
              <span className="k8-mir-line" key={l}><Check size={10} weight="bold" />{l}</span>
            ))}
            <span className="k8-mir-line k8-mir-goal"><Sparkle size={10} weight="fill" />A calmer mind</span>
          </div>
        </div>
        <p className="k8-mir-note" style={{ '--d': '0.52s' }}>The left side came from your answers. The right side is the work, together.</p>
      </div>
      <footer className="k8-foot">
        <button className="ov-cta" onClick={onNext}>I want that</button>
      </footer>
    </div>
  )
}

/* ── 3 · The promise — a two-party document, signed on real lines ── */
function Promise_({ onNext }) {
  const [signed, setSigned] = useState(false)
  const canvasRef = useRef(null)
  const drawing = useRef(false)
  const last = useRef(null)

  useEffect(() => {
    const c = canvasRef.current
    const dpr = window.devicePixelRatio || 1
    const rect = c.getBoundingClientRect()
    c.width = rect.width * dpr
    c.height = rect.height * dpr
    const ctx = c.getContext('2d')
    ctx.scale(dpr, dpr)
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = getComputedStyle(c).color
  }, [])

  const pos = (e) => {
    const r = canvasRef.current.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }
  const down = (e) => {
    e.preventDefault()
    canvasRef.current.setPointerCapture(e.pointerId)
    drawing.current = true
    last.current = pos(e)
  }
  const move = (e) => {
    if (!drawing.current) return
    const p = pos(e)
    const ctx = canvasRef.current.getContext('2d')
    ctx.beginPath()
    ctx.moveTo(last.current.x, last.current.y)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
    last.current = p
    if (!signed) setSigned(true)
  }
  const up = () => { drawing.current = false }
  const clear = () => {
    const c = canvasRef.current
    c.getContext('2d').clearRect(0, 0, c.width, c.height)
    setSigned(false)
  }

  return (
    <div className="k8-shell">
      <div className="k8-body k8-center">
        <span className="k8-eyebrow" style={{ '--d': '0.08s' }}>A quiet promise</span>
        <h1 className="k8-title k8-title-sm" style={{ '--d': '0.15s' }}>{NAME}, make it <em>a promise.</em></h1>
        <div className="k8-doc" style={{ '--d': '0.28s' }}>
          <p className="k8-doc-lead">From today, I promise to</p>
          <div className="k8-vows">
            {VOWS.map((v) => (
              <span className="k8-vow" key={v}><Sparkle size={11} weight="fill" />{v}</span>
            ))}
          </div>
          <p className="k8-pact-p">And Kael promises back. <em>To remember everything, to notice what you can’t, to be there at 2am.</em></p>
          <div className="k8-signwrap">
            <div className="k8-sigbox">
              <canvas
                ref={canvasRef}
                className="k8-pad"
                onPointerDown={down}
                onPointerMove={move}
                onPointerUp={up}
                onPointerLeave={up}
              />
              {!signed && <span className="k8-pad-hint">Sign with your finger</span>}
              {signed && (
                <button className="k8-pad-clear" onClick={clear} aria-label="Clear signature"><X size={12} weight="bold" /></button>
              )}
            </div>
            <span className="k8-sig-cap">{NAME}</span>
          </div>
        </div>
        <p className="k8-pad-note" style={{ '--d': '0.4s' }}>Your signature stays on this screen. Nothing is saved or sent.</p>
      </div>
      <footer className="k8-foot">
        <button className="ov-cta" onClick={onNext} disabled={!signed}>I commit to myself</button>
      </footer>
    </div>
  )
}

/* ── 4 · The moment — the pact, dated like a keepsake ── */
function Moment({ onNext }) {
  const { Glyph } = PATTERN
  useEffect(() => {
    const t = setTimeout(onNext, 3000)
    return () => clearTimeout(t)
  }, [onNext])
  return (
    <button className="k8-shell k8-set" onClick={onNext} aria-label="Continue">
      <Rain />
      <span className="k8-seal k8-seal-set"><Glyph size={26} weight="duotone" /></span>
      <h1 className="k8-set-line">It’s a promise, <em>{NAME}.</em></h1>
      <span className="k8-set-cap">{NAME} &amp; Kael · June 30, 2026</span>
    </button>
  )
}

/* ── 5 · The paywall — Liven's sheet, set like a menu ── */
function Paywall() {
  const [plan, setPlan] = useState('trial')
  const [trialOn, setTrialOn] = useState(true)
  const pickTrial = () => { setPlan('trial'); setTrialOn(true) }
  const toggleTrial = (e) => {
    e.stopPropagation()
    setTrialOn((v) => {
      const nv = !v
      setPlan(nv ? 'trial' : 'yearly')
      return nv
    })
  }
  return (
    <div className="k8-shell k8-pay">
      <div className="k8-pay-bar">
        <button className="k8-pay-x" aria-label="Close"><X size={18} /></button>
        <button className="k8-pay-restore">Restore</button>
      </div>
      <div className="k8-body k8-pay-body">
        <span className="k8-stars">{[0, 1, 2, 3, 4].map((k) => <Star key={k} size={15} weight="fill" />)}</span>
        <h2 className="k8-pay-head">Small changes, <em>big difference.</em></h2>
        <p className="k8-pay-quote">“It caught my Sunday spiral before I did. Six weeks in, the nights are quieter.”</p>
        <span className="k8-pay-who">Riya · with Kael since May</span>

        <div className="k8-pay-rule" />
        <span className="k8-eyebrow k8-pay-eyebrow">Full access</span>

        <div className="k8-plans">
          <button className="k8-plan k8-plan-trial" data-on={plan === 'trial' || undefined} onClick={pickTrial}>
            <div className="k8-plan-row">
              <div className="k8-plan-l">
                <span className="k8-plan-name">3 days free</span>
                <span className="k8-plan-sub">then $7.99 a week</span>
              </div>
              <span className="k8-plan-check"><Check size={12} weight="bold" /></span>
            </div>
            <div className="k8-plan-row k8-plan-toggle-row">
              <span className="k8-plan-toggle-label">Free trial enabled</span>
              <span
                className="ka-toggle"
                data-on={trialOn || undefined}
                role="switch"
                aria-checked={trialOn}
                onClick={toggleTrial}
              ><span /></span>
            </div>
          </button>
          <button className="k8-plan" data-on={plan === 'yearly' || undefined} onClick={() => { setPlan('yearly'); setTrialOn(false) }}>
            <div className="k8-plan-l">
              <span className="k8-plan-name">Yearly<i className="k8-plan-tag">Best value</i></span>
              <span className="k8-plan-sub">$1.15 a week, billed once</span>
            </div>
            <div className="k8-plan-r"><b>$59.99</b><span>/year</span></div>
          </button>
          <button className="k8-plan" data-on={plan === 'life' || undefined} onClick={() => { setPlan('life'); setTrialOn(false) }}>
            <div className="k8-plan-l">
              <span className="k8-plan-name">Lifetime</span>
              <span className="k8-plan-sub">One payment, yours for good</span>
            </div>
            <div className="k8-plan-r"><b>$99.99</b><span>once</span></div>
          </button>
        </div>
      </div>
      <footer className="k8-foot">
        <button className="ov-cta">{plan === 'trial' ? 'Continue with 3 days free' : 'Continue'}</button>
        <p className="k8-pay-fine">
          {plan === 'trial' ? 'Billed weekly after the trial. Auto renewable, cancel anytime.'
            : plan === 'yearly' ? 'Billed yearly. Auto renewable, cancel anytime.'
              : 'One payment, yours for good.'}
        </p>
        <div className="k8-pay-links"><button>Terms of Service</button><i>·</i><button>Privacy Policy</button></div>
      </footer>
    </div>
  )
}

const STEPS = ['Kael is ready', 'Difference', 'Promise', 'Moment', 'Paywall']

export default function CloseV8() {
  const [step, setStep] = useState(0)
  const next = () => setStep((s) => Math.min(STEPS.length - 1, s + 1))
  return (
    <div className="lib-page ov-page k8-page">
      <div className="k8-nav">
        {STEPS.map((s, k) => (
          <button key={s} className="k8-nav-chip" data-on={step === k || undefined} onClick={() => setStep(k)}>{s}</button>
        ))}
      </div>
      <div className="ov-stage">
        <div className="ov-screen k8-screen" data-theme="light">
          <div className="k8-flow" key={step}>
            {step === 0 && <Ready onNext={next} />}
            {step === 1 && <Difference onNext={next} />}
            {step === 2 && <Promise_ onNext={next} />}
            {step === 3 && <Moment onNext={next} />}
            {step === 4 && <Paywall />}
          </div>
        </div>
      </div>
    </div>
  )
}
