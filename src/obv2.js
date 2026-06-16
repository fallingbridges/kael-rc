/* ──────────────────────────────────────────────────────────────────────────
   obv2.js — Kael Onboarding V2 scoring + content logic.

   Pure, dependency-free ES module. Everything here is deterministic and
   latency-free (the "algorithmic now" path of §11). The LLM seam wraps these
   outputs later; for now these defaults are the network-free fallback and the
   live content the UI renders.

   Maps to ONBOARDING_V2_SPEC.md:
     §2  profile schema           → PROFILE_FIELDS, assembleRead's profile shape
     §5  beliefs (inferred)       → BELIEFS, inferBelief()
     §6  question set + tags      → TAGS (hook + Movements A/B/C/D)
     §8  the read (multi-beat)    → PATTERNS, assembleRead().beats
     §9  locked You Page          → assembleRead().youPage
     §10 transformation graph     → PATTERN_START_DOT, secureLine
     §11 read generation          → buildRead() / assembleRead()

   VOICE: no em dashes anywhere; no "it's not X, it's Y"; short lines.
   ────────────────────────────────────────────────────────────────────────── */

import {
  Brain,
  Lightning,
  Wind,
  Heart,
  ArrowsClockwise,
  Anchor,
  Waves,
  UserCircle,
  Sparkle,
  ArrowsSplit,
  House,
  ArrowCounterClockwise,
  Wrench,
  Shield,
  Handshake,
  Snowflake,
  HandHeart,
  Flame,
  ChatCircleText,
  Bird,
  Medal,
  UsersThree,
  GenderFemale,
  GenderMale,
  GenderNonbinary,
  CircleDashed,
  ShieldCheck,
  Compass,
  LockKey,
  Books,
  BellSimple,
  Spiral,
  HeartBreak,
  CloudFog,
  SunHorizon,
  MoonStars,
  SmileyMeh,
  Scales,
  ChatCircleDots,
  Shuffle,
  PencilSimple,
  Ear,
  Eye,
  MagnifyingGlass,
  Alarm,
} from '@phosphor-icons/react'

/* ════════════════════════════════════════════════════════════════════════
   0. CONSTANTS — the five patterns, profile keys, taxonomies
   ════════════════════════════════════════════════════════════════════════ */

// The five named core patterns. Order is also the tie-break / fallback order
// (see scorePattern): when signal is sparse or tied, we lean toward the calmer,
// more "guarded/steadier" reads rather than the loudest anxious one.
export const PATTERN_IDS = [
  'guarded_distance',
  'self_abandonment',
  'meaning_making_spiral',
  'defensive_strike',
  'reassurance_loop',
]

// Profile keys (§2). Exported so the UI and tests can validate coverage.
export const PROFILE_FIELDS = [
  'name',
  'ageBand',
  'gender',
  'relationshipState',
  'emotionalState',
  'corePattern',
  'attachmentLean',
  'topTriggers',
  'conflictStyle',
  'coreBelief',
  'beliefConfidence',
  'coreValues',
  'intensity',
  'situation',
  'situationText',
]

// The seven core beliefs (§5), each with its protective recognition beat,
// the gentle "learned story" line for the read, and a reframe for the
// "that's not quite me" tap. Balanced across anxious / avoidant / deprivation.
export const BELIEFS = {
  conditional_love: {
    lean: 'anxious',
    beat: 'I feel steadier when I know I am being useful or needed.',
    story: 'love is something you have to earn.',
    reframe: 'You are worth keeping even on the days you have nothing to offer.',
  },
  abandonment: {
    lean: 'anxious',
    beat: 'Part of me stays a little ready for people to drift.',
    story: 'people you count on eventually leave.',
    reframe: 'Some people stay. You are allowed to let one of them.',
  },
  defectiveness: {
    lean: 'avoidant',
    beat: "I'm careful about showing all of myself too soon.",
    story: 'if they really saw you, they would pull away.',
    reframe: 'The parts you hide are the parts worth being loved for.',
  },
  self_blame: {
    lean: 'anxious',
    beat: "When something's off, my first instinct is to check what I did.",
    story: 'when things go wrong, it is probably your fault.',
    reframe: 'Not every silence is about you. Some of it is just theirs.',
  },
  self_reliance_mistrust: {
    lean: 'avoidant',
    beat: 'When it comes down to it, I trust myself more than I trust other people to show up.',
    story: 'the only person you can really count on is you.',
    reframe: 'Leaning on someone is not the same as losing yourself.',
  },
  engulfment: {
    lean: 'avoidant',
    beat: 'Too much closeness can start to feel like losing my own space.',
    story: 'closeness costs you your freedom.',
    reframe: 'You can be close to someone and still be your own.',
  },
  deprivation: {
    lean: 'deprivation',
    beat: 'I half-expect to be the one giving more than I get.',
    story: 'your needs will go unmet, so why ask.',
    reframe: 'Wanting more tells you something true about what you need.',
  },
}

export const BELIEF_IDS = Object.keys(BELIEFS)

// All the topTriggers values (§2), exported for label lookups.
export const TRIGGER_LABELS = {
  slow_replies: 'a slow reply',
  distance: 'distance',
  criticism: 'criticism',
  needing_space: 'someone needing space',
  feeling_unwanted: 'feeling unwanted',
  mixed_signals: 'mixed signals',
}

/* ════════════════════════════════════════════════════════════════════════
   1. TAG TAXONOMY — every option across hook + Movements A/B/C/D → tags
   ════════════════════════════════════════════════════════════════════════

   Each entry is keyed by the screen/question id, then by the option's exact
   string value. Tags follow §6's annotation grammar:

     pattern:<id>        contributes to scorePattern's tally
     belief:<id>         contributes to inferBelief
     lean:<anxious|avoidant|secure|deprivation>   internal attachmentLean
     trigger:<id>        adds to topTriggers
     conflict:<style>    sets/confirms conflictStyle
     emotion:<state>     sets emotionalState
     state:<value>       sets relationshipState
     intensity:<delta>   numeric weight folded into the Likert intensity score
     value:<id>          a coreValue pick (Movement D)

   Recognition / Likert answers carry a *response* multiplier applied at scoring
   time, so the same statement weights differently for "Sounds like me" vs
   "Not really" (see RESPONSE_WEIGHT / LIKERT_WEIGHT below). The tags themselves
   are response-agnostic; the weight scales them.
   ────────────────────────────────────────────────────────────────────────── */

