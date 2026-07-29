import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft, ArrowRight, MagnifyingGlass, Plus, Sparkle, PaperPlaneTilt, X, Check,
  Spiral, CloudRain, Anchor, Hourglass, Fire, Moon, Sun, SmileyNervous, SunHorizon,
  ChatCircleDots, Scales, Question,
  Compass, User, EnvelopeSimple, Briefcase, Heart, ClockCounterClockwise,
  Checks, Infinity as InfinityIcon, Brain, Wind, BookmarkSimple, ArrowsClockwise, Faders, CaretRight,
} from '@phosphor-icons/react'

import { PATTERN_LESSONS } from '../patternLessons.js'

const nowStr = () => new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

/* reveals `total` characters one at a time, like the V7 first screen's typewriter */
function useReveal(total, speed = 15, delay = 560) {
  const [n, setN] = useState(0)
  useEffect(() => {
    setN(0)
    if (!total) return undefined
    let i = 0, iv
    const t = setTimeout(() => {
      iv = setInterval(() => { i++; setN(i); if (i >= total) clearInterval(iv) }, speed)
    }, delay)
    return () => { clearTimeout(t); clearInterval(iv) }
  }, [total, speed, delay])
  return n
}

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
    chips: ['Work, probably', 'Something I said', 'I can’t pin it down'],
    title: 'Racing thoughts, hard to slow', line: 'Finding the one thought under the noise.' },
  { id: 'overthinking', label: 'Overthinking', Icon: Spiral, accent: 'var(--mood-overthinking)',
    seed: 'There’s something I can’t stop overthinking.',
    open: 'Round and round. What’s the thing your mind keeps circling back to?',
    chips: ['A conversation', 'A decision', 'Something I can’t change'],
    title: 'Caught in a loop', line: 'Finding what the mind keeps circling.' },
  { id: 'frustrated', label: 'Frustrated', Icon: Fire, accent: 'var(--mood-angry)',
    seed: 'I’m frustrated and I can’t shake it.',
    open: 'Okay. Frustration usually points at something. What’s getting in the way?',
    chips: ['Someone', 'A situation', 'Myself, honestly'],
    title: 'Frustrated with something', line: 'Finding what the frustration is really about.' },
  { id: 'stuck', label: 'Stuck', Icon: Anchor, accent: 'var(--mood-stressed)',
    seed: 'I feel stuck, like I can’t move forward.',
    open: 'Stuck usually has a shape. Where does it feel most like you’re not moving right now?',
    chips: ['My life in general', 'Work', 'Something in me'],
    title: 'Feeling stuck', line: 'Finding where things stopped moving.' },
  { id: 'low', label: 'Feeling low', Icon: CloudRain, accent: 'var(--mood-low)',
    seed: 'I’ve just been feeling low.',
    open: 'I’m here for the low days. Does it have a reason attached, or is it just sitting there?',
    chips: ['Something happened', 'No reason I can name', 'A bit of both'],
    title: 'A quieter, lower day', line: 'Sitting with it instead of rushing past.' },
  { id: 'bored', label: 'Bored', Icon: Hourglass, accent: 'var(--mood-numb)',
    seed: 'I feel bored and kind of restless.',
    open: 'Boredom’s usually pointing at something. Does it feel more restless, or more empty?',
    chips: ['Restless', 'Empty', 'Just flat'],
    title: 'A restless kind of bored', line: 'Listening to what the boredom is pointing at.' },
  { id: 'confused', label: 'Confused', Icon: Question, accent: 'var(--mood-overwhelmed)',
    seed: 'I feel confused. I can’t make sense of things right now.',
    open: 'Let’s slow it down. What’s the thing you can’t quite make sense of?',
    chips: ['A situation', 'How I feel', 'What I want'],
    title: 'Trying to make sense of it', line: 'Slowing down to find some clarity.' },
  { id: 'good', label: 'Feeling good', Icon: Sun, accent: 'var(--mood-calm)',
    seed: 'I’m actually feeling really good right now.',
    open: 'Let’s not rush past it. What’s behind the good mood?',
    chips: ['Something went right', 'Just a good day', 'Not sure, but I’ll take it'],
    title: 'A genuinely good day', line: 'Noticing what put you here.' },
  { id: 'grateful', label: 'Grateful', Icon: Heart, accent: 'var(--warm-proof)',
    seed: 'I’m feeling grateful and I want to sit with it.',
    open: 'Let’s slow down and savor it. What’s the thing you don’t want to rush past?',
    chips: ['Someone in my life', 'A small moment', 'Where I’ve landed'],
    title: 'Something worth savoring', line: 'Holding onto what’s good before it passes.' },
]

