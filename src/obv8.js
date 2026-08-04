/* ──────────────────────────────────────────────────────────────────────────
   Kael V8 — Session Zero.

   The onboarding is the user's first session, and it ends in a Reflection.
   Two screen types only: Kael speaks (ack / noticing / frame), or Kael asks
   (question + options + composer). See ONBOARDING_V8_SPEC.md.

   This file holds the spine, the pinned copy, and a LOCAL generator that
   satisfies the same JSON contract the model does. With no API key the local
   generator drives the flow so the design is reviewable; with a key, the
   middleware in vite.config.js answers instead and nothing else changes.

   The local acks quote the user back, because that is the one technique that
   passes the cover test without understanding the sentence.
   ────────────────────────────────────────────────────────────────────────── */

/* ── the spine ──────────────────────────────────────────────────────────── */

/* slot → what has to happen there. `free` slots draw from FREE_SET in order,
   which the model is allowed to reorder and the local generator is not.

   Age and gender live in the ARRIVAL act, before the frame's promise, where
   the register is still setup. Once the session starts and someone has told
   you what they're carrying, a form question reads as not listening. The
   acks are the session's breathing; it never needed demographic breaks. */
export const SPINE = [
  { slot: 1, territory: 'AGE', weight: 'light', arrival: true },
  { slot: 2, territory: 'GENDER', weight: 'light', arrival: true },
  { slot: 3, territory: 'OPENING', weight: 'heavy', pinned: true },
  { slot: 4, territory: null, weight: 'free' },
  { slot: 5, territory: null, weight: 'free' },
  { slot: 6, territory: null, weight: 'free' },
  { slot: 7, territory: null, weight: 'free' },
  { slot: 8, territory: null, weight: 'free' },
  { slot: 9, territory: null, weight: 'free' },
  { slot: 10, territory: 'WANT', weight: 'heavy', pinned: true },
]

/* the six the model orders freely; all must be covered */
export const FREE_SET = ['DURATION', 'BODY', 'DAYS', 'VOICE', 'REACH', 'PEOPLE']

export const TOTAL_ASKS = SPINE.length
/* after this slot the frame screen delivers the promise and the session begins */
export const FRAME_AFTER = 2
/* the noticing lands after slot 6: four session questions in, the midpoint */
export const NOTICING_AFTER = 6
/* demographic answers get no ack; there is nothing worth saying about "26" */
export const LIGHT = new Set(['AGE', 'GENDER'])

/* a pinned ask served without a model call; the arrival act is a fast, honest
   form, and the session that follows is not */
export function pinnedAsk(territory, slot) {
  const t = TERRITORIES[territory]
  return {
    slot,
    territory,
    question: t.question,
    options: (t.options || []).map((o) => ({ label: o.label, tags: o.tags, ack: o.ack })),
    placeholder: t.placeholder || 'or say it your way…',
    insight: t.why || null,
  }
}

/* ── pinned copy ────────────────────────────────────────────────────────── */

