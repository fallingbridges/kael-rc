import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Send,
  MoodAnxious,
  MoodHurt,
  MoodLonely,
  MoodHopeful,
  MoodNumb,
  MoodOverwhelmed,
  Quote,
  ArrowUpRight,
  Sparkle,
  Lighthouse,
  Flame,
  Target,
  Pattern,
} from '../components/Icons.jsx'

// The user. Archetype is fixed; day/streak are "today".
const PROFILE = {
  name: 'Maya',
  initial: 'M',
  day: 142,
  streak: 6,
}

// The archetype + Kael's evolving read. The home card is a preview; tapping it
// opens the full read on the You page.
const READ = {
  eyebrow: 'Your love archetype',
  liveEyebrow: 'Kael’s live read',
  archetype: 'The Lighthouse',
  archetypeLabel: 'Your archetype',
  subtitle: 'Kael’s evolving read of you',
  insight: 'You reach for clarity when what you really need is to feel safe.',
  updated: 'Updated 2 days ago',
  cta: 'Open your read',
}

// Hero colour tints — brand only. Two families: warm neutrals (ink -> paper) and
// the one accent (tan / brown). `bg` is the swatch colour shown in the picker.
const TINTS = [
  { id: 'ink', bg: '#1b1a17' }, // --ink / --invert-bg, warm near-black
  { id: 'brown', bg: '#6e5638' }, // --badge-ink, the warm accent
  { id: 'tan', bg: '#f6f0e4' }, // --badge-fill, light accent
  { id: 'paper', bg: '#f7f5f0' }, // --paper, light neutral
]

// Quick starts under the input — moods + situations folded into one row.
const QUICK = [
  { label: "I’m anxious", msg: "I’m anxious and I can’t tell if it’s about us or just me.", Icon: MoodAnxious },
  { label: "I feel hurt", msg: "Something hurt me and I’m not sure if I should bring it up.", Icon: MoodHurt },
  { label: "I feel lonely", msg: "I feel lonely, even when we’re together.", Icon: MoodLonely },
  { label: "I’m hopeful", msg: "Something feels different lately, in a good way. Help me understand it.", Icon: MoodHopeful },
  { label: "I feel numb", msg: "I feel numb. Like I’ve been going through the motions.", Icon: MoodNumb },
  { label: "I’m overwhelmed", msg: "I’m overwhelmed and everything feels like too much right now.", Icon: MoodOverwhelmed },
]

