/* ──────────────────────────────────────────────────────────────────────────
   Kael Onboarding V3 — the Love Archetype diagnostic engine.

   Four love-specific axes, scored obliquely (the user never sees them):
     Closeness   Close (C)  / Free (F)
     Attunement  Attuned(A) / Settled (S)
     Expression  Express(E) / Reserved (R)
     Purpose     Growth (G) / Harmony (H)
   Code order is C-A-E-P, e.g. CSEH. The 16 reads mirror ARCHETYPES.md.
   Spec: ONBOARDING_V3_SPEC.md. Screen flow lives in screens/OnboardingV3.jsx.
   ────────────────────────────────────────────────────────────────────────── */
import {
  Waves, Flame, Anchor, Plant, Heart, FireSimple, Feather, Key, Sun, Compass,
  Lighthouse, MapTrifold, Bird, Lightning, Shield, Spiral,
  Wind, ArrowsClockwise, Sparkle,
  ChatCircleText, SunHorizon, ChartLineUp, BookOpen,
} from '@phosphor-icons/react'

/* ── the 16 archetypes (free mini-read content) ── */
export const ARCHETYPES = {
  CSEH: {
    code: 'CSEH', name: 'The Harbor', glyph: Waves,
    essence: 'The safe place love comes home to.',
    opening: "You love out loud, and you mostly trust the love is returned. You turn the relationship into calm water, the place people come back to when the sea won't settle.",
    fear: 'The chill. A partner going quiet or flat reads to you as weather moving in.',
    need: 'To know the warmth you give is felt, without having to ask for proof.',
    conflict: 'You smooth it over fast, sometimes before the hard thing has been said.',
    misread: "You read a partner's quiet as a storm coming, when often it is just quiet.",
    helps: 'Letting a little tension stay long enough to be honest about it.',
    growth: 'the Harbor who can let the water get rough and trust it will settle.',
  },
  CSEG: {
    code: 'CSEG', name: 'The Kindler', glyph: Flame,
    essence: 'All in, and always reaching for more.',
    opening: "You want closeness and you say so plainly. Your eyes are always forward: where is this going, who are we becoming, what could we be.",
    fear: 'Stagnation. A flat, comfortable relationship unsettles you more than a hard one.',
    need: 'A partner who wants to grow alongside you, not just rest.',
    conflict: 'You turn toward it, name it, and want to work it out tonight, together.',
    misread: "You read a partner's contentment as settling.",
    helps: 'Learning that rest is not decay, and a partner allowed to simply be is its own depth.',
    growth: 'the Kindler who can stoke the fire without smothering it with too much air.',
  },
  CSRH: {
    code: 'CSRH', name: 'The Anchor', glyph: Anchor,
    essence: 'Love proven in the doing.',
    opening: "You show love by being there, not by announcing it. You are the steady one, calm when everything else isn't, present without making a show of it.",
    fear: 'Upheaval. Drama and a partner who needs constant verbal proof exhaust you.',
    need: 'To be trusted as present, without having to keep performing it.',
    conflict: 'You lower the temperature and let your actions speak.',
    misread: 'You assume your steadiness is obvious. To the wrong partner it can feel like being roomed with rather than chosen.',
    helps: 'Saying the thing out loud, even when it feels redundant to you.',
    growth: 'the Anchor who learns that words are not weakness, they are translation.',
  },
  CSRG: {
    code: 'CSRG', name: 'The Cultivator', glyph: Plant,
    essence: 'Building something deep, quietly.',
    opening: "You build the relationship like a long project: depth, growth, a thing that compounds over years. You would rather demonstrate the change than narrate it.",
    fear: 'Shallowness. A bond that stays on the surface and never roots.',
    need: 'To be seen tending the garden, not just judged on the harvest.',
    conflict: 'You go inward, think it through, and come back with something built.',
    misread: 'Your partner may not know the cultivation is happening at all.',
    helps: 'Letting a partner watch the work in progress, not just the result.',
    growth: 'the Cultivator who shows the garden while it is still growing.',
  },
  CAEH: {
    code: 'CAEH', name: 'The Devoted', glyph: Heart,
    essence: 'Love given generously, and felt deeply.',
    opening: "Closeness is everything to you, and you read the bond constantly. When you sense distance you reach, you give, you reassure, you ask.",
    fear: "Being left, or the slow drift apart you don't notice until it is too late.",
    need: 'Reassurance that the bond is safe, again and again.',
    conflict: 'You move toward, you ask "are we okay," you smooth the edge before it becomes a rift.',
    misread: 'You read calm as a problem to solve, when sometimes it is just calm.',
    helps: 'Sitting in a quiet moment without reading it as a warning.',
    growth: 'the Devoted who lets the reassurance start to come from inside.',
  },
  CAEG: {
    code: 'CAEG', name: 'The Wildheart', glyph: FireSimple,
    essence: 'Love as a great, burning unfolding.',
    opening: "You run hot. You want closeness, intensity, transformation, and you feel the relationship's pulse at every moment.",
    fear: 'Distance, and a second fear most types do not have: comfort. Calm can read to you as cold.',
    need: 'To feel the relationship is alive, not only stable.',
    conflict: 'You flood. You reach with bids, name every feeling, chase the intensity back.',
    misread: 'You mistake peace for the absence of love.',
    helps: 'Learning that the early fire becoming steady warmth is depth, not loss.',
    growth: 'the Wildheart who can let a quiet stretch feel safe instead of like a goodbye.',
  },
  CARH: {
    code: 'CARH', name: 'The Peacekeeper', glyph: Feather,
    essence: 'Tending the bond, invisibly.',
    opening: "You watch the bond closely and tend it quietly. You absorb the small tensions before they grow, all without making it visible.",
    fear: 'Rupture. The bond cracking.',
    need: 'For your own needs to matter without you having to fight for them.',
    conflict: 'You go quiet, you adapt, you make yourself easy.',
    misread: 'Your partner has no idea a bill is accumulating until it arrives all at once.',
    helps: 'Voicing a small need early, before it becomes a buried pile.',
    growth: 'the Peacekeeper who learns peace bought with your silence is debt, not peace.',
  },
  CARG: {
    code: 'CARG', name: 'The Confidant', glyph: Key,
    essence: 'A whole world, opened slowly to a few.',
    opening: "You feel everything deeply and let almost no one all the way in. You want a real meeting of two interiors, and you will not fake it for anyone.",
    fear: 'Being known shallowly, or trusting the wrong person with the real you.',
    need: 'To be fully known by someone who earned it.',
    conflict: 'You withdraw to process, go deep alone, and return when you have decided it is safe.',
    misread: 'A partner can feel at a locked door, sensing a world inside but never invited in.',
    helps: 'Being seen before you are certain it is safe.',
    growth: 'the Confidant who learns vulnerability comes first, and trust is built after it.',
  },
  FSEH: {
    code: 'FSEH', name: 'The Kindred', glyph: Sun,
    essence: 'Warm, open, and wholly yourself.',
    opening: "You are warm and entirely yourself, with or without a partner. You like closeness but you do not need to merge to feel loved.",
    fear: 'Engulfment. A partner who wants all of you, all the time.',
    need: 'Room to stay yourself while still being close.',
    conflict: 'You stay friendly but protect your space, keeping things pleasant over going deep.',
    misread: 'Your ease can read, from the outside, as not caring.',
    helps: 'Letting someone matter to you, visibly, on purpose.',
    growth: 'the Kindred who learns a little dependence offered on purpose is a gift, not a cage.',
  },
  FSEG: {
    code: 'FSEG', name: 'The Voyager', glyph: Compass,
    essence: 'Two people growing on parallel adventures.',
    opening: "Independence is your baseline and you point your energy outward and forward: experiences, expansion, two people becoming bigger, together.",
    fear: 'Being tied down, a relationship that shrinks your world rather than widening it.',
    need: 'A partner who grows alongside you, not one who needs you.',
    conflict: 'You would rather grow past it than sit in it.',
    misread: 'A partner can wonder if the relationship is enough for you, or just one more thing in a full life.',
    helps: 'Seeing that staying still with one person can be its own adventure.',
    growth: 'the Voyager who lets a partner be a destination, not just a stop.',
  },
  FSRH: {
    code: 'FSRH', name: 'The Lighthouse', glyph: Lighthouse,
    essence: 'A fixed point, always where you said.',
    opening: "You are reliable, present, and undemanding, and you assume that speaks for itself. You stand steady and trust the steadiness is felt.",
    fear: "Being needed too much, smothered by someone's emotional demands.",
    need: 'To love without being asked to constantly prove it.',
    conflict: 'You provide steadiness and assume the steadiness is received.',
    misread: 'Absence of conflict is not the same as intimacy. A partner can feel alone in the same room.',
    helps: 'Turning the light toward them, not just keeping it on.',
    growth: 'the Lighthouse who learns steadiness is the foundation, not the whole house.',
  },
  FSRG: {
    code: 'FSRG', name: 'The Cartographer', glyph: MapTrifold,
    essence: 'Charting the path, quietly, on your terms.',
    opening: "You map the relationship's direction privately and move deliberately. You would rather chart the path than talk it through.",
    fear: 'Being trapped in something directionless, or having your autonomy managed away.',
    need: 'A shared direction that you helped set.',
    conflict: 'You go quiet, set a course internally, and execute it.',
    misread: 'You arrive at decisions alone and present them as settled. A partner feels handed a map, not consulted.',
    helps: 'Planning out loud, together, where the planning itself is the intimacy.',
    growth: 'the Cartographer who draws the route with a partner, not for them.',
  },
  FAEH: {
    code: 'FAEH', name: 'The Wanderer', glyph: Bird,
    essence: 'Pulled toward closeness and freedom at once.',
    opening: "You want room and you want closeness, and you feel the pull of both at the same time, which makes you hard to pin down even for yourself.",
    fear: 'Both directions. Too much distance frightens you, and so does too much closeness.',
    need: "A rhythm of closeness and space that you don't have to hide.",
    conflict: 'You reach when you feel far, retreat when you feel crowded, and smooth over the whiplash.',
    misread: "A partner can't tell which version of you they will get.",
    helps: 'Naming the pull out loud instead of making them decode it.',
    growth: 'the Wanderer who shares the rhythm instead of hiding it.',
  },
  FAEG: {
    code: 'FAEG', name: 'The Tempest', glyph: Lightning,
    essence: 'Hot, alive, and on your own terms.',
    opening: "You need freedom, you read the bond intensely, and you push hard for depth and change, all while refusing to be contained.",
    fear: 'Being controlled, and being bored by something tame.',
    need: 'To be deeply met and still have the door left open.',
    conflict: 'You push, you provoke, you turn toward intensity, and you bolt the moment it feels like a cage.',
    misread: 'You mistake the feeling of being held for the feeling of being trapped.',
    helps: 'Seeing that commitment chosen freely is freedom aimed at something.',
    growth: 'the Tempest who can stay when nothing is forcing them to.',
  },
  FARH: {
    code: 'FARH', name: 'The Sentinel', glyph: Shield,
    essence: 'Self-contained, and quietly watching everything.',
    opening: "You need space and you read the bond closely underneath, but you don't show it. You hold yourself apart to keep the peace, even as part of you watches everything.",
    fear: "Being smothered, and quietly, being forgotten, though you'd never admit the second one.",
    need: 'To be wanted without being engulfed.',
    conflict: 'You withdraw, go quiet, manage your needs alone, and present a calm surface.',
    misread: 'A partner takes your distance at face value and gives you space, and then you feel the absence you feared.',
    helps: 'Letting a partner see the part of you that watches and cares.',
    growth: "the Sentinel who learns that protected feelings, never voiced, can't be met.",
  },
  FARG: {
    code: 'FARG', name: 'The Alchemist', glyph: Spiral,
    essence: 'Love as a crucible that changes you at the root.',
    opening: "You crave transformation and deep connection, you read the bond constantly, but you need space and you guard your interior fiercely.",
    fear: 'The hardest one: both being engulfed and being abandoned, so closeness feels dangerous from both sides.',
    need: 'To be profoundly known without losing yourself.',
    conflict: 'You go deep alone, reach for intensity, then retreat from it when it gets too real.',
    misread: 'You romanticize depth while avoiding the ordinary vulnerability that builds it.',
    helps: 'Letting the transformation happen in staying, not in pulling close and away.',
    growth: 'the Alchemist who learns the crucible is consistency.',
  },
}

