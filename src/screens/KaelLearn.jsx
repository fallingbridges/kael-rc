import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Brain, Heart, ChatCircleDots, Sparkle, Waves, Scales, Eye, Repeat, Mountains,
  Briefcase, Compass, Coins, Flag, Hourglass, Atom, MagnifyingGlass, X,
  ArrowLeft, ArrowRight, CaretRight, PaperPlaneTilt, House, Compass as ExploreIcon,
  BookmarkSimple, UserCircle,
} from '@phosphor-icons/react'
import {
  TOPICS, TITLES, CHIPS, FOLLOW_CHIPS, byTopic, titleById, lessonFor,
} from '../learnContent.js'

/* ──────────────────────────────────────────────────────────────────────────
   Kael — an AI teacher for life.

   Titles exist beforehand. Lessons do not: tapping a title generates one,
   and the lesson arrives as the first thing Kael says rather than on a page
   of its own. Everything after it happens in the same conversation.

   Four tabs. Home is for discovering what to learn next, Explore is the
   whole shelf, Journey is what you have already been taught, You is
   everything personal.

   No streaks, no progress bars, no completion. A lesson is never finished,
   which is why there is nothing to complete.
   ────────────────────────────────────────────────────────────────────────── */

const NAME = 'Sumit'

const ICONS = {
  brain: Brain, heart: Heart, chat: ChatCircleDots, spark: Sparkle, waves: Waves,
  scales: Scales, eye: Eye, repeat: Repeat, mountain: Mountains, briefcase: Briefcase,
  compass: Compass, coin: Coins, flag: Flag, hourglass: Hourglass, atom: Atom,
  sparkle: Sparkle,
}
const topicOf = (id) => TOPICS.find((t) => t.id === id) || TOPICS[0]
const IconFor = ({ topic, size = 22 }) => {
  const T = ICONS[topicOf(topic).icon] || Brain
  return <T size={size} weight="duotone" />
}

/* the diagonal light every coloured surface carries */
const Sheen = ({ a = 126 }) => <span className="kl-sheen" style={{ '--a': `${a}deg` }} aria-hidden="true" />

/* the cover. A generated illustration in production; here the topic's own
   colour and mark, which at least never repeats and never fights the type. */
const Cover = ({ topic, i = 0, big }) => (
  <span className={`kl-cover${big ? ' kl-cover-big' : ''}`} style={{ '--mood': topicOf(topic).mood }}>
    <Sheen a={118 + (i % 4) * 22} />
    <IconFor topic={topic} size={big ? 34 : 26} />
  </span>
)

/* ── discovery ──────────────────────────────────────────────────────────── */

function Rail({ label, note, items, onOpen }) {
  if (!items.length) return null
  return (
    <section className="kl-rail kl-rise">
      <div className="kl-rail-head">
        <h2>{label}</h2>
        {note && <span>{note}</span>}
      </div>
      <div className="kl-rail-row">
        {items.map((t, i) => (
          <button key={t.id} className="kl-card" onClick={() => onOpen(t.id)}>
            <Cover topic={t.topic} i={i} />
            <span className="kl-card-in">
              <span className="kl-card-topic">{topicOf(t.topic).name}</span>
              <span className="kl-card-title">{t.title}</span>
            </span>
          </button>
        ))}
        <span className="kl-rail-end" aria-hidden="true" />
      </div>
    </section>
  )
}

