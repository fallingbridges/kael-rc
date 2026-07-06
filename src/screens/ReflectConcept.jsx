import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft, ArrowRight, MagnifyingGlass, Plus, Sparkle, PaperPlaneTilt, X,
  Heartbeat, Spiral, Waves, CloudRain, Moon, Sun, CloudSun, ArrowsLeftRight,
  Lightning, Scales, Question, ChatCircleDots,
  Compass, User, EnvelopeSimple, Briefcase, Heart, ClockCounterClockwise,
  Checks,
} from '@phosphor-icons/react'

const nowStr = () => new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

/* ──────────────────────────────────────────────────────────────────────────
   Reflect — the one-verb model, as a standalone concept.

   Kael is a place to reflect on something. One CTA: New Reflection. Each
   reflection is its own chat, titled and described by living metadata that
   updates as you talk. Home is the collection: your life, being recorded.
   Nothing ever closes; every reflection waits for your return. Search is
   AI-native. No rituals, no generated artifacts: the chat is the artifact.
   ────────────────────────────────────────────────────────────────────────── */

const NAME = 'Maya'

/* moods & doors — each a doorway into a distinct conversation, not a text
   insert: it carries Kael's actual first reply (`open`) and the living
   title/line the reflection settles into. "Can't stop thinking" routes into
   the deeper fully scripted NEW_SCRIPT demo (`deep: true`). Free text in the
   composer covers everything these don't. */
const MOODS = [
  { id: 'anxious', label: 'Anxious', Icon: Heartbeat, accent: 'var(--mood-anxious)',
    seed: 'I’m feeling anxious and I can’t tell why.',
    open: 'Where do you feel it, in the thought or in the body? That usually tells us which one to follow first.',
    title: 'Anxious, and not sure why', line: 'Finding where it actually lives.' },
  { id: 'restless', label: 'Restless', Icon: Waves, accent: 'var(--mood-restless)',
    seed: 'I’m restless and I can’t settle.',
    open: 'Where do you notice it most right now: work, a relationship, your body, or just life in general?',
    title: 'Restless, and not sure where to point it', line: 'Finding what the restlessness is actually about.' },
  { id: 'heavy', label: 'Heavy', Icon: CloudRain, accent: 'var(--mood-low)',
    seed: 'Everything feels heavy today.',
    open: 'Heavy usually has a shape, even if it’s blurry right now. What’s the heaviest part of today?',
    title: 'Carrying more than usual', line: 'Naming what’s making today heavy.' },
  { id: 'conflicted', label: 'Conflicted', Icon: ArrowsLeftRight, accent: 'var(--mood-ashamed)',
    seed: 'Part of me wants one thing, and part of me wants the opposite.',
    open: 'Two things pulling at once, probably. Tell me both sides, even the one that feels less reasonable.',
    title: 'Torn between two things', line: 'Naming both sides before choosing either.' },
  { id: 'lost', label: 'Lost', Icon: Moon, accent: 'var(--mood-lonely)',
    seed: 'I feel a bit lost right now.',
    open: 'Lost usually means you can name what you’re not more easily than what you are. Start there if it helps.',
    title: 'Not sure what I actually want', line: 'Starting with what it isn’t.' },
  { id: 'hopeful', label: 'Hopeful', Icon: CloudSun, accent: 'var(--mood-hopeful)',
    seed: 'I actually feel a little hopeful today.',
    open: 'I’ll take it. What’s the hope attached to, so I understand what we’re protecting?',
    title: 'Something worth protecting', line: 'Naming what the hope is resting on.' },
]

const DOORS = [
  { id: 'happened', label: 'Something happened', Icon: Lightning, accent: 'var(--warm-react)',
    seed: 'Something happened today and I need to talk about it.',
    open: 'Okay. Start wherever it starts, even if it’s just the moment right before it happened.',
    title: 'Something happened today', line: 'Starting from the moment itself.' },
  { id: 'stuck', label: 'I can’t stop thinking about this', Icon: Spiral, accent: 'var(--mood-overthinking)', deep: true,
    seed: 'There’s something I can’t stop thinking about.' },
  { id: 'decision', label: 'A decision I’m avoiding', Icon: Scales, accent: 'var(--warm-proof)',
    seed: 'I have a decision to make and I keep going back and forth.',
    open: 'Let’s slow it down before choosing. What are you deciding between?',
    title: 'A decision I keep circling', line: 'Slowing down before choosing.' },
  { id: 'unclear', label: 'I don’t know what I’m feeling', Icon: Question, accent: 'var(--mood-numb)',
    seed: 'I don’t really know what I’m feeling right now.',
    open: 'That’s enough to begin. What happened right before you started feeling off?',
    title: 'Not sure what this feeling is', line: 'Working backward to where it started.' },
  { id: 'talk', label: 'I just need to talk', Icon: ChatCircleDots, accent: 'var(--badge-ink)',
    seed: 'I just need to talk for a bit.',
    open: 'I’m here. No agenda, just talk. What’s on your mind?',
    title: 'Just needed to talk', line: 'No particular direction yet, and that’s fine.' },
]

