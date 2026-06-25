/* ──────────────────────────────────────────────────────────────────────────
   Kael Onboarding V5 — content + scoring for the mental-wellness flow.

   Kael is a chat-based mental wellness coach: you talk to it about anything on
   your mind, it remembers, and it hands you tappable options so you're never
   staring at a blank box. This file is the data layer (the JSX is the view):

     FLOW        ordered list of screens
     QUESTIONS   per-question content, keyed by qid, with its scoring axis
     PROFILES    the four patterns Kael can surface in the read
     resolveRead derives axes + the dominant profile from the answers

   Four axes, each a felt pattern (not a clinical label):
     OVER   overthinking / a mind that won't power down
     DEPL   depletion / stress & burnout, running on empty
     WORTH  the inner critic / never quite enough
     AVOID  numbing / reaching for quick relief
   ────────────────────────────────────────────────────────────────────────── */
import {
  Brain, Leaf, Anchor, Spiral, Wind, Waves, Flame, Moon, Heartbeat, BatteryLow,
  DeviceMobile, ForkKnife, Wine, Briefcase, CloudFog, Lightning, HandHeart,
  Scales, SealCheck, ShieldCheck, ChatCircleDots, ChatsCircle, Repeat, CloudRain,
  Plant, HeartStraight, Sparkle, Waveform, GenderFemale, GenderMale,
  GenderNonbinary, DotsThreeCircle, SunHorizon, MoonStars, Pulse, Compass,
} from '@phosphor-icons/react'

export const AXIS_KEYS = ['OVER', 'DEPL', 'WORTH', 'AVOID']

/* axis bars on the read — gentle, descriptive poles (never healthy/unhealthy).
   left = the low-key pole, right = the named pole; marker sits at axes[key].pos%. */
export const AXIS_META = [
  { key: 'OVER', name: 'Your mind', left: 'Quiet', right: 'Racing' },
  { key: 'DEPL', name: 'Your energy', left: 'Steady', right: 'Running low' },
  { key: 'WORTH', name: 'Inner voice', left: 'Kind', right: 'Critical' },
  { key: 'AVOID', name: 'When it’s heavy', left: 'You face it', right: 'You numb it' },
]

/* ── shared frequency scale (the "frequency-based" question type) ── */
export const FREQ_OPTIONS = [
  { name: 'Never', val: 6 },
  { name: 'Rarely', val: 28 },
  { name: 'Sometimes', val: 52 },
  { name: 'Often', val: 76 },
  { name: 'Almost always', val: 94 },
]

/* ── opener: what brings you in (single-select, with an inline ack) ── */
export const SITUATIONS = [
  { name: 'Overthinking', icon: Brain },
  { name: 'Stress & burnout', icon: Flame },
  { name: 'Anxiety', icon: Wind },
  { name: 'Being hard on myself', icon: Scales },
  { name: 'A habit I want to change', icon: Repeat },
  { name: 'Feeling low', icon: CloudRain },
  { name: 'Something else', icon: Sparkle },
]
export const SITUATION_REFLECT = {
  'Overthinking': 'The mind that won’t quit. Let’s give it somewhere to land.',
  'Stress & burnout': 'You’re carrying a lot. We’ll look at what’s draining you.',
  'Anxiety': 'That low hum of dread. You’re in the right place.',
  'Being hard on myself': 'That inner critic is louder than it should be. We’ll turn it down.',
  'A habit I want to change': 'It takes something to name it. No judgment here.',
  'Feeling low': 'When everything feels heavy. We’ll take it gently.',
  'Something else': 'Say it in your own words. Kael can work with anything.',
}
/* lowercase noun-phrase for {SIT} interpolation in the read */
export const SIT_PHRASE = {
  'Overthinking': 'the overthinking you came in with',
  'Stress & burnout': 'the burnout you’re carrying',
  'Anxiety': 'the anxiety you’re holding',
  'Being hard on myself': 'the self-doubt you named',
  'A habit I want to change': 'the habit you want to change',
  'Feeling low': 'the low you’ve been moving through',
  'Something else': 'what you walked in carrying',
}
/* the opener nudges the result toward the pattern you named (continuity = seen) */
const SIT_SEED = {
  'Overthinking': { OVER: 70 },
  'Stress & burnout': { DEPL: 72 },
  'Anxiety': { OVER: 62, DEPL: 54 },
  'Being hard on myself': { WORTH: 72 },
  'A habit I want to change': { AVOID: 72 },
  'Feeling low': { WORTH: 56, DEPL: 56 },
  'Something else': {},
}