export const TAGS = {
  /* ── Hook (Act 1) · single-choice. Seeds corePattern + emotionalState. ── */
  hook: {
    "I'm overthinking someone": ['pattern:reassurance_loop', 'pattern:meaning_making_spiral', 'lean:anxious', 'emotion:anxious'],
    'We keep fighting': ['pattern:defensive_strike', 'conflict:defend', 'emotion:overwhelmed'],
    'They feel distant': ['pattern:meaning_making_spiral', 'trigger:distance', 'emotion:hurt', 'lean:anxious'],
    "I'm healing from a breakup": ['pattern:meaning_making_spiral', 'emotion:hurt'],
    'I keep choosing the wrong people': ['pattern:self_abandonment', 'pattern:guarded_distance', 'emotion:lonely'],
    'I want to feel secure': ['lean:secure', 'emotion:hopeful'],
    'I just feel off': ['emotion:numb'],
  },

  /* ── Movement A — "Where you are" · single-choice · ack → Continue ── */
  'relationship-state': {
    Single: ['state:single'],
    Dating: ['state:dating'],
    'In a situationship': ['state:situationship', 'trigger:mixed_signals'],
    'In a relationship': ['state:relationship'],
    Married: ['state:married'],
    'Recently ended': ['state:recently_ended', 'emotion:hurt'],
    "It's complicated": ['state:complicated', 'trigger:mixed_signals'],
    'Trying to move on': ['state:moving_on', 'emotion:hurt', 'pattern:meaning_making_spiral'],
  },
  'emotional-state': {
    Anxious: ['emotion:anxious', 'lean:anxious'],
    Hurt: ['emotion:hurt'],
    Confused: ['emotion:confused', 'trigger:mixed_signals'],
    Hopeful: ['emotion:hopeful'],
    Distant: ['emotion:distant', 'lean:avoidant'],
    Lonely: ['emotion:lonely'],
    Numb: ['emotion:numb', 'lean:avoidant'],
    Overwhelmed: ['emotion:overwhelmed', 'lean:anxious'],
    'Calm but unsure': ['emotion:calm-unsure', 'lean:secure'],
  },
  'conflict-style': {
    'Fix it right now': ['conflict:fix_now', 'pattern:reassurance_loop', 'lean:anxious'],
    'Defend myself': ['conflict:defend', 'pattern:defensive_strike', 'trigger:criticism'],
    'Shut down': ['conflict:shut_down', 'pattern:guarded_distance', 'lean:avoidant'],
    'Give in to keep the peace': ['conflict:give_in', 'pattern:self_abandonment'],
    'Go cold': ['conflict:go_cold', 'pattern:guarded_distance', 'lean:avoidant'],
  },

  /* ── Movement B — "What happens" · recognition · auto-advance + confirm ──
     Pattern beats (§6 B) interleaved with the protective belief beats (§5).
     Keyed by screen id; the option value is the recognition response and is
     scored via RESPONSE_WEIGHT (it never appears as a literal key here). ── */
  'pattern-recognition-1': {
    // "When someone I care about goes quiet, I imagine the worst." [anxious·meaning·trigger:distance]
    _statement: 'When someone I care about goes quiet, I imagine the worst.',
    _tags: ['pattern:meaning_making_spiral', 'pattern:reassurance_loop', 'lean:anxious', 'trigger:distance'],
  },
  'pattern-recognition-2': {
    // "When things get tense, I pull back and go quiet." [avoidant·guarded·conflict:shut_down]
    _statement: 'When things get tense, I pull back and go quiet.',
    _tags: ['pattern:guarded_distance', 'lean:avoidant', 'conflict:shut_down'],
  },
  'pattern-recognition-3': {
    // "I replay conversations looking for what I did wrong." [meaning·anxious]
    _statement: 'I replay conversations looking for what I did wrong.',
    _tags: ['pattern:meaning_making_spiral', 'lean:anxious', 'belief:self_blame'],
  },
  'pattern-recognition-4': {
    // "I'll keep the peace instead of saying what I need." [self_abandonment]
    _statement: "I'll keep the peace instead of saying what I need.",
    _tags: ['pattern:self_abandonment', 'conflict:give_in'],
  },
  'pattern-recognition-5': {
    // "When I feel criticized, I get defensive fast." [defensive·trigger:criticism]
    _statement: 'When I feel criticized, I get defensive fast.',
    _tags: ['pattern:defensive_strike', 'trigger:criticism', 'conflict:defend'],
  },
  'pattern-recognition-6': {
    // "A slow reply can hijack my whole mood." [anxious·trigger:slow_replies]
    _statement: 'A slow reply can hijack my whole mood.',
    _tags: ['pattern:reassurance_loop', 'lean:anxious', 'trigger:slow_replies', 'intensity:1'],
  },

  // Protective belief beats (§5), folded into the same B stream.
  'belief-recognition-1': {
    _statement: BELIEFS.conditional_love.beat,
    _tags: ['belief:conditional_love', 'pattern:self_abandonment', 'lean:anxious'],
  },
  'belief-recognition-2': {
    _statement: BELIEFS.abandonment.beat,
    _tags: ['belief:abandonment', 'pattern:reassurance_loop', 'lean:anxious'],
  },
  'belief-recognition-3': {
    _statement: BELIEFS.defectiveness.beat,
    _tags: ['belief:defectiveness', 'pattern:guarded_distance', 'lean:avoidant'],
  },
  'belief-recognition-4': {
    _statement: BELIEFS.self_blame.beat,
    _tags: ['belief:self_blame', 'pattern:meaning_making_spiral', 'lean:anxious'],
  },
  'belief-recognition-5': {
    _statement: BELIEFS.self_reliance_mistrust.beat,
    _tags: ['belief:self_reliance_mistrust', 'pattern:guarded_distance', 'lean:avoidant'],
  },
  'belief-recognition-6': {
    _statement: BELIEFS.engulfment.beat,
    _tags: ['belief:engulfment', 'pattern:guarded_distance', 'lean:avoidant', 'trigger:needing_space'],
  },
  'belief-recognition-7': {
    _statement: BELIEFS.deprivation.beat,
    _tags: ['belief:deprivation', 'pattern:self_abandonment', 'trigger:feeling_unwanted'],
  },

  /* ── Movement C — "How much" · Likert · auto-advance ──
     Each statement feeds the intensity score (via LIKERT_WEIGHT) and nudges a
     pattern. Keyed by screen id; the Likert answer scales the tags. ── */
  'intensity-1': {
    // "Little things set me off, like a tone or a slow reply."
    _statement: 'Little things set me off, like a tone or a slow reply.',
    _tags: ['pattern:reassurance_loop', 'trigger:slow_replies', 'lean:anxious'],
  },
  'intensity-2': {
    // "I need reassurance to feel okay in a relationship."
    _statement: 'I need reassurance to feel okay in a relationship.',
    _tags: ['pattern:reassurance_loop', 'belief:abandonment', 'lean:anxious'],
  },
  'intensity-3': {
    // "I'd rather handle hard feelings alone than bring them up."
    _statement: "I'd rather handle hard feelings alone than bring them up.",
    _tags: ['pattern:guarded_distance', 'belief:self_reliance_mistrust', 'lean:avoidant', 'conflict:shut_down'],
  },
  'intensity-4': {
    // "I worry I want too much from people."
    _statement: 'I worry I want too much from people.',
    _tags: ['pattern:self_abandonment', 'belief:deprivation', 'lean:anxious'],
  },

  /* ── Movement D — "What you want" · multi-choice (cap 3) ──
     Aspiration. coreValues; secure-leaning picks nudge attachmentLean. ── */
  values: {
    Chosen: ['value:chosen'],
    Safe: ['value:safe'],
    Desired: ['value:desired'],
    Understood: ['value:understood'],
    Free: ['value:free', 'lean:avoidant'],
    Calm: ['value:calm', 'lean:secure'],
    Respected: ['value:respected'],
    Close: ['value:close'],
    Secure: ['value:secure', 'lean:secure'],
  },

  /* ── Situation · scenario picker. Anchors the read; light pattern nudge. ── */
  situation: {
    "A text I'm overthinking": ['situation:overthinking_text', 'pattern:reassurance_loop', 'trigger:slow_replies'],
    'A fight we keep having': ['situation:recurring_fight', 'pattern:defensive_strike', 'trigger:criticism'],
    'Someone pulling away': ['situation:pulling_away', 'pattern:meaning_making_spiral', 'trigger:distance'],
    "A breakup I'm not over": ['situation:breakup', 'pattern:meaning_making_spiral'],
    "Mixed signals I can't read": ['situation:mixed_signals', 'pattern:meaning_making_spiral', 'trigger:mixed_signals'],
    'I just want to feel more secure': ['situation:want_secure', 'lean:secure'],
    'Something else': ['situation:something_else'],
  },
}

// Recognition response → weight on the statement's tags (Movement B).
// "Not really" carries a small negative so disagreement is real signal.
export const RESPONSE_WEIGHT = {
  'Sounds like me': 1,
  Sometimes: 0.5,
  'Not really': -0.35,
}