// One feed under "From Kael" — square posters, all the same structure:
// two short paragraphs (the observation, then the reframe), with emphasis
// on individual words (bold / italic), never whole sentences. `tone` paints
// the whole poster one colour. Tapping brings the thread to chat.
const FROM_KAEL = [
  {
    id: 'apology',
    chip: 'From Kael',
    Icon: Sparkle,
    tone: 'warm',
    quote: [
      [{ t: 'You keep ' }, { t: 'apologising', em: 'b' }, { t: ' for taking up space in your own life.' }],
      [
        { t: 'Your needs were never the problem. You learned that being ' },
        { t: 'easy', em: 'i' },
        { t: ' was the price of being ' },
        { t: 'kept', em: 'b' },
        { t: '.' },
      ],
    ],
    cta: 'Talk it through',
    msg: 'I keep apologising for who I am and shrinking to fit. Can we look at that?',
  },
  {
    id: 'weather',
    chip: 'Reflection',
    Icon: Quote,
    tone: 'warm',
    quote: [
      [{ t: 'When someone pulls back, your mind reaches for the ' }, { t: 'worst', em: 'b' }, { t: ' reading.' }],
      [
        { t: 'But distance is often a nervous system asking for ' },
        { t: 'room', em: 'i' },
        { t: ', not the start of an ending. The story you add is the part that ' },
        { t: 'hurts', em: 'b' },
        { t: '.' },
      ],
    ],
    cta: 'Sit with this',
    msg: 'When someone goes quiet I read it as a verdict and spiral. Help me hold it differently.',
  },
  {
    id: 'retext',
    chip: 'Try today',
    Icon: Target,
    tag: '2 min',
    quote: [
      [{ t: 'The urge to send one more text is rarely about the ' }, { t: 'message', em: 'b' }, { t: '.' }],
      [
        { t: 'Name the feeling first: “I feel unseen.” That pause is where your ' },
        { t: 'choice', em: 'b' },
        { t: ' comes ' },
        { t: 'back', em: 'i' },
        { t: '.' },
      ],
    ],
    cta: 'Practice with Kael',
    msg: 'Bring me the text I’m about to send. Let’s find the feeling under it first.',
  },
  {
    id: 'clarity',
    chip: 'Your pattern',
    Icon: Pattern,
    quote: [
      [{ t: 'When things feel uncertain, you reach for ' }, { t: 'clarity', em: 'b' }, { t: ' to make the fear go quiet.' }],
      [
        { t: 'The relief lasts a minute. Then the ' },
        { t: 'reaching', em: 'i' },
        { t: ' itself crowds out the closeness you actually ' },
        { t: 'wanted', em: 'b' },
        { t: '.' },
      ],
    ],
    cta: 'Catch it earlier',
    msg: 'I reach for clarity when I really need to feel safe. Help me catch it earlier.',
  },
  {
    id: 'beam',
    chip: 'For a Lighthouse',
    Icon: Lighthouse,
    tone: 'warm',
    quote: [
      [{ t: 'You hold steady from arm’s length, giving them almost ' }, { t: 'nothing', em: 'b' }, { t: ' to read.' }],
      [
        { t: 'Steady from a distance can ' },
        { t: 'read', em: 'i' },
        { t: ' as steady toward no one. Once a week, close the distance on ' },
        { t: 'purpose', em: 'b' },
        { t: '.' },
      ],
    ],
    cta: 'Bring this to Kael',
    msg: 'I stay steady but keep people at arm’s length. Help me turn toward them.',
  },
]

// One orchestrated entrance: sections rise and fade in, gently staggered.
const STAGGER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}
const RISE = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 0.61, 0.36, 1] } },
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function today() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

function QuoteText({ paras }) {
  return (
    <div className="poster-quote">
      {paras.map((para, i) => (
        <p className="pq-para" key={i}>
          {para.map((seg, j) =>
            seg.em === 'b' ? (
              <strong key={j}>{seg.t}</strong>
            ) : seg.em === 'i' ? (
              <em key={j}>{seg.t}</em>
            ) : (
              <span key={j}>{seg.t}</span>
            ),
          )}
        </p>
      ))}
    </div>
  )
}

// Kael's live read — rendered as a card in the same feed as the reflections, with
// the same structure (two short paragraphs, word-level emphasis). It just carries
// a freshness stamp and taps through to the full read instead of into chat.
const LIVE_READ = {
  quote: [
    [
      { t: 'Right now you keep reaching for ' },
      { t: 'clarity', em: 'b' },
      { t: '. One more talk, one more answer, anything to make the fear go quiet.' },
    ],
    [
      { t: 'But underneath the questions is a simpler need: to feel ' },
      { t: 'safe', em: 'b' },
      { t: '. Name that first, and the ' },
      { t: 'reaching', em: 'i' },
      { t: ' loosens its grip.' },
    ],
  ],
}