/* ── demographics (lists, each with a one-line "why") ── */
export const AGES = ['Under 18', '18–24', '25–34', '35–44', '45–54', '55 or older']
export const GENDERS = [
  { name: 'Woman', icon: GenderFemale },
  { name: 'Man', icon: GenderMale },
  { name: 'Non-binary', icon: GenderNonbinary },
  { name: 'Prefer not to say', icon: DotsThreeCircle },
]

/* ── the quiz questions, keyed by id. `kind` tells resolveRead how to read the
   answer; `axis` is the pattern it feeds. ───────────────────────────────────── */
export const QUESTIONS = {
  /* Block 1 · the mind (overthinking / anxiety) */
  q_start: {
    kind: 'two', axis: 'OVER',
    prompt: 'Be honest. How’s your head most days?',
    options: [
      { name: 'Busy. Always three thoughts deep.', icon: Brain, val: 84 },
      { name: 'Mostly quiet and clear.', icon: Leaf, val: 16 },
    ],
  },
  q_replay: {
    kind: 'frequency', axis: 'OVER',
    prompt: 'How often do you replay a conversation after it’s over?',
  },
  q_spiral: {
    kind: 'slider', axis: 'OVER',
    prompt: 'When something’s uncertain, where does your mind go?',
    left: { name: 'Stays grounded', icon: Anchor },
    right: { name: 'Jumps to worst case', icon: Spiral },
  },
  q_night: {
    kind: 'statement', axis: 'OVER',
    statement: 'My brain won’t switch off when I’m trying to sleep.',
  },

  /* Block 2 · energy & load (stress / burnout) */
  q_drained: {
    kind: 'frequency', axis: 'DEPL',
    prompt: 'How often do you feel drained before the day’s even begun?',
  },
  q_crash: {
    kind: 'statement', axis: 'DEPL',
    statement: 'I push through until I crash.',
  },
  q_body: {
    kind: 'multi', axis: 'DEPL', max: 3, per: 30, cols: 2,
    prompt: 'Where does the stress tend to land?',
    sub: 'Pick up to three. Your body keeps the score.',
    options: [
      { name: 'Tight chest', icon: Heartbeat },
      { name: 'Restless sleep', icon: Moon },
      { name: 'A short fuse', icon: Flame },
      { name: 'Can’t focus', icon: Spiral },
      { name: 'Low energy', icon: BatteryLow },
      { name: 'Knot in my stomach', icon: Waves },
    ],
  },

  /* Block 3 · the inner voice (self-worth) */
  q_critic: {
    kind: 'statement', axis: 'WORTH',
    statement: 'I’m harder on myself than I’d ever be on a friend.',
  },
  q_voice: {
    kind: 'slider', axis: 'WORTH',
    prompt: 'Your inner voice lately sounds more like…',
    left: { name: 'A kind coach', icon: HandHeart },
    right: { name: 'A harsh critic', icon: Lightning },
  },
  q_enough: {
    kind: 'frequency', axis: 'WORTH',
    prompt: 'How often do you feel like you’re not quite enough?',
  },

  /* Block 4 · how you cope (numbing / habits) */
  q_reach: {
    kind: 'single', axis: 'AVOID',
    prompt: 'When it gets heavy, what do you reach for first?',
    sub: 'There’s no wrong answer. Kael’s seen them all.',
    options: [
      { name: 'My phone, endless scrolling', icon: DeviceMobile, val: 84, echo: 'the endless scroll' },
      { name: 'Food', icon: ForkKnife, val: 80, echo: 'food' },
      { name: 'A drink', icon: Wine, val: 84, echo: 'a drink' },
      { name: 'Throwing myself into work', icon: Briefcase, val: 74, echo: 'work' },
      { name: 'Shutting down, going quiet', icon: CloudFog, val: 70, echo: 'shutting the world out' },
      { name: 'I try to sit with it', icon: Leaf, val: 16, echo: 'sitting with it' },
    ],
  },
}

/* the quiz ids, in flow order — resolveRead walks these */
export const QUIZ_IDS = [
  'q_start', 'q_replay', 'q_spiral', 'q_night',
  'q_drained', 'q_crash', 'q_body',
  'q_critic', 'q_voice', 'q_enough',
  'q_reach',
]