// Likert response → weight (Movement C). Also the per-statement intensity delta.
export const LIKERT_WEIGHT = {
  Rarely: 0,
  Sometimes: 0.45,
  Often: 0.8,
  'Almost always': 1,
}

// Screen ids that belong to the recognition (B) and Likert (C) movements.
const RECOGNITION_IDS = [
  'pattern-recognition-1', 'pattern-recognition-2', 'pattern-recognition-3',
  'pattern-recognition-4', 'pattern-recognition-5', 'pattern-recognition-6',
  'belief-recognition-1', 'belief-recognition-2', 'belief-recognition-3',
  'belief-recognition-4', 'belief-recognition-5', 'belief-recognition-6',
  'belief-recognition-7',
]
const LIKERT_IDS = ['intensity-1', 'intensity-2', 'intensity-3', 'intensity-4']

// Single-select screens whose answer is a literal option key in TAGS.
const SINGLE_SELECT_IDS = ['hook', 'relationship-state', 'emotional-state', 'conflict-style', 'situation']

/* ════════════════════════════════════════════════════════════════════════
   2. scorePattern(picks) → one of the five pattern ids
   ════════════════════════════════════════════════════════════════════════

   Deterministic and total. Rule:
     1. Walk every answered question. Pull its pattern:* tags.
        - Single-select + Movement D: each tag counts as +1.
        - Recognition (B): each tag scaled by RESPONSE_WEIGHT of the answer.
        - Likert (C): each tag scaled by LIKERT_WEIGHT of the answer.
     2. Sum into a per-pattern tally.
     3. The strongest pattern wins.
     4. Tie-break / low-signal: if the best score is <= a small floor (sparse or
        contradictory answers), or two patterns tie, fall back to PATTERN_IDS
        order, which is arranged to lean toward the calmer, steadier reads
        (guarded_distance first) rather than defaulting to the loudest anxious
        loop. This makes a near-empty quiz read as "steadier", per §2/§5.
   ──────────────────────────────────────────────────────────────────────── */

function collectTags(picks) {
  const out = [] // [{ tag, weight }]

  // Single-select screens: literal option keys.
  SINGLE_SELECT_IDS.forEach((id) => {
    const ans = picks[id]
    const map = TAGS[id]
    if (ans && map && map[ans]) map[ans].forEach((tag) => out.push({ tag, weight: 1 }))
  })

  // Movement D values (array, cap 3).
  const vals = Array.isArray(picks.values) ? picks.values : []
  vals.forEach((v) => {
    const tags = TAGS.values[v]
    if (tags) tags.forEach((tag) => out.push({ tag, weight: 1 }))
  })

  // Recognition beats (B).
  RECOGNITION_IDS.forEach((id) => {
    const ans = picks[id]
    const w = RESPONSE_WEIGHT[ans]
    if (ans == null || w == null) return
    const tags = (TAGS[id] && TAGS[id]._tags) || []
    tags.forEach((tag) => out.push({ tag, weight: w }))
  })

  // Likert beats (C).
  LIKERT_IDS.forEach((id) => {
    const ans = picks[id]
    const w = LIKERT_WEIGHT[ans]
    if (ans == null || w == null) return
    const tags = (TAGS[id] && TAGS[id]._tags) || []
    tags.forEach((tag) => out.push({ tag, weight: w }))
  })

  return out
}

export function scorePattern(picks) {
  const safe = picks || {}
  const tags = collectTags(safe)

  const tally = {}
  PATTERN_IDS.forEach((p) => (tally[p] = 0))
  tags.forEach(({ tag, weight }) => {
    if (tag.startsWith('pattern:')) {
      const p = tag.slice('pattern:'.length)
      if (p in tally) tally[p] += weight
    }
  })

  // Strongest pattern; ties resolved by PATTERN_IDS order (steadier-first).
  let best = PATTERN_IDS[0]
  let bestN = -Infinity
  PATTERN_IDS.forEach((p) => {
    if (tally[p] > bestN) {
      bestN = tally[p]
      best = p
    }
  })

  // Low-signal floor: not enough resonance to commit → lean steadier.
  // Threshold is intentionally low (one clear answer clears it).
  const LOW_SIGNAL = 0.75
  if (bestN <= LOW_SIGNAL) return 'guarded_distance'

  return best
}

/* ════════════════════════════════════════════════════════════════════════
   3. inferBelief(picks) → { belief, confidence }
   ════════════════════════════════════════════════════════════════════════

   Belief is never asked (§5). It is inferred from the protective recognition
   beats (and a couple of Likert/single-select corroborators), then named
   gently in the read only when confidence is strong (§8).

   Rule:
     - Each belief:* tag from an answered beat is scaled by its RESPONSE_WEIGHT
       (or LIKERT_WEIGHT). Strong agreement adds, "Not really" subtracts.
     - The top belief wins; ties resolved by BELIEF_IDS order.
     - confidence is 'strong' only when the winning belief clears a resonance
       floor AND enough belief beats were genuinely affirmed. Otherwise 'weak'
       (the read describes the pattern without naming a belief). Sparse or
       evenly-spread answers stay 'weak' by design.
   ──────────────────────────────────────────────────────────────────────── */

export function inferBelief(picks) {
  const safe = picks || {}
  const tally = {}
  BELIEF_IDS.forEach((b) => (tally[b] = 0))

  let affirmedBeats = 0 // beats answered "Sounds like me" or "Almost always"

  const fold = (id, weightMap) => {
    const ans = safe[id]
    const w = weightMap[ans]
    if (ans == null || w == null) return
    const tags = (TAGS[id] && TAGS[id]._tags) || []
    tags.forEach((tag) => {
      if (tag.startsWith('belief:')) {
        const b = tag.slice('belief:'.length)
        if (b in tally) tally[b] += w
      }
    })
    if (w >= 0.9) affirmedBeats += 1
  }

  RECOGNITION_IDS.forEach((id) => fold(id, RESPONSE_WEIGHT))
  LIKERT_IDS.forEach((id) => fold(id, LIKERT_WEIGHT))

  let best = BELIEF_IDS[0]
  let bestN = -Infinity
  BELIEF_IDS.forEach((b) => {
    if (tally[b] > bestN) {
      bestN = tally[b]
      best = b
    }
  })

  // 'strong' needs both: a clearly-leading belief and at least two genuinely
  // affirmed beats. This keeps the read from naming a belief on thin signal.
  const STRONG_SCORE = 1.5
  const confidence = bestN >= STRONG_SCORE && affirmedBeats >= 2 ? 'strong' : 'weak'

  return { belief: best, confidence }
}

/* ════════════════════════════════════════════════════════════════════════
   4. PATTERNS — content map keyed by pattern id (§8 read fields)
   ════════════════════════════════════════════════════════════════════════

   Solid DEFAULT read copy (the polished, authored version is layered later).
   Voice: no em dashes, no "it's not X, it's Y", short lines.

   Fields:
     name        display name (chip + You Page)
     essence     Beat 1 hero line (~one line); {name} is interpolated lower-case
     trigger     the named in-the-moment trigger (Beat 2 fragment)
     triggerId   the topTriggers key it corresponds to (for the You Page)
     inTheMoment Beat 2 relief line (what to bring Kael)
     secureLine  Beat 3 one-liner defining "secure" experientially (§10)
     valuesFrame one line tying their chosen values to the work
   ──────────────────────────────────────────────────────────────────────── */

