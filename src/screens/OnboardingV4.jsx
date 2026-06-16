import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft, Check, Sparkle, BellSimple, ShieldCheck, LockKey, Star,
  Heart, HeartStraight, Quotes, Compass,
  Fingerprint, MapTrifold, ChatsCircle, Anchor,
  UsersThree, Waveform, Wind, House, HandHeart, ArrowUpRight,
} from '@phosphor-icons/react'
import {
  FLOW, QUESTIONS, BLOCK_IDS, BLOCKS, SITUATIONS, SITUATION_REFLECT, SIT_PHRASE,
  REL_CONTEXT, AGES, GENDERS, BREATHERS, CALIB_STEPS, CALIB_REVIEWS, QUIZ_EYEBROWS,
  resolveRead, answeredCount,
} from '../obv4.js'

/* ──────────────────────────────────────────────────────────────────────────
   Kael Onboarding V4. Open → quiz (4 thematic segments, breathers on relevant
   questions) → reveal → read in 4 beats (card + chips) → identity → notification
   → sell (scratched-surface → aspiration → benefits → with/without transform) →
   paywall. No tiebreakers (ties resolve silently). V2 design language reused.
   ────────────────────────────────────────────────────────────────────────── */

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n))
const cap = (w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w)
const lines = (str) => (str || '').split('\n')
const AUTO_KINDS = ['two', 'relcontext', 'age', 'gender']

function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i += 1) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) }
  return h >>> 0
}

/* axis bars on the read — human axis name + both pole labels. left = the low-key
   pole, right = the named (POSITIVE) pole; the marker sits at axes[key].pos%. */
const AXIS_META = [
  { key: 'CF', name: 'Closeness', left: 'Free', right: 'Close' },
  { key: 'AS', name: 'Reassurance', left: 'Settled', right: 'Attuned' },
  { key: 'ER', name: 'Expression', left: 'Reserved', right: 'Expressive' },
  { key: 'GH', name: 'Tilt', left: 'Harmony', right: 'Growth' },
]
/* small rotating icon set for the "what you value" chips */
const VALUE_ICONS = [Heart, Anchor, House, Compass, ShieldCheck, Star, HandHeart, Wind]