function Home({ learned, onOpen, onSearch }) {
  const [q, setQ] = useState('')
  const hits = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return []
    return TITLES.filter((t) => `${t.title} ${t.sub}`.toLowerCase().includes(s)).slice(0, 8)
  }, [q])

  const last = learned[0] ? titleById(learned[0]) : null
  /* "because you explored" is the same topic as the last thing they took,
     minus the thing itself */
  const because = last ? byTopic(last.topic).filter((t) => t.id !== last.id).slice(0, 6) : []
  /* one per topic, so the rail reads as a spread rather than as whatever
     happened to be first in the list. The topic sitting in "because you
     explored" is seeded as already-seen, so the two rails never open with
     the same card. */
  const recommended = useMemo(() => {
    const seen = new Set(last ? [last.topic] : [])
    const out = []
    for (const t of TITLES) {
      if (learned.includes(t.id) || seen.has(t.topic)) continue
      seen.add(t.topic); out.push(t)
      if (out.length === 6) break
    }
    return out
  }, [learned, last])
  const recent = TITLES.slice(-6).reverse()
  const trending = ['overthink', 'people-pleasing', 'hard-talk', 'attachment', 'burnout', 'comparison']
    .map(titleById).filter(Boolean)

  return (
    <div className="kl-screen">
      <header className="kl-top">
        <h1 className="kl-hello">What would you like to learn?</h1>
      </header>

      {/* search finds titles. It never starts a chat on its own: choosing a
          result is what generates the lesson. */}
      <div className="kl-searchwrap">
        <div className="kl-search">
          <MagnifyingGlass size={16} weight="bold" />
          <input value={q} placeholder="Search lessons" onChange={(e) => setQ(e.target.value)} />
          {q && <button onClick={() => setQ('')} aria-label="Clear"><X size={13} weight="bold" /></button>}
        </div>
      </div>

      <div className="kl-scroll">
        {q ? (
          <div className="kl-results kl-rise">
            {hits.map((t) => (
              <button key={t.id} className="kl-row" onClick={() => onOpen(t.id)}>
                <Cover topic={t.topic} />
                <span className="kl-row-in">
                  <span className="kl-row-topic">{topicOf(t.topic).name}</span>
                  <span className="kl-row-title">{t.title}</span>
                </span>
                <CaretRight size={15} weight="bold" />
              </button>
            ))}
            {!hits.length && <p className="kl-none">Nothing by that name yet.</p>}
          </div>
        ) : (
          <>
            <Rail label="Recommended for you" items={recommended} onOpen={onOpen} />
            {last && <Rail label="Because you explored" note={last.title} items={because} onOpen={onOpen} />}
            <Rail label="Trending" items={trending} onOpen={onOpen} />
            <Rail label="Recently added" items={recent} onOpen={onOpen} />
          </>
        )}
        <div className="kl-tail" />
      </div>
    </div>
  )
}

/* ── explore ────────────────────────────────────────────────────────────── */

function Explore({ onOpen }) {
  const [topic, setTopic] = useState(null)
  if (topic) {
    const t = topicOf(topic)
    return (
      <div className="kl-screen">
        <header className="kl-top kl-top-row">
          <button className="kl-back" onClick={() => setTopic(null)} aria-label="Back"><ArrowLeft size={18} weight="bold" /></button>
          <h1 className="kl-page-title">{t.name}</h1>
        </header>
        <div className="kl-scroll">
          {byTopic(topic).map((x, i) => (
            <button key={x.id} className="kl-lesson-row kl-rise" style={{ '--d': `${i * 36}ms` }} onClick={() => onOpen(x.id)}>
              <Cover topic={x.topic} i={i} />
              <span className="kl-row-in">
                <span className="kl-row-title">{x.title}</span>
                <span className="kl-row-sub">{x.sub}</span>
              </span>
            </button>
          ))}
          <div className="kl-tail" />
        </div>
      </div>
    )
  }
  return (
    <div className="kl-screen">
      <header className="kl-top">
        <h1 className="kl-page-title">Explore</h1>
        <p className="kl-page-sub">Everything Kael can teach you</p>
      </header>
      <div className="kl-scroll">
        <div className="kl-topics">
          {TOPICS.map((t, i) => (
            <button key={t.id} className="kl-topic kl-rise" style={{ '--mood': t.mood, '--d': `${Math.min(i, 8) * 32}ms` }}
              onClick={() => setTopic(t.id)}>
              <Sheen a={120 + (i % 4) * 20} />
              <span className="kl-topic-in">
                <IconFor topic={t.id} size={22} />
                <b>{t.name}</b>
                <i>{byTopic(t.id).length} lessons</i>
              </span>
            </button>
          ))}
        </div>
        <div className="kl-tail" />
      </div>
    </div>
  )
}

/* ── journey ────────────────────────────────────────────────────────────────
   A learning library rather than a chat log. Grouped by topic, because that
   is how somebody looks for a thing they half remember. */