export const PATTERNS = {
  reassurance_loop: {
    name: 'The Reassurance Loop',
    essence: 'you reach for clarity when what you really want is to feel safe.',
    trigger: 'a slow reply',
    triggerId: 'slow_replies',
    inTheMoment: 'Bring Kael the moment a reply goes quiet, and respond instead of reaching.',
    secureLine: 'You will still feel the spike. You just will not be run by it.',
    valuesFrame: 'You are after {values}. That starts with trusting the quiet, not filling it.',
  },
  meaning_making_spiral: {
    name: 'The Meaning-Making Spiral',
    essence: 'you build the whole story from one small silence, just to feel ready.',
    trigger: 'distance',
    triggerId: 'distance',
    inTheMoment: 'Bring Kael the silence before you fill it in, and check the story against the facts.',
    secureLine: 'You will still notice the gap. You just will not write the ending for them.',
    valuesFrame: 'You want to feel {values}. That grows when you let a silence stay a silence.',
  },
  self_abandonment: {
    name: 'The Self-Abandonment Pattern',
    essence: 'you keep the peace by going quiet about what you actually need.',
    trigger: 'feeling unwanted',
    triggerId: 'feeling_unwanted',
    inTheMoment: 'Bring Kael the need you almost swallowed, and say it out loud here first.',
    secureLine: 'You will still want to smooth it over. You just will not disappear to do it.',
    valuesFrame: 'You are reaching for {values}. That asks you to take up a little more room.',
  },
  defensive_strike: {
    name: 'The Defensive Strike',
    essence: 'you protect yourself by getting there first.',
    trigger: 'criticism',
    triggerId: 'criticism',
    inTheMoment: 'Bring Kael the moment you feel blamed, and find the words before the wall goes up.',
    secureLine: 'You will still feel the sting. You just will not turn it into a standoff.',
    valuesFrame: 'You want {values}. That gets easier when you stop guarding and start saying it.',
  },
  guarded_distance: {
    name: 'The Guarded Distance',
    essence: 'you go quiet to feel safe, and to them it reads as gone.',
    trigger: 'someone needing space',
    triggerId: 'needing_space',
    inTheMoment: 'Bring Kael the moment you want to pull back, and name what you are protecting.',
    secureLine: 'You will still want the door. You just will not close it on the people who stay.',
    valuesFrame: 'You are after {values}. Closeness can be safe when you set the terms out loud.',
  },
}

/* ════════════════════════════════════════════════════════════════════════
   5. TRANSFORMATION — startingDot per pattern + secure line (§10)
   ════════════════════════════════════════════════════════════════════════

   PATTERN_START_DOT: where the user's dot sits on the reacting → responding
   axis (0 = fully reacting, 1 = fully responding) at "Today". Louder, more
   activated patterns start lower; steadier ones start a touch higher. The
   trajectory graph draws from here toward responding; intensity nudges it (see
   transformationBeat). Values are deliberately in the lower-left so there is
   visible room to grow.
   ──────────────────────────────────────────────────────────────────────── */

export const PATTERN_START_DOT = {
  reassurance_loop: 0.18,
  meaning_making_spiral: 0.24,
  self_abandonment: 0.22,
  defensive_strike: 0.2,
  guarded_distance: 0.3,
}

// Convenience: the secure line per pattern (also lives on PATTERNS.secureLine).
export const secureLine = PATTERN_IDS.reduce((acc, id) => {
  acc[id] = PATTERNS[id].secureLine
  return acc
}, {})

/* ════════════════════════════════════════════════════════════════════════
   6. PROFILE derivation — turn raw picks into the §2 profile
   ════════════════════════════════════════════════════════════════════════ */

// Collapse the lean:* tags into a single attachmentLean (internal only).
function deriveAttachmentLean(picks) {
  const tags = collectTags(picks)
  const lean = { anxious: 0, avoidant: 0, secure: 0, deprivation: 0 }
  tags.forEach(({ tag, weight }) => {
    if (tag.startsWith('lean:')) {
      const k = tag.slice('lean:'.length)
      if (k in lean) lean[k] += Math.max(0, weight)
    }
  })
  const ranked = Object.entries(lean).sort((a, b) => b[1] - a[1])
  const [topKey, topVal] = ranked[0]
  const [, secondVal] = ranked[1]
  if (topVal === 0) return 'mixed'
  // Close race between the two strongest non-secure leans → mixed.
  if (topKey !== 'secure' && secondVal > 0 && topVal - secondVal < 0.75) return 'mixed'
  return topKey
}

// Top triggers, ranked, deduped. Anchored by the pattern's own trigger.
function deriveTopTriggers(picks, corePattern) {
  const tags = collectTags(picks)
  const score = {}
  tags.forEach(({ tag, weight }) => {
    if (tag.startsWith('trigger:') && weight > 0) {
      const t = tag.slice('trigger:'.length)
      score[t] = (score[t] || 0) + weight
    }
  })
  // Make sure the pattern's signature trigger is represented.
  const anchor = PATTERNS[corePattern].triggerId
  score[anchor] = (score[anchor] || 0) + 0.5
  return Object.entries(score)
    .sort((a, b) => b[1] - a[1])
    .map(([t]) => t)
}

// Intensity bucket from the Movement C Likert answers (+ the B intensity tag).
function deriveIntensity(picks) {
  let sum = 0
  let n = 0
  LIKERT_IDS.forEach((id) => {
    const ans = picks[id]
    const w = LIKERT_WEIGHT[ans]
    if (w != null) {
      sum += w
      n += 1
    }
  })
  // The one B beat tagged intensity:1 ("a slow reply can hijack my mood").
  const b6 = RESPONSE_WEIGHT[picks['pattern-recognition-6']]
  if (b6 != null) {
    sum += Math.max(0, b6)
    n += 1
  }
  if (n === 0) return 'med'
  const avg = sum / n
  if (avg >= 0.7) return 'high'
  if (avg >= 0.35) return 'med'
  return 'low'
}

// conflictStyle: prefer the explicit Movement A answer, else infer from tags.
function deriveConflictStyle(picks) {
  const explicit = TAGS['conflict-style'][picks['conflict-style']]
  if (explicit) {
    const c = explicit.find((t) => t.startsWith('conflict:'))
    if (c) return c.slice('conflict:'.length)
  }
  const tags = collectTags(picks)
  const score = {}
  tags.forEach(({ tag, weight }) => {
    if (tag.startsWith('conflict:') && weight > 0) {
      const k = tag.slice('conflict:'.length)
      score[k] = (score[k] || 0) + weight
    }
  })
  const ranked = Object.entries(score).sort((a, b) => b[1] - a[1])
  return ranked.length ? ranked[0][0] : 'shut_down'
}

function firstTagValue(picks, id, prefix, fallback) {
  const ans = picks[id]
  const tags = (TAGS[id] && TAGS[id][ans]) || []
  const hit = tags.find((t) => t.startsWith(prefix))
  return hit ? hit.slice(prefix.length) : fallback
}

// Build the full §2 profile from raw picks + name. Pure and total.
export function deriveProfile(picks, name) {
  const safe = picks || {}
  const corePattern = scorePattern(safe)
  const { belief, confidence } = inferBelief(safe)
  const coreValues = (Array.isArray(safe.values) ? safe.values : []).slice(0, 3)

  return {
    name: (name || safe.name || '').trim(),
    ageBand: safe.age || safe.ageBand || '',
    gender: safe.gender || '',
    relationshipState: firstTagValue(safe, 'relationship-state', 'state:', ''),
    emotionalState: firstTagValue(safe, 'emotional-state', 'emotion:', '') || firstTagValue(safe, 'hook', 'emotion:', 'numb'),
    corePattern,
    attachmentLean: deriveAttachmentLean(safe),
    topTriggers: deriveTopTriggers(safe, corePattern),
    conflictStyle: deriveConflictStyle(safe),
    coreBelief: belief,
    beliefConfidence: confidence,
    coreValues,
    intensity: deriveIntensity(safe),
    situation: firstTagValue(safe, 'situation', 'situation:', ''),
    situationText: (safe.situationText || '').trim(),
  }
}

