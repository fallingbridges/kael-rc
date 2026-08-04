import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  ArrowLeft, Check, X, Sparkle, Star, Sun, CloudRain,
  Leaf, Waves, Mountains, Phone, Moon, Heart, ShieldCheck,
  Compass, Fingerprint, Spiral, Smiley, SmileySad, Medal, PenNib, Tag, BellSimple,
  LockSimpleOpen, Crown, Plant, MagnifyingGlass, Eye, Feather,
  FlowerLotus, Robot, NotePencil, Armchair, ChatsCircle, Brain,
  AppleLogo, GoogleLogo, EnvelopeSimple, LockSimple, UserCirclePlus,
} from '@phosphor-icons/react'

/* ──────────────────────────────────────────────────────────────────────────
   Pre-paywall flow — the bridge from the read to Superwall, on V7's design
   language. One idea per screen, a handful of words each, all of it generic
   (nothing derived from the quiz — only the name). Order: trust → goal →
   difference → mechanism → ready → promise → all set → the 30 days, then
   Superwall takes the actual paywall.
   ────────────────────────────────────────────────────────────────────────── */

const NAME = 'Maya'
const SCREENS = ['therapist', 'goal', 'difference', 'mechanism', 'promise', 'allset', 'why', 'how', 'tonight', 'offer', 'signup', 'decline', 'saved']

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
  const showFooter = !['therapist', 'goal', 'promise', 'offer', 'signup', 'decline', 'saved'].includes(kind) // these advance themselves or own their CTA
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
    case 'promise': return <PromiseBody name={NAME} onSigned={(v) => set('signed', v)} onNext={onNext} />
    case 'allset': return <AllSetBody name={NAME} />
    case 'why': return <WhyBody />
    case 'how': return <HowBody />
    case 'tonight': return <TonightBody name={NAME} why="I can’t stop overthinking" />
    case 'offer': return <OfferBody onNext={onNext} />
    case 'signup': return <SignupBody onNext={onNext} />
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
        <h1 className="ov4-q">How much time will you give yourself?</h1>
        <p className="ov4-sub">Pick a pace you can keep, even on the bad days.</p>
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
export function MechanismBody({ coda = 'Every reflection helps Kael understand you better.', mark = false }) {
  return (
    <div className="pp2 pp2-c">
      {mark && <span className="ov4-badge"><Feather size={26} weight="duotone" /></span>}
      <h1 className="pp2-title pp2-title-lg">A private space to<br /><em>reflect</em> on your life.</h1>
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
      {coda && <p className="pp2-coda">{coda}</p>}
    </div>
  )
}

/* 5 · the promise — a quiet contract, sealed Headway-style: the thumb lives
   in a bottom panel, and while it is held an ink blanket sweeps up over the
   whole screen. Complete the hold and the flow moves on by itself. */