/* learned is newest first, so a lesson's position in it is how long ago it
   was taken. Cheap, and it keeps the library from reading as one bulk import. */
const whenTaken = (n) => {
  if (n === 0) return 'Today'
  if (n === 1) return 'Yesterday'
  const d = new Date()
  d.setDate(d.getDate() - n * 3)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function Journey({ learned, onOpen }) {
  const groups = TOPICS.map((t) => ({
    topic: t,
    items: learned.map(titleById).filter((x) => x && x.topic === t.id),
  })).filter((g) => g.items.length)

  return (
    <div className="kl-screen">
      <header className="kl-top">
        <h1 className="kl-page-title">Journey</h1>
        <p className="kl-page-sub">Everything you’ve explored</p>
      </header>
      <div className="kl-scroll">
        {groups.map((g, gi) => (
          <section key={g.topic.id} className="kl-group kl-rise" style={{ '--d': `${gi * 40}ms` }}>
            <span className="kl-group-lbl" style={{ '--mood': g.topic.mood }}>
              <i />{g.topic.name}
            </span>
            <div className="kl-group-rows">
              {g.items.map((x) => (
                <button key={x.id} className="kl-jrow" onClick={() => onOpen(x.id)}>
                  <span>{x.title}</span>
                  <i>{whenTaken(learned.indexOf(x.id))}</i>
                </button>
              ))}
            </div>
          </section>
        ))}
        {!groups.length && <p className="kl-none">Nothing here yet. Open a lesson and it will be kept.</p>}
        <div className="kl-tail" />
      </div>
    </div>
  )
}

/* ── you ────────────────────────────────────────────────────────────────── */

function You({ learned, saved }) {
  const interests = [...new Set(learned.map((id) => titleById(id)).filter(Boolean).map((t) => topicOf(t.topic).name))]
  return (
    <div className="kl-screen">
      <header className="kl-top">
        <h1 className="kl-page-title">You</h1>
        <p className="kl-page-sub">{NAME} · since March</p>
      </header>
      <div className="kl-scroll">
        <section className="kl-group kl-rise">
          <span className="kl-group-lbl"><i />What you keep returning to</span>
          <div className="kl-chips">
            {interests.length
              ? interests.map((n) => <span key={n} className="kl-chip-static">{n}</span>)
              : <p className="kl-none">This fills in as you learn.</p>}
          </div>
        </section>

        <section className="kl-group kl-rise" style={{ '--d': '60ms' }}>
          <span className="kl-group-lbl"><i />What Kael has noticed</span>
          <div className="kl-insights">
            <p>You come back to thinking and decision making more than anything else, and almost always in the evening.</p>
            <p>Three of the last five lessons you opened were about other people’s reactions rather than your own behaviour.</p>
          </div>
        </section>

        {saved.length > 0 && (
          <section className="kl-group kl-rise" style={{ '--d': '100ms' }}>
            <span className="kl-group-lbl"><i />Saved highlights</span>
            <div className="kl-saved">
              {saved.map((s, i) => <blockquote key={i}>{s}</blockquote>)}
            </div>
          </section>
        )}

        <section className="kl-group kl-rise" style={{ '--d': '140ms' }}>
          <span className="kl-group-lbl"><i />Settings</span>
          <div className="kl-group-rows">
            {['Learning interests', 'Memory', 'Subscription', 'Privacy', 'Help'].map((x) => (
              <button key={x} className="kl-jrow"><span>{x}</span><CaretRight size={15} weight="bold" /></button>
            ))}
          </div>
        </section>
        <div className="kl-tail" />
      </div>
    </div>
  )
}

/* ── the lesson, inside the conversation ────────────────────────────────────
   No lesson page. The lesson is simply the first thing Kael says, and
   everything after expands it. */

const WORD_MS = 14
const textOf = (b) => b.h || b.p || b.callout || b.quote || b.eg || b.sci

const flatten = (blocks) => {
  let at = 0
  return blocks.map((b) => {
    const kind = b.h ? 'h' : b.callout ? 'callout' : b.quote ? 'quote' : b.eg ? 'eg' : b.sci ? 'sci' : 'p'
    const words = textOf(b).split(' ')
    const start = at
    at += words.length
    return { kind, words, start, label: b.sciLabel, by: b.by }
  })
}
const countWords = (blocks) => blocks.reduce((n, b) => n + textOf(b).split(' ').length, 0)

function Body({ blocks, shown, onSave }) {
  const flat = useMemo(() => flatten(blocks), [blocks])
  const total = flat.reduce((n, b) => n + b.words.length, 0)
  const n = shown === undefined ? total : shown
  const done = n >= total
  return (
    <div className="kl-body">
      {flat.map((b, k) => {
        const w = Math.max(0, Math.min(n - b.start, b.words.length))
        if (w <= 0) return null
        const text = b.words.slice(0, w).join(' ')
        const live = !done && w < b.words.length
        if (b.kind === 'h') return <h2 key={k} className="kl-h">{text}</h2>
        if (b.kind === 'callout') return <p key={k} className="kl-callout">{text}{live && <i className="kl-caret" />}</p>
        if (b.kind === 'quote') return (
          <blockquote key={k} className="kl-quote" onClick={() => done && onSave && onSave(text)}>
            {text}{live && <i className="kl-caret" />}
          </blockquote>
        )
        if (b.kind === 'eg') return (
          <div key={k} className="kl-eg">
            <span>For instance</span>
            {text.split('\n\n').map((t, j) => <p key={j}>{t}{live && j === text.split('\n\n').length - 1 && <i className="kl-caret" />}</p>)}
          </div>
        )
        if (b.kind === 'sci') return (
          <div key={k} className="kl-sci">
            <span>{b.label}</span>
            <p>{text}{live && <i className="kl-caret" />}</p>
          </div>
        )
        return <p key={k} className="kl-p">{text}{live && <i className="kl-caret" />}</p>
      })}
    </div>
  )
}

/* what Kael says when a chip is tapped. In production these are generated;
   here the ones that can be answered from the lesson itself are, which is
   enough to show the mechanic honestly. */
const replyTo = (chip, lesson) => {
  const find = (kind) => (lesson ? lesson.blocks.find((b) => b[kind]) : null)
  if (chip === 'Show me the science') {
    const b = find('sci')
    return b ? [{ sciLabel: b.sciLabel, sci: b.sci }] : [{ p: 'The evidence here is thinner than I would like, and I would rather say so than dress it up.' }]
  }
  if (chip === 'Give another example' || chip === 'Give me an example') {
    const b = find('eg')
    return b ? [{ eg: b.eg }] : [{ p: 'Think of the last time this happened to you. Start there and I will work with it.' }]
  }
  if (chip === 'Summarise') {
    const b = lesson && [...lesson.blocks].reverse().find((x) => x.p)
    return b ? [{ p: b.p }] : [{ p: 'The short version: name the mechanism, then change one small thing.' }]
  }
  if (chip === 'Quiz me') return null
  if (chip === 'Explain differently') return [{ p: 'Another way in. Forget the terminology for a second and think of it as a loop with no exit condition. The exit condition is the thing you are missing, and it is almost never more information.' }]
  if (chip === 'Challenge my thinking') return [{ p: 'Then let me push. You have described this as something happening to you. What would change if you assumed, for one minute, that some part of it is being chosen?' }]
  if (chip === 'Go deeper') return [{ p: 'Underneath this there is usually an older rule. Not about this situation, about what you are allowed to want. That is the layer worth digging at, and it takes longer than one conversation.' }]
  if (chip === 'Common misconceptions') return [{ p: 'The big one is that this is a discipline problem. It almost never is. Treating it as discipline is what keeps people stuck for years, because they keep applying more of the thing that was never the variable.' }]
  if (chip === 'Related concept') return [{ p: 'The nearest neighbour to this is intolerance of uncertainty. Different name, same engine: a mind trying to close a file that cannot be closed with the information available.' }]
  if (chip === 'Book recommendations') return [{ p: 'Two worth your time, and only two. Burkeman’s Four Thousand Weeks for the philosophy, and anything by Nedra Tawwab for the practical version. Skip the rest of the shelf.' }]
  if (chip === 'How do I practise this?') return [{ p: 'Pick one situation this week where you would normally do the old thing. Not all of them, one. Notice what happens, and bring it back here. That is the whole practice.' }]
  if (chip === 'Apply this to my life') return [{ p: 'Then tell me the situation. Where it happened, who was there, and what you did. I will work from that rather than from the general case.' }]
  if (chip === 'Roleplay') return [{ p: 'Alright. I will be them, you say the first line. Keep it shorter than feels comfortable.' }]
  return [{ p: 'Say more and I will take it from there.' }]
}

const QUIZ = {
  q: 'Someone’s reaction to you is unclear, and you have thought about it eleven times. What would actually end the loop?',
  options: [
    { label: 'Working out what they meant', reply: 'That is the loop, not the exit. Their meaning is not available to you, which is exactly why the eleventh round produced nothing the first did not.' },
    { label: 'Deciding without knowing', reply: 'Yes. The loop is searching for certainty. Telling it the search is over is what closes the file.' },
    { label: 'Asking them directly', reply: 'Often the best move in real life, and notice what it does: it converts an unanswerable question into an answerable one. Same principle.' },
  ],
}

function Lesson({ id, onBack, onLearned, onSave }) {
  const meta = titleById(id)
  const lesson = lessonFor(id)
  const [turns, setTurns] = useState([])
  const [live, setLive] = useState(null)
  const [shown, setShown] = useState(0)
  const [chips, setChips] = useState([])
  const [draft, setDraft] = useState('')
  const [generating, setGenerating] = useState(true)
  const nextChips = useRef([])
  const quizOpen = useRef(false)
  const scroller = useRef(null)

  const say = (blocks, after) => { nextChips.current = after || []; setShown(0); setLive(blocks) }

  /* the lesson is generated on open, and the wait is shown rather than
     hidden: a wait you asked for is part of the thing being made for you */
  useEffect(() => {
    const t = setTimeout(() => {
      setGenerating(false)
      const blocks = lesson
        ? lesson.blocks
        : [
            { p: 'You did not open this because the topic is interesting. You opened it because something about it is sitting on you right now, and that is the right reason to be here.' },
            { h: 'Where to start' },
            { p: 'This lesson has not been written yet in this build. In the shipped product it would be generated here, to the same framework as the others: what the problem actually is, the misconception that keeps people stuck, the mechanism underneath, the research, a worked example, and one thing to try.' },
            { callout: 'Three lessons are written out in full: how to stop overthinking, taking criticism personally, and saying no without guilt.' },
          ]
      say(blocks, CHIPS.slice(0, 6))
      onLearned(id)
    }, 1100)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!live) return undefined
    const total = countWords(live)
    const t0 = performance.now()
    const tick = setInterval(() => {
      const w = Math.floor((performance.now() - t0) / WORD_MS)
      if (w >= total) {
        clearInterval(tick)
        setTurns((t) => [...t, { who: 'kael', blocks: live }])
        setLive(null)
        setChips(nextChips.current)
        return
      }
      setShown(w)
    }, 40)
    return () => clearInterval(tick)
  }, [live])

  useEffect(() => {
    const el = scroller.current
    if (el && live) el.scrollTop = el.scrollHeight
  }, [shown, live, chips])

  const send = (text) => {
    if (!text.trim() || live) return
    const t = text.trim()

    if (quizOpen.current) {
      const answer = QUIZ.options.find((o) => o.label === t)
      if (answer) {
        quizOpen.current = false
        setTurns((x) => [...x, { who: 'user', text: t }])
        setDraft(''); setChips([])
        setTimeout(() => say([{ p: answer.reply }], ['Quiz me', 'Apply this to my life', 'Go deeper']), 560)
        return
      }
    }
    if (t === 'Quiz me') {
      quizOpen.current = true
      setTurns((x) => [...x, { who: 'user', text: t }])
      setDraft(''); setChips([])
      setTimeout(() => say([{ p: QUIZ.q }], QUIZ.options.map((o) => o.label)), 560)
      return
    }

    setTurns((x) => [...x, { who: 'user', text: t }])
    setDraft(''); setChips([])
    const canned = CHIPS.includes(t) ? replyTo(t, lesson) : null
    const blocks = canned || [{ p: 'Good, that is the useful kind of detail. What did you do in the moment, rather than what you thought afterwards?' }]
    const after = canned ? CHIPS.filter((c) => c !== t).slice(0, 5) : FOLLOW_CHIPS
    setTimeout(() => say(blocks, after), 620)
  }

  return (
    <div className="kl-screen kl-lesson" style={{ '--mood': topicOf(meta.topic).mood }}>
      <header className="kl-lesson-top">
        <button className="kl-back" onClick={onBack} aria-label="Back"><ArrowLeft size={18} weight="bold" /></button>
        <span>{topicOf(meta.topic).name}</span>
      </header>

      <div className="kl-lesson-scroll" ref={scroller}>
        <div className="kl-hero">
          <Cover topic={meta.topic} big />
          <h1>{meta.title}</h1>
          <p>{meta.sub}</p>
        </div>

        {generating ? (
          <div className="kl-gen"><i /><i /><i /><span>Generating lesson</span></div>
        ) : (
          <>
            {turns.map((t, k) => (
              t.who === 'user'
                ? <p key={k} className="kl-user">{t.text}</p>
                : <Body key={k} blocks={t.blocks} onSave={onSave} />
            ))}
            {live && <Body blocks={live} shown={shown} onSave={onSave} />}
            {!live && chips.length > 0 && (
              <div className="kl-chips-row">
                {chips.map((c) => (
                  <button key={c} className="kl-chip" onClick={() => send(c)}>{c}</button>
                ))}
              </div>
            )}
          </>
        )}
        <div className="kl-lesson-tail" />
      </div>

      <div className="kl-composer">
        <input value={draft} placeholder="Ask Kael anything about this"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send(draft)} />
        <button data-on={draft.trim().length > 0 || undefined} aria-label="Send" onClick={() => send(draft)}>
          <PaperPlaneTilt size={16} weight="fill" />
        </button>
      </div>
    </div>
  )
}

