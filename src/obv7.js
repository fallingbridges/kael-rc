/* ──────────────────────────────────────────────────────────────────────────
   Kael Onboarding V7 — the merge (V6 base + V5's best bits), 16-pattern edition.

   We don't sell an "archetype." We find your DOMINANT PATTERN and reflect it
   back honestly — framed as "what Kael noticed," not a personality badge.

   Four pillars, each scored from a balanced 16-question quiz (4 each):
     MIND     a mind that races / won't power down        (Quiet ↔ Racing)
     ENERGY   stress, depletion, running on empty          (Steady ↔ Running low)
     VOICE    the inner critic, never quite enough         (Kind ↔ Critical)
     COPE     how you handle the hard stuff                (Faces it ↔ Numbs it)

   Each pillar is a binary, so the four together resolve to a 4-letter CODE → one
   of 16 named patterns (PATTERNS). Each pattern has a bespoke name + essence +
   opening line (the 1-of-16 reveal). The deep read is driven by your loudest
   pillar (PILLAR_READ) with your second pillar woven in as an accent. The read
   is also PERSONALIZED: it echoes your own answers back via {SIT}/{BODY}/{REACH}.
   resolveRead(answers) → { code, primary, secondary, axes, read, phrases }.
   ────────────────────────────────────────────────────────────────────────── */
import {
  Spiral, Flame, Scales, Waves, Brain, Feather, Hourglass, Sun, Lightning,
  HandHeart, Anchor, Wind, Moon, ArrowsClockwise, Sparkle, Waveform, Wine,
  StackSimple, Heart, MagnifyingGlass, Ear, Heartbeat, BatteryLow, ChatCircleDots,
  GenderFemale, GenderMale, GenderNonbinary, Minus, CloudRain,
} from '@phosphor-icons/react'

export const AXES = ['MIND', 'ENERGY', 'VOICE', 'COPE']
/* the symptom pole per axis — the named, right-hand end of each read bar */
export const POSITIVE = { MIND: 'R', ENERGY: 'D', VOICE: 'H', COPE: 'N' }
const HEALTHY = { MIND: 'Q', ENERGY: 'S', VOICE: 'K', COPE: 'F' }
const POLE_AXIS = { R: 'MIND', Q: 'MIND', D: 'ENERGY', S: 'ENERGY', H: 'VOICE', K: 'VOICE', N: 'COPE', F: 'COPE' }
/* each pillar's anchor — the deliberate two-choice (weight 1.5); breaks pos ties */
const ANCHOR = { MIND: 'm1', ENERGY: 'e1', VOICE: 'v1', COPE: 'c1' }

/* ── the 16 patterns (one per 4-letter code, MIND-ENERGY-VOICE-COPE) ──
   The bespoke identity: name + one-line essence + a 2-sentence opening that
   speaks to that specific combination. The deeper beats come from PILLAR_READ. */
