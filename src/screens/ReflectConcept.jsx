import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft, ArrowRight, MagnifyingGlass, Plus, Sparkle, PaperPlaneTilt, X,
  Spiral, Leaf, CloudRain, Moon, Sun, HeartBreak, SmileyNervous, SunHorizon,
  ChatCircleDots, Users, Binoculars, NotePencil,
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
  { id: 'anxious', label: 'Anxious', Icon: SmileyNervous, accent: 'var(--mood-anxious)',
    seed: 'My thoughts are racing and I can’t slow them down.',
    open: 'Let’s not chase every thought. Which one keeps coming back the loudest?',
    title: 'Racing thoughts, hard to slow', line: 'Finding the one thought under the noise.' },
  { id: 'hurt', label: 'Hurt', Icon: HeartBreak, accent: 'var(--mood-hurt)',
    seed: 'I’m feeling hurt by something.',
    open: 'I’m sorry it landed like that. What happened, and where does it still sting?',
    title: 'Something that stung', line: 'Naming the hurt before it hardens.' },
  { id: 'heavy', label: 'Heavy', Icon: CloudRain, accent: 'var(--mood-low)',
    seed: 'Everything feels heavy today.',
    open: 'Heavy usually has a shape, even if it’s blurry right now. What’s the heaviest part of today?',
    title: 'Carrying more than usual', line: 'Naming what’s making today heavy.' },
  { id: 'calm', label: 'Calm', Icon: Leaf, accent: 'var(--mood-calm)',
    seed: 'I actually feel calm right now.',
    open: 'Let’s not rush past it. What settled today, and what does the calm feel like?',
    title: 'A steadier kind of day', line: 'Noticing what made room for the calm.' },
  { id: 'hopeful', label: 'Hopeful', Icon: SunHorizon, accent: 'var(--mood-hopeful)',
    seed: 'I actually feel a little hopeful today.',
    open: 'I’ll take it. What shifted, and what’s the hope resting on?',
    title: 'Something starting to shift', line: 'Naming what the hope is resting on.' },
  { id: 'grateful', label: 'Grateful', Icon: Heart, accent: 'var(--warm-proof)',
    seed: 'I’m feeling grateful and I want to sit with it.',
    open: 'Let’s slow down and savor it. What’s the thing you don’t want to rush past?',
    title: 'Something worth savoring', line: 'Holding onto what’s good before it passes.' },
]