/* ════════════════════════════════════════════════════════════════════════
   7. assembleRead(profile) → the structured object the UI renders (§8, §9)
   ════════════════════════════════════════════════════════════════════════

   Pure, latency-free (the "algorithmic now" path of §11). Accepts a profile
   (from deriveProfile) and returns { beats, youPage, transformation, meta }.
   The LLM seam later replaces the *rendering* of these beats, not the
   decisions in them.
   ──────────────────────────────────────────────────────────────────────── */

function cap(w) {
  return w ? w.charAt(0).toUpperCase() + w.slice(1) : w
}

function joinValues(values) {
  const v = (values || []).map((x) => x.toLowerCase())
  if (v.length === 0) return 'something steadier'
  if (v.length === 1) return v[0]
  if (v.length === 2) return `${v[0]} and ${v[1]}`
  return `${v.slice(0, -1).join(', ')}, and ${v[v.length - 1]}`
}

function triggerLabel(id) {
  return TRIGGER_LABELS[id] || (id ? id.replace(/_/g, ' ') : 'a small moment')
}

// Beat 1 — pattern + the story underneath (richest beat).
function patternBeat(profile) {
  const p = PATTERNS[profile.corePattern]
  const nm = profile.name ? cap(profile.name) : ''
  const hero = nm ? `${nm}, ${p.essence}` : `You ${p.essence}`.replace('You you ', 'You ')

  const beat = {
    type: 'pattern',
    chipLabel: 'Your read',
    patternName: p.name,
    hero,
    reliefChip: 'Kael remembers this.',
  }

  // The story underneath: named gently, only when belief confidence is strong.
  if (profile.beliefConfidence === 'strong' && BELIEFS[profile.coreBelief]) {
    const b = BELIEFS[profile.coreBelief]
    beat.storyUnderneath = {
      label: 'The story underneath',
      tentative: `It can sound like, ${b.story}`,
      reframeTapLabel: 'That is not quite me',
      reframe: b.reframe,
    }
  } else {
    beat.storyUnderneath = null
  }

  // Their own words, as a single framed pull-line, only if they typed.
  beat.pullLine = profile.situationText ? `You said: "${profile.situationText}"` : null

  return beat
}

// Beat 2 — trigger + in-the-moment help.
function triggerBeat(profile) {
  const p = PATTERNS[profile.corePattern]
  const topId = (profile.topTriggers && profile.topTriggers[0]) || p.triggerId
  return {
    type: 'trigger',
    fragmentLabel: 'It starts small',
    triggerName: triggerLabel(topId),
    triggerId: topId,
    relief: p.inTheMoment,
  }
}

// Beat 3 — the shift (transformation), feeds the built trajectory graph (§10).
function transformationBeat(profile) {
  const start = PATTERN_START_DOT[profile.corePattern] ?? 0.22
  // Higher intensity → starts a touch lower (more room to move), and vice versa.
  const intensityShift = { high: -0.05, med: 0, low: 0.05 }[profile.intensity] || 0
  const today = Math.max(0.1, Math.min(0.45, start + intensityShift))

  return {
    type: 'transformation',
    axis: { from: 'reacting', to: 'responding' },
    markers: [
      { label: 'Today', t: round2(today) },
      { label: '7 days', t: round2(today + (1 - today) * 0.4) },
      { label: '30 days', t: round2(today + (1 - today) * 0.78) },
    ],
    secureLine: PATTERNS[profile.corePattern].secureLine,
  }
}

function round2(n) {
  return Math.round(n * 100) / 100
}

// The emotional landing line (§8) — owned by the user, before any lock.
export const EMOTIONAL_LANDING = 'Whatever you do next, you saw something true about yourself today.'

// Locked You Page sections (§9). Each: label, revealed, value-or-teaser, lockedCount.
function buildYouPage(profile) {
  const p = PATTERNS[profile.corePattern]
  const triggers = profile.topTriggers || []
  const topTriggerLabel = triggers.length ? triggerLabel(triggers[0]) : 'a slow reply'
  const moreTriggers = Math.max(0, triggers.length - 1)
  const values = profile.coreValues || []

  return [
    {
      key: 'pattern',
      label: 'Your pattern',
      revealed: true,
      value: p.name,
      lockedCount: 0,
    },
    {
      key: 'triggers',
      label: 'Your triggers',
      revealed: true,
      value: moreTriggers > 0 ? `${topTriggerLabel}, +${moreTriggers} more` : topTriggerLabel,
      teaser: 'The full list of what sets you off, and why.',
      lockedCount: moreTriggers,
    },
    {
      key: 'story',
      label: 'The story underneath',
      revealed: false,
      teaser:
        profile.beliefConfidence === 'strong'
          ? 'The quiet belief running underneath it all.'
          : 'The quiet story we are still piecing together.',
      lockedCount: 1,
    },
    {
      key: 'plan',
      label: 'Your 7-day plan',
      revealed: false,
      teaser: 'Day 1 is ready when you are.',
      lockedCount: 7,
    },
    {
      key: 'attachment',
      label: 'How you bond',
      revealed: false,
      teaser: 'The shape of how you reach for people.',
      lockedCount: 1,
    },
    {
      key: 'values',
      label: 'Your values',
      revealed: values.length > 0,
      value: values.length ? values.join(', ') : 'Pick what matters most',
      teaser: 'What a good relationship feels like for you.',
      lockedCount: 0,
    },
  ]
}

export function assembleRead(profile) {
  const safe = profile || {}
  // Be forgiving: if handed raw picks instead of a profile, derive it.
  const p = safe.corePattern ? safe : deriveProfile(safe, safe.name)
  const pat = PATTERNS[p.corePattern] || PATTERNS.guarded_distance

  const beat1 = patternBeat(p)
  const beat3 = transformationBeat(p)

  return {
    meta: {
      name: p.name || '',
      corePattern: p.corePattern,
      patternName: pat.name,
      coreBelief: p.coreBelief,
      beliefConfidence: p.beliefConfidence,
      situation: p.situation,
      hasTypedText: Boolean(p.situationText),
      valuesFrame: pat.valuesFrame.replace('{values}', joinValues(p.coreValues)),
      coreValues: p.coreValues || [],
      topTriggers: p.topTriggers || [],
    },
    beats: [beat1, triggerBeat(p), beat3],
    landing: EMOTIONAL_LANDING,
    youPage: buildYouPage(p),
    transformation: beat3,
  }
}

/* ════════════════════════════════════════════════════════════════════════
   8. buildRead(picks, name) — convenience wrapper (§11 algorithmic-now path)
   ════════════════════════════════════════════════════════════════════════
   The single entry point the calibration step calls: raw picks in, the full
   render-ready read out. This is the network-free fallback; the LLM seam wraps
   this later to re-render the beats in Kael's voice without changing decisions.
   ──────────────────────────────────────────────────────────────────────── */

export function buildRead(picks, name) {
  const profile = deriveProfile(picks, name)
  return { profile, read: assembleRead(profile) }
}

/* ════════════════════════════════════════════════════════════════════════
   9. CONTENT LAYER — FLOW descriptors + authored copy for OnboardingV2.jsx
   ════════════════════════════════════════════════════════════════════════

   All user-facing copy for the V2 flow lives here so the screen stays pure
   layout + state. Option `name` strings byte-match the TAGS keys above so
   scoring never drops an answer. Voice: no em dashes, no "it's not X, it's Y".
   ──────────────────────────────────────────────────────────────────────── */