export const ARCHETYPE_CODES = Object.keys(ARCHETYPES)

/* ── the scored questions (18 beats). Poles map to axes, never shown. ── */
export const QUESTIONS = {
  c1: { axis: 'CF', prompt: 'Your partner wants the whole weekend together, just the two of you. Your honest first feeling is:', options: [
    { name: 'Perfect. Yes please.', pole: 'C', w: 2 },
    { name: "Lovely, though I'd want a few hours to myself in there.", pole: 'F', w: 1 },
    { name: 'A little trapped, even though I love them.', pole: 'F', w: 2 },
  ] },
  c2: { axis: 'CF', prompt: 'When things are good with someone, you want to:', options: [
    { name: 'Weave them into everyday life, talk often, share the small stuff.', pole: 'C', w: 1 },
    { name: 'Keep your own world full and let them be part of it.', pole: 'F', w: 1 },
  ] },
  c3: { axis: 'CF', prompt: 'Your idea of a perfect ordinary evening together:', options: [
    { name: 'Curled up close, no plans, just us.', pole: 'C', w: 2 },
    { name: 'Same room, each doing our own thing.', pole: 'F', w: 1 },
    { name: 'Honestly, some evenings I would rather have to myself.', pole: 'F', w: 2 },
  ] },
  c4: { axis: 'CF', prompt: "When you haven't had alone time in a while, you feel:", options: [
    { name: 'Fine. I recharge with them.', pole: 'C', w: 1 },
    { name: 'Restless, like I need to come back to myself.', pole: 'F', w: 1 },
  ] },

  a1: { axis: 'AS', prompt: 'They reply "k." to a long, warm text. You:', options: [
    { name: 'Immediately wonder what is wrong.', pole: 'A', w: 1 },
    { name: 'Barely notice. They are probably busy.', pole: 'S', w: 1 },
  ] },
  a2: { axis: 'AS', prompt: 'How often do you find yourself reading their tone for how the relationship is doing?', options: [
    { name: 'Constantly. I catch the small shifts.', pole: 'A', w: 1 },
    { name: 'Rarely. I assume we are good unless told otherwise.', pole: 'S', w: 1 },
  ] },
  a3: { axis: 'AS', prompt: 'When something feels slightly off between you, you usually:', options: [
    { name: 'Notice it before they say anything.', pole: 'A', w: 1 },
    { name: "Don't clock it until they bring it up.", pole: 'S', w: 1 },
  ] },
  a4: { axis: 'AS', prompt: 'After a good date, on the way home you are:', options: [
    { name: 'Replaying moments, reading what they meant.', pole: 'A', w: 1 },
    { name: 'Just happy. Not analyzing.', pole: 'S', w: 1 },
  ] },

  e1: { axis: 'ER', prompt: 'Love comes out of you most naturally as:', options: [
    { name: 'Words, affection, saying how I feel.', pole: 'E', w: 1 },
    { name: 'Showing up, doing things, steady presence.', pole: 'R', w: 1 },
  ] },
  e2: { axis: 'ER', prompt: 'When you are really into someone, they know because:', options: [
    { name: 'I tell them and show them, often.', pole: 'E', w: 1 },
    { name: 'I am consistent and reliable. They feel it.', pole: 'R', w: 1 },
  ] },
  e3: { axis: 'ER', prompt: 'Hard feelings about the relationship, you tend to:', options: [
    { name: 'Say them out loud. I process by talking.', pole: 'E', w: 1 },
    { name: 'Sit with them privately first.', pole: 'R', w: 1 },
  ] },
  e4: { axis: 'ER', prompt: 'In a tense moment, your instinct is to:', options: [
    { name: 'Talk it through right now.', pole: 'E', w: 1 },
    { name: 'Go quiet and steady until it settles.', pole: 'R', w: 1 },
  ] },

  p1: { axis: 'GH', prompt: 'Deep down, the best relationship is one that:', options: [
    { name: 'Pushes me to grow and become more.', pole: 'G', w: 1 },
    { name: 'Feels like peace, safety, home.', pole: 'H', w: 1 },
  ] },
  p2: { axis: 'GH', prompt: 'A relationship that stays comfortable and stable for years sounds:', options: [
    { name: 'A little stagnant. I would want more depth.', pole: 'G', w: 1 },
    { name: 'Wonderful. That is the goal.', pole: 'H', w: 1 },
  ] },
  p3: { axis: 'GH', prompt: 'You feel most loved when a partner:', options: [
    { name: 'Challenges me and grows with me.', pole: 'G', w: 1 },
    { name: 'Soothes me and makes life feel calm.', pole: 'H', w: 1 },
  ] },
  p4: { axis: 'GH', prompt: 'Conflict, honestly, is:', options: [
    { name: 'Sometimes how two people go deeper.', pole: 'G', w: 1 },
    { name: 'Something to resolve fast so we can get back to peace.', pole: 'H', w: 1 },
  ] },

  /* tiebreakers — extra Purpose signal for the reserved pairs */
  t1: { axis: 'GH', prompt: 'If you had to choose for your relationship:', options: [
    { name: 'A little friction that keeps us evolving.', pole: 'G', w: 2 },
    { name: 'Steady calm, even if it gets predictable.', pole: 'H', w: 2 },
  ] },
  t2: { axis: 'GH', prompt: 'Five years in, success looks like:', options: [
    { name: 'We have both changed because of this.', pole: 'G', w: 2 },
    { name: 'We have built something safe and unshakeable.', pole: 'H', w: 2 },
  ] },
}

