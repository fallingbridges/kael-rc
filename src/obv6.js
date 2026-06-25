/* ──────────────────────────────────────────────────────────────────────────
   Kael Onboarding V6 — the Emotional Archetype instrument (mental wellness).

   Built on V4's flow + read presentation (situation opener → 4-segment quiz with
   breathers → calibrate → reveal → axis-bar read → daily practice → paywall),
   but the instrument is rebuilt around the four wellness pillars:

     MIND     a mind that races / won't power down        (Quiet ↔ Racing)
     ENERGY   stress, depletion, running on empty          (Steady ↔ Running low)
     VOICE    the inner critic, never quite enough         (Kind ↔ Critical)
     COPE     how you handle the hard stuff                (Faces it ↔ Numbs it)

   The quiz is four themed segments (one pillar each, varied question types). The
   read is the dominant pillar → one of four archetypes, with all four pillars
   shown as axis bars. resolveRead(answers) → { primary, axes, read }.
   ────────────────────────────────────────────────────────────────────────── */
import {
  Spiral, Flame, Scales, Waves, Brain, Feather, Hourglass, Sun, Lightning,
  HandHeart, Anchor, Wind, Moon, ArrowsClockwise, Sparkle, Waveform, Wine,
  StackSimple, Heart, MagnifyingGlass, Ear, GenderFemale, GenderMale,
  GenderNonbinary, Minus,
} from '@phosphor-icons/react'

export const AXES = ['MIND', 'ENERGY', 'VOICE', 'COPE']
/* the symptom pole per axis — the named, right-hand end of each read bar */
export const POSITIVE = { MIND: 'R', ENERGY: 'D', VOICE: 'H', COPE: 'N' }
const POLE_AXIS = { R: 'MIND', Q: 'MIND', D: 'ENERGY', S: 'ENERGY', H: 'VOICE', K: 'VOICE', N: 'COPE', F: 'COPE' }

/* ── the four archetypes (one per dominant pillar) ──
   Each pays off recognition AND points at how Kael helps. Beats map to the read's
   sections: love→"How you carry it", value→"What you're really after",
   triggers→"What sets it off", respond→"How you cope". */