export const PATTERNS = {
  RDHN: { name: 'The Overloaded', essence: 'Everything’s loud at once, and you’re running on fumes.',
    open: 'Racing mind, empty tank, a critic that won’t quit, and a reach for whatever quiets it. If it feels like a lot, that’s because it is. The point isn’t to fix all four at once, it’s to start with the loudest.' },
  RDHF: { name: 'The Striver', essence: 'Racing, drained, self-critical, and pushing through it all.',
    open: 'You overthink, you’re exhausted, you’re hard on yourself, and you still face it head-on. That’s grit, and it’s unsustainable. You’re carrying all of it at once, and you don’t have to.' },
  RDKN: { name: 'The Drifter', essence: 'An overworked mind, low and numbing, but gentle with itself.',
    open: 'Your mind won’t quit and your energy’s gone, so you drift and numb and scroll past the feeling. You’re not hard on yourself, which helps more than you know. The work here is the energy and the reaching.' },
  RDKF: { name: 'The Trier', essence: 'A busy, tired mind that keeps showing up anyway.',
    open: 'You overthink and you’re running low, but you stay kind to yourself and you face what comes. The risk is the tank. A racing mind on empty is exactly how good people burn out.' },
  RSHN: { name: 'The Brooder', essence: 'A racing, critical mind that you numb to quiet.',
    open: 'Your head runs hot and harsh, replaying what you got wrong, and when it’s too loud you reach for something to mute it. The energy’s there. The noise is the problem, and it needs somewhere to land.' },
  RSHF: { name: 'The Perfectionist', essence: 'A sharp mind and a sharper inner critic.',
    open: 'Your mind catches everything, you’ve got the energy to chase it, and you face what’s hard. But you hold yourself to a bar you’d set for no one else, and the overthinking feeds it. Easing the critic is the unlock.' },
  RSKN: { name: 'The Dreamer', essence: 'A vivid mind that drifts off instead of landing.',
    open: 'You think in a thousand directions and you’re easy on yourself about it. The pattern is the drift: when a feeling gets real, your mind wanders somewhere easier. Coming back is the practice.' },
  RSKF: { name: 'The Seeker', essence: 'A busy, curious mind on steady ground.',
    open: 'Your head is always running, but it doesn’t run you into the floor. You’ve got energy, you’re kind to yourself, and you face things. The mind is the thing to channel, not to quiet.' },
  QDHN: { name: 'The Burnt Out', essence: 'Empty, hard on yourself, and numbing to get through.',
    open: 'This is the heavy one, and part of you already knew. You’re depleted, the inner voice is unkind, and you reach for whatever takes the edge off. None of it is a flaw. It’s a tank that’s been empty too long.' },
  QDHF: { name: 'The Pusher', essence: 'Running on empty and driving yourself anyway.',
    open: 'You keep going long past where most people stop, and you’re hard on yourself for not doing more. Your mind’s quiet, but the tank is empty and the critic won’t let you rest. Something gives before you do.' },
  QDKN: { name: 'The Fader', essence: 'Gentle with yourself, but quietly fading out.',
    open: 'You’re not hard on yourself and your mind isn’t racing. What’s happening is quieter than that: the energy’s gone, and you’ve been numbing the low instead of naming it. So let’s name it.' },
  QDKF: { name: 'The Giver', essence: 'Kind, grounded, and running low from carrying everyone.',
    open: 'You’re warm with yourself and you face what’s hard, but you’re tired in a way rest doesn’t fix. Usually that’s because you carry other people first. The tank is the thing to watch.' },
  QSHN: { name: 'The Stoic', essence: 'Calm on the surface, harsh underneath, all of it held in.',
    open: 'From outside you look unshakeable: steady, low-drama, handling it. Inside, the voice is sharp and the feelings get managed quietly, alone. Steady isn’t the same as okay.' },
  QSHF: { name: 'The Hard Marker', essence: 'Steady and honest, but you grade yourself on a brutal curve.',
    open: 'You stay level and you face what comes, but the scorecard in your head never closes. You’d never speak to anyone the way you speak to you. That’s the one voice worth softening.' },
  QSKN: { name: 'The Avoider', essence: 'Calm and kind, but you look away from the hard stuff.',
    open: 'You keep an even keel and you’re gentle with yourself, which is rarer than you think. The catch is what you do with a hard feeling: reach past it, keep it light, change the subject. It waits for you anyway.' },
  QSKF: { name: 'The Grounded', essence: 'Steadier than most, with one quiet edge to keep an eye on.',
    open: 'Honestly, you’re doing better than you give yourself credit for. Your mind is mostly clear, your tank isn’t empty, and you don’t tear yourself down. The work now is keeping it that way when life leans on you.' },
}

/* ── the four pillar reads — the deep layer, keyed by your LOUDEST pillar ──
   Beats map to read sections: love→"How you carry it", value→"What you're really
   after", triggers→"What sets it off", respond→"How you cope". Each beat has a
   `help` line; bodies may contain {SIT}/{BODY}/{REACH}. `accent` is the one-line
   nod used when this pillar is your SECOND-loudest. */
