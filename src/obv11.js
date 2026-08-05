/* ──────────────────────────────────────────────────────────────────────────
   Kael V11 — Session One.

   The onboarding is the first session, and the first session ends in a note
   Kael writes in front of them. Everything here is either the scripted
   arrival (four screens, because a relationship has to be established before
   anyone will answer honestly) or the contract the model fills.

   The local generator satisfies the same contract as the model, so the flow
   is reviewable with no key and identical with one.
   ────────────────────────────────────────────────────────────────────────── */

/* ── the spine ──────────────────────────────────────────────────────────── */

/* Eight asks, not ten. Depth beats coverage, and the payoff arrives sooner.
   OPENING is pinned because a flat first impression costs more than a rigid
   one, WANT is pinned last because the session has to close on what lighter
   would feel like, not on a diagnosis. */
export const TOTAL_ASKS = 8
export const FREE_SET = ['DURATION', 'BODY', 'DAYS', 'VOICE', 'REACH', 'PEOPLE']
/* the retell lands at the midpoint, once there is a story to retell */
export const NOTICING_AFTER = 5
/* the relief beat is offered from here on, once, and only if the charge is
   physical. Earlier and there is nothing to relieve yet. */
export const RELIEF_FROM = 3

/* ── the arrival, scripted ──────────────────────────────────────────────── */

export const PINNED = {
  /* 1 · The door. Not a value proposition: Kael's first message, typed, so
     the product begins as a conversation rather than as an advertisement
     for one. The bar to enter is set deliberately low. */
  door: {
    lines: [
      'Whatever tonight is, you don’t have to explain it well.',
      'I’ll ask, you answer however it comes out. In a few minutes I’ll tell you what I see, and write it down for you.',
    ],
    cta: 'I’m ready',
  },

  /* 2 · Name. The ask is ordinary. The answer to it is the only moment in
     the funnel where a relationship can be made in one line, so it spends
     that line on the promise no competitor can make. */
  name: {
    question: 'First, what should I call you?',
    placeholder: 'Your name',
    /* {name} interpolated */
    ack: [
      '{name}. Good.',
      'I’m Kael. I’ll remember this, all of it. Next time you come back, you won’t be starting over.',
    ],
    cta: 'Okay',
  },

  /* 3 · The two facts, one screen, with the reason attached. A form before a
     conversation is a trust leak; a form that says why, and takes one beat,
     is not. */
  facts: {
    lead: 'Two quick things, so I know whose life I’m looking at and not a demographic.',
    /* when they opened by talking instead of giving a name, the name gets
       asked for here, after Kael has already answered what they said */
    leadNamed: 'Before we go on, a few quick things so I know whose life I’m looking at.',
    age: { label: 'Age', options: ['18-24', '25-34', '35-44', '45+'] },
    gender: { label: 'You are', options: ['Woman', 'Man', 'Non-binary', 'Rather not say'] },
    cta: 'Done',
  },

  /* 4 · The frame. The register shift: the setup is over, the session
     starts, and the promise the whole thing is collateral for is stated
     before the first heavy question rather than after. */
  frame: {
    lead: 'Now it’s just us, {name}.',
    body: 'Nothing you say needs to be tidy. There’s no wrong way to answer.',
    promise: 'When we’re done, I’ll write you a note about what I saw.',
    cta: 'Start',
  },

  /* the opening ask, the one question never generated */
  opening: {
    territory: 'OPENING',
    question: 'So. What’s been sitting on you lately?',
    placeholder: 'Say it however it comes out',
    options: [
      { label: 'I can’t stop overthinking', tags: ['overthinking'], ack: 'The not stopping is the part that wears you down.' },
      { label: 'Everything feels heavy', tags: ['low'], ack: 'Heavy is a good word for it. It has weight, not shape.' },
      { label: 'Something happened I can’t shake', tags: ['event'], ack: 'Can’t shake it. So it keeps arriving, uninvited.' },
      { label: 'Honestly, I’m not sure', tags: ['unclear'], ack: 'Not sure is a real answer. We can find it together.' },
    ],
  },

  /* the handoff into the writing */
  handoff: {
    lead: 'I think I have enough, {name}.',
    body: 'Give me a moment. I want to write this down properly.',
    cta: 'Okay',
  },

  /* after the note: the possession beat, before any mention of money */
  saved: {
    kicker: 'Session one',
    title: 'This one is yours.',
    body: 'Saved, with everything you told me. The next session starts where this one ended.',
    cta: 'Continue',
  },
}

/* ── territories the local generator can serve ──────────────────────────── */

