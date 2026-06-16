import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Check, X, Sparkle, Quotes, Infinity as InfinityIcon, Brain, MapTrifold, Anchor } from '@phosphor-icons/react'
import {
  FLOW,
  QUESTIONS,
  SITUATIONS,
  SITUATION_REFLECT,
  LANTERNS,
  FEATURES,
  CALIB_STEPS,
  resolveArchetype,
} from '../obv3.js'

/* ──────────────────────────────────────────────────────────────────────────
   Kael Onboarding V3 — the Love Archetype diagnostic.
   Desire → Self-reflection → Mirror → Future self → Commitment.
   A guided first session: opens in the user's real situation, scores four
   hidden axes through warm scenario taps, reveals their archetype, and sells
   transformation. Reuses the ov- motion system. Engine + copy in ../obv3.js.
   ────────────────────────────────────────────────────────────────────────── */

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n))
const cap = (w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w)
const withName = (str, name) => (str ? str.replace(/\[Name\]/g, name ? cap(name) : 'friend') : str)
const lines = (str) => (str || '').split('\n')

/* the 4 hidden movements, for the quiz progress bar */
const MOVES = ['C', 'A', 'E', 'P']
const MOVE_QIDS = {
  C: ['c1', 'c2', 'c3', 'c4'],
  A: ['a1', 'a2', 'a3', 'a4'],
  E: ['e1', 'e2', 'e3', 'e4'],
  P: ['p1', 'p2', 'p3', 'p4', 't1', 't2'],
}

const MIN_FLOOR = 3400
const REVEAL_I = FLOW.findIndex((f) => f.kind === 'reveal')