export const READS = {
  MIND: {
    name: 'The Spiral', glyph: Spiral,
    essence: 'A mind that catches everything, and can’t put it down.',
    beats: {
      love: { body: "You notice everything. The tone of a text, the thing left unsaid, the detail nobody else clocked. The same mind that catches it all also replays it at 2am, hunting for the one piece you missed.", chips: ['catches every detail', 'replays it after', 'three thoughts deep', 'always scanning'] },
      value: { body: "You just want the noise to stop. A mind that switches off when you tell it to, a night where the thoughts don’t follow you to bed. Quiet, the kind you can actually rest inside.", chips: ['a quiet mind', 'an off switch', 'rest that holds', 'a little certainty'] },
      triggers: { body: "Anything left open. A vague reply, a decision unmade, a question hanging in the air. The not-knowing feels unbearable, so your mind tries to think its way to safety. It never quite arrives.", chips: ['open loops', 'vague replies', 'the not-knowing', 'what-ifs'] },
      respond: { body: "So you think harder. You replay it, rehearse it, run every branch of what could go wrong and call it preparation. Mostly it just keeps the engine running and leaves you wrung out.", chips: ['overthinks it', 'runs every angle', 'rehearses the worst', 'never lands'] },
    },
    aspiration: 'Kael catches the spiral as you describe it and walks you back to what’s actually true right now.',
    shift: { withoutLabel: 'The 2am rerun', withLabel: 'You, setting it down' },
    compare: [
      { moment: 'A text sits unanswered for hours', without: 'You write six versions of what it means', withKael: 'Name the story your mind picked, then test it' },
      { moment: 'You’re wide awake at 2am', without: 'You replay the whole day on a loop', withKael: 'Park the loop somewhere outside your head' },
      { moment: 'A decision is left open', without: 'You run every branch until you’re drained', withKael: 'Sort the real risk from the rehearsed one' },
    ],
  },

  ENERGY: {
    name: 'The Ember', glyph: Flame,
    essence: 'Running on reserves, closer to empty than you let on.',
    beats: {
      love: { body: "You carry a lot, quietly. You meet the load by doing more: push through the tired, answer the message, handle the thing. The crash comes later, in private, where no one has to see it.", chips: ['carries the load', 'pushes through', 'crashes in private', 'runs on reserves'] },
      value: { body: "Rest you don’t have to earn. Permission to stop without everything falling apart. You want to feel full again, not just functioning, and a day that doesn’t take everything you’ve got.", chips: ['rest without guilt', 'room to breathe', 'a full tank', 'to just stop'] },
      triggers: { body: "Stacked demands, and the quiet rule that slowing down isn’t allowed. One more ask on top of an empty tank. Rest feels like something you have to deserve first, so you keep not taking it.", chips: ['one more thing', 'no room to stop', 'rest feels earned', 'the full plate'] },
      respond: { body: "So you push through. You override the tiredness and keep going on fumes, and you call it strength. But running on empty was never strength. It’s a slow leak you’ve learned to ignore.", chips: ['overrides the tired', 'keeps going', 'ignores the signals', 'until the crash'] },
    },
    aspiration: 'Kael helps you read the gauge before you hit empty, not after.',
    shift: { withoutLabel: 'Push through, then crash', withLabel: 'You, reading the gauge' },
    compare: [
      { moment: 'You’re wiped by midafternoon', without: 'You push on with caffeine and willpower', withKael: 'Name the dip and take a real ten minutes' },
      { moment: 'Someone asks for one more thing', without: 'You say yes before checking the tank', withKael: 'Pause, and answer from what you actually have' },
      { moment: 'A rare free evening', without: 'You fill it with errands, allow no rest', withKael: 'Protect one hour that asks nothing of you' },
    ],
  },

  VOICE: {
    name: 'The Perfectionist', glyph: Scales,
    essence: 'You hold yourself to a bar you’d set for no one else.',
    beats: {
      love: { body: "You replay your mistakes and skim past what went well. A compliment slides off, a small slip sticks for days. The scorecard stays open, and somehow you’re always a little behind on it.", chips: ['replays mistakes', 'discounts the wins', 'keeps score', 'always behind'] },
      value: { body: "To finally feel like you’re enough. Not after the next achievement, just steady, allowed to be okay as you are. You want the bar to stop moving every single time you reach it.", chips: ['to be enough', 'a kinder voice', 'the bar to hold still', 'to ease up'] },
      triggers: { body: "Comparison, judgment, the fear of being seen as not enough. Someone else’s highlight reel, a small mistake with witnesses. The voice grabs the microphone and starts reading the list.", chips: ['comparison', 'a small mistake', 'being judged', 'the highlight reel'] },
      respond: { body: "So you turn it on yourself first, harder than anyone else would, and tell yourself it keeps you sharp. But the harshness was never the thing that made you capable. You already were.", chips: ['criticizes first', 'raises the bar', 'never quite enough', 'runs on pressure'] },
    },
    aspiration: 'Kael helps you hear the critic as a voice, not a verdict, so you can answer it back.',
    shift: { withoutLabel: 'The open scorecard', withLabel: 'You, easing up' },
    compare: [
      { moment: 'You make a small mistake at work', without: 'You replay it for the rest of the day', withKael: 'Weigh it at its real size, not the critic’s' },
      { moment: 'Someone gives you a compliment', without: 'You deflect it and find the flaw', withKael: 'Let it land before you argue with it' },
      { moment: 'You catch yourself comparing', without: 'You come up short and sit in it', withKael: 'Catch the unfair scorecard as it opens' },
    ],
  },

  COPE: {
    name: 'The Escapist', glyph: Waves,
    essence: 'When it gets loud inside, you reach for the volume knob.',
    beats: {
      love: { body: "You’re not avoiding your life, you’re managing a feeling no one taught you to sit with. The scroll, the snack, the drink, the extra hour of work. They work for a minute. That’s the trap.", chips: ['reaches for relief', 'quiets it fast', 'hard to sit still', 'feeling on mute'] },
      value: { body: "Relief that doesn’t cost you. A way to feel the hard stuff without it flattening you, and a little faith that you can handle a feeling without needing to escape it first.", chips: ['relief that lasts', 'to feel it safely', 'steadier ground', 'to handle it'] },
      triggers: { body: "The hard-to-name stuff, mostly. Stress, loneliness, a low you’d rather not look at. The discomfort rises, and before you’ve even named it, you notice you’re already reaching.", chips: ['the nameless low', 'stress', 'loneliness', 'the urge hits'] },
      respond: { body: "So you reach for something. It quiets things for a moment, then leaves you one step further from what you actually felt. The feeling waits for you. It always waits.", chips: ['numbs it', 'reaches on autopilot', 'quick relief', 'the feeling waits'] },
    },
    aspiration: 'Kael helps you catch the reach in the moment and stay with the feeling a beat longer.',
    shift: { withoutLabel: 'Reach, then drift', withLabel: 'You, staying with it' },
    compare: [
      { moment: 'A wave of stress hits', without: 'You’re scrolling before you notice you reached', withKael: 'Name the feeling before you reach for the phone' },
      { moment: 'A low, lonely evening', without: 'You numb it and feel emptier after', withKael: 'Sit with it two minutes and let it move' },
      { moment: 'You catch yourself reaching', without: 'You tell yourself it’s no big deal', withKael: 'Pause and ask what you’re actually feeling' },
    ],
  },
}