const POLE_AXIS = { C: 'CF', F: 'CF', A: 'AS', S: 'AS', E: 'ER', R: 'ER', G: 'GH', H: 'GH' }
const POSITIVE = { CF: 'C', AS: 'A', ER: 'E', GH: 'G' }

/* Sum signed weights per axis from the picked options. */
export function scoreAxes(answers) {
  const sum = { CF: 0, AS: 0, ER: 0, GH: 0 }
  Object.entries(answers || {}).forEach(([qid, opt]) => {
    const q = QUESTIONS[qid]
    if (!q || !opt || !opt.pole) return
    const axis = POLE_AXIS[opt.pole]
    if (!axis) return
    const dir = opt.pole === POSITIVE[axis] ? 1 : -1
    sum[axis] += dir * (opt.w || 1)
  })
  return sum
}

/* Axis sums → 4-letter code. Purpose ties default to Harmony (see spec §9). */
export function resolveCode(answers) {
  const s = scoreAxes(answers)
  return (
    (s.CF >= 0 ? 'C' : 'F') +
    (s.AS >= 0 ? 'A' : 'S') +
    (s.ER >= 0 ? 'E' : 'R') +
    (s.GH > 0 ? 'G' : 'H')
  )
}

export function resolveArchetype(answers) {
  return ARCHETYPES[resolveCode(answers)] || ARCHETYPES.CSEH
}

