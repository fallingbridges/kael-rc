import { useState } from 'react'
import { motion } from 'framer-motion'
import StatusBar from '../components/StatusBar.jsx'
import { Notepad, CaretLeft, CaretRight, CaretDown } from '@phosphor-icons/react'
import {
  Sparkle, Send, Lighthouse, ArrowUpRight,
  Spiral, Bolt, Distance, TurnAway, Fork, MoodLonely,
} from '../components/Icons.jsx'

/* ──────────────────────────────────────────────────────────────────────────
   Kael — the two-screen concept.
   1. Chat is the whole app (full screen). Top bar: profile · "Kael" + live
      state (present / thinking / responding) · notes icon (red dot = new note).
   2. Notes: archetype read at top, today's note as an open read, then the
      archive of past notes (collapsed, expandable). Each is a 2-3 min read on you.
   Standalone preview; the real app is untouched.
   ────────────────────────────────────────────────────────────────────────── */

const TAP = { whileTap: { scale: 0.97 }, transition: { type: 'spring', stiffness: 460, damping: 26 } }
const PROFILE = { initial: 'M' }
const STATES = ['present', 'thinking', 'responding']
const REPLIES = ['Still raw', 'We talked it out', 'I’d rather not']
const FEELINGS = [
  { label: 'I’m spiraling', Icon: Spiral },
  { label: 'We had a fight', Icon: Bolt },
  { label: 'They’re distant', Icon: Distance },
  { label: 'I feel rejected', Icon: TurnAway },
  { label: 'Mixed signals', Icon: Fork },
  { label: 'I feel lonely', Icon: MoodLonely },
]

// Notes — a title + ~300 words of prose, with paragraph breaks, pointers, and
// word-level emphasis. They can be a practice, an observation, a lesson.
const TODAY = {
  id: 'pause',
  kind: 'A practice',
  date: 'Today',
  read: '3 min',
  title: 'The pause you keep missing',
  body: [
    {
      p: [
        { t: 'You’ve told me about the same moment three times this week. He goes quiet, and within seconds you’ve built a whole story about what it means. By the time you text him, you’re not answering ' },
        { t: 'him', em: 'i' },
        { t: ' anymore. You’re answering the story.' },
      ],
    },
    {
      p: [
        { t: 'There’s a gap between the silence and the story. Right now it’s about two seconds wide, and that gap is the only place you actually have a choice.' },
      ],
    },
    {
      p: [
        { t: 'So this week, one thing: ' },
        { t: 'when he goes quiet, name the feeling before you name the cause.', em: 'b' },
      ],
    },
    {
      list: [
        [{ t: 'Not “he’s pulling away,” but “' }, { t: 'I feel scared right now', em: 'i' }, { t: '.”' }],
        [{ t: 'Not “I did something wrong,” but “' }, { t: 'I feel unsure where I stand', em: 'i' }, { t: '.”' }],
      ],
    },
    {
      p: [
        { t: 'The feeling is true. The story is a guess. When you lead with the feeling, you stay with yourself instead of chasing him, and staying with yourself is the whole thing we’re building.' },
      ],
    },
    {
      p: [{ t: 'You’re already catching it faster than you were a month ago. I’ve watched it happen.', em: 'i' }],
    },
  ],
}

