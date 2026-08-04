import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PaperPlaneTilt, Sparkle, Check } from '@phosphor-icons/react'

/* ──────────────────────────────────────────────────────────────────────────
   Kael V10 — the immersive therapy session.

   One continuous world: a night sky that morphs, step by step, from deep
   night to first light as the session does its work. Chat happens as glass
   on the sky with Duolingo-grammar answer cards; each exercise is a
   set-piece inside the same sky (the breathing orb, the lit body, leaves
   on a stream, the grounding constellation). The artifact arrives at
   dawn as the one piece of paper in the whole experience: the thing you
   keep.

   No assets. Sky = @property color transitions.
   ────────────────────────────────────────────────────────────────────────── */

const TYPE_SPEED = 24
const DOT_MS = 650
const GAP_MS = 380

/* ── the arc: night → dawn, one palette per step ────────────────────────── */
const ARC = {
  meet:    ['#070b16', '#0d1526', '#0a101d'],
  name:    ['#080d19', '#101a2e', '#0b1220'],
  opening: ['#0a101f', '#142138', '#0d1526'],
  a1:      ['#0b1222', '#16253c', '#0e1728'],
  a2:      ['#0c1424', '#182840', '#101a2c'],
  body:    ['#120f26', '#251c44', '#171331'],   /* violet: the lit body */
  feel:    ['#101328', '#1f2545', '#141830'],
  a3:      ['#0f1728', '#1d2c48', '#131c31'],
  a4:      ['#101a2b', '#20304a', '#141f33'],
  n1:      ['#111c2e', '#22334d', '#152136'],
  offer:   ['#0e1f2c', '#1b3a4a', '#122733'],
  module:  ['#0b2231', '#164156', '#0e2a3b'],   /* teal: the breath */
  harvest: ['#0e2433', '#1c4356', '#122d3c'],
  teach:   ['#1f1808', '#3a2e12', '#282010'],   /* amber: the idea */
  a5:      ['#1c1a14', '#35301f', '#252217'],
  a6:      ['#1a1a1a', '#302f28', '#22221d'],
  thought: ['#1c1524', '#332643', '#251b30'],   /* violet again: the mind */
  cbt:     ['#1e1626', '#372a46', '#271d32'],
  a7:      ['#1d1826', '#352c44', '#262031'],
  act:     ['#122622', '#204438', '#17302a'],   /* green: the stream */
  ground:  ['#15271c', '#274733', '#1b3325'],
  a8:      ['#232331', '#3d3c4e', '#2c2b3b'],
  want:    ['#2c2536', '#4a3f52', '#352e41'],   /* pre-dawn slate rose */
  build:   ['#38273a', '#5c4453', '#443143'],
  artifact:['#4a3548', '#8a5f5a', '#5c4350'],   /* first light */
}
const GLOW = {
  meet: '#8fb8d8', name: '#8fb8d8', opening: '#8fb8d8', a1: '#8fb8d8', a2: '#8fb8d8',
  body: '#b8a0e8', feel: '#a8acdd', a3: '#a8acdd', a4: '#a8acdd', n1: '#a8acdd',
  offer: '#7ec8d8', module: '#7ec8d8', harvest: '#7ec8d8',
  teach: '#e8c078', a5: '#e0c088', a6: '#d8bc90',
  thought: '#c8a0d8', cbt: '#d8a0c0', a7: '#d0a0c8',
  act: '#88d8c0', ground: '#a8d8b0',
  a8: '#d0b0c0', want: '#e0b8b0', build: '#eac0a0', artifact: '#f2d0a0',
}

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

/* ── chat script engine (time-based, throttle-proof) ────────────────────── */
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

/* ── glass chat atoms ───────────────────────────────────────────────────── */
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

const frag = (t = '', max = 42) => {
  const v = String(t).trim().replace(/\s+/g, ' ')
  if (v.length <= max) return v
  const cut = v.slice(0, max)
  const sp = cut.lastIndexOf(' ')
  return `${(sp > 20 ? cut.slice(0, sp) : cut).trim()}…`
}
const low = (t = '') => { const v = frag(t); return v ? v.charAt(0).toLowerCase() + v.slice(1) : v }