export function PromiseBody({ name = NAME, onSigned, onNext }) {
  const [signed, setSigned] = useState(false)
  const [holding, setHolding] = useState(false)
  const [att, setAtt] = useState(0)
  const rootRef = useRef(null)
  const [screenEl, setScreenEl] = useState(null)
  const advRef = useRef(null)

  useEffect(() => {
    onSigned?.(false) // a fresh promise on every visit — never pre-signed
    setScreenEl(rootRef.current?.closest('.ov-screen') || null)
    return () => clearTimeout(advRef.current)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const start = (e) => { e.preventDefault(); if (signed) return; try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* hold works uncaptured */ } setHolding(true) }
  const stop = () => { if (holding && !signed) { setHolding(false); setAtt((a) => a + 1) } }
  const done = () => {
    setHolding(false); setSigned(true); onSigned?.(true)
    advRef.current = setTimeout(() => onNext?.(), 1200)
  }

  /* blanket + thumb live in a portal on .ov-screen so they can cover the
     head and foot too; the thumb never remounts, so the held pointer stays
     captured while the blanket rises beneath it */
  const overlay = (
    <>
      <div className={`pp2-blanket${holding ? ' on' : ''}${signed ? ' done' : ''}`} aria-hidden="true">
        {signed && <span className="pp2-blanket-check"><Check size={28} weight="bold" /></span>}
        <p className="pp2-blanket-t">{signed ? 'Promise sealed.' : 'Sealing your promise…'}</p>
      </div>
      <button
        type="button"
        className={`pp2-hold${holding ? ' is-holding' : ''}${signed ? ' is-signed' : ''}`}
        onPointerDown={start} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop}
        onContextMenu={(e) => e.preventDefault()}
        aria-label="Press and hold to commit"
      >
        <svg className="pp2-hold-ringbox" viewBox="0 0 100 100" aria-hidden="true">
          <circle className="pp2-hold-track" cx="50" cy="50" r="46" />
          <circle key={att} className="pp2-hold-ring" cx="50" cy="50" r="46" pathLength="1" onAnimationEnd={done} />
        </svg>
        <Fingerprint size={46} weight="light" />
      </button>
    </>
  )

  return (
    <div className="pp2 pp2-c pp2-promise" ref={rootRef}>
      <span className="ov4-badge"><PenNib size={26} weight="duotone" /></span>
      <span className="ov4-kicker">A quiet contract</span>
      <h1 className="pp2-title">{name ? `${name}, let’s make ` : 'Let’s make '}<em>a promise.</em></h1>
      <div className="pp2-doc">
        <p className="pp2-doc-lead">From today, I promise to</p>
        <div className="pp2-vows">
          {VOWS.map((v) => (<span className="pp2-vow" key={v}><Check size={13} weight="bold" />{v}</span>))}
        </div>
        <p className="pp2-pact"><b>And Kael promises back.</b> <em>To remember, to notice, to be there at 2am.</em></p>
      </div>
      <div className="pp2-commit">
        <span className="pp2-commit-stars" aria-hidden="true">
          <Sparkle size={13} weight="fill" style={{ left: '8%', top: 26 }} />
          <Sparkle size={7} weight="fill" style={{ left: '15%', top: 54 }} />
          <Sparkle size={14} weight="fill" style={{ right: '7%', top: 46 }} />
          <Sparkle size={8} weight="fill" style={{ right: '14%', top: 20 }} />
        </span>
        <p className="pp2-commit-hint"><b>Press and hold to commit.</b>A promise made slowly is kept longer.</p>
      </div>
      {screenEl && createPortal(overlay, screenEl)}
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
export function AllSetBody({ name = '' }) {
  /* the title streams in after the stamp; the ceremony plays once and then
     holds — the user leaves on their own Continue, not a timer */
  const full = name ? `Great job, ${name}.` : 'Great job.'
  const [n, setN] = useState(0)
  useEffect(() => {
    let i = 0, iv
    const t = setTimeout(() => {
      iv = setInterval(() => { i += 1; setN(i); if (i >= full.length) clearInterval(iv) }, 48)
    }, 1250)
    return () => { clearTimeout(t); clearInterval(iv) }
  }, [full])
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
        <span className="pp2-seal-core"><Medal size={30} weight="fill" /></span>
      </span>
      <h1 className="pp2-title pp2-allset-title">{full.slice(0, n)}{n > 0 && n < full.length && <span className="pp2-caret" />}</h1>
      <p className="pp2-allset-sub">A pattern named. A promise signed.<br />Kael holds all of it.</p>
    </div>
  )
}

/* 8 · the road ahead — the projection handoff: milestone dots on the curve,
   then the same four days as words. No read-back of the quiz (the receipt
   already happened); the screen only points forward, and day 1 starts it. */
const MILES = [
  { d: 'Today', t: 'Bring Kael what’s on your mind' },
  { d: 'Day 3', t: 'Kael starts catching your loops' },
  { d: 'Day 7', t: 'Your first shift, and you feel it' },
  { d: 'Day 30', t: 'The old reflex stops running the show' },
]
const PTS = [[24, 122], [124, 108], [224, 64], [316, 26]]
/* Why Kael and not the others. The user standing here has already tried
   things; naming them honestly is the credibility, and the answer is the
   one property none of them have: it listens AND remembers. */
export function WhyBody() {
  /* pure typography: four quiet epitaphs, then the claim in display type.
     No cards, no icons, no gadgets. The gravity is the argument. */
  const OTHERS = [
    'A meditation app plays you a track.',
    'A chatbot forgets you by morning.',
    'A journal never answers.',
    'A therapist can see you Thursday, maybe.',
  ]
  return (
    <div className="pp2 pp2-c pp2-why">
      <span className="ov4-kicker">Why Kael</span>
      <h1 className="pp2-title">You’ve probably<br />tried the others.</h1>
      <div className="pp2-lad">
        {OTHERS.map((t, k) => <p key={k} style={{ '--d': `${0.12 * k + 0.25}s` }}>{t}</p>)}
      </div>
      <p className="pp2-lad-turn">Kael listens,<br />and Kael remembers.</p>
      <p className="pp2-lad-sub">Every session picks up exactly where your life left off.</p>
    </div>
  )
}

/* removed: the miniature-vignette version read as a toy */
export function HowBody() {
  const MOVES = [
    { n: '1', t: 'You talk.', s: 'Two minutes mid-spiral, or twenty on a Sunday. Kael asks, you answer.' },
    { n: '2', t: 'Kael remembers.', s: 'Your pattern, your people, your own words. Nothing re-explained, ever.' },
    { n: '3', t: 'The loop gets caught.', s: 'Not named after. Caught during. That is the part that changes you.' },
  ]
  return (
    <div className="pp2 pp2-c pp2-how">
      <span className="ov4-kicker">How it works</span>
      <h1 className="pp2-title">Three moves.</h1>
      <div className="pp2-moves">
        {MOVES.map((m, k) => (
          <div key={m.n} className="pp2-move" style={{ '--d': `${0.14 * k + 0.25}s` }}>
            <span className="pp2-move-n">{m.n}</span>
            <div className="pp2-move-t">
              <b>{m.t}</b>
              <p>{m.s}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* What happens the second they pay: tonight, concretely, in their own
   words. No program, no streak, nothing to fail. */
export function TonightBody({ name = '', why, pattern, glyph: Glyph }) {
  /* the product is sessions, so the proof of immediacy is a session: the
     first page of Session One, already written, in their words. */
  const trim = (t = '') => {
    const v = String(t).trim()
    return v.length > 44 ? `${v.slice(0, 44).replace(/\s+\S*$/, '')}…` : v
  }
  return (
    <div className="pp2 pp2-c pp2-road">
      <span className="ov4-kicker">Then tonight</span>
      <h1 className="pp2-title">Your first session<br />is already open{name ? `, ${name}` : ''}.</h1>

      <div className="pp2-sesh">
        <div className="pp2-sesh-head">
          <span className="pp2-sesh-k">Session One · Tonight</span>
          {Glyph && <span className="pp2-sesh-g"><Glyph size={16} weight="duotone" /></span>}
        </div>
        <p className="pp2-sesh-line">
          {why ? `You told me “${trim(why).toLowerCase()}.” That is where we begin.` : 'You already told me where it hurts. That is where we begin.'}
        </p>
        <span className="pp2-sesh-sign">— Kael</span>
      </div>

      <p className="pp2-coda">No streak to keep, nothing to fail. Two minutes on a bad day counts double.</p>
    </div>
  )
}

export function JourneyBody({ name = '', why, pattern, glyph: Glyph, goals }) {
  /* The road-ahead graph is gone on purpose: two fabricated curves with axis
     labels read as fake data, and every quiz-funnel app shows the same one.
     What convinces is a preview, not a promise: the product doing its job
     tonight, addressed to this person's pattern, followed by the first week
     day by day. The trial decision is a 7-day decision, so day 7 gets named
     honestly, reminder included. */
  const trim = (t = '') => {
    const v = String(t).trim()
    return v.length > 44 ? `${v.slice(0, 44).replace(/\s+\S*$/, '')}…` : v
  }
  const week = [
    {
      d: 'Tonight',
      t: 'Your first real session',
      s: why ? `Kael already knows where to start: “${trim(why).toLowerCase()}”` : 'Kael already knows where to start. You just told it.',
    },
    {
      d: 'Tomorrow',
      t: 'It picks up where you left off',
      s: 'The next session opens with what you told it tonight. Nothing to re-explain.',
    },
    {
      d: 'Day 3',
      t: 'The first catch',
      s: 'You open a session mid-spiral, and Kael names the loop while it is still running.',
    },
    {
      d: 'Day 7',
      t: 'You decide',
      s: goals
        ? `A week of sessions saved, pointed at ${goals}. Kael reminds you before the trial ends.`
        : 'A week of sessions saved. Kael reminds you before the trial ends.',
    },
  ]
  return (
    <div className="pp2 pp2-c pp2-road">
      <span className="ov4-kicker">What happens next</span>
      <h1 className="pp2-title">Your first week{name ? `, ${name}` : ''}.</h1>

      <div className="pp2-night" role="img" aria-label="A preview of tonight's check-in from Kael">
        <span className="pp2-night-time">9:30</span>
        <span className="pp2-night-day">Tonight</span>
        <div className="pp2-notif">
          <span className="pp2-notif-ic">{Glyph ? <Glyph size={19} weight="duotone" /> : <Sparkle size={17} weight="fill" />}</span>
          <div className="pp2-notif-t">
            <div className="pp2-notif-row"><b>Kael</b><span>now</span></div>
            <p>{pattern ? `${pattern} has had a long day. Two minutes before it follows you to bed?` : 'Long day. Two minutes before it follows you to bed?'}</p>
          </div>
        </div>
      </div>
      <p className="pp2-notif-cap">Written for your pattern, at the hour it usually bites.</p>

      <div className="pp2-week">
        {week.map((m, k) => (
          <div key={m.d} className="pp2-wk" style={{ '--d': `${0.12 * k + 0.35}s` }}>
            <span className="pp2-wk-day">{m.d}</span>
            <div className="pp2-wk-t">
              <b>{m.t}</b>
              <p>{m.s}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="pp2-coda">Day 30 is not a different you. It is the same loop, no longer in charge.</p>
    </div>
  )
}

/* 9 · the offer — the honest itinerary: how the trial works on a big gold
   rail, the full terms in display type, the exit stated, plans one tap away. */
export function OfferBody({ onNext, onPlans }) {
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
        <p className="pp2-trust"><ShieldCheck size={15} weight="fill" />No commitment. Cancel anytime.</p>
        <button className="ov-cta" onClick={onNext}>Start my free week</button>
        <div className="pp2-legal"><button>Restore</button><button>Terms</button><button>Privacy</button></div>
      </div>
    </div>
  )
}

/* 9b · signup — right after the paywall. The account is not bureaucracy, it is
   how tonight becomes permanent: the pattern, the promise, every word they
   trusted Kael with. Loss framed warmly; the buttons do the rest. */
export function SignupBody({ onNext }) {
  const AUTHS = [
    { Icon: AppleLogo, w: 'fill', label: 'Continue with Apple', dark: true },
    { Icon: GoogleLogo, w: 'bold', label: 'Continue with Google' },
    { Icon: EnvelopeSimple, w: 'regular', label: 'Continue with email' },
  ]
  return (
    <div className="pp2 pp2-c pp2-signup">
      <span className="ov4-badge"><UserCirclePlus size={26} weight="duotone" /></span>
      <span className="ov4-kicker">Yours to keep</span>
      <h1 className="pp2-title">Save what<br />you’ve started.</h1>
      <p className="tp-sub">Your pattern, your promise, every word you’ve trusted Kael with. An account keeps it all safe, and keeps it yours.</p>
      <div className="pp2-auth">
        {AUTHS.map((a, k) => (
          <button key={a.label} className={`pp2-auth-btn${a.dark ? ' pp2-auth-dark' : ''}`} style={{ '--d': `${0.1 * k + 0.3}s` }} onClick={onNext}>
            <a.Icon size={18} weight={a.w} />{a.label}
          </button>
        ))}
      </div>
      <p className="pp2-auth-note"><LockSimple size={13} weight="fill" />Locked to you. Never shared, never sold.</p>
    </div>
  )
}

/* 10 · the decline catch — the price is the copy. One real discount stated in
   its kindest form, two words of scarcity, nothing else. Fires once. */
export function DeclineBody({ onNext }) {
  return (
    <div className="pp2 pp2-c pp2-offer pp2-decline">
      <span className="ov4-badge"><Tag size={26} weight="duotone" /></span>
      <span className="ov4-kicker">One-time offer</span>
      <h1 className="pp2-decl-price">$5 a month.</h1>
      <span className="pp2-freepill">77% less than the weekly plan</span>
      <p className="pp2-decl-bill">Billed $59.99 a year · was <s>$69.99</s></p>
      <div className="pp2-offer-foot">
        <p className="pp2-trust"><ShieldCheck size={15} weight="fill" />Still 7 days free. Cancel anytime</p>
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