const T = {
  DURATION: {
    question: 'How long has it been like this?',
    placeholder: 'roughly is fine',
    options: [
      { label: 'A few days', tags: ['acute'] },
      { label: 'Weeks now', tags: ['weeks'] },
      { label: 'Longer than I admit', tags: ['chronic'] },
      { label: 'I can’t tell anymore', tags: ['blurred'] },
    ],
  },
  BODY: {
    question: 'Where do you feel it in your body?',
    placeholder: 'chest, jaw, stomach…',
    options: [
      { label: 'Chest, tight', tags: ['chest'] },
      { label: 'Jaw and shoulders', tags: ['jaw'] },
      { label: 'Stomach', tags: ['gut'] },
      { label: 'Nowhere I can point to', tags: ['none'] },
    ],
  },
  DAYS: {
    question: 'What does a normal day hold right now?',
    placeholder: 'the honest version',
    options: [
      { label: 'Work, then nothing left', tags: ['drained'] },
      { label: 'Busy, wall to wall', tags: ['busy'] },
      { label: 'Too much empty time', tags: ['empty'] },
      { label: 'Every day blurs', tags: ['blur'] },
    ],
  },
  VOICE: {
    question: 'What do you say to yourself when it’s bad?',
    placeholder: 'the exact words',
    options: [
      { label: 'That I should be over it', tags: ['should'] },
      { label: 'That I’m being dramatic', tags: ['minimize'] },
      { label: 'That it’s my own fault', tags: ['blame'] },
      { label: 'I’d rather not say', tags: ['withheld'] },
    ],
  },
  REACH: {
    question: 'What do you do when it gets loudest?',
    placeholder: 'no wrong answers',
    options: [
      { label: 'Scroll until I fall asleep', tags: ['numb'] },
      { label: 'Keep working', tags: ['busy'] },
      { label: 'Go quiet on everyone', tags: ['withdraw'] },
      { label: 'Snap, then feel worse', tags: ['react'] },
    ],
  },
  PEOPLE: {
    question: 'Who gets the real version of you?',
    placeholder: 'a name, or no one',
    options: [
      { label: 'One person, sort of', tags: ['one'] },
      { label: 'People know pieces', tags: ['partial'] },
      { label: 'Nobody, really', tags: ['none'] },
    ],
  },
  WANT: {
    question: 'Last one. What would lighter look like, just for tonight?',
    placeholder: 'be greedy about it',
    options: [
      { label: 'Sleeping without the replay', tags: ['sleep'] },
      { label: 'One hour of an unclenched chest', tags: ['calm'] },
      { label: 'Not snapping at anyone', tags: ['patience'] },
    ],
  },
}

/* ── the relief beat, locally ───────────────────────────────────────────── */

const RELIEF = {
  chest: 'Before the next one, do something for me. Put a hand flat on your chest and let one breath out longer than you took it in.',
  jaw: 'Before the next one, do something for me. Unclench your jaw and drop your shoulders down, once, deliberately.',
  gut: 'Before the next one, do something for me. Both feet flat on the floor, and one slow breath out through your mouth.',
  default: 'Before the next one, do something for me. Both feet flat on the floor, and let one breath out longer than you took it in.',
}
const RELIEF_OPTIONS = [
  { label: 'Done', tags: ['done'] },
  { label: 'That did nothing', tags: ['nothing'] },
  { label: 'Not right now', tags: ['declined'] },
]

/* ── local acks: quoting them back is the one technique that passes the
   cover test without understanding the sentence ─────────────────────────── */

const frag = (t = '', max = 40) => {
  const v = String(t).trim().replace(/\s+/g, ' ')
  if (v.length <= max) return v
  const cut = v.slice(0, max)
  const sp = cut.lastIndexOf(' ')
  return `${(sp > 18 ? cut.slice(0, sp) : cut).trim()}…`
}
const low = (t = '') => { const v = frag(t); return v ? v.charAt(0).toLowerCase() + v.slice(1) : v }

const ACK_SHAPES = [
  (v) => `“${frag(v)}”. Okay. I heard that.`,
  (v) => `${frag(v)}. That has a shape to it.`,
  (v) => `${frag(v)}. It made sense as protection, at some point.`,
  (v) => `${frag(v)}. That’s more common than it feels, and it still costs you.`,
  (v) => `${frag(v)}. That connects to what you said earlier.`,
]

const localAck = (value, i) => ACK_SHAPES[i % ACK_SHAPES.length](value)

const localNoticing = (transcript) => {
  const first = transcript.find((t) => t.territory === 'OPENING')
  const body = transcript.find((t) => t.territory === 'BODY')
  return [
    'Let me make sure I have this right.',
    `You came in with ${low(first?.value || 'a lot')}${body ? `, and it sits in ${low(body.value)}` : ''}.`,
    'You’ve been carrying it without much help, and you’re still here asking.',
  ]
}

/* ── the contract ───────────────────────────────────────────────────────── */

