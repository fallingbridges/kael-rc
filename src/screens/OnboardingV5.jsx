import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft, Check, Sparkle, BellSimple, ShieldCheck, LockKey, Star, Quotes,
  ChatCircleDots, ArrowUpRight, PaperPlaneTilt, SealCheck, Brain, Pulse, Leaf,
} from '@phosphor-icons/react'
import {
  FLOW, QUESTIONS, BLOCKS, BLOCK_IDS, SITUATIONS, SITUATION_REFLECT, SIT_PHRASE,
  AGES, GENDERS, FREQ_OPTIONS, BREATHERS, CALIB_STEPS, CALIB_REVIEWS, QUIZ_EYEBROWS,
  AXIS_META, PROFILES, JOURNEY, PAY_FEATURES, resolveRead,
} from '../obv5.js'

/* ──────────────────────────────────────────────────────────────────────────
   Kael Onboarding V5 — the mental-wellness flow.
   arrive → quiz (4 blocks, breathers between, all 4 question types) → calibrate
   → reveal the pattern → the read (4 beats, each with "How Kael helps") →
   name / age / gender → notifications → ready → 30-day timeline → paywall.
   Reuses the V4 (ov4-*) design language; ov5-* adds the new pieces.
   ────────────────────────────────────────────────────────────────────────── */

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n))
const cap = (w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w)
const lines = (str) => (str || '').split('\n')
const AUTO_KINDS = ['two', 'single', 'age', 'gender']
const QUIZ_KINDS = ['two', 'single', 'slider', 'statement', 'multi', 'frequency']

/* default footer CTA per kind (FLOW.cta overrides) */
const CTA_BY_KIND = {
  welcome: 'Begin', promise: 'I’m listening', trust: 'I understand',
  situation: 'Continue', situationText: 'Continue', slider: 'Continue',
  statement: 'Continue', multi: 'Continue', breather: 'Continue',
  frequency: 'Continue', name: 'Continue', ready: 'See my 30 days',
}

