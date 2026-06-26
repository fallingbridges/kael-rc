import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft, Check, Sparkle, BellSimple, ShieldCheck, LockKey, Star, Sun,
  X, Infinity as InfinityIcon,
  Heart, HeartStraight, Quotes, Compass,
  Fingerprint, ChatsCircle, Anchor, Brain, ChartLineUp, Flame, Waves,
  UsersThree, Waveform, Wind, House, HandHeart, ArrowUpRight, PaperPlaneTilt,
} from '@phosphor-icons/react'
import {
  FLOW, QUESTIONS, BLOCK_IDS, BLOCKS, SITUATIONS, SITUATION_REFLECT, SIT_PHRASE,
  REL_CONTEXT, AGES, GENDERS, GOALS, BREATHERS, CALIB_STEPS, CALIB_REVIEWS, QUIZ_EYEBROWS,
  resolveRead, answeredCount,
} from '../obv7.js'
import { Safety as IntroSafety, Recognition as IntroRecognition, Hope as IntroHope } from './IntroConcept.jsx'

/* ──────────────────────────────────────────────────────────────────────────
   Kael Onboarding V7 — the merge: V6's balanced 16-question quiz + axis-bar
   reveal, plus V5's best bits grafted on — a personalized read that echoes your
   own answers back ({SIT}/{BODY}/{REACH}), a "how Kael helps" line per beat, and
   the live chat-demo + method-row breathers. No separate full read; the read is
   the read. Identity is collected after the reveal so the front stays light.
   ────────────────────────────────────────────────────────────────────────── */

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n))
const cap = (w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w)
const lowerFirst = (w) => (w ? w.charAt(0).toLowerCase() + w.slice(1) : w)
const proseList = (arr) => { const a = (arr || []).filter(Boolean); if (!a.length) return ''; if (a.length === 1) return a[0]; if (a.length === 2) return `${a[0]} and ${a[1]}`; return `${a.slice(0, -1).join(', ')}, and ${a[a.length - 1]}` }
const lines = (str) => (str || '').split('\n')
const AUTO_KINDS = ['two', 'single', 'relcontext', 'age', 'gender']

function hash(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i += 1) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) }
  return h >>> 0
}

/* axis bars on the read — human axis name + both pole labels. left = the low-key
   pole, right = the named (POSITIVE) pole; the marker sits at axes[key].pos%. */
const AXIS_META = [
  { key: 'MIND', name: 'Your mind', left: 'Quiet', right: 'Racing' },
  { key: 'ENERGY', name: 'Your energy', left: 'Steady', right: 'Running low' },
  { key: 'VOICE', name: 'Inner voice', left: 'Kind', right: 'Critical' },
  { key: 'COPE', name: 'How you cope', left: 'Faces it', right: 'Numbs it' },
]
/* small rotating icon set for the "what you value" chips */
const VALUE_ICONS = [Heart, Anchor, House, Compass, ShieldCheck, Star, HandHeart, Wind]
/* an icon per quiz segment, shown in the eyebrow */
const BLOCK_ICONS = { 1: Brain, 2: Flame, 3: Quotes, 4: Waves }