export function localTurn({ slot, remaining = [], transcript = [], wantNoticing = false, reliefAvailable = false }) {
  const last = transcript[transcript.length - 1]
  const bodyAnswer = transcript.find((t) => t.territory === 'BODY')
  const physical = bodyAnswer && !/nowhere/i.test(bodyAnswer.value)

  if (reliefAvailable && physical) {
    const tag = /chest/i.test(bodyAnswer.value) ? 'chest' : /jaw|shoulder/i.test(bodyAnswer.value) ? 'jaw' : /stomach|gut/i.test(bodyAnswer.value) ? 'gut' : 'default'
    return {
      ack: last ? localAck(last.value, slot) : null,
      insight: null,
      kind: 'relief',
      question: RELIEF[tag],
      options: RELIEF_OPTIONS,
      placeholder: 'or tell me what happened',
      territory: last?.territory || 'BODY',
      noticing: null,
      flag: 'none',
      source: 'local',
    }
  }

  const territory = slot >= TOTAL_ASKS ? 'WANT' : (remaining.find((r) => r !== 'WANT') || 'WANT')
  const t = T[territory] || T.WANT
  return {
    ack: last ? localAck(last.value, slot) : null,
    insight: null,
    kind: 'ask',
    question: t.question,
    options: t.options,
    placeholder: t.placeholder,
    territory,
    noticing: wantNoticing ? localNoticing(transcript) : null,
    flag: 'none',
    source: 'local',
  }
}

/* the local note, in the same marker format the stream emits, so the note
   screen has exactly one renderer */
export function localNote({ name = 'friend', transcript = [], relief = null }) {
  const first = transcript.find((t) => t.territory === 'OPENING')?.value || 'what you came in with'
  const body = transcript.find((t) => t.territory === 'BODY')?.value
  const voice = transcript.find((t) => t.territory === 'VOICE')?.value
  const reach = transcript.find((t) => t.territory === 'REACH')?.value
  const want = transcript.find((t) => t.territory === 'WANT')?.value
  return `TITLE: The night you said it out loud

${name},

You came in carrying *${low(first)}*, and you stayed for all of it. That is not nothing at this hour.

## What I noticed
You described what happens to you in detail, and what it feels like in about four words. ${body ? `The only place you got specific was your body: *${low(body)}*.` : 'The feeling stayed at arm’s length the whole way through.'}

## The pattern
${reach ? `When it gets loudest you *${low(reach)}*, and it works, briefly.` : 'When it gets loudest, you handle it alone.'} Then it comes back a little louder, because nothing about it got said to anyone.

## What it is protecting
${voice ? `Talking to yourself the way you do, *${low(voice)}*, gets there before anyone else can.` : 'Handling it alone means nobody gets to be disappointed in you.'} It has kept you moving. It also means you have never once been talked out of it.

## One thing for tonight
${relief === 'That did nothing' ? 'Skip the breathing, it is not your tool. ' : ''}The next time the loop starts, say “there it is” out loud. ${want ? `You said lighter looks like *${low(want)}*. That is the direction.` : ''}

You were not described tonight. You were listened to.

— Kael`
}

/* ── network ────────────────────────────────────────────────────────────── */

export async function fetchTurn(body) {
  try {
    const r = await fetch('/api/v11/turn', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!r.ok) throw new Error(String(r.status))
    const out = await r.json()
    if (!out?.question && out?.flag !== 'crisis') throw new Error('no question')
    return out
  } catch {
    return localTurn(body)
  }
}

/* streams the note, calling onChunk with the growing text. Falls back to
   typing the local note at the same rhythm so the screen behaves the same
   either way. */
export async function streamNote(body, onChunk, signal) {
  try {
    const r = await fetch('/api/v11/note', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal,
    })
    if (!r.ok || !r.body) throw new Error(String(r.status))
    const reader = r.body.getReader()
    const dec = new TextDecoder()
    let text = ''
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      text += dec.decode(value, { stream: true })
      onChunk(text)
    }
    if (!text.trim()) throw new Error('empty note')
    return { text, source: 'model' }
  } catch (e) {
    if (e?.name === 'AbortError') return { text: '', source: 'aborted' }
    const text = localNote(body)
    /* type it at a readable pace so the fallback still gets watched */
    for (let i = 0; i <= text.length; i += 3) {
      if (signal?.aborted) return { text, source: 'aborted' }
      onChunk(text.slice(0, i))
      await new Promise((r) => setTimeout(r, 12))
    }
    onChunk(text)
    return { text, source: 'local' }
  }
}

/* ── the note's marker format, parsed for rendering ─────────────────────── */

export function parseNote(raw = '') {
  const out = { title: '', salutation: '', blocks: [] }
  const lines = raw.split('\n')
  let para = []
  const flush = () => {
    const t = para.join(' ').trim()
    if (t) out.blocks.push({ kind: 'p', text: t })
    para = []
  }
  lines.forEach((line) => {
    const s = line.trim()
    if (/^TITLE:/i.test(s)) { flush(); out.title = s.replace(/^TITLE:\s*/i, ''); return }
    if (s.startsWith('##')) { flush(); out.blocks.push({ kind: 'h', text: s.replace(/^#+\s*/, '') }); return }
    if (/^—\s*Kael/.test(s)) { flush(); out.blocks.push({ kind: 'sign', text: s }); return }
    if (!s) { flush(); return }
    if (!out.salutation && !out.blocks.length && /,$/.test(s)) { out.salutation = s; return }
    para.push(s)
  })
  flush()
  return out
}