/* ── beats (copy unchanged; the world around it changed) ────────────────── */
const OPENING = {
  question: "What's got you tonight?",
  placeholder: 'however it comes out…',
  options: [
    { label: "I can't switch my head off" }, { label: 'Today just sat on me' },
    { label: "A conversation I can't put down" }, { label: "I don't know, everything" },
  ],
}
const FEEL_Q = {
  question: "And what's the feeling under it?",
  placeholder: 'or your own word…',
  options: [
    { label: 'On edge' }, { label: 'Worn out' }, { label: 'Kind of ashamed' }, { label: "I can't name it" },
  ],
}
const WANT_Q = {
  question: 'Last one. What would lighter look like, just for tonight?',
  placeholder: 'be greedy about it…',
  options: [
    { label: 'Falling asleep without the replay' }, { label: 'One hour where my chest unclenches' }, { label: 'Not snapping at anyone' },
  ],
}

/* ── screens ────────────────────────────────────────────────────────────── */

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

function AskScreen({ echo, ack, question, options = [], placeholder, onAnswer, autoFocus }) {
  const items = useMemo(() => {
    const list = []
    if (ack) list.push({ text: ack })
    list.push({ text: question })
    return list
  }, [ack, question])
  const { bubbles, allDone, finish } = useChatScript(items)
  const [draft, setDraft] = useState('')
  const [picked, setPicked] = useState(null)
  const pick = (o) => { if (picked) return; setPicked(o.label); setTimeout(() => onAnswer(o.label, null, false), 380) }
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
          <input value={draft} placeholder={placeholder} autoFocus={autoFocus}
            onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send() }} />
          <button className="md-send" data-on={draft.trim().length > 0 || undefined} onClick={send} aria-label="Send">
            <PaperPlaneTilt size={15} weight="fill" />
          </button>
        </div>
      </div>
    </div>
  )
}

function OfferScreen({ echo, lines, yes = "Let's try it", no = 'Not right now', onYes, onNo }) {
  const items = useMemo(() => lines.map((text) => ({ text })), [lines])
  const { bubbles, allDone, finish } = useChatScript(items)
  return (
    <div className="md-screen" onClick={finish}>
      <div className="md-chat">
        {echo && <UserBubble text={echo} />}
        {bubbles.map((b, k) => <KaelRow key={k} bubble={b} withAvatar={k === newestOf(bubbles)} />)}
      </div>
      <div className="md-foot">
        <button className="md-cta" data-wait={!allDone || undefined} onClick={(e) => { e.stopPropagation(); onYes() }}>{yes}</button>
        <button className="md-quiet" data-wait={!allDone || undefined} onClick={(e) => { e.stopPropagation(); onNo() }}>{no}</button>
      </div>
    </div>
  )
}