export default function OnboardingV5({ noanim = false }) {
  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  const [answers, setA] = useState({})
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
  const arch = resolved ? resolved.profile : null
  const nm = (answers.name || '').trim()
  const fill = (str) => (str || '')
    .replace(/\{SIT\}/g, resolved ? resolved.phrases.SIT : SIT_PHRASE[answers.situation] || 'what you walked in with')
    .replace(/\{BODY\}/g, resolved ? resolved.phrases.BODY : 'the tension you carry')
    .replace(/\{REACH\}/g, resolved ? resolved.phrases.REACH : 'something to take the edge off')
    .replace(/,?\s*\{name\}/g, nm ? `, ${cap(nm)}` : '')

  /* chrome */
  const isQuiz = QUIZ_KINDS.includes(s.kind)
  const showHead = !['welcome', 'promise', 'reveal', 'calibration', 'paywall'].includes(s.kind)
  const canBack = i > 0 && s.kind !== 'calibration' && s.kind !== 'paywall'
  const segs = BLOCKS.map((b) => {
    if ((s.block || 0) > b) return { b, fill: 100 }
    if (s.block === b) { const ids = BLOCK_IDS[b] || []; const idx = ids.indexOf(s.qid); return { b, fill: idx < 0 ? 0 : ((idx + 1) / ids.length) * 100 } }
    return { b, fill: 0 }
  })

  /* footer */
  const footerLabel = s.cta || CTA_BY_KIND[s.kind] || null
  const ready = (() => {
    if (s.kind === 'name') return nm.length > 0
    if (s.kind === 'situationText') return (answers.situationText || '').trim().length > 0
    if (s.kind === 'situation') return Boolean(answers.situation)
    if (s.kind === 'frequency') return Boolean(answers[s.qid])
    if (s.kind === 'multi') return Array.isArray(answers[s.qid]?.picks) && answers[s.qid].picks.length > 0
    return true
  })()
  const showFooter = !AUTO_KINDS.concat(['calibration', 'paywall']).includes(s.kind) && Boolean(footerLabel)

  return (
    <div className={`lib-page ov-page ov4-page ov5-page${noanim ? ' ov-noanim' : ''}`}>
      <div className="ob-devbar">
        <span className="ob-dev-title">Onboarding V5 · {i + 1}/{total} · {s.id}</span>
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
                  <Body s={s} answers={answers} arch={arch} resolved={resolved} nm={nm} set={set} pickAuto={pickAuto} fill={fill} onAdvance={next} />
                </div>
              </div>

              {showFooter && (
                <footer className="ov-foot">
                  <button className="ov-cta" onClick={next} disabled={!ready}>{fill(footerLabel)}</button>
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
    case 'promise': return <Promise {...props} />
    case 'situation': return <SituationList {...props} />
    case 'situationText': return <SituationText {...props} />
    case 'trust': return <Trust {...props} />
    case 'two': return <Choice {...props} />
    case 'single': return <SingleChoice {...props} />
    case 'frequency': return <FrequencyScale {...props} />
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

function Header({ title, sub, fill, center }) {
  return (
    <div className={`ov4-titles${center ? ' ov4-center' : ''}`}>
      <h1 className="ov4-q">{lines(fill ? fill(title) : title).map((l, idx) => (<Fragment key={idx}>{idx > 0 && <br />}{l}</Fragment>))}</h1>
      {sub && <p className="ov4-sub">{fill ? fill(sub) : sub}</p>}
    </div>
  )
}

function Badge({ Icon }) { return <span className="ov4-badge"><Icon size={26} weight="duotone" /></span> }

function Emph({ body, em }) {
  if (!em || !body.includes(em)) return <>{body}</>
  const [a, b] = body.split(em)
  return <>{a}<em className="ov4-em">{em}</em>{b}</>
}

function Illo({ label = 'Illustration', ratio = '1x1', sm = false }) {
  return (
    <div className={`ov4-illo${sm ? ' ov4-illo-sm' : ''}`} data-ratio={ratio} aria-hidden="true">
      <span className="ov4-illo-ic"><Sparkle size={sm ? 18 : 24} weight="light" /></span>
      <span className="ov4-illo-label">{label}</span>
    </div>
  )
}

function emLine(line, em) {
  if (!em || !line.includes(em)) return line
  const [a, b] = line.split(em)
  return <>{a}<em className="ov4-hero-em">{em}</em>{b}</>
}

/* ── Act 1 ── */
function Welcome({ s }) {
  return (
    <div className="ov4-hero ov4-welcome">
      <Illo label="Warm opening image" ratio="1x1" />
      <h1 className="ov4-hero-title">{lines(s.title).map((l, idx) => (<Fragment key={idx}>{idx > 0 && <br />}{l}</Fragment>))}</h1>
      <p className="ov4-hero-sub">{s.sub}</p>
    </div>
  )
}

function Promise({ s }) {
  return (
    <div className="ov4-hero ov4-hero-type">
      <span className="ov4-hero-kicker">{s.kicker}</span>
      <h1 className="ov4-hero-title ov4-hero-title-lg">
        {lines(s.title).map((l, idx) => (<Fragment key={idx}>{idx > 0 && <br />}{s.em ? emLine(l, s.em) : l}</Fragment>))}
      </h1>
      <p className="ov4-hero-sub">{s.sub}</p>
      <div className="ov5-promise-row">
        <span className="ov5-promise-chip"><Brain size={15} weight="duotone" />Remembers you</span>
        <span className="ov5-promise-chip"><ChatCircleDots size={15} weight="duotone" />Offers the words</span>
        <span className="ov5-promise-chip"><SealCheck size={15} weight="duotone" />Real method</span>
      </div>
    </div>
  )
}

function SituationList({ s, answers, set, fill, onAdvance }) {
  const sel = answers.situation
  const custom = answers.situationText
  const chooseElse = () => { set('situation', 'Something else'); onAdvance() }
  return (
    <>
      <Header title={s.title} sub={s.sub} fill={fill} />
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

function SituationText({ s, answers, set }) {
  const v = answers.situationText || ''
  return (
    <>
      <Header title={s.title} sub={s.sub} />
      <input className="ov-input ov4-input" value={v} maxLength={60} autoFocus onChange={(e) => set('situationText', e.target.value)} placeholder={s.placeholder} autoComplete="off" spellCheck={false} />
      <span className="ov4-charcount">{v.length}/60</span>
    </>
  )
}

function Trust() {
  return (
    <div className="ov4-pause ov4-trust">
      <Badge Icon={ShieldCheck} />
      <span className="ov4-kicker">Before we start</span>
      <h1 className="ov4-q ov4-pause-title ov4-pause-title-lg">Private, secure,<br />and yours alone.</h1>
      <p className="ov4-sub ov4-pause-sub ov4-pause-sub-lg">No one reads your world but you. Be as honest as you need to be.</p>
      <div className="ov5-trustrow">
        <span className="ov5-trustrow-item"><LockKey size={15} weight="duotone" />End-to-end private</span>
        <span className="ov5-trustrow-item"><ShieldCheck size={15} weight="duotone" />Never sold, ever</span>
      </div>
    </div>
  )
}

function CardList({ s, answers, pickAuto, field, items, fill }) {
  const sel = answers[field]
  return (
    <>
      <Header title={s.title} sub={s.sub} fill={fill} />
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
      <input className="ov-input ov4-input" value={answers.name || ''} autoFocus onChange={(e) => set('name', e.target.value)} placeholder={s.placeholder} autoComplete="off" spellCheck={false} maxLength={24} />
    </>
  )
}

/* ── Act 2 — questions ── */
function Choice({ s, answers, pickAuto }) {
  const q = QUESTIONS[s.qid]
  if (!q) return null
  const sel = answers[s.qid]
  return (
    <div className="ov4-choice">
      <h1 className="ov4-q ov4-quiz-q">{q.prompt}</h1>
      <div className="ov4-cards" data-locked={Boolean(sel) || undefined}>
        {q.options.map((o, n) => {
          const on = sel && sel.name === o.name
          return (
            <button key={o.name} className="ov4-card" data-on={on || undefined} data-committed={on || undefined}
              style={{ '--d': `${0.07 * n + 0.06}s` }} onClick={() => pickAuto(s.qid, { name: o.name, val: o.val }, 420)}>
              <span className="ov4-card-ic ov4-card-ic-lg">{o.icon && <o.icon size={26} weight="duotone" />}</span>
              <span className="ov4-card-name">{o.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

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
              style={{ '--d': `${0.05 * n + 0.06}s` }} onClick={() => pickAuto(s.qid, { name: o.name, val: o.val, echo: o.echo }, 360)}>
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

/* frequency-based question — a 5-step scale with an intensity meter. Freely
   re-selectable; the user confirms with Continue (no auto-advance lock). */
function FrequencyScale({ s, answers, set }) {
  const q = QUESTIONS[s.qid]
  if (!q) return null
  const sel = answers[s.qid]
  return (
    <div className="ov4-choice">
      <h1 className="ov4-q ov4-quiz-q">{q.prompt}</h1>
      <div className="ov5-freq">
        {FREQ_OPTIONS.map((o, n) => {
          const on = sel && sel.name === o.name
          return (
            <button key={o.name} className="ov5-freq-opt" data-on={on || undefined}
              style={{ '--d': `${0.05 * n + 0.06}s` }} onClick={() => set(s.qid, { name: o.name, val: o.val })}>
              <span className="ov5-freq-name">{o.name}</span>
              <span className="ov5-freq-meter" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((k) => (<span key={k} className="ov5-freq-pip" data-fill={k <= n || undefined} />))}
              </span>
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
  const [val, setVal] = useState(50)
  const onChange = (v) => { setVal(v); set(s.qid, { value: v }) }
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
        <p className="ov4-slider-hint">Slide toward whichever fits. There’s no wrong spot.</p>
      </div>
    </div>
  )
}

/* a quoted statement rated on an agreement slider (Not me ↔ Exactly me) */
function StatementSlider({ s, set }) {
  const q = QUESTIONS[s.qid]
  const [val, setVal] = useState(50)
  const onChange = (v) => { setVal(v); set(s.qid, { value: v }) }
  return (
    <div className="ov4-choice ov4-sliderwrap ov4-stmtwrap">
      <h1 className="ov4-q ov4-quiz-q">Does this sound like you?</h1>
      <figure className="ov4-stmt">
        <span className="ov4-stmt-mark"><Quotes size={28} weight="fill" /></span>
        <blockquote className="ov4-stmt-text">{q.statement}</blockquote>
      </figure>
      <div className="ov4-slider">
        <div className="ov4-slider-row">
          <span className="ov4-slider-end">Not me</span>
          <span className="ov4-slider-end ov4-slider-end-r">Exactly me</span>
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
    else np = [...picks, { name: o.name }]
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

/* ── breathers ── */
function Breather({ s, fill }) {
  const b = BREATHERS[s.n] || {}
  const lg = b.big
  return (
    <div className="ov4-pause ov5-breather">
      <Badge Icon={b.icon || Sparkle} />
      {b.kicker && <span className="ov4-kicker">{b.kicker}</span>}
      <h1 className={`ov4-q ov4-pause-title${lg ? ' ov4-pause-title-lg' : ''}`}>{b.title}</h1>
      <p className={`ov4-sub ov4-pause-sub${lg ? ' ov4-pause-sub-lg' : ''}`}><Emph body={fill(b.body)} em={b.em} /></p>
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

function MethodRow() {
  const items = [
    { k: 'CBT', d: 'Reframe the thought' },
    { k: 'ACT', d: 'Sit with the feeling' },
    { k: 'Mindfulness', d: 'Come back to now' },
  ]
  return (
    <div className="ov5-method">
      {items.map((m) => (
        <div className="ov5-method-chip" key={m.k}>
          <b>{m.k}</b>
          <span>{m.d}</span>
        </div>
      ))}
    </div>
  )
}

/* segmented % calibration loader with rotating reviews */
const MIN_FLOOR = 5200
function Calibration({ onAdvance }) {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const TICK = 40
    const step = (100 * TICK) / MIN_FLOOR
    const iv = setInterval(() => setPct((p) => { const np = p + step; if (np >= 100) clearInterval(iv); return Math.min(100, np) }), TICK)
    const floor = setTimeout(() => onAdvance(), MIN_FLOOR + 360)
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
        <p>“{CALIB_REVIEWS[stepIdx % CALIB_REVIEWS.length]}”</p>
      </div>
    </div>
  )
}

/* ── Act 3 — reveal + the read ── */
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

/* a beat of the read: a recognition card + how Kael helps with it */
function Beat({ beat, fill, d }) {
  const Ic = beat.icon
  return (
    <div className="ov5-beat" style={{ '--d': `${d}s` }}>
      <div className="ov5-beat-head">
        <span className="ov5-beat-ic">{Ic && <Ic size={17} weight="duotone" />}</span>
        <span className="ov5-beat-label">{beat.label}</span>
      </div>
      {beat.quote && <p className="ov5-beat-quote"><Quotes size={15} weight="fill" />{fill(beat.quote)}</p>}
      <p className="ov5-beat-body">{fill(beat.body)}</p>
      <div className="ov5-beat-help">
        <span className="ov5-beat-help-ic"><Sparkle size={13} weight="fill" /></span>
        <span><b>How Kael helps.</b> {fill(beat.help)}</span>
      </div>
    </div>
  )
}

function MiniRead({ arch, resolved, fill }) {
  if (!arch) return null
  const axes = resolved ? resolved.axes : null
  return (
    <div className="ov4-read ov4-miniread ov5-read">
      <div className="ov4-beat-arch">
        <span className="ov4-beat-arch-label">Your pattern</span>
        <h2 className="ov4-beat-arch-name">{arch.name}</h2>
      </div>

      {axes && (
        <section className="ov4-axes">
          {AXIS_META.map((m, k) => (<AxisBar key={m.key} meta={m} axis={axes[m.key]} d={0.06 * k + 0.1} />))}
        </section>
      )}

      <section className="ov4-mini ov5-mini">
        {arch.prose.map((p, k) => {
          const Tag = k === 0 ? 'strong' : 'em'
          return (<p key={k}><Tag>{p}</Tag></p>)
        })}
        <span className="ov5-mini-by"><Sparkle size={12} weight="fill" />Kael</span>
      </section>

      <div className="ov5-beats">
        {arch.beats.map((b, k) => (<Beat key={k} beat={b} fill={fill} d={0.05 * k + 0.12} />))}
      </div>

      <section className="ov4-sec">
        <span className="ov4-sec-label">How it shows up for you</span>
        <div className="ov4-tagrow">{arch.shows.map((c, k) => (<span key={k} className="ov4-tag">{c}</span>))}</div>
      </section>

      <section className="ov4-sec">
        <span className="ov4-sec-label">What growth looks like</span>
        <ul className="ov4-growth">
          {arch.growth.map((g, k) => (<li key={k} style={{ '--d': `${0.05 * k + 0.1}s` }}><span className="ov4-growth-ic"><ArrowUpRight size={13} weight="bold" /></span>{g}</li>))}
        </ul>
      </section>

      <div className="ov4-readnote"><ChatCircleDots size={16} weight="duotone" /><span>This read gets sharper the more you talk to Kael.</span></div>
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
      <div className="ov5-notif-preview">
        <span className="ov5-notif-av"><Sparkle size={15} weight="fill" /></span>
        <div className="ov5-notif-txt">
          <b>Kael</b>
          <span>Hey, you mentioned today might be heavy. How’s your head right now?</span>
        </div>
        <span className="ov5-notif-now">now</span>
      </div>
    </div>
  )
}

/* ── Act 4 — ready, the 30 days, the paywall ── */
function Ready({ arch, nm }) {
  if (!arch) return null
  const Glyph = arch.glyph
  return (
    <div className="ov4-pause ov4-ready">
      <span className="ov4-cal-glyph"><Glyph size={30} weight="duotone" /></span>
      <span className="ov4-kicker">Calibrated to you</span>
      <h1 className="ov4-q ov4-pause-title ov4-pause-title-lg">{nm ? `Kael is ready, ${cap(nm)}.` : 'Kael is ready.'}</h1>
      <p className="ov4-sub ov4-pause-sub ov4-pause-sub-lg">Tuned to your mind, your energy, and the pattern you came in with. Yours, not generic.</p>
    </div>
  )
}

function ThirtyDays() {
  return (
    <div className="ov4-thirty">
      <div className="ov4-titles ov4-center">
        <span className="ov4-kicker">The road ahead</span>
        <h1 className="ov4-q ov4-pause-title-lg">Your first 30 days with Kael.</h1>
      </div>
      <ol className="ov4-timeline">
        {JOURNEY.map((m, k) => (
          <li key={m.when} style={{ '--d': `${0.1 * k + 0.18}s` }}>
            <span className="ov4-tl-ic"><m.icon size={18} weight="duotone" /></span>
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

function Paywall({ arch, onClose }) {
  const [plan, setPlan] = useState('annual')
  const bare = arch ? arch.name.replace(/^The\s+/, '') : 'your'
  const Glyph = arch ? arch.glyph : null
  return (
    <>
      <div className="ov-body ov4-paybody">
        <div className="ov4-pay-head">
          {Glyph && <span className="ov4-pay-glyph"><Glyph size={30} weight="duotone" /></span>}
          <span className="ov4-pay-kicker">Your plan as the {bare}</span>
          <h1 className="ov4-pay-title">Have Kael in your corner.</h1>
        </div>
        <ul className="ov4-cal-list ov4-payfeatlist">
          {PAY_FEATURES.map((f, k) => (
            <li key={k} style={{ '--d': `${0.05 * k + 0.16}s` }}>
              <span className="ov4-cal-ic"><f.icon size={17} weight="duotone" /></span>{f.t}
            </li>
          ))}
        </ul>
        <div className="ov4-plans">
          <button className="ov4-plan" data-on={plan === 'annual' || undefined} onClick={() => setPlan('annual')}>
            <span className="ov4-plan-tag">7 days free · best value</span>
            <div className="ov4-plan-l"><b>Annual</b><span>then $99.99 a year</span></div>
            <div className="ov4-plan-r"><b>$1.92</b><span>/wk</span></div>
          </button>
          <button className="ov4-plan" data-on={plan === 'monthly' || undefined} onClick={() => setPlan('monthly')}>
            <div className="ov4-plan-l"><b>Monthly</b><span>7 days free, then monthly</span></div>
            <div className="ov4-plan-r"><b>$14.99</b><span>/mo</span></div>
          </button>
        </div>
      </div>
      <footer className="ov-foot ov4-payfoot">
        <button className="ov-cta" onClick={onClose}>Start 7-day free trial</button>
        <p className="ov5-pay-fine">No charge today. We’ll remind you before it ends.</p>
        <button className="ov4-quiet" onClick={onClose}>Not now</button>
      </footer>
    </>
  )
}
