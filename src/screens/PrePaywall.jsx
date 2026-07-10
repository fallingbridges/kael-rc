import { useState, useRef, useEffect } from 'react'
import {
  ArrowLeft, Check, X, Sparkle, Sun, CloudRain,
  Leaf, Waves, Mountains, Phone, Moon, Heart,
} from '@phosphor-icons/react'

/* ──────────────────────────────────────────────────────────────────────────
   Pre-paywall flow — the bridge from the read to Superwall, on V7's design
   language. One idea per screen, a handful of words each, all of it generic
   (nothing derived from the quiz — only the name). Order: trust → goal →
   difference → mechanism → ready → promise → all set → the 30 days, then
   Superwall takes the actual paywall.
   ────────────────────────────────────────────────────────────────────────── */

const NAME = 'Maya'
const SCREENS = ['therapist', 'goal', 'difference', 'mechanism', 'promise', 'allset', 'journey', 'offer', 'decline', 'saved']

/* each tier pairs the minutes with what they buy — the commitment sells its outcome */
const GOALS = [
  { min: '3 min/day', out: 'A gentle start', Icon: Leaf },
  { min: '5 min/day', out: 'Build the habit', Icon: Sparkle },
  { min: '10 min/day', out: 'Go deeper', Icon: Waves },
  { min: '15+ min/day', out: 'Shift the pattern', Icon: Mountains },
]

/* difference — short and universal, no quiz echoes */
const NOW = ['Racing thoughts', 'Heavy mornings', 'Harsh self-talk', 'Bottled up']
const WITH = ['A settled mind', 'Steadier days', 'A kinder voice', 'Room to feel']

/* vows are about the inner work, not about using the product */
const VOWS = ['Be honest about what I’m feeling', 'Face the hard stuff instead of burying it', 'Be kinder to myself along the way']

/* the 30 days — the handoff: a projection chart (the gap is the product) over
   milestone rows. Honestly framed as a path, never as fake measurement — the
   "On your own" line still rises, there are no invented percentages. */
const MILES = [
  { d: 'Today', t: 'Bring Kael what’s on your mind' },
  { d: 'Day 3', t: 'Kael starts catching your loops' },
  { d: 'Day 7', t: 'Your first shift, and you feel it' },
  { d: 'Day 30', t: 'The old reflex stops running the show' },
]

export default function PrePaywall({ noanim = false }) {
  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  const [ans, setAns] = useState({})
  const total = SCREENS.length
  const kind = SCREENS[i]
  const advanceRef = useRef(null)
  const go = (n) => { const t = Math.max(0, Math.min(total - 1, n)); setDir(t >= i ? 1 : -1); setI(t) }
  const next = () => go(i >= total - 1 ? 0 : i + 1)
  const back = () => go(i - 1)
  const set = (k, v) => setAns((p) => ({ ...p, [k]: v }))
  /* V7's auto-advance: commit the pick, then step forward after a short beat */
  const pickAuto = (field, v, beat = 340) => {
    set(field, v)
    clearTimeout(advanceRef.current)
    advanceRef.current = setTimeout(() => setI((st) => Math.min(total - 1, st + 1)), beat)
  }
  useEffect(() => { clearTimeout(advanceRef.current) }, [i])
  useEffect(() => () => clearTimeout(advanceRef.current), [])

  const ctaLabel = kind === 'difference' ? 'I want that' : kind === 'promise' ? 'I commit to myself' : kind === 'journey' ? 'I’m ready' : 'Continue'
  const showFooter = !['therapist', 'goal', 'allset', 'offer', 'decline', 'saved'].includes(kind) // these advance themselves or own their CTA
  const ready = kind === 'goal' ? Boolean(ans.goal)
    : kind === 'promise' ? Boolean(ans.signed) : true

  return (
    <div className={`lib-page ov-page ov4-page ov6-page ov7-page${noanim ? ' ov-noanim' : ''}`}>
      <div className="ob-devbar">
        <span className="ob-dev-title">Pre-paywall · {i + 1}/{total} · {kind}</span>
        <div className="ob-dev-controls">
          <button className="ob-dev-btn" onClick={() => go(i - 1)} disabled={i === 0}>Prev</button>
          <button className="ob-dev-btn" onClick={() => go(i + 1)} disabled={i === total - 1}>Next</button>
          <select className="ob-dev-jump" value={i} onChange={(e) => go(Number(e.target.value))}>
            {SCREENS.map((sc, idx) => (<option key={sc} value={idx}>{idx + 1}. {sc}</option>))}
          </select>
        </div>
      </div>

      <div className="ov-stage">
        <div className="ov-screen ov4-screen" data-theme="light">
          <header className="ov-head">
            <div className="ov-head-row">
              <button className="ov-back" data-hide={i === 0 || undefined} onClick={back} aria-label="Back"><ArrowLeft size={20} /></button>
              {kind === 'offer' && <button className="ov-back ov-x" onClick={next} aria-label="Close"><X size={20} /></button>}
            </div>
          </header>

          <div className="ov-body">
            <div key={i} data-dir={dir} className="ov-flow ov4-flow">
              <Screen kind={kind} ans={ans} set={set} pickAuto={pickAuto} onNext={next} />
            </div>
          </div>

          {showFooter && (
            <footer className="ov-foot">
              <button className="ov-cta" onClick={next} disabled={!ready}>{ctaLabel}</button>
            </footer>
          )}
        </div>
      </div>
    </div>
  )
}