export const PINNED = {
  /* 1 · The intro. Not about Kael, about them: the session's payoff is a
     named pattern, so the first screen promises exactly that. The paywall
     letter closes this same sentence ("One session later, it has one"). */
  meet: {
    title: "What you're carrying has a name.",
    sub: "I'm Kael. Talk to me for three minutes and I'll find it.",
    cta: 'Start talking',
  },

  /* 2 · Name. The only ask with no options, which says the composer is real. */
  name: {
    question: 'Before we start, what should I call you?',
    placeholder: 'Your name',
  },

  /* 3 · The frame. Three jobs: the name lands warm (lead), permission to be
     messy arrives right before the first heavy question (body), and the
     promise the whole session is collateral for sits behind the gold rule. */
  /* the greeting already happened right after the name; the frame marks the
     register shift instead: the form is over, the session begins */
  frame: {
    lead: "Now it's just us, {name}.",
    body: "I'm going to ask you a few things. Nothing you say needs to be tidy.",
    promise: "When we're done, I'll tell you what I see.",
    cta: 'Okay',
  },

  /* Slot 1 · the opening ask. The one question we do not generate, because a
     flat first impression costs more than a rigid one. */
  opening: {
    territory: 'OPENING',
    question: "So. What's been on your mind lately?",
    placeholder: 'Say it however it comes out',
    options: [
      { label: "I can't stop overthinking", tags: ['overthinking'], ack: "The not stopping is the part that wears you down." },
      { label: 'Everything feels heavy', tags: ['low'], ack: 'Heavy is a good word for it. It has weight, not shape.' },
      { label: "I'm stressed and it won't let up", tags: ['stress'], ack: "Won't let up. So there's no gap in it." },
      { label: "Honestly, I'm not sure", tags: ['unclear'], ack: "Not sure is a real answer. We can find it together." },
    ],
  },

  /* the handoff into the build */
  handoff: {
    lead: 'I think I have enough.',
    body: 'Give me a minute. I want to put this down properly.',
    cta: 'Okay',
  },

  /* the build loader. Stages quote the user, so dead time is one more proof
     of attention rather than a spinner. */
  stages: [
    'Reading what you told me',
    'Sitting with {quote}',
    'Looking for the thread',
    'Writing it down',
  ],

  /* the notification ask sits BEFORE the reveal, while anticipation is at
     its peak and the report is still generating behind the screen */
  notify: {
    lines: [
      'While I put this down, one thing.',
      "There's something in here I'll want to come back to. Can I check in with you in a few days?",
    ],
    yes: 'Yes, check in',
    no: 'Not now',
  },

  /* the road: what the 30 days after the report look like */
  road: {
    kicker: 'The road',
    title: 'Breaking it takes about 30 days.',
    miles: [
      { when: 'Today', t: 'It has a name', d: 'The loop is on paper. That alone loosens its grip.' },
      { when: 'Day 3', t: 'You catch it live', d: 'Kael flags the loop while it is happening, not after.' },
      { when: 'Day 7', t: 'The first interrupt', d: 'It starts, you see it, and you put it down early. Once.' },
      { when: 'Day 30', t: 'It stops running the show', d: 'The loop still visits. It no longer decides your night.' },
    ],
    cta: 'I want that',
  },

  /* the paywall: a note, not a feature grid */
  pay: {
    kicker: 'A note from Kael',
    letter: [
      'You walked in carrying something without a name. One session later, it has one.',
      'Naming it was the easy part. Breaking it takes the daily work, catching it live, and a coach who remembers everything you just told me.',
      'That is the part we do together.',
    ],
    plans: [
      { id: 'annual', name: 'Annual', sub: '7 days free, then $69.99 per year', price: '$5.83', per: '/month', tag: 'Save 44%' },
      { id: 'monthly', name: 'Monthly', sub: '7 days free, then billed monthly', price: '$9.99', per: '/month' },
    ],
    cta: 'Start my 7 days free',
    sub: "Cancel anytime. I'll remind you before the trial ends.",
    links: ['Privacy', 'Terms', 'Restore'],
  },
}

/* ── the territories ────────────────────────────────────────────────────── */

/* Each option carries the ack it earns, so the local generator never has to
   write a line that would fail the cover test. */
