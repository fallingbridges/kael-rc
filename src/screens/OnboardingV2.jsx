import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  Check,
  X,
  Image,
  Sparkle,
  Quotes,
  Lightning,
  Path,
  Infinity as InfinityIcon,
  Brain,
  ArrowsClockwise,
  Anchor,
} from '@phosphor-icons/react'
import {
  FLOW,
  assembleRead,
  scorePattern,
  ACKS,
  INTERSTITIALS,
  NARRATION,
  SECTION,
  ILLOS,
  READS,
  PATTERNS,
  BELIEFS,
  TRIGGER_LABELS,
  SELLS,
} from '../obv2.js'

/* ──────────────────────────────────────────────────────────────────────────
   Kael Onboarding V2 — full redesign (ov- system).
   Warm editorial minimalism: Newsreader voices the questions, Charter carries
   the quotes, DM Sans does the work. One orchestrated entrance per screen,
   tactile feedback on every touch. CSS-only motion, no framer-motion.
   All copy + scoring live in ../obv2.js.
   ────────────────────────────────────────────────────────────────────────── */

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n))
const cap = (w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w)
const withName = (str, name) => (str ? str.replace(/\[Name\]/g, name ? cap(name) : 'friend') : str)

/* Segment membership: 'know' = name/age/gender; A–D by movement. */
const SEGMENTS = ['know', 'A', 'B', 'C', 'D']
const KNOW_IDS = ['name', 'age', 'gender']
const SEG_META = (() => {
  const meta = {}
  SEGMENTS.forEach((k) => (meta[k] = { total: 0, ids: [] }))
  FLOW.forEach((s) => {
    let k = null
    if (KNOW_IDS.includes(s.id)) k = 'know'
    else if (s.movement) k = s.movement
    if (k) {
      meta[k].ids.push(s.id)
      meta[k].total += 1
    }
  })
  return meta
})()

const CALIB_STEPS = [
  'Reading what you told me.',
  'Lining up the pattern underneath.',
  'Pinpointing what sets it off.',
  'Mapping the path from here.',
  'Putting it into words.',
]
const MIN_FLOOR = 3400

const calibrationIndex = FLOW.findIndex((f) => f.id === 'calibration')

