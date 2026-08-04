/* ──────────────────────────────────────────────────────────────────────────
   Kael V2 — Adaptive Therapy Journeys.

   The conversation determines the path. The structure determines the outcome.

   This file holds the spine (what a session is made of), the pinned arrival
   copy, and a LOCAL generator that satisfies the same contract the model does.
   With no API key the local generator drives the session so every screen type
   is reviewable; with a key, server/journey.js answers instead and nothing
   else in the UI changes.

   The local acks quote the user back, because that is the one technique that
   passes the cover test without understanding the sentence.
   ────────────────────────────────────────────────────────────────────────── */

/* ── the stage vocabulary ───────────────────────────────────────────────── */

export const STAGE_ORDER = ['understand', 'regulate', 'explore', 'reframe', 'practice', 'close']

export const STAGE_META = {
  understand: { name: 'Understand', goal: 'What actually happened' },
  regulate: { name: 'Settle', goal: 'Bring the body down' },
  explore: { name: 'The pattern', goal: 'Where else this runs' },
  reframe: { name: 'Another angle', goal: 'Hold the thought differently' },
  practice: { name: 'One move', goal: 'Something small, today' },
  close: { name: 'Close', goal: 'What shifted' },
}

/* a session is 13 screens. Long enough to move, short enough to finish. */
export const TOTAL_SCREENS = 13

/* the four that count as therapeutic exercises, for the artifact's
   "what helped" and for the north-star metric */
export const EXERCISE_TYPES = new Set(['breathe', 'ground', 'cbt', 'act'])

export const TYPE_LABEL = {
  listen: 'Listening', clarify: 'Clarifying', emotion: 'Naming it', body: 'Body',
  breathe: 'Breathing', ground: 'Grounding', cbt: 'Thought check', act: 'Defusion',
  teach: 'One idea', reflect: 'Reflecting', plan: 'Planning', close: 'Closing',
}

export const EXERCISE_LABEL = {
  breathe: 'Breathing', ground: 'Grounding', cbt: 'Evidence check', act: 'Thought defusion',
}

/* ── the arrival ────────────────────────────────────────────────────────── */

export const PINNED = {
  /* 1 · the door. Not "how can I help", which asks them to be a customer. */
  open: {
    kicker: 'Session',
    title: "What's here right now?",
    sub: "However it comes out is fine. I'll take it from there.",
    placeholder: 'Say it in your own words',
    options: [
      { label: "I can't stop replaying something", tags: ['overthinking'] },
      { label: "I'm running on empty", tags: ['burnout'] },
      { label: 'Everything feels tight and urgent', tags: ['anxiety'] },
      { label: "Something's off and I can't name it", tags: ['unclear'] },
    ],
  },

  /* 2 · the weight. One tap, and it tells Kael whether to regulate first. */
  weight: {
    title: 'How heavy is it today?',
    sub: 'This decides where we start.',
    marks: [
      { v: 1, label: 'Light' },
      { v: 2, label: 'There' },
      { v: 3, label: 'Loud' },
      { v: 4, label: 'Heavy' },
      { v: 5, label: 'A lot' },
    ],
    cta: 'Start the session',
  },

  /* 3 · the read. Real work is happening behind this, so the lines are
     honest rather than theatrical. */
  reading: [
    'Reading what you told me',
    'Sitting with {quote}',
    'Finding the thread',
    'Choosing where to start',
  ],

  /* 4 · the handoff into the artifact */
  building: [
    'Going back through the session',
    'Looking at what changed',
    'Writing it down for you',
  ],

  artifactKicker: "Today's Reflection",
}

/* ── the journeys ───────────────────────────────────────────────────────── */

/* The local catalog. The model names the journey for the person in their own
   language; this is the fallback's vocabulary, and the accent map that the UI
   reads either way. */