export default function OnboardingV4({ noanim = false }) {
  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  const [answers, setA] = useState({})
  const seedRef = useRef(String(hash('kael-v4-' + Math.floor(Date.now() / 1e7))))
  const bodyRef = useRef(null)
  const advanceRef = useRef(null)

  const s = FLOW[i] || FLOW[0]
  const total = FLOW.length
  const last = i === total - 1

  const go = (n) => { const t = clamp(n, 0, total - 1); setDir(t >= i ? 1 : -1); setI(t) }
  const next = () => (last ? go(0) : go(i + 1))
  const back = () => go(i - 1)

  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = 0; clearTimeout(advanceRef.current) }, [i])
  useEffect(() => () => clearTimeout(advanceRef.current), [])

  /* skip the free-text screen unless "Something else" was chosen */
  useEffect(() => {
    if (s.kind === 'situationText' && answers.situation !== 'Something else') {
      const t = setTimeout(() => setI((st) => clamp(st + (dir === -1 ? -1 : 1), 0, total - 1)), 0)
      return () => clearTimeout(t)
    }
  }) // eslint-disable-line react-hooks/exhaustive-deps

  const set = (field, v) => setA((p) => ({ ...p, [field]: v }))
  function pickAuto(field, v, beat = 360) {
    set(field, v)
    clearTimeout(advanceRef.current)
    advanceRef.current = setTimeout(() => setI((st) => Math.min(total - 1, st + 1)), beat)
  }

  const revealAt = useMemo(() => FLOW.findIndex((f) => f.kind === 'reveal'), [])
  const resolved = useMemo(() => (i >= revealAt ? resolveRead(answers) : null), [i, revealAt, answers])
  const arch = resolved ? resolved.read : null
  const nm = (answers.name || '').trim()
  const fillSit = (str) => (str || '')
    .replace(/\{SIT\}/g, answers.situationText || SIT_PHRASE[answers.situation] || "what you're carrying")
    .replace(/,?\s*\{name\}/g, nm ? `, ${cap(nm)}` : '')
  const order = (opts, qid) => (hash(seedRef.current + qid) % 2 === 0 ? opts : [opts[1], opts[0]])

  /* chrome */
  const isQuiz = ['two', 'slider', 'statement', 'multi'].includes(s.kind)
  const showHead = !['welcome', 'hero', 'reveal', 'calibration', 'paywall'].includes(s.kind)
  const canBack = i > 0 && s.kind !== 'calibration' && s.kind !== 'paywall'
  /* progress bar derives its blocks from FLOW (via BLOCKS/BLOCK_IDS) so it can never desync from the order */
  const segs = BLOCKS.map((b) => {
    if ((s.block || 0) > b) return { b, fill: 100 }
    if (s.block === b) { const ids = BLOCK_IDS[b] || []; const idx = ids.indexOf(s.qid); return { b, fill: idx < 0 ? 0 : ((idx + 1) / ids.length) * 100 } }
    return { b, fill: 0 }
  })

  /* footer */
  const footerLabel = s.cta || (['reveal', 'slider', 'statement', 'multi'].includes(s.kind) ? 'Continue' : null)
  const ready = (() => {
    if (s.kind === 'name') return nm.length > 0
    if (s.kind === 'situationText') return (answers.situationText || '').trim().length > 0
    if (s.kind === 'multi') return Array.isArray(answers[s.qid]?.picks) && answers[s.qid].picks.length > 0
    if (s.kind === 'situation') return Boolean(answers.situation)
    return true
  })()
  const showFooter = !AUTO_KINDS.concat(['calibration', 'paywall']).includes(s.kind) && Boolean(footerLabel)
  const ctaText = footerLabel

  return (
    <div className={`lib-page ov-page ov4-page${noanim ? ' ov-noanim' : ''}`}>
      <div className="ob-devbar">
        <span className="ob-dev-title">Onboarding V4 · {i + 1}/{total} · {s.id}</span>
        <div className="ob-dev-controls">
          <button className="ob-dev-btn" onClick={() => go(i - 1)} disabled={i === 0}>Prev</button>
          <button className="ob-dev-btn" onClick={() => go(i + 1)} disabled={last}>Next</button>
          <select className="ob-dev-jump" value={i} onChange={(e) => go(Number(e.target.value))}>
            {FLOW.map((sc, idx) => (<option key={idx} value={idx}>{idx + 1}. {sc.id}</option>))}
          </select>
        </div>
      </div>

      <div className="ov-stage">
        <div className="ov-screen ov4-screen" data-theme="light">
          {s.kind === 'paywall' ? (
            <Paywall arch={arch} onClose={next} />
          ) : (
            <>
              {showHead && (
                <header className="ov-head">
                  <div className="ov-head-row">
                    <button className="ov-back" data-hide={!canBack || undefined} onClick={back} aria-label="Back"><ArrowLeft size={20} /></button>
                    {isQuiz && <span className="ov4-eyebrow">{QUIZ_EYEBROWS[s.block] || 'Getting to know you'}</span>}
                  </div>
                  {isQuiz && (
                    <div className="ov4-segbar">
                      {segs.map((g) => (<span key={g.b} className="ov4-seg"><span className="ov4-seg-fill" style={{ width: `${g.fill}%` }} /></span>))}
                    </div>
                  )}
                </header>
              )}

              <div className="ov-body" ref={bodyRef}>
                <div key={i} data-dir={dir} className="ov-flow ov4-flow">
                  <Body
                    s={s} answers={answers} arch={arch} axes={resolved ? resolved.axes : null}
                    nm={nm} set={set} pickAuto={pickAuto}
                    order={order} fillSit={fillSit} onAdvance={next} onBack={back}
                  />
                </div>
              </div>

              {showFooter && (
                <footer className="ov-foot">
                  <button className="ov-cta" onClick={next} disabled={!ready}>{fillSit(ctaText)}</button>
                  {s.kind === 'notif' && s.alt && <button className="ov4-quiet" onClick={next}>{s.alt}</button>}
                </footer>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── dispatch ── */
function Body(props) {
  switch (props.s.kind) {
    case 'welcome': return <Welcome {...props} />
    case 'hero': return <Hero {...props} />
    case 'situation': return <SituationList {...props} />
    case 'situationText': return <SituationText {...props} />
    case 'trust': return <Trust {...props} />
    case 'relcontext': return <CardList {...props} field="rel" items={REL_CONTEXT} />
    case 'prep': return <Prep {...props} />
    case 'two': return <Choice {...props} />
    case 'slider': return <SliderCard {...props} />
    case 'statement': return <StatementSlider {...props} />
    case 'multi': return <MultiCard {...props} />
    case 'breather': return <Breather {...props} />
    case 'calibration': return <Calibration {...props} />
    case 'reveal': return <Reveal {...props} />
    case 'miniread': return <MiniRead {...props} />
    case 'fullread': return <FullRead {...props} />
    case 'name': return <NameField {...props} />
    case 'age': return <CardList {...props} field="age" items={AGES} />
    case 'gender': return <CardList {...props} field="gender" items={GENDERS} />
    case 'notif': return <Notif {...props} />
    case 'ready': return <Ready {...props} />
    case 'thirtydays': return <ThirtyDays {...props} />
    default: return null
  }
}

function Header({ title, sub, fillSit, center }) {
  return (
    <div className={`ov4-titles${center ? ' ov4-center' : ''}`}>
      <h1 className="ov4-q">{lines(fillSit ? fillSit(title) : title).map((l, idx) => (<Fragment key={idx}>{idx > 0 && <br />}{l}</Fragment>))}</h1>
      {sub && <p className="ov4-sub">{fillSit ? fillSit(sub) : sub}</p>}
    </div>
  )
}

/* a phosphor badge (V2 pause look) */
function Badge({ Icon }) { return <span className="ov4-badge"><Icon size={26} weight="duotone" /></span> }

/* italic-emphasis renderer for breather bodies */
function Emph({ body, em }) {
  if (!em || !body.includes(em)) return <>{body}</>
  const [a, b] = body.split(em)
  return <>{a}<em className="ov4-em">{em}</em>{b}</>
}

function Illo({ label = 'Illustration', ratio = '4x3', sm = false }) {
  return (
    <div className={`ov4-illo${sm ? ' ov4-illo-sm' : ''}`} data-ratio={ratio} aria-hidden="true">
      <span className="ov4-illo-ic"><Sparkle size={sm ? 18 : 24} weight="light" /></span>
      <span className="ov4-illo-label">{label}</span>
    </div>
  )
}

/* ── Act 1 ── */
/* italic-emphasis renderer for a single word inside a hero title line */
function emLine(line, em) {
  if (!em || !line.includes(em)) return line
  const [a, b] = line.split(em)
  return <>{a}<em className="ov4-hero-em">{em}</em>{b}</>
}

/* welcome — congratulate + give hope; keeps the illustration to differentiate from the promise */
function Welcome({ s }) {
  return (
    <div className="ov4-hero ov4-welcome">
      <Illo label="Welcome" ratio="1x1" />
      <h1 className="ov4-hero-title">{lines(s.title).map((l, idx) => (<Fragment key={idx}>{idx > 0 && <br />}{l}</Fragment>))}</h1>
      <p className="ov4-hero-sub">{s.sub}</p>
    </div>
  )
}

/* the promise — type-forward (no illustration), with the emphasized word in italic */
function Hero({ s }) {
  return (
    <div className="ov4-hero ov4-hero-type">
      <span className="ov4-hero-kicker">Now, a promise</span>
      <h1 className="ov4-hero-title ov4-hero-title-lg">
        {lines(s.title).map((l, idx) => (<Fragment key={idx}>{idx > 0 && <br />}{s.em ? emLine(l, s.em) : l}</Fragment>))}
      </h1>
      <p className="ov4-hero-sub">{s.sub}</p>
    </div>
  )
}

function SituationList({ s, answers, set, fillSit, onAdvance }) {
  const sel = answers.situation
  const custom = answers.situationText
  const chooseElse = () => { set('situation', 'Something else'); onAdvance() }
  return (
    <>
      <Header title={s.title} sub={s.sub} fillSit={fillSit} />
      <div className="ov4-list">
        {custom && (
          <button className="ov4-card ov4-card-sm" data-on onClick={chooseElse}>
            <span className="ov4-card-ic"><Sparkle size={20} weight="duotone" /></span>
            <span className="ov4-card-name">{custom}</span>
            <span className="ov4-card-check"><Check size={12} weight="bold" /></span>
          </button>
        )}
        {SITUATIONS.map((o, n) => {
          if (o.name === 'Something else') {
            return (
              <button key={o.name} className="ov4-card ov4-card-sm" style={{ '--d': `${0.04 * n + 0.06}s` }} onClick={chooseElse}>
                <span className="ov4-card-ic"><o.icon size={20} weight="duotone" /></span>
                <span className="ov4-card-name">{custom ? 'Say something different' : 'Something else'}</span>
                <span className="ov4-card-go">›</span>
              </button>
            )
          }
          const on = sel === o.name && !custom
          const ack = on ? SITUATION_REFLECT[o.name] : null
          return (
            <Fragment key={o.name}>
              <button className="ov4-card ov4-card-sm" data-on={on || undefined} style={{ '--d': `${0.04 * n + 0.06}s` }} onClick={() => { set('situationText', undefined); set('situation', o.name) }}>
                <span className="ov4-card-ic"><o.icon size={20} weight="duotone" /></span>
                <span className="ov4-card-name">{o.name}</span>
                <span className="ov4-card-check"><Check size={12} weight="bold" /></span>
              </button>
              {ack && <p className="ov4-ack"><Sparkle size={13} weight="fill" />{ack}</p>}
            </Fragment>
          )
        })}
      </div>
    </>
  )
}

function SituationText({ s, answers, set, onBack }) {
  const v = answers.situationText || ''
  return (
    <>
      <Header title={s.title} sub={s.sub} />
      <input className="ov-input ov4-input" value={v} maxLength={50} autoFocus onChange={(e) => set('situationText', e.target.value)} placeholder={s.placeholder} autoComplete="off" spellCheck={false} />
      <span className="ov4-charcount">{v.length}/50</span>
    </>
  )
}

function Trust() {
  return (
    <div className="ov4-pause ov4-trust">
      <Badge Icon={ShieldCheck} />
      <span className="ov4-kicker">Before we start</span>
      <h1 className="ov4-q ov4-pause-title ov4-pause-title-lg">Private, secure,<br />and yours alone.</h1>
      <p className="ov4-sub ov4-pause-sub ov4-pause-sub-lg">No one reads your world but you. Kael is built on attachment theory and real relationship science, never guesswork.</p>
    </div>
  )
}

function Prep({ s }) {
  return (
    <div className="ov4-pause ov4-prep2">
      <Badge Icon={Fingerprint} />
      <span className="ov4-kicker">16 love archetypes</span>
      <h1 className="ov4-q ov4-pause-title ov4-pause-title-lg">{s.title}</h1>
      <p className="ov4-sub ov4-pause-sub ov4-pause-sub-lg">{s.sub}</p>
    </div>
  )
}

function CardList({ s, answers, pickAuto, field, items, fillSit }) {
  const sel = answers[field]
  return (
    <>
      <Header title={s.title} sub={s.sub} fillSit={fillSit} />
      <div className="ov4-list" data-locked={Boolean(sel) || undefined}>
        {items.map((it, n) => {
          const label = typeof it === 'string' ? it : it.name
          const Icon = typeof it === 'object' ? it.icon : null
          return (
            <button key={label} className="ov4-card ov4-card-sm" data-on={sel === label || undefined} data-committed={sel === label || undefined}
              style={{ '--d': `${0.04 * n + 0.06}s` }} onClick={() => pickAuto(field, label, 320)}>
              {Icon && <span className="ov4-card-ic"><Icon size={20} weight="duotone" /></span>}
              <span className="ov4-card-name">{label}</span>
              <span className="ov4-card-check"><Check size={12} weight="bold" /></span>
            </button>
          )
        })}
      </div>
    </>
  )
}

function NameField({ s, answers, set }) {
  return (
    <>
      <Header title={s.title} sub={s.sub} />
      <input className="ov-input ov4-input" value={answers.name || ''} onChange={(e) => set('name', e.target.value)} placeholder={s.placeholder} autoComplete="off" spellCheck={false} />
    </>
  )
}

/* ── Act 2 ── */
function Choice({ s, answers, pickAuto, order }) {
  const q = QUESTIONS[s.qid]
  if (!q) return null
  const sel = answers[s.qid]
  const opts = order(q.options, s.qid)
  return (
    <div className="ov4-choice">
      <h1 className="ov4-q ov4-quiz-q">{q.prompt}</h1>
      <div className="ov4-cards" data-locked={Boolean(sel) || undefined}>
        {opts.map((o, n) => {
          const on = sel && sel.name === o.name
          return (
            <button key={o.name} className="ov4-card" data-on={on || undefined} data-committed={on || undefined}
              style={{ '--d': `${0.07 * n + 0.06}s` }} onClick={() => pickAuto(s.qid, { name: o.name, pole: o.pole }, 420)}>
              <span className="ov4-card-ic ov4-card-ic-lg">{o.icon && <o.icon size={26} weight="duotone" />}</span>
              <span className="ov4-card-name">{o.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function SliderCard({ s, set }) {
  const q = QUESTIONS[s.qid]
  /* always start at the middle; the screen remounts per question (key={i}), so every
     slider resets to center when the user advances to the next one */
  const [val, setVal] = useState(50)
  const onChange = (v) => { setVal(v); set(s.qid, { value: v, pole: v >= 50 ? q.right.pole : q.left.pole }) }
  const LIc = q.left.icon, RIc = q.right.icon
  return (
    <div className="ov4-choice ov4-sliderwrap">
      <h1 className="ov4-q ov4-quiz-q">{q.prompt}</h1>
      <div className="ov4-slider">
        <div className="ov4-slider-row">
          <span className="ov4-slider-end">{LIc && <LIc size={19} weight="duotone" />}{q.left.name}</span>
          <span className="ov4-slider-end ov4-slider-end-r">{q.right.name}{RIc && <RIc size={19} weight="duotone" />}</span>
        </div>
        <div className="ov4-track">
          <span className="ov4-track-fill" style={{ width: `${val}%` }} />
          <span className="ov4-track-thumb" style={{ left: `${val}%` }} />
          <input className="ov4-range" type="range" min="0" max="100" value={val} aria-label={q.prompt} onChange={(e) => onChange(Number(e.target.value))} />
        </div>
        <p className="ov4-slider-hint">Slide toward whichever fits. There's no wrong spot.</p>
      </div>
    </div>
  )
}

/* block 3 · a quoted statement rated on an agreement slider (Exactly me ↔ Not like me) */
function StatementSlider({ s, set }) {
  const q = QUESTIONS[s.qid]
  const [val, setVal] = useState(50)
  const onChange = (v) => { setVal(v); set(s.qid, { value: v, pole: v >= 50 ? q.right.pole : q.left.pole }) }
  return (
    <div className="ov4-choice ov4-sliderwrap ov4-stmtwrap">
      <h1 className="ov4-q ov4-quiz-q">Does this sound like you?</h1>
      <figure className="ov4-stmt">
        <span className="ov4-stmt-mark"><Quotes size={22} weight="fill" /></span>
        <blockquote className="ov4-stmt-text">{q.statement}</blockquote>
      </figure>
      <div className="ov4-slider">
        <div className="ov4-slider-row">
          <span className="ov4-slider-end">{q.left.name}</span>
          <span className="ov4-slider-end ov4-slider-end-r">{q.right.name}</span>
        </div>
        <div className="ov4-track">
          <span className="ov4-track-fill" style={{ width: `${val}%` }} />
          <span className="ov4-track-thumb" style={{ left: `${val}%` }} />
          <input className="ov4-range" type="range" min="0" max="100" value={val} aria-label={q.statement} onChange={(e) => onChange(Number(e.target.value))} />
        </div>
        <p className="ov4-slider-hint">Drag to wherever you land. No wrong answer.</p>
      </div>
    </div>
  )
}

function MultiCard({ s, answers, set }) {
  const q = QUESTIONS[s.qid]
  const picks = (answers[s.qid] && answers[s.qid].picks) || []
  const has = (name) => picks.some((p) => p.name === name)
  const max = q.max || 3
  const full = picks.length >= max
  const toggle = (o) => {
    let np
    if (has(o.name)) np = picks.filter((p) => p.name !== o.name)
    else if (full) return
    else np = [...picks, { name: o.name, pole: o.pole }]
    set(s.qid, { picks: np })
  }
  return (
    <div className="ov4-choice">
      <h1 className="ov4-q ov4-quiz-q">{q.prompt}</h1>
      <p className="ov4-multi-hint">Pick up to {max} · {picks.length} chosen</p>
      <div className="ov4-list">
        {q.options.map((o, n) => {
          const on = has(o.name)
          return (
            <button key={o.name} className="ov4-card ov4-card-sm" data-on={on || undefined} data-dim={(!on && full) || undefined} disabled={!on && full}
              style={{ '--d': `${0.035 * n + 0.06}s` }} onClick={() => toggle(o)}>
              {o.icon && <span className="ov4-card-ic"><o.icon size={19} weight="duotone" /></span>}
              <span className="ov4-card-name">{o.name}</span>
              <span className="ov4-card-check"><Check size={12} weight="bold" /></span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Breather({ s, fillSit }) {
  const b = BREATHERS[s.n] || {}
  return (
    <div className="ov4-pause">
      <Badge Icon={b.icon || Sparkle} />
      {b.kicker && <span className="ov4-kicker">{b.kicker}</span>}
      <h1 className="ov4-q ov4-pause-title">{b.title}</h1>
      <p className="ov4-sub ov4-pause-sub"><Emph body={fillSit(b.body)} em={b.em} /></p>
    </div>
  )
}

/* segmented calibration with rotating reviews + whole-screen percentage */
const MIN_FLOOR = 6600
function Calibration({ onAdvance }) {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const TICK = 40
    const step = (100 * TICK) / MIN_FLOOR
    const iv = setInterval(() => setPct((p) => { const np = p + step; if (np >= 100) clearInterval(iv); return Math.min(100, np) }), TICK)
    const floor = setTimeout(() => onAdvance(), MIN_FLOOR + 320)
    return () => { clearInterval(iv); clearTimeout(floor) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const n = CALIB_STEPS.length
  const stepIdx = Math.min(n - 1, Math.floor((pct / 100) * n))
  return (
    <div className="ov4-calib">
      <div className="ov4-calib-pct">{Math.round(pct)}<span>%</span></div>
      <p className="ov4-calib-now" key={stepIdx}>{CALIB_STEPS[stepIdx]}</p>
      <div className="ov4-calib-list">
        {CALIB_STEPS.map((label, k) => {
          const lo = (k / n) * 100, hi = ((k + 1) / n) * 100
          const local = clamp(((pct - lo) / (hi - lo)) * 100, 0, 100)
          const done = pct >= hi - 0.001
          return (
            <div className="ov4-calib-row" key={k} data-active={(pct >= lo && pct < hi) || undefined} data-done={done || undefined}>
              <div className="ov4-calib-rowtop"><span>{label}</span><b>{done ? <Check size={12} weight="bold" /> : `${Math.round(local)}%`}</b></div>
              <div className="ov4-calib-rowbar"><span style={{ width: `${local}%` }} /></div>
            </div>
          )
        })}
      </div>
      <div className="ov4-calib-review" key={'r' + stepIdx}>
        <span className="ov4-stars">{[0, 1, 2, 3, 4].map((k) => <Star key={k} size={13} weight="fill" />)}</span>
        <p>"{CALIB_REVIEWS[stepIdx % CALIB_REVIEWS.length]}"</p>
      </div>
    </div>
  )
}

/* ── Act 3 ── */
function Reveal({ arch }) {
  if (!arch) return null
  const Glyph = arch.glyph
  return (
    <div className="ov4-reveal">
      <span className="ov4-reveal-label">Your Love Archetype</span>
      <span className="ov4-reveal-glyph"><Glyph size={50} weight="duotone" /></span>
      <h1 className="ov4-reveal-name">{arch.name}</h1>
      <p className="ov4-reveal-essence">{arch.essence}</p>
    </div>
  )
}

/* a labelled axis bar: human axis name, a track, a marker at axes[key].pos%,
   and the side the user lands on emphasized */
function AxisBar({ meta, axis, d }) {
  if (!axis) return null
  const onRight = axis.pos >= 50
  return (
    <div className="ov4-axis" style={{ '--d': `${d}s` }}>
      <span className="ov4-axis-name">{meta.name}</span>
      <div className="ov4-axis-track"><span className="ov4-axis-marker" style={{ left: `${axis.pos}%` }} /></div>
      <div className="ov4-axis-ends">
        <span data-on={!onRight || undefined}>{meta.left}</span>
        <span data-on={onRight || undefined}>{meta.right}</span>
      </div>
    </div>
  )
}

/* a titled section of the read; children supply the section's own visual style */
function Section({ label, className, children }) {
  return (
    <section className={`ov4-sec${className ? ' ' + className : ''}`}>
      <span className="ov4-sec-label">{label}</span>
      {children}
    </section>
  )
}

/* the read — axis bars → a mini prose read → chips for love / values / triggers →
   growth pointers. Each section is styled differently for variety. */
function MiniRead({ arch, axes }) {
  if (!arch) return null
  const b = arch.beats || {}
  const prose = [b.love && b.love.body, b.respond && b.respond.body].filter(Boolean)
  const growth = [arch.aspiration, ...(Array.isArray(arch.compare) ? arch.compare.slice(0, 2).map((c) => c.withKael) : [])].filter(Boolean)
  return (
    <div className="ov4-read ov4-miniread">
      <div className="ov4-beat-arch">
        <span className="ov4-beat-arch-label">Your archetype</span>
        <h2 className="ov4-beat-arch-name">{arch.name}</h2>
      </div>

      {axes && (
        <section className="ov4-axes">
          {AXIS_META.map((m, k) => (<AxisBar key={m.key} meta={m} axis={axes[m.key]} d={0.06 * k + 0.1} />))}
        </section>
      )}

      <section className="ov4-mini">
        {prose.map((p, k) => {
          const m = p.match(/^(.*?[.!?])(\s+)([\s\S]*)$/)
          const lead = m ? m[1] : p
          const rest = m ? m[3] : ''
          const Tag = k === 0 ? 'strong' : 'em' // first beat leads bold, the pivot reads italic
          return (<p key={k}><Tag>{lead}</Tag>{rest ? ' ' + rest : ''}</p>)
        })}
        <span className="ov4-mini-by">— Kael</span>
      </section>

      <Section label="How you love">
        <div className="ov4-tagrow">{(b.love?.chips || []).map((c, k) => (<span key={k} className="ov4-tag">{c}</span>))}</div>
      </Section>

      <Section label="What you value in love">
        <div className="ov4-vchips">
          {(b.value?.chips || []).map((c, k) => {
            const Ic = VALUE_ICONS[k % VALUE_ICONS.length]
            return (<span key={k} className="ov4-vchip"><Ic size={15} weight="duotone" />{c}</span>)
          })}
        </div>
      </Section>

      <Section label="What activates you">
        <div className="ov4-tagrow ov4-tagrow-warm">{(b.triggers?.chips || []).map((c, k) => (<span key={k} className="ov4-tag ov4-tag-warm">{c}</span>))}</div>
      </Section>

      <Section label="What growth looks like for you">
        <ul className="ov4-growth">
          {growth.map((g, k) => (<li key={k} style={{ '--d': `${0.05 * k + 0.1}s` }}><span className="ov4-growth-ic"><ArrowUpRight size={13} weight="bold" /></span>{g}</li>))}
        </ul>
      </Section>
    </div>
  )
}

/* teaser/handoff — the full read lives in the app (not blur-locked; a clean preview) */
function FullRead() {
  const items = [
    { Ic: MapTrifold, t: 'Your pattern, in depth', d: 'The full read, well past the surface.' },
    { Ic: ShieldCheck, t: 'What you protect, and why', d: 'The fear underneath the habit.' },
    { Ic: UsersThree, t: 'Who fits you, who clashes', d: 'Your pull across all sixteen.' },
    { Ic: ArrowUpRight, t: 'The one move that changes it', d: 'Where the growth actually starts.' },
  ]
  return (
    <div className="ov4-read ov4-fullwrap">
      <div className="ov4-beat-arch">
        <span className="ov4-beat-arch-label">The full read</span>
        <h2 className="ov4-beat-arch-name">This was just the surface.</h2>
      </div>
      <div className="ov4-full">
        <ul className="ov4-full-list">
          {items.map((it, k) => (
            <li key={it.t} style={{ '--d': `${0.06 * k + 0.12}s` }}>
              <span className="ov4-full-ic"><it.Ic size={18} weight="duotone" /></span>
              <div className="ov4-full-txt"><b>{it.t}</b><span>{it.d}</span></div>
            </li>
          ))}
        </ul>
        <div className="ov4-full-foot"><LockKey size={14} weight="duotone" />Over 1,000 words, waiting inside Kael</div>
      </div>
    </div>
  )
}

function Notif({ s }) {
  return (
    <div className="ov4-pause">
      <Badge Icon={BellSimple} />
      <span className="ov4-kicker">One small thing</span>
      <h1 className="ov4-q ov4-pause-title">{s.title}</h1>
      <p className="ov4-sub ov4-pause-sub">{s.sub}</p>
    </div>
  )
}

/* ── Act 4 — Kael is ready, the 30-day journey, the paywall ── */
/* a short breather: Kael is calibrated to this archetype, addressed by name */
function Ready({ arch, nm }) {
  if (!arch) return null
  const Glyph = arch.glyph
  return (
    <div className="ov4-pause ov4-ready">
      <span className="ov4-cal-glyph"><Glyph size={30} weight="duotone" /></span>
      <span className="ov4-kicker">Calibrated to you</span>
      <h1 className="ov4-q ov4-pause-title ov4-pause-title-lg">{nm ? `Kael is ready, ${cap(nm)}.` : 'Kael is ready.'}</h1>
      <p className="ov4-sub ov4-pause-sub ov4-pause-sub-lg">Tuned to how you love, what scares you, and the pattern you walked in with. Not a generic coach. Yours.</p>
    </div>
  )
}

/* a warm editorial timeline — the relationship journey, not a habit tracker */
const JOURNEY = [
  { when: 'Today', Ic: ChatsCircle, t: "Bring Kael the moment you're in", d: 'The spiral, the unread text, the fight. Start where it hurts.' },
  { when: 'Day 3', Ic: Waveform, t: 'It learns your pattern', d: 'Kael starts to see your moves before you name them.' },
  { when: 'Day 7', Ic: Sparkle, t: 'Your first shift, named', d: 'One reaction caught early. You feel the difference.' },
  { when: 'Day 30', Ic: HeartStraight, t: 'What you walked in with, lighter', d: 'The pattern is still there. It just stops running the show.' },
]
function ThirtyDays() {
  return (
    <div className="ov4-thirty">
      <div className="ov4-titles ov4-center">
        <span className="ov4-kicker">The road ahead</span>
        <h1 className="ov4-q ov4-pause-title-lg">Your 30 days with Kael.</h1>
      </div>
      <ol className="ov4-timeline">
        {JOURNEY.map((m, k) => (
          <li key={m.when} style={{ '--d': `${0.1 * k + 0.18}s` }}>
            <span className="ov4-tl-ic"><m.Ic size={18} weight="duotone" /></span>
            <div className="ov4-tl-txt">
              <span className="ov4-tl-when">{m.when}</span>
              <b>{m.t}</b>
              <span className="ov4-tl-d">{m.d}</span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

const PAY_ICONS = [ChatsCircle, MapTrifold, HeartStraight]
function Paywall({ arch, onClose }) {
  const [plan, setPlan] = useState('annual')
  const aname = arch ? arch.name : 'your archetype'
  /* per-archetype feature rows + promise, straight from READS (on-voice for this type) */
  const feats = (arch && Array.isArray(arch.features) ? arch.features : []).slice(0, 3)
  return (
    <>
      <div className="ov-body ov4-paybody">
        <span className="ov4-pay-kicker">You met {aname}</span>
        <h1 className="ov4-pay-title">Now let's change how you love.</h1>
        {arch?.aspiration && <p className="ov4-pay-sub">{arch.aspiration}</p>}
        <div className="ov4-pay-feats">
          {feats.map((f, k) => {
            const Ic = PAY_ICONS[k % PAY_ICONS.length]
            return (
              <div className="ov4-pay-feat" key={f.h}>
                <span className="ov4-pay-feat-ic"><Ic size={19} weight="duotone" /></span>
                <div><b>{f.h}</b><span>{f.l}</span></div>
              </div>
            )
          })}
        </div>
        <div className="ov4-plans">
          <button className="ov4-plan" data-on={plan === 'annual' || undefined} onClick={() => setPlan('annual')}>
            <span className="ov4-plan-tag">Less than a coffee a week</span>
            <div className="ov4-plan-l"><b>Annual</b><span>7 days free, then yearly</span></div>
            <div className="ov4-plan-r"><b>$99.99</b><span>/yr</span></div>
          </button>
          <button className="ov4-plan" data-on={plan === 'monthly' || undefined} onClick={() => setPlan('monthly')}>
            <div className="ov4-plan-l"><b>Monthly</b><span>7 days free, then monthly</span></div>
            <div className="ov4-plan-r"><b>$14.99</b><span>/mo</span></div>
          </button>
        </div>
      </div>
      <footer className="ov-foot ov4-payfoot">
        <button className="ov-cta" onClick={onClose}>Start 7-day free trial</button>
        <button className="ov4-quiet" onClick={onClose}>Not now</button>
      </footer>
    </>
  )
}