const DOORS = [
  { id: 'overthinking', label: 'Overthinking', Icon: Spiral, accent: 'var(--mood-overthinking)', deep: true,
    seed: 'There’s something I can’t stop overthinking.' },
  { id: 'vent', label: 'Need to vent', Icon: ChatCircleDots, accent: 'var(--badge-ink)',
    seed: 'I just need to vent for a minute.',
    open: 'Go ahead, let it out. I’m not going anywhere. What’s got you?',
    title: 'Just needed to let it out', line: 'No fixing yet, just saying it.' },
  { id: 'relationship', label: 'Relationship stuff', Icon: Users, accent: 'var(--mood-hurt)',
    seed: 'Something in one of my relationships is on my mind.',
    open: 'Okay. Who is this about, and what happened between you?',
    title: 'Something in a relationship', line: 'Untangling what’s going on between us.' },
  { id: 'perspective', label: 'Need perspective', Icon: Binoculars, accent: 'var(--warm-proof)',
    seed: 'I could use some perspective on something.',
    open: 'Let’s step back a little. What are you too close to right now?',
    title: 'Trying to step back', line: 'Getting some distance to see it clearly.' },
  { id: 'good', label: 'Something good', Icon: Sun, accent: 'var(--mood-hopeful)',
    seed: 'Something good happened and I want to sit with it.',
    open: 'Let’s not rush past it. What happened, and what did it feel like in the moment?',
    title: 'Something good, worth keeping', line: 'Holding onto it before it fades.' },
  { id: 'open', label: 'Nothing in particular', Icon: NotePencil, accent: 'var(--mood-calm)',
    seed: 'Nothing specific, I just feel like reflecting.',
    open: 'That’s a good enough reason to be here. What’s been on your mind lately, even loosely?',
    title: 'Just checking in', line: 'No agenda, just noticing where things are.' },
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

/* the invitation card — a time-aware nudge that sits above the collection and
   changes its whole character across the day: what it asks, its gradient, and
   the celestial body glowing at its edge. */
const PROMPTS = {
  dawn:  { tone: 'dawn',  Icon: SunHorizon, title: 'Start the day',   sub: 'Name what matters before the day starts pulling at you.',        done: 'You set today’s intention.' },
  day:   { tone: 'day',   Icon: Sun,        title: 'A midday pause',  sub: 'Check in with where your head actually is right now.',           done: 'You paused this afternoon.' },
  dusk:  { tone: 'dusk',  Icon: Moon,       title: 'End the day',     sub: 'Look back on what happened and close the loop before sleep.',    done: 'You closed the day.' },
  night: { tone: 'night', Icon: Moon,       title: 'Still awake?',    sub: 'Something’s keeping you up. Set it down here before you sleep.',  done: 'You set it down for the night.' },
}
export const autoTone = () => {
  const h = new Date().getHours()
  if (h >= 22 || h < 5) return 'night'
  if (h < 12) return 'dawn'
  if (h < 17) return 'day'
  return 'dusk'
}

/* ── home — the collection ── */
export function Home({ onNew, onOpen, lib = LIBRARY, promptTone, reflected, onInvite, onReopen, name = NAME, firstVisit = false }) {
  const [q, setQ] = useState('')
  const [picked, setPicked] = useState(null)
  const [focused, setFocused] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
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
  return (
    <div className="rf-screen">
      <header className="rf-top">
        <div className="rf-masthead">
          <div className="rf-hello-block">
            <h1 className="rf-hello">{hourGreeting()}, {name}</h1>
            <span className="rf-hello-sub">{empty ? 'Tuesday, June 30' : `Tuesday, June 30 · ${lib.length} reflection${lib.length === 1 ? '' : 's'}`}</span>
          </div>
          <div className="rf-top-actions">
            {!empty && (
              <button
                className="rf-icon-btn"
                data-on={searchOpen || undefined}
                aria-label={searchOpen ? 'Close search' : 'Search'}
                onClick={() => setSearchOpen((o) => { const n = !o; if (!n) { setQ(''); setPicked(null) } return n })}
              >
                {searchOpen ? <X size={17} weight="bold" /> : <MagnifyingGlass size={18} weight="bold" />}
              </button>
            )}
            <button className="rf-profile" aria-label="Profile">{name[0]}</button>
          </div>
        </div>
        {!empty && searchOpen && (
          <div className="rf-searchwrap">
            <div className="rf-search" data-open>
              <MagnifyingGlass size={16} weight="bold" />
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
            {firstVisit ? (
              <>
                <p className="rf-first-line">Your first reflection is waiting, {name}.</p>
                <p className="rf-first-sub">Whenever you’re ready — I already know where we’d start.</p>
                <button className="rf-first-cta" onClick={onNew}>Pick it back up <ArrowRight size={15} weight="bold" /></button>
              </>
            ) : (
              <p className="rf-first-line">Your reflections will gather here.</p>
            )}
          </div>
        )}
        {!searching && mostRecent && (
          <>
            {(() => {
              const p = PROMPTS[promptTone] || PROMPTS[autoTone()]
              if (reflected) {
                return (
                  <div className="rf-prompt-slim" data-tone={p.tone}>
                    <span className="rf-prompt-slim-ic"><p.Icon size={15} weight="fill" /></span>
                    <span className="rf-prompt-slim-tx">{p.done}</span>
                  </div>
                )
              }
              return (
                <button className="rf-prompt" data-tone={p.tone} onClick={onInvite || onNew}>
                  <span className="rf-prompt-glyph" aria-hidden="true"><p.Icon size={176} weight="fill" /></span>
                  <span className="rf-prompt-title">{p.title}</span>
                  <span className="rf-prompt-sub">{p.sub}</span>
                  <span className="rf-prompt-cta">Begin reflection <ArrowRight size={14} weight="bold" /></span>
                </button>
              )
            })()}
            {firstVisit && single && (
              <div className="rf-milestone">
                <span className="rf-milestone-ic"><Checks size={14} weight="bold" /></span>
                <p>That’s your first one. It stays here — I remember all of it, and you can pick it back up anytime.</p>
              </div>
            )}
            <span className="rf-label">{single ? 'Your reflection' : 'Ongoing'}</span>
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
                  <span className="rf-tile-ic"><m.Icon size={23} weight="duotone" /></span>
                  <span className="rf-tile-tx">{m.label}</span>
                </button>
              ))}
            </div>
            <span className="rf-or">or bring what’s going on</span>
            <div className="rf-doors">
              {DOORS.map((d) => (
                <button key={d.id} className="rf-door" style={{ '--accent': d.accent }} onClick={() => start(d)}>
                  <span className="rf-door-ic"><d.Icon size={18} weight="duotone" /></span>
                  <span className="rf-door-tx">{d.label}</span>
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
  const [tone, setTone] = useState('auto') // auto | dawn | day | dusk | night — preview the invitation card across the day
  const lib = demo === 'none' ? [] : demo === 'one' ? LIBRARY.slice(0, 1) : LIBRARY
  return (
    <div className="lib-page ov-page rf-page">
      <div className="rf-demo">
        {[['all', 'Full'], ['one', 'One reflection'], ['none', 'First run']].map(([id, label]) => (
          <button key={id} className="rf-demo-chip" data-on={demo === id || undefined} onClick={() => { setDemo(id); setView({ kind: 'home' }) }}>{label}</button>
        ))}
        <span className="rf-demo-sep" />
        {[['auto', 'Auto'], ['dawn', 'Dawn'], ['day', 'Day'], ['dusk', 'Evening'], ['night', 'Night']].map(([id, label]) => (
          <button key={id} className="rf-demo-chip" data-on={tone === id || undefined} onClick={() => { setTone(id); setView({ kind: 'home' }) }}>{label}</button>
        ))}
      </div>
      <div className="ov-stage">
        <div className="ov-screen rf-phone">
          {view.kind === 'home'
            ? <Home lib={lib} promptTone={tone === 'auto' ? undefined : tone} onNew={() => setView({ kind: 'new' })} onOpen={(id) => setView({ kind: 'old', id })} />
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