export const JOURNEYS = {
  overthinking: { name: 'The replay loop', accent: 'overthinking', promise: "We'll find what it's trying to solve, and where it stops paying." },
  anxiety: { name: 'Running ahead', accent: 'anxious', promise: "We'll slow it down first, then look at what it keeps predicting." },
  burnout: { name: 'Running on empty', accent: 'numb', promise: "We'll find what's draining and what one refill looks like today." },
  conflict: { name: 'The argument you keep having', accent: 'hurt', promise: "We'll get under the argument to the thing it's actually about." },
  lonely: { name: 'The quiet carry', accent: 'lonely', promise: "We'll look at what it costs to hold this alone." },
  'self-criticism': { name: 'The voice that grades you', accent: 'ashamed', promise: "We'll listen to how you talk to yourself, and try one other way." },
  decision: { name: 'Deciding without knowing', accent: 'overwhelmed', promise: "We'll separate what you know from what you fear." },
  grief: { name: "Carrying what's gone", accent: 'sad', promise: "We'll make room for it instead of managing it." },
  motivation: { name: 'The flat days', accent: 'low', promise: "We'll find the smallest true step, not the one you should take." },
  stress: { name: 'No gap in it', accent: 'stressed', promise: "We'll make one gap today and see what changes." },
  identity: { name: "Not sure who's driving", accent: 'overthinking', promise: "We'll look at whose voice you've been following." },
}

export const journeyAccent = (id) => `var(--mood-${JOURNEYS[id]?.accent || 'overthinking'})`

/* keyword read. Crude on purpose: it only has to be reasonable when there is
   no key, and it is never used when there is one. */
const THEME_TESTS = [
  ['overthinking', /replay|overthink|over-think|spiral|loop|rumina|can.?t stop think|going over/i],
  ['burnout', /burn(ed|t)? ?out|exhaust|empty|drained|no energy|running on/i],
  ['anxiety', /anxious|anxiety|panic|worry|worried|dread|on edge|tight|urgent/i],
  ['conflict', /argu|fight|partner|my (wife|husband|mom|dad|boss)|said to me|they keep/i],
  ['lonely', /lonely|alone|no ?one|nobody|isolat|by myself/i],
  ['self-criticism', /hard on myself|hate myself|stupid|not good enough|should have|my fault|failure/i],
  ['decision', /decide|decision|choose|choice|whether to|should i|stay or/i],
  ['grief', /grief|died|death|lost (her|him|them|my)|passed away|miss (her|him|them)/i],
  ['motivation', /motivat|can.?t get started|procrastin|pointless|flat|don.?t care/i],
  ['stress', /stress|too much|overwhelm|deadline|back to back|no time/i],
  ['identity', /who i am|myself anymore|lost myself|identity|pretend/i],
]

export function readTheme(text = '', tags = []) {
  const t = String(text)
  const direct = tags.find((g) => JOURNEYS[g])
  if (direct) return direct
  const hit = THEME_TESTS.find(([, re]) => re.test(t))
  return hit ? hit[0] : 'stress'
}

/* ── quoting ────────────────────────────────────────────────────────────── */

export function fragment(text = '', max = 44) {
  const t = String(Array.isArray(text) ? text.join(', ') : text).trim().replace(/\s+/g, ' ')
  if (!t) return ''
  if (t.length <= max) return `"${t}"`
  const cut = t.slice(0, max)
  const sp = cut.lastIndexOf(' ')
  return `"${(sp > 18 ? cut.slice(0, sp) : cut).trim()}…"`
}

const lower = (s = '') => (s ? s.charAt(0).toLowerCase() + s.slice(1) : s)

/* ── the local generator ────────────────────────────────────────────────── */

/* A fixed spine that visits every screen type once. The model reorders and
   rewrites all of this; the spine only has to make the design reviewable and
   the flow honest when there is no key. */

const QUOTE_ACKS = [
  '{q} I want to hold onto that.',
  'You said {q}. That stays with me.',
  '{q} Okay. That tells me something.',
  '{q} I heard that.',
]

/* Screens that are not questions come back with a synthetic value ("read the
   idea"), and quoting that would be nonsense. They get an ack about the thing
   that just happened instead. */
const DID_ACKS = {
  breathe: 'Your body just did something your head cannot argue with.',
  ground: 'Back in the room. That is the whole trick of it.',
  teach: "Okay. Now let's hold it against something real.",
  act: 'That half step of distance is the part worth practising.',
  cbt: 'Reading both sides back, the second one is usually thinner than it felt.',
}