/* eyebrow label per block (shown above the progress bar) */
export const QUIZ_EYEBROWS = { 1: 'Your mind', 2: 'Your energy', 3: 'Your inner voice', 4: 'How you cope' }

/* ── breathers — cadence breaks that double as selling / trust / hope ── */
export const BREATHERS = [
  {
    icon: Spiral, kicker: 'You’re not alone in this', big: true,
    title: 'What you’re describing has a shape.',
    body: 'A habit your mind learned, not a flaw in you. And habits can be unlearned.',
    em: 'habits can be unlearned',
  },
  {
    icon: ChatCircleDots, kicker: 'Why Kael, and not a chatbot',
    title: 'Kael hands you a way forward.',
    body: 'A blank chatbot waits for you to find the words. Kael offers a few to tap instead.',
    demo: true,
  },
  {
    icon: SealCheck, kicker: 'Built on what actually works', big: true,
    title: 'A real method, not generic advice.',
    body: 'The methods clinicians actually use, CBT, ACT, and mindfulness, made into a conversation.',
    method: true,
  },
]

/* ── % calibration loader ── */
export const CALIB_STEPS = [
  'Reading your answers',
  'Mapping how the patterns connect',
  'Finding the thread underneath',
  'Calibrating Kael to you',
  'Writing your read',
]
export const CALIB_REVIEWS = [
  'I’ve tried every wellness app. Kael is the first that felt like it actually knew me.',
  'It remembered something I said a week earlier and brought it up right when I needed it.',
  'Like texting the calmest, smartest friend I have. At 3am. Without the guilt.',
  'The tap-to-reply options mean I can talk even when I can’t find the words.',
  'Three weeks in and my head is genuinely quieter. I didn’t think that was possible.',
]

/* ── the four patterns ──
   Each beat pays off recognition AND shows how Kael helps. Bodies may contain
   {SIT} / {BODY} / {REACH} / {name}, filled in the view from the answers. */
