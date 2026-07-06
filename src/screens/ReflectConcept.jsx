import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft, MagnifyingGlass, Plus, Sparkle, PaperPlaneTilt, X,
  Heartbeat, Spiral, Waves, CloudRain, Moon, CloudSun, ArrowsLeftRight,
  ChatCircleDots, Lightning, Scales, Question,
} from '@phosphor-icons/react'

/* ──────────────────────────────────────────────────────────────────────────
   Reflect — the one-verb model, as a standalone concept.

   Kael is a place to reflect on something. One CTA: New Reflection. Each
   reflection is its own chat, titled and described by living metadata that
   updates as you talk. Home is the collection: your life, being recorded.
   Nothing ever closes; every reflection waits for your return. Search is
   AI-native. No rituals, no generated artifacts: the chat is the artifact.
   ────────────────────────────────────────────────────────────────────────── */

const NAME = 'Maya'

/* moods & doors are doorways into distinct conversations, not text inserts —
   each carries Kael's actual first reply (`open`) and the living title/line
   the reflection settles into after that one exchange. The one exception is
   the "stuck" door, which routes into the deeper, fully scripted NEW_SCRIPT
   demo below (see `deep: true`). */
const MOODS = [
  { id: 'anxious', label: 'Anxious', Icon: Heartbeat, seed: 'I’m feeling anxious and I can’t tell why.',
    open: 'Where do you feel it, in the thought or in the body? That usually tells us which one to follow first.',
    title: 'Anxious, and not sure why', line: 'Finding where it actually lives.' },
  { id: 'heavy', label: 'Heavy', Icon: CloudRain, seed: 'Everything feels heavy today.',
    open: 'Heavy usually has a shape, even if it’s blurry right now. What’s the heaviest part of today?',
    title: 'Carrying more than usual', line: 'Naming what’s making today heavy.' },
  { id: 'restless', label: 'Restless', Icon: Waves, seed: 'I’m restless and I can’t settle.',
    open: 'Where do you notice it most right now: work, a relationship, your body, or just life in general?',
    title: 'Restless, and not sure where to point it', line: 'Finding what the restlessness is actually about.' },
  { id: 'conflicted', label: 'Conflicted', Icon: ArrowsLeftRight, seed: 'Part of me wants one thing, and part of me wants the opposite.',
    open: 'Two things pulling at once, probably. Tell me both sides, even the one that feels less reasonable.',
    title: 'Torn between two things', line: 'Naming both sides before choosing either.' },
  { id: 'hopeful', label: 'Hopeful', Icon: CloudSun, seed: 'I actually feel a little hopeful today.',
    open: 'I’ll take it. What’s the hope attached to, so I understand what we’re protecting?',
    title: 'Something worth protecting', line: 'Naming what the hope is resting on.' },
  { id: 'lost', label: 'Lost', Icon: Moon, seed: 'I feel a bit lost right now.',
    open: 'Lost usually means you can name what you’re not more easily than what you are. Start there if it helps.',
    title: 'Not sure what I actually want', line: 'Starting with what it isn’t.' },
]

const DOORS = [
  { id: 'happened', Icon: Lightning, label: 'Something happened',
    seed: 'Something happened today and I need to talk about it.',
    open: 'Okay. Start wherever it starts, even if it’s just the moment right before it happened.',
    title: 'Something happened today', line: 'Starting from the moment itself.' },
  { id: 'stuck', Icon: Spiral, label: 'I can’t stop thinking about this', deep: true,
    seed: 'There’s something I can’t stop thinking about.' },
  { id: 'decision', Icon: Scales, label: 'I need to make a decision',
    seed: 'I have a decision to make and I keep going back and forth.',
    open: 'Let’s slow it down before choosing. What are you deciding between?',
    title: 'A decision I keep circling', line: 'Slowing down before choosing.' },
  { id: 'unclear', Icon: Question, label: 'I don’t know what I’m feeling',
    seed: 'I don’t really know what I’m feeling right now.',
    open: 'That’s enough to begin. What happened right before you started feeling off?',
    title: 'Not sure what this feeling is', line: 'Working backward to where it started.' },
  { id: 'talk', Icon: ChatCircleDots, label: 'I just need to talk',
    seed: 'I just need to talk for a bit.',
    open: 'I’m here. No agenda, just talk. What’s on your mind?',
    title: 'Just needed to talk', line: 'No particular direction yet, and that’s fine.' },
]

/* the collection — living titles + one-liners, newest first. Nothing is ever
   "closed"; the most recent one just surfaces first (LIBRARY[0]), the same
   as every other reflection, only more recently touched. */