export const PILLAR_READ = {
  MIND: {
    glyph: Spiral,
    beats: {
      love: { body: "You notice everything. The tone of a text, the thing left unsaid, the detail nobody else clocked. The same mind that catches it all also replays it at 2am, hunting for the one piece you missed.", chips: ['catches every detail', 'replays it after', 'three thoughts deep', 'always scanning'], help: 'Kael catches the loop as you describe it and walks you back to what’s actually true right now.' },
      value: { body: "You just want the noise to stop. A mind that switches off when you tell it to, a night where the thoughts don’t follow you to bed. Quiet, the kind you can actually rest inside.", chips: ['a quiet mind', 'an off switch', 'rest that holds', 'a little certainty'], help: 'Kael becomes the place you set the thoughts down, so your head isn’t the only place they live.' },
      triggers: { body: "Anything left open sets it off. A vague reply, a decision unmade, a question hanging in the air. {SIT} is exactly the kind of thing that keeps the engine running.", chips: ['open loops', 'vague replies', 'the not-knowing', 'what-ifs'], help: 'Bring Kael the trigger in the moment and it helps you sort the real signal from the spiral.' },
      respond: { body: "So you think harder. You replay it, rehearse it, run every branch of what could go wrong and call it preparation. Mostly it just keeps the engine running and leaves you wrung out.", chips: ['overthinks it', 'runs every angle', 'rehearses the worst', 'never lands'], help: 'Kael helps you tell a real problem from a rehearsed one, before it costs you the night.' },
    },
    aspiration: 'Kael catches the spiral as you describe it and walks you back to what’s actually true right now.',
    compare: [
      { moment: 'A text sits unanswered for hours', without: 'You write six versions of what it means', withKael: 'Name the story your mind picked, then test it' },
      { moment: 'You’re wide awake at 2am', without: 'You replay the whole day on a loop', withKael: 'Park the loop somewhere outside your head' },
      { moment: 'A decision is left open', without: 'You run every branch until you’re drained', withKael: 'Sort the real risk from the rehearsed one' },
    ],
    accent: 'Your mind runs hot underneath it, replaying and rehearsing when you’d rather rest.',
  },

  ENERGY: {
    glyph: Flame,
    beats: {
      love: { body: "You carry a lot, quietly. You meet the load by doing more: push through the tired, answer the message, handle the thing. The crash comes later, in private, where no one has to see it.", chips: ['carries the load', 'pushes through', 'crashes in private', 'runs on reserves'], help: 'Kael helps you read the gauge before you hit empty, not after.' },
      value: { body: "Rest you don’t have to earn. Permission to stop without everything falling apart. You want to feel full again, not just functioning, and a day that doesn’t take everything you’ve got.", chips: ['rest without guilt', 'room to breathe', 'a full tank', 'to just stop'], help: 'Kael helps you find rest that doesn’t cost you anything, and take it before the crash.' },
      triggers: { body: "Stacked demands, and the quiet rule that slowing down isn’t allowed. {SIT} sits on top of a tank already low. Your body’s been keeping score: {BODY}.", chips: ['one more thing', 'no room to stop', 'rest feels earned', 'the full plate'], help: 'Kael tracks where the stress lands in your body and flags the dip early.' },
      respond: { body: "So you push through. You override the tiredness and keep going on fumes, and you call it strength. But running on empty was never strength. It’s a slow leak you’ve learned to ignore.", chips: ['overrides the tired', 'keeps going', 'ignores the signals', 'until the crash'], help: 'Kael remembers your week, so it knows when you’re slipping before you do.' },
    },
    aspiration: 'Kael helps you read the gauge before you hit empty, not after.',
    compare: [
      { moment: 'You’re wiped by midafternoon', without: 'You push on with caffeine and willpower', withKael: 'Name the dip and take a real ten minutes' },
      { moment: 'Someone asks for one more thing', without: 'You say yes before checking the tank', withKael: 'Pause, and answer from what you actually have' },
      { moment: 'A rare free evening', without: 'You fill it with errands, allow no rest', withKael: 'Protect one hour that asks nothing of you' },
    ],
    accent: 'And you’re running lower than you let on, closer to empty than you’ll admit.',
  },

  VOICE: {
    glyph: Scales,
    beats: {
      love: { body: "You replay your mistakes and skim past what went well. A compliment slides off, a small slip sticks for days. The scorecard stays open, and somehow you’re always a little behind on it.", chips: ['replays mistakes', 'discounts the wins', 'keeps score', 'always behind'], help: 'Kael helps you hear the critic as a voice, not a verdict, so you can answer it back.' },
      value: { body: "To finally feel like you’re enough. Not after the next achievement, just steady, allowed to be okay as you are. You want the bar to stop moving every single time you reach it.", chips: ['to be enough', 'a kinder voice', 'the bar to hold still', 'to ease up'], help: 'Kael remembers your wins, so it can show you the evidence the critic keeps deleting.' },
      triggers: { body: "Comparison, judgment, the fear of being seen as not enough. {SIT} tends to hand the critic its microphone, and it starts reading the list.", chips: ['comparison', 'a small mistake', 'being judged', 'the highlight reel'], help: 'When the voice gets loud, Kael helps you name it and weigh it against what’s real.' },
      respond: { body: "So you turn it on yourself first, harder than anyone else would, and tell yourself it keeps you sharp. But the harshness was never the thing that made you capable. You already were.", chips: ['criticizes first', 'raises the bar', 'never quite enough', 'runs on pressure'], help: 'Kael helps you build a steadier inner voice, the kind that pushes without punishing.' },
    },
    aspiration: 'Kael helps you hear the critic as a voice, not a verdict, so you can answer it back.',
    compare: [
      { moment: 'You make a small mistake at work', without: 'You replay it for the rest of the day', withKael: 'Weigh it at its real size, not the critic’s' },
      { moment: 'Someone gives you a compliment', without: 'You deflect it and find the flaw', withKael: 'Let it land before you argue with it' },
      { moment: 'You catch yourself comparing', without: 'You come up short and sit in it', withKael: 'Catch the unfair scorecard as it opens' },
    ],
    accent: 'And the inner critic is loud too, quicker to your faults than your wins.',
  },

  COPE: {
    glyph: Waves,
    beats: {
      love: { body: "You’re not avoiding your life, you’re managing a feeling no one taught you to sit with. When it rises, you reach for {REACH}. It works for a minute. That’s the trap.", chips: ['reaches for relief', 'quiets it fast', 'hard to sit still', 'feeling on mute'], help: 'Kael helps you catch the reach in the moment and stay with the feeling a beat longer.' },
      value: { body: "Relief that doesn’t cost you. A way to feel the hard stuff without it flattening you, and a little faith that you can handle a feeling without needing to escape it first.", chips: ['relief that lasts', 'to feel it safely', 'steadier ground', 'to handle it'], help: 'Kael is the steady hand, there the second the urge hits, not the morning after.' },
      triggers: { body: "The hard-to-name stuff, mostly. Stress, loneliness, a low you’d rather not look at. {SIT} is exactly what the reaching was built to numb.", chips: ['the nameless low', 'stress', 'loneliness', 'the urge hits'], help: 'Kael helps you find the feeling under the urge, which is where the real relief lives.' },
      respond: { body: "So you reach for {REACH}. It quiets things for a moment, then leaves you one step further from what you actually felt. The feeling waits for you. It always waits.", chips: ['numbs it', 'reaches on autopilot', 'quick relief', 'the feeling waits'], help: 'Kael remembers your triggers and your wins, so the next urge is one you’ve practiced for.' },
    },
    aspiration: 'Kael helps you catch the reach in the moment and stay with the feeling a beat longer.',
    compare: [
      { moment: 'A wave of stress hits', without: 'You’re scrolling before you notice you reached', withKael: 'Name the feeling before you reach for the phone' },
      { moment: 'A low, lonely evening', without: 'You numb it and feel emptier after', withKael: 'Sit with it two minutes and let it move' },
      { moment: 'You catch yourself reaching', without: 'You tell yourself it’s no big deal', withKael: 'Pause and ask what you’re actually feeling' },
    ],
    accent: 'And when it gets heavy, you tend to reach for something to take the edge off.',
  },
}