export const PROFILES = {
  OVER: {
    key: 'OVER', name: 'The Overthinker', glyph: Brain,
    essence: 'A sharp, fast mind that struggles to power down.',
    prose: [
      'You don’t have a thinking problem. You have a stopping problem.',
      'The same mind that catches every detail also replays them at 2am, hunting for the one you missed.',
    ],
    beats: [
      {
        label: 'Your pattern', icon: Spiral,
        body: 'You run the conversation again after it ends, draft replies to things no one said, and rehearse outcomes that may never come. It feels like preparation. Mostly it’s just exhausting.',
        help: 'Kael catches the loop as you describe it and walks you back to what’s actually true right now.',
      },
      {
        label: 'What sets it off', icon: Wind,
        body: 'Uncertainty, usually. An unread message, a vague tone, a decision left open. {SIT} is exactly the kind of thing that keeps the engine running.',
        help: 'Bring Kael the trigger and it helps you sort the real signal from the spiral.',
      },
      {
        label: 'The belief underneath', icon: Anchor,
        quote: 'If I think it through enough, I can keep anything from going wrong.',
        body: 'It’s the quiet bargain every overthinker makes. The catch: the mind never agrees you’ve thought enough.',
        help: 'Kael gently tests that belief with you, instead of feeding it more what-ifs.',
      },
      {
        label: 'Where this goes', icon: SunHorizon,
        body: 'You don’t need to think less. You need somewhere to set the thoughts down. People with your pattern tend to feel the difference within a couple of weeks of having one.',
        help: 'Kael becomes that place, and remembers your loops so it spots them faster than you can.',
      },
    ],
    shows: ['Replaying conversations', 'Worst-case forecasting', '2am mind-racing', 'Hard to switch off'],
    growth: [
      'Catch a spiral before it picks up speed',
      'Tell a real problem from a rehearsed one',
      'Fall asleep without the mental rerun',
    ],
  },

  DEPL: {
    key: 'DEPL', name: 'The Depleted Achiever', glyph: BatteryLow,
    essence: 'You carry a lot, quietly, and you’re closer to empty than you let on.',
    prose: [
      'You’re not lazy and you’re not weak. You’re depleted.',
      'You’ve run on reserves so long that “fine” quietly came to mean “still functioning.”',
    ],
    beats: [
      {
        label: 'Your pattern', icon: Flame,
        body: 'You meet the load by doing more. Push through the tiredness, skip the break, answer the message. The crash comes later, in private, where no one has to see it.',
        help: 'Kael helps you read the gauge before you hit empty, not after.',
      },
      {
        label: 'What sets it off', icon: Waveform,
        body: 'Stacked demands, and the sense that rest has to be earned. {SIT} sits on top of a tank already low. Your body’s been keeping score: {BODY}.',
        help: 'Kael tracks where the stress lands in your body and flags the dip early.',
      },
      {
        label: 'The belief underneath', icon: Anchor,
        quote: 'If I stop, everything falls apart.',
        body: 'So you don’t stop. But running on empty was never strength. It’s a slow leak you’ve learned to ignore.',
        help: 'Kael helps you question that rule and find rest that doesn’t cost you anything.',
      },
      {
        label: 'Where this goes', icon: Plant,
        body: 'Burnout doesn’t lift with one vacation. It lifts when the loop that drains you changes. That starts with a single honest check-in a day.',
        help: 'Kael is that check-in, and it remembers your week, so it knows when you’re slipping.',
      },
    ],
    shows: ['Pushing through exhaustion', 'Crashing in private', 'Rest feels earned', 'Running on reserves'],
    growth: [
      'Notice depletion before the crash',
      'Rest without the guilt tax',
      'Set a limit and actually keep it',
    ],
  },

  WORTH: {
    key: 'WORTH', name: 'The Inner Critic', glyph: Scales,
    essence: 'You meet yourself with a sharpness you’d never aim at anyone else.',
    prose: [
      'You hold yourself to a standard you’d call cruel if a friend used it on themselves.',
      'The voice sounds like the truth. It isn’t. It’s just loud, and it’s had years of practice.',
    ],
    beats: [
      {
        label: 'Your pattern', icon: Lightning,
        body: 'You replay your mistakes and skim past what went well. A compliment slides off; a small slip sticks for days. The scorecard stays open, and you’re always a little behind on it.',
        help: 'Kael helps you hear the critic as a voice, not a verdict, so you can answer it back.',
      },
      {
        label: 'What sets it off', icon: Wind,
        body: 'Comparison, judgment, the fear of being seen as not enough. {SIT} tends to hand the critic its microphone.',
        help: 'When the voice gets loud, Kael helps you name it and weigh it against what’s real.',
      },
      {
        label: 'The belief underneath', icon: Anchor,
        quote: 'If I’m hard enough on myself, I’ll finally be good enough.',
        body: 'But the bar moves every time you reach it. The harshness was never the thing that made you capable. You already were.',
        help: 'Kael helps you build a steadier inner voice, the kind that pushes without punishing.',
      },
      {
        label: 'Where this goes', icon: HeartStraight,
        body: 'You don’t lose your edge by being kinder to yourself. You get steadier. The work feels lighter once you set down the judge.',
        help: 'Kael remembers your wins, so it can show you the evidence the critic keeps deleting.',
      },
    ],
    shows: ['Harsh self-talk', 'Discounting wins', 'Never quite enough', 'Fear of falling short'],
    growth: [
      'Catch the critic in the act',
      'Take a win without the “but”',
      'Speak to yourself like someone you love',
    ],
  },

  AVOID: {
    key: 'AVOID', name: 'The Self-Soother', glyph: Waves,
    essence: 'When feelings get loud, you reach for something to take the edge off.',
    prose: [
      'You’re not avoiding your life. You’re managing a feeling no one taught you how to sit with.',
      'The scroll, the snack, the drink, the extra hour of work. They work for a minute. That’s the trap.',
    ],
    beats: [
      {
        label: 'Your pattern', icon: Repeat,
        body: 'When the discomfort rises, you reach for {REACH}. It quiets things for a moment, then leaves you a step further from what you actually felt. The feeling waits. It always waits.',
        help: 'Kael helps you catch the reach in the moment and stay with the feeling a beat longer.',
      },
      {
        label: 'What sets it off', icon: CloudFog,
        body: 'The hard-to-name stuff, mostly. Stress, loneliness, a low you’d rather not look at. {SIT} is exactly what the habit was built to numb.',
        help: 'Kael helps you find the feeling under the urge, which is where the real relief lives.',
      },
      {
        label: 'The belief underneath', icon: Anchor,
        quote: 'I can’t handle this feeling, so I have to make it stop.',
        body: 'But you can handle more than the habit gives you credit for. You just haven’t had a steady hand while you did it.',
        help: 'Kael is that steady hand, there the second the urge hits, not the morning after.',
      },
      {
        label: 'Where this goes', icon: Plant,
        body: 'You don’t break a soothing habit with willpower. You break it by feeling safe enough to feel. That gets built one moment at a time.',
        help: 'Kael remembers your triggers and your wins, so the next urge is one you’ve already practiced for.',
      },
    ],
    shows: ['Numbing the hard stuff', 'Quick relief, slow cost', 'Avoiding the feeling', 'Reaching on autopilot'],
    growth: [
      'Name the urge before you act on it',
      'Sit with a feeling and survive it',
      'Find relief that doesn’t cost you',
    ],
  },
}