/* ── the lab ────────────────────────────────────────────────────────────── */
export default function KaelLearn() {
  const [tab, setTab] = useState('home')
  const [open, setOpen] = useState(null)
  const [learned, setLearned] = useState(['overthink', 'criticism', 'saying-no', 'stuck-decision'])
  const [saved, setSaved] = useState(['You are not trying to think less. You are trying to think about something answerable.'])

  const learn = (id) => setLearned((l) => (l.includes(id) ? [id, ...l.filter((x) => x !== id)] : [id, ...l]))
  const save = (t) => setSaved((s) => (s.includes(t) ? s : [t, ...s]))

  return (
    <div className="lib-page ov-page kl-page">
      <div className="ov-stage">
        <div className="ov-screen kl-frame">
          {open ? (
            <Lesson key={open} id={open} onBack={() => setOpen(null)} onLearned={learn} onSave={save} />
          ) : (
            <>
              {tab === 'home' && <Home learned={learned} onOpen={setOpen} />}
              {tab === 'explore' && <Explore onOpen={setOpen} />}
              {tab === 'journey' && <Journey learned={learned} onOpen={setOpen} />}
              {tab === 'you' && <You learned={learned} saved={saved} />}
              <nav className="kl-nav">
                {[
                  ['home', 'Home', House],
                  ['explore', 'Explore', ExploreIcon],
                  ['journey', 'Journey', BookmarkSimple],
                  ['you', 'You', UserCircle],
                ].map(([id, label, Ic]) => (
                  <button key={id} data-on={tab === id || undefined} onClick={() => setTab(id)}>
                    <Ic size={20} weight={tab === id ? 'fill' : 'regular'} />
                    <span>{label}</span>
                  </button>
                ))}
              </nav>
            </>
          )}
        </div>
      </div>
      <div className="ob-devbar">
        <span>{open ? `lesson · ${open}` : `learn · ${tab}`}</span>
        <button onClick={() => { setOpen(null); setTab('home') }}>Restart</button>
        <span style={{ opacity: 0.6 }}>{TITLES.length} titles · {TOPICS.length} topics</span>
      </div>
    </div>
  )
}