/* the ack for a screen, built from the previous answer */
function localAck(prev, i = 0) {
  if (!prev) return ''
  if ((prev.tags || []).includes('skipped')) return 'Fine. We can come back to it if the room gets loud again.'
  if (DID_ACKS[prev.type]) return DID_ACKS[prev.type]
  if (prev.typed) return QUOTE_ACKS[i % QUOTE_ACKS.length].replace('{q}', fragment(prev.value))
  const v = Array.isArray(prev.value) ? prev.value[0] : prev.value
  return v ? `${String(v).replace(/\.$/, '')}. Noted.` : ''
}

const SPINE = [
  { stage: 'understand', type: 'listen' },
  { stage: 'understand', type: 'clarify' },
  { stage: 'regulate', type: 'breathe' },
  { stage: 'explore', type: 'emotion' },
  { stage: 'explore', type: 'body' },
  { stage: 'explore', type: 'clarify' },
  { stage: 'regulate', type: 'ground' },
  { stage: 'reframe', type: 'teach' },
  { stage: 'reframe', type: 'cbt' },
  { stage: 'reframe', type: 'act' },
  { stage: 'practice', type: 'plan' },
  { stage: 'close', type: 'reflect' },
  { stage: 'close', type: 'close' },
]

/* per-type copy for the fallback. Written once, properly, because a reviewer
   with no key sees only this. */
function localBody({ type, theme, transcript = [], prev }) {
  const first = transcript[0]?.value || 'what you came in with'
  const thought = transcript.find((t) => t.typed && t.type !== 'listen')?.value || first
  const feeling = transcript.find((t) => t.type === 'emotion')?.value
  const region = transcript.find((t) => t.type === 'body')?.value

  switch (type) {
    case 'listen':
      return {
        title: 'Start where it actually starts. What happened?',
        body: 'The version you would tell a friend, not the tidy one.',
        placeholder: 'What happened',
        options: [
          { label: 'Something specific today', tags: ['event'] },
          { label: "It's been building for a while", tags: ['chronic'] },
          { label: 'Nothing happened, that\'s the strange part', tags: ['diffuse'] },
        ],
        cta: 'Next',
      }

    case 'clarify':
      return {
        title: 'What part of it are you still carrying?',
        body: '',
        placeholder: 'The part that stayed',
        options: [
          { label: 'Something I said', tags: ['self'] },
          { label: 'Something they said', tags: ['other'] },
          { label: 'How it left me feeling', tags: ['feeling'] },
          { label: "I'm not sure yet", tags: ['unclear'] },
        ],
        cta: 'Next',
      }

    case 'emotion':
      return {
        title: 'Which one is loudest right now?',
        body: 'Not the one that makes sense. The one that is actually here.',
        placeholder: 'or name it yourself',
        options: [
          { label: 'Anxious', tags: ['anxious'] },
          { label: 'Tired of it', tags: ['numb'] },
          { label: 'Angry, underneath', tags: ['angry'] },
          { label: 'Ashamed', tags: ['ashamed'] },
        ],
        cta: 'Next',
      }

    case 'body':
      return {
        title: 'Where does it sit in your body?',
        body: 'Feelings usually arrive somewhere before you notice them.',
        placeholder: 'or describe it',
        options: [
          { label: 'Chest, tight', tags: ['chest'] },
          { label: 'Jaw and shoulders', tags: ['jaw'] },
          { label: 'Stomach', tags: ['stomach'] },
          { label: "Nowhere I can find", tags: ['numb'] },
        ],
        cta: 'Next',
      }

    case 'breathe':
      return {
        title: 'Before we go further, four rounds.',
        body: 'A long exhale is the one switch you can reach on purpose. It tells the body the emergency is over.',
        pattern: theme === 'anxiety' || theme === 'stress' ? '4-7-8' : '4-4-4-4',
        placeholder: '',
        options: [],
        cta: "I'm done",
      }

    case 'ground':
      return {
        title: 'Come back into the room for a second.',
        body: '',
        steps: [
          'Name five things you can see from where you are.',
          'Four you could reach out and touch.',
          'Three sounds underneath the loudest one.',
          'One thing you can smell, or the temperature of the air.',
        ],
        placeholder: '',
        options: [],
        cta: 'Back',
      }

    case 'teach':
      return {
        title: 'Your brain files replaying under problem solving.',
        body: '',
        steps: [
          'Replaying feels productive because it uses the same machinery as planning.',
          'The difference is that planning ends in a decision, and replaying ends in another replay.',
          `That is why ${lower(String(first)).slice(0, 40)}… can run for an hour and leave you with nothing new.`,
        ],
        placeholder: '',
        options: [],
        cta: 'That tracks',
      }

    case 'cbt':
      return {
        title: `The thought underneath: ${fragment(thought, 52)}`,
        body: 'Two questions, honestly answered. Take the second one seriously.',
        steps: [
          'What actually supports this thought?',
          "What doesn't, that you keep skipping past?",
        ],
        placeholder: 'Write what comes',
        options: [],
        cta: 'Done',
      }

    case 'act':
      return {
        title: 'Try putting one step between you and it.',
        body: '',
        steps: [
          `The thought: ${String(thought).slice(0, 80)}`,
          `Now say it this way: "I'm noticing the thought that ${lower(String(thought)).slice(0, 70)}"`,
          'Same words. Slightly further away. That gap is the whole exercise.',
        ],
        placeholder: '',
        options: [],
        cta: 'Felt the gap',
      }

    case 'plan':
      return {
        title: 'One small thing, today. Which one is actually possible?',
        body: 'Sized for the state you are in, not the one you wish you were in.',
        placeholder: 'or something of your own',
        options: [
          { label: 'Say one true sentence out loud to someone', tags: ['reach'] },
          { label: 'Ten minutes outside, no phone', tags: ['body'] },
          { label: `Catch ${feeling ? lower(String(feeling)) : 'it'} once and name it`, tags: ['notice'] },
        ],
        cta: "That's the one",
      }

    case 'reflect':
      return {
        title: 'Anything sitting differently than when we started?',
        body: 'Honest answers only. Nothing shifted is a real answer.',
        placeholder: 'What changed, if anything',
        options: [
          { label: "It's quieter than it was", tags: ['relief'] },
          { label: 'Clearer, not lighter', tags: ['clarity'] },
          { label: 'Nothing yet', tags: ['none'] },
        ],
        cta: 'Next',
      }

    case 'close':
    default:
      return {
        title: `You came in carrying ${fragment(first, 40)} and you stayed with it long enough to see the shape of it. ${region ? `Your ${String(region).toLowerCase()} told you before your head did. ` : ''}That is the work.`,
        body: "I've written this down. It'll be here next time.",
        placeholder: '',
        options: [],
        cta: 'See my reflection',
      }
  }
}