const ARCHIVE = [
  {
    id: 'easy',
    kind: 'Something I’ve noticed',
    date: 'Jun 16',
    read: '2 min',
    title: 'When “easy” became your job',
    body: [
      { p: [{ t: 'You keep apologising for taking up space in your own relationship. I want to name where that comes from, because it isn’t a flaw in you. It’s a strategy you learned.' }] },
      {
        p: [
          { t: 'Somewhere early, you worked out that the people who stayed were the ones you kept things ' },
          { t: 'easy', em: 'i' },
          { t: ' for. So you got good at it. You became low-maintenance, agreeable, the one who never needed much.' },
        ],
      },
      { p: [{ t: 'It worked. It also cost you, because a need you don’t voice doesn’t disappear. It goes underground and comes out as resentment, or as that hollow feeling of being unseen even when you’re right next to someone.' }] },
      {
        p: [
          { t: 'You don’t have to become difficult. You just have to let yourself be ' },
          { t: 'real', em: 'b' },
          { t: '. Those aren’t the same thing.' },
        ],
      },
    ],
  },
  {
    id: 'steady',
    kind: 'For a Lighthouse',
    date: 'Jun 12',
    read: '2 min',
    title: 'Steady isn’t the same as silent',
    body: [
      { p: [{ t: 'You hold light for everyone. You’re the calm one, the reliable one, the one who has it together. That steadiness is real, and it’s a gift.' }] },
      {
        p: [
          { t: 'But I’ve noticed you use it to hide. Staying steady becomes a way of giving people nothing to read, and steady from a distance can ' },
          { t: 'feel', em: 'i' },
          { t: ' like steady toward no one.' },
        ],
      },
      { p: [{ t: 'Once this week, let someone close see the weather underneath. Not a collapse. Just one honest “this is hard for me.” That isn’t the lighthouse going dark. That’s letting a ship actually find you.' }] },
    ],
  },
  {
    id: 'text',
    kind: 'Worth keeping',
    date: 'Jun 8',
    read: '1 min',
    title: 'The text you didn’t send',
    body: [
      { p: [{ t: 'On Tuesday you wanted to send the third follow-up text. You didn’t. You sat with the discomfort instead, and it passed.' }] },
      { p: [{ t: 'I want you to notice that, because it’s easy to skip past. That was the pattern not happening. That was you choosing your own steadiness over the quick hit of relief.' }] },
      { p: [{ t: 'The urge will come back, it always does. But now you have proof it’s survivable. Keep that.' }] },
    ],
  },
]

function Spans({ segs }) {
  return segs.map((s, i) =>
    s.em === 'b' ? <strong key={i}>{s.t}</strong> : s.em === 'i' ? <em key={i}>{s.t}</em> : <span key={i}>{s.t}</span>,
  )
}