/* ── the instrument — four themed segments, one pillar each ──
   `axis` = the pillar; `weight` sets diagnostic strength. Right-hand pole on
   sliders/statements is always the symptom pole. */
export const QUESTIONS = {
  /* Block 1 · Your mind */
  m1: { axis: 'MIND', kind: 'two', block: 1, weight: 1.5, prompt: 'Be honest. How’s your head most days?', options: [
    { name: 'Busy. Always three thoughts deep', pole: 'R', icon: Brain },
    { name: 'Mostly quiet and clear', pole: 'Q', icon: Feather },
  ] },
  m2: { axis: 'MIND', kind: 'slider', block: 1, weight: 1.0, prompt: 'How often do you replay a conversation after it’s over?',
    left: { name: 'Rarely', pole: 'Q' }, right: { name: 'Almost always', pole: 'R' } },
  m3: { axis: 'MIND', kind: 'statement', block: 1, weight: 1.0,
    statement: 'My brain won’t switch off when I’m trying to sleep.',
    left: { name: 'Not me', pole: 'Q' }, right: { name: 'Exactly me', pole: 'R' } },
  m4: { axis: 'MIND', kind: 'slider', block: 1, weight: 1.0, prompt: 'When something’s uncertain, how often does your mind jump to the worst case?',
    left: { name: 'Rarely', pole: 'Q' }, right: { name: 'Almost always', pole: 'R' } },

  /* Block 2 · Your energy */
  e1: { axis: 'ENERGY', kind: 'two', block: 2, weight: 1.5, prompt: 'By the end of most days, you’re', options: [
    { name: 'Running on empty', pole: 'D', icon: Hourglass },
    { name: 'Still got something left', pole: 'S', icon: Sun },
  ] },
  e2: { axis: 'ENERGY', kind: 'slider', block: 2, weight: 1.0, prompt: 'How often do you feel drained before the day’s even begun?',
    left: { name: 'Rarely', pole: 'S' }, right: { name: 'Almost always', pole: 'D' } },
  e3: { axis: 'ENERGY', kind: 'statement', block: 2, weight: 1.0,
    statement: 'I push through until I crash.',
    left: { name: 'Not me', pole: 'S' }, right: { name: 'Exactly me', pole: 'D' } },
  e4: { axis: 'ENERGY', kind: 'statement', block: 2, weight: 1.0,
    statement: 'Rest feels like something I have to earn first.',
    left: { name: 'Not me', pole: 'S' }, right: { name: 'Exactly me', pole: 'D' } },

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

  /* Block 4 · How you cope */
  c1: { axis: 'COPE', kind: 'two', block: 4, weight: 1.5, prompt: 'When a feeling gets heavy, you', options: [
    { name: 'Reach for something to take the edge off', pole: 'N', icon: Waves },
    { name: 'Sit with it and let it pass', pole: 'F', icon: Anchor },
  ] },
  c2: { axis: 'COPE', kind: 'slider', block: 4, weight: 1.0, prompt: 'How often do you numb out instead of feeling it?',
    left: { name: 'Rarely', pole: 'F' }, right: { name: 'Almost always', pole: 'N' } },
  c3: { axis: 'COPE', kind: 'statement', block: 4, weight: 1.0,
    statement: 'I’d rather distract myself than sit with a hard feeling.',
    left: { name: 'Not me', pole: 'F' }, right: { name: 'Exactly me', pole: 'N' } },
  c4: { axis: 'COPE', kind: 'multi', block: 4, max: 3, cols: 2, prompt: 'When it gets heavy, what do you reach for?',
    sub: 'Pick up to three. No judgment, Kael’s seen them all.', options: [
      { name: 'Endless scrolling', pole: 'N', icon: Waveform },
      { name: 'A drink or a smoke', pole: 'N', icon: Wine },
      { name: 'Burying it in work', pole: 'N', icon: StackSimple },
      { name: 'Zoning out', pole: 'N', icon: Moon },
      { name: 'Keeping constantly busy', pole: 'N', icon: ArrowsClockwise },
      { name: 'Shutting people out', pole: 'N', icon: Wind },
    ] },
}