/* answered count, for the live progress bar */
export const QUIZ_IDS = ['c1','c2','c3','c4','a1','a2','a3','a4','e1','e2','e3','e4','p1','p2','p3','p4','t1','t2']
export function answeredCount(answers) {
  return QUIZ_IDS.filter((id) => answers && answers[id]).length
}

/* ── Act 1: situation chips (seed What's Alive, not scored) ── */
export const SITUATIONS = [
  { name: "I'm spiraling over someone", icon: Spiral },
  { name: 'We keep fighting', icon: Lightning },
  { name: 'They feel distant', icon: Wind },
  { name: "I'm getting mixed signals", icon: ArrowsClockwise },
  { name: "I'm healing from a breakup", icon: Heart },
  { name: "It's good, but I'm scared it won't last", icon: Shield },
  { name: 'Something else', icon: Sparkle },
]

/* Kael's one-line reflection back on the picked situation (the taste of relief). */
export const SITUATION_REFLECT = {
  "I'm spiraling over someone": 'Spirals feel like thinking. They are usually feeling, looking for somewhere to land.',
  'We keep fighting': 'The same fight on repeat is rarely about the thing. It is about what the thing means.',
  'They feel distant': 'Distance is loud when you love someone. Let us find out what it is actually saying.',
  "I'm getting mixed signals": 'Mixed signals are exhausting because you keep doing the decoding alone. Not anymore.',
  "I'm healing from a breakup": 'Healing is not linear, and you are not behind. Let us start where you actually are.',
  "It's good, but I'm scared it won't last": 'Wanting to protect something good is not paranoia. It is love with skin in the game.',
  'Something else': 'Whatever it is, you do not have to carry it alone in your head anymore.',
}