/* ── the instrument — four themed segments, 4 questions each ──
   Two multis double as personalization inputs: e4 (where stress lands → {BODY})
   and c4 (what you reach for → {REACH}). */
export const QUESTIONS = {
  /* Block 1 · Your mind */
  m1: { axis: 'MIND', kind: 'two', block: 1, weight: 1.5, prompt: 'Be honest. How’s your head most days?', options: [
    { name: 'Mostly busy and hard to quiet', pole: 'R', icon: Brain },
    { name: 'Mostly quiet and clear', pole: 'Q', icon: Feather },
  ] },
  m2: { axis: 'MIND', kind: 'slider', block: 1, weight: 1.0, prompt: 'How often do you replay a conversation after it’s over?',
    left: { name: 'Rarely', pole: 'Q' }, right: { name: 'Almost always', pole: 'R' } },
  m3: { axis: 'MIND', kind: 'statement', block: 1, weight: 1.0,
    statement: 'My brain won’t switch off when I’m trying to sleep.',
    left: { name: 'Not me', pole: 'Q' }, right: { name: 'Exactly me', pole: 'R' } },
  m4: { axis: 'MIND', kind: 'slider', block: 1, weight: 1.0, prompt: 'When something’s uncertain, how often does your mind jump to the worst case?',
    left: { name: 'Rarely', pole: 'Q' }, right: { name: 'Almost always', pole: 'R' } },

  /* Block 2 · Your energy (e4 multi → {BODY}) */
  e1: { axis: 'ENERGY', kind: 'two', block: 2, weight: 1.5, prompt: 'By the end of most days, you’re', options: [
    { name: 'Running on empty', pole: 'D', icon: Hourglass },
    { name: 'Still got something left', pole: 'S', icon: Sun },
  ] },
  e2: { axis: 'ENERGY', kind: 'slider', block: 2, weight: 1.5, prompt: 'How often do you feel drained before the day’s even begun?',
    left: { name: 'Rarely', pole: 'S' }, right: { name: 'Almost always', pole: 'D' } },
  e3: { axis: 'ENERGY', kind: 'statement', block: 2, weight: 1.5,
    statement: 'I push through until I crash.',
    left: { name: 'Not me', pole: 'S' }, right: { name: 'Exactly me', pole: 'D' } },
  e4: { axis: 'ENERGY', kind: 'multi', block: 2, max: 3, cols: 2, prompt: 'Where does stress show up in your body?',
    sub: 'Pick up to three. Your body keeps the score.', options: [
      { name: 'Tight chest', pole: 'D', icon: Heartbeat },
      { name: 'Restless sleep', pole: 'D', icon: Moon },
      { name: 'Jaw tension', pole: 'D', icon: Lightning },
      { name: 'Shallow breathing', pole: 'D', icon: Wind },
      { name: 'Low energy', pole: 'D', icon: BatteryLow },
      { name: 'A knot in my stomach', pole: 'D', icon: Waves },
    ] },

  /* Block 3 · Your inner voice */
  v1: { axis: 'VOICE', kind: 'two', block: 3, weight: 1.5, prompt: 'The voice in your head is usually', options: [
    { name: 'A tough critic', pole: 'H', icon: Lightning },
    { name: 'On your side', pole: 'K', icon: HandHeart },
  ] },
  v2: { axis: 'VOICE', kind: 'slider', block: 3, weight: 1.0, prompt: 'How often do you feel like you’re not quite enough?',
    left: { name: 'Rarely', pole: 'K' }, right: { name: 'Almost always', pole: 'H' } },
  v3: { axis: 'VOICE', kind: 'statement', block: 3, weight: 1.0,
    statement: 'I’m harder on myself than I’d ever be on a friend.',
    left: { name: 'Not me', pole: 'K' }, right: { name: 'Exactly me', pole: 'H' } },
  v4: { axis: 'VOICE', kind: 'slider', block: 3, weight: 1.0, prompt: 'How often does one small slip stick with you for days?',
    left: { name: 'Rarely', pole: 'K' }, right: { name: 'Almost always', pole: 'H' } },

  /* Block 4 · How you cope (c4 multi → {REACH}) */
  c1: { axis: 'COPE', kind: 'two', block: 4, weight: 1.5, prompt: 'When a feeling gets heavy, you', options: [
    { name: 'Reach for something to take the edge off', pole: 'N', icon: Waves },
    { name: 'Sit with it and let it pass', pole: 'F', icon: Anchor },
  ] },
  c2: { axis: 'COPE', kind: 'slider', block: 4, weight: 1.5, prompt: 'How often do you numb out instead of feeling it?',
    left: { name: 'Rarely', pole: 'F' }, right: { name: 'Almost always', pole: 'N' } },
  c3: { axis: 'COPE', kind: 'statement', block: 4, weight: 1.5,
    statement: 'I can sit with discomfort without needing to fix it right away.',
    left: { name: 'Not me', pole: 'N' }, right: { name: 'Exactly me', pole: 'F' } },
  /* what you reach for when it's heavy — OPTIONAL (pick none if you don't), feeds {REACH} */
  c4: { axis: 'COPE', kind: 'multi', block: 4, max: 3, cols: 2, prompt: 'When it gets heavy, what do you reach for?',
    sub: 'Pick any that fit, or none at all. No judgment, Kael’s seen them all.', options: [
      { name: 'Endless scrolling', pole: 'N', icon: Waveform, echo: 'the endless scroll' },
      { name: 'A drink or a smoke', pole: 'N', icon: Wine, echo: 'a drink' },
      { name: 'Burying it in work', pole: 'N', icon: StackSimple, echo: 'work' },
      { name: 'Zoning out', pole: 'N', icon: Moon, echo: 'zoning out' },
      { name: 'Keeping constantly busy', pole: 'N', icon: ArrowsClockwise, echo: 'staying busy' },
      { name: 'Shutting people out', pole: 'N', icon: Wind, echo: 'shutting people out' },
    ] },
}