export default function OnboardingV7({ noanim = false }) {
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
  const ph = resolved ? resolved.phrases : null
  const fillSit = (str) => (str || '')
    .replace(/\{SIT\}/g, (ph && ph.SIT) || answers.situationText || SIT_PHRASE[answers.situation] || "what you're carrying")
    .replace(/\{BODY\}/g, (ph && ph.BODY) || 'the tension you carry')
    .replace(/\{REACH\}/g, (ph && ph.REACH) || 'something to take the edge off')
    .replace(/,?\s*\{name\}/g, nm ? `, ${cap(nm)}` : '')
    // a filled-in phrase can land at the start of a sentence — recapitalize there
    .replace(/([.!?]\s+)([a-z])/g, (_, pre, ch) => pre + ch.toUpperCase())
  const order = (opts, qid) => (hash(seedRef.current + qid) % 2 === 0 ? opts : [opts[1], opts[0]])

  /* chrome */
  const isQuiz = ['two', 'single', 'slider', 'statement', 'multi'].includes(s.kind)
  const showHead = !['welcome', 'hero', 'intro', 'reveal', 'calibration', 'paywall'].includes(s.kind)
  const canBack = i > 0 && s.kind !== 'calibration' && s.kind !== 'paywall'
  /* progress bar derives its blocks from FLOW (via BLOCKS/BLOCK_IDS) so it can never desync from the order */
  const segs = BLOCKS.map((b) => {
    if ((s.block || 0) > b) return { b, fill: 100 }
    if (s.block === b) { const ids = BLOCK_IDS[b] || []; const idx = ids.indexOf(s.qid); return { b, fill: idx < 0 ? 0 : ((idx + 1) / ids.length) * 100 } }
    return { b, fill: 0 }
  })

  /* footer */
  let footerLabel = s.cta || (['reveal', 'slider', 'statement', 'multi'].includes(s.kind) ? 'Continue' : null)
  // optional multis (e4/c4): the CTA reads "None of these" until something is picked, then "Continue"
  if (s.kind === 'multi') footerLabel = (answers[s.qid]?.picks?.length > 0) ? 'Continue' : 'None of these'
  const ready = (() => {
    if (s.kind === 'name') return nm.length > 0
    if (s.kind === 'situationText') return (answers.situationText || '').trim().length > 0
    if (s.kind === 'multi') return true // optional — never force a pick
    if (s.kind === 'situation') return Boolean(answers.situation)
    if (s.kind === 'goals') return Array.isArray(answers.goal) && answers.goal.length > 0
    return true
  })()
  const showFooter = !AUTO_KINDS.concat(['calibration', 'paywall']).includes(s.kind) && Boolean(footerLabel)
  const ctaText = footerLabel

  return (
    <div className={`lib-page ov-page ov4-page ov6-page ov7-page${noanim ? ' ov-noanim' : ''}`}>
      <div className="ob-devbar">
        <span className="ob-dev-title">Onboarding V7 · {i + 1}/{total} · {s.id}</span>
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
                    {isQuiz && (() => {
                      const EyeIc = BLOCK_ICONS[s.block]
                      return (
                        <span className="ov4-eyebrow">
                          {EyeIc && <EyeIc size={13} weight="bold" />}
                          {QUIZ_EYEBROWS[s.block] || 'Getting to know you'}
                        </span>
                      )
                    })()}
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
    case 'intro': return props.s.scene === 'recognition' ? <IntroRecognition /> : props.s.scene === 'hope' ? <IntroHope /> : <IntroSafety />
    case 'welcome': return <Welcome {...props} />
    case 'hero': return <Hero {...props} />
    case 'situation': return <SituationList {...props} />
    case 'situationText': return <SituationText {...props} />
    case 'goals': return <Goals {...props} />
    case 'trust': return <Trust {...props} />
    case 'relcontext': return <CardList {...props} field="rel" items={REL_CONTEXT} />
    case 'prep': return <Prep {...props} />
    case 'two': return <Choice {...props} />
    case 'single': return <SingleChoice {...props} />
    case 'slider': return <SliderCard {...props} />
    case 'statement': return <StatementSlider {...props} />
    case 'multi': return <MultiCard {...props} />
    case 'breather': return <Breather {...props} />
    case 'calibration': return <Calibration {...props} />
    case 'reveal': return <Reveal {...props} />
    case 'miniread': return <MiniRead {...props} />
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
      <p className="ov4-hero-sub">{s.subEm ? <Emph body={s.sub} em={s.subEm} /> : s.sub}</p>
    </div>
  )
}