/* ── SET-PIECE · the breath: an orb that breathes with you ──────────────── */
const PHASES = [
  { label: 'Breathe in', s: 4, grow: true }, { label: 'Hold', s: 4, hold: true },
  { label: 'Out, slowly', s: 4 }, { label: 'Hold', s: 4, hold: true },
]
const ROUNDS = 3
function BreathModule({ onDone, onSkip }) {
  const [on, setOn] = useState(false)
  const [ph, setPh] = useState(0)
  const [left, setLeft] = useState(PHASES[0].s)
  const [round, setRound] = useState(0)
  useEffect(() => {
    if (!on || round >= ROUNDS) return undefined
    const iv = setInterval(() => {
      setLeft((l) => {
        if (l > 1) return l - 1
        setPh((p) => {
          const nxt = (p + 1) % PHASES.length
          if (nxt === 0) setRound((r) => r + 1)
          setLeft(PHASES[nxt].s)
          return nxt
        })
        return PHASES[(ph + 1) % PHASES.length].s
      })
    }, 1000)
    return () => clearInterval(iv)
  }, [on, ph, round])
  const done = round >= ROUNDS
  const cur = PHASES[ph]
  const grown = cur.hold ? PHASES[(ph - 1 + PHASES.length) % PHASES.length].grow : cur.grow
  return (
    <div className="md-screen md-center">
      <span className="md-k">Together · ninety seconds</span>
      <h1 className="md-mt">Breathe with it.</h1>
      <div className="md-breathwrap">
        <div className="md-breath" data-run={on && !done ? 'true' : undefined} data-grow={on && !done && grown ? 'true' : undefined} style={{ '--dur': `${cur.s}s` }}>
          <i /><i /><i />
          <div className="md-breath-in">
            {done ? <span className="md-breath-done"><Check size={26} weight="bold" /></span>
              : on ? <><b>{left}</b><span>{cur.label}</span></>
                : <span className="md-breath-idle">4 · 4 · 4 · 4</span>}
          </div>
        </div>
        <div className="md-rounds">{Array.from({ length: ROUNDS }).map((_, k) => <i key={k} data-on={k < round || undefined} />)}</div>
      </div>
      <div className="md-foot">
        {!on && !done ? <button className="md-cta" onClick={() => setOn(true)}>Start</button>
          : <button className="md-cta" data-wait={!done || undefined} onClick={onDone}>Done</button>}
        {!done && <button className="md-quiet" onClick={onSkip}>This isn't landing, let's talk instead</button>}
      </div>
    </div>
  )
}

/* ── SET-PIECE · the lit body: tap where it lives ───────────────────────── */
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

/* ── the idea, as rising light ──────────────────────────────────────────── */
const TEACH = [
  'The replay feels like work because the same circuits that plan also ruminate. Your brain believes one more pass will crack it.',
  'But a replay has no new information in it. It is the same tape, and every pass deepens the groove instead of solving anything.',
  'So the loop you carry is not a character flaw. It is a planning system running on empty, trying to protect you.',
]
function TeachModule({ onDone }) {
  const [at, setAt] = useState(0)
  const next = () => setAt((x) => x + 1)
  return (
    <div className="md-screen md-center">
      <span className="md-k">One idea · one minute</span>
      <h1 className="md-mt">Your brain treats replaying as problem solving.</h1>
      <div className="md-beats">
        {TEACH.slice(0, at + 1).map((t, k) => (
          <p key={k} className="md-beat" data-last={k === 2 || undefined}>{t}</p>
        ))}
      </div>
      <div className="md-foot">
        {at < TEACH.length - 1
          ? <button className="md-cta" onClick={next}>Go on</button>
          : <button className="md-cta" onClick={onDone}>That makes sense</button>}
      </div>
    </div>
  )
}

/* ── the scales: evidence for and against, on glass ─────────────────────── */
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

/* ── SET-PIECE · leaves on a stream: the thought drifts away ────────────── */
function ActModule({ thought, onDone }) {
  const [at, setAt] = useState(0)
  const steps = [
    'Here is the thought, on a leaf. Hold it there a moment.',
    'Now say it to yourself as: "I am having the thought that…"',
    'And let the stream take it. You are the bank, not the leaf.',
  ]
  const next = () => setAt((x) => x + 1)
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
        {at < 2 ? <button className="md-cta" onClick={next}>Next</button>
          : <button className="md-cta" onClick={onDone}>It drifted</button>}
      </div>
    </div>
  )
}

/* ── the grounding constellation: 5-4-3-2-1 ─────────────────────────────── */
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
  const next = () => setAt((x) => x + 1)
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
        {at < GROUND.length - 1 ? <button className="md-cta" onClick={next}>Named them</button>
          : <button className="md-cta" onClick={onDone}>I'm here</button>}
      </div>
    </div>
  )
}

/* ── the build, at almost-dawn ──────────────────────────────────────────── */
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