/* the collection — living titles + one-liners, newest first. Nothing is ever
   "closed"; the most recent one just surfaces first (LIBRARY[0]), the same
   as every other reflection, only more recently touched. */
const LIBRARY = [
  {
    id: 'restless', when: '2h ago',
    title: 'Why am I so restless lately?',
    line: 'Life is moving, but maybe not in the right direction.',
    mood: 'var(--mood-restless)', Icon: Compass,
    history: [
      { who: 'user', time: '9:40 AM', text: 'I keep feeling like I should be somewhere else. Not physically. Just… further.' },
      { who: 'kael', time: '9:41 AM', text: 'Further than what, though? When you picture the place you’re behind, whose finish line is it?' },
      { who: 'user', time: '9:43 AM', text: 'Honestly, I don’t know. Everyone’s, maybe.' },
    ],
    reopen: 'You left this one mid-thought. Want to pick it back up, or has it moved since morning?',
  },
  {
    id: 'dad', when: '6d ago',
    title: 'The fight with Dad',
    line: 'Anger on the surface, but something older underneath it.',
    mood: 'var(--mood-hurt)', Icon: User,
    history: [
      { who: 'user', time: '8:14 PM', text: 'He said I’ve become too busy for family. In front of everyone.' },
      { who: 'kael', time: '8:15 PM', text: 'That landed somewhere specific, I think. Not as an observation about your calendar.' },
      { who: 'user', time: '8:17 PM', text: 'It’s the same thing he said when I chose my college.' },
      { who: 'kael', time: '8:18 PM', text: 'So Tuesday wasn’t one comment. It was a rerun. The anger makes more sense now.' },
    ],
    reopen: 'It’s been a while since we sat with this one. Where does it live in you today?',
  },
  {
    id: 'manager', when: '1w ago',
    title: 'What my manager’s silence does to me',
    line: 'Four hours on read, and a verdict I wrote myself.',
    mood: 'var(--mood-anxious)', Icon: EnvelopeSimple,
    history: [
      { who: 'user', time: '3:02 PM', text: 'She saw my message four hours ago. Nothing.' },
      { who: 'kael', time: '3:03 PM', text: 'And in those four hours, what story got written?' },
    ],
    reopen: 'Last time, the silence had become a verdict by hour two. Did the reply ever come?',
  },
  {
    id: 'marriage', when: '2w ago',
    title: 'Do I actually want marriage?',
    line: 'Separating what I want from what I’m expected to want.',
    mood: 'var(--mood-overthinking)', Icon: Heart,
    history: [
      { who: 'user', time: '7:20 PM', text: 'Mom brought it up again. And the strange thing is I wasn’t even annoyed.' },
      { who: 'kael', time: '7:21 PM', text: 'Not annoyed is interesting. What was there instead?' },
    ],
    reopen: 'We never finished separating the want from the expected. Both are probably still in the room.',
  },
  {
    id: 'burnout', when: '4w ago',
    title: 'Why am I losing motivation at work?',
    line: 'Burned out, or simply done with this chapter.',
    mood: 'var(--mood-tired)', Icon: Briefcase,
    history: [
      { who: 'user', time: '6:45 PM', text: 'I used to care about shipping things. Now I just watch the clock.' },
      { who: 'kael', time: '6:46 PM', text: 'When did the clock-watching start? Not roughly. Try to find the week.' },
    ],
    reopen: 'You suspected it wasn’t tiredness but doneness. Has June answered that?',
  },
  {
    id: 'missme', when: '6w ago',
    title: 'I miss who I used to be',
    line: 'Grieving an older self while meeting the next one.',
    mood: 'var(--mood-sad)', Icon: ClockCounterClockwise,
    history: [
      { who: 'user', time: '10:05 PM', text: 'I saw a photo from three years ago and it hurt. She laughed so easily.' },
      { who: 'kael', time: '10:06 PM', text: 'What do you know now that she didn’t? Grief and growth usually share a room.' },
    ],
    reopen: 'The photo from three years ago. I remember. Gentler question this time: what would she admire about you now?',
  },
]