// Shared response option sets (no per-option icons; rendered as text cards/chips).
const RECOGNIZE_OPTIONS = [{ name: 'Sounds like me' }, { name: 'Sometimes' }, { name: 'Not really' }]
const LIKERT_OPTIONS = [{ name: 'Rarely' }, { name: 'Sometimes' }, { name: 'Often' }, { name: 'Almost always' }]

// Helper for the recognition / likert descriptors (statement lives in title,
// field is the screen id, options are the shared response set).
const recog = (id, title, extra = {}) => ({
  id,
  kind: 'recognize',
  act: '3B',
  movement: 'B',
  field: id,
  mode: 'auto',
  title,
  options: RECOGNIZE_OPTIONS,
  ...extra,
})
const likert = (id, title) => ({
  id,
  kind: 'likert',
  act: '3C',
  movement: 'C',
  field: id,
  mode: 'auto',
  title,
  options: LIKERT_OPTIONS,
})

/* ════════════════════════════════════════════════════════════════════════
   FLOW — the Onboarding V2 sequence (full redesign).
   Cadence law: the user never answers more than 4 questions without a pause
   (a trust / education / hope screen). Option `name` strings MUST byte-match
   the TAGS keys above — that is the scoring contract.
   ════════════════════════════════════════════════════════════════════════ */

const OV_AGREE = [{ name: 'Sounds like me' }, { name: 'Sometimes' }, { name: 'Not really' }]
const OV_SCALE = [{ name: 'Rarely' }, { name: 'Sometimes' }, { name: 'Often' }, { name: 'Almost always' }]