/* ── the artifact: the one piece of paper in the whole night ────────────── */
function ArtifactScreen({ a, mods, onRestart }) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })
  return (
    <div className="md-screen">
      <div className="md-art-scroll">
        <div className="md-sheet">
          <header className="md-sheet-head">
            <span className="md-sheet-k">Today's Reflection</span>
            <span className="md-sheet-d">{today}</span>
          </header>
          <h1 className="md-sheet-t">{a.title}</h1>
          <p className="md-sheet-sum">{a.summary}</p>
          <section><span className="md-sheet-l">What happened</span><p>{a.happened}</p></section>
          <section>
            <span className="md-sheet-l">What helped</span>
            {mods.length > 0 && (
              <div className="md-sheet-chips">{mods.map((m) => <span key={m}><Check size={11} weight="bold" />{m}</span>)}</div>
            )}
            <p>{a.helped}</p>
          </section>
          <section><span className="md-sheet-l">For tonight</span><p><b>{a.move}</b> {a.how}</p></section>
          <footer><p>{a.note}</p><span className="md-sheet-sign">— Kael</span></footer>
        </div>
        <p className="md-saved">Saved to your Journey. The sky remembers.</p>
      </div>
      <div className="md-foot">
        <button className="md-cta" onClick={onRestart}>This sounds like me</button>
      </div>
    </div>
  )
}

/* ── the machine ────────────────────────────────────────────────────────── */