/* ── the 4 between-movement lanterns (education + trust + utility) ── */
export const LANTERNS = {
  A: {
    kicker: 'A small note',
    title: 'There is no right amount of closeness.',
    sub: 'There is only yours, and most fights are just two different amounts meeting. Knowing yours changes what feels like care, and what feels like pressure.',
  },
  B: {
    kicker: 'Still listening',
    title: "[Name], I'm starting to see how you love.",
    sub: 'Keep going. The next few say more than they look like they do.',
  },
  C: {
    kicker: 'Why this matters',
    title: "This is what I'll remember at 1am.",
    sub: 'So when you come to me mid-spiral, I never hand you advice that was built for someone else.',
  },
  D: {
    kicker: 'Almost there',
    title: 'Two more, then I show you what I see.',
    sub: 'These last two decide something subtle about how you love.',
  },
}

/* ── Act 4: features, sold as benefits, bound to the archetype ── */
export const FEATURES = [
  { icon: ChatCircleText, t: 'Chat', s: 'When you spiral at 1am, I help you see what is happening and respond with awareness, tuned to how {A} spins.' },
  { icon: SunHorizon, t: "What's alive right now", s: 'Your emotional weather and growth edge, updated as we talk. Right now: {SIT}' },
  { icon: ChartLineUp, t: 'Journey', s: 'Your receipt of growth: old patterns interrupted, decisions made with more clarity.' },
  { icon: BookOpen, t: 'Lessons', s: 'Short lessons tuned to {A}, never generic relationship advice.' },
]

