import { useCallback, useMemo, useRef, useState, useEffect } from 'react'
import { PaperPlaneTilt, Sparkle, Check } from '@phosphor-icons/react'

/* ──────────────────────────────────────────────────────────────────────────
   Kael V3 — Adaptive Therapy Session (PRD build).

   Conversation is the spine. After every answer a state estimate updates
   (arousal, rumination, shame, stuckness); the director picks a hidden
   objective (regulate / defuse / soften / activate) and selects the next
   interaction to serve it. Modules follow the PRD lifecycle exactly:
   Offer (why now, why this, duration) → Consent (yes / maybe later /
   not today / tell me more) → Experience → Harvest (PRD scale + free
   text) → Return (reconnect to the conversation). Declining is never
   failure; everything tried or declined lands in intervention memory and
   the artifact. The sky still runs night → dawn: emotional choreography.

   Local director now; the decision points are the model's union contract
   when this graduates. Reuses the md- immersive system.
   ────────────────────────────────────────────────────────────────────────── */

const TYPE_SPEED = 24
const DOT_MS = 650
const GAP_MS = 380

/* ── choreography: palette per interaction mode, arc by session stage ───── */
const MOOD = {
  night:   { bg: ['#070b16', '#0d1526', '#0a101d'], g: '#8fb8d8' },
  talk:    { bg: ['#0b1222', '#16253c', '#0e1728'], g: '#8fb8d8' },
  body:    { bg: ['#120f26', '#251c44', '#171331'], g: '#b8a0e8' },
  breath:  { bg: ['#0b2231', '#164156', '#0e2a3b'], g: '#7ec8d8' },
  lesson:  { bg: ['#1f1808', '#3a2e12', '#282010'], g: '#e8c078' },
  mind:    { bg: ['#1c1524', '#332643', '#251b30'], g: '#c8a0d8' },
  stream:  { bg: ['#122622', '#204438', '#17302a'], g: '#88d8c0' },
  soften:  { bg: ['#241722', '#41283a', '#2e1d2c'], g: '#e0a8b8' },
  act:     { bg: ['#1a2415', '#2f4224', '#22301b'], g: '#b0d890' },
  ground:  { bg: ['#15271c', '#274733', '#1b3325'], g: '#a8d8b0' },
  predawn: { bg: ['#2c2536', '#4a3f52', '#352e41'], g: '#e0b8b0' },
  dawn:    { bg: ['#4a3548', '#8a5f5a', '#5c4350'], g: '#f2d0a0' },
}

/* ── continuous state estimation (local stand-in for the model's) ───────── */
const KW = {
  arousal: ['chest', 'heart', 'racing', 'tight', 'panic', 'edge', 'shaking', "can't sit", 'wired', 'restless'],
  rum: ['loop', 'replay', 'over and over', "can't stop", 'keeps coming', 'again and again', 'head', 'spiral'],
  shame: ['ashamed', 'stupid', 'my fault', 'hate myself', 'embarrass', 'pathetic', 'weak', 'failure'],
  stuck: ['stuck', 'pointless', 'no point', 'numb', 'tired of', 'nothing works', "can't move", 'give up'],
}
const scoreText = (t) => {
  const v = (t || '').toLowerCase()
  const s = { arousal: 0, rum: 0, shame: 0, stuck: 0 }
  Object.entries(KW).forEach(([k, ws]) => ws.forEach((w) => { if (v.includes(w)) s[k] += 1 }))
  return s
}
const topSignal = (S) => Object.entries(S).sort((a, b) => b[1] - a[1])[0]
const OBJECTIVE = { arousal: 'reduce arousal', rum: 'loosen the loop', shame: 'soften self-attack', stuck: 'restore agency' }

/* ── chat engine (time-based, throttle-proof) ───────────────────────────── */
function useChatScript(items, speed = TYPE_SPEED, delay = 420) {
  const key = items.map((i) => i.text).join('')
  const spans = useMemo(() => {
    let t = delay
    return items.map((it) => {
      const dotsAt = t; t += DOT_MS
      const typeAt = t; t += it.text.length * speed + GAP_MS
      return { dotsAt, typeAt }
    })
  }, [key, speed, delay]) // eslint-disable-line react-hooks/exhaustive-deps
  const total = items.length ? spans[items.length - 1].typeAt + items[items.length - 1].text.length * speed : 0
  const [t, setT] = useState(0)
  const rushRef = useRef(false)
  useEffect(() => {
    rushRef.current = false
    setT(0)
    if (!total) return undefined
    const t0 = performance.now()
    const id = setInterval(() => {
      if (rushRef.current) { setT(total); clearInterval(id); return }
      const e = performance.now() - t0
      setT(e)
      if (e >= total) clearInterval(id)
    }, 40)
    return () => clearInterval(id)
  }, [key, total]) // eslint-disable-line react-hooks/exhaustive-deps
  const bubbles = items.map((it, i) => {
    const sp = spans[i]
    if (t < sp.dotsAt) return { ...it, state: 'hidden', shown: '' }
    if (t < sp.typeAt) return { ...it, state: 'dots', shown: '' }
    const chars = Math.floor((t - sp.typeAt) / speed)
    if (chars < it.text.length) return { ...it, state: 'typing', shown: it.text.slice(0, Math.max(0, chars)) }
    return { ...it, state: 'done', shown: it.text }
  })
  const allDone = total === 0 || t >= total
  const finish = useCallback(() => { rushRef.current = true; setT(total) }, [total])
  return { bubbles, allDone, finish }
}

const Orb = ({ size = 10 }) => <span className="md-orbdot" style={{ width: size, height: size }} aria-hidden="true" />
const Dots = () => <span className="md-dots" aria-label="Kael is typing"><i /><i /><i /></span>
const newestOf = (bubbles) => bubbles.reduce((a, b, k) => (b.state !== 'hidden' ? k : a), -1)

function KaelRow({ bubble, withAvatar }) {
  if (bubble.state === 'hidden') return null
  return (
    <div className="md-row">
      {withAvatar ? <span className="md-av"><Sparkle size={10} weight="fill" /></span> : <span className="md-av-ghost" />}
      {bubble.state === 'dots' ? (
        <span className="md-bubble md-bk md-bdots"><Dots /></span>
      ) : (
        <p className="md-bubble md-bk">{bubble.shown}{bubble.state === 'typing' && <i className="md-caret" />}</p>
      )}
    </div>
  )
}
const UserBubble = ({ text }) => (text ? <p className="md-bubble md-bu">{text}</p> : null)