export const QUIZ_IDS = ['m1', 'm2', 'm3', 'm4', 'e1', 'e2', 'e3', 'e4', 'v1', 'v2', 'v3', 'v4', 'c1', 'c2', 'c3', 'c4']

/* ── scoring ── */
const clampN = (n, lo, hi) => Math.max(lo, Math.min(hi, n))
const MULTI_W = 0.4
const SEED_W = 1.2
const TIE_EPS = 0.2 // |sum| at or under this reads as the healthy pole

function listToProse(items) {
  const a = items.filter(Boolean)
  if (!a.length) return ''
  if (a.length === 1) return a[0]
  if (a.length === 2) return `${a[0]} and ${a[1]}`
  return `${a.slice(0, -1).join(', ')}, and ${a[a.length - 1]}`
}

function gradedContribution(answers, qid, axis) {
  const a = answers[qid]
  if (!a || typeof a.value !== 'number') return 0
  const q = QUESTIONS[qid]
  const delta = ((a.value - 50) / 50) * (q.weight || 1)
  return q.right.pole === POSITIVE[axis] ? delta : -delta
}

function axisSum(answers, axis) {
  let sum = 0
  if (SIT_SEED[answers.situation] === axis) sum += SEED_W
  Object.entries(QUESTIONS).forEach(([qid, q]) => {
    const a = answers[qid]
    if (!a) return
    if (q.kind === 'two' && q.axis === axis && a.pole) {
      sum += (a.pole === POSITIVE[axis] ? 1 : -1) * (q.weight || 1)
    } else if ((q.kind === 'slider' || q.kind === 'statement') && q.axis === axis) {
      sum += gradedContribution(answers, qid, axis)
    } else if (q.kind === 'multi' && Array.isArray(a.picks)) {
      a.picks.forEach((p) => {
        const opt = q.options.find((o) => o.name === p.name)
        if (opt && opt.pole && POLE_AXIS[opt.pole] === axis) {
          sum += (opt.pole === POSITIVE[axis] ? 1 : -1) * MULTI_W
        }
      })
    }
  })
  return sum
}

const AXIS_MAX = (() => {
  const m = {}
  AXES.forEach((axis) => {
    let det = 0
    Object.values(QUESTIONS).forEach((q) => {
      if ((q.kind === 'two' || q.kind === 'slider' || q.kind === 'statement') && q.axis === axis) det += (q.weight || 1)
      // the optional e4/c4 multis are a personalization bonus on top, deliberately excluded
      // from the ceiling so every pillar normalizes off its mandatory questions alone
    })
    m[axis] = det + SEED_W * 0.5 + 0.6
  })
  return m
})()