/* "Ask me something" — Kael leads with a deep, reflective question when the user
   has nothing specific to bring. A rotating bank, so it feels fresh each time. */
const ASK_LEADS = [
  'Okay. Sit with this one for a second.',
  'Here’s one I’d genuinely like to know.',
  'Let’s try this. There’s no wrong answer.',
  'Alright. Take your time with this.',
]
const ASK_QUESTIONS = [
  'What’s something you’ve been avoiding thinking about?',
  'When did you last feel truly like yourself?',
  'What’s taking up the most space in your head right now, even if it seems small?',
  'What’s something you’re pretending is fine?',
  'What’s a feeling you’ve had all week but haven’t named?',
  'What are you holding onto that you might be ready to put down?',
  'What’s been quietly draining you lately?',
  'What’s something good that happened that you brushed past too quickly?',
  'If you were being completely honest with yourself right now, what would you admit?',
  'What’s a version of yourself you miss?',
  'What do you keep hoping someone will notice?',
  'What’s the story you’ve been telling yourself lately, and is it actually true?',
  'What would you do differently this week if no one would judge you for it?',
  'What’s something you know you need, but keep putting off?',
  'When did you last surprise yourself, in a good way?',
]

/* generic quick-replies — a rotating fallback so every Kael message has
   tappable options, even the ones without a scripted set */
const REPLY_SETS = [
  ['Yeah, that’s it', 'Not really', 'I’m not sure'],
  ['There’s more to it', 'That’s most of it', 'Hard to say'],
  ['Kind of', 'Not quite', 'Let me think'],
  ['That’s the part', 'Maybe', 'Go on'],
  ['Exactly', 'A little', 'I hadn’t thought of that'],
]

/* what each named loop actually is. The names are Kael's invention, so they
   have to be able to explain themselves the moment someone taps one. */
const PATTERN_NOTES = {
  'Inheritance loop': {
    what: 'A comment lands harder than its size because it isn’t the first time. You end up answering the whole history, not the sentence in front of you.',
    tell: 'The reaction is bigger than the moment that caused it.',
  },
  'Silence spiral': {
    what: 'When someone goes quiet, you write the verdict yourself. It is rarely a kind one, and it always arrives before any actual information does.',
    tell: 'You know what they think before they’ve said anything.',
  },
  'Comparison loop': {
    what: 'You measure your pace against a finish line someone else drew, then read the gap as failure. The restlessness has no specific want underneath it.',
    tell: 'Feeling behind, without being able to name behind what.',
  },
  'Clock-watching': {
    what: 'Interest drains out and time becomes the thing you manage instead of the work. Not dread exactly, more absence.',
    tell: 'Counting hours rather than dreading tasks.',
  },
}

/* the collection — living titles + one-liners, newest first. Nothing is ever
   "closed"; the most recent one just surfaces first (LIBRARY[0]), the same
   as every other reflection, only more recently touched. */