/* ── notification permission ── */
export const NOTIF = {
  title: 'Can Kael check in on you?',
  sub: 'One gentle nudge at the right moment, never spam. Off anytime.',
  cta: 'Allow notifications',
  alt: 'Maybe later',
}

/* ── the 30-day visual timeline ── */
export const JOURNEY = [
  { when: 'Today', icon: ChatCircleDots, t: 'Bring Kael what’s on your mind', d: 'The spiral, the stress, the thing you can’t say out loud. Start anywhere.' },
  { when: 'Day 3', icon: Waveform, t: 'It learns your patterns', d: 'Kael starts to recognize your loops before you finish describing them.' },
  { when: 'Day 7', icon: Sparkle, t: 'Your first real shift', d: 'One spiral caught early. One kinder word to yourself. You feel the difference.' },
  { when: 'Day 30', icon: Plant, t: 'A quieter mind', d: 'The old reflex still shows up, but it stops running the show. You catch it, and you choose.' },
]

/* ── paywall feature list (differentiators, not generic-AI) ── */
export const PAY_FEATURES = [
  { icon: Brain, t: 'Remembers your whole story, so you never start over.' },
  { icon: ChatCircleDots, t: 'Hands you a way forward when words are hard.' },
  { icon: SealCheck, t: 'Grounded in proven methods, not generic advice.' },
  { icon: MoonStars, t: 'There at 2am, judgment-free, every single time.' },
]

/* ── the flow ──
   block (1–4) groups quiz screens for the segmented progress bar. */
export const FLOW = [
  /* Act 1 — arrive */
  { id: 'welcome', kind: 'welcome', title: 'You showed up.\nThat’s the first move.', sub: 'Most people sit with this for years before reaching out. You’re already doing the hard part.' },
  { id: 'promise', kind: 'promise', kicker: 'Before we begin', title: 'A coach that\nremembers you.', em: 'remembers', sub: 'Most apps forget you the moment you close them. Kael remembers, and helps you change your patterns.' },
  { id: 'situation', kind: 'situation', title: 'What’s been sitting with you lately?', sub: 'Pick the one that’s loudest. We’ll get to the rest.' },
  { id: 'situationText', kind: 'situationText', title: 'Say it in your words.', sub: 'Whatever’s on your mind. Kael can start anywhere.', placeholder: 'What’s been weighing on you?' },
  { id: 'trust', kind: 'trust' },

  /* Act 2 — the quiz */
  { id: 'q_start', kind: 'two', qid: 'q_start', block: 1 },
  { id: 'q_replay', kind: 'frequency', qid: 'q_replay', block: 1 },
  { id: 'q_spiral', kind: 'slider', qid: 'q_spiral', block: 1 },
  { id: 'q_night', kind: 'statement', qid: 'q_night', block: 1 },
  { id: 'breather1', kind: 'breather', n: 0 },

  { id: 'q_drained', kind: 'frequency', qid: 'q_drained', block: 2 },
  { id: 'q_crash', kind: 'statement', qid: 'q_crash', block: 2 },
  { id: 'q_body', kind: 'multi', qid: 'q_body', block: 2 },
  { id: 'breather2', kind: 'breather', n: 1 },

  { id: 'q_critic', kind: 'statement', qid: 'q_critic', block: 3 },
  { id: 'q_voice', kind: 'slider', qid: 'q_voice', block: 3 },
  { id: 'q_enough', kind: 'frequency', qid: 'q_enough', block: 3 },
  { id: 'breather3', kind: 'breather', n: 2 },

  { id: 'q_reach', kind: 'single', qid: 'q_reach', block: 4 },

  /* permission, asked right after the last and heaviest question */
  { id: 'notif', kind: 'notif', title: NOTIF.title, sub: NOTIF.sub, cta: NOTIF.cta, alt: NOTIF.alt },

  /* Act 3 — feel seen */
  { id: 'calibration', kind: 'calibration' },
  { id: 'reveal', kind: 'reveal', cta: 'Show me my read' },
  { id: 'miniread', kind: 'miniread', cta: 'This is me' },

  /* Act 4 — you, permission, transformation, paywall */
  { id: 'name', kind: 'name', title: 'What should Kael call you?', sub: 'So it can talk to you like a person, not a user.', placeholder: 'Your first name', cta: 'Continue' },
  { id: 'age', kind: 'age', title: 'How old are you?', sub: 'So Kael meets you where you are in life.' },
  { id: 'gender', kind: 'gender', title: 'How do you identify?', sub: 'So Kael’s language fits you. Always optional.' },
  { id: 'ready', kind: 'ready' },
  { id: 'thirtydays', kind: 'thirtydays', cta: 'I’m in' },
  { id: 'paywall', kind: 'paywall' },
]