function Screen({ kind, ans, set, pickAuto, onNext }) {
  switch (kind) {
    case 'therapist': return <Therapist ans={ans} pickAuto={pickAuto} />
    case 'goal': return <Goal ans={ans} pickAuto={pickAuto} />
    case 'difference': return <DifferenceBody />
    case 'mechanism': return <MechanismBody />
    case 'promise': return <PromiseBody name={NAME} onSigned={(v) => set('signed', v)} />
    case 'allset': return <AllSetBody onDone={onNext} />
    case 'journey': return <JourneyBody name={NAME} />
    case 'offer': return <OfferBody onNext={onNext} />
    case 'decline': return <DeclineBody onNext={onNext} />
    case 'saved': return <SavedBody onNext={onNext} />
    default: return null
  }
}

/* 1 · trust — V7 pattern: stacked cards, tap auto-advances */
function Therapist({ ans, pickAuto }) {
  const sel = ans.therapist
  return (
    <>
      <div className="ov4-titles">
        <h1 className="ov4-q">Did you hear about Kael from a therapist?</h1>
        <p className="ov4-sub">Either way, you’re in the right place.</p>
      </div>
      <div className="ov4-list" data-locked={Boolean(sel) || undefined}>
        {['Yes', 'No'].map((o, n) => (
          <button key={o} className="ov4-card ov4-card-sm" data-on={sel === o || undefined} data-committed={sel === o || undefined}
            style={{ '--d': `${0.05 * n + 0.06}s` }} onClick={() => pickAuto('therapist', o)}>
            <span className="ov4-card-name">{o}</span>
            <span className="ov4-card-check"><Check size={12} weight="bold" /></span>
          </button>
        ))}
      </div>
    </>
  )
}

/* 2 · daily goal — top-aligned like the V7 quiz; picking auto-advances */
function Goal({ ans, pickAuto }) {
  return (
    <>
      <div className="ov4-titles">
        <h1 className="ov4-q">Set your daily goal.</h1>
        <p className="ov4-sub">A few honest minutes is enough.</p>
      </div>
      <GoalTiers value={ans.goal} onPick={(v) => pickAuto('goal', v)} />
    </>
  )
}

/* the daily-time tiers — minutes paired with the outcome they buy (shared with V7) */
export function GoalTiers({ value, onPick }) {
  return (
    <div className="ov4-list">
      {GOALS.map((g, n) => (
        <button key={g.min} className="pp2-tier" data-on={value === g.min || undefined}
          style={{ '--d': `${0.05 * n + 0.06}s` }} onClick={() => onPick(g.min)}>
          <span className="pp2-tier-ic"><g.Icon size={19} weight="duotone" /></span>
          <b className="pp2-tier-min">{g.min}</b>
          <span className="pp2-tier-out">{g.out}</span>
          <span className="ov4-card-check"><Check size={12} weight="bold" /></span>
        </button>
      ))}
    </div>
  )
}