export const CALIB_STEPS = [
  'Reading how you answered.',
  'Lining up your pattern in love.',
  'Weighing closeness against freedom.',
  'Finding which of the 16 fits.',
  'Putting words to it.',
]

/* ── the flow (Desire → Self-reflection → Mirror → Future self → Commitment) ── */
const quizScreen = (qid, movement) => ({ id: 'q_' + qid, kind: 'quiz', act: 2, movement, qid })

export const FLOW = [
  /* ACT 1 · DESIRE */
  { id: 'hero', kind: 'hero', act: 1, title: 'Love is messy.\nKael helps you navigate it.', sub: 'A few honest minutes, and I can show you how you love, what scares you in it, and what keeps repeating.', cta: 'Start' },
  { id: 'name', kind: 'name', act: 1, field: 'name', title: 'First, what should I call you?', sub: 'Just so this feels like a conversation, not a form.', placeholder: 'Your first name', cta: 'Continue' },
  { id: 'situation', kind: 'situation', act: 1, field: 'situation', title: "[Name], what's going on in your love life right now?", sub: 'Pick whatever is closest. This is where we start.', cta: 'Continue' },
  { id: 'why', kind: 'why', act: 1, title: 'Most people know who they like.\nFew know who they become once they love someone.', sub: 'That second thing is your Love Archetype: what you need, what scares you, what you repeat, and what helps you grow. Let me find yours. No right answers, the more honest you are the sharper I get.', cta: "Let's begin" },

  /* ACT 2 · SELF-REFLECTION */
  quizScreen('c1', 'C'), quizScreen('c2', 'C'), quizScreen('c3', 'C'), quizScreen('c4', 'C'),
  { id: 'lan_A', kind: 'lantern', act: 2, keyed: 'A', cta: 'Okay' },
  quizScreen('a1', 'A'), quizScreen('a2', 'A'), quizScreen('a3', 'A'), quizScreen('a4', 'A'),
  { id: 'lan_B', kind: 'lantern', act: 2, keyed: 'B', cta: 'Keep going' },
  quizScreen('e1', 'E'), quizScreen('e2', 'E'), quizScreen('e3', 'E'), quizScreen('e4', 'E'),
  { id: 'lan_C', kind: 'lantern', act: 2, keyed: 'C', cta: 'Got it' },
  quizScreen('p1', 'P'), quizScreen('p2', 'P'), quizScreen('p3', 'P'), quizScreen('p4', 'P'),
  { id: 'lan_D', kind: 'lantern', act: 2, keyed: 'D', cta: 'Last two' },
  quizScreen('t1', 'P'), quizScreen('t2', 'P'),
  { id: 'calibration', kind: 'calibration', act: 2, title: 'Finding your archetype.' },

  /* ACT 3 · MIRROR */
  { id: 'reveal', kind: 'reveal', act: 3 },
  { id: 'confirm', kind: 'confirm', act: 3, field: 'confirm', title: 'Does this feel like you?', options: [
    { name: 'Yes, that’s me' }, { name: 'Sort of' }, { name: 'Not quite' },
  ] },
  { id: 'read1', kind: 'miniread', act: 3, step: 1, label: 'How you love', show: ['opening'] },
  { id: 'read2', kind: 'miniread', act: 3, step: 2, label: 'What you are afraid of', show: ['fear', 'need'] },
  { id: 'read3', kind: 'miniread', act: 3, step: 3, label: 'When it is threatened', show: ['conflict', 'misread'] },
  { id: 'read4', kind: 'miniread', act: 3, step: 4, label: 'What actually helps', show: ['helps'], landing: true },

  /* ACT 4 · FUTURE SELF → COMMITMENT */
  { id: 'turn', kind: 'turn', act: 4, cta: 'Show me' },
  { id: 'features', kind: 'features', act: 4, title: 'Your archetype does not need generic advice.\nIt needs a specific path.', cta: 'See my plan' },
  { id: 'paywall', kind: 'paywall', act: 4 },
]