export function resolve(answers = {}) {
  const axes = {}
  AXES.forEach((axis) => {
    const sum = axisSum(answers, axis)
    const pos = clampN(Math.round(50 + (sum / AXIS_MAX[axis]) * 50), 6, 96)
    const mag = Math.abs(sum)
    axes[axis] = { sum, pos, band: mag >= 2.4 ? 'strong' : mag >= 1.2 ? 'clear' : 'leaning' }
  })
  // 4-letter code: each pillar resolves to its symptom or healthy pole
  const code = AXES.map((a) => (axes[a].sum > TIE_EPS ? POSITIVE[a] : HEALTHY[a])).join('')
  // primary = the loudest pillar (highest position). On a pos tie, the pillar whose
  // anchor (the deliberate two-choice) landed on the symptom pole wins; then raw sum.
  const anchorSym = (axis) => (answers[ANCHOR[axis]] && answers[ANCHOR[axis]].pole === POSITIVE[axis] ? 1 : 0)
  const ranked = AXES.slice().sort((a, b) =>
    (axes[b].pos - axes[a].pos) || (anchorSym(b) - anchorSym(a)) || (axes[b].sum - axes[a].sum))
  return { code, primary: ranked[0], secondary: ranked[1], axes }
}

export function resolveRead(answers = {}) {
  const { code, primary, secondary, axes } = resolve(answers)
  const pat = PATTERNS[code] || PATTERNS.QSKF
  const pri = PILLAR_READ[primary] || PILLAR_READ.MIND
  const sec = PILLAR_READ[secondary]
  // a second pillar only earns an accent if it's genuinely present (not near-zero)
  const accent = sec && secondary && axes[secondary].sum > TIE_EPS ? sec.accent : null
  const read = {
    code, name: pat.name, essence: pat.essence, open: pat.open, glyph: pri.glyph,
    beats: pri.beats, aspiration: pri.aspiration, compare: pri.compare, accent,
  }
  const SIT = (answers.situationText || '').trim() || SIT_PHRASE[answers.situation] || 'what you walked in carrying'
  const bodyPicks = ((answers.e4 && answers.e4.picks) || []).map((p) => p.name.toLowerCase())
  const BODY = listToProse(bodyPicks) || 'the tension you carry'
  const reachOpts = QUESTIONS.c4.options
  const reachPicks = ((answers.c4 && answers.c4.picks) || [])
    .map((p) => { const o = reachOpts.find((x) => x.name === p.name); return o ? o.echo : null })
    .filter(Boolean)
  const REACH = listToProse(reachPicks) || 'something to take the edge off'
  return { code, primary, secondary, axes, read, phrases: { SIT, BODY, REACH } }
}

export function answeredCount(answers = {}) {
  return QUIZ_IDS.filter((id) => answers[id] != null).length
}

/* ── Act 1: what brings you in (state channel; seeds the result, never decides it) ── */
export const SITUATIONS = [
  { name: 'Overthinking everything', icon: Spiral, phrase: 'the overthinking' },
  { name: 'Stress and burnout', icon: Flame, phrase: 'the stress you’re carrying' },
  { name: 'Anxiety', icon: Wind, phrase: 'the anxiety' },
  { name: 'Being hard on myself', icon: Scales, phrase: 'how hard you are on yourself' },
  { name: 'Feeling low', icon: Moon, phrase: 'the low you’ve been in' },
  { name: 'A habit I want to change', icon: ArrowsClockwise, phrase: 'the habit' },
  { name: 'Something else', icon: Sparkle, phrase: 'what you’re carrying' },
]
export const SIT_PHRASE = Object.fromEntries(SITUATIONS.map((s) => [s.name, s.phrase]))
export const SITUATION_REFLECT = {
  'Overthinking everything': 'Spirals feel like thinking. Usually they’re feeling, looking for somewhere to land.',
  'Stress and burnout': 'You’re carrying a lot. Let’s look at what’s actually draining you.',
  'Anxiety': 'That low hum of dread. You’re in the right place for it.',
  'Being hard on myself': 'The inner critic is louder than it should be. We can turn it down.',
  'Feeling low': 'When everything feels heavy. We’ll take this gently.',
  'A habit I want to change': 'It takes something just to name it. No judgment here.',
  'Something else': 'Whatever it is, you do not have to carry it alone in your head anymore.',
}
const SIT_SEED = {
  'Overthinking everything': 'MIND',
  'Stress and burnout': 'ENERGY',
  'Anxiety': 'MIND',
  'Being hard on myself': 'VOICE',
  'Feeling low': 'VOICE',
  'A habit I want to change': 'COPE',
}