/* 3 · the difference — Now, small and low; With Kael, large and raised on top */
export function DifferenceBody() {
  return (
    <div className="pp2 pp2-c">
      <span className="ov4-kicker">The difference</span>
      <h1 className="pp2-title">See the difference<br /><em>with Kael.</em></h1>
      <div className="pp2-vs">
        <div className="pp2-now">
          <div className="pp2-vs-head"><CloudRain size={17} weight="duotone" /><h3>Now</h3></div>
          <ul className="pp2-vs-list">
            {NOW.map((l, n) => (<li key={l} style={{ '--d': `${0.05 * n + 0.24}s` }}><X size={11} weight="bold" />{l}</li>))}
          </ul>
        </div>
        <div className="pp2-withk">
          <div className="pp2-vs-head"><Sun size={19} weight="duotone" /><h3>With Kael</h3></div>
          <ul className="pp2-vs-list">
            {WITH.map((l, n) => (<li key={l} style={{ '--d': `${0.05 * n + 0.34}s` }}><Check size={12} weight="bold" />{l}</li>))}
          </ul>
          <div className="pp2-vs-goal"><Sparkle size={12} weight="fill" />A calmer mind</div>
        </div>
      </div>
      <p className="pp2-vs-note">Same days. A different way through.</p>
    </div>
  )
}

/* 4 · mechanism — one sentence with the proof inside it: the title claims,
   real reflection cards cascade in as evidence, the coda finishes the thought. */
export function MechanismBody() {
  return (
    <div className="pp2 pp2-c">
      <h1 className="pp2-title pp2-title-lg">Your safe space to<br /><em>reflect</em> on your life.</h1>
      <p className="pp2-sub pp2-sub-nar">Big feelings, small thoughts, hard days, quiet wins. It all belongs here.</p>
      <div className="pp2-lib" aria-hidden="true">
        <span className="pp2-lib-label">Your reflections</span>
        {[
          { t: 'The call I keep putting off', Icon: Phone },
          { t: 'Sunday nights feel heavy', Icon: Moon },
          { t: 'Why do I push people away?', Icon: Heart },
        ].map((m, k) => (
          <div key={m.t} className="pp2-lib-row" style={{ '--d': `${0.34 * k + 0.25}s` }}>
            <span className="pp2-mini-av"><m.Icon size={15} weight="duotone" /></span>
            <span className="pp2-mini-lines">
              <b className="pp2-mini-t">{m.t}</b>
              <i style={{ width: `${58 - k * 8}%` }} />
            </span>
          </div>
        ))}
      </div>
      <p className="pp2-coda">Every reflection helps Kael understand you better.</p>
    </div>
  )
}

/* 5 · the promise — a quiet contract, signed big; onSigned reports up so the
   host flow can gate its CTA on a real signature */
export function PromiseBody({ name = NAME, onSigned }) {
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
    onSigned?.(false) // the box starts blank on every visit — an empty box always needs a fresh signature
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const pos = (e) => { const r = canvasRef.current.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top } }
  const down = (e) => { e.preventDefault(); canvasRef.current.setPointerCapture(e.pointerId); drawing.current = true; last.current = pos(e) }
  const move = (e) => {
    if (!drawing.current) return
    const p = pos(e)
    const ctx = canvasRef.current.getContext('2d')
    ctx.beginPath(); ctx.moveTo(last.current.x, last.current.y); ctx.lineTo(p.x, p.y); ctx.stroke()
    last.current = p
    if (!signed) { setSigned(true); onSigned?.(true) }
  }
  const up = () => { drawing.current = false }
  const clear = () => { const c = canvasRef.current; c.getContext('2d').clearRect(0, 0, c.width, c.height); setSigned(false); onSigned?.(false) }

  return (
    <div className="pp2 pp2-c">
      <h1 className="pp2-title">{name ? `${name}, let’s make ` : 'Let’s make '}<em>a promise.</em></h1>
      <div className="pp2-doc">
        <p className="pp2-doc-lead">From today, I promise to</p>
        <div className="pp2-vows">
          {VOWS.map((v) => (<span className="pp2-vow" key={v}><Check size={13} weight="bold" />{v}</span>))}
        </div>
        <p className="pp2-pact"><b>And Kael promises back.</b> <em>To remember, to notice, to be there at 2am.</em></p>
        <div className="pp2-signwrap">
          <div className="pp2-sigbox">
            <canvas ref={canvasRef} className="pp2-pad" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up} />
            {!signed && <span className="pp2-pad-hint">Sign with your finger</span>}
            {signed && <button className="pp2-pad-clear" onClick={clear} aria-label="Clear signature"><X size={12} weight="bold" /></button>}
          </div>
          <span className="pp2-sig-cap">{name || 'You'}</span>
        </div>
      </div>
      <p className="pp2-note">Your signature stays on this screen. Nothing is saved.</p>
    </div>
  )
}

/* 7 · you're all set — the ceremony: seal stamps in, gold bloom, a one-time
   radial burst from under the seal, rings ripple out, a sparse drift settles.
   Deterministic pieces, plays once; stillness after, not a loop. */
