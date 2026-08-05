import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, PaperPlaneTilt, Spiral, Anchor, Scales, Users, CloudRain, Briefcase, Compass, ChatCircleDots } from '@phosphor-icons/react'
import { Home as ReflectHome, Room as ReflectRoom } from './ReflectConcept.jsx'

/* ──────────────────────────────────────────────────────────────────────────
   Kael V12 — meeting Kael, then the app.

   The whole onboarding is one conversation. Every screen is Kael saying
   something and the user answering it: no logo lockups, no value-prop
   slides, no forms. What changes screen to screen is only what the answer
   looks like, a field, some chips, a list of doors.

   Each answer is acknowledged before the next question, and the
   acknowledgement is the point. "Good to meet you" is what a form says.
   Saying something true about what they just told you is what a person
   does, and it is the entire difference in how this feels.

   Age and gender are asked one at a time and advance themselves, because a
   tap that also submits is one fewer thing between them and the reflection.

   It ends on the doors: Kael asks what brings them here, they pick, and
   Begin reflection drops them into the real app already in conversation.
   ────────────────────────────────────────────────────────────────────────── */

const TYPE_SPEED = 21
const BEAT = 460           // dots before a line starts
const GAP = 260            // breath between lines

/* ── what Kael says. One paragraph a screen, because a stack of bubbles is
   a chat transcript and this is Kael speaking once, then waiting. ─────── */
/* one bubble, but broken where a person would breathe */
const MEET = [
  'Hey. I’m Kael, your thinking partner.',
  'Not a therapist, not a chatbot with tips. I ask the questions that untangle what’s already in your head.',
  'And I remember all of it, so you never start over.',
].join('\n\n')

const NAME_Q = 'Before we go further, what should I call you?'

/* the acks are written to be true about what they just told you, not polite
   about the fact that they told you something */
const nameAck = (n) => `${n}. Good, that’s what I’ll use.\n\nHow old are you? It changes what I’d ask you, not how I’d treat you.`

const AGE_ACK = {
  '18-24': 'That’s the stretch where everything is being decided for the first time, and nobody warns you how loud that gets.',
  '25-34': 'That’s the decade everything is supposedly settling, and mostly isn’t.',
  '35-44': 'That’s often when the questions get quieter and heavier at the same time.',
  '45+': 'Long enough to know your own patterns, which makes them harder to sit with, not easier.',
}
const ageAck = (a) => `${AGE_ACK[a] || 'Good to know.'}\n\nAnd how do you identify?`

const genderAck = (g, n) => `${g === 'Rather not say' ? 'That’s fine, we’ll leave it.' : 'Got it. That’s the setup done.'}\n\nSo${n ? `, ${n}` : ''}, what’s on your mind?\n\nSay it however it comes out, or start with one of these.`

const AGES = ['18-24', '25-34', '35-44', '45+']
const GENDERS = ['Woman', 'Man', 'Non-binary', 'Rather not say']

/* the doors. Each is a whole opening: the line the user "says", the question
   Kael answers with, and the title the reflection takes. */
const DOORS = [
  { id: 'relationship', label: 'Someone I can’t stop thinking about', Icon: Users, accent: 'var(--mood-hurt)',
    seed: 'There’s someone I can’t stop thinking about.',
    open: 'Okay. Who is it, and what happened most recently between you?',
    chips: ['A partner', 'Family', 'A friend', 'Someone at work'],
    title: 'Someone on my mind', line: 'Finding what this person is really stirring up.' },
  { id: 'decision', label: 'A decision I keep going back and forth on', Icon: Scales, accent: 'var(--mood-overwhelmed)',
    seed: 'There’s a decision I keep going back and forth on.',
    open: 'Let’s lay it out. What are the two options, in the plainest words you have?',
    chips: ['Stay or go', 'Say something or not', 'It’s bigger than that'],
    title: 'A decision I’m stuck on', line: 'Finding what the choice is really between.' },
  { id: 'overthinking', label: 'I can’t switch my head off', Icon: Spiral, accent: 'var(--mood-overthinking)',
    seed: 'I can’t switch my head off.',
    open: 'Round and round. What’s the thing it keeps circling back to?',
    chips: ['A conversation', 'A decision', 'Something I can’t change'],
    title: 'Caught in a loop', line: 'Finding what the mind keeps circling.' },
  { id: 'stuck', label: 'I feel stuck', Icon: Anchor, accent: 'var(--mood-stressed)',
    seed: 'I feel stuck, like I can’t move forward.',
    open: 'Stuck usually has a shape. Where does it feel most like you’re not moving?',
    chips: ['My life in general', 'Work', 'Something in me'],
    title: 'Feeling stuck', line: 'Finding where things stopped moving.' },
  { id: 'low', label: 'Everything feels heavy', Icon: CloudRain, accent: 'var(--mood-low)',
    seed: 'Everything feels heavy right now.',
    open: 'Heavy is a good word, it has weight but no shape. Does it have a reason attached, or is it just sitting there?',
    chips: ['Something happened', 'No reason I can name', 'A bit of both'],
    title: 'A heavier stretch', line: 'Sitting with it instead of rushing past.' },
  { id: 'work', label: 'Work is wearing me down', Icon: Briefcase, accent: 'var(--mood-tired)',
    seed: 'Work has been wearing me down.',
    open: 'Is it the work itself, or the people around it?',
    chips: ['The work', 'The people', 'Both, honestly'],
    title: 'Work is wearing me down', line: 'Finding what the job is actually costing.' },
  { id: 'direction', label: 'I don’t know what I want anymore', Icon: Compass, accent: 'var(--mood-restless)',
    seed: 'I don’t really know what I want anymore.',
    open: 'That’s an honest place to start. When did you last feel sure about something?',
    chips: ['A while ago', 'I can’t remember', 'About some things, not others'],
    title: 'Not sure what I want', line: 'Looking for the thread under the not-knowing.' },
  { id: 'talk', label: 'I just need to talk', Icon: ChatCircleDots, accent: 'var(--warm-proof)',
    seed: 'I just need to talk something through.',
    open: 'Then let’s talk. Where does it start?',
    chips: ['Something today', 'Something older', 'I’m not sure yet'],
    title: 'Talking it through', line: 'Finding the shape of it together.' },
]