const LIBRARY = [
  {
    id: 'restless', when: '2h ago',
    title: 'Why am I so restless lately?',
    line: 'Life is moving, but maybe not in the right direction.',
    tags: ['Direction', 'Restless'], patterns: ['Comparison loop', 'Clock-watching'],
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
    tags: ['Family', 'Dad', 'Heavy'], patterns: ['Inheritance loop', 'Silence spiral'],
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
    tags: ['Work', 'Priya', 'Anxious'], patterns: ['Silence spiral', 'Comparison loop'],
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
    tags: ['Self', 'Mom', 'Overthinking'], patterns: ['Inheritance loop'],
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
    tags: ['Work', 'Tired'], patterns: ['Clock-watching', 'Silence spiral'],
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
    tags: ['Self', 'Grief'], patterns: ['Comparison loop'],
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


/* ── the loop, opened full screen as something worth reading ── */
function PatternLesson({ name, seen, onBack, onOpen }) {
  const l = PATTERN_LESSONS[name]
  if (!l) return null
  return (
    <div className="rf-lesson">
      <header className="rf-lesson-bar">
        <button className="rf-lesson-back" onClick={onBack} aria-label="Back"><ArrowLeft size={19} /></button>
        <span className="rf-lesson-bar-name">{name}</span>
      </header>

      <div className="rf-lesson-scroll">
        <div className="rf-lesson-head">
          <span className="rf-lesson-kicker"><ArrowsClockwise size={12} weight="bold" />{l.kicker}</span>
          <h1 className="rf-lesson-title">{l.title}</h1>
          <p className="rf-lesson-lede">{l.lede}</p>
          <span className="rf-lesson-meta">
            {l.minutes} min read
            <i />
            Seen in {seen.length} reflection{seen.length === 1 ? '' : 's'}
          </span>
        </div>

        <article className="rf-lesson-body">
          {l.blocks.map((b, i) => {
            if (b.t === 'h') return <h2 key={i}>{b.v}</h2>
            if (b.t === 'quote') return <blockquote key={i}>{b.v}</blockquote>
            if (b.t === 'note') return <aside key={i}>{b.v}</aside>
            if (b.t === 'list') {
              return (
                <ul key={i}>
                  {b.v.map((li) => (<li key={li}>{li}</li>))}
                </ul>
              )
            }
            return <p key={i}>{b.v}</p>
          })}
        </article>

        <section className="rf-lesson-seen">
          <span className="rf-lesson-seen-label">Where it showed up</span>
          {seen.map((r) => (
            <button key={r.id} className="rf-lesson-row" onClick={() => onOpen(r.id)}>
              <span className="rf-lesson-row-ic"><r.Icon size={18} weight="duotone" /></span>
              <span className="rf-lesson-row-tx">
                <b>{r.title}</b>
                <i>{r.when}</i>
              </span>
              <CaretRight size={14} weight="bold" />
            </button>
          ))}
        </section>
        <div className="rf-foot-sp" />
      </div>
    </div>
  )
}

/* ── home — the collection ── */
export function Home({ onNew, onOpen, lib = LIBRARY, promptTone, reflected, onInvite, onReopen, name = NAME }) {
  const [q, setQ] = useState('')
  const [picked, setPicked] = useState(null)
  const [focused, setFocused] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [saved, setSaved] = useState({ dad: true })
  const toggleSave = (id) => setSaved((s) => ({ ...s, [id]: !s[id] }))
  /* every tag in the collection, in the order it first appears */
  const [tag, setTag] = useState(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [pattern, setPattern] = useState(null)
  const allTags = useMemo(() => {
    const seen = []
    lib.forEach((r) => (r.tags || []).forEach((t) => { if (!seen.includes(t)) seen.push(t) }))
    return seen
  }, [lib])
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
  const restAll = mostRecent ? shown.filter((r) => r.id !== mostRecent.id) : []
  const rest = tag ? restAll.filter((r) => (r.tags || []).includes(tag)) : restAll

  /* one card for every reflection. The ongoing one is the same object, only
     warmer, set larger, and closing on an arrow. */
  const renderCard = (r, lead) => (
    <button
      key={r.id}
      className={`rf-card${lead ? ' rf-card-lead' : ''}`}
      style={{ '--mood': r.mood }}
      onClick={() => onOpen(r.id)}
    >
      <span className="rf-card-ic" aria-hidden="true"><r.Icon size={lead ? 24 : 22} weight="duotone" /></span>
      <span className="rf-card-body">
        <span className="rf-card-top">
          <span className="rf-card-meta">
            <span className="rf-card-when">{r.when}</span>
          </span>
          <span className="rf-card-title">{r.title}</span>
        </span>
        <span className="rf-card-line">{r.line}</span>
        <span className="rf-card-tagrow">
          <span className="rf-card-tags">
            {/* tapping a tag filters the collection instead of opening the reflection */}
            {(r.tags || []).map((t) => (
              <span
                className="rf-card-tag"
                key={t}
                role="button"
                tabIndex={0}
                data-on={tag === t || undefined}
                aria-label={`Filter by ${t}`}
                onClick={(ev) => { ev.stopPropagation(); setTag(tag === t ? null : t) }}
                onKeyDown={(ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); ev.stopPropagation(); setTag(tag === t ? null : t) } }}
              >
                {t}
              </span>
            ))}
          </span>
          <span className="rf-card-go"><ArrowRight size={lead ? 16 : 14} weight="bold" /></span>
        </span>
        {(r.patterns || []).length > 0 && (
          <span className="rf-card-pat">
            <ArrowsClockwise size={14} weight="bold" />
            {/* each loop opens its own lesson; commas keep them one readable line */}
            <span className="rf-card-pats">
              {r.patterns.map((p, i) => (
                <span key={p}>
                  {i > 0 && <span className="rf-card-pat-sep">, </span>}
                  <u
                    role="button"
                    tabIndex={0}
                    aria-label={`About the ${p}`}
                    onClick={(ev) => { ev.stopPropagation(); setPattern(p) }}
                    onKeyDown={(ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); ev.stopPropagation(); setPattern(p) } }}
                  >
                    {p}
                  </u>
                </span>
              ))}
            </span>
          </span>
        )}
      </span>
    </button>
  )
  return (
    <div className="rf-screen">
      <header className="rf-top">
        <div className="rf-masthead">
          <div className="rf-hello-block">
            <h1 className="rf-hello">{hourGreeting()}, {name}</h1>
            <span className="rf-hello-sub">{empty ? 'Tuesday, June 30' : `Tuesday, June 30 · ${lib.length} reflection${lib.length === 1 ? '' : 's'}`}</span>
          </div>
          <div className="rf-top-actions">
            <button
              className="rf-icon-btn"
              data-on={searchOpen || undefined}
              aria-label={searchOpen ? 'Close search' : 'Ask about your life'}
              onClick={() => setSearchOpen((o) => { const n = !o; if (!n) { setQ(''); setPicked(null) } return n })}
            >
              {searchOpen ? <X size={17} weight="bold" /> : <MagnifyingGlass size={18} weight="bold" />}
            </button>
            <button className="rf-profile" aria-label="Profile">{name[0]}</button>
          </div>
        </div>
        {searchOpen && (
          <div className="rf-searchwrap">
            <div className="rf-search" data-open={focused || searching || undefined}>
              <Sparkle size={16} weight="fill" color="var(--warm-proof)" />
              <input
                autoFocus
                value={q}
                placeholder="Ask about your life…"
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
        {!searching && (
          <>
            {(() => {
              const p = PROMPTS[promptTone] || PROMPTS[autoTone()]
              /* before this window's ritual: the time-aware invitation (unchanged) */
              if (!reflected) {
                return (
                  <button className="rf-prompt" data-tone={p.tone} onClick={onInvite || onNew}>
                    <span className="rf-prompt-glyph" aria-hidden="true"><p.Icon size={176} weight="fill" /></span>
                    <span className="rf-prompt-title">{p.title}</span>
                    <span className="rf-prompt-sub">{p.sub}</span>
                    <span className="rf-prompt-cta">Begin reflection <ArrowRight size={14} weight="bold" /></span>
                  </button>
                )
              }
              /* after it: instead of collapsing to a strip, a steady "come back whenever" invite —
                 same time-of-day glyph and tone, only the copy changes, so home never feels empty */
              return (
                <button className="rf-prompt" data-tone={p.tone} onClick={onInvite || onNew}>
                  <span className="rf-prompt-glyph" aria-hidden="true"><p.Icon size={176} weight="fill" /></span>
                  <span className="rf-prompt-title">Always right here.</span>
                  <span className="rf-prompt-sub">Big, small, clear, messy. Whenever you’re ready.</span>
                  <span className="rf-prompt-cta">Begin reflection <ArrowRight size={14} weight="bold" /></span>
                </button>
              )
            })()}
            {mostRecent && (
              <>
                <span className="rf-label">Ongoing</span>
                {renderCard(mostRecent, true)}
              </>
            )}
            <span className="rf-label">All reflections</span>
            {allTags.length > 0 && (
              <div className="rf-filterbar">
                {/* pinned first, so the tags beside it can run as long as they like */}
                <button
                  className="rf-filter rf-filter-btn"
                  data-on={filterOpen || undefined}
                  onClick={() => setFilterOpen(true)}
                  aria-label="Filter by tag"
                >
                  <Faders size={16} weight="bold" />
                </button>
                <div className="rf-filters">
                  <button className="rf-filter" data-on={tag === null || undefined} onClick={() => setTag(null)}>All</button>
                  {allTags.map((t) => (
                    <button
                      key={t}
                      className="rf-filter"
                      data-on={tag === t || undefined}
                      onClick={() => setTag(tag === t ? null : t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {rest.length === 0 && (
              <div className="rf-first rf-first-inline">
                <BuddingLeaf size={104} />
                <p className="rf-first-line">Your story’s taking root.</p>
                <p className="rf-first-sub">Everything you reflect on, kept in one place.</p>
              </div>
            )}
          </>
        )}
        <div className="rf-cards">
          {(searching ? shown : rest).map((r) => renderCard(r, false))}
          {searching && shown.length === 0 && <p className="rf-none">Nothing yet. Some questions take a few more weeks of living.</p>}
        </div>
        <div className="rf-foot-sp" />
      </div>

      <button className="rf-fab" onClick={onNew} aria-label="New reflection"><Plus size={24} weight="bold" /></button>

      {pattern && (
        <PatternLesson
          name={pattern}
          seen={lib.filter((r) => r.pattern === pattern)}
          onBack={() => setPattern(null)}
          onOpen={(id) => { setPattern(null); onOpen(id) }}
        />
      )}

      {filterOpen && (
        <div className="rf-fsheet-wrap">
          <div className="rf-fsheet-scrim" onClick={() => setFilterOpen(false)} />
          <div className="rf-fsheet" role="dialog" aria-label="Filter by tag">
            <div className="rf-fsheet-top">
              <span className="rf-fsheet-title">Filter</span>
              <button className="rf-fsheet-x" onClick={() => setFilterOpen(false)} aria-label="Close"><X size={16} weight="bold" /></button>
            </div>
            <div className="rf-fsheet-tags">
              <button
                className="rf-filter"
                data-on={tag === null || undefined}
                onClick={() => { setTag(null); setFilterOpen(false) }}
              >
                All
              </button>
              {allTags.map((t) => (
                <button
                  key={t}
                  className="rf-filter"
                  data-on={tag === t || undefined}
                  onClick={() => { setTag(tag === t ? null : t); setFilterOpen(false) }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── the reflection room — new or returning ── */
export function Room({ mode, onBack, onNew, name = NAME }) {
  const existing = mode.reflection || (mode.kind === 'old' ? LIBRARY.find((r) => r.id === mode.id) : null)
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
  const [activeChips, setActiveChips] = useState([]) // quick-replies under the latest Kael message
  const bodyRef = useRef(null)
  const timer = useRef(null)
  const chipIdx = useRef(0)
  const nextGenericChips = () => {
    const set = REPLY_SETS[chipIdx.current % REPLY_SETS.length]
    chipIdx.current += 1
    return set
  }

  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [msgs, typing])

  const kaelSays = (text, chips, after) => {
    setTyping(true)
    setActiveChips([])
    timer.current = setTimeout(() => {
      setMsgs((m) => [...m, { who: 'kael', text, time: nowStr() }])
      setTyping(false)
      setActiveChips(chips && chips.length ? chips : nextGenericChips())
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
      kaelSays(NEW_SCRIPT[0].kael, NEW_SCRIPT[0].chips, () => setTurn(1))
    } else {
      setMeta({ title: item.title, line: item.line, Icon: item.Icon, accent: item.accent })
      kaelSays(item.open, item.chips)
    }
  }

  /* "Ask me something" — like tapping a door, but Kael leads with a question */
  const askMe = () => {
    const q = ASK_QUESTIONS[Math.floor(Math.random() * ASK_QUESTIONS.length)]
    const lead = ASK_LEADS[Math.floor(Math.random() * ASK_LEADS.length)]
    setMsgs((m) => [...m, { who: 'user', text: 'Ask me a personal question I wouldn’t think to ask myself, drawing on what you know about me. Make it specific and open-ended, not generic.', time: nowStr() }])
    setStarted(true)
    setMeta({ title: 'A question to sit with', line: 'Following where Kael’s question leads.', Icon: Sparkle, accent: 'var(--warm-proof)' })
    kaelSays(`${lead}\n\n${q}`)
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
    kaelSays(NEW_SCRIPT[t].kael, NEW_SCRIPT[t].chips, () => {
      setTurn(t + 1)
      if (t === 2) setMeta(NEW_STAGES[2])
    })
  }

  return (
    <div className="rf-screen rf-room">
      {!started && !existing ? (
        <button className="rf-back rf-back-float" onClick={() => onBack({ started, meta, msgs })} aria-label="Back"><ArrowLeft size={19} /></button>
      ) : (
        <header className="rf-room-head">
          <button className="rf-back" onClick={() => onBack({ started, meta, msgs })} aria-label="Back"><ArrowLeft size={19} /></button>
          <div className="rf-room-id" key={meta.title}>
            <h2>{meta.title}</h2>
            <span>{meta.line}</span>
          </div>
          <button className="rf-room-new" onClick={onNew} aria-label="New reflection">
            <Plus size={17} weight="bold" />
          </button>
        </header>
      )}

      <div className="rf-body" ref={bodyRef}>
        {!started && !existing && (
          <div className="rf-start">
            <span className="rf-start-sun">{new Date().getHours() >= 17 || new Date().getHours() < 5 ? <Moon size={26} weight="duotone" /> : <Sun size={26} weight="duotone" />}</span>
            <h3 className="rf-greet">{hourGreeting()}, {name}.</h3>
            <p className="rf-greet-sub">What’s alive right now?</p>
            <p className="rf-greet-note">There’s no right way to start.</p>
            <div className="rf-tiles">
              {MOODS.map((m) => (
                <button key={m.id} className="rf-tile" style={{ '--accent': m.accent }} onClick={() => start(m)}>
                  <span className="rf-tile-ic"><m.Icon size={23} weight="duotone" /></span>
                  <span className="rf-tile-tx">{m.label}</span>
                </button>
              ))}
            </div>
            <button className="rf-askme" onClick={askMe}>
              <span className="rf-askme-title"><Sparkle size={17} weight="fill" /> Not sure where to start? <ArrowRight size={14} weight="bold" /></span>
              <span className="rf-askme-sub">I’ll ask you a question to get us going.</span>
            </button>
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
        {activeChips.length > 0 && !typing && (
          <div className="rf-chips">
            {activeChips.map((c) => <button key={c} className="rf-chip" onClick={() => say(c)}>{c}</button>)}
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

/* ──────────────────────────────────────────────────────────────────────────
   First-run flow — the post-paywall first experience, as one cohesive path:
   paywall → a celebratory greeting from Kael → the first reflection (Kael
   speaks first, personalized) → back to a Home that has 0 or 1 reflection.
   PROFILES stands in for the V7 onboarding output.
   ────────────────────────────────────────────────────────────────────────── */
const PROFILES = {
  overloaded: {
    name: 'Maya', pattern: 'The Overloaded', Icon: Spiral, accent: 'var(--mood-overthinking)',
    mirror: 'I’ve got a picture of you now, Maya. A mind that doesn’t clock off, running a little emptier than it should. You told me work’s been relentless and you can’t switch off.',
    question: 'We don’t have to untangle all of it tonight. Let me start somewhere small: when did your head last actually feel quiet?',
    chips: ['This morning', 'Can’t remember', 'Only around people', 'Not in a while'],
    turns: [
      'That tells me something. When it’s quiet only in certain moments, the noise usually isn’t about the work — it’s about what rushes in when you finally stop. What’s the first thought that shows up?',
      'Mm. You don’t have to answer that neatly. Naming it out loud is the whole job tonight — I’ll hold onto this, the pattern living underneath the busyness.',
    ],
    hook: 'This is a good place to stop, Maya. I’ll be here tomorrow morning — want me to check in, and we pick this back up?',
    saved: { title: 'Why my head won’t switch off', line: 'The day ends, but the mind keeps going.' },
    reopen: 'You left this one mid-thought last night. Has the noise settled, or is it still running?',
  },
  critic: {
    name: 'Sam', pattern: 'The Self-Critic', Icon: Scales, accent: 'var(--mood-ashamed)',
    mirror: 'Here’s what I see, Sam. A voice in your head that’s far harder on you than you’d ever be on a friend. You said you keep replaying everything you get wrong.',
    question: 'Let’s slow that tape down together. What’s the line it keeps repeating back to you?',
    chips: ['That I’m too much', 'That I let people down', 'That I’m behind', 'I don’t know'],
    turns: [
      'And if a friend said that exact thing about themselves — would you believe it about them? Sit in that gap for a second. That gap is where we do our work.',
      'You don’t have to win the argument with that voice tonight. You just caught it not telling the whole truth. That’s the first crack of light.',
    ],
    hook: 'Let’s leave it there for now, Sam. I’ll check in this evening — we can catch that voice in the act next time.',
    saved: { title: 'The voice that’s hardest on me', line: 'Kinder to everyone but myself.' },
    reopen: 'Last time we caught that inner voice mid-sentence. Has it been loud today, or quieter?',
  },
  numb: {
    name: 'Alex', pattern: 'The Numb-out', Icon: Moon, accent: 'var(--mood-numb)',
    mirror: 'I think I understand you a little already, Alex. When things get heavy, you reach for something to take the edge off rather than sit in it — and lately it’s all felt kind of flat.',
    question: 'Flat is its own kind of signal. When’s the last time you felt something sharply — good or bad?',
    chips: ['A while ago', 'When I’m alone', 'Can’t think of one', 'This week, actually'],
    turns: [
      'Okay. Flatness usually isn’t the absence of feeling — it’s feeling turned way down so it can’t reach you. What do you think you’d feel if you nudged the dial back up, even a little?',
      'That’s brave to even guess at. We don’t rush it. Noticing the numbness instead of feeding it is already a different move than the old one.',
    ],
    hook: 'Let’s pause here, Alex. Want me to check in tomorrow? Small and steady is how this one loosens.',
    saved: { title: 'Why everything feels flat', line: 'Turned the volume down to get through.' },
    reopen: 'We started turning the dial back up last time. Anything reach you since — even faintly?',
  },
}

/* a young sage sprout — the visual seed of the collection */
function BuddingLeaf({ size = 96 }) {
  return (
    <span className="rf-leaf" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path className="rf-leaf-stem" d="M32 57 C32 47 32 41 32 33" />
        <path className="rf-leaf-blade" d="M32 42 C20 43 11 35 11.5 21 C25 20.5 33 29 32 42 Z" />
        <path className="rf-leaf-blade" d="M32 35 C43 35.5 52 28 52.5 15 C40 14.5 31 22 32 35 Z" />
        <path className="rf-leaf-vein" d="M30.5 41 C24 38 18.5 32.5 14 23.5" />
        <path className="rf-leaf-vein" d="M33.5 34 C40 31 45.5 25.5 50 17" />
      </svg>
    </span>
  )
}

/* one-shot celebratory confetti, warm + sage */
function Confetti({ count = 48 }) {
  const pieces = useMemo(() => {
    const colors = ['#c2a06a', '#c2734f', '#8a9d76', '#e6d4ad', '#a87d4e', '#6f8a5c']
    return Array.from({ length: count }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      dur: 2.4 + Math.random() * 1.9,
      dx: (Math.random() - 0.5) * 130,
      rot: 300 + Math.random() * 760,
      color: colors[i % colors.length],
      w: 6 + Math.random() * 5,
      h: 9 + Math.random() * 7,
      round: Math.random() > 0.72,
    }))
  }, [count])
  return (
    <div className="rf-confetti" aria-hidden="true">
      {pieces.map((p, i) => (
        <span key={i} className="rf-confetti-pc" style={{
          left: `${p.left}%`, width: p.w, height: p.h, background: p.color,
          borderRadius: p.round ? '50%' : '2px',
          animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`,
          '--dx': `${p.dx}px`, '--rot': `${p.rot}deg`,
        }} />
      ))}
    </div>
  )
}

/* the paywall (stub) — stands in for the V7 paywall */
function Paywall({ profile, onStart }) {
  const Glyph = profile.Icon
  return (
    <div className="fr-paywall" style={{ '--accent': profile.accent }}>
      <span className="fr-pw-badge"><Glyph size={30} weight="duotone" /></span>
      <h2 className="fr-pw-title">Kael, in your corner.</h2>
      <p className="fr-pw-sub">Unlimited check-ins with the coach who already knows your whole story.</p>
      <ul className="fr-pw-feats">
        <li><InfinityIcon size={20} weight="bold" /> Unlimited conversations</li>
        <li><Brain size={20} weight="bold" /> Remembers everything you share</li>
        <li><ChatCircleDots size={20} weight="bold" /> A daily note that knows you</li>
        <li><Wind size={20} weight="bold" /> A calmer, steadier baseline</li>
      </ul>
      <div className="fr-pw-plan"><span>Annual · $99.99/yr</span><span className="fr-pw-save">Save 44%</span></div>
      <p className="fr-pw-plan2">7 days free, then billed yearly</p>
      <button className="fr-pw-cta" onClick={onStart}>Start 7-day free trial</button>
      <p className="fr-pw-fine">Cancel anytime · Restore</p>
    </div>
  )
}

/* the greeting — a celebratory arrival. Kael streams one message (paragraphs
   and all), like the V7 first screen: a single typewriter bubble, not a
   drip of tiny human-style texts. */
/* the welcome, as formatted segments so bold/italic survive the streamed reveal */
const GREET_PARTS = [
  { t: 'I’m Kael.' },
  { t: '\n\n' },
  { t: 'Thank you for sharing a little of yourself with me.' },
  { t: '\n\n' },
  { t: 'I’ll remember what matters, ' },
  { t: 'connect the dots over time', b: true },
  { t: ', and help you understand yourself, ' },
  { t: 'one reflection at a time', i: true },
  { t: '.' },
  { t: '\n\n' },
  { t: 'Let’s begin your first reflection.', b: true },
]
const GREET_TOTAL = GREET_PARTS.reduce((s, p) => s + p.t.length, 0)
function Greeting({ name, onStart }) {
  const n = useReveal(GREET_TOTAL, 14, 600)
  const done = n >= GREET_TOTAL
  let off = 0
  return (
    <div className="rf-greet-screen">
      <Confetti />
      <div className="io-screen rf-greet-io">
        <div className="io-orb">
          <span className="io-orb-ring" />
          <span className="io-orb-ring io-orb-ring-2" />
          <span className="io-orb-core"><Sparkle size={26} weight="fill" /></span>
        </div>
        <h1 className="io-title">Welcome, {name}.</h1>
        <div className="io-bubble rf-greet-bubble">
          <span className="io-bubble-av"><Sparkle size={12} weight="fill" /></span>
          <p className="io-bubble-text">
            {GREET_PARTS.map((p, idx) => {
              const start = off; off += p.t.length
              const vis = Math.max(0, Math.min(n - start, p.t.length))
              if (vis <= 0) return null
              const text = p.t.slice(0, vis)
              if (p.b) return <b key={idx}>{text}</b>
              if (p.i) return <em key={idx}>{text}</em>
              return <Fragment key={idx}>{text}</Fragment>
            })}
            {!done && <span className="io-caret" />}
          </p>
        </div>
      </div>
      <div className="rf-greet-foot" data-show={done || undefined}>
        <button className="rf-greet-cta" onClick={onStart}>Start my first reflection <ArrowRight size={16} weight="bold" /></button>
      </div>
    </div>
  )
}

export default function ReflectConcept() {
  const [pid, setPid] = useState('overloaded')
  const [stage, setStage] = useState('paywall') // paywall | greeting | reflection | home
  const [reflection, setReflection] = useState(null) // the one reflection they've started, if any
  const [roomMode, setRoomMode] = useState({ kind: 'new' })
  const [roomKey, setRoomKey] = useState(0)
  const profile = PROFILES[pid]
  const lib = reflection ? [reflection] : []

  const startNew = () => { setRoomMode({ kind: 'new' }); setRoomKey((k) => k + 1); setStage('reflection') }
  const openExisting = () => { setRoomMode({ kind: 'old', reflection }); setRoomKey((k) => k + 1); setStage('reflection') }
  const restart = (id = pid) => { setPid(id); setReflection(null); setStage('paywall') }

  /* leaving the room: if they actually started (picked a mood/door), that
     becomes their one reflection — captured from the room's living metadata */
  const onRoomExit = (exit) => {
    if (exit && exit.started && exit.meta && exit.meta.Icon) {
      setReflection({
        id: 'first', when: 'just now',
        title: exit.meta.title, line: exit.meta.line,
        mood: exit.meta.accent, Icon: exit.meta.Icon,
        history: (exit.msgs || []).map((m) => ({ ...m, time: m.time || '' })),
        reopen: 'You were just here a moment ago. Want to keep going, or has it shifted?',
      })
    }
    setStage('home')
  }

  return (
    <div className="lib-page ov-page rf-page">
      <div className="rf-demo">
        {[['overloaded', 'Maya'], ['critic', 'Sam'], ['numb', 'Alex']].map(([id, label]) => (
          <button key={id} className="rf-demo-chip" data-on={pid === id || undefined} onClick={() => restart(id)}>{label}</button>
        ))}
        <span className="rf-demo-sep" />
        <button className="rf-demo-chip" onClick={() => { setReflection(null); setStage('home') }}>Empty home</button>
        <button className="rf-demo-chip" onClick={() => restart()}>Restart</button>
      </div>
      <div className="ov-stage">
        <div className="ov-screen rf-phone">
          {stage === 'paywall' && <Paywall profile={profile} onStart={() => setStage('greeting')} />}
          {stage === 'greeting' && <Greeting name={profile.name} onStart={startNew} />}
          {stage === 'reflection' && (
            <Room key={roomKey} mode={roomMode} name={profile.name} onBack={onRoomExit} onNew={startNew} />
          )}
          {stage === 'home' && (
            <Home
              lib={lib}
              name={profile.name}
              onNew={startNew}
              onInvite={startNew}
              onReopen={openExisting}
              onOpen={openExisting}
            />
          )}
        </div>
      </div>
    </div>
  )
}