export function localScreen({ screenNo, theme = 'stress', transcript = [] }) {
  const node = SPINE[Math.min(screenNo - 1, SPINE.length - 1)]
  const prev = transcript[transcript.length - 1]
  const copy = localBody({ type: node.type, theme, transcript, prev })
  return {
    stage: node.stage,
    type: node.type,
    ack: localAck(prev, screenNo),
    title: copy.title,
    body: copy.body || '',
    options: copy.options || [],
    placeholder: copy.placeholder || '',
    steps: copy.steps || [],
    pattern: copy.pattern || '',
    cta: copy.cta || 'Continue',
    flag: 'none',
  }
}

export function localStart({ arrival, tags = [], mood = 3 }) {
  const theme = readTheme(arrival, tags)
  const j = JOURNEYS[theme]
  /* regulate only earns a place when the weight says the body is loud */
  const ids = mood >= 3
    ? ['understand', 'regulate', 'explore', 'reframe', 'practice', 'close']
    : ['understand', 'explore', 'reframe', 'practice', 'close']
  return {
    journey: {
      id: theme,
      name: j.name,
      read: `You said ${fragment(arrival)}. I think that is the thread.`,
      promise: j.promise,
    },
    stages: ids.map((id) => ({ id, ...STAGE_META[id] })),
    screen: localScreen({ screenNo: 1, theme, transcript: [] }),
  }
}

/* ── the local artifact ─────────────────────────────────────────────────── */