export default function OnboardingV3({ noanim = false }) {
  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  const [answers, setA] = useState({})
  const [name, setName] = useState('')
  const [committed, setCommitted] = useState(false)
  const bodyRef = useRef(null)
  const advanceRef = useRef(null)

  const s = FLOW[i]
  const total = FLOW.length
  const last = i === total - 1
  const nm = name.trim()

  const go = (n) => {
    const t = clamp(n, 0, total - 1)
    setDir(t >= i ? 1 : -1)
    setI(t)
  }
  const next = () => (last ? go(0) : go(i + 1))
  const back = () => go(i - 1)

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = 0
    clearTimeout(advanceRef.current)
    setCommitted(false)
  }, [i])
  useEffect(() => () => clearTimeout(advanceRef.current), [])

  const pick = (field, v) => setA((p) => ({ ...p, [field]: v }))
  const setText = (v) => setA((p) => ({ ...p, situationText: v }))

  /* tap an option that auto-advances (quiz answers + confirm) */
  function pickAuto(field, v, beat = 440) {
    pick(field, v)
    setCommitted(true)
    clearTimeout(advanceRef.current)
    advanceRef.current = setTimeout(() => {
      setDir(1)
      setI((st) => Math.min(total - 1, st + 1))
    }, beat)
  }
  const pickQuiz = (qid, opt) => pickAuto(qid, opt, 460)

  /* the archetype, resolved once we reach the reveal */
  const past = i >= REVEAL_I
  const arch = useMemo(() => (past ? resolveArchetype(answers) : null), [past, answers])

  /* chrome */
  const showHead = !['hero', 'paywall', 'calibration', 'reveal'].includes(s.kind)
  const showBar = s.kind === 'quiz'
  const canBack = i > 0 && s.act !== 4 && s.kind !== 'calibration'
  const segStates = MOVES.map((m) => {
    const activeIdx = MOVES.indexOf(s.movement)
    const order = MOVES.indexOf(m)
    if (!showBar || activeIdx < 0) return { key: m, state: order < (activeIdx < 0 ? MOVES.length : activeIdx) && false ? 'done' : 'empty', fill: 0 }
    if (order < activeIdx) return { key: m, state: 'done', fill: 100 }
    if (order === activeIdx) {
      const ids = MOVE_QIDS[m]
      const idx = ids.indexOf(s.qid)
      return { key: m, state: 'active', fill: idx < 0 ? 0 : ((idx + 1) / ids.length) * 100 }
    }
    return { key: m, state: 'empty', fill: 0 }
  })

  const ready = (() => {
    if (s.kind === 'name') return nm.length > 0
    if (s.kind === 'situation') return Boolean(answers.situation)
    return true
  })()

  const footerLabel = s.cta || (['reveal', 'miniread'].includes(s.kind) ? 'Continue' : null)
  const showFooter = !['quiz', 'confirm', 'calibration', 'paywall'].includes(s.kind) && Boolean(footerLabel)

  return (
    <div className={`lib-page ov-page${noanim ? ' ov-noanim' : ''}`}>
      <div className="ob-devbar">
        <span className="ob-dev-title">Onboarding V3 · {i + 1}/{total} · {s.id}</span>
        <div className="ob-dev-controls">
          <button className="ob-dev-btn" onClick={() => go(i - 1)} disabled={i === 0}>Prev</button>
          <button className="ob-dev-btn" onClick={() => go(i + 1)} disabled={last}>Next</button>
          <select className="ob-dev-jump" value={i} onChange={(e) => go(Number(e.target.value))}>
            {FLOW.map((sc, idx) => (
              <option key={sc.id} value={idx}>{idx + 1}. {sc.id}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="ov-stage">
        <div className="ov-screen" data-theme="light">
          {showHead && (
            <header className="ov-head">
              <div className="ov-head-row">
                <button className="ov-back" data-hide={!canBack || undefined} onClick={back} aria-label="Back">
                  <ArrowLeft size={20} />
                </button>
                {showBar && <span className="ov-section">Getting to know you</span>}
              </div>
              {showBar && (
                <div className="ov-segbar">
                  {segStates.map((st) => (
                    <span key={st.key} className="ov-seg" data-state={st.state}>
                      {st.state === 'active' && <span className="ov-seg-fill" style={{ width: `${st.fill}%` }} />}
                    </span>
                  ))}
                </div>
              )}
            </header>
          )}

          <div className="ov-body" ref={bodyRef}>
            <div key={i} data-dir={dir} className="ov-flow">
              <Body
                s={s}
                answers={answers}
                name={name}
                nm={nm}
                arch={arch}
                setName={setName}
                pick={pick}
                pickAuto={pickAuto}
                pickQuiz={pickQuiz}
                setText={setText}
                committed={committed}
                onAdvance={next}
                onClose={next}
              />
            </div>
          </div>

          {showFooter && (
            <footer className="ov-foot">
              <button className="ov-cta" onClick={next} disabled={!ready}>{withName(footerLabel, nm)}</button>
            </footer>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── dispatch ── */
function Body(props) {
  switch (props.s.kind) {
    case 'hero': return <Hero {...props} />
    case 'name': return <NameField {...props} />
    case 'situation': return <SituationList {...props} />
    case 'why': return <Why {...props} />
    case 'quiz': return <QuizCard {...props} />
    case 'lantern': return <Lantern {...props} />
    case 'calibration': return <Calibration {...props} />
    case 'reveal': return <Reveal {...props} />
    case 'confirm': return <Confirm {...props} />
    case 'miniread': return <MiniRead {...props} />
    case 'turn': return <Turn {...props} />
    case 'features': return <Features {...props} />
    case 'paywall': return <PaywallV3 {...props} />
    default: return null
  }
}

function Titles({ s, name }) {
  return (
    <div className="ov-titles">
      <h1 className="ov-q">{lines(withName(s.title, name)).map((l, idx) => (
        <Fragment key={idx}>{idx > 0 && <br />}{l}</Fragment>
      ))}</h1>
      {s.sub && <p className="ov-why">{withName(s.sub, name)}</p>}
    </div>
  )
}

/* ── Act 1 ── */
function Hero({ s }) {
  return (
    <div className="ov-hero ov3-hero">
      <span className="ov3-hero-glyph"><Sparkle size={30} weight="fill" /></span>
      <h1 className="ov-hero-title">{lines(s.title).map((l, idx) => (
        <Fragment key={idx}>{idx > 0 && <br />}{l}</Fragment>
      ))}</h1>
      <p className="ov-hero-sub">{s.sub}</p>
    </div>
  )
}

function NameField({ s, name, setName }) {
  return (
    <>
      <Titles s={s} name={name} />
      <input
        className="ov-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={s.placeholder}
        autoComplete="off"
        spellCheck={false}
      />
    </>
  )
}

function SituationList({ s, answers, pick, name }) {
  const sel = answers.situation
  return (
    <>
      <Titles s={s} name={name} />
      <div className="ov-scens">
        {SITUATIONS.map((o) => {
          const on = sel === o.name
          const ack = on ? SITUATION_REFLECT[o.name] : null
          return (
            <Fragment key={o.name}>
              <button className="ov-scen" data-on={on || undefined} onClick={() => pick('situation', o.name)}>
                {o.icon && <span className="ov-scen-ic"><o.icon size={18} weight="duotone" /></span>}
                <span className="ov-scen-name">{o.name}</span>
                <span className="ov-option-check"><Check size={11} weight="bold" /></span>
              </button>
              {ack && (
                <p className="ov-ack">
                  <span className="ov-ack-mark"><Sparkle size={13} weight="fill" /></span>
                  {ack}
                </p>
              )}
            </Fragment>
          )
        })}
      </div>
    </>
  )
}

function Why({ s, name }) {
  return (
    <div className="ov-pause ov3-why">
      <h1 className="ov-pause-title">{lines(withName(s.title, name)).map((l, idx) => (
        <Fragment key={idx}>{idx > 0 && <br />}{l}</Fragment>
      ))}</h1>
      <p className="ov-pause-sub">{s.sub}</p>
    </div>
  )
}

/* ── Act 2: a scored scenario, options auto-advance ── */
function QuizCard({ s, answers, pickQuiz, committed }) {
  const q = QUESTIONS[s.qid]
  if (!q) return null
  const sel = answers[s.qid]
  return (
    <div className="ov3-quiz">
      <h1 className="ov-q ov3-quiz-q">{q.prompt}</h1>
      <div className="ov-options" data-locked={committed || undefined}>
        {q.options.map((o) => {
          const on = sel && sel.name === o.name
          return (
            <button
              key={o.name}
              className="ov-option ov3-quiz-opt"
              data-on={on || undefined}
              data-committed={(on && committed) || undefined}
              onClick={() => pickQuiz(s.qid, o)}
            >
              <span className="ov-option-title">{o.name}</span>
              <span className="ov-option-check"><Check size={12} weight="bold" /></span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function Lantern({ s, name }) {
  const L = LANTERNS[s.keyed] || {}
  return (
    <div className="ov-pause">
      {L.kicker && <span className="ov-kicker">{L.kicker}</span>}
      <h1 className="ov-pause-title">{withName(L.title, name)}</h1>
      {L.sub && <p className="ov-pause-sub">{withName(L.sub, name)}</p>}
    </div>
  )
}

function Calibration({ s, nm, onAdvance }) {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const TICK = 40
    const step = (100 * TICK) / MIN_FLOOR
    const iv = setInterval(() => {
      setPct((p) => {
        const np = p + step
        if (np >= 100) clearInterval(iv)
        return Math.min(100, np)
      })
    }, TICK)
    const floor = setTimeout(() => onAdvance(), MIN_FLOOR + 300)
    return () => {
      clearInterval(iv)
      clearTimeout(floor)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const stepIdx = Math.min(CALIB_STEPS.length - 1, Math.floor((pct / 100) * CALIB_STEPS.length))
  return (
    <div className="ov-calib">
      <h1 className="ov-calib-title">{withName(s.title, nm)}</h1>
      <div className="ov-calib-pct">{Math.round(pct)}<span>%</span></div>
      <div className="ov-calib-bar"><span style={{ width: `${pct}%` }} /></div>
      <p key={stepIdx} className="ov-calib-step">{CALIB_STEPS[stepIdx]}</p>
    </div>
  )
}

/* ── Act 3: the reveal ── */
function Reveal({ arch, nm }) {
  if (!arch) return null
  const Glyph = arch.glyph
  return (
    <div className="ov3-reveal">
      <span className="ov3-reveal-label">{nm ? `${cap(nm)}, your Love Archetype is` : 'Your Love Archetype is'}</span>
      <span className="ov3-reveal-glyph"><Glyph size={46} weight="duotone" /></span>
      <h1 className="ov3-reveal-name">{arch.name}</h1>
      <p className="ov3-reveal-essence">{arch.essence}</p>
      <p className="ov3-reveal-velvet">This is not your identity. It is how you become in love, especially when closeness, fear, desire, or conflict are activated.</p>
    </div>
  )
}

function Confirm({ s, answers, pickAuto }) {
  const sel = answers.confirm
  return (
    <div className="ov-ask ov3-confirm">
      <p className="ov-ask-q">{s.title}</p>
      <div className="ov-resp" data-locked={Boolean(sel) || undefined}>
        {s.options.map((o) => (
          <button
            key={o.name}
            className="ov-resp-btn"
            data-on={sel === o.name || undefined}
            data-committed={(sel === o.name) || undefined}
            onClick={() => pickAuto('confirm', o.name, 420)}
          >
            {o.name}
          </button>
        ))}
      </div>
      <p className="ov3-confirm-note">Either way, your read updates as Kael gets to know you.</p>
    </div>
  )
}

function Dots({ step }) {
  return (
    <div className="ov-dots">
      {[1, 2, 3, 4].map((n) => (
        <span key={n} className="ov-dot" data-on={n <= step || undefined} data-now={n === step || undefined} />
      ))}
    </div>
  )
}

function MiniRead({ s, arch, nm }) {
  if (!arch) return null
  return (
    <div className="ov-read ov3-mini">
      <Dots step={s.step} />
      <span className="ov-read-label">{s.label}</span>
      <h1 className="ov3-mini-name">{arch.name}</h1>
      <div className="ov3-mini-body">
        {s.show.map((field) => (
          <p key={field} className="ov-read-line">{withName(arch[field], nm)}</p>
        ))}
      </div>
      {s.landing && (
        <p className="ov3-mini-landing">Whatever you do next, you saw something true about how you love today.</p>
      )}
    </div>
  )
}

/* ── Act 4 ── */
function Turn({ arch }) {
  if (!arch) return null
  return (
    <div className="ov-pause ov3-turn">
      <span className="ov-kicker">Your path</span>
      <h1 className="ov-pause-title">This is not a label. It is a map.</h1>
      <p className="ov-pause-sub">
        You do not stop being {arch.name}. You become {arch.growth}
      </p>
      <div className="ov3-turn-arc">
        <span className="ov3-turn-from">{arch.name} now</span>
        <span className="ov3-turn-line" />
        <span className="ov3-turn-to">the secure {arch.name.replace('The ', '')}</span>
      </div>
    </div>
  )
}

function Features({ s, arch, answers, name }) {
  const sit = answers.situation || 'what you are carrying right now'
  const fill = (str) =>
    str.replace(/\{A\}/g, arch ? arch.name : 'you').replace(/\{SIT\}/g, sit)
  return (
    <>
      <div className="ov-titles">
        <h1 className="ov-q">{lines(s.title).map((l, idx) => (
          <Fragment key={idx}>{idx > 0 && <br />}{l}</Fragment>
        ))}</h1>
      </div>
      <div className="ov-feats ov3-feats">
        {FEATURES.map((f) => (
          <div className="ov-feat" key={f.t}>
            <span className="ov-feat-ic"><f.icon size={20} weight="duotone" /></span>
            <div className="ov-feat-t">
              <b>{f.t}</b>
              <span>{fill(f.s)}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

/* ── paywall: the deeper reward, archetype-aware (pl- classes) ── */
function PaywallV3({ arch, onClose }) {
  const [plan, setPlan] = useState('annual')
  const aname = arch ? arch.name : 'your archetype'
  const bare = aname.replace(/^The\s+/, '')
  const feats = [
    { Ic: MapTrifold, t: `The full ${bare} read`, s: 'Your complete map: triggers, beliefs, attraction and conflict patterns, and the path to your secure version.' },
    { Ic: Brain, t: 'Kael, calibrated to you', s: `Coaching tuned to how ${aname} loves, never generic advice.` },
    { Ic: InfinityIcon, t: 'Unlimited conversations', s: 'Every spiral, fight, and decision, in real time.' },
    { Ic: Anchor, t: 'Build your secure version', s: 'Steadier reactions, one moment at a time, tracked over time.' },
  ]
  return (
    <div className="ob-screen pl-screen" data-theme="light">
      <button className="pl-x" aria-label="Close" onClick={onClose}>
        <X size={20} weight="regular" />
      </button>
      <div className="pl-body">
        <p className="pl-kicker">Begin your path</p>
        <h1 className="pl-title">Start your transformation</h1>
        <p className="pl-lede">You have met {aname}. Now go deeper, and start changing the patterns it reveals.</p>
        <div className="pl-feats">
          {feats.map((f) => (
            <div className="pl-feat" key={f.t}>
              <span className="pl-feat-ic"><f.Ic size={22} weight="duotone" /></span>
              <div className="pl-feat-t">
                <b>{f.t}</b>
                <span>{f.s}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="pl-plans">
          <button className="pl-plan" data-on={plan === 'annual' || undefined} onClick={() => setPlan('annual')}>
            <span className="pl-plan-tag">Save 44%</span>
            <div className="pl-plan-l">
              <span className="pl-plan-name">Annual</span>
              <span className="pl-plan-sub">7 days free, then billed yearly</span>
            </div>
            <div className="pl-plan-r">
              <span className="pl-plan-price">$99.99</span>
              <span className="pl-plan-per">/year</span>
            </div>
          </button>
          <button className="pl-plan" data-on={plan === 'monthly' || undefined} onClick={() => setPlan('monthly')}>
            <div className="pl-plan-l">
              <span className="pl-plan-name">Monthly</span>
              <span className="pl-plan-sub">7 days free, then billed monthly</span>
            </div>
            <div className="pl-plan-r">
              <span className="pl-plan-price">$14.99</span>
              <span className="pl-plan-per">/month</span>
            </div>
          </button>
        </div>
      </div>
      <footer className="pl-foot">
        <div className="ob-cta pl-cta" role="button" onClick={onClose}>Start 7-day free trial</div>
        <div className="pl-links">
          <button>Privacy</button>
          <i>·</i>
          <button>Terms</button>
          <i>·</i>
          <button>Restore</button>
        </div>
      </footer>
    </div>
  )
}