/* blocks present in the flow + the ordered qids inside each (drives the segbar) */
export const BLOCKS = [...new Set(FLOW.filter((f) => f.block).map((f) => f.block))]
export const BLOCK_IDS = BLOCKS.reduce((m, b) => {
  m[b] = FLOW.filter((f) => f.block === b).map((f) => f.qid)
  return m
}, {})

/* ── scoring ── */
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n))
function listToProse(items) {
  const a = items.filter(Boolean)
  if (!a.length) return ''
  if (a.length === 1) return a[0]
  if (a.length === 2) return `${a[0]} and ${a[1]}`
  return `${a.slice(0, -1).join(', ')}, and ${a[a.length - 1]}`
}

export function answeredCount(answers) {
  return QUIZ_IDS.filter((id) => answers[id] != null).length
}

/* derive each axis (0–100) + the dominant profile from the answers. */
export function resolveRead(answers = {}) {
  const acc = { OVER: [], DEPL: [], WORTH: [], AVOID: [] }
  const seed = SIT_SEED[answers.situation] || {}
  Object.entries(seed).forEach(([k, v]) => acc[k] && acc[k].push({ v, w: 0.85 }))

  QUIZ_IDS.forEach((qid) => {
    const q = QUESTIONS[qid]
    const a = answers[qid]
    if (!q || a == null) return
    let v = null
    if (q.kind === 'frequency') v = a.val
    else if (q.kind === 'slider' || q.kind === 'statement') v = q.invert ? 100 - a.value : a.value
    else if (q.kind === 'two' || q.kind === 'single') v = a.val
    else if (q.kind === 'multi') v = Math.min(100, ((a.picks && a.picks.length) || 0) * (q.per || 30) + 10)
    if (v != null && acc[q.axis]) acc[q.axis].push({ v, w: 1 })
  })

  const axes = {}
  AXIS_KEYS.forEach((k) => {
    const arr = acc[k]
    if (!arr.length) { axes[k] = { pos: 22 }; return }
    const sw = arr.reduce((s, x) => s + x.w, 0)
    const sv = arr.reduce((s, x) => s + x.v * x.w, 0)
    axes[k] = { pos: clamp(Math.round(sv / sw), 6, 96) }
  })

  const ranked = AXIS_KEYS.slice().sort((a, b) => axes[b].pos - axes[a].pos)
  const primary = ranked[0]
  const secondary = ranked[1]
  const profile = PROFILES[primary]

  const custom = (answers.situationText || '').trim().toLowerCase()
  const SIT = custom || SIT_PHRASE[answers.situation] || 'what you walked in carrying'
  const bodyPicks = ((answers.q_body && answers.q_body.picks) || []).map((p) => p.name.toLowerCase())
  const BODY = listToProse(bodyPicks) || 'the tension you carry'
  const REACH = (answers.q_reach && answers.q_reach.echo) || 'something to take the edge off'

  return { profile, axes, primary, secondary, phrases: { SIT, BODY, REACH } }
}