export const REL_CONTEXT = [
  { name: 'Work and pressure', icon: Lightning },
  { name: 'Relationships', icon: Heart },
  { name: 'Health and energy', icon: Anchor },
  { name: 'Just feeling off', icon: Wind },
  { name: 'A bit of everything', icon: ArrowsClockwise },
  { name: 'Not sure yet', icon: Moon },
]
export const AGES = ['18-24', '25-34', '35-44', '45-54', '55+']
export const GENDERS = [
  { name: 'Woman', icon: GenderFemale },
  { name: 'Man', icon: GenderMale },
  { name: 'Non-binary', icon: GenderNonbinary },
  { name: 'Prefer not to say', icon: Minus },
]

/* a forward-looking hope question, asked at the end of the quiz (non-scoring) */
export const GOALS = [
  { name: 'A calmer mind', icon: Wind },
  { name: 'Breaking the cycle', icon: ArrowsClockwise },
  { name: 'Being kinder to myself', icon: HandHeart },
  { name: 'Steadier energy', icon: Sun },
  { name: 'Feeling like myself again', icon: Sparkle },
  { name: 'Just some relief', icon: Heart },
]

/* the symptom inventory — naming what they want gone crystallizes the need the
   plan will answer. Generic and self-selectable; "Mostly just curious" is the out. */
export const ASPECTS = [
  { name: 'Racing thoughts', icon: Brain },
  { name: 'Overthinking', icon: Spiral },
  { name: 'Stress', icon: Lightning },
  { name: 'Low energy', icon: BatteryLow },
  { name: 'Feeling low', icon: CloudRain },
  { name: 'Trouble sleeping', icon: Moon },
  { name: 'Irritability', icon: Flame },
  { name: 'Mostly just curious', icon: Sparkle },
]

/* breathers — one per segment + a credibility beat. Two carry live widgets:
   breather 2 shows the tap-to-reply chat demo, breather 5 shows the method row. */
export const BREATHERS = {
  /* after block 1 · your mind */
  1: { kicker: 'Already, a shape', title: 'There’s a pattern in how your mind runs.', body: 'Not better, not worse. Just yours. Kael learns it so it can catch the spiral the moment it starts.', em: 'the moment it starts', icon: Ear },
  /* after block 2 · why Kael, not a chatbot (live demo) */
  2: { kicker: 'Why Kael, and not a chatbot', title: 'Kael hands you a way forward.', body: 'A blank chatbot waits for you to find the words. Kael offers a few to tap instead.', em: 'a few to tap', icon: ChatCircleDots, demo: true },
  /* after block 3 · your inner voice */
  3: { kicker: 'The honest part', title: 'That voice isn’t telling the truth.', body: 'It’s just loud, and it’s had years of practice. Kael helps you hear it as a voice, not a verdict.', em: 'a voice, not a verdict', icon: MagnifyingGlass },
  /* after block 4 · how you cope */
  4: { kicker: 'What it adds up to', title: 'However you cope, it made sense once.', body: 'Nothing here is a flaw. It’s how you learned to get through. From here, Kael helps you keep the relief and drop the cost.', em: 'keep the relief', icon: Heart },
  /* before the quiz · credibility (method row) */
  5: { kicker: 'The method', title: 'Built on what actually works.', body: 'Your answers run through CBT, ACT, and the methods clinicians actually use, never guesswork.', em: 'what actually works', icon: Scales, big: true, method: true },
}

export const CALIB_STEPS = [
  'Reading your answers',
  'Mapping how you cope',
  'Weighing what drains you',
  'Finding the thread underneath',
]
export const CALIB_REVIEWS = [
  'Felt like it actually knew me.',
  'I finally have words for it.',
  'Scarily accurate, in the best way.',
  'The first one that didn’t feel generic.',
]

/* progress eyebrow per segment */
export const QUIZ_EYEBROWS = {
  1: 'Your mind',
  2: 'Your energy',
  3: 'Your inner voice',
  4: 'How you cope',
}

/* ── the flow ── */
const single = (qid, block) => ({ id: qid, kind: 'single', act: 2, block, qid })
const two = (qid, block) => ({ id: qid, kind: 'two', act: 2, block, qid })
const slider = (qid, block) => ({ id: qid, kind: 'slider', act: 2, block, qid })
const statement = (qid, block) => ({ id: qid, kind: 'statement', act: 2, block, qid })
const multi = (qid, block) => ({ id: qid, kind: 'multi', act: 2, block, qid })
const breather = (n) => ({ id: 'br' + n, kind: 'breather', act: 2, n, cta: 'Continue' })

/* read section labels (genuine, pattern-framed) */
export const BEATS = [
  { bkey: 'love', label: 'How you carry it' },
  { bkey: 'value', label: 'What you’re after' },
  { bkey: 'triggers', label: 'What sets it off' },
  { bkey: 'respond', label: 'How you cope' },
]