const LIBRARY = [
  {
    id: 'restless', when: '2h ago', month: null,
    title: 'Why am I so restless lately?',
    line: 'Life is moving, but maybe not in the right direction.',
    mood: 'var(--mood-restless)',
    history: [
      { who: 'user', text: 'I keep feeling like I should be somewhere else. Not physically. Just… further.' },
      { who: 'kael', text: 'Further than what, though? When you picture the place you’re behind, whose finish line is it?' },
      { who: 'user', text: 'Honestly, I don’t know. Everyone’s, maybe.' },
    ],
    reopen: 'You left this one mid-thought. Want to pick it back up, or has it moved since morning?',
  },
  {
    id: 'dad', when: 'Jun 24', month: 'June',
    title: 'The fight with Dad',
    line: 'Anger on the surface, but something older underneath it.',
    mood: 'var(--mood-hurt)',
    history: [
      { who: 'user', text: 'He said I’ve become too busy for family. In front of everyone.' },
      { who: 'kael', text: 'That landed somewhere specific, I think. Not as an observation about your calendar.' },
      { who: 'user', text: 'It’s the same thing he said when I chose my college.' },
      { who: 'kael', text: 'So Tuesday wasn’t one comment. It was a rerun. The anger makes more sense now.' },
    ],
    reopen: 'It’s been a while since we sat with this one. Where does it live in you today?',
  },
  {
    id: 'manager', when: 'Jun 21', month: null,
    title: 'What my manager’s silence does to me',
    line: 'Four hours on read, and a verdict I wrote myself.',
    mood: 'var(--mood-anxious)',
    history: [
      { who: 'user', text: 'She saw my message four hours ago. Nothing.' },
      { who: 'kael', text: 'And in those four hours, what story got written?' },
    ],
    reopen: 'Last time, the silence had become a verdict by hour two. Did the reply ever come?',
  },
  {
    id: 'marriage', when: 'Jun 14', month: null,
    title: 'Do I actually want marriage?',
    line: 'Separating what I want from what I’m expected to want.',
    mood: 'var(--mood-overthinking)',
    history: [
      { who: 'user', text: 'Mom brought it up again. And the strange thing is I wasn’t even annoyed.' },
      { who: 'kael', text: 'Not annoyed is interesting. What was there instead?' },
    ],
    reopen: 'We never finished separating the want from the expected. Both are probably still in the room.',
  },
  {
    id: 'burnout', when: 'May 30', month: 'May',
    title: 'Why am I losing motivation at work?',
    line: 'Burned out, or simply done with this chapter.',
    mood: 'var(--mood-tired)',
    history: [
      { who: 'user', text: 'I used to care about shipping things. Now I just watch the clock.' },
      { who: 'kael', text: 'When did the clock-watching start? Not roughly. Try to find the week.' },
    ],
    reopen: 'You suspected it wasn’t tiredness but doneness. Has June answered that?',
  },
  {
    id: 'missme', when: 'May 18', month: null,
    title: 'I miss who I used to be',
    line: 'Grieving an older self while meeting the next one.',
    mood: 'var(--mood-sad)',
    history: [
      { who: 'user', text: 'I saw a photo from three years ago and it hurt. She laughed so easily.' },
      { who: 'kael', text: 'What do you know now that she didn’t? Grief and growth usually share a room.' },
    ],
    reopen: 'The photo from three years ago. I remember. Gentler question this time: what would she admire about you now?',
  },
]

/* the deep-scripted demo, reached only via the "I can't stop thinking about
   this" door — a multi-turn conversation showing the living title evolve
   twice as Kael actually finds what it's about, not just once at the top. */
const NEW_STAGES = [
  { title: 'New reflection', line: 'Say it however it comes.' },
  { title: 'The thing I can’t stop thinking about', line: 'Finding where it started.' },
  { title: 'The message I keep rereading', line: 'Not the reply itself, but what the waiting wakes up.' },
]
const NEW_SCRIPT = [
  {
    kael: 'Okay. Let’s not solve it yet, let’s find it. When did you first notice it today, and what were you in the middle of?',
    chips: ['This morning, reading messages', 'After the standup', 'It’s been all week, honestly'],
  },
  {
    kael: 'Reading messages. So it has a location. Was it one message in particular, or the pile of them?',
    chips: ['One. I keep rereading it', 'The pile, I think'],
  },
  {
    kael: 'The rereading is the tell. A message you reread isn’t information anymore, it’s a verdict you’re appealing. What are you hoping changes on the fifth read?',
    chips: ['That it sounds less cold', 'I don’t know'],
  },
  {
    kael: 'That’s worth sitting with. The words stay the same, but each read is you negotiating with the uncertainty underneath them. We’ve met this pattern before, you and I.',
    chips: [],
  },
]