const CONF = ['var(--warm-proof)', 'var(--warm-react)', 'var(--mood-calm)', 'var(--badge-ink)']
const BURST = Array.from({ length: 26 }, (_, k) => {
  const a = (k / 26) * Math.PI * 2 + ((k * 47) % 17) / 40
  const dist = 92 + ((k * 53) % 58)
  return {
    tx: Math.round(Math.cos(a) * dist), ty: Math.round(Math.sin(a) * dist * 0.82),
    color: CONF[k % 4], delay: 0.85 + ((k * 13) % 8) / 50, dur: 1.25 + ((k * 29) % 10) / 24,
    rot: (k * 73) % 340, w: 4 + (k % 3) * 2, h: 7 + ((k * 7) % 3) * 2, round: k % 4 === 0,
  }
})
const DRIFT = Array.from({ length: 16 }, (_, k) => ({
  left: (k * 61 + 9) % 100, color: CONF[(k + 1) % 4],
  delay: 1.2 + ((k * 37) % 12) / 9, dur: 3 + ((k * 17) % 9) / 8,
  rot: 140 + ((k * 91) % 260), w: 5 + (k % 2) * 3, h: 5 + ((k * 3) % 3) * 2, round: k % 3 === 0,
}))
export function AllSetBody({ onDone }) {
  /* the title streams in after the stamp; the whole ceremony plays once,
     unhurried, then the flow moves itself — no button to press */
  const full = 'You’re all set!'
  const [n, setN] = useState(0)
  useEffect(() => {
    let i = 0, iv
    const t = setTimeout(() => {
      iv = setInterval(() => { i += 1; setN(i); if (i >= full.length) clearInterval(iv) }, 48)
    }, 1250)
    return () => { clearTimeout(t); clearInterval(iv) }
  }, [full])
  useEffect(() => {
    const t = setTimeout(() => onDone?.(), 4600)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="pp2 pp2-c pp2-allset">
      <div className="pp2-rain" aria-hidden="true">
        {DRIFT.map((p, k) => (
          <span key={k} className="pp2-drop" style={{
            left: `${p.left}%`, background: p.color,
            width: p.round ? p.h : p.w, height: p.h, borderRadius: p.round ? '50%' : '2px',
            animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`, '--rot': `${p.rot}deg`,
          }} />
        ))}
      </div>
      <span className="pp2-seal" aria-hidden="true">
        <span className="pp2-bloom" />
        {BURST.map((p, k) => (
          <span key={k} className="pp2-spark" style={{
            background: p.color, width: p.round ? p.h : p.w, height: p.h, borderRadius: p.round ? '50%' : '2px',
            animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`,
            '--tx': `${p.tx}px`, '--ty': `${p.ty}px`, '--rot': `${p.rot}deg`,
          }} />
        ))}
        <span className="pp2-ripple pp2-ripple-1" />
        <span className="pp2-ripple pp2-ripple-2" />
        <span className="pp2-orb-ring" />
        <span className="pp2-orb-ring pp2-orb-ring2" />
        <span className="pp2-seal-core"><Check size={30} weight="bold" /></span>
      </span>
      <h1 className="pp2-title pp2-allset-title">{full.slice(0, n)}{n > 0 && n < full.length && <span className="pp2-caret" />}</h1>
    </div>
  )
}

/* 8 · the road ahead — the projection chart. The gold line draws itself, the
   shaded gap between "With Kael" and "On your own" is the thing being bought.
   Milestone rows carry the story; the axis only anchors the ends. */
const DOTS = [[20, 150], [120, 128], [220, 78], [320, 36]]
export function JourneyBody({ name = '' }) {
  return (
    <div className="pp2 pp2-c pp2-road">
      <span className="ov4-kicker">The road ahead</span>
      <h1 className="pp2-title">This is where<br />you’re headed{name ? `, ${name}` : ''}.</h1>
      <div className="pp2-chartcard">
        <h3 className="pp2-chart-t">Your path to a calmer, steadier baseline.</h3>
        <svg className="pp2-chart" viewBox="0 0 340 192" aria-hidden="true">
          <path className="pp2-area" d="M20,150 C55,146 90,140 120,128 C155,114 190,96 220,78 C250,62 290,46 320,36 L320,128 C220,138 120,146 20,150 Z" />
          <line className="pp2-ch-base" x1="16" y1="168" x2="324" y2="168" />
          <path className="pp2-ln-own" d="M20,150 C120,146 220,138 320,128" />
          <path className="pp2-ln-kael" pathLength="1" d="M20,150 C55,146 90,140 120,128 C155,114 190,96 220,78 C250,62 290,46 320,36" />
          {DOTS.map(([x, y], k) => (
            <circle key={k} className="pp2-dot" cx={x} cy={y} r={k === 0 ? 5.5 : 4.5} style={{ animationDelay: `${0.35 * k + 0.6}s` }} />
          ))}
          <circle className="pp2-dot pp2-dot-ring" cx="20" cy="150" r="10" style={{ animationDelay: '0.6s' }} />
          <text className="pp2-ch-lab" x="318" y="22" textAnchor="end">With Kael</text>
          <text className="pp2-ch-lab pp2-ch-lab-own" x="318" y="116" textAnchor="end">On your own</text>
          <text className="pp2-ch-axis" x="20" y="186" textAnchor="start">Today</text>
          <text className="pp2-ch-axis" x="320" y="186" textAnchor="end">Day 30</text>
        </svg>
        <ul className="pp2-miles">
          {MILES.map((m, k) => (
            <li key={m.d} style={{ '--d': `${0.12 * k + 0.5}s` }}>
              <span className="pp2-mile-d">{m.d}</span>
              <span className="pp2-mile-t">{m.t}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="pp2-roadnote"><Sparkle size={12} weight="fill" />Built on CBT and ACT. No guesswork.</p>
    </div>
  )
}

/* 9 · the offer — the minimal close. Copy pulls the weight: a Barnum title
   that names the funnel's real enemy (your own head) and flips it, one
   review as proof, the unfakeable trust line, one price, one button. */
/* the offer — title and review sell, one plain line states the terms, the CTA
   carries the only trial mention. The quietest honest close possible. */
export function OfferBody({ onNext }) {
  return (
    <div className="pp2 pp2-c pp2-offer pp2-paywall">
      <h1 className="pp2-title pp2-title-lg">Your coach,<br />always on your side.</h1>
      {/* the middle zone echoes the signed promise — identical for every user,
          personal because they signed it. Swaps to a real attributed review at ship. */}
      <div className="pp2-review">
        <p>You promised to be honest.<br />Kael promised 2am.</p>
      </div>
      <div className="pp2-offer-foot">
        <p className="pp2-freehead">7 days free</p>
        <p className="pp2-priceline">Then $69.99/year ($5.83/month)</p>
        <button className="ov-cta" onClick={onNext}>Start my 7-day free trial</button>
        <p className="pp2-cancelnote">No charge today · Cancel anytime</p>
        <div className="pp2-legal"><button>Restore</button><button>Terms</button><button>Privacy</button></div>
      </div>
    </div>
  )
}

/* 10 · the decline catch — the emotionally intelligent step down. Names the
   hesitation without shame, lowers the barrier with a real price against the
   real anchor, states finality gently. Fires once; no countdowns, no guilt. */
export function DeclineBody({ onNext }) {
  return (
    <div className="pp2 pp2-c pp2-offer pp2-decline">
      <span className="ov4-kicker">Before you go</span>
      <h1 className="pp2-title pp2-title-lg">A kinder price.</h1>
      <p className="pp2-sub">Same coach, same 30 days.<br />Just less of a leap.</p>
      <div className="pp2-price">
        <s>$69.99</s>
        <b>$59.99<span>/year</span></b>
        <i>That’s $5 a month.</i>
      </div>
      <p className="pp2-once">One time only. If you pass, this price won’t come back.</p>
      <div className="pp2-offer-foot">
        <p className="pp2-trust"><Check size={14} weight="bold" />Still 7 days free. Cancel anytime.</p>
        <button className="ov-cta" onClick={onNext}>Keep this price</button>
        <button className="ov4-quiet" onClick={onNext}>Let it go</button>
      </div>
    </div>
  )
}

/* 11 · the open door — what a declined user lands on. No shame, no re-pitch:
   their read is kept, the way back is one tap. Grace is the retention play. */
export function SavedBody({ onNext }) {
  return (
    <div className="pp2 pp2-c pp2-offer pp2-saved">
      <h1 className="pp2-title pp2-title-lg">Your read is saved.</h1>
      <p className="pp2-sub">Everything you shared stays with Kael, ready whenever you are.</p>
      <span className="pp2-freepill"><Sparkle size={12} weight="fill" />The door stays open</span>
      <div className="pp2-offer-foot">
        <button className="ov-cta" onClick={onNext}>Resume my 30 days</button>
      </div>
    </div>
  )
}