/* whatever they type becomes the opening, in their own words */
const typedDoor = (text) => ({
  id: 'typed', Icon: ChatCircleDots, accent: 'var(--warm-proof)',
  seed: text,
  open: 'Okay. Tell me the part of it that keeps coming back.',
  chips: [],
  title: text.length > 42 ? `${text.slice(0, 42).trim()}…` : text,
  line: 'Finding what this is really about.',
})


/* ── Kael speaking: one paragraph, typed once ───────────────────────────── */
function useTyped(text) {
  const [shown, setShown] = useState('')
  const [done, setDone] = useState(false)
  const timers = useRef([])
  const clear = () => { timers.current.forEach((t) => { clearTimeout(t); clearInterval(t) }); timers.current = [] }
  useEffect(() => () => clear(), [])
  useEffect(() => {
    clear(); setShown(''); setDone(false)
    timers.current.push(setTimeout(() => {
      const t0 = performance.now()
      const tick = setInterval(() => {
        const chars = Math.floor((performance.now() - t0) / TYPE_SPEED)
        if (chars >= text.length) { clearInterval(tick); setShown(text); setDone(true); return }
        setShown(text.slice(0, chars))
      }, 30)
      timers.current.push(tick)
    }, BEAT))
    return clear
  }, [text])
  const finish = () => { clear(); setShown(text); setDone(true) }
  return { shown, done, finish }
}

const Dots = () => <span className="v12-dots" aria-hidden="true"><i /><i /><i /></span>

/* Kael's mark: the serif K on its squircle */
const KaelMark = ({ size = 68, className = '' }) => (
  <span className={`v12-mark ${className}`} style={{ '--s': `${size}px` }} aria-label="Kael">K</span>
)

/* the bubble, with the mark inside it and the one sharp corner a spoken
   bubble has */
function KaelBubble({ text, onDone }) {
  const t = useTyped(text)
  useEffect(() => { if (t.done && onDone) onDone() }, [t.done]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="v12-bub" onClick={t.finish}>
      <KaelMark size={24} className="v12-bub-mark" />
      {t.shown ? (
        <span className="v12-bub-body">
          {t.shown.split('\n\n').map((para, k, all) => (
            <p key={k}>{para}{!t.done && k === all.length - 1 && <i className="v12-caret" />}</p>
          ))}
        </span>
      ) : <p className="v12-bub-waiting"><Dots /></p>}
    </div>
  )
}

/* ── the machine ────────────────────────────────────────────────────────── */

const STEPS = ['meet', 'name', 'age', 'gender', 'doors']

