import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft, Check, Sparkle, BellSimple, ShieldCheck, LockKey, Books, Star,
  Heart, HeartStraight, Lightning, ArrowsClockwise, Quotes, Path, Compass,
  Fingerprint, MapTrifold, ChatsCircle, Anchor, Scales,
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

/* read beats fall back to the old bubbles until the regenerated content lands */
const BEAT_FALLBACK = { love: 0, value: 0, triggers: 1, respond: 2 }
function getBeat(read, bkey) {
  if (read && read.beats && read.beats[bkey]) return read.beats[bkey]
  const b = (read && read.bubbles ? read.bubbles[BEAT_FALLBACK[bkey]] : '') || (read && read.essence) || ''
  return { body: b, chips: [] }
}
const BEAT_ICON = { love: HeartStraight, value: Star, triggers: Lightning, respond: ArrowsClockwise }

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
  const fillSit = (str) => (str || '').replace(/\{SIT\}/g, answers.situationText || SIT_PHRASE[answers.situation] || "what you're carrying")
  const order = (opts, qid) => (hash(seedRef.current + qid) % 2 === 0 ? opts : [opts[1], opts[0]])

  /* chrome */
  const isQuiz = ['two', 'slider', 'multi'].includes(s.kind)
  const showHead = !['welcome', 'hero', 'reveal', 'calibration', 'paywall'].includes(s.kind)
  const canBack = i > 0 && s.kind !== 'calibration' && s.kind !== 'paywall'
  /* progress bar derives its blocks from FLOW (via BLOCKS/BLOCK_IDS) so it can never desync from the order */
  const segs = BLOCKS.map((b) => {
    if ((s.block || 0) > b) return { b, fill: 100 }
    if (s.block === b) { const ids = BLOCK_IDS[b] || []; const idx = ids.indexOf(s.qid); return { b, fill: idx < 0 ? 0 : ((idx + 1) / ids.length) * 100 } }
    return { b, fill: 0 }
  })

  /* footer */
  const footerLabel = s.cta || (['reveal', 'slider', 'multi'].includes(s.kind) ? 'Continue' : null)
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
                    s={s} answers={answers} arch={arch} nm={nm} set={set} pickAuto={pickAuto}
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
    case 'multi': return <MultiCard {...props} />
    case 'breather': return <Breather {...props} />
    case 'calibration': return <Calibration {...props} />
    case 'reveal': return <Reveal {...props} />
    case 'read': return <Read {...props} />
    case 'name': return <NameField {...props} />
    case 'age': return <CardList {...props} field="age" items={AGES} />
    case 'gender': return <CardList {...props} field="gender" items={GENDERS} />
    case 'notif': return <Notif {...props} />
    case 'calibrated': return <Calibrated {...props} />
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