/* the promise — type-forward (no illustration), with the emphasized word in italic */
function Hero({ s }) {
  return (
    <div className="ov4-hero ov4-hero-type">
      <span className="ov4-hero-kicker">{s.kicker || 'Now, a promise'}</span>
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

/* the hopeful close to the quiz — what they're working toward (multi-select, non-scoring) */
function Goals({ s, answers, set, fillSit }) {
  const picks = Array.isArray(answers.goal) ? answers.goal : []
  const has = (name) => picks.includes(name)
  const toggle = (name) => set('goal', has(name) ? picks.filter((p) => p !== name) : [...picks, name])
  return (
    <>
      <Header title={s.title} sub={s.sub} fillSit={fillSit} />
      <div className="ov4-list">
        {GOALS.map((o, n) => (
          <button key={o.name} className="ov4-card ov4-card-sm" data-on={has(o.name) || undefined}
            style={{ '--d': `${0.04 * n + 0.06}s` }} onClick={() => toggle(o.name)}>
            <span className="ov4-card-ic"><o.icon size={20} weight="duotone" /></span>
            <span className="ov4-card-name">{o.name}</span>
            <span className="ov4-card-check"><Check size={12} weight="bold" /></span>
          </button>
        ))}
      </div>
    </>
  )
}

function Trust() {
  return (
    <div className="ov4-pause ov4-trust">
      <Badge Icon={ShieldCheck} />
      <span className="ov4-kicker">Just between us</span>
      <h1 className="ov4-q ov4-pause-title ov4-pause-title-lg">Private, secure,<br />and yours alone.</h1>
      <p className="ov4-sub ov4-pause-sub ov4-pause-sub-lg">No one reads your world but you. Which means you can be honest here, even about the messy parts.</p>
    </div>
  )
}

function Prep({ s }) {
  return (
    <div className="ov4-pause ov4-prep2">
      <Badge Icon={Fingerprint} />
      <span className="ov4-kicker">{s.kicker || 'Your pattern'}</span>
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

/* block 4 · single-select conflict question — tap one, auto-advances (one pole signal) */
function SingleChoice({ s, answers, pickAuto }) {
  const q = QUESTIONS[s.qid]
  if (!q) return null
  const sel = answers[s.qid]
  return (
    <div className="ov4-choice">
      <h1 className="ov4-q ov4-quiz-q">{q.prompt}</h1>
      {q.sub && <p className="ov4-quiz-sub">{q.sub}</p>}
      <div className="ov4-list" data-locked={Boolean(sel) || undefined}>
        {q.options.map((o, n) => {
          const on = sel && sel.name === o.name
          return (
            <button key={o.name} className="ov4-card ov4-card-sm" data-on={on || undefined} data-committed={on || undefined}
              style={{ '--d': `${0.05 * n + 0.06}s` }} onClick={() => pickAuto(s.qid, { name: o.name, pole: o.pole }, 360)}>
              {o.icon && <span className="ov4-card-ic"><o.icon size={20} weight="duotone" /></span>}
              <span className="ov4-card-name">{o.name}</span>
              <span className="ov4-card-check"><Check size={12} weight="bold" /></span>
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
        <span className="ov4-stmt-mark"><Quotes size={28} weight="fill" /></span>
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
  const grid = q.cols === 2
  return (
    <div className="ov4-choice">
      <h1 className="ov4-q ov4-quiz-q">{q.prompt}</h1>
      {q.sub && <p className="ov4-quiz-sub">{q.sub}</p>}
      <p className="ov4-multi-hint">Pick up to {max} · {picks.length} chosen</p>
      <div className={grid ? 'ov4-mgrid' : 'ov4-list'}>
        {q.options.map((o, n) => {
          const on = has(o.name)
          if (grid) {
            return (
              <button key={o.name} className="ov4-mtile" data-on={on || undefined} data-dim={(!on && full) || undefined} disabled={!on && full}
                style={{ '--d': `${0.04 * n + 0.06}s` }} onClick={() => toggle(o)}>
                {o.icon && <span className="ov4-mtile-ic"><o.icon size={20} weight="duotone" /></span>}
                <span className="ov4-mtile-name">{o.name}</span>
              </button>
            )
          }
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
  const lg = b.big // credibility breather matches the prep screen's larger title/spacing
  return (
    <div className="ov4-pause ov5-breather">
      <Badge Icon={b.icon || Sparkle} />
      {b.kicker && <span className="ov4-kicker">{b.kicker}</span>}
      <h1 className={`ov4-q ov4-pause-title${lg ? ' ov4-pause-title-lg' : ''}`}>{b.title}</h1>
      <p className={`ov4-sub ov4-pause-sub${lg ? ' ov4-pause-sub-lg' : ''}`}><Emph body={fillSit(b.body)} em={b.em} /></p>
      {b.demo && <ChatDemo />}
      {b.method && <MethodRow />}
    </div>
  )
}

/* the differentiator made visible: Kael replies AND hands you options to tap */
function ChatDemo() {
  return (
    <div className="ov5-demo" aria-hidden="true">
      <div className="ov5-demo-row">
        <span className="ov5-demo-av"><Sparkle size={14} weight="fill" /></span>
        <div className="ov5-demo-bubble">That sounds like a lot to hold on your own. Want to start with the part that’s loudest right now?</div>
      </div>
      <div className="ov5-demo-chips">
        <span className="ov5-demo-chip">The racing thoughts</span>
        <span className="ov5-demo-chip">Why I can’t rest</span>
        <span className="ov5-demo-chip">I just need to vent</span>
      </div>
      <div className="ov5-demo-input">
        <span className="ov5-demo-input-hint">or type your own…</span>
        <span className="ov5-demo-send"><PaperPlaneTilt size={15} weight="fill" /></span>
      </div>
    </div>
  )
}

/* the three methods Kael draws on, shown as credibility (not generic advice) */
function MethodRow() {
  const items = [
    { k: 'CBT', d: 'Reframe the thought', Ic: Brain },
    { k: 'ACT', d: 'Sit with the feeling', Ic: Heart },
    { k: 'Mindfulness', d: 'Come back to now', Ic: Wind },
  ]
  return (
    <div className="ov5-method">
      {items.map((m) => (
        <div className="ov5-method-chip" key={m.k}>
          <span className="ov7-method-ic"><m.Ic size={17} weight="duotone" /></span>
          <b>{m.k}</b>
          <span>{m.d}</span>
        </div>
      ))}
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
      <span className="ov4-reveal-label">What Kael noticed</span>
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

/* the read — axis bars (the four pillars) → four beats, each with the pattern
   in your own words, the recognizable chips, and a "how Kael helps" line →
   growth pointers. Personalized: bodies/chips echo the user's answers via fillSit. */
const READ_SECTIONS = [
  { key: 'love', label: 'How you carry it' },
  { key: 'value', label: 'What you’re after' },
  { key: 'triggers', label: 'What sets it off' },
  { key: 'respond', label: 'How you cope' },
]
function MiniRead({ arch, axes, fillSit }) {
  if (!arch) return null
  const b = arch.beats || {}
  const fill = fillSit || ((x) => x)
  const growth = [arch.aspiration, ...(Array.isArray(arch.compare) ? arch.compare.slice(0, 2).map((c) => c.withKael) : [])].filter(Boolean)
  return (
    <div className="ov4-read ov4-miniread ov7r">
      {/* masthead — the bespoke 1-of-16 portrait */}
      <header className="ov7r-head">
        <span className="ov7r-eyebrow">Your pattern</span>
        <h2 className="ov7r-name">{arch.name}</h2>
        {arch.open && <p className="ov7r-open">{fill(arch.open)}</p>}
      </header>

      {/* the four pillars, as a level-meter card */}
      {axes && (
        <section className="ov7r-pillars">
          <span className="ov7r-cap">Your four pillars</span>
          {AXIS_META.map((m, k) => {
            const ax = axes[m.key] || { pos: 50 }
            const onRight = ax.pos >= 50
            return (
              <div className="ov7r-pillar" key={m.key} style={{ '--d': `${0.05 * k + 0.12}s` }}>
                <span className="ov7r-pillar-name">{m.name}</span>
                <div className="ov7r-track">
                  <span className="ov7r-fill" style={{ width: `${ax.pos}%` }} />
                  <span className="ov7r-dot" style={{ left: `${ax.pos}%` }} />
                </div>
                <div className="ov7r-ends">
                  <span data-on={!onRight || undefined}>{m.left}</span>
                  <span data-on={onRight || undefined}>{m.right}</span>
                </div>
              </div>
            )
          })}
        </section>
      )}

      {/* the read — numbered editorial beats, each closed by Kael's note */}
      <div className="ov7r-beats">
        {READ_SECTIONS.map((sec, k) => {
          const beat = b[sec.key]
          if (!beat) return null
          const chips = beat.chips || []
          return (
            <section className="ov7r-beat" key={sec.key} style={{ '--d': `${0.05 * k + 0.18}s` }}>
              <h3 className="ov7r-label">{sec.label}</h3>
              <p className="ov7r-body">{fill(beat.body)}</p>
              {sec.key === 'value' ? (
                <div className="ov7r-tiles">
                  {chips.slice(0, 4).map((c, j) => {
                    const Ic = VALUE_ICONS[j % VALUE_ICONS.length]
                    return (
                      <div key={j} className="ov7r-tile" style={{ '--d': `${0.05 * j + 0.1}s` }}>
                        <span className="ov7r-tile-ic"><Ic size={16} weight="duotone" /></span>
                        <span>{fill(c)}</span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="ov7r-chips">
                  {chips.map((c, j) => (<span key={j} className={`ov7r-chip${sec.key === 'triggers' ? ' ov7r-chip-warm' : ''}`}>{fill(c)}</span>))}
                </div>
              )}
              {beat.help && (
                <div className="ov7r-help">
                  <span className="ov7r-help-mark"><Sparkle size={11} weight="fill" /></span>
                  <p>{fill(beat.help)}</p>
                </div>
              )}
            </section>
          )
        })}
      </div>

      {/* the second-loudest pillar, a quiet aside */}
      {arch.accent && <p className="ov7r-accent">{fill(arch.accent)}</p>}

      {/* where this goes, signed */}
      <section className="ov7r-close">
        <h3 className="ov7r-label">Where this goes</h3>
        <ul className="ov7r-grow">
          {growth.map((g, k) => (<li key={k} style={{ '--d': `${0.05 * k + 0.1}s` }}><span className="ov7r-grow-ic"><ArrowUpRight size={12} weight="bold" /></span>{fill(g)}</li>))}
        </ul>
      </section>

      <footer className="ov7r-foot">
        <span className="ov7r-sign">— Kael</span>
        <span className="ov7r-foot-note">This read sharpens the more you talk to me.</span>
      </footer>
    </div>
  )
}

/* teaser/handoff — editorial table-of-contents for the full read inside the app */
function FullRead({ arch }) {
  const bare = arch ? arch.name.replace(/^The\s+/, '') : 'your'
  const sections = [
    'Your pattern, in depth',
    'What you protect, and why',
    'Where it comes from',
    `How the ${bare} grows`,
  ]
  return (
    <div className="ov4-read ov4-fullwrap">
      <div className="ov4-fulltoc">
        <span className="ov4-beat-arch-label">The full read</span>
        <h2 className="ov4-fulltoc-title">The Complete {bare} Read.</h2>
        <span className="ov4-fulltoc-meta">1,000+ words · 6 chapters</span>
        <ol className="ov4-fulltoc-list">
          {sections.map((t, k) => (<li key={t}><b>{String(k + 1).padStart(2, '0')}</b><span>{t}</span></li>))}
        </ol>
        <div className="ov4-fulltoc-lock"><LockKey size={14} weight="duotone" />Unlocks inside Kael</div>
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

/* ── Act 4 — the daily practice, Kael is ready, the 30-day journey, the paywall ── */

/* the daily-ritual beat — names the recurring loop the user is actually signing up for:
   the archetype is the hook, the daily note is the habit. */
function DailyLoop() {
  return (
    <div className="ov4-pause ov4-dailyloop">
      <Badge Icon={Sun} />
      <span className="ov4-kicker">How this works</span>
      <h1 className="ov4-q ov4-pause-title ov4-pause-title-lg">This is a daily practice.</h1>
      <p className="ov4-sub ov4-pause-sub ov4-pause-sub-lg">Your pattern is the starting point. From here, Kael checks in each day, learns how you tick, and <em className="ov4-em">leaves you a short note</em> on what it notices. Small, steady, and built around you.</p>
    </div>
  )
}

/* a short breather: Kael is calibrated to this archetype, addressed by name */
function Ready({ arch, nm, answers }) {
  if (!arch) return null
  const Glyph = arch.glyph
  const goals = answers && Array.isArray(answers.goal) ? proseList(answers.goal.map(lowerFirst)) : ''
  return (
    <div className="ov4-pause ov4-ready">
      <span className="ov4-cal-glyph"><Glyph size={30} weight="duotone" /></span>
      <span className="ov4-kicker">Calibrated to you</span>
      <h1 className="ov4-q ov4-pause-title ov4-pause-title-lg">{nm ? `Kael is ready, ${cap(nm)}.` : 'Kael is ready.'}</h1>
      <p className="ov4-sub ov4-pause-sub ov4-pause-sub-lg">{goals ? `Tuned to your pattern, and pointed at ${goals}.` : 'Tuned to your pattern, not a generic script.'}</p>
    </div>
  )
}

/* a warm editorial timeline — the daily practice taking hold, not a habit tracker */
const JOURNEY = [
  { when: 'Today', Ic: ChatsCircle, t: "Bring Kael what's on your mind", d: 'The spiral, the stress, the thing you can’t say out loud. Start anywhere.' },
  { when: 'Day 3', Ic: Waveform, t: 'It learns your pattern', d: 'Kael starts to catch your loops before you finish naming them.' },
  { when: 'Day 7', Ic: Sparkle, t: 'Your first shift, named', d: 'One spiral caught early, one kinder word to yourself. You feel it.' },
  { when: 'Day 30', Ic: HeartStraight, t: 'A quieter mind', d: 'The old reflex still shows up, but it stops running the show. You catch it, and you choose.' },
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

/* paywall — the first studio design (VGrouped: warm badge → centered hero → icon
   feature list → stacked plans → CTA + links), adapted to the wellness product.
   Badge is the user's own pattern glyph. */
const PAY_FEATURES = [
  { icon: InfinityIcon, t: 'Unlimited conversations', s: 'Every spiral and 2am, judgment-free' },
  { icon: Brain, t: 'Kael remembers your whole story', s: 'Your patterns and history, never re-explain' },
  { icon: ChatsCircle, t: 'A daily note that knows you', s: 'Kael notices your dips and reflects them back' },
  { icon: Wind, t: 'A calmer, steadier baseline', s: 'The old reflex loosens, one day at a time' },
]
function Paywall({ arch, onClose }) {
  const [plan, setPlan] = useState('annual')
  const Glyph = arch ? arch.glyph : ShieldCheck
  return (
    <div className="pl-grouped ov7-pay" data-theme="light">
      <button className="pl-x" onClick={onClose} aria-label="Close"><X size={20} weight="regular" /></button>
      <div className="pl-body">
        <div className="pl-hero">
          <span className="pl-badge pl-badge-warm"><Glyph size={24} weight="duotone" /></span>
          <p className="pl-kicker">Kael Premium</p>
          <h1 className="pl-title">Kael, in your corner.</h1>
          <p className="pl-lede">Unlimited check-ins with the coach who remembers your whole story.</p>
        </div>
        <div className="pl-feats pl-feats-tight">
          {PAY_FEATURES.map((f) => (
            <div className="pl-feat" key={f.t}>
              <span className="pl-feat-ic"><f.icon size={22} weight="duotone" /></span>
              <div className="pl-feat-t"><b>{f.t}</b><span>{f.s}</span></div>
            </div>
          ))}
        </div>
        <div className="pl-tail">
          <div className="pl-plans">
            <button className="pl-plan" data-on={plan === 'annual' || undefined} onClick={() => setPlan('annual')}>
              <span className="pl-plan-tag">Save 44%</span>
              <div className="pl-plan-l"><span className="pl-plan-name">Annual</span><span className="pl-plan-sub">7 days free, then billed yearly</span></div>
              <div className="pl-plan-r"><span className="pl-plan-price">$99.99</span><span className="pl-plan-per">/year</span></div>
            </button>
            <button className="pl-plan" data-on={plan === 'monthly' || undefined} onClick={() => setPlan('monthly')}>
              <div className="pl-plan-l"><span className="pl-plan-name">Monthly</span><span className="pl-plan-sub">7 days free, then billed monthly</span></div>
              <div className="pl-plan-r"><span className="pl-plan-price">$14.99</span><span className="pl-plan-per">/month</span></div>
            </button>
          </div>
        </div>
      </div>
      <footer className="pl-foot">
        <button className="ob-cta" onClick={onClose}>Start 7-day free trial</button>
        <div className="pl-links"><button>Privacy</button><i>·</i><button>Terms</button><i>·</i><button>Restore</button></div>
      </footer>
    </div>
  )
}