export const FLOW = [
  /* ── Act 1 · arrive → engage → promise → trust (no bar) ── */
  {
    id: 'welcome', kind: 'welcome', act: 1, movement: null, mode: null, illo: 'welcome',
    title: 'There is a pattern under how you love.',
    sub: 'Kael helps you see it, and finally change it.',
    cta: 'Show me mine',
  },
  {
    id: 'hook', kind: 'select', act: 1, movement: null, field: 'hook', mode: 'ack',
    title: 'What brought you here?',
    sub: "Pick whatever's closest. There's no wrong answer.",
    cta: 'Continue',
    options: [
      { name: "I'm overthinking someone", icon: Brain },
      { name: 'We keep fighting', icon: Lightning },
      { name: 'They feel distant', icon: Wind },
      { name: "I'm healing from a breakup", icon: Heart },
      { name: 'I keep choosing the wrong people', icon: ArrowsClockwise },
      { name: 'I want to feel secure', icon: Anchor },
      { name: 'I just feel off', icon: Waves },
    ],
  },
  {
    id: 'payoff', kind: 'pause', act: 1, movement: null, mode: null,
    badge: Compass, kicker: 'Your read',
    title: "Let's build your read.",
    sub: 'A few honest questions. No right answers, no scores. Just you, seen clearly.',
    expect: ['About 3 minutes', 'Just tap', 'Private'],
    cta: 'Build my read',
  },
  {
    id: 'trust', kind: 'pause', act: 1, movement: null, mode: null,
    badge: ShieldCheck, kicker: 'Before we start',
    title: 'Private, secure, and expert-backed.',
    sub: 'Your world stays yours. Kael is built on attachment theory and real relationship science.',
    features: [
      { icon: LockKey, t: 'End-to-end private', s: 'No one reads your conversations but you.' },
      { icon: Books, t: 'Evidence based', s: 'Frameworks used by leading therapists.' },
    ],
    cta: 'I value my privacy',
  },

  /* ── Act 2 · about you (bar begins · segment "know") ── */
  {
    id: 'name', kind: 'input', act: 2, movement: null, field: 'name', mode: null,
    title: 'What should Kael call you?',
    sub: 'So Kael can speak to you, not at you.',
    placeholder: 'Your name',
    cta: 'Continue',
  },
  {
    id: 'age', kind: 'chips', act: 2, movement: null, field: 'age', mode: 'auto',
    title: 'How old are you?',
    sub: 'This shapes how Kael reads you.',
    options: [
      { name: '18 to 24' },
      { name: '25 to 34' },
      { name: '35 to 44' },
      { name: '45 to 54' },
      { name: '55+' },
    ],
  },
  {
    id: 'gender', kind: 'chips', act: 2, movement: null, field: 'gender', mode: 'auto',
    title: 'How do you identify?',
    sub: 'Some patterns play out differently by gender. This helps Kael read you more accurately.',
    options: [
      { name: 'Woman', icon: GenderFemale },
      { name: 'Man', icon: GenderMale },
      { name: 'Non-binary', icon: GenderNonbinary },
      { name: 'Prefer not to say', icon: CircleDashed },
    ],
  },

  /* break · how Kael listens */
  {
    id: 'break-listening', kind: 'pause', act: '3A', movement: null, mode: null,
    seg: 'know', segDone: true,
    badge: Ear, kicker: 'How this works',
    title: 'From here, Kael listens differently.',
    sub: "Not to what you say. To how you respond. That's where the pattern hides.",
    cta: 'Go on',
  },

  /* ── Act 3A · Movement A "where you are" ── */
  {
    id: 'relationship-state', kind: 'select', act: '3A', movement: 'A', field: 'relationship-state', mode: 'ack',
    title: 'Where are you in your love life right now?',
    cta: 'Continue',
    options: [
      { name: 'Single', icon: UserCircle },
      { name: 'Dating', icon: Sparkle },
      { name: 'In a situationship', icon: ArrowsSplit },
      { name: 'In a relationship', icon: Heart },
      { name: 'Married', icon: House },
      { name: 'Recently ended', icon: Wind },
      { name: "It's complicated", icon: Waves },
      { name: 'Trying to move on', icon: ArrowCounterClockwise },
    ],
  },
  {
    id: 'emotional-state', kind: 'mood', act: '3A', movement: 'A', field: 'emotional-state', mode: 'auto',
    title: 'Right now, you mostly feel...',
    sub: "Pick the one that's loudest today.",
    options: [
      { name: 'Anxious', icon: Spiral },
      { name: 'Hurt', icon: HeartBreak },
      { name: 'Confused', icon: CloudFog },
      { name: 'Hopeful', icon: SunHorizon },
      { name: 'Distant', icon: Wind },
      { name: 'Lonely', icon: MoonStars },
      { name: 'Numb', icon: SmileyMeh },
      { name: 'Overwhelmed', icon: Waves },
      { name: 'Calm but unsure', icon: Scales },
    ],
  },
  {
    id: 'conflict-style', kind: 'select', act: '3A', movement: 'A', field: 'conflict-style', mode: 'ack',
    title: 'When a fight starts, your first move is...',
    cta: 'Continue',
    options: [
      { name: 'Fix it right now', icon: Wrench },
      { name: 'Defend myself', icon: Shield },
      { name: 'Shut down', icon: Wind },
      { name: 'Give in to keep the peace', icon: Handshake },
      { name: 'Go cold', icon: Snowflake },
    ],
  },

  /* break · the mirror */
  {
    id: 'break-mirror', kind: 'pause', act: '3B', movement: null, mode: null,
    seg: 'A', segDone: true,
    badge: Eye, kicker: 'The mirror',
    title: "You can't see your own pattern from the inside.",
    sub: 'It hides in your reactions. The next part holds it up to the light.',
    cta: 'Hold it up',
  },

  /* ── Act 3B · Movement B "what runs underneath" · run 1 of 3 ── */
  { id: 'pattern-recognition-1', kind: 'recognize', act: '3B', movement: 'B', field: 'pattern-recognition-1', mode: 'auto', title: 'When someone I care about goes quiet, I imagine the worst.', options: OV_AGREE },
  { id: 'pattern-recognition-2', kind: 'recognize', act: '3B', movement: 'B', field: 'pattern-recognition-2', mode: 'auto', title: 'When things get tense, I pull back and go quiet.', options: OV_AGREE },
  { id: 'pattern-recognition-3', kind: 'recognize', act: '3B', movement: 'B', field: 'pattern-recognition-3', mode: 'auto', title: 'I replay conversations looking for what I did wrong.', options: OV_AGREE },
  { id: 'pattern-recognition-4', kind: 'recognize', act: '3B', movement: 'B', field: 'pattern-recognition-4', mode: 'auto', title: "I'll keep the peace instead of saying what I need.", options: OV_AGREE },

  /* break · not alone */
  {
    id: 'break-not-alone', kind: 'pause', act: '3B', movement: null, mode: null,
    seg: 'B', segPart: 0.4,
    badge: HandHeart, kicker: 'A note',
    title: "If some of these feel close to home, that's the pattern showing itself.",
    sub: "Nothing here is a flaw. It's how you learned to stay safe.",
    cta: 'Keep going',
  },

  /* ── Movement B · run 2 of 3 ── */
  { id: 'pattern-recognition-5', kind: 'recognize', act: '3B', movement: 'B', field: 'pattern-recognition-5', mode: 'auto', title: 'When I feel criticized, I get defensive fast.', options: OV_AGREE },
  { id: 'pattern-recognition-6', kind: 'recognize', act: '3B', movement: 'B', field: 'pattern-recognition-6', mode: 'auto', title: 'A slow reply can hijack my whole mood.', options: OV_AGREE },
  { id: 'belief-recognition-2', kind: 'recognize', act: '3B', movement: 'B', field: 'belief-recognition-2', mode: 'auto', belief: true, title: BELIEFS.abandonment.beat, options: OV_AGREE },
  { id: 'belief-recognition-3', kind: 'recognize', act: '3B', movement: 'B', field: 'belief-recognition-3', mode: 'auto', belief: true, title: BELIEFS.defectiveness.beat, options: OV_AGREE },

  /* break · the story underneath (keyed to the leading pattern) */
  {
    id: 'break-underneath', kind: 'pause', act: '3B', movement: null, mode: null,
    seg: 'B', segPart: 0.8,
    badge: MagnifyingGlass, kicker: 'Getting closer',
    keyed: 'afterB',
    cta: 'Get to it',
  },

  /* ── Movement B tail + Movement C head ── */
  { id: 'belief-recognition-5', kind: 'recognize', act: '3B', movement: 'B', field: 'belief-recognition-5', mode: 'auto', belief: true, title: BELIEFS.self_reliance_mistrust.beat, options: OV_AGREE },
  { id: 'belief-recognition-7', kind: 'recognize', act: '3B', movement: 'B', field: 'belief-recognition-7', mode: 'auto', belief: true, title: BELIEFS.deprivation.beat, options: OV_AGREE },
  { id: 'intensity-1', kind: 'likert', act: '3C', movement: 'C', field: 'intensity-1', mode: 'auto', title: 'Little things set me off, like a tone or a slow reply.', options: OV_SCALE },
  { id: 'intensity-2', kind: 'likert', act: '3C', movement: 'C', field: 'intensity-2', mode: 'auto', title: 'I need reassurance to feel okay in a relationship.', options: OV_SCALE },

  /* break · the alarm (keyed to the leading pattern) */
  {
    id: 'break-alarm', kind: 'pause', act: '3C', movement: null, mode: null,
    seg: 'C', segPart: 0.5,
    badge: Alarm, kicker: 'Worth knowing',
    keyed: 'afterC',
    cta: 'Almost there',
  },

  /* ── Movement C tail + Movement D ── */
  { id: 'intensity-3', kind: 'likert', act: '3C', movement: 'C', field: 'intensity-3', mode: 'auto', title: "I'd rather handle hard feelings alone than bring them up.", options: OV_SCALE },
  { id: 'intensity-4', kind: 'likert', act: '3C', movement: 'C', field: 'intensity-4', mode: 'auto', title: 'I worry I want too much from people.', options: OV_SCALE },
  {
    id: 'values', kind: 'value', act: '3D', movement: 'D', field: 'values', mode: null,
    title: 'In an ideal relationship, you feel...',
    sub: 'Pick up to three.',
    cta: 'Continue',
    options: [
      { name: 'Chosen', icon: HandHeart },
      { name: 'Safe', icon: Shield },
      { name: 'Desired', icon: Flame },
      { name: 'Understood', icon: ChatCircleText },
      { name: 'Free', icon: Bird },
      { name: 'Calm', icon: Waves },
      { name: 'Respected', icon: Medal },
      { name: 'Close', icon: UsersThree },
      { name: 'Secure', icon: Anchor },
    ],
  },
  {
    id: 'situation', kind: 'scenario', act: '3D', movement: 'D', field: 'situation', mode: null,
    title: "What's pulling at you right now?",
    sub: 'The thing actually on your mind today.',
    micro: "What's on your mind? (optional)",
    placeholder: 'Say it however it comes out.',
    cta: 'Continue',
    options: [
      { name: "A text I'm overthinking", icon: ChatCircleDots },
      { name: 'A fight we keep having', icon: Lightning },
      { name: 'Someone pulling away', icon: Wind },
      { name: "A breakup I'm not over", icon: HeartBreak },
      { name: "Mixed signals I can't read", icon: Shuffle },
      { name: 'I just want to feel more secure', icon: Anchor },
      { name: 'Something else', icon: PencilSimple },
    ],
  },

  /* ── Act 4 · calibration → the read (4 beats) → landing → notify → surface → paywall ── */
  { id: 'calibration', kind: 'calibration', act: 4, movement: null, mode: null, title: 'Building your read, [Name].' },
  { id: 'read-pattern', kind: 'read-pattern', act: 4, movement: null, mode: null, illo: 'reveal', step: 1, cta: 'Go on' },
  { id: 'read-triggers', kind: 'read-triggers', act: 4, movement: null, mode: null, step: 2, cta: 'Go on' },
  { id: 'read-belief', kind: 'read-belief', act: 4, movement: null, mode: null, step: 3, cta: 'Go on' },
  { id: 'read-path', kind: 'read-path', act: 4, movement: null, mode: null, step: 4, cta: 'One more thing' },
  {
    id: 'landing', kind: 'landing', act: 4, movement: null, mode: null,
    title: 'Whatever you do next, you saw something true about yourself today.',
    cta: 'Go on',
  },
  {
    id: 'notifications', kind: 'pause', act: 4, movement: null, mode: null,
    badge: BellSimple, kicker: 'One small thing',
    title: 'Want Kael to check in gently?',
    sub: 'A quiet nudge when it helps, never a pile of pings. You can change it anytime.',
    cta: 'Yes, check in on me',
    cta2: 'Not now',
  },
  {
    id: 'surface', kind: 'surface', act: 4, movement: null, mode: null,
    title: "You've scratched the surface.",
    sub: 'Your full read is waiting inside.',
    cta: 'See the full read',
  },
  { id: 'paywall', kind: 'paywall', act: 4, movement: null, mode: null },
]

/* "How Kael helps" lines — one per read beat. Sell as relief, in one line. */
export const SELLS = {
  pattern: 'Next time it starts, you talk to Kael in the moment. Kael knows this loop and walks you out, message by message.',
  triggers: 'Kael remembers your triggers and your people. You never have to re-explain the backstory.',
  belief: 'Most advice works on the surface. Kael works on the story underneath, until it loosens its grip.',
  path: 'Your journey page tracks the shift, conversation by conversation. You watch yourself get steadier.',
}