function Particles({ glow, n = 18 }) {
  const dots = useMemo(() => Array.from({ length: n }, (_, k) => ({
    x: (k * 37 + 11) % 100, delay: (k * 1.9) % 16, dur: 18 + ((k * 5) % 14), size: 1.5 + ((k * 7) % 3),
  })), [n])
  return (
    <div className="md-particles" aria-hidden="true">
      {dots.map((d, k) => (
        <i key={k} style={{ left: `${d.x}%`, width: d.size, height: d.size, background: glow, animationDelay: `-${d.delay}s`, animationDuration: `${d.dur}s` }} />
      ))}
    </div>
  )
}

const frag = (t = '', max = 42) => {
  const v = String(t).trim().replace(/\s+/g, ' ')
  if (v.length <= max) return v
  const cut = v.slice(0, max)
  const sp = cut.lastIndexOf(' ')
  return `${(sp > 20 ? cut.slice(0, sp) : cut).trim()}…`
}
const low = (t = '') => { const v = frag(t); return v ? v.charAt(0).toLowerCase() + v.slice(1) : v }

/* ── generic screens ────────────────────────────────────────────────────── */

function MeetScreen({ onNext }) {
  return (
    <div className="md-screen md-meet">
      <div className="md-mid">
        <span className="md-hero-orb" aria-hidden="true"><i /><i /><i /></span>
        <h1 className="md-hero-t">The night is loud.<br />Come in anyway.</h1>
        <p className="md-hero-s">I'm Kael. One real session, right now. We work until it gets lighter.</p>
      </div>
      <div className="md-foot">
        <button className="md-cta" onClick={onNext}>Begin tonight's session</button>
      </div>
    </div>
  )
}