const QUERIES = [
  'Times I felt burned out',
  'When did I first doubt this relationship?',
  'Conversations about Dad',
]
/* canned AI-search results per query (the demo of "my life is being remembered") */
const RESULTS = {
  'Times I felt burned out': ['burnout', 'restless'],
  'When did I first doubt this relationship?': ['marriage'],
  'Conversations about Dad': ['dad', 'missme'],
}

const hourGreeting = () => {
  const h = new Date().getHours()
  if (h < 5) return 'Still up'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

/* ── home — the collection ── */
function Home({ onNew, onOpen }) {
  const [q, setQ] = useState('')
  const [picked, setPicked] = useState(null)
  const [focused, setFocused] = useState(false)
  const searching = q.length > 0 || picked
  const results = picked ? RESULTS[picked] : null
  const shown = results
    ? LIBRARY.filter((r) => results.includes(r.id))
    : q
      ? LIBRARY.filter((r) => (r.title + ' ' + r.line).toLowerCase().includes(q.toLowerCase()))
      : LIBRARY
  // the most recently touched reflection surfaces first — a natural fact
  // about the list order, not a special "open" state some others lack
  const mostRecent = LIBRARY[0]
  const rest = shown.filter((r) => r.id !== mostRecent.id)
  return (
    <div className="rf-screen">
      <header className="rf-head">
        <div className="rf-bar">
          <span className="rf-id">
            <span className="rf-idmark"><Sparkle size={12} weight="fill" /></span>
            Kael
          </span>
          <button className="rf-profile" aria-label="Profile">M</button>
        </div>
        <h1 className="rf-title">Reflections</h1>
        <p className="rf-sub">The things you’ve sat with.</p>
        <span className="rf-meta">Tuesday, June 30 · {LIBRARY.length} reflections</span>
        <div className="rf-search">
          <MagnifyingGlass size={15} weight="bold" />
          <input
            value={q}
            placeholder="Ask your past anything…"
            onChange={(e) => { setQ(e.target.value); setPicked(null) }}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 130)}
          />
          {searching && (
            <button className="rf-search-x" onClick={() => { setQ(''); setPicked(null) }} aria-label="Clear search">
              <X size={13} weight="bold" />
            </button>
          )}
        </div>
        {focused && !searching && (
          <div className="rf-queries">
            {QUERIES.map((s) => (
              <button key={s} className="rf-query" onMouseDown={(e) => e.preventDefault()} onClick={() => { setPicked(s); setQ('') }}>{s}</button>
            ))}
          </div>
        )}
        {picked && <p className="rf-found">{shown.length} reflection{shown.length === 1 ? '' : 's'} · found by meaning, not keywords</p>}
      </header>

      <div className="rf-scroll">
        {!searching && mostRecent && (
          <>
            <span className="rf-continue-label">Continue reflecting</span>
            <button className="rf-open" onClick={() => onOpen(mostRecent.id)}>
              <span className="rf-open-top"><span className="rf-live" />{mostRecent.when}</span>
              <span className="rf-card-title">{mostRecent.title}</span>
              <span className="rf-card-line">{mostRecent.line}</span>
              <span className="rf-open-cta">Continue</span>
            </button>
          </>
        )}
        <div className="rf-list">
          {(searching ? shown : rest).map((r) => (
            <Fragment key={r.id}>
              {!searching && r.month && <span className="rf-month">{r.month}</span>}
              <button className="rf-row" style={{ '--mood': r.mood }} onClick={() => onOpen(r.id)}>
                <span className="rf-row-meta"><span className="rf-dot" />{r.when}</span>
                <span className="rf-card-title">{r.title}</span>
                <span className="rf-card-line">{r.line}</span>
              </button>
            </Fragment>
          ))}
          {searching && shown.length === 0 && <p className="rf-none">Nothing yet. Some questions take a few more weeks of living.</p>}
        </div>
        <div className="rf-foot-sp" />
      </div>

      <button className="rf-new" onClick={onNew}><Plus size={17} weight="bold" />New Reflection</button>
    </div>
  )
}