export default function OnboardingV2({ noanim = false }) {
  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  const [answers, setA] = useState({ values: [] })
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

  /* Answers. Back never clears them, so a revisited screen is pre-selected. */
  const pick = (field, v) => setA((p) => ({ ...p, [field]: v }))
  const setText = (v) => setA((p) => ({ ...p, situationText: v }))
  const toggle = (field, v) =>
    setA((p) => {
      const cur = p[field] || []
      if (cur.includes(v)) return { ...p, [field]: cur.filter((x) => x !== v) }
      if (cur.length >= 3) return p
      return { ...p, [field]: [...cur, v] }
    })

  function pickAuto(field, v) {
    pick(field, v)
    setCommitted(true)
    clearTimeout(advanceRef.current)
    const beat = s.belief ? 560 : 400
    advanceRef.current = setTimeout(() => {
      setDir(1)
      setI((st) => Math.min(total - 1, st + 1))
    }, beat)
  }

  /* The leading pattern, live — keys the mid-quiz break copy. */
  const leadPattern = useMemo(() => scorePattern(answers), [answers])

  /* The read — computed once, at calibration. */
  const atCalibration = i >= calibrationIndex
  const read = useMemo(
    () => (atCalibration ? assembleRead({ ...answers, name: nm }) : null),
    [atCalibration, answers, nm]
  )

  const ready = (() => {
    if (s.kind === 'input') return nm.length > 0
    if (s.kind === 'value') return (answers.values || []).length > 0
    if (s.kind === 'scenario') return Boolean(answers.situation)
    if (s.mode === 'ack') return Boolean(answers[s.field])
    return true
  })()

  /* Top chrome state. */
  const showChrome = s.act !== 4 && s.kind !== 'paywall'
  const showBar = s.act === 2 || String(s.act).startsWith('3')
  const activeSeg = (() => {
    if (KNOW_IDS.includes(s.id)) return 'know'
    if (s.segPart != null || s.segDone) return s.seg
    return s.movement
  })()
  const sectionName = showBar && activeSeg ? SECTION[activeSeg] : ''
  const fillPct = (() => {
    if (s.segPart != null) return s.segPart * 100
    const key = KNOW_IDS.includes(s.id) ? 'know' : s.movement
    if (!key) return 0
    const meta = SEG_META[key]
    const idx = meta.ids.indexOf(s.id)
    return idx < 0 ? 0 : ((idx + 1) / meta.total) * 100
  })()
  const segStates = SEGMENTS.map((key) => {
    const order = SEGMENTS.indexOf(key)
    const activeOrder = SEGMENTS.indexOf(activeSeg)
    let state = 'empty'
    let fill = 0
    if (activeOrder >= 0) {
      if (order < activeOrder) state = 'done'
      else if (order === activeOrder) {
        if (s.segDone) state = 'done'
        else {
          state = 'active'
          fill = fillPct
        }
      }
    }
    return { key, state, fill }
  })

  /* Living narration — rides the chrome on the screen after a segment lands. */
  const narration = (() => {
    if (s.id === 'relationship-state') return withName(NARRATION.know, nm)
    if (s.id === 'pattern-recognition-1') return withName(NARRATION.A, nm)
    if (s.id === 'intensity-1') return withName(NARRATION.B, nm)
    if (s.id === 'values') return withName(NARRATION.C, nm)
    return ''
  })()

  const canBack = i > 0 && s.act !== 4
  const showFooter = s.mode !== 'auto' && !['calibration', 'paywall'].includes(s.kind)

  return (
    <div className={`lib-page ov-page${noanim ? ' ov-noanim' : ''}`}>
      <div className="ob-devbar">
        <span className="ob-dev-title">Onboarding V2 · {i + 1}/{total} · {s.id}</span>
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
          {showChrome && (
            <header className="ov-head">
              <div className="ov-head-row">
                <button className="ov-back" data-hide={!canBack || undefined} onClick={back} aria-label="Back">
                  <ArrowLeft size={20} />
                </button>
                {sectionName && <span className="ov-section">{sectionName}</span>}
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
              {narration && <p className="ov-narration">{narration}</p>}
            </header>
          )}

          <div className="ov-body" ref={bodyRef}>
            <div key={i} data-dir={dir} className="ov-flow">
              <Body
                s={s}
                answers={answers}
                name={name}
                nm={nm}
                setName={setName}
                pick={pick}
                pickAuto={pickAuto}
                toggle={toggle}
                setText={setText}
                committed={committed}
                lead={leadPattern}
                read={read}
                onAdvance={next}
                onClose={next}
              />
            </div>
          </div>

          {showFooter && <Footer s={s} nm={nm} ready={ready} onNext={next} onSecondary={next} />}
        </div>
      </div>
    </div>
  )
}

/* ── dispatch ── */
function Body(props) {
  const { s } = props
  switch (s.kind) {
    case 'welcome': return <Hero s={s} />
    case 'pause': return <Pause s={s} nm={props.nm} lead={props.lead} />
    case 'select': return <SelectList {...props} />
    case 'input': return <NameField {...props} />
    case 'chips': return <ChipList {...props} />
    case 'mood': return <MoodGrid {...props} />
    case 'recognize': return <AskCard {...props} />
    case 'likert': return <AskCard {...props} scale />
    case 'value': return <ValueGrid {...props} />
    case 'scenario': return <ScenarioList {...props} />
    case 'calibration': return <Calibration {...props} />
    case 'read-pattern': return <ReadPattern {...props} />
    case 'read-triggers': return <ReadTriggers {...props} />
    case 'read-belief': return <ReadBelief {...props} />
    case 'read-path': return <ReadPath {...props} />
    case 'landing': return <Landing {...props} />
    case 'surface': return <Surface {...props} />
    case 'paywall': return <PaywallStatic {...props} />
    default: return null
  }
}

/* ── shared bits ── */
function Titles({ s, name }) {
  return (
    <div className="ov-titles">
      <h1 className="ov-q">{withName(s.title, name)}</h1>
      {s.sub && <p className="ov-why">{s.sub}</p>}
    </div>
  )
}