export const TERRITORIES = {
  DURATION: {
    weight: 'medium',
    question: 'How long has it been like this?',
    placeholder: 'or say it your way…',
    options: [
      { label: 'A few weeks', tags: ['recent'], ack: 'A few weeks. So this is still new.' },
      { label: 'Most of this year', tags: ['chronic'], ack: 'Most of this year is a long time to hold something.' },
      { label: 'Honestly, years', tags: ['chronic', 'old'], ack: "Years. Then it's less an event and more a climate." },
      { label: 'It comes and goes', tags: ['cyclic'], ack: 'Comes and goes. I want to know what brings it back.' },
    ],
  },

  BODY: {
    weight: 'heavy',
    why: 'Stress tends to land somewhere before you notice it.',
    question: "When it's loudest, where do you feel it?",
    placeholder: 'or describe it…',
    options: [
      { label: 'My chest gets tight', tags: ['chest'], ack: 'Tight chest. Your body gets there before you do.' },
      { label: 'My jaw and shoulders', tags: ['jaw'], ack: 'Jaw and shoulders. You brace without deciding to.' },
      { label: "I can't sleep", tags: ['sleep'], ack: "Sleep. That's the hour with nothing to distract you." },
      { label: 'Honestly, nowhere', tags: ['numb'], ack: 'Nowhere. Sometimes that means the volume is turned down.' },
    ],
  },

  DAYS: {
    weight: 'medium',
    question: 'What does a normal day hold right now?',
    placeholder: 'or tell me about it…',
    options: [
      { label: 'Work, and not much else', tags: ['work'], ack: 'Work and not much else. The day has one shape.' },
      { label: 'Too much, back to back', tags: ['busy'], ack: 'Back to back. No room between things to feel them.' },
      { label: "I'm between things right now", tags: ['transition'], ack: 'Between things. That has its own kind of pressure.' },
      { label: 'It changes constantly', tags: ['unstable'], ack: 'Constantly changing. Hard to find footing in that.' },
    ],
  },

  VOICE: {
    weight: 'heavy',
    question: 'When you get something wrong, what do you say to yourself?',
    placeholder: 'the actual words, if you can…',
    options: [
      { label: "I should have known better", tags: ['critic'], ack: '"Should have known better." That one has practice behind it.' },
      { label: 'I replay it for days', tags: ['rumination'], ack: 'Days of replay. The review never seems to close.' },
      { label: 'I brush it off, mostly', tags: ['avoid'], ack: "Brushed off. I'd like to know where it goes instead." },
      { label: "I'm harder on myself than anyone", tags: ['critic'], ack: 'Harder on yourself than anyone else would be.' },
    ],
  },

  REACH: {
    weight: 'heavy',
    question: 'When it gets bad, what do you reach for?',
    placeholder: 'no wrong answer here…',
    options: [
      { label: 'My phone, for hours', tags: ['scroll'], ack: 'Hours on the phone. It made sense at some point.' },
      { label: 'I keep busy', tags: ['busy'], ack: 'Busy. Motion is a way of not sitting still with it.' },
      { label: 'I go quiet', tags: ['withdraw'], ack: 'Quiet. You go somewhere no one can follow.' },
      { label: 'Something to take the edge off', tags: ['numb'], ack: 'Taking the edge off. That works, right up until it does not.' },
    ],
  },

  PEOPLE: {
    weight: 'medium',
    question: 'Who gets the real version of you?',
    placeholder: 'a name, or no one…',
    options: [
      { label: 'One person, sort of', tags: ['one'], ack: 'Sort of. So they have part of it.' },
      { label: 'My partner', tags: ['partner'], ack: 'Your partner. Do they get the version you tell me?' },
      { label: 'A friend or two', tags: ['friends'], ack: 'A friend or two. Small circle, then.' },
      { label: 'Nobody, really', tags: ['alone'], ack: 'Nobody. You have been carrying this on your own.' },
    ],
  },

  AGE: {
    weight: 'light',
    why: "Two quick ones first, so I know who I'm talking to.",
    question: 'How old are you?',
    placeholder: 'or type it…',
    options: [
      { label: '18 to 24', tags: ['18-24'] },
      { label: '25 to 34', tags: ['25-34'] },
      { label: '35 to 44', tags: ['35-44'] },
      { label: '45 or older', tags: ['45+'] },
    ],
  },

  GENDER: {
    weight: 'light',
    question: 'And how do you identify?',
    placeholder: 'or say it your way…',
    options: [
      { label: 'Woman', tags: ['woman'] },
      { label: 'Man', tags: ['man'] },
      { label: 'Non-binary', tags: ['nb'] },
      { label: 'Prefer not to say', tags: ['na'] },
    ],
  },

  WANT: {
    weight: 'heavy',
    question: 'Last one. If something felt lighter a month from now, what would you notice first?',
    placeholder: 'be greedy about it…',
    options: [
      { label: 'My head would be quieter', tags: ['quiet'], ack: 'Quieter. Not empty, just quieter.' },
      { label: "I'd stop bracing all the time", tags: ['ease'], ack: 'Not bracing. That is a whole muscle set relaxing.' },
      { label: "I'd be kinder to myself", tags: ['kind'], ack: 'Kinder. You would give yourself what you give everyone else.' },
      { label: "I'd actually sleep", tags: ['sleep'], ack: 'Sleep. Everything is heavier without it.' },
    ],
  },
}

/* ── free-text acks ─────────────────────────────────────────────────────── */

/* The only reliably safe move when we cannot understand the sentence: hand a
   fragment of it back. It always passes the cover test, because it literally
   cannot be written without having read the answer. */
const QUOTE_ACKS = [
  '{q} I want to hold onto that.',
  '{q} I heard that.',
  'You said {q}. That stays with me.',
  '{q} Say more about that when you want to.',
  '{q} Okay. That tells me something.',
]

/* shortest useful fragment of what they typed, in quotes */
export function fragment(text = '') {
  const t = String(text).trim().replace(/\s+/g, ' ')
  if (!t) return ''
  if (t.length <= 46) return `"${t}"`
  const cut = t.slice(0, 46)
  const sp = cut.lastIndexOf(' ')
  return `"${(sp > 20 ? cut.slice(0, sp) : cut).trim()}…"`
}

/* ── the local generator ────────────────────────────────────────────────── */

const cap = (s = '') => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s)

/* tags are words a person would use, not slugs. The real ones come from the
   model in their own language; these are the fallback's vocabulary. */