/* ── the reflection room — new or returning ── */
function Room({ mode, onBack }) {
  const existing = mode.kind === 'old' ? LIBRARY.find((r) => r.id === mode.id) : null
  const [msgs, setMsgs] = useState(() => (existing ? [...existing.history] : []))
  const [meta, setMeta] = useState(existing ? { title: existing.title, line: existing.line } : NEW_STAGES[0])
  const [deep, setDeep] = useState(false) // true once the "stuck" door's multi-turn script is engaged
  const [turn, setTurn] = useState(0) // index into NEW_SCRIPT, only meaningful when deep
  const [typing, setTyping] = useState(false)
  const [started, setStarted] = useState(Boolean(existing))
  const [reopened, setReopened] = useState(false)
  const [draft, setDraft] = useState('')
  const bodyRef = useRef(null)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [msgs, typing])

  const kaelSays = (text, after) => {
    setTyping(true)
    timer.current = setTimeout(() => {
      setMsgs((m) => [...m, { who: 'kael', text }])
      setTyping(false)
      if (after) after()
    }, 900)
  }

  /* returning to an old room: Kael re-opens the thread with continuity */
  useEffect(() => {
    if (existing && !reopened) {
      setReopened(true)
      kaelSays(existing.reopen)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* tapping a mood or door — a doorway into a distinct, tailored opening,
     not a text insert. The living title updates the moment the user names
     what's going on, before Kael even finishes replying. */
  const start = (item) => {
    setMsgs((m) => [...m, { who: 'user', text: item.seed }])
    setStarted(true)
    if (item.deep) {
      setDeep(true)
      setMeta(NEW_STAGES[1])
      kaelSays(NEW_SCRIPT[0].kael, () => setTurn(1))
    } else {
      setMeta({ title: item.title, line: item.line })
      kaelSays(item.open)
    }
  }

  const say = (text) => {
    if (!text.trim()) return
    setMsgs((m) => [...m, { who: 'user', text: text.trim() }])
    setDraft('')
    if (!started) setStarted(true)
    if (existing || !deep) {
      kaelSays('Mm. Keep going, I’m with you.')
      return
    }
    const t = Math.min(turn, NEW_SCRIPT.length - 1)
    kaelSays(NEW_SCRIPT[t].kael, () => {
      setTurn(t + 1)
      if (t === 2) setMeta(NEW_STAGES[2])
    })
  }

  const chips = deep && started && !typing && turn > 0 && turn <= NEW_SCRIPT.length - 1
    ? NEW_SCRIPT[turn - 1].chips
    : []

  return (
    <div className="rf-screen rf-room">
      <header className="rf-room-head">
        <button className="rf-back" onClick={onBack} aria-label="Back"><ArrowLeft size={19} /></button>
        <div className="rf-room-id" key={meta.title}>
          <h2>{meta.title}</h2>
          <span>{meta.line}</span>
        </div>
        <span className="rf-room-sp" />
      </header>

      <div className="rf-body" ref={bodyRef}>
        {!started && !existing && (
          <div className="rf-start">
            <span className="rf-start-mark"><Sparkle size={15} weight="fill" /></span>
            <h3 className="rf-greet">{hourGreeting()}, {NAME}.</h3>
            <p className="rf-greet-sub">What’s alive right now?</p>
            <div className="rf-moods">
              {MOODS.map((m) => (
                <button key={m.id} className="rf-mood" onClick={() => start(m)}>
                  <m.Icon size={18} weight="duotone" />
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
            <span className="rf-or">or</span>
            <div className="rf-doors">
              {DOORS.map((d) => (
                <button key={d.id} className="rf-door" onClick={() => start(d)}>
                  <d.Icon size={16} weight="duotone" />
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {existing && <span className="rf-then">Earlier</span>}
        {msgs.map((m, k) => (
          <Fragment key={k}>
            {existing && k === existing.history.length && <span className="rf-then rf-now">Now</span>}
            <div className={`io-cmsg io-cmsg-${m.who}`}>
              {m.who === 'kael' && <span className="io-cmsg-av"><Sparkle size={12} weight="fill" /></span>}
              <p>{m.text}</p>
            </div>
          </Fragment>
        ))}
        {typing && (
          <div className="io-cmsg io-cmsg-kael">
            <span className="io-cmsg-av"><Sparkle size={12} weight="fill" /></span>
            <p className="rf-typing">…</p>
          </div>
        )}
        {chips.length > 0 && (
          <div className="rf-chips">
            {chips.map((c) => <button key={c} className="rf-chip" onClick={() => say(c)}>{c}</button>)}
          </div>
        )}
      </div>

      <div className="rf-input">
        <input
          value={draft}
          placeholder="Say it in your words…"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') say(draft) }}
        />
        <button className="rf-send" onClick={() => say(draft)} aria-label="Send"><PaperPlaneTilt size={15} weight="fill" /></button>
      </div>
    </div>
  )
}

export default function ReflectConcept() {
  const [view, setView] = useState({ kind: 'home' })
  return (
    <div className="lib-page ov-page rf-page">
      <div className="ov-stage">
        <div className="ov-screen rf-phone">
          {view.kind === 'home'
            ? <Home onNew={() => setView({ kind: 'new' })} onOpen={(id) => setView({ kind: 'old', id })} />
            : (
              <Room
                key={view.kind === 'old' ? `old-${view.id}` : 'new'}
                mode={view}
                onBack={() => setView({ kind: 'home' })}
              />
            )}
        </div>
      </div>
    </div>
  )
}