export default function OnboardingV10() {
  const [step, setStepRaw] = useState('meet')
  const lockRef = useRef(0)
  const setStep = (v) => {
    const now = performance.now()
    if (now - lockRef.current < 400) return
    lockRef.current = now
    setStepRaw(v)
  }
  const [name, setName] = useState('')
  const [ans, setAns] = useState({})
  const [harvest, setHarvest] = useState(null)
  const [mods, setMods] = useState([])
  const A = (k, v, typed) => setAns((p) => ({ ...p, [k]: { v, typed } }))
  const did = (m) => setMods((p) => (p.includes(m) ? p : [...p, m]))

  /* the sky lightens as the session moves */
  const ORDER = useMemo(() => Object.keys(ARC), [])
  const arcT = Math.max(0, ORDER.indexOf(step)) / (ORDER.length - 1)

  const quote = ans.opening?.typed ? low(ans.opening.v) : (ans.opening?.v || '').toLowerCase()
  const thought = frag(ans.thought?.v, 44) || 'I should have said it differently'

  const restart = () => { setStepRaw('meet'); setName(''); setAns({}); setHarvest(null); setMods([]) }

  const artifact = useMemo(() => {
    if (step !== 'artifact') return null
    const verdict = {
      'A little': 'Ninety seconds of breathing moved it a little. A little, on demand, is a tool.',
      'Not really': 'Breathing did not move much tonight. That is data, not failure, and Kael keeps it.',
      'Worse, actually': 'Breathing made it louder, so it is off your list. Knowing what does not work is half the toolkit.',
    }[harvest]
    return {
      title: 'The night it got lighter',
      summary: `One session, ${mods.length} tools tried, written down.`,
      happened: `You came in with "${quote}"${ans.body && ans.body.v !== 'nowhere I could point to' ? `, carried in ${low(ans.body.v)}` : ''}. You stayed for the whole session, and the sky is different than when you started.`,
      helped: verdict || (mods.length ? 'The ones that landed become yours. The ones that did not, Kael remembers too.' : 'We kept it to talking tonight. The exercises will be there when you want them, and not before.'),
      move: 'Name it once tonight.',
      how: `The next time it starts, say "there it is." ${ans.want ? `You said lighter looks like ${low(ans.want.v)}. That is the direction.` : ''}`,
      note: `You did not get described tonight, ${name || 'friend'}. You worked. The second session starts where this sky ends.`,
    }
  }, [step, harvest, mods, quote, ans.body, ans.want, name])

  const body = (() => {
    switch (step) {
      case 'meet': return <MeetScreen onNext={() => setStep('name')} />
      case 'name': return <AskScreen question="Before we start, what should I call you?" placeholder="Your name" options={[]}
        onAnswer={(v) => { const n = v.trim().split(' ')[0]; setName(n.charAt(0).toUpperCase() + n.slice(1)); setStep('opening') }} />
      case 'opening': return <AskScreen ack={name ? `Nice to meet you, ${name}.` : null} {...OPENING}
        onAnswer={(v, t, typed) => { A('opening', v, typed); setStep('a1') }} />
      case 'a1': return <AskScreen echo={ans.opening?.v}
        ack={ans.opening?.typed ? `"${frag(ans.opening.v)}". I heard that.` : `${frag(ans.opening?.v)}. Okay. That is where we start.`}
        question="How long has tonight been building?" placeholder="or say it your way…"
        options={[{ label: 'Just today' }, { label: 'All week, honestly' }, { label: 'Longer than I want to admit' }, { label: "I can't tell anymore" }]}
        onAnswer={(v) => { A('dur', v); setStep('a2') }} />
      case 'a2': return <AskScreen echo={ans.dur?.v} ack={`${frag(ans.dur?.v)}. So tonight has a running start.`}
        question="And what was today like, before this took over?" placeholder="just the shape of it…"
        options={[{ label: 'Busy, wall to wall' }, { label: 'Fine until one moment flipped it' }, { label: 'Slow, too much room to think' }, { label: 'A blur' }]}
        onAnswer={(v) => { A('day', v); setStep('body') }} />
      case 'body': return <BodyTapModule
        onDone={(zones) => { A('body', zones.join(', ')); did('The lit body'); setStep('feel') }}
        onSkip={() => { A('body', 'nowhere I could point to'); setStep('feel') }} />
      case 'feel': return <AskScreen ack={ans.body?.v !== 'nowhere I could point to' ? `${frag(ans.body?.v)}. The body knew before we asked.` : 'Nowhere you could point to. That is an answer too.'}
        {...FEEL_Q} onAnswer={(v) => { A('feel', v); setStep('a3') }} />
      case 'a3': return <AskScreen echo={ans.feel?.v} ack={`${frag(ans.feel?.v)}. Naming it out loud is a step most people skip.`}
        question="Who else knows tonight feels like this?" placeholder="a name, or no one…"
        options={[{ label: 'One person, sort of' }, { label: 'People know pieces' }, { label: 'Nobody, really' }]}
        onAnswer={(v) => { A('people', v); setStep('a4') }} />
      case 'a4': return <AskScreen echo={ans.people?.v}
        ack={ans.people?.v === 'Nobody, really' ? 'Then I am glad it got said here first.' : `${frag(ans.people?.v)}. So part of it stays yours alone.`}
        question="What did you do the last time it got this loud?" placeholder="no wrong answers here…"
        options={[{ label: 'Scrolled until I fell asleep' }, { label: 'Kept working, kept moving' }, { label: 'Went quiet on everyone' }, { label: 'Snapped, then felt worse' }]}
        onAnswer={(v) => { A('reach', v); setStep('n1') }} />
      case 'n1': return <OfferScreen echo={ans.reach?.v}
        lines={[
          `${frag(ans.reach?.v)}. That made sense as protection. It also kept the loop fed.`,
          'Something I am noticing: you answer fast about what happened, and slower about how it felt. We will use that.',
        ]}
        yes="That's fair" no="Go on" onYes={() => setStep('offer')} onNo={() => setStep('offer')} />
      case 'offer': return <OfferScreen echo={ans.feel?.v}
        lines={[
          `${frag(ans.feel?.v)}${ans.body && ans.body.v !== 'nowhere I could point to' ? `, sitting in ${low(ans.body.v)}` : ''}. That is a lot to hold while we talk.`,
          'There is a ninety-second thing that loosens exactly that. Want to try it together?',
        ]}
        onYes={() => setStep('module')}
        onNo={() => setStep('teach')} />
      case 'module': return <BreathModule
        onDone={() => setStep('harvest')}
        onSkip={() => setStep('teach')} />
      case 'harvest': return <AskScreen ack="Three rounds. Notice your shoulders before your head starts again."
        question="Did anything move?" placeholder="or say what happened…"
        options={[{ label: 'A little' }, { label: 'Not really' }, { label: 'Worse, actually' }]}
        onAnswer={(v) => { setHarvest(v); did('The breath'); setStep('teach') }} />
      case 'teach': return <TeachModule onDone={() => { did('The idea'); setStep('a5') }} />
      case 'a5': return <AskScreen ack="Hold that idea a second, because it points somewhere."
        question="Where else does this loop show up, besides tonight?" placeholder="work, people, the mirror…"
        options={[{ label: 'Work, constantly' }, { label: 'With one particular person' }, { label: 'Any time I try to rest' }, { label: 'Everywhere, now that I look' }]}
        onAnswer={(v) => { A('where', v); setStep('a6') }} />
      case 'a6': return <AskScreen echo={ans.where?.v} ack={`${frag(ans.where?.v)}. So tonight is a visit from something with a routine.`}
        question="What does it cost you that nobody sees?" placeholder="the private bill…"
        options={[{ label: 'Sleep, mostly' }, { label: 'Patience with people I love' }, { label: 'Believing my own judgment' }, { label: "I'd rather not say" }]}
        onAnswer={(v) => { A('cost', v); setStep('thought') }} />
      case 'thought': return <AskScreen ack="So if the replay is a planning system on empty, let's look at what it keeps planning around."
        question="Say the thought that runs the loop. The exact words." placeholder="it usually starts with 'I should have'…"
        options={[{ label: 'I should have said it differently' }, { label: 'They think less of me now' }, { label: 'If I stop thinking about it, something breaks' }]}
        onAnswer={(v, t, typed) => { A('thought', v, typed); setStep('cbt') }} />
      case 'cbt': return <CbtModule thought={thought}
        onDone={(v) => { A('cbt', v); did('The scales'); setStep('a7') }} onSkip={() => setStep('a7')} />
      case 'a7': return <AskScreen ack="You argued both sides fairly. Most people only argue one."
        question="Reading your own two lists, which side is actually heavier?" placeholder="be honest, not brave…"
        options={[{ label: 'The thought holds up less than I expected' }, { label: "It's more even than I want it to be" }, { label: 'The thought still feels true' }]}
        onAnswer={(v) => { A('verdict', v); setStep('act') }} />
      case 'act': return <ActModule thought={thought} onDone={() => { did('The stream'); setStep('ground') }} />
      case 'ground': return <GroundModule onDone={() => { did('The landing'); setStep('a8') }} />
      case 'a8': return <AskScreen ack="Landed. Notice how the room got slightly bigger."
        question="What's one thing from tonight you want to keep?" placeholder="a line, a feeling, a fact…"
        options={[{ label: 'The half step of distance' }, { label: 'That the loop is protection, not a flaw' }, { label: 'Saying it out loud at all' }]}
        onAnswer={(v) => { A('keep', v); setStep('want') }} />
      case 'want': return <AskScreen ack="One more question and I'll write tonight down for you."
        {...WANT_Q} onAnswer={(v, t, typed) => { A('want', v, typed); setStep('build') }} />
      case 'build': return <BuildScreen quote={frag(ans.opening?.v, 30)} onDone={() => setStep('artifact')} />
      case 'artifact': return artifact ? <ArtifactScreen a={artifact} mods={mods} onRestart={restart} /> : null
      default: return null
    }
  })()

  const arc = ARC[step] || ARC.meet
  const glow = GLOW[step] || GLOW.meet
  return (
    <div className="lib-page ov-page md-page">
      <div className="ov-stage">
        <div className="ov-screen md-frame" style={{ '--c1': arc[0], '--c2': arc[1], '--c3': arc[2], '--g': glow }}>
          <div className="md-world" aria-hidden="true" />
          <Particles glow={glow} />
          {step !== 'meet' && (
            <header className="md-head">
              <span className="md-brand"><Orb size={8} />Kael</span>
              <span className="md-track" aria-hidden="true"><i style={{ width: `${Math.round(arcT * 100)}%` }} /></span>
            </header>
          )}
          <div className="md-stage">
            <div key={step} className="md-in">{body}</div>
          </div>
        </div>
      </div>
      <div className="ob-devbar">
        <span>{step}</span>
        <button onClick={restart}>Restart</button>
        <span style={{ opacity: 0.6 }}>night→dawn {Math.round(arcT * 100)}%</span>
      </div>
    </div>
  )
}