export const ACKS = {
  hook: {
    "I'm overthinking someone": "Your head's been loud about one person. We can quiet that down.",
    'We keep fighting': "Same fight on a loop is exhausting. There's usually one thing underneath it.",
    'They feel distant':
      "When someone pulls back, it's hard to think about anything else. Let's look at what that does to you.",
    "I'm healing from a breakup": "That takes real time, and you're already doing the work by being here.",
    'I keep choosing the wrong people':
      "If it keeps happening, that's a pattern. And patterns you can see, you can change.",
    'I want to feel secure': "Good. That's a thing you can build, and you're closer than it feels.",
    'I just feel off': "That's reason enough. Let's give the feeling some shape.",
  },
  'relationship-state': {
    Single: "Being on your own is its own kind of honest. Let's see what you bring to people.",
    Dating: "Early days have their own weather. Let's read yours.",
    'In a situationship': 'The undefined middle is hard on the nerves. Noted.',
    'In a relationship': "Then this is about how you two actually work, not whether you're together.",
    Married: "Long roads have their own patterns. Let's find yours.",
    'Recently ended': "That's still close. We'll go gently.",
    "It's complicated": "Most real things are. That's fine here.",
    'Trying to move on': "Moving on isn't a clean line. Let's see where you actually are.",
  },
  'conflict-style': {
    'Fix it right now': "You can't rest until it's resolved. That urgency tells us a lot.",
    'Defend myself': 'Getting your case out first feels safer. Makes sense.',
    'Shut down': "You go quiet to get steady. We'll come back to what that costs.",
    'Give in to keep the peace': 'Smoothing it over keeps things calm, and keeps you small. Noted gently.',
    'Go cold': 'Pulling the warmth is its own kind of armor.',
  },
}

/* ── INTERSTITIALS — per-pattern relief (afterB) + hope (afterC) ── */
export const INTERSTITIALS = {
  base: {
    afterB: "There's usually a quiet story running under all of this. We'll get to it.",
    afterC:
      'A trigger is just an old alarm firing too fast. Once you can see it, you can turn the volume down.',
  },
  reassurance_loop: {
    afterB:
      "You're not too needy, [Name]. You're trying to feel safe with the only tools you've got. There's a quieter way, and we're getting to it.",
    afterC:
      'The spike you feel when someone goes quiet is an old alarm that learned to fire fast. We can teach it to wait.',
  },
  meaning_making_spiral: {
    afterB:
      "Your mind fills the silence because not knowing is unbearable. There's a story underneath that, and we'll get to it.",
    afterC:
      "Your mind racing to fill the silence is a skill that's just pointed the wrong way. We'll aim it somewhere useful.",
  },
  self_abandonment: {
    afterB: "You've gotten good at reading everyone but yourself, [Name]. There's a reason you learned that. We'll get to it.",
    afterC:
      "The instinct to shrink kept things calm once. You don't have to disappear to stay close. That's learnable.",
  },
  defensive_strike: {
    afterB:
      "Getting there first has kept you safe. It also keeps people at arm's length. There's a softer thing underneath, and we'll get to it.",
    afterC:
      'The heat that comes up when you feel cornered is just your guard going up. You can feel it and still stay in the room.',
  },
  guarded_distance: {
    afterB: "Going quiet has protected you for a long time. It made sense once. We're getting to why.",
    afterC: 'The pull to go quiet is your system reaching for safety. You can find that safety without the door closing.',
  },
}

/* ── NARRATION — living narration on segment completion. [Name] is literal. ── */
export const NARRATION = {
  know: "Good to meet you, [Name]. Let's get into it.",
  A: 'Your patterns are coming through.',
  // Mid-B nudge: a living aside partway through the recognition stream so the
  // run of cards reads as Kael listening, not a survey.
  midB: "I'm noticing how you handle distance.",
  B: 'The story underneath is getting clearer.',
  C: "Triggers aren't flaws. They point to what you're trying to protect.",
  D: 'Almost there. Your read is taking shape.',
}

/* ── SECTION — warm section names per segment ── */
export const SECTION = {
  know: 'Getting to know you',
  A: 'Where you are',
  B: 'What runs underneath',
  C: 'How it hits you',
  D: 'Almost there',
}

/* ── ILLOS — illustration placeholder copy (blueprint §6) ── */
export const ILLOS = {
  welcome: {
    name: 'Signal medallion',
    ratio: '1x1',
    desc: 'A warm, premium emblem of a signal being read. Gold line-work on warm paper, calm and confident.',
  },
  reveal: {
    name: 'Reveal medallion',
    ratio: '1x1',
    desc: 'A crest of insight coming into focus as the pattern resolves. Pairs with the pattern name and hero line.',
  },
  loop: {
    name: 'The loop',
    ratio: '3x2',
    desc: 'Trigger, belief, reaction, cost, drawn by hand. Replaces the v1 code-drawn loop, and must be beautiful.',
  },
}

/* ── READS — polished per-pattern read-beat copy (PATTERN READS). [Name] literal. ── */
export const READS = {
  reassurance_loop: {
    hero: '[Name], you reach for clarity when what you really need is safety.',
    trigger: 'A slow reply, or one quiet word back.',
    inTheMoment:
      'Bring Kael the message before you send the third one, and answer from steady instead of scared.',
    secure: "You'll still feel the pull to check. You just won't have to act on it to feel okay.",
    belief:
      'that love is something you have to keep earning. You learned that somewhere, and back then it kept you close to people.',
  },
  meaning_making_spiral: {
    hero: "[Name], you build the whole story before they've even replied.",
    trigger: 'A silence, or a message that could mean two things.',
    inTheMoment: 'Bring Kael the silence, and check the story against the facts before you believe it.',
    secure: "You'll still notice the gaps. You just won't fill them all with the worst version.",
    belief:
      "that if you don't see it coming, it'll hurt more. You learned to read the room early, and once that's how you stayed safe.",
  },
  self_abandonment: {
    hero: '[Name], you keep the peace by going a little quiet on yourself.',
    trigger: 'Tension, or the sense someone might be let down.',
    inTheMoment: "Bring Kael the moment you're about to fold, and say the small true thing instead.",
    secure: "You'll still feel the pull to smooth it over. You just won't disappear to do it.",
    belief:
      'that the real you might be too much for people. You learned to shrink to stay wanted, and once that worked.',
  },
  defensive_strike: {
    hero: '[Name], you protect yourself by getting there first.',
    trigger: 'Feeling blamed, cornered, or unseen.',
    inTheMoment: 'Bring Kael the heat the second it rises, and stay in the room one beat longer than feels safe.',
    secure: "You'll still feel the flare. You just won't let it turn the moment into a standoff.",
    belief:
      "that if you're not ready to defend, you'll end up one-down. You learned to guard the door early, and once it kept you safe.",
  },
  guarded_distance: {
    hero: '[Name], you go quiet to feel safe, and it reads as gone.',
    trigger: "Pressure, or someone wanting more closeness than you've got room for.",
    inTheMoment: 'Bring Kael the urge to pull away, and name the need for space out loud instead of vanishing.',
    secure: "You'll still need room to breathe. You just won't have to disappear to get it.",
    belief: 'that getting close means losing yourself. You learned that space equals safety, and once that was true.',
  },
}

export default {
  PATTERN_IDS,
  PROFILE_FIELDS,
  BELIEFS,
  BELIEF_IDS,
  TRIGGER_LABELS,
  TAGS,
  RESPONSE_WEIGHT,
  LIKERT_WEIGHT,
  PATTERNS,
  PATTERN_START_DOT,
  secureLine,
  EMOTIONAL_LANDING,
  scorePattern,
  inferBelief,
  deriveProfile,
  assembleRead,
  buildRead,
  FLOW,
  ACKS,
  INTERSTITIALS,
  NARRATION,
  SECTION,
  ILLOS,
  READS,
}