const TAG_WORDS = {
  overthinking: 'Overthinking', low: 'Heavy', stress: 'Stress', unclear: 'Unsure',
  recent: 'Recent', chronic: 'Long-running', old: 'Old', cyclic: 'Comes and goes',
  chest: 'Tight chest', jaw: 'Braced', sleep: 'Sleep', numb: 'Numb',
  work: 'Work', busy: 'Overloaded', transition: 'In between', unstable: 'Unsteady',
  critic: 'Inner critic', rumination: 'Replaying', avoid: 'Avoiding',
  scroll: 'Scrolling', withdraw: 'Going quiet',
  one: 'One person', partner: 'Partner', friends: 'Friends', alone: 'Carrying it alone',
  quiet: 'A quieter head', ease: 'Ease', kind: 'Self-kindness',
}
const tagLabel = (t) => TAG_WORDS[t] || cap(t)

/* what territory the local generator serves at this slot */
export function territoryFor(slot, covered = []) {
  const node = SPINE.find((s) => s.slot === slot)
  if (!node) return null
  if (node.territory) return node.territory
  return FREE_SET.find((t) => !covered.includes(t)) || null
}

/* the noticing. Deliberately the hardest line in the session to write, and the
   strongest form of it names an ABSENCE. */
export function localNoticing(turns = []) {
  /* arrival demographics say nothing about how someone talks */
  const said = turns.filter((t) => !LIGHT.has(t.territory))
  const typed = said.filter((t) => t.typed)
  const picked = said.filter((t) => !t.typed)
  if (typed.length === 0) {
    return ['You have taken every option I offered.', "I'd like to hear one of these in your own words."]
  }
  if (typed.length >= 2 && picked.length <= 1) {
    return ["You keep writing your own answers instead of taking mine.", 'That tells me you have thought about this before.']
  }
  return ['You have told me a lot about what happened.', 'Almost nothing about how it felt.']
}

/* one turn, in the model's contract shape */
export function localTurn({ slot, last, covered = [], insightsLeft = 3 }) {
  const territory = territoryFor(slot, covered)
  if (!territory) return null

  const t = territory === 'OPENING' ? PINNED.opening : TERRITORIES[territory]
  const prevLight = last && LIGHT.has(last.territory)

  let ack = null
  if (last && !prevLight) {
    if (last.typed) {
      const q = fragment(last.value)
      const pick = QUOTE_ACKS[(slot * 3) % QUOTE_ACKS.length]
      ack = pick.replace('{q}', q)
    } else {
      ack = last.ack || null
    }
  }

  /* the "why I'm asking" clause is rationed: only where a question is
     genuinely intrusive, and never more than twice a session */
  const insight = t.why && insightsLeft > 0 ? t.why : null

  return {
    ack,
    insight,
    question: t.question,
    options: (t.options || []).map((o) => ({ label: o.label, tags: o.tags, ack: o.ack })),
    placeholder: t.placeholder || 'or say it your way…',
    territory,
    flag: 'none',
  }
}

/* ── the Reflection ─────────────────────────────────────────────────────── */

/* Local scaffold. It demonstrates the report STRUCTURE (a named pattern,
   the loop, verbatim evidence, the absence, the break plan) so the page can
   be designed; the real writing comes from the model. */