function AskScreen({ echo, ack, question, options = [], placeholder, onAnswer }) {
  const items = useMemo(() => {
    const list = []
    if (ack) list.push({ text: ack })
    if (question) list.push({ text: question })
    return list
  }, [ack, question])
  const { bubbles, allDone, finish } = useChatScript(items)
  const [draft, setDraft] = useState('')
  const [picked, setPicked] = useState(null)
  const pick = (o) => { if (picked) return; setPicked(o.label); setTimeout(() => onAnswer(o.label, o, false), 380) }
  const send = () => {
    const v = draft.trim()
    if (!v || picked || !allDone) return
    setPicked(v); setTimeout(() => onAnswer(v, null, true), 300)
  }
  return (
    <div className="md-screen" onClick={finish}>
      <div className="md-chat">
        {echo && <UserBubble text={echo} />}
        {bubbles.map((b, k) => <KaelRow key={k} bubble={b} withAvatar={k === newestOf(bubbles)} />)}
        {allDone && options.length > 0 && (
          <div className="md-chips">
            {options.map((o, k) => (
              <button key={o.label} className="md-chip" style={{ '--d': `${0.07 * k + 0.08}s` }}
                data-on={picked === o.label || undefined}
                data-dim={picked && picked !== o.label ? true : undefined}
                onClick={(e) => { e.stopPropagation(); pick(o) }}>
                {o.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="md-foot">
        <div className="md-composer">
          <input value={draft} placeholder={placeholder} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send() }} />
          <button className="md-send" data-on={draft.trim().length > 0 || undefined} onClick={send} aria-label="Send">
            <PaperPlaneTilt size={15} weight="fill" />
          </button>
        </div>
      </div>
    </div>
  )
}

/* Offer per PRD: why now, why this, duration; consent is four ways and
   declining continues the conversation without ceremony. */
function OfferScreen({ echo, lines, more, yesLabel, onConsent }) {
  const [expanded, setExpanded] = useState(false)
  const items = useMemo(() => {
    const base = lines.map((text) => ({ text }))
    if (expanded && more) base.push(...more.map((text) => ({ text })))
    return base
  }, [lines, more, expanded])
  const { bubbles, allDone, finish } = useChatScript(items)
  const opts = expanded
    ? [{ label: yesLabel, v: 'yes' }, { label: 'Not today', v: 'no' }]
    : [{ label: yesLabel, v: 'yes' }, { label: 'Maybe later', v: 'later' }, { label: 'Not today', v: 'no' }, ...(more ? [{ label: 'Tell me more', v: 'more' }] : [])]
  const [picked, setPicked] = useState(null)
  const pick = (o) => {
    if (picked) return
    if (o.v === 'more') { setExpanded(true); return }
    setPicked(o.label)
    setTimeout(() => onConsent(o.v), 380)
  }
  return (
    <div className="md-screen" onClick={finish}>
      <div className="md-chat">
        {echo && <UserBubble text={echo} />}
        {bubbles.map((b, k) => <KaelRow key={k} bubble={b} withAvatar={k === newestOf(bubbles)} />)}
        {allDone && (
          <div className="md-chips">
            {opts.map((o, k) => (
              <button key={o.label} className="md-chip" style={{ '--d': `${0.07 * k + 0.08}s` }}
                data-on={picked === o.label || undefined}
                data-dim={picked && picked !== o.label ? true : undefined}
                onClick={(e) => { e.stopPropagation(); pick(o) }}>
                {o.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="md-foot" />
    </div>
  )
}

/* ── experiences (full screen, minimal UI) ──────────────────────────────── */

const PATTERNS = {
  box: { name: 'Box breathing', phases: [{ label: 'Breathe in', s: 4, grow: true }, { label: 'Hold', s: 4, hold: true }, { label: 'Out, slowly', s: 4 }, { label: 'Hold', s: 4, hold: true }], rounds: 3, idle: '4 · 4 · 4 · 4' },
  '478': { name: '4-7-8 breathing', phases: [{ label: 'Breathe in', s: 4, grow: true }, { label: 'Hold', s: 7, hold: true }, { label: 'Out, long and slow', s: 8 }], rounds: 3, idle: '4 · 7 · 8' },
}
function BreathModule({ pattern = 'box', onDone, onSkip }) {
  const P = PATTERNS[pattern]
  const [on, setOn] = useState(false)
  const [ph, setPh] = useState(0)
  const [left, setLeft] = useState(P.phases[0].s)
  const [round, setRound] = useState(0)
  useEffect(() => {
    if (!on || round >= P.rounds) return undefined
    const iv = setInterval(() => {
      setLeft((l) => {
        if (l > 1) return l - 1
        setPh((p) => {
          const nxt = (p + 1) % P.phases.length
          if (nxt === 0) setRound((r) => r + 1)
          setLeft(P.phases[nxt].s)
          return nxt
        })
        return P.phases[(ph + 1) % P.phases.length].s
      })
    }, 1000)
    return () => clearInterval(iv)
  }, [on, ph, round]) // eslint-disable-line react-hooks/exhaustive-deps
  const done = round >= P.rounds
  const cur = P.phases[ph]
  const grown = cur.hold ? P.phases[(ph - 1 + P.phases.length) % P.phases.length].grow : cur.grow
  return (
    <div className="md-screen md-center">
      <span className="md-k">Together · ninety seconds</span>
      <h1 className="md-mt">Breathe with it.</h1>
      <div className="md-breathwrap">
        <div className="md-breath" data-grow={on && !done && grown ? 'true' : undefined} style={{ '--dur': `${cur.s}s` }}>
          <i /><i /><i />
          <div className="md-breath-in">
            {done ? <span className="md-breath-done"><Check size={26} weight="bold" /></span>
              : on ? <><b>{left}</b><span>{cur.label}</span></>
                : <span className="md-breath-idle">{P.idle}</span>}
          </div>
        </div>
        <div className="md-rounds">{Array.from({ length: P.rounds }).map((_, k) => <i key={k} data-on={k < round || undefined} />)}</div>
      </div>
      <div className="md-foot">
        {!on && !done ? <button className="md-cta" onClick={() => setOn(true)}>Start</button>
          : <button className="md-cta" data-wait={!done || undefined} onClick={onDone}>Done</button>}
        {!done && <button className="md-quiet" onClick={onSkip}>This isn't landing, let's talk instead</button>}
      </div>
    </div>
  )
}

const ZONES = [
  { id: 'Head', cx: 60, cy: 26 }, { id: 'Jaw', cx: 60, cy: 47 },
  { id: 'Chest', cx: 60, cy: 78 }, { id: 'Stomach', cx: 60, cy: 108 },
  { id: 'Hands', cx: 26, cy: 116 }, { id: 'Hands ', cx: 94, cy: 116 },
]
function BodyTapModule({ onDone, onSkip }) {
  const [picked, setPicked] = useState([])
  const toggle = (z) => {
    const id = z.trim()
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))
  }
  return (
    <div className="md-screen md-center">
      <span className="md-k">Together · twenty seconds</span>
      <h1 className="md-mt">Show me where it lives.</h1>
      <p className="md-ms">Tap the body. Everywhere it sits lights up.</p>
      <div className="md-figure">
        <svg viewBox="0 0 120 160" aria-hidden="true">
          <circle className="md-fig-line" cx="60" cy="26" r="14" />
          <path className="md-fig-line" d="M60 44 C 38 48 30 66 30 88 L 30 118 C 30 140 44 150 60 150 C 76 150 90 140 90 118 L 90 88 C 90 66 82 48 60 44 Z" />
          {ZONES.map((z) => (
            <g key={z.id + z.cx} onClick={() => toggle(z.id)} className="md-zone" data-on={picked.includes(z.id.trim()) || undefined}>
              <circle className="md-zone-halo" cx={z.cx} cy={z.cy} r="14" />
              <circle className="md-zone-dot" cx={z.cx} cy={z.cy} r="3.5" />
            </g>
          ))}
        </svg>
        <div className="md-zone-tags">{picked.map((z) => <span key={z} className="md-ztag">{z}</span>)}</div>
      </div>
      <div className="md-foot">
        <button className="md-cta" data-wait={picked.length === 0 || undefined} onClick={() => onDone(picked)}>That's where</button>
        <button className="md-quiet" onClick={onSkip}>Skip this one</button>
      </div>
    </div>
  )
}

const LESSONS = {
  rum: {
    title: 'Your brain treats replaying as problem solving.',
    beats: [
      'The replay feels like work because the same circuits that plan also ruminate. Your brain believes one more pass will crack it.',
      'But a replay has no new information in it. It is the same tape, and every pass deepens the groove instead of solving anything.',
      'So the loop you carry is not a character flaw. It is a planning system running on empty, trying to protect you.',
    ],
  },
  arousal: {
    title: 'Your body is answering a question nobody asked it.',
    beats: [
      'The tight chest and the racing head are your threat system doing its one job: preparing you to survive something physical.',
      'But tonight there is no tiger. The alarm is real; the emergency is not. The body cannot tell the difference on its own.',
      'That is why we slow the body first. You cannot think your way out of a state your body is still in.',
    ],
  },
  shame: {
    title: 'The harshest voice in the room is not the truest one.',
    beats: [
      'Self-attack feels like honesty because it is loud and fast. Speed and volume are not evidence.',
      'That voice formed to keep you safe: hit yourself first and maybe the world hits softer. It is protection, with a cost.',
      'You can take the data and leave the cruelty. What it points at can matter; how it says it never has to.',
    ],
  },
  stuck: {
    title: 'Motivation follows motion, not the other way around.',
    beats: [
      'Stuck feels like a motivation problem, so you wait to feel ready. The readiness rarely comes first.',
      'The research is boring and consistent: action changes state, then state changes thought. Two minutes of anything counts.',
      'So we will not aim for momentum tonight. We will aim for one small, done thing.',
    ],
  },
}
function LessonModule({ lesson, onDone }) {
  const L = LESSONS[lesson] || LESSONS.rum
  const [at, setAt] = useState(0)
  return (
    <div className="md-screen md-center">
      <span className="md-k">One idea · one minute</span>
      <h1 className="md-mt">{L.title}</h1>
      <div className="md-beats">
        {L.beats.slice(0, at + 1).map((t, k) => (
          <p key={k} className="md-beat" data-last={k === 2 || undefined}>{t}</p>
        ))}
      </div>
      <div className="md-foot">
        {at < L.beats.length - 1
          ? <button className="md-cta" onClick={() => setAt((x) => x + 1)}>Go on</button>
          : <button className="md-cta" onClick={onDone}>That makes sense</button>}
      </div>
    </div>
  )
}

function CbtModule({ thought, onDone, onSkip }) {
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const tilt = Math.max(-6, Math.min(6, (b.length - a.length) / 12))
  return (
    <div className="md-screen md-center">
      <span className="md-k">Together · two minutes</span>
      <h1 className="md-mt md-quote-t">"{thought}"</h1>
      <p className="md-ms">The thought that keeps it running. Weigh it honestly.</p>
      <span className="md-beam" style={{ transform: `rotate(${tilt}deg)` }} aria-hidden="true" />
      <div className="md-panes">
        <label className="md-pane">
          <span>What tells you it's true?</span>
          <textarea rows={3} value={a} onChange={(e) => setA(e.target.value)} placeholder="whatever is actually there…" />
        </label>
        <label className="md-pane">
          <span>And what doesn't fit it?</span>
          <textarea rows={3} value={b} onChange={(e) => setB(e.target.value)} placeholder="take your time with this one…" />
        </label>
      </div>
      <div className="md-foot">
        <button className="md-cta" onClick={() => onDone(`For: ${a.trim() || '(nothing)'} / Against: ${b.trim() || '(nothing)'}`)}>Done</button>
        <button className="md-quiet" onClick={onSkip}>Skip this one</button>
      </div>
    </div>
  )
}

function LeavesModule({ thought, onDone }) {
  const [at, setAt] = useState(0)
  const steps = [
    'Here is the thought, on a leaf. Hold it there a moment.',
    'Now say it to yourself as: "I am having the thought that…"',
    'And let the stream take it. You are the bank, not the leaf.',
  ]
  return (
    <div className="md-screen md-center">
      <span className="md-k">Together · one minute</span>
      <h1 className="md-mt">Leaves on a stream.</h1>
      <div className="md-stream">
        <span className="md-streamline" aria-hidden="true" />
        {[0, 1, 2, 3].map((k) => <span key={k} className="md-leaf" style={{ '--i': k }} aria-hidden="true" />)}
        <span className="md-leaf md-leaf-thought" data-away={at >= 2 || undefined}><em>"{frag(thought, 34)}"</em></span>
      </div>
      <p className="md-ms md-stream-step" key={at}>{steps[Math.min(at, 2)]}</p>
      <div className="md-foot">
        {at < 2 ? <button className="md-cta" onClick={() => setAt((x) => x + 1)}>Next</button>
          : <button className="md-cta" onClick={onDone}>It drifted</button>}
      </div>
    </div>
  )
}

const COMPASSION = [
  'Put a hand where it hurts, or over your chest. Actually do it; I will wait.',
  'Now, quietly: "This is a moment of struggle. Everyone who has ever mattered to me has had one exactly like it."',
  'And once more, slower: "May I be easy with myself tonight. I am the one carrying this."',
]
function CompassionModule({ onDone, onSkip }) {
  const [at, setAt] = useState(0)
  return (
    <div className="md-screen md-center">
      <span className="md-k">Together · one minute</span>
      <h1 className="md-mt">A word with the harsh voice.</h1>
      <div className="md-beats">
        {COMPASSION.slice(0, at + 1).map((t, k) => (
          <p key={k} className="md-beat" data-last={k === 2 || undefined}>{t}</p>
        ))}
      </div>
      <div className="md-foot">
        {at < COMPASSION.length - 1
          ? <button className="md-cta" onClick={() => setAt((x) => x + 1)}>Done, go on</button>
          : <button className="md-cta" onClick={onDone}>That was hard, and I did it</button>}
        <button className="md-quiet" onClick={onSkip}>Too much right now</button>
      </div>
    </div>
  )
}

const ACTIONS = [
  'Put my phone in another room', 'Drink a glass of water, slowly', 'Open the window for one minute',
  'Write the thought on paper and close the notebook', 'Text one person "thinking of you"',
]
const WHENS = ['Right after this session', 'Before I sleep tonight', 'When the loop starts again']
function ActionModule({ onDone, onSkip }) {
  const [act, setAct] = useState(null)
  const [when, setWhen] = useState(null)
  return (
    <div className="md-screen md-center">
      <span className="md-k">One commitment · two minutes of your night</span>
      <h1 className="md-mt">Small enough to actually happen.</h1>
      <p className="md-ms">Not a plan to fix your life. One tiny move, tied to a moment.</p>
      <div className="md-chips" style={{ paddingLeft: 0, width: '100%' }}>
        {ACTIONS.map((a, k) => (
          <button key={a} className="md-chip" style={{ '--d': `${0.05 * k}s` }} data-on={act === a || undefined} data-dim={act && act !== a ? true : undefined} onClick={() => setAct(a)}>{a}</button>
        ))}
      </div>
      {act && (
        <div className="md-chips" style={{ paddingLeft: 0, width: '100%' }}>
          {WHENS.map((w, k) => (
            <button key={w} className="md-chip" style={{ '--d': `${0.05 * k}s` }} data-on={when === w || undefined} data-dim={when && when !== w ? true : undefined} onClick={() => setWhen(w)}>{w}</button>
          ))}
        </div>
      )}
      <div className="md-foot">
        <button className="md-cta" data-wait={!(act && when) || undefined} onClick={() => onDone({ act, when })}>That, I can do</button>
        <button className="md-quiet" onClick={onSkip}>Not tonight</button>
      </div>
    </div>
  )
}

const GROUND = [
  ['five', 'things you can see, right now, from where you are'],
  ['four', 'things you can feel. The chair under you counts'],
  ['three', 'things you can hear, near or far'],
  ['two', 'things you can smell, or would want to'],
  ['one', 'thing you can taste'],
]
function GroundModule({ onDone }) {
  const [at, setAt] = useState(0)
  const n = 5 - at
  return (
    <div className="md-screen md-center">
      <span className="md-k">Landing · one minute</span>
      <h1 className="md-mt">Come back to the room.</h1>
      <div className="md-const">
        {Array.from({ length: n }).map((_, k) => (
          <i key={`${at}-${k}`} className="md-star" style={{ '--d': `${k * 0.12}s`, left: `${16 + ((k * 61) % 66)}%`, top: `${18 + ((k * 37) % 58)}%` }} />
        ))}
      </div>
      <p className="md-ground-line" key={at}><b>{GROUND[Math.min(at, 4)][0]}</b> {GROUND[Math.min(at, 4)][1]}.</p>
      <div className="md-foot">
        {at < GROUND.length - 1 ? <button className="md-cta" onClick={() => setAt((x) => x + 1)}>Named them</button>
          : <button className="md-cta" onClick={onDone}>I'm here</button>}
      </div>
    </div>
  )
}

function BuildScreen({ quote, onDone }) {
  const [pct, setPct] = useState(0)
  const startRef = useRef(performance.now())
  const stages = useMemo(() => ['Reading what you told me', `Sitting with "${quote}"`, 'Writing tonight down'], [quote])
  useEffect(() => {
    const iv = setInterval(() => {
      const sec = (performance.now() - startRef.current) / 1000
      const v = 100 * (1 - Math.exp(-sec / 1.8))
      setPct((p) => Math.max(p, v >= 99.5 ? 100 : v))
    }, 60)
    return () => clearInterval(iv)
  }, [])
  useEffect(() => {
    if (pct >= 100) { const t = setTimeout(onDone, 450); return () => clearTimeout(t) }
    return undefined
  }, [pct, onDone])
  const idx = Math.min(stages.length - 1, Math.floor((pct / 100) * stages.length))
  return (
    <div className="md-screen md-center md-build">
      <span className="md-hero-orb md-orb-sm" aria-hidden="true"><i /><i /><i /></span>
      <span className="md-pct">{Math.round(pct)}%</span>
      <p key={idx} className="md-ms md-rise">{stages[idx]}</p>
    </div>
  )
}

function ArtifactScreen({ a, onRestart }) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })
  return (
    <div className="md-screen">
      <div className="md-art-scroll">
        <div className="md-sheet">
          <header className="md-sheet-head">
            <span className="md-sheet-k">Session One</span>
            <span className="md-sheet-d">{today}</span>
          </header>
          <h1 className="md-sheet-t">{a.title}</h1>
          <p className="md-sheet-sum">{a.summary}</p>
          <section><span className="md-sheet-l">What happened</span><p>{a.happened}</p></section>
          <section><span className="md-sheet-l">Emotions explored</span><p>{a.emotions}</p></section>
          <section><span className="md-sheet-l">A pattern noticed</span><p>{a.pattern}</p></section>
          <section>
            <span className="md-sheet-l">What we tried</span>
            <div className="md-sheet-chips">
              {a.tried.map((t) => <span key={t.name}><Check size={11} weight="bold" />{t.name}{t.felt ? ` · ${t.felt.toLowerCase()}` : ''}</span>)}
            </div>
            <p>{a.triedNote}</p>
          </section>
          <section><span className="md-sheet-l">A new angle</span><p>{a.perspective}</p></section>
          <section><span className="md-sheet-l">One commitment</span><p><b>{a.commit}</b> {a.commitWhen}</p></section>
          <section><span className="md-sheet-l">If you write one line tomorrow</span><p>{a.prompt}</p></section>
          <footer><p>{a.note}</p><span className="md-sheet-sign">— Kael</span></footer>
        </div>
        <p className="md-saved">Saved to your Journey. Next session starts knowing all of this.</p>
      </div>
      <div className="md-foot">
        <button className="md-cta" onClick={onRestart}>This sounds like me</button>
      </div>
    </div>
  )
}

/* ── the director ───────────────────────────────────────────────────────── */
/* Conversation beats; each option carries its signal contribution. */
const ASKS = {
  opening: {
    mood: 'talk',
    question: "What's got you tonight?",
    placeholder: 'however it comes out…',
    options: [
      { label: "I can't switch my head off", sig: { rum: 2 } },
      { label: 'Today just sat on me', sig: { arousal: 1, stuck: 1 } },
      { label: "A conversation I can't put down", sig: { rum: 2 } },
      { label: "I don't know, everything", sig: { arousal: 1, stuck: 1 } },
    ],
  },
  feel: {
    mood: 'talk',
    question: "And what's the feeling under it?",
    placeholder: 'or your own word…',
    options: [
      { label: 'On edge', sig: { arousal: 2 } },
      { label: 'Worn out', sig: { stuck: 2 } },
      { label: 'Kind of ashamed', sig: { shame: 2 } },
      { label: "I can't name it", sig: {} },
    ],
  },
  people: {
    mood: 'talk',
    question: 'Who else knows tonight feels like this?',
    placeholder: 'a name, or no one…',
    options: [
      { label: 'One person, sort of', sig: {} },
      { label: 'People know pieces', sig: {} },
      { label: 'Nobody, really', sig: { shame: 1 } },
    ],
  },
  cost: {
    mood: 'talk',
    question: 'What does it cost you that nobody sees?',
    placeholder: 'the private bill…',
    options: [
      { label: 'Sleep, mostly', sig: { arousal: 1 } },
      { label: 'Patience with people I love', sig: {} },
      { label: 'Believing my own judgment', sig: { shame: 1 } },
      { label: "I'd rather not say", sig: {} },
    ],
  },
  thought: {
    mood: 'mind',
    question: 'Say the thought that runs the loop. The exact words.',
    placeholder: "it usually starts with 'I should have'…",
    options: [
      { label: 'I should have said it differently', sig: { rum: 1 } },
      { label: 'They think less of me now', sig: { shame: 1 } },
      { label: 'If I stop thinking about it, something breaks', sig: { rum: 1 } },
    ],
  },
  keep: {
    mood: 'predawn',
    question: "What's one thing from tonight you want to keep?",
    placeholder: 'a line, a feeling, a fact…',
    options: [
      { label: 'The half step of distance', sig: {} },
      { label: 'That the loop is protection, not a flaw', sig: {} },
      { label: 'Saying it out loud at all', sig: {} },
    ],
  },
  want: {
    mood: 'predawn',
    question: 'Last one. What would lighter look like, just for tonight?',
    placeholder: 'be greedy about it…',
    options: [
      { label: 'Falling asleep without the replay', sig: {} },
      { label: 'One hour where my chest unclenches', sig: {} },
      { label: 'Not snapping at anyone', sig: {} },
    ],
  },
}

const HARVEST_OPTS = [
  { label: 'Not at all' }, { label: 'A little' }, { label: 'Quite a bit' }, { label: 'Made things worse' },
]
const RETURN_LINES = {
  'Not at all': 'Fair, and useful to know. Not every tool is yours. Back to what matters:',
  'A little': 'A little is real. Notice it before your head starts again. Now, back to it:',
  'Quite a bit': 'Good. Remember what your body just did; it can do it again. Back to it:',
  'Made things worse': 'I believe you, and that goes in your file: not this tool, not for you. We talk instead:',
}

export default function SessionV3() {
  const [mode, setModeRaw] = useState({ t: 'meet' })
  const lockRef = useRef(0)
  const setMode = (m) => {
    const now = performance.now()
    if (now - lockRef.current < 400) return
    lockRef.current = now
    setModeRaw(m)
  }
  const [name, setName] = useState('')
  const [ans, setAns] = useState({})
  const S = useRef({ arousal: 0, rum: 0, shame: 0, stuck: 0 })
  const [est, setEst] = useState({ arousal: 0, rum: 0, shame: 0, stuck: 0 })
  const [tried, setTried] = useState([]) // {name, felt} — intervention memory
  const doneRef = useRef(new Set())

  const absorb = (opt, typed, text) => {
    const add = typed ? scoreText(text) : (opt?.sig || {})
    Object.entries(add).forEach(([k, v]) => { S.current[k] += v })
    setEst({ ...S.current })
  }
  const record = (nm, felt) => setTried((p) => [...p.filter((x) => x.name !== nm), { name: nm, felt }])
  const A = (k, v, typed) => setAns((p) => ({ ...p, [k]: { v, typed } }))

  const quote = ans.opening?.typed ? low(ans.opening.v) : (ans.opening?.v || '').toLowerCase()
  const thought = frag(ans.thought?.v, 44) || 'I should have said it differently'
  const objective = OBJECTIVE[topSignal(est)[0]]

  /* the hidden spine: what the session still wants to do, in PRD stages */
  const decide = (after) => {
    const st = S.current
    const done = doneRef.current
    const mark = (x) => done.add(x)
    switch (after) {
      case 'meet': return { t: 'ask', q: 'name' }
      case 'name': return { t: 'ask', q: 'opening' }
      case 'opening': return { t: 'ask', q: 'feel' }
      case 'feel': {
        /* objective: reduce arousal first — you cannot think your way out
           of a state the body is still in */
        if (st.arousal >= 2 && !done.has('breath')) { mark('breath'); return { t: 'offer', mod: st.arousal >= 3 ? 'breath478' : 'breathBox' } }
        mark('bodyoffer'); return { t: 'mod', mod: 'bodytap' }
      }
      case 'regulated': return done.has('bodyoffer') ? { t: 'ask', q: 'people' } : (doneRef.current.add('bodyoffer'), { t: 'mod', mod: 'bodytap' })
      case 'bodytap': return { t: 'ask', q: 'people' }
      case 'people': return { t: 'ask', q: 'cost' }
      case 'cost': return { t: 'noticing' }
      case 'noticing': return { t: 'ask', q: 'thought' }
      case 'thought': {
        if (!done.has('cog')) { mark('cog'); return { t: 'offer', mod: st.shame >= 2 ? 'leaves' : 'scales' } }
        return { t: 'lesson' }
      }
      case 'cognition': return { t: 'lesson' }
      case 'lesson': {
        if (st.shame >= 2 && !done.has('soften')) { mark('soften'); return { t: 'offer', mod: 'compassion' } }
        return { t: 'offer', mod: 'action' }
      }
      case 'soften': return { t: 'offer', mod: 'action' }
      case 'action': {
        if (st.arousal >= 2 && !tried.find((x) => x.name === 'The breath' && (x.felt === 'A little' || x.felt === 'Quite a bit'))) return { t: 'mod', mod: 'ground' }
        return { t: 'ask', q: 'keep' }
      }
      case 'ground': return { t: 'ask', q: 'keep' }
      case 'keep': return { t: 'ask', q: 'want' }
      case 'want': return { t: 'build' }
      default: return { t: 'ask', q: 'keep' }
    }
  }

  /* offers: why now (their words), why this, duration — per PRD */
  const OFFERS = {
    breathBox: {
      name: 'The breath', mood: 'breath', yes: "Let's try it",
      lines: () => [
        `${frag(ans.feel?.v || 'That')}. I keep hearing your body in this, not just your head.`,
        'Before we go further, ninety seconds of slow breathing. It lowers the alarm enough that the rest of tonight can actually land.',
      ],
      more: ['Four counts in, four held, four out, four held. Three rounds, and I count with you. Nothing to get right.'],
    },
    breath478: {
      name: 'The breath', mood: 'breath', yes: "Let's try it",
      lines: () => [
        `${frag(ans.feel?.v || 'That')}, and it sounds like your body is very loud right now.`,
        'There is a slower pattern, 4-7-8, built for exactly this much charge. Ninety seconds, and the long exhale does the work.',
      ],
      more: ['In for four, held for seven, out for eight. The exhale is the brake pedal. Three rounds, I count with you.'],
    },
    scales: {
      name: 'The scales', mood: 'mind', yes: 'Weigh it',
      lines: () => [
        `"${thought}". That sentence is doing a lot of driving tonight.`,
        'Two minutes: we put it on the scales. Evidence for, evidence against, in your own words. You read the verdict, not me.',
      ],
      more: ['It is one screen with two boxes. You write what actually supports the thought, then what does not fit it. Most thoughts weigh less in writing.'],
    },
    leaves: {
      name: 'The stream', mood: 'stream', yes: 'Show me',
      lines: () => [
        `"${thought}". We are not going to argue with it; arguing feeds it.`,
        'One minute instead on making space: the thought goes on a leaf, and you watch it move. Distance, not debate.',
      ],
      more: ['It is an old acceptance exercise. You do not have to believe or disbelieve anything. You just practice being the person watching, not the thought.'],
    },
    compassion: {
      name: 'The soft word', mood: 'soften', yes: 'Okay, with you',
      lines: () => [
        'One more thing before we plan anything. The way you talk about yourself tonight has teeth in it.',
        'Sixty seconds of the opposite, said on purpose. It is uncomfortable and it works. I will keep it small.',
      ],
      more: ['Hand somewhere kind, three slow lines said quietly to yourself. Nobody watches. It rewires the tone, not the facts.'],
    },
    action: {
      name: 'One small move', mood: 'act', yes: 'Build it',
      lines: () => [
        'Insight fades by morning unless it lands in the body or the calendar.',
        'Last piece of work tonight: one move small enough to actually happen, tied to a moment you will recognize.',
      ],
      more: ['You pick the move and the moment; I remember both. Tomorrow it is either done or it is data. Both count.'],
    },
  }

  const restart = () => { setModeRaw({ t: 'meet' }); setName(''); setAns({}); S.current = { arousal: 0, rum: 0, shame: 0, stuck: 0 }; setEst({ ...S.current }); setTried([]); doneRef.current = new Set() }

  const artifact = useMemo(() => {
    if (mode.t !== 'artifact') return null
    const feltGood = tried.filter((x) => x.felt === 'A little' || x.felt === 'Quite a bit')
    const emotions = [ans.feel?.v, S.current.shame >= 2 ? 'and something heavier under it that talks to you harshly' : null].filter(Boolean).join(', ')
    return {
      title: 'The night it got lighter',
      summary: `One session · ${tried.length} things tried · objective: ${objective}.`,
      happened: `You came in with "${quote}"${ans.body ? `, carried in ${low(ans.body.v)}` : ''}. You stayed for the whole session, and the sky is different than when you started.`,
      emotions: emotions ? `${frag(emotions, 90)}. Named out loud, which most people skip.` : 'Hard to name tonight, and that was an honest answer too.',
      pattern: S.current.rum >= 2
        ? 'The loop runs on replay: the same tape, passed off as problem solving. It is protection with a cost, not a flaw.'
        : S.current.shame >= 2
          ? 'The first voice on the scene is the harsh one, and it talks fastest when you are tired. Speed is not truth.'
          : 'Tonight builds during the day and collects interest after dark. It has a routine; now so do we.',
      tried,
      triedNote: feltGood.length
        ? 'The ones that moved something become yours. The ones that did not, I remember too, and will not push again.'
        : tried.some((x) => x.felt) ? 'Nothing moved much tonight, and that is data, not failure. Next session starts smarter for it.' : 'We kept it to talking tonight. The exercises stay on the shelf until you want them.',
      perspective: ans.verdict?.v || (doneRef.current.has('cog') ? `You can have the thought "${frag(thought, 34)}" without being the thought. That half step is the skill.` : 'Saying it out loud was the first step of distance.'),
      commit: ans.action?.v ? `${ans.action.v}.` : 'Name it once tonight.',
      commitWhen: ans.actionWhen?.v ? `${ans.actionWhen.v}.` : 'The next time it starts, say "there it is."',
      prompt: ans.want ? `Did tonight get me closer to ${low(ans.want.v)}? One line, no grade.` : 'What did the loop try to protect me from today? One line, no grade.',
      note: `You did not get described tonight, ${name || 'friend'}. You worked. The second session starts where this sky ends.`,
    }
  }, [mode.t]) // eslint-disable-line react-hooks/exhaustive-deps

  /* acks: every ack quotes or uses what they just said (cover test) */
  const ackFor = (q) => {
    switch (q) {
      case 'opening': return name ? `Nice to meet you, ${name}.` : null
      case 'feel': return ans.opening?.typed ? `"${frag(ans.opening.v)}". I heard that.` : `${frag(ans.opening?.v)}. Okay. That is where we start.`
      case 'people': return ans.body ? `${frag(ans.body.v)}. The body knew before we asked.` : `${frag(ans.feel?.v)}. Naming it out loud is a step most people skip.`
      case 'cost': return ans.people?.v === 'Nobody, really' ? 'Then I am glad it got said here first.' : `${frag(ans.people?.v)}. So part of it stays yours alone.`
      case 'thought': return 'So let\'s look at what the loop keeps planning around.'
      case 'keep': return 'Landed. Notice how the room got slightly bigger.'
      case 'want': return "One more question and I'll write tonight down for you."
      default: return null
    }
  }

  const finishModule = (modName, next) => { record(modName, null); setMode({ t: 'harvest', of: modName, next }) }

  const body = (() => {
    switch (mode.t) {
      case 'meet': return <MeetScreen onNext={() => setMode(decide('meet'))} />
      case 'ask': {
        if (mode.q === 'name') {
          return <AskScreen question="Before we start, what should I call you?" placeholder="Your name" options={[]}
            onAnswer={(v) => { const n = v.trim().split(' ')[0]; setName(n.charAt(0).toUpperCase() + n.slice(1)); setMode(decide('name')) }} />
        }
        if (mode.q === 'verdict') return null /* rendered via verdictScreen below */
        const Q = ASKS[mode.q]
        return <AskScreen key={mode.q} ack={ackFor(mode.q)} question={Q.question} placeholder={Q.placeholder} options={Q.options}
          echo={mode.echo}
          onAnswer={(v, opt, typed) => {
            A(mode.q, v, typed); absorb(opt, typed, v)
            if (mode.q === 'thought') setMode(decide('thought'))
            else setMode(decide(mode.q))
          }} />
      }
      case 'noticing': return <OfferScreen key="noticing"
        echo={ans.cost?.v}
        lines={[
          `${frag(ans.cost?.v || 'That')}. The private bill is always the bigger one.`,
          `Something I am noticing tonight: ${est.rum >= 2 ? 'you answer fast about what happened, and slower about how it felt. The loop lives in that gap' : est.shame >= 2 ? 'when you describe yourself, the verdict arrives before the evidence. We will look at that' : 'your day carries this quietly and your night pays for it. That rhythm can change'}.`,
        ]}
        yesLabel="That's fair" onConsent={() => setMode(decide('noticing'))} />
      case 'offer': {
        const O = OFFERS[mode.mod]
        return <OfferScreen key={mode.mod} lines={O.lines()} more={O.more} yesLabel={O.yes}
          onConsent={(c) => {
            if (c === 'yes') setMode({ t: 'mod', mod: mode.mod })
            else {
              record(O.name, 'Declined, no pressure')
              const after = mode.mod.startsWith('breath') ? 'regulated' : mode.mod === 'scales' || mode.mod === 'leaves' ? 'cognition' : mode.mod === 'compassion' ? 'soften' : 'action'
              setMode(decide(after))
            }
          }} />
      }
      case 'mod': {
        switch (mode.mod) {
          case 'breathBox': return <BreathModule pattern="box" onDone={() => finishModule('The breath', 'regulated')} onSkip={() => { record('The breath', 'Stopped early, talked instead'); setMode(decide('regulated')) }} />
          case 'breath478': return <BreathModule pattern="478" onDone={() => finishModule('The breath', 'regulated')} onSkip={() => { record('The breath', 'Stopped early, talked instead'); setMode(decide('regulated')) }} />
          case 'bodytap': return <BodyTapModule
            onDone={(zones) => { A('body', zones.join(', ')); record('The lit body', null); setMode(decide('bodytap')) }}
            onSkip={() => setMode(decide('bodytap'))} />
          case 'scales': return <CbtModule thought={thought}
            onDone={(v) => { A('cbt', v); record('The scales', null); setMode({ t: 'ask', q: 'verdict' }) }}
            onSkip={() => setMode(decide('cognition'))} />
          case 'leaves': return <LeavesModule thought={thought} onDone={() => { record('The stream', null); setMode({ t: 'harvest', of: 'The stream', next: 'cognition' }) }} />
          case 'compassion': return <CompassionModule onDone={() => { record('The soft word', null); setMode({ t: 'harvest', of: 'The soft word', next: 'soften' }) }} onSkip={() => { record('The soft word', 'Too much tonight'); setMode(decide('soften')) }} />
          case 'action': return <ActionModule onDone={({ act, when }) => { A('action', act); A('actionWhen', when); record('One small move', 'Committed'); setMode(decide('action')) }} onSkip={() => { record('One small move', 'Not tonight'); setMode(decide('action')) }} />
          case 'ground': return <GroundModule onDone={() => { record('The landing', null); setMode(decide('ground')) }} />
          default: return null
        }
      }
      case 'harvest': return <AskScreen key={`h-${mode.of}`}
        ack={mode.of === 'The breath' ? 'Three rounds. Notice your shoulders before your head starts again.' : mode.of === 'The stream' ? 'You watched it move. That is the whole skill, small at first.' : 'Done, and you did it with me.'}
        question="Did anything move?" placeholder="or say what happened…"
        options={HARVEST_OPTS}
        onAnswer={(v) => { record(mode.of, v); setMode({ t: 'return', felt: v, next: mode.next }) }} />
      case 'return': return <OfferScreen key="return" echo={mode.felt}
        lines={[RETURN_LINES[mode.felt] || RETURN_LINES['A little']]}
        yesLabel="Go on" onConsent={() => setMode(decide(mode.next))} />
      case 'ask-verdict':
      case 'lesson': return <LessonModule lesson={topSignal(est)[0]} onDone={() => setMode(decide('lesson'))} />
      case 'build': return <BuildScreen quote={frag(ans.opening?.v, 30)} onDone={() => setModeRaw({ t: 'artifact' })} />
      case 'artifact': return artifact ? <ArtifactScreen a={artifact} onRestart={restart} /> : null
      default: return null
    }
  })()

  /* verdict is a normal ask defined inline (needs cbt context) */
  const isVerdict = mode.t === 'ask' && mode.q === 'verdict'
  const verdictScreen = isVerdict ? (
    <AskScreen key="verdict" ack="You argued both sides fairly. Most people only argue one."
      question="Reading your own two lists, which side is actually heavier?" placeholder="be honest, not brave…"
      options={[
        { label: 'The thought holds up less than I expected' },
        { label: "It's more even than I want it to be" },
        { label: 'The thought still feels true' },
      ]}
      onAnswer={(v) => { A('verdict', v); setMode({ t: 'harvest', of: 'The scales', next: 'cognition' }) }} />
  ) : null

  /* choreography: pick the mood for the current interaction */
  const moodKey = (() => {
    if (mode.t === 'meet') return 'night'
    if (mode.t === 'build') return 'predawn'
    if (mode.t === 'artifact') return 'dawn'
    if (mode.t === 'lesson') return 'lesson'
    if (mode.t === 'offer') return OFFERS[mode.mod]?.mood || 'talk'
    if (mode.t === 'mod') {
      return { breathBox: 'breath', breath478: 'breath', bodytap: 'body', scales: 'mind', leaves: 'stream', compassion: 'soften', action: 'act', ground: 'ground' }[mode.mod] || 'talk'
    }
    if (mode.t === 'ask' && (mode.q === 'keep' || mode.q === 'want')) return 'predawn'
    if (mode.t === 'ask' && (mode.q === 'thought' || mode.q === 'verdict')) return 'mind'
    return 'talk'
  })()
  const mood = MOOD[moodKey]
  /* arc: dawn progress by how much of the hidden spine is behind us */
  const STAGE_T = { meet: 0, name: 0.04, opening: 0.1, feel: 0.16, people: 0.34, cost: 0.4, thought: 0.5, verdict: 0.62, keep: 0.86, want: 0.9 }
  const arcT = mode.t === 'artifact' ? 1 : mode.t === 'build' ? 0.95 : mode.t === 'lesson' ? 0.68
    : mode.t === 'noticing' ? 0.44 : mode.t === 'ask' ? (STAGE_T[mode.q] ?? 0.5)
      : mode.t === 'offer' || mode.t === 'mod' || mode.t === 'harvest' || mode.t === 'return'
        ? (doneRef.current.has('cog') ? 0.72 : doneRef.current.has('breath') || doneRef.current.has('bodyoffer') ? 0.26 : 0.2) : 0

  const modeKey = mode.t + (mode.q || '') + (mode.mod || '') + (mode.of || '')
  return (
    <div className="lib-page ov-page md-page">
      <div className="ov-stage">
        <div className="ov-screen md-frame" style={{ '--c1': mood.bg[0], '--c2': mood.bg[1], '--c3': mood.bg[2], '--g': mood.g }}>
          <div className="md-world" aria-hidden="true" />
          <Particles glow={mood.g} />
          {mode.t !== 'meet' && (
            <header className="md-head">
              <span className="md-brand"><Orb size={8} />Kael</span>
              <span className="md-track" aria-hidden="true"><i style={{ width: `${Math.round(arcT * 100)}%` }} /></span>
            </header>
          )}
          <div className="md-stage">
            <div key={modeKey} className="md-in">{isVerdict ? verdictScreen : body}</div>
          </div>
        </div>
      </div>
      <div className="ob-devbar">
        <span>{modeKey}</span>
        <button onClick={restart}>Restart</button>
        <span style={{ opacity: 0.6 }}>a{est.arousal} r{est.rum} s{est.shame} k{est.stuck} · {objective}</span>
      </div>
    </div>
  )
}