function Trust({ s }) {
  const feats = [
    { Ic: LockKey, t: 'End-to-end private', d: 'No one reads your conversations but you.' },
    { Ic: Books, t: 'Evidence based', d: 'Frameworks used by leading therapists.' },
  ]
  return (
    <div className="ov4-pause">
      <Badge Icon={ShieldCheck} />
      <span className="ov4-kicker">Before we start</span>
      <h1 className="ov4-q ov4-pause-title">Private, secure, and expert-backed.</h1>
      <p className="ov4-sub ov4-pause-sub">Your world stays yours. Kael is built on attachment theory and real relationship science.</p>
      <div className="ov4-pausefeats">
        {feats.map((f) => (
          <div className="ov4-pausefeat" key={f.t}>
            <span className="ov4-pausefeat-ic"><f.Ic size={20} weight="duotone" /></span>
            <div><b>{f.t}</b><span>{f.d}</span></div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Prep({ s }) {
  const steps = [
    { Ic: Scales, t: 'Pick what feels truer', d: 'Not better. There are no wrong answers here.' },
    { Ic: Compass, t: 'Each one maps how you love', d: 'How you connect, how you react, what you reach for.' },
    { Ic: Fingerprint, t: 'Then you meet your archetype', d: 'One of sixteen, and the read is yours alone.' },
  ]
  return (
    <div className="ov4-prep">
      <div className="ov4-titles ov4-center">
        <h1 className="ov4-q">{s.title}</h1>
        <p className="ov4-sub">{s.sub}</p>
      </div>
      <ol className="ov4-prep-steps">
        {steps.map((st, n) => (
          <li key={st.t} style={{ '--d': `${0.08 * n + 0.16}s` }}>
            <span className="ov4-prep-stepic"><st.Ic size={20} weight="duotone" /></span>
            <div className="ov4-prep-txt"><b>{st.t}</b><span>{st.d}</span></div>
          </li>
        ))}
      </ol>
    </div>
  )
}

function CardList({ s, answers, pickAuto, field, items }) {
  const sel = answers[field]
  return (
    <>
      <Header title={s.title} sub={s.sub} />
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

function Dots({ step, n = 4 }) {
  return (
    <div className="ov4-dots">
      {Array.from({ length: n }).map((_, k) => (<span key={k} data-on={k + 1 <= step || undefined} data-now={k + 1 === step || undefined} />))}
    </div>
  )
}

/* single-page read — short prose + 5 pointers + a "this is just the surface" close.
   Falls back to composing from the beats until dedicated read copy lands in READS[code].read */
function getRead(arch) {
  if (arch.read && Array.isArray(arch.read.prose)) return arch.read
  const b = arch.beats || {}
  const prose = [b.love && b.love.body, b.triggers && b.triggers.body, b.respond && b.respond.body].filter(Boolean)
  const points = []
  ;['love', 'triggers', 'respond', 'value'].forEach((k) => { const c = b[k] && b[k].chips; if (c && c[0]) points.push(c[0]) })
  if (b.value && b.value.chips && b.value.chips[1]) points.push(b.value.chips[1])
  return { prose, points: points.slice(0, 5) }
}

function Read({ arch }) {
  if (!arch) return null
  const r = getRead(arch)
  return (
    <div className="ov4-read">
      <div className="ov4-beat-arch">
        <span className="ov4-beat-arch-label">Your archetype</span>
        <h2 className="ov4-beat-arch-name">{arch.name}</h2>
      </div>
      <div className="ov4-read-prose">
        {r.prose.map((p, k) => (<p key={k} style={{ '--d': `${0.06 * k + 0.12}s` }}>{p}</p>))}
      </div>
      {r.points && r.points.length > 0 && (
        <ul className="ov4-read-points">
          {r.points.map((pt, k) => (
            <li key={k} style={{ '--d': `${0.05 * k + 0.3}s` }}><span className="ov4-read-tick"><Check size={11} weight="bold" /></span>{pt}</li>
          ))}
        </ul>
      )}
      <p className="ov4-read-surface">And honestly? This is just the surface.</p>
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

/* ── Act 4 — Kael, calibrated to your archetype ── */
const HELP_ICONS = [ChatsCircle, Lightning, ArrowsClockwise, HeartStraight, Compass]
function getHelp(arch) {
  if (Array.isArray(arch.help) && arch.help.length) return arch.help.map((h) => (typeof h === 'string' ? h : h.title || h.line))
  /* placeholder — replaced by per-archetype generated copy (5 short lines) */
  return [
    'Catches your pattern the second it starts',
    'Helps you say the hard thing, in the moment',
    "Reads the text you can't read at 2am",
    "Keeps what you're working on in view",
    'Tuned to how you love, not generic advice',
  ]
}
function Calibrated({ arch }) {
  if (!arch) return null
  const bare = arch.name.replace(/^The\s+/, '')
  const Glyph = arch.glyph
  const help = getHelp(arch).slice(0, 5)
  return (
    <div className="ov4-pause ov4-cal">
      <span className="ov4-cal-glyph"><Glyph size={28} weight="duotone" /></span>
      <span className="ov4-kicker">Calibrated to you</span>
      <h1 className="ov4-q ov4-pause-title">Kael, tuned to the {bare}.</h1>
      <ul className="ov4-cal-list">
        {help.map((h, k) => {
          const Ic = HELP_ICONS[k % HELP_ICONS.length]
          return (
            <li key={k} style={{ '--d': `${0.06 * k + 0.16}s` }}>
              <span className="ov4-cal-ic"><Ic size={17} weight="duotone" /></span>{h}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function Paywall({ arch, onClose }) {
  const [plan, setPlan] = useState('annual')
  const aname = arch ? arch.name : 'your archetype'
  const bare = aname.replace(/^The\s+/, '')
  const feats = [
    { Ic: MapTrifold, t: `The full ${bare} read`, s: 'What you protect, and the move that changes it.' },
    { Ic: ChatsCircle, t: 'Here when the spiral hits', s: 'A response built for how you love.' },
    { Ic: Anchor, t: 'Watch yourself change', s: "The texts you didn't send." },
  ]
  return (
    <>
      <div className="ov-body ov4-paybody">
        <span className="ov4-pay-kicker">You met {aname}</span>
        <h1 className="ov4-pay-title">Now let's change how you love.</h1>
        <div className="ov4-pay-feats">
          {feats.map((f) => (
            <div className="ov4-pay-feat" key={f.t}>
              <span className="ov4-pay-feat-ic"><f.Ic size={19} weight="duotone" /></span>
              <div><b>{f.t}</b><span>{f.s}</span></div>
            </div>
          ))}
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