export function localArtifact({ journey, transcript = [], exercises = [] }) {
  const said = transcript.filter((t) => t.value && t.value.length)
  /* a CBT answer arrives as two lines; everything else is one */
  const text = (v) => String(Array.isArray(v) ? v.filter(Boolean).join('. ') : v)
  const by = (type) => said.find((t) => t.type === type)?.value
  const val = (type, fb = '') => {
    const v = by(type)
    return v ? text(v) : fb
  }
  const first = val('listen', 'what you came in with')
  const feel = val('emotion', 'heavy')
  const region = val('body')
  const shifted = val('reflect', 'nothing yet')
  const action = said.find((t) => t.type === 'plan')?.value

  return {
    title: `The day ${lower(first).slice(0, 46)}`,
    summary: `${journey?.name || 'This session'}, walked through once, all the way to the end.`,
    happened: `You came in with ${fragment(first)}. We slowed it down, found where it sits, and looked at what it has been trying to do for you.`,
    feeling: [feel, region ? 'held in the body' : 'unnamed for a while'].filter(Boolean).slice(0, 3),
    pattern: {
      name: journey?.name || 'The loop',
      detail: 'It starts as an attempt to get ahead of something going wrong. It keeps running because it never reaches a decision, so nothing ever tells it to stop.',
    },
    thinking: {
      name: 'Your mind jumps to the worst version and stops there',
      detail: 'The worst version arrives with detail and certainty. The ordinary version arrives with neither, so it loses.',
      /* a quote has to be something they actually wrote; an empty exercise
         field is not evidence of anything */
      quote: text(said.find((t) => t.typed && !/\(nothing\)/.test(text(t.value)))?.value || first),
    },
    shift: shifted === 'nothing yet'
      ? 'Nothing lifted today, and you said so plainly instead of performing progress. That is worth more than a tidy answer.'
      : `You said: "${shifted}". That came from staying with it, not from solving it.`,
    absence: 'You described what happened in detail and almost nothing about how it felt while it was happening.',
    action: {
      move: action ? String(Array.isArray(action) ? action[0] : action).split(' ').slice(0, 5).join(' ') : 'Catch it once',
      how: `Once today, when it starts, name it out loud: "this is ${lower(journey?.name || 'the loop')}". Naming it early is most of the interrupt.`,
      when: 'Tonight, when the room goes quiet',
    },
    prompt: `What would you have said to ${fragment(first, 30)} if a friend had said it to you first?`,
    note: `You stayed with something uncomfortable for a whole session instead of putting it down. ${region ? `And you now know your ${String(region).toLowerCase()} gets there before your thinking does. ` : ''}That is the part that gets easier.`,
    exercises,
  }
}

/* ── the transport ──────────────────────────────────────────────────────── */

/* If the route is absent or fails, fall through to the local generator so the
   session never stalls on a network problem. */
const post = async (url, body) => {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!r.ok) throw new Error(String(r.status))
  return r.json()
}

export async function fetchStart(body) {
  try {
    const out = await post('/api/journey/start', body)
    if (!out?.journey?.name || !out?.screen?.title || !Array.isArray(out.stages)) throw new Error('bad shape')
    return { ...out, source: 'model' }
  } catch {
    return { ...localStart(body), source: 'local' }
  }
}

export async function fetchNext(body) {
  try {
    const out = await post('/api/journey/next', body)
    if (!out?.title || !out?.type) throw new Error('bad shape')
    return { ...out, source: 'model' }
  } catch {
    return { ...localScreen(body), source: 'local' }
  }
}

export async function fetchArtifact(body) {
  try {
    const out = await post('/api/journey/artifact', body)
    if (!out?.title || !out?.pattern || !out?.action) throw new Error('bad shape')
    return { ...out, exercises: body.exercises || [], source: 'model' }
  } catch {
    return { ...localArtifact(body), source: 'local' }
  }
}

/* ── breathing ──────────────────────────────────────────────────────────── */

/* "4-7-8" → the phases a ring can animate. Two numbers is in/out, three is
   in/hold/out, four is box. */
export function breathPhases(pattern = '4-4-4-4') {
  const n = String(pattern).split('-').map((x) => parseInt(x, 10)).filter((x) => x > 0 && x < 20)
  const p = n.length >= 2 ? n : [4, 4, 4, 4]
  if (p.length === 2) return [{ label: 'Breathe in', s: p[0], grow: true }, { label: 'Out', s: p[1], grow: false }]
  if (p.length === 3) return [
    { label: 'Breathe in', s: p[0], grow: true },
    { label: 'Hold', s: p[1], hold: true },
    { label: 'Out, slowly', s: p[2], grow: false },
  ]
  return [
    { label: 'Breathe in', s: p[0], grow: true },
    { label: 'Hold', s: p[1], hold: true },
    { label: 'Out', s: p[2], grow: false },
    { label: 'Hold', s: p[3], hold: true },
  ]
}