function IllustrationPlaceholder({ name, ratio, desc, small }) {
  return (
    <div className={`ov-illo${small ? ' ov-illo-sm' : ''}`} data-ratio={ratio}>
      <span className="ov-illo-ic"><Image size={26} weight="duotone" /></span>
      <span className="ov-illo-label">Illustration: {name}</span>
      {desc && <span className="ov-illo-desc">{desc}</span>}
    </div>
  )
}

function Footer({ s, nm, ready, onNext, onSecondary }) {
  if (!s.cta && !s.cta2) return null
  return (
    <footer className="ov-foot">
      {s.cta && <button className="ov-cta" onClick={onNext} disabled={!ready}>{withName(s.cta, nm)}</button>}
      {s.cta2 && <button className="ov-cta2" onClick={onSecondary}>{s.cta2}</button>}
    </footer>
  )
}

/* ── welcome ── */
function Hero({ s }) {
  const illo = ILLOS[s.illo] || ILLOS.welcome
  return (
    <div className="ov-hero">
      <IllustrationPlaceholder name={illo.name} ratio={illo.ratio} desc={illo.desc} />
      <h1 className="ov-hero-title">{s.title}</h1>
      <p className="ov-hero-sub">{s.sub}</p>
    </div>
  )
}

/* ── pause screens: payoff, trust, breaks, notifications ── */
function Pause({ s, nm, lead }) {
  let title = withName(s.title || '', nm)
  if (s.keyed) {
    const src = (lead && INTERSTITIALS[lead] && INTERSTITIALS[lead][s.keyed]) || INTERSTITIALS.base[s.keyed]
    title = withName(src, nm)
  }
  const Badge = s.badge
  return (
    <div className="ov-pause">
      {Badge && (
        <span className="ov-pause-badge"><Badge size={26} weight="duotone" /></span>
      )}
      {s.kicker && <span className="ov-kicker">{s.kicker}</span>}
      <h1 className="ov-pause-title">{title}</h1>
      {s.sub && <p className="ov-pause-sub">{s.sub}</p>}
      {s.features && (
        <div className="ov-feats">
          {s.features.map((f) => (
            <div className="ov-feat" key={f.t}>
              <span className="ov-feat-ic"><f.icon size={21} weight="duotone" /></span>
              <div className="ov-feat-t">
                <b>{f.t}</b>
                <span>{f.s}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      {s.expect && (
        <div className="ov-expect">
          {s.expect.map((e, idx) => (
            <Fragment key={e}>
              {idx > 0 && <i>·</i>}
              <span>{e}</span>
            </Fragment>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── single-select with the ack inline, right under the chosen option ── */
function SelectList({ s, answers, pick, name }) {
  const sel = answers[s.field]
  return (
    <>
      <Titles s={s} name={name} />
      <div className="ov-options">
        {s.options.map((o) => {
          const on = sel === o.name
          const ack = on && ACKS[s.field] ? ACKS[s.field][o.name] : null
          return (
            <Fragment key={o.name}>
              <button className="ov-option" data-on={on || undefined} onClick={() => pick(s.field, o.name)}>
                {o.icon && <span className="ov-option-ic"><o.icon size={19} weight="duotone" /></span>}
                <span className="ov-option-title">{o.name}</span>
                <span className="ov-option-check"><Check size={12} weight="bold" /></span>
              </button>
              {ack && (
                <p className="ov-ack">
                  <span className="ov-ack-mark"><Sparkle size={13} weight="fill" /></span>
                  {withName(ack, name)}
                </p>
              )}
            </Fragment>
          )
        })}
      </div>
    </>
  )
}

/* ── name ── */
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

/* ── chips (age / gender): clean vertical rows, auto-advance ── */
function ChipList({ s, answers, pickAuto, committed, name }) {
  const sel = answers[s.field]
  return (
    <>
      <Titles s={s} name={name} />
      <div className="ov-chips" data-locked={committed || undefined}>
        {s.options.map((o) => {
          const on = sel === o.name
          return (
            <button
              key={o.name}
              className="ov-chip"
              data-on={on || undefined}
              data-committed={(on && committed) || undefined}
              onClick={() => pickAuto(s.field, o.name)}
            >
              {o.icon && <span className="ov-chip-ic"><o.icon size={19} weight="duotone" /></span>}
              <span className="ov-chip-label">{o.name}</span>
              <span className="ov-option-check"><Check size={12} weight="bold" /></span>
            </button>
          )
        })}
      </div>
    </>
  )
}

/* ── mood grid (3-col) ── */
function MoodGrid({ s, answers, pickAuto, committed, name }) {
  const sel = answers[s.field]
  return (
    <>
      <Titles s={s} name={name} />
      <div className="ov-moods" data-locked={committed || undefined}>
        {s.options.map((o) => {
          const on = sel === o.name
          return (
            <button
              key={o.name}
              className="ov-mood"
              data-on={on || undefined}
              data-committed={(on && committed) || undefined}
              onClick={() => pickAuto(s.field, o.name)}
            >
              <span className="ov-mood-ic">{o.icon && <o.icon size={21} weight="duotone" />}</span>
              <span className="ov-mood-name">{o.name}</span>
            </button>
          )
        })}
      </div>
    </>
  )
}

/* ── recognition + likert: preface, centered quote, responses beneath ── */
function AskCard({ s, answers, pickAuto, committed, scale }) {
  const sel = answers[s.field]
  return (
    <div className="ov-ask">
      <p className="ov-ask-q">{scale ? 'How often is this you?' : 'Do you relate to the statement below?'}</p>
      <div className="ov-quote">
        <span className="ov-quote-mark"><Quotes size={22} weight="fill" /></span>
        <p className="ov-quote-text">{s.title}</p>
      </div>
      <div className={scale ? 'ov-scale' : 'ov-resp'} data-locked={committed || undefined}>
        {s.options.map((o) => {
          const on = sel === o.name
          return (
            <button
              key={o.name}
              className={scale ? 'ov-scale-chip' : 'ov-resp-btn'}
              data-on={on || undefined}
              data-committed={(on && committed) || undefined}
              onClick={() => pickAuto(s.field, o.name)}
            >
              {o.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ── values (multi, cap 3) ── */
function ValueGrid({ s, answers, toggle, name }) {
  const lit = answers.values || []
  const full = lit.length >= 3
  const counter = full ? "That's three" : lit.length === 0 ? 'Tap up to three' : `${lit.length} of 3`
  return (
    <>
      <Titles s={s} name={name} />
      <div className="ov-values" data-full={full || undefined}>
        {s.options.map((o) => {
          const on = lit.includes(o.name)
          return (
            <button key={o.name} className="ov-value" data-on={on || undefined} onClick={() => toggle('values', o.name)}>
              {o.icon && <span className="ov-value-ic"><o.icon size={17} weight="duotone" /></span>}
              <span className="ov-value-name">{o.name}</span>
              <span className="ov-option-check"><Check size={11} weight="bold" /></span>
            </button>
          )
        })}
      </div>
      <span className="ov-count">{counter}</span>
    </>
  )
}

/* ── situation: scenario rows + optional "Something else" text ── */
function ScenarioList({ s, answers, pick, setText, name }) {
  const sel = answers.situation
  const showText = sel === 'Something else'
  return (
    <>
      <Titles s={s} name={name} />
      <div className="ov-scens">
        {s.options.map((o) => {
          const on = sel === o.name
          const isElse = o.name === 'Something else'
          return (
            <button key={o.name} className="ov-scen" data-on={on || undefined} onClick={() => pick('situation', o.name)}>
              {o.icon && <span className="ov-scen-ic"><o.icon size={17} weight="duotone" /></span>}
              <span className="ov-scen-name">{isElse ? 'Something else →' : o.name}</span>
              <span className="ov-option-check"><Check size={11} weight="bold" /></span>
            </button>
          )
        })}
      </div>
      {showText && (
        <div className="ov-text-wrap">
          <span className="ov-text-label">{s.micro}</span>
          <textarea
            className="ov-text"
            value={answers.situationText || ''}
            onChange={(e) => setText(e.target.value)}
            placeholder={s.placeholder}
            spellCheck={false}
            rows={3}
          />
        </div>
      )}
    </>
  )
}

/* ── calibration: percentage multi-loader ── */
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

/* ── the read: 4 beats, each pays off + sells how Kael helps ── */
function Dots({ step }) {
  return (
    <div className="ov-dots">
      {[1, 2, 3, 4].map((n) => (
        <span key={n} className="ov-dot" data-on={n <= step || undefined} data-now={n === step || undefined} />
      ))}
    </div>
  )
}

function Sell({ text }) {
  return (
    <div className="ov-sell">
      <span className="ov-sell-ic"><Sparkle size={14} weight="fill" /></span>
      <div className="ov-sell-body">
        <span className="ov-sell-k">How Kael helps</span>
        <p className="ov-sell-t">{text}</p>
      </div>
    </div>
  )
}

function ReadPattern({ s, read, nm }) {
  if (!read) return null
  const pat = read.meta.corePattern
  const R = READS[pat] || {}
  const P = PATTERNS[pat] || {}
  const illo = ILLOS[s.illo] || ILLOS.reveal
  return (
    <div className="ov-read">
      <Dots step={s.step} />
      <IllustrationPlaceholder name={illo.name} ratio="1x1" desc={illo.desc} small />
      <span className="ov-read-label">Your pattern</span>
      <h1 className="ov-read-title">{read.meta.patternName}</h1>
      <p className="ov-read-line">{withName(R.hero || `[Name], ${P.essence || ''}`, nm)}</p>
      <Sell text={SELLS.pattern} />
    </div>
  )
}

function ReadTriggers({ s, read }) {
  if (!read) return null
  const pat = read.meta.corePattern
  const R = READS[pat] || {}
  const chips = (read.meta.topTriggers || []).slice(0, 3).map((t) => TRIGGER_LABELS[t] || t.replace(/_/g, ' '))
  return (
    <div className="ov-read">
      <Dots step={s.step} />
      <span className="ov-read-label">Your triggers</span>
      <h1 className="ov-read-title">It starts small.</h1>
      {chips.length > 0 && (
        <div className="ov-tchips">
          {chips.map((c) => <span className="ov-tchip" key={c}>{c}</span>)}
        </div>
      )}
      <p className="ov-read-line">{R.trigger || 'A small moment, and the old reaction takes the wheel.'}</p>
      <Sell text={SELLS.triggers} />
    </div>
  )
}

function ReadBelief({ s, read }) {
  if (!read) return null
  const strong = read.meta.beliefConfidence === 'strong'
  const story = strong && BELIEFS[read.meta.coreBelief] ? BELIEFS[read.meta.coreBelief].story : null
  return (
    <div className="ov-read">
      <Dots step={s.step} />
      <span className="ov-read-label">The story underneath</span>
      {story ? (
        <>
          <h1 className="ov-belief-quote">&ldquo;{cap(story)}&rdquo;</h1>
          <p className="ov-read-line">You learned it somewhere. Back then, it made sense.</p>
        </>
      ) : (
        <>
          <h1 className="ov-read-title">There's a quieter story under this pattern.</h1>
          <p className="ov-read-line">It shows itself as you talk. Kael listens for it.</p>
        </>
      )}
      <Sell text={SELLS.belief} />
    </div>
  )
}

function ReadPath({ s, read }) {
  if (!read) return null
  const pat = read.meta.corePattern
  const R = READS[pat] || {}
  const P = PATTERNS[pat] || {}
  const values = read.meta.coreValues || []
  return (
    <div className="ov-read">
      <Dots step={s.step} />
      <span className="ov-read-label">Your path</span>
      {values.length > 0 && (
        <div className="ov-tchips">
          {values.map((v) => <span className="ov-tchip" data-gold key={v}>{v}</span>)}
        </div>
      )}
      <div className="ov-traj-wrap">
        <Trajectory transformation={read.transformation} />
        <div className="ov-poles">
          <span className="ov-pole-a">Reacting</span>
          <span className="ov-pole-b">Responding</span>
        </div>
      </div>
      <p className="ov-read-line">{R.secure || P.secureLine || ''}</p>
      <Sell text={SELLS.path} />
    </div>
  )
}

function Landing({ s, nm }) {
  return (
    <div className="ov-pause">
      <p className="ov-landing">{withName(s.title, nm)}</p>
    </div>
  )
}

const SURFACE_ROWS = [
  { icon: Lightning, t: 'Every trigger, mapped' },
  { icon: Quotes, t: 'The story underneath, named' },
  { icon: Path, t: 'A 7-day path, built for you' },
]
function Surface({ s, nm }) {
  return (
    <div className="ov-pause">
      <span className="ov-kicker">Your full read</span>
      <h1 className="ov-pause-title">{withName(s.title, nm)}</h1>
      {s.sub && <p className="ov-pause-sub">{s.sub}</p>}
      <div className="ov-feats">
        {SURFACE_ROWS.map((r) => (
          <div className="ov-feat" key={r.t}>
            <span className="ov-feat-ic"><r.icon size={19} weight="duotone" /></span>
            <div className="ov-feat-t"><b>{r.t}</b></div>
          </div>
        ))}
      </div>
      <p className="ov-surface-line">And Kael gets sharper with every conversation.</p>
    </div>
  )
}

/* ── trajectory graph (built, inline SVG; a graph, never an illustration) ── */
function Trajectory({ transformation }) {
  const markers = (transformation && transformation.markers) || []
  const W = 320
  const H = 150
  const padX = 30
  const padTop = 18
  const padBottom = 34
  const innerW = W - padX * 2
  const innerH = H - padTop - padBottom
  const xAt = (idx) => padX + (markers.length > 1 ? (idx / (markers.length - 1)) * innerW : innerW / 2)
  const yAt = (t) => padTop + innerH - clamp(t, 0, 1) * innerH
  const pts = markers.map((m, idx) => ({ x: xAt(idx), y: yAt(m.t), label: m.label }))

  const dLine = pts.length
    ? pts
        .map((p, idx) => {
          if (idx === 0) return `M${p.x.toFixed(1)} ${p.y.toFixed(1)}`
          const prev = pts[idx - 1]
          const cx = ((prev.x + p.x) / 2).toFixed(1)
          return `C${cx} ${prev.y.toFixed(1)} ${cx} ${p.y.toFixed(1)} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`
        })
        .join(' ')
    : ''
  const baseline = padTop + innerH
  const dArea = pts.length
    ? `${dLine} L${pts[pts.length - 1].x.toFixed(1)} ${baseline} L${pts[0].x.toFixed(1)} ${baseline} Z`
    : ''

  return (
    <svg className="ov-traj" viewBox={`0 0 ${W} ${H}`} aria-hidden>
      <line x1={padX} y1={baseline} x2={W - padX} y2={baseline} stroke="var(--line-strong)" strokeWidth="1" />
      {dArea && <path className="ov-traj-area" d={dArea} />}
      {pts.map((p, idx) => (
        <g key={p.label} className="ov-traj-mark" style={{ animationDelay: `${0.75 + idx * 0.2}s` }}>
          <circle cx={p.x} cy={p.y} r="5" fill="var(--surface)" stroke="var(--ink)" strokeWidth="1.5" />
          <text className="ov-traj-mlabel" x={p.x} y={baseline + 16} textAnchor={idx === 0 ? 'start' : idx === pts.length - 1 ? 'end' : 'middle'}>{p.label}</text>
        </g>
      ))}
      {pts.length > 0 && (
        <>
          <circle className="ov-traj-ring" cx={pts[0].x} cy={pts[0].y} r="5" />
          <circle className="ov-traj-dot" cx={pts[0].x} cy={pts[0].y} r="3.4" />
        </>
      )}
      {dLine && (
        <path className="ov-traj-line" d={dLine} pathLength="1" style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
      )}
    </svg>
  )
}

/* ── static paywall: VClassic from the Paywall studio (pl- classes) ── */
function PaywallStatic({ onClose }) {
  const [plan, setPlan] = useState('annual')
  const feats = [
    { Ic: InfinityIcon, t: 'Unlimited conversations', s: 'Every spiral and fight, no caps' },
    { Ic: Brain, t: 'Kael remembers everything', s: 'Your people and patterns, never re-explain' },
    { Ic: ArrowsClockwise, t: 'Spot the patterns you repeat', s: 'The triggers and beliefs running underneath' },
    { Ic: Anchor, t: 'Build a secure foundation', s: 'Steadier reactions, one moment at a time' },
  ]
  return (
    <div className="ob-screen pl-screen" data-theme="light">
      <button className="pl-x" aria-label="Close" onClick={onClose}>
        <X size={20} weight="regular" />
      </button>
      <div className="pl-body">
        <p className="pl-kicker">01 · The Secure Plan</p>
        <h1 className="pl-title">The Secure Plan</h1>
        <p className="pl-lede">Unlimited access to the coach who remembers your whole story.</p>
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