/* the deep-scripted demo, reached only via the "I can't stop thinking about
   this" door — a multi-turn conversation showing the living title evolve
   twice as Kael actually finds what it's about, not just once at the top. */
const NEW_STAGES = [
  { title: 'New reflection', line: 'Say it however it comes.', Icon: null, accent: null },
  { title: 'The thing I can’t stop thinking about', line: 'Finding where it started.', Icon: Spiral, accent: 'var(--mood-overthinking)' },
  { title: 'The message I keep rereading', line: 'Not the reply itself, but what the waiting wakes up.', Icon: EnvelopeSimple, accent: 'var(--mood-anxious)' },
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
export function Home({ onNew, onOpen, lib = LIBRARY }) {
  const [q, setQ] = useState('')
  const [picked, setPicked] = useState(null)
  const [focused, setFocused] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const searching = q.length > 0 || picked
  const results = picked ? RESULTS[picked] : null
  const shown = results
    ? lib.filter((r) => results.includes(r.id))
    : q
      ? lib.filter((r) => (r.title + ' ' + r.line).toLowerCase().includes(q.toLowerCase()))
      : lib
  // the most recently touched reflection surfaces first — a natural fact
  // about the list order, not a special "open" state some others lack
  const empty = lib.length === 0
  const single = lib.length === 1
  const mostRecent = lib[0]
  const MostRecentIcon = mostRecent ? mostRecent.Icon : null
  const rest = mostRecent ? shown.filter((r) => r.id !== mostRecent.id) : []
  const hour = new Date().getHours()
  const TimeIcon = hour >= 17 || hour < 5 ? Moon : Sun
  const toggleSearch = () => {
    setShowSearch((s) => {
      if (s) { setQ(''); setPicked(null) }
      return !s
    })
  }
  return (
    <div className="rf-screen">
      <header className="rf-top">
        <div className="rf-masthead">
          <div className="rf-hello-block">
            <h1 className="rf-hello">{hourGreeting()}, {NAME}</h1>
            <span className="rf-hello-sub">{empty ? 'Tuesday, June 30' : `Tuesday, June 30 · ${lib.length} reflection${lib.length === 1 ? '' : 's'}`}</span>
          </div>
          <div className="rf-top-actions">
            {!empty && (
              <button className="rf-iconbtn" data-on={showSearch || undefined} onClick={toggleSearch} aria-label="Search">
                <MagnifyingGlass size={16} weight="bold" />
              </button>
            )}
            <button className="rf-profile" aria-label="Profile">M</button>
          </div>
        </div>
        {showSearch && (
          <div className="rf-searchwrap">
            <div className="rf-search">
              <MagnifyingGlass size={15} weight="bold" />
              <input
                autoFocus
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
          </div>
        )}
      </header>

      <div className="rf-scroll">
        {empty && (
          <div className="rf-first">
            <div className="rf-first-art" aria-hidden="true">
              <span className="rf-first-disc" data-i="0" style={{ '--tint': 'var(--mood-hurt)' }}><Heart size={22} weight="duotone" /></span>
              <span className="rf-first-disc" data-i="1" style={{ '--tint': 'var(--warm-proof)' }}><Compass size={30} weight="duotone" /></span>
              <span className="rf-first-disc" data-i="2" style={{ '--tint': 'var(--mood-low)' }}><CloudRain size={22} weight="duotone" /></span>
            </div>
            <p className="rf-first-line">Your reflections will gather here.</p>
          </div>
        )}
        {!searching && mostRecent && (
          <>
            <span className="rf-label">Ongoing</span>
            <button className="rf-hero" style={{ '--mood': mostRecent.mood }} onClick={() => onOpen(mostRecent.id)}>
              <span className="rf-hero-meta"><MostRecentIcon size={14} weight="fill" />{mostRecent.when}</span>
              <span className="rf-hero-title">{mostRecent.title}</span>
              <span className="rf-hero-line">{mostRecent.line}</span>
              <span className="rf-hero-go"><ArrowRight size={16} weight="bold" /></span>
            </button>
            {single ? (
              <button className="rf-ghost" onClick={onNew}>
                <span className="rf-ghost-ic"><Plus size={22} weight="bold" /></span>
                <span className="rf-ghost-tx">Start another reflection</span>
              </button>
            ) : (
              <span className="rf-label">All reflections</span>
            )}
          </>
        )}
        <div className="rf-cards">
          {(searching ? shown : rest).map((r) => (
            <button key={r.id} className="rf-card" style={{ '--mood': r.mood }} onClick={() => onOpen(r.id)}>
              <span className="rf-card-ic"><r.Icon size={22} weight="duotone" /></span>
              <span className="rf-card-body">
                <span className="rf-card-top">
                  <span className="rf-card-title">{r.title}</span>
                  <span className="rf-card-when">{r.when}</span>
                </span>
                <span className="rf-card-line">{r.line}</span>
              </span>
            </button>
          ))}
          {searching && shown.length === 0 && <p className="rf-none">Nothing yet. Some questions take a few more weeks of living.</p>}
        </div>
        <div className="rf-foot-sp" />
      </div>

      <button className="rf-fab" onClick={onNew} aria-label="New reflection"><Plus size={24} weight="bold" /></button>
    </div>
  )
}

/* ── the reflection room — new or returning ── */
export function Room({ mode, onBack, onNew }) {
  const existing = mode.kind === 'old' ? LIBRARY.find((r) => r.id === mode.id) : null
  const [msgs, setMsgs] = useState(() => (existing ? [...existing.history] : []))
  const [meta, setMeta] = useState(existing
    ? { title: existing.title, line: existing.line, Icon: existing.Icon, accent: existing.mood }
    : NEW_STAGES[0])
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
      setMsgs((m) => [...m, { who: 'kael', text, time: nowStr() }])
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
    setMsgs((m) => [...m, { who: 'user', text: item.seed, time: nowStr() }])
    setStarted(true)
    if (item.deep) {
      setDeep(true)
      setMeta(NEW_STAGES[1])
      kaelSays(NEW_SCRIPT[0].kael, () => setTurn(1))
    } else {
      setMeta({ title: item.title, line: item.line, Icon: item.Icon, accent: item.accent })
      kaelSays(item.open)
    }
  }

  const say = (text) => {
    if (!text.trim()) return
    setMsgs((m) => [...m, { who: 'user', text: text.trim(), time: nowStr() }])
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
        <button className="rf-room-new" onClick={onNew} aria-label="New reflection">
          <Plus size={17} weight="bold" />
        </button>
      </header>

      <div className="rf-body" ref={bodyRef}>
        {!started && !existing && (
          <div className="rf-start">
            <span className="rf-start-sun">{new Date().getHours() >= 17 || new Date().getHours() < 5 ? <Moon size={26} weight="duotone" /> : <Sun size={26} weight="duotone" />}</span>
            <h3 className="rf-greet">{hourGreeting()}, {NAME}.</h3>
            <p className="rf-greet-sub">How are you feeling right now?</p>
            <p className="rf-greet-note">There’s no right way to start.</p>
            <div className="rf-tiles">
              {MOODS.map((m) => (
                <button key={m.id} className="rf-tile" style={{ '--accent': m.accent }} onClick={() => start(m)}>
                  <m.Icon size={22} weight="duotone" />
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
            <span className="rf-or">or</span>
            <div className="rf-doors">
              {DOORS.map((d) => (
                <button key={d.id} className="rf-door" style={{ '--accent': d.accent }} onClick={() => start(d)}>
                  <d.Icon size={18} weight="duotone" />
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
              <div className="rf-msg-col">
                <p>{m.text}</p>
                {m.time && (
                  <span className="rf-msg-time">
                    {m.time}
                    {m.who === 'user' && <Checks size={12} weight="bold" />}
                  </span>
                )}
              </div>
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
        <button className="rf-send" onClick={() => say(draft)} aria-label="Send"><PaperPlaneTilt size={17} weight="fill" /></button>
      </div>
    </div>
  )
}

export default function ReflectConcept() {
  const [view, setView] = useState({ kind: 'home' })
  const [demo, setDemo] = useState('all') // all | one | none — first-run states
  const lib = demo === 'none' ? [] : demo === 'one' ? LIBRARY.slice(0, 1) : LIBRARY
  return (
    <div className="lib-page ov-page rf-page">
      <div className="rf-demo">
        {[['all', 'Full'], ['one', 'One reflection'], ['none', 'First run']].map(([id, label]) => (
          <button key={id} className="rf-demo-chip" data-on={demo === id || undefined} onClick={() => { setDemo(id); setView({ kind: 'home' }) }}>{label}</button>
        ))}
      </div>
      <div className="ov-stage">
        <div className="ov-screen rf-phone">
          {view.kind === 'home'
            ? <Home lib={lib} onNew={() => setView({ kind: 'new' })} onOpen={(id) => setView({ kind: 'old', id })} />
            : (
              <Room
                key={view.kind === 'old' ? `old-${view.id}` : 'new'}
                mode={view}
                onBack={() => setView({ kind: 'home' })}
                onNew={() => setView({ kind: 'new' })}
              />
            )}
        </div>
      </div>
    </div>
  )
}