export const QUIZ_IDS = ['m1', 'm2', 'm3', 'm4', 'e1', 'e2', 'e3', 'e4', 'v1', 'v2', 'v3', 'v4', 'c1', 'c2', 'c3', 'c4']

/* ── scoring ──
   Each pillar scores from its own three questions; the opener seeds a small nudge
   toward the pillar it names (state → result continuity). Dominant pillar = the
   archetype; all four positions drive the read's bars. */
const clampN = (n, lo, hi) => Math.max(lo, Math.min(hi, n))
const MULTI_W = 0.4
const SEED_W = 1.2

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
    } else if (q.kind === 'multi' && q.axis === axis && Array.isArray(a.picks)) {
      sum += a.picks.length * MULTI_W // each numbing behaviour nudges Cope up
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
      if (q.kind === 'multi' && q.axis === axis) det += (q.max || 3) * MULTI_W
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
  let primary = AXES[0]
  AXES.forEach((axis) => { if (axes[axis].pos > axes[primary].pos) primary = axis })
  const ranked = AXES.slice().sort((a, b) => axes[b].pos - axes[a].pos)
  return { primary, secondary: ranked[1], axes }
}

export function resolveRead(answers = {}) {
  const { primary, secondary, axes } = resolve(answers)
  return { primary, secondary, axes, read: READS[primary] || READS.MIND }
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
/* the opener nudges the result toward the pillar it names */
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

/* breathers — one per segment, each tied to the pillar it just covered:
   acknowledge, build hope, sell one facet of Kael. `em` = italic phrase. */
export const BREATHERS = {
  /* after block 1 · your mind */
  1: { kicker: 'Already, a shape', title: 'There’s a pattern in how your mind runs.', body: 'Not better, not worse. Just yours. Kael learns it so it can catch the spiral the moment it starts.', em: 'the moment it starts', icon: Ear },
  /* after block 2 · your energy */
  2: { kicker: 'A small truth', title: 'Running low isn’t a character flaw.', body: 'You’ve been carrying more than you let on. Naming it is the first place the load gets lighter.', em: 'the load gets lighter', icon: Wind },
  /* after block 3 · your inner voice */
  3: { kicker: 'The honest part', title: 'That voice isn’t telling the truth.', body: 'It’s just loud, and it’s had years of practice. Kael helps you hear it as a voice, not a verdict.', em: 'a voice, not a verdict', icon: MagnifyingGlass },
  /* after block 4 · how you cope */
  4: { kicker: 'What it adds up to', title: 'However you cope, it made sense once.', body: 'Nothing here is a flaw. It’s how you learned to get through. From here, Kael helps you keep the relief and drop the cost.', em: 'keep the relief', icon: Heart },
  /* before the result · credibility */
  5: { kicker: 'The method', title: 'This isn’t a personality quiz.', body: 'Your answers run through CBT, ACT, and the methods clinicians actually use, never guesswork.', em: 'methods clinicians actually use', icon: Scales, big: true },
}

export const CALIB_STEPS = [
  'Reading your answers',
  'Mapping how you cope',
  'Weighing what drains you',
  'Putting it into words',
]
export const CALIB_REVIEWS = [
  'Felt like it actually knew me.',
  'I finally have words for it.',
  'Scarily accurate, in the best way.',
  'The first one that didn’t feel generic.',
]

/* progress eyebrow per segment — names the pillar Kael is reading */
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

/* the read beats — the carousel/sections step through these */
export const BEATS = [
  { bkey: 'love', label: 'How you carry it' },
  { bkey: 'value', label: 'What you’re after' },
  { bkey: 'triggers', label: 'What sets it off' },
  { bkey: 'respond', label: 'How you cope' },
]

export const FLOW = [
  /* ACT 1 · open + get to know you */
  { id: 'welcome', kind: 'welcome', act: 1, title: 'You showed up. That is the first move.', sub: "Most people sit with this alone for years. You just chose not to, so let's make sense of how you carry it.", subEm: 'how you carry it', cta: 'Begin' },
  { id: 'situation', kind: 'situation', act: 1, field: 'situation', title: 'What brings you here?', sub: "Pick what's closest. We start there.", cta: 'Continue' },
  { id: 'situationText', kind: 'situationText', act: 1, field: 'situationText', title: 'Say it in your words.', sub: 'Whatever is on your mind right now. Keep it short.', placeholder: 'In a few words…', cta: 'Continue' },
  { id: 'hero', kind: 'hero', act: 1, title: "There's a logic to how you feel.", em: 'how you feel', sub: "A few honest minutes, and I'll show you how you handle stress, what sets you off, and the pattern underneath it.", cta: 'Show me' },
  { id: 'trust', kind: 'trust', act: 1, cta: 'I value my privacy' },
  { id: 'name', kind: 'name', act: 1, field: 'name', title: 'What should Kael call you?', sub: 'Stays between us, only used to sharpen your read.', placeholder: 'Your first name', cta: 'Continue' },
  { id: 'age', kind: 'age', act: 1, field: 'age', title: 'How old are you, {name}?', sub: 'Stress and mood shift across life stages. This keeps your read honest to yours.', cta: 'Continue' },
  { id: 'gender', kind: 'gender', act: 1, field: 'gender', title: 'How do you identify?', sub: 'So Kael speaks to you, not a generic template.', cta: 'Continue' },
  { id: 'relcontext', kind: 'relcontext', act: 1, field: 'rel', title: 'What’s weighing most right now?', sub: 'So Kael knows where to start.', cta: 'Continue' },
  { id: 'prep', kind: 'prep', act: 1, title: "Let's find your emotional archetype.", sub: 'A 3-minute read on how you feel, cope, talk to yourself, and recover.', cta: 'Start' },
  breather(5),

  /* ACT 2 · the quiz — four themed segments, a breather between each */
  two('m1', 1), slider('m2', 1), statement('m3', 1), slider('m4', 1),
  breather(1),
  two('e1', 2), slider('e2', 2), statement('e3', 2), statement('e4', 2),
  breather(2),
  two('v1', 3), slider('v2', 3), statement('v3', 3), slider('v4', 3),
  breather(3),
  two('c1', 4), slider('c2', 4), statement('c3', 4), multi('c4', 4),
  breather(4),

  { id: 'notif', kind: 'notif', act: 2, title: 'Want Kael to check in gently?', sub: 'A quiet nudge when it helps, nothing more.', cta: 'Yes, check in on me', alt: 'Not now' },
  { id: 'calibration', kind: 'calibration', act: 2, title: 'Finding your archetype.' },

  /* ACT 3 · the mirror — reveal, then the read */
  { id: 'reveal', kind: 'reveal', act: 3 },
  { id: 'miniread', kind: 'miniread', act: 3, cta: 'This sounds like me' },
  { id: 'fullread', kind: 'fullread', act: 3, cta: 'Continue' },

  /* ACT 4 · sell — the daily practice, Kael is ready, the 30-day journey, the paywall */
  { id: 'dailyloop', kind: 'dailyloop', act: 4, cta: 'I’m in' },
  { id: 'ready', kind: 'ready', act: 4, cta: 'See my 30 days' },
  { id: 'thirtydays', kind: 'thirtydays', act: 4, cta: 'See my plan' },
  { id: 'paywall', kind: 'paywall', act: 4 },
]

/* derived from FLOW — single source of truth for the segmented progress bar. */
export const BLOCK_IDS = FLOW
  .filter((n) => n.qid && n.block)
  .reduce((m, n) => { (m[n.block] = m[n.block] || []).push(n.qid); return m }, {})
export const BLOCKS = Object.keys(BLOCK_IDS).map(Number).sort((a, b) => a - b)