export const FLOW = [
  /* ACT 1 · open + get to know you (identity up front, like V4) */
  { id: 'intro-meet', kind: 'intro', scene: 'safety', act: 1, cta: 'Continue' },
  { id: 'intro-moods', kind: 'intro', scene: 'recognition', act: 1, cta: 'Continue' },
  /* the mechanism, told up front — what it is → what you do → what compounds → what changes */
  { id: 'mechanism', kind: 'mechanism', act: 1, cta: 'Continue' },
  { id: 'intro-break', kind: 'intro', scene: 'hope', act: 1, cta: "Let's begin" },
  { id: 'situation', kind: 'situation', act: 1, field: 'situation', title: 'What brings you here?', sub: "Pick what's closest. We start there.", cta: 'Continue' },
  { id: 'situationText', kind: 'situationText', act: 1, field: 'situationText', title: 'Say it in your words.', sub: 'Whatever is on your mind right now. Keep it short.', placeholder: 'In a few words…', cta: 'Continue' },
  { id: 'hero', kind: 'hero', act: 1, title: "There's a logic to how you feel.", em: 'how you feel', sub: "A few honest minutes, and I'll show you how you handle stress, what sets you off, and the pattern underneath it.", cta: 'Show me' },
  { id: 'trust', kind: 'trust', act: 1, cta: 'I value my privacy' },
  /* identity up front, like V4 — right after the privacy promise, before the quiz */
  { id: 'name', kind: 'name', act: 1, field: 'name', title: 'What should Kael call you?', sub: 'So it can talk to you like a person, not a user.', placeholder: 'Your first name', cta: 'Continue' },
  { id: 'age', kind: 'age', act: 1, field: 'age', title: 'How old are you, {name}?', sub: 'Stress and mood shift across life stages. This keeps your read honest to yours.', cta: 'Continue' },
  { id: 'gender', kind: 'gender', act: 1, field: 'gender', title: 'How do you identify?', sub: 'So Kael speaks to you, not a generic template.', cta: 'Continue' },
  { id: 'relcontext', kind: 'relcontext', act: 1, field: 'rel', title: 'What’s weighing most right now?', sub: 'So Kael knows where to start.', cta: 'Continue' },
  { id: 'prep', kind: 'prep', act: 1, kicker: '16 patterns', title: "Let's find your pattern.", sub: 'A 3-minute quiz on how you feel, cope, talk to yourself, and recover.', cta: 'Start' },
  breather(5),

  /* ACT 2 · the quiz — four themed segments, a breather between each */
  two('m1', 1), slider('m2', 1), statement('m3', 1), slider('m4', 1),
  breather(1),
  two('e1', 2), slider('e2', 2), statement('e3', 2), multi('e4', 2),
  breather(2),
  two('v1', 3), slider('v2', 3), statement('v3', 3), slider('v4', 3),
  breather(3),
  two('c1', 4), slider('c2', 4), statement('c3', 4), multi('c4', 4),
  breather(4),

  /* a hopeful, forward-looking beat — names what they're working toward */
  { id: 'goals', kind: 'goals', act: 2, field: 'goal', title: 'What do you want to get out of this journey?', sub: 'Pick as many as feel true. Kael points everything toward them.', cta: 'Continue' },
  /* the pre-calibration ladder: problems → trust → commitment → permission,
     so the loader reads as building a plan from everything they just gave */
  { id: 'aspects', kind: 'aspects', act: 2, field: 'aspects', title: 'What’s been showing up lately?', sub: 'Choose all that apply.', cta: 'Continue' },
  { id: 'therapist', kind: 'therapist', act: 2, field: 'therapist', title: 'Did you hear about Kael from a therapist?', sub: 'Either way, you’re in the right place.' },
  { id: 'dailygoal', kind: 'dailygoal', act: 2, field: 'dailygoal', title: 'Set your daily goal.', sub: 'A few honest minutes is enough.' },
  { id: 'notif', kind: 'notif', act: 2, title: 'Want Kael to check in gently?', sub: 'A quiet nudge when it helps, nothing more.', cta: 'Yes, check in on me', alt: 'Not now' },
  { id: 'calibration', kind: 'calibration', act: 2, title: 'Finding your pattern.' },

  /* ACT 3 · the mirror — reveal, then the personalized read */
  { id: 'reveal', kind: 'reveal', act: 3 },
  { id: 'miniread', kind: 'miniread', act: 3, cta: 'This sounds like me' },

  /* ACT 4 · the close — ready, the difference, why it compounds, the signed
     promise, the celebration, then the transparent 7 days into the paywall */
  { id: 'ready', kind: 'ready', act: 4, cta: 'Continue' },
  { id: 'difference', kind: 'difference', act: 4, cta: 'I want that' },
  { id: 'promise', kind: 'promise', act: 4, cta: 'I commit to myself' },
  { id: 'allset', kind: 'allset', act: 4 },
  { id: 'thirtydays', kind: 'journey', act: 4, cta: 'Continue' },
]

/* derived from FLOW — single source of truth for the segmented progress bar. */
export const BLOCK_IDS = FLOW
  .filter((n) => n.qid && n.block)
  .reduce((m, n) => { (m[n.block] = m[n.block] || []).push(n.qid); return m }, {})
export const BLOCKS = Object.keys(BLOCK_IDS).map(Number).sort((a, b) => a - b)