function NoteBody({ blocks }) {
  return (
    <div className="kd-note-body">
      {blocks.map((b, i) =>
        b.list ? (
          <ul className="kd-note-list" key={i}>
            {b.list.map((item, j) => (
              <li key={j}>
                <Spans segs={item} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="kd-note-para" key={i}>
            <Spans segs={b.p} />
          </p>
        ),
      )}
    </div>
  )
}

function ArchiveCard({ note, open, onToggle }) {
  return (
    <div className="kd-notecard" data-open={open}>
      <button className="kd-notecard-head" onClick={onToggle}>
        <span className="kd-note-title">{note.title}</span>
        <span className="kd-note-meta">
          <span className="kd-note-kind">{note.kind}</span>
          <span className="kd-note-dot2" aria-hidden="true" />
          <span className="kd-note-date">{note.date}</span>
          <span className="kd-note-dot2" aria-hidden="true" />
          <span className="kd-note-date">{note.read} read</span>
        </span>
        <CaretDown className="kd-note-caret" size={16} weight="bold" />
      </button>
      {open && <NoteBody blocks={note.body} />}
    </div>
  )
}

// ── The Lighthouse — the full archetype read (constant, ~1500 words) ──
const AXES = [
  { name: 'Closeness', left: 'Holds distance', right: 'Pulls close', pos: 24 },
  { name: 'Expression', left: 'Contained', right: 'Open book', pos: 29 },
  { name: 'Regulation', left: 'Steady', right: 'Reactive', pos: 15 },
  { name: 'Care', left: 'Gives', right: 'Receives', pos: 22 },
]
const STRENGTHS = ['Calm in chaos', 'Fiercely loyal', 'A safe harbour', 'Reads the room', 'Holds boundaries', 'Always shows up']
const VALUES = ['Loyalty', 'Steadiness', 'Independence', 'Depth over breadth', 'Reliability', 'Self-reliance']
const TRIGGERS = ['Being needed too much', 'Sudden closeness', 'Feeling engulfed', 'Being called cold', 'Pressure to emote', 'Unpredictability']
const NEEDS = ['To be pursued', 'Permission to need', 'Space that’s chosen', 'To be seen behind the calm']

const CHAPTERS = [
  {
    n: '01',
    title: 'The steady one',
    pull: 'You are the calm in other people’s storms.',
    paras: [
      'Of the sixteen archetypes, the Lighthouse is the one people reach for when the ground is shaking. You are the steady one, the fixed point in a moving world. Friends bring you their worst nights because you do not flinch and you do not flood. You hold.',
      'This steadiness is not a performance. It runs deep. Where others feel a wave and are swept by it, you feel the same wave and stand still inside it. You process before you react, and you would rather understand a feeling than be ruled by it. In a world that prizes big emotion, your composure can read as coolness. It is not. It is a quieter kind of depth.',
      'But a lighthouse has a particular nature. It gives light generously, and it gives it from a fixed distance. It guides ships home without ever leaving the rock. That is your gift and your bind both: you are deeply there for people, and quietly hard to reach. You shine outward. You rarely let anyone climb the stairs.',
    ],
  },
  {
    n: '02',
    title: 'How you love',
    pull: 'You give steadiness, and ask for almost nothing.',
    paras: [
      'In love you are the one who stays calm when your partner spirals, who remembers the small things, who shows up without being asked. You love through reliability. Grand declarations make you a little suspicious; you trust what is consistent over what is loud. If you have committed to someone, they are held by something that does not waver.',
      'But notice what you tend to withhold. You give care easily and receive it awkwardly. When a partner turns toward you and asks how you really are, you deflect, you redirect, you reassure them you are fine. You have made yourself the easy one, the low-maintenance one, the one who never needs much. You have quietly confused not-needing with strength.',
      'And you keep a hand on the door. Even in closeness, part of you stays self-contained, watching, a little apart. You let people in to a point, and then the keeper steps back up the stairs. Your partners often describe the same thing: they feel deeply cared for and slightly locked out, both at once.',
    ],
  },
  {
    n: '03',
    title: 'Where it comes from',
    pull: 'Somewhere, you learned that easy was the price of being kept.',
    paras: [
      'No one is born holding the door. You learned it. Somewhere early, in a home or a love that could not quite hold your needs, you worked out a strategy: be steady, be easy, ask for little, and you get to stay. So you became the capable one, the one who handled themselves and never added to the load.',
      'It worked, and that is the cruel part. Being self-sufficient earned you approval, or peace, or simply the absence of disappointment. You were praised for being mature and strong and low-maintenance. The praise taught you that your needs were a burden best kept quiet, and that love was something you earned by not requiring much of it.',
      'So the steadiness that is now your gift began as armour. The distance that protects you was once the smartest thing a younger you could do. None of this is a flaw in you. It is an old solution to an old problem, still running long after the problem changed. Naming it is not blame. It is the first loosening of its grip.',
    ],
  },
  {
    n: '04',
    title: 'The cost of the light',
    pull: 'Steady from a distance can read as steady toward no one.',
    paras: [
      'Every strength casts a shadow, and yours is specific. Your calm, taken too far, becomes a wall. Partners cannot always tell the difference between you being grounded and you being gone. When you go quiet to process, they feel absence. When you handle things alone, they feel shut out, unsure whether they are trusted or simply not needed.',
      'Because you give so little to read, people fill the silence with their worst guesses. Your steadiness, meant as a gift, can leave someone feeling like they are loving a closed door. And because you do not voice needs, resentment finds room to grow. A need you never name does not vanish. It goes underground and comes back as distance, or as a hollow sense of being unseen beside the very person you love.',
      'The deepest cost is to you. A lighthouse that never lets anyone in can spend its whole life warm to everyone and known by no one. You can be surrounded by people who rely on you and still, at the end of the night, be alone on the rock.',
    ],
  },
  {
    n: '05',
    title: 'What you actually need',
    pull: 'You need to be pursued past the point where you say you’re fine.',
    paras: [
      'Here is what you rarely admit, even to yourself. You want to be pursued. You want someone to not take your “I’m fine” at face value, to climb the stairs anyway, to stay when you go quiet instead of handing you the space you claim to want. The independence is real. So is the longing underneath it to be chosen, not just relied upon.',
      'You need permission to need. Somewhere you decided that having needs makes you too much, so you keep them small and silent. But a relationship where only one person is allowed to need is not safety, it is a slow loneliness. You are allowed to be the one held sometimes. You are allowed to be a person, not only a harbour.',
      'And you need to be seen behind the steadiness, to have someone witness the weather you keep hidden and not look away. Not to be fixed. Just to be known. The thing you most want is also the thing you are most practised at preventing, and that is exactly why it matters that you name it.',
    ],
  },
  {
    n: '06',
    title: 'Your growth edge',
    pull: 'The work isn’t to need less. It’s to let yourself be real.',
    paras: [
      'Your growth is not about becoming someone else. The world needs lighthouses, and your steadiness is genuinely a gift. The work is narrower and harder than a personality transplant. It is learning to let the light shine inward too, to let the people you guide actually reach you.',
      'It starts small. The next time someone asks how you are and you reach for “fine,” try one true sentence instead. “This was hard for me.” “I missed you.” “I needed that.” Watch what happens. The people who love you do not want the low-maintenance version of you. They want you.',
      'Practise staying when you want to retreat. When closeness spikes and the old instinct says step back up the stairs, name it instead: “I notice I want to pull away right now.” Let yourself be pursued without managing it. Let a need be spoken before it curdles into resentment. None of this makes you weak. A lighthouse that lets a few trusted ships actually dock is not less of a lighthouse. It is one that finally gets to be visited, not just seen.',
    ],
  },
]

function AxisBar({ name, left, right, pos }) {
  return (
    <div className="ar-axis">
      <span className="ar-axis-name">{name}</span>
      <div className="ar-axis-track">
        <span className="ar-axis-fill" style={{ width: `${pos}%` }} />
        <span className="ar-axis-dot" style={{ left: `${pos}%` }} />
      </div>
      <div className="ar-axis-poles">
        <span className="ar-axis-pole" data-active={pos < 50 || undefined}>
          {left}
        </span>
        <span className="ar-axis-pole" data-active={pos >= 50 || undefined}>
          {right}
        </span>
      </div>
    </div>
  )
}

function ChipSection({ label, items }) {
  return (
    <div className="ar-chips">
      <span className="ar-chips-label">{label}</span>
      <div className="ar-chiprow">
        {items.map((c) => (
          <span className="ar-chip" key={c}>
            {c}
          </span>
        ))}
      </div>
    </div>
  )
}

function Chapter({ ch }) {
  return (
    <section className="ar-ch">
      <span className="ar-ch-num">Chapter {ch.n}</span>
      <h2 className="ar-ch-title">{ch.title}</h2>
      <p className="ar-ch-pull">{ch.pull}</p>
      {ch.paras.map((p, i) => (
        <p className="ar-ch-p" key={i}>
          {p}
        </p>
      ))}
    </section>
  )
}

function ArchetypeRead({ onBack }) {
  return (
    <div className="kd-notes">
      <header className="kd-topbar kd-topbar--notes">
        <button className="kd-top-back" onClick={onBack} aria-label="Back to notes">
          <CaretLeft size={20} weight="bold" />
        </button>
        <span className="kd-top-title">Archetype</span>
        <span className="kd-top-spacer" />
      </header>

      <div className="ar-scroll">
        <div className="ar-hero">
          <span className="ar-hero-glyph">
            <Lighthouse size={34} weight="light" />
          </span>
          <span className="ar-hero-eyebrow">Your love archetype</span>
          <h1 className="ar-hero-title">The Lighthouse</h1>
          <p className="ar-hero-tag">A safe harbour for everyone, who rarely lets anyone dock.</p>
          <span className="ar-hero-meta">6 chapters · 7 min read</span>
        </div>

        <div className="ar-axes">
          {AXES.map((a) => (
            <AxisBar key={a.name} {...a} />
          ))}
        </div>

        <Chapter ch={CHAPTERS[0]} />
        <ChipSection label="You at your best" items={STRENGTHS} />
        <Chapter ch={CHAPTERS[1]} />
        <ChipSection label="What you value" items={VALUES} />
        <Chapter ch={CHAPTERS[2]} />
        <Chapter ch={CHAPTERS[3]} />
        <ChipSection label="What sets you off" items={TRIGGERS} />
        <Chapter ch={CHAPTERS[4]} />
        <ChipSection label="What you need more of" items={NEEDS} />
        <Chapter ch={CHAPTERS[5]} />

        <div className="ar-foot">
          <span className="ar-foot-glyph">
            <Lighthouse size={22} weight="light" />
          </span>
          <span>This is the constant in you. Kael’s daily notes are how it grows.</span>
        </div>
      </div>
    </div>
  )
}

function ChatScreen({ kaelState, onCycle, onOpenNotes, newNote }) {
  const [draft, setDraft] = useState('')
  return (
    <div className="kd-chat">
      <header className="kd-topbar">
        <button className="kd-top-avatar" aria-label="Profile and settings">
          {PROFILE.initial}
        </button>
        <button className="kd-top-kael" onClick={onCycle} aria-label="Kael status">
          <span className="kd-top-name">Kael</span>
          <span className="kd-top-state" data-state={kaelState}>
            {kaelState === 'responding' ? (
              <span className="kd-typing" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            ) : (
              <span className="kd-state-dot" aria-hidden="true" />
            )}
            {kaelState}
          </span>
        </button>
        <button className="kd-top-notes" onClick={onOpenNotes} aria-label="Notes">
          <Notepad size={22} weight="regular" />
          {newNote && <span className="kd-notes-dot" aria-hidden="true" />}
        </button>
      </header>

      <div className="kd-chat-scroll">
        <div className="kd-day">Today</div>
        <div className="kd-kgroup">
          <span className="kd-khead">
            <span className="kd-kglyph">
              <Sparkle size={13} sw={1.6} />
            </span>
            Kael
          </span>
          <p className="kd-bubble">Good evening, Maya.</p>
          <p className="kd-bubble">
            Yesterday that fight with him was still sitting heavy. I’ve been wondering how tonight feels.
          </p>
          <div className="kd-replies">
            {REPLIES.map((r) => (
              <motion.button key={r} className="kd-chip" {...TAP}>
                {r}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* starters — pinned above the composer, horizontal scroll, within thumb reach */}
      <div className="kd-starters">
        {FEELINGS.map(({ label, Icon }) => (
          <motion.button key={label} className="kd-chip kd-chip--icon" {...TAP}>
            <span className="kd-chip-ic">
              <Icon size={16} sw={1.6} />
            </span>
            {label}
          </motion.button>
        ))}
      </div>

      <form
        className="kd-composer"
        onSubmit={(e) => {
          e.preventDefault()
          setDraft('')
        }}
      >
        <input
          className="kd-composer-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Tell Kael what’s going on…"
        />
        <motion.button type="submit" className="kd-composer-send" aria-label="Send" {...TAP}>
          <Send size={18} sw={1.7} />
        </motion.button>
      </form>
    </div>
  )
}

function NotesScreen({ onBack, onOpenArch, openId, setOpenId }) {
  return (
    <div className="kd-notes">
      <header className="kd-topbar kd-topbar--notes">
        <button className="kd-top-back" onClick={onBack} aria-label="Back to chat">
          <CaretLeft size={20} weight="bold" />
        </button>
        <span className="kd-top-title">Notes</span>
        <span className="kd-top-spacer" />
      </header>

      <div className="kd-notes-scroll">
        <motion.button className="kd-arch" onClick={onOpenArch} {...TAP}>
          <span className="kd-arch-glyph">
            <Lighthouse size={28} weight="light" />
          </span>
          <span className="kd-arch-text">
            <span className="kd-arch-eyebrow">Your love archetype</span>
            <span className="kd-arch-name">The Lighthouse</span>
          </span>
          <CaretRight className="kd-arch-caret" size={18} weight="bold" />
        </motion.button>

        <article className="kd-today">
          <div className="kd-today-meta">
            <span className="kd-today-kind">{TODAY.kind}</span>
            <span className="kd-note-dot2" aria-hidden="true" />
            <span>{TODAY.date}</span>
            <span className="kd-note-dot2" aria-hidden="true" />
            <span>{TODAY.read} read</span>
          </div>
          <h2 className="kd-today-title">{TODAY.title}</h2>
          <NoteBody blocks={TODAY.body} />
        </article>

        <div className="kd-archsec">
          <span className="kd-section">Earlier notes</span>
          <div className="kd-archive">
            {ARCHIVE.map((n) => (
              <ArchiveCard
                key={n.id}
                note={n}
                open={openId === n.id}
                onToggle={() => setOpenId(openId === n.id ? null : n.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function KaelDuo() {
  const [screen, setScreen] = useState('chat')
  const [kaelState, setKaelState] = useState('present')
  const [newNote, setNewNote] = useState(true)
  const [openId, setOpenId] = useState(null)

  return (
    <div className="kd-stage">
      <div className="phone-reserve" style={{ '--scale': 0.82 }}>
        <div className="phone-scaler">
          <div className="phone">
            <div className="phone-screen">
              <StatusBar />
              <div className="screen-body">
                {screen === 'archetype' ? (
                  <ArchetypeRead onBack={() => setScreen('notes')} />
                ) : screen === 'notes' ? (
                  <NotesScreen
                    onBack={() => setScreen('chat')}
                    onOpenArch={() => setScreen('archetype')}
                    openId={openId}
                    setOpenId={setOpenId}
                  />
                ) : (
                  <ChatScreen
                    kaelState={kaelState}
                    onCycle={() => setKaelState((s) => STATES[(STATES.indexOf(s) + 1) % STATES.length])}
                    onOpenNotes={() => {
                      setScreen('notes')
                      setNewNote(false)
                    }}
                    newNote={newNote}
                  />
                )}
              </div>
              <div className="home-indicator" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