export default function OnboardingV12() {
  const [i, setI] = useState(0)
  const [inApp, setInApp] = useState(false)
  const [name, setName] = useState('')
  const [draft, setDraft] = useState('')
  const [age, setAge] = useState(null)
  const [gender, setGender] = useState(null)
  const [door, setDoor] = useState(null)
  const [saidDone, setSaidDone] = useState(false)

  const [view, setView] = useState({ kind: 'new' })
  const [roomKey, setRoomKey] = useState(0)
  const [firstReflection, setFirstReflection] = useState(null)

  const step = STEPS[i]
  const first = name.trim().split(' ')[0]

  const go = (n) => { setSaidDone(false); setI(Math.max(0, Math.min(STEPS.length - 1, n))) }

  /* a chip answers and advances itself: one tap, not two */
  const pickAge = (v) => { setAge(v); setTimeout(() => go(3), 320) }
  const pickGender = (v) => { setGender(v); setTimeout(() => go(4), 320) }

  /* a door or their own words, either one opens the room already talking */
  const enterApp = (chosen) => {
    if (!chosen) return
    setDoor(chosen)
    setInApp(true); setView({ kind: 'new', seed: chosen }); setRoomKey((k) => k + 1)
  }

  const onRoomExit = (exit) => {
    if (exit && exit.started && exit.meta && exit.meta.Icon) {
      setFirstReflection({
        id: 'first', when: 'just now',
        title: exit.meta.title, line: exit.meta.line,
        mood: exit.meta.accent, Icon: exit.meta.Icon,
        history: (exit.msgs || []).map((m) => ({ ...m, time: m.time || '' })),
        reopen: 'You were just here. Want to keep going, or has it shifted?',
      })
    }
    setView({ kind: 'home' })
  }

  const restart = () => {
    setI(0); setInApp(false); setName(''); setDraft(''); setAge(null); setGender(null)
    setDoor(null); setSaidDone(false); setView({ kind: 'new' }); setFirstReflection(null)
  }

  const LINES = {
    meet: MEET,
    name: NAME_Q,
    age: nameAck(first || 'Okay'),
    gender: ageAck(age),
    doors: genderAck(gender, first),
  }[step]

  return (
    <div className="lib-page ov-page v12-page">
      <div className="ov-stage">
        <div className="ov-screen v12-frame">
          {!inApp && (
            <div className="v12-screen">
              {i > 0 && (
                <button className="v12-back" onClick={() => go(i - 1)} aria-label="Back"><ArrowLeft size={19} /></button>
              )}

              <div className={`v12-talk${step === 'doors' ? ' v12-talk-doors' : ''}`}>
                {/* the meet screen keeps its mark and title above the bubble;
                    every later screen carries the mark inside the bubble */}
                {step === 'meet' && (
                  <div className="v12-hero">
                    <KaelMark size={68} />
                    <h1 className="v12-title">Meet Kael,<br />your thinking partner.</h1>
                  </div>
                )}
                <KaelBubble key={step} text={LINES} onDone={() => setSaidDone(true)} />

                {step === 'name' && saidDone && (
                  <input
                    className="v12-input"
                    value={draft}
                    autoFocus
                    placeholder="Your first name"
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && draft.trim()) { setName(draft.trim()); go(2) } }}
                  />
                )}

                {step === 'age' && saidDone && (
                  <div className="v12-chips">
                    {AGES.map((o, k) => (
                      <button key={o} className="v12-chip" style={{ '--d': `${0.05 * k}s` }}
                        data-on={age === o || undefined} onClick={() => pickAge(o)}>{o}</button>
                    ))}
                  </div>
                )}

                {step === 'gender' && saidDone && (
                  <div className="v12-chips">
                    {GENDERS.map((o, k) => (
                      <button key={o} className="v12-chip" style={{ '--d': `${0.05 * k}s` }}
                        data-on={gender === o || undefined} onClick={() => pickGender(o)}>{o}</button>
                    ))}
                  </div>
                )}

                {step === 'doors' && saidDone && (
                  <div className="v12-doors">
                    {DOORS.map((d, k) => (
                      <button key={d.id} className="v12-door"
                        style={{ '--d': `${0.03 * k}s`, '--accent': d.accent }}
                        onClick={() => enterApp(d)}>
                        <span className="v12-door-ic"><d.Icon size={17} weight="duotone" /></span>
                        {d.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="v12-foot">
                {step === 'meet' && <button className="v12-cta" data-wait={!saidDone || undefined} onClick={() => go(1)}>Continue</button>}
                {step === 'name' && (
                  <button className="v12-cta" data-wait={!draft.trim() || undefined}
                    onClick={() => { setName(draft.trim()); go(2) }}>Continue</button>
                )}
                {step === 'doors' && (
                  <div className="v12-composer">
                    <input
                      value={draft}
                      placeholder="Say it in your own words…"
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && draft.trim()) enterApp(typedDoor(draft.trim())) }}
                    />
                    <button className="v12-send" data-on={draft.trim().length > 0 || undefined}
                      onClick={() => draft.trim() && enterApp(typedDoor(draft.trim()))} aria-label="Send">
                      <PaperPlaneTilt size={15} weight="fill" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {inApp && (
            view.kind === 'home'
              ? (
                <ReflectHome
                  key="home"
                  name={first || undefined}
                  lib={firstReflection ? [firstReflection] : []}
                  onNew={() => { setView({ kind: 'new' }); setRoomKey((k) => k + 1) }}
                  onInvite={() => { setView({ kind: 'new' }); setRoomKey((k) => k + 1) }}
                  onReopen={() => { setView({ kind: 'old', reflection: firstReflection }); setRoomKey((k) => k + 1) }}
                  onOpen={() => { setView({ kind: 'old', reflection: firstReflection }); setRoomKey((k) => k + 1) }}
                />
              )
              : (
                <ReflectRoom
                  key={`room-${roomKey}`}
                  mode={view}
                  name={first || undefined}
                  onBack={onRoomExit}
                  onNew={() => { setView({ kind: 'new' }); setRoomKey((k) => k + 1) }}
                />
              )
          )}
        </div>
      </div>
      <div className="ob-devbar">
        <span>{inApp ? `app · ${view.kind}` : `${i + 1}/5 · ${step}`}</span>
        <button onClick={restart}>Restart</button>
        <span style={{ opacity: 0.6 }}>{first || '—'}</span>
      </div>
    </div>
  )
}