export function localReflection({ turns = [], name = 'you' }) {
  const said = turns.filter((t) => t.value && !LIGHT.has(t.territory) && t.territory !== 'SUMMARY')
  const byTerr = (terr) => said.find((t) => t.territory === terr)
  /* typed answers carry no tags, so the pattern picker also reads the words */
  const typedText = said.filter((t) => t.typed).map((t) => String(t.value).toLowerCase()).join(' ')
  const has = (tag, words) => said.some((t) => (t.tags || []).includes(tag)) || (words ? words.test(typedText) : false)
  const val = (terr, fb = '') => (byTerr(terr)?.value || fb)

  /* the pattern, named in plain language, never clinical */
  const pattern = has('rumination', /replay|rumina|over ?think|spiral|loop|can.t stop think/) || has('overthinking')
    ? 'The replay loop'
    : has('critic', /should have|hard on myself|my fault|stupid|idiot/)
      ? 'The harsh replay'
      : has('numb', /numb|nothing at all|feel nothing/) || has('avoid')
        ? 'The numbing detour'
        : has('alone', /no ?one|nobody|by myself|alone/) || has('withdraw')
          ? 'The quiet carry'
          : 'The steady brace'

  const essence = has('alone') || has('withdraw')
    ? 'It gets carried alone, so it never gets put down.'
    : 'It runs at night because it never gets interrupted by day.'

  /* which answers the pattern actually showed up in, counted honestly */
  const PATTERN_TAGS = new Set(['rumination', 'overthinking', 'critic', 'numb', 'avoid', 'alone', 'withdraw', 'scroll', 'sleep', 'chronic', 'stress', 'low'])
  const hits = said.filter((t) => t.typed || (t.tags || []).some((x) => PATTERN_TAGS.has(x))).length

  /* the loop, in their own words wherever possible */
  const loop = {
    trigger: val('OPENING', 'the thing that brought you here'),
    response: val('REACH', val('VOICE', 'the same move, every time')),
    cost: val('BODY', val('WANT', 'the next morning')),
  }

  /* evidence rows: verbatim quote + what it signals. Typed answers first. */
  const SIGNAL = {
    OPENING: 'why you came, in your words',
    DURATION: 'how long it has run',
    BODY: 'where it lands',
    DAYS: 'the backdrop it runs against',
    VOICE: 'the inner voice, verbatim',
    REACH: 'the coping move',
    PEOPLE: 'who gets to see it',
    WANT: 'what you want back',
  }
  const evidence = [...said]
    .sort((a, b) => Number(b.typed) - Number(a.typed))
    .slice(0, 3)
    .map((t) => ({ quote: String(t.value).trim(), signal: SIGNAL[t.territory] || 'said in passing' }))

  const absence = 'You told me what happened, and almost nothing about how any of it felt.'

  /* three moves, small and concrete, each pointed at their own loop */
  const breaks = [
    {
      move: 'Name it the moment it starts',
      how: `The next time ${fragment(loop.trigger) || 'it'} kicks off, say "${pattern.toLowerCase()}" to yourself, out loud if you can. Naming it early is half the interrupt.`,
    },
    has('scroll')
      ? { move: 'Put a gap before the phone', how: 'When the reach for the phone starts, allow it, but only after sixty seconds of sitting with nothing. The loop hates a gap.' }
      : { move: 'Give it a container', how: 'Ten minutes, on purpose, earlier in the evening. The loop loses its grip when it gets scheduled instead of fought.' },
    has('alone') || has('one')
      ? { move: 'Say one true sentence out loud', how: 'Once a day, to anyone, one sentence about how it felt. Not what happened. How it felt. That is the muscle this session says is quietest.' }
      : { move: 'Log the interrupt, not the lapse', how: 'When you catch it once, tell me. We count the catches here, not the failures.' },
  ]

  return {
    pattern,
    essence,
    answers: said.length,
    hits: Math.min(hits, said.length),
    loop,
    evidence,
    absence,
    breaks,
    moods: [...new Set(said.flatMap((t) => t.tags || []))].map(tagLabel).slice(0, 3),
    people: [],
    topics: [tagsOfTerr(said, 'DAYS'), tagsOfTerr(said, 'REACH')].filter(Boolean).map(tagLabel),
    patterns: [pattern],
  }
}

const tagsOfTerr = (said, terr) => (said.find((t) => t.territory === terr)?.tags || [])[0]

/* ── the transport ──────────────────────────────────────────────────────── */

/* One call per turn, fired the moment they answer. The Kael screen is the
   async boundary: dots render, this resolves, the ack types. If the server
   route is absent or fails, fall through to the local generator so the flow
   never stalls on a network problem. */
const post = async (url, body) => {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!r.ok) throw new Error(String(r.status))
  return r.json()
}

export async function fetchTurn(body) {
  /* the model owns the flow: it gets the remaining territories plus a
     suggestion, and may dig into the last answer instead of moving on.
     The local fallback keeps the fixed spine. */
  const territory = territoryFor(body.slot, body.covered)
  const remaining = FREE_SET.filter((t) => !(body.covered || []).includes(t))
  try {
    const out = await post('/api/session/turn', { ...body, territory, remaining })
    /* a malformed turn is worse than a local one; never render half a screen */
    if (!out?.question || !Array.isArray(out.options)) throw new Error('bad shape')
    return { ...out, territory: out.territory || territory, source: 'model' }
  } catch {
    return { ...localTurn(body), source: 'local' }
  }
}

export async function fetchReflection(body) {
  try {
    const out = await post('/api/session/reflection', body)
    if (!out?.pattern || !out?.loop || !Array.isArray(out.breaks)) throw new Error('bad shape')
    return { ...out, source: 'model' }
  } catch {
    return { ...localReflection(body), source: 'local' }
  }
}