export default function HomeScreen({ onPrompt, onOpenRead }) {
  const [draft, setDraft] = useState('')

  const [tint, setTint] = useState(() => {
    try {
      return localStorage.getItem('kael-tint') || 'brown'
    } catch {
      return 'brown'
    }
  })
  function pickTint(t) {
    setTint(t)
    try {
      localStorage.setItem('kael-tint', t)
    } catch {
      /* ignore */
    }
  }
  // The status bar lives outside this screen; mirror the tint onto it so the
  // dark hero colour runs all the way to the top of the phone.
  useEffect(() => {
    const sb = document.querySelector('.statusbar')
    if (sb) sb.setAttribute('data-tint', tint)
  }, [tint])

  function submitDraft(e) {
    e.preventDefault()
    const t = draft.trim()
    if (!t) return
    onPrompt?.(t)
    setDraft('')
  }

  return (
    <>
    <motion.div className="screen-scroll home-scroll" variants={STAGGER} initial="hidden" animate="show">
      {/* Full-bleed hero — greeting + "what's alive" in its own box */}
      <motion.header className="home-hero" data-tint={tint} variants={RISE}>
        <div className="hero-greet">
          <div className="hero-greet-text">
            <span className="hero-date">{today()}</span>
            <h1 className="hero-name">
              {greeting()}, {PROFILE.name}
            </h1>
            <span className="hero-streak">
              <span className="hero-flame">
                <Flame size={13} weight="fill" />
              </span>
              Day {PROFILE.day} · {PROFILE.streak} day streak
            </span>
          </div>
          <span className="hero-avatar" aria-hidden="true">
            {PROFILE.initial}
          </span>
        </div>

        {/* What's alive — its own contained box, like the read box was */}
        <div className="hero-ask-box">
          <span className="hero-ask-q">What’s alive right now?</span>
          <form className="hero-ask" onSubmit={submitDraft}>
            <input
              className="hero-ask-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Say it out loud, or just start typing…"
              aria-label="What’s alive right now"
            />
            <motion.button
              type="submit"
              className="hero-ask-send"
              disabled={!draft.trim()}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 500, damping: 26 }}
              aria-label="Send to Kael"
            >
              <Send size={17} sw={1.7} />
            </motion.button>
          </form>
          <div className="hero-chips">
            {QUICK.map(({ label, msg, Icon }) => (
              <motion.button
                key={label}
                className="hero-chip"
                onClick={() => onPrompt?.(msg)}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 420, damping: 26 }}
              >
                <Icon size={13} sw={1.6} />
                {label}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.header>

      {/* One feed: the live read sits as the first card, then the reflections */}
      <motion.section className="block pad" variants={RISE}>
        <div className="kfeed">
          {/* Live read — same card, taps to the full read */}
          <motion.button
            className="poster"
            data-tone="warm"
            onClick={() => onOpenRead?.()}
            whileTap={{ scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            <span className="poster-wm" aria-hidden="true">
              <Lighthouse size={150} weight="thin" />
            </span>
            <div className="poster-top">
              <span className="poster-chip">
                <Lighthouse size={13} sw={1.7} />
                Live read
              </span>
              <span className="poster-fresh">
                <span className="poster-pulse" aria-hidden="true" />
                Updated 2 days ago
              </span>
            </div>
            <div className="poster-body">
              <QuoteText paras={LIVE_READ.quote} />
            </div>
            <span className="poster-cta">
              Open your read
              <ArrowUpRight size={15} sw={1.8} />
            </span>
          </motion.button>

          {FROM_KAEL.map(({ id, chip, Icon, tag, tone, quote, cta, msg }) => (
            <motion.button
              key={id}
              className="poster"
              data-tone={tone || undefined}
              onClick={() => onPrompt?.(msg)}
              whileTap={{ scale: 0.99 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <span className="poster-wm" aria-hidden="true">
                <Icon size={150} weight="thin" />
              </span>
              <div className="poster-top">
                <span className="poster-chip">
                  <Icon size={13} sw={1.7} />
                  {chip}
                </span>
                {tag && <span className="poster-tag">{tag}</span>}
              </div>
              <div className="poster-body">
                <QuoteText paras={quote} />
              </div>
              <span className="poster-cta">
                {cta}
                <ArrowUpRight size={15} sw={1.8} />
              </span>
            </motion.button>
          ))}
        </div>
      </motion.section>
    </motion.div>

      {/* Testing control — hero colour swatches */}
      <div className="hero-switch">
        <span className="hsw-label">Hero</span>
        {TINTS.map((t) => (
          <button
            key={t.id}
            className="hsw-sw"
            data-on={tint === t.id}
            style={{ '--sw': t.bg }}
            onClick={() => pickTint(t.id)}
            aria-label={`Hero ${t.id}`}
          />
        ))}
      </div>
    </>
  )
}
