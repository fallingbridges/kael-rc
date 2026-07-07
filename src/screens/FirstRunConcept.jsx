import { Fragment, useEffect, useRef, useState } from 'react'
import {
  ArrowLeft, Sparkle, PaperPlaneTilt, Check, Checks,
  Spiral, Scales, Moon, Infinity as InfinityIcon, Brain, ChatCircleDots, Wind,
} from '@phosphor-icons/react'
import { Home } from './ReflectConcept.jsx'

/* ──────────────────────────────────────────────────────────────────────────
   First-run flow — the post-paywall first experience.

   paywall → threshold (a breath, names the ritual) → first reflection where
   Kael speaks first, personalized from onboarding → return hook → the
   one-reflection Home. Everything downstream reads from a profile stub that
   stands in for the V7 onboarding output (pattern, name, {SIT}, goal, etc.).
   ────────────────────────────────────────────────────────────────────────── */

const PROFILES = {
  overloaded: {
    name: 'Maya',
    pattern: 'The Overloaded',
    Icon: Spiral,
    accent: 'var(--mood-overthinking)',
    // Kael speaks first — mirror their pattern in human terms, then one small on-ramp
    mirror: 'I’ve got a picture of you now, Maya. A mind that doesn’t clock off, running a little emptier than it should. You told me work’s been relentless and you can’t switch off.',
    question: 'We don’t have to untangle all of it tonight. Let me start somewhere small: when did your head last actually feel quiet?',
    chips: ['This morning', 'Can’t remember', 'Only around people', 'Not in a while'],
    turns: [
      'That tells me something. When it’s quiet only in certain moments, the noise usually isn’t about the work — it’s about what rushes in when you finally stop. What’s the first thought that shows up?',
      'Mm. You don’t have to answer that neatly. Naming it out loud is the whole job tonight — I’ll hold onto this, the pattern living underneath the busyness.',
    ],
    hook: 'This is a good place to stop, Maya. I’ll be here tomorrow morning — want me to check in, and we pick this back up?',
    saved: { title: 'Why my head won’t switch off', line: 'The day ends, but the mind keeps going.' },
    reopen: 'You left this one mid-thought last night. Has the noise settled, or is it still running?',
  },
  critic: {
    name: 'Sam',
    pattern: 'The Self-Critic',
    Icon: Scales,
    accent: 'var(--mood-ashamed)',
    mirror: 'Here’s what I see, Sam. A voice in your head that’s far harder on you than you’d ever be on a friend. You said you keep replaying everything you get wrong.',
    question: 'Let’s slow that tape down together. What’s the line it keeps repeating back to you?',
    chips: ['That I’m too much', 'That I let people down', 'That I’m behind', 'I don’t know'],
    turns: [
      'And if a friend said that exact thing about themselves — would you believe it about them? Sit in that gap for a second. That gap is where we do our work.',
      'You don’t have to win the argument with that voice tonight. You just caught it not telling the whole truth. That’s the first crack of light.',
    ],
    hook: 'Let’s leave it there for now, Sam. I’ll check in this evening — we can catch that voice in the act next time.',
    saved: { title: 'The voice that’s hardest on me', line: 'Kinder to everyone but myself.' },
    reopen: 'Last time we caught that inner voice mid-sentence. Has it been loud today, or quieter?',
  },
  numb: {
    name: 'Alex',
    pattern: 'The Numb-out',
    Icon: Moon,
    accent: 'var(--mood-numb)',
    mirror: 'I think I understand you a little already, Alex. When things get heavy, you reach for something to take the edge off rather than sit in it — and lately it’s all felt kind of flat.',
    question: 'Flat is its own kind of signal. When’s the last time you felt something sharply — good or bad?',
    chips: ['A while ago', 'When I’m alone', 'Can’t think of one', 'This week, actually'],
    turns: [
      'Okay. Flatness usually isn’t the absence of feeling — it’s feeling turned way down so it can’t reach you. What do you think you’d feel if you nudged the dial back up, even a little?',
      'That’s brave to even guess at. We don’t rush it. Noticing the numbness instead of feeding it is already a different move than the old one.',
    ],
    hook: 'Let’s pause here, Alex. Want me to check in tomorrow? Small and steady is how this one loosens.',
    saved: { title: 'Why everything feels flat', line: 'Turned the volume down to get through.' },
    reopen: 'We started turning the dial back up last time. Anything reach you since — even faintly?',
  },
}

/* ── the paywall (stub) — enough to stand in for the V7 paywall ── */
function Paywall({ profile, onStart }) {
  const Glyph = profile.Icon
  return (
    <div className="fr-paywall" style={{ '--accent': profile.accent }}>
      <span className="fr-pw-badge"><Glyph size={30} weight="duotone" /></span>
      <h2 className="fr-pw-title">Kael, in your corner.</h2>
      <p className="fr-pw-sub">Unlimited check-ins with the coach who already knows your whole story.</p>
      <ul className="fr-pw-feats">
        <li><InfinityIcon size={20} weight="bold" /> Unlimited conversations</li>
        <li><Brain size={20} weight="bold" /> Remembers everything you share</li>
        <li><ChatCircleDots size={20} weight="bold" /> A daily note that knows you</li>
        <li><Wind size={20} weight="bold" /> A calmer, steadier baseline</li>
      </ul>
      <div className="fr-pw-plan"><span>Annual · $99.99/yr</span><span className="fr-pw-save">Save 44%</span></div>
      <p className="fr-pw-plan2">7 days free, then billed yearly</p>
      <button className="fr-pw-cta" onClick={onStart}>Start 7-day free trial</button>
      <p className="fr-pw-fine">Cancel anytime · Restore</p>
    </div>
  )
}

/* ── the threshold — one breath that closes onboarding and opens the ritual ── */
function Threshold({ profile, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [onDone])
  const Glyph = profile.Icon
  return (
    <div className="fr-threshold" style={{ '--accent': profile.accent }} onClick={onDone}>
      <span className="fr-th-orb"><Glyph size={32} weight="fill" /></span>
      <h2 className="fr-th-title">That’s everything I needed, {profile.name}.</h2>
      <p className="fr-th-sub">No more questions. This is your first reflection — and it stays open for as long as you want it.</p>
      <span className="fr-th-hint">tap to begin</span>
    </div>
  )
}

/* ── the first reflection — Kael speaks first, personalized ── */
function FirstChat({ profile, reopened, initialLog, onDone, onBack }) {
  const followups = [profile.turns[0], profile.turns[1], profile.hook]
  const [msgs, setMsgs] = useState(() => (reopened ? initialLog : []))
  const [typing, setTyping] = useState(false)
  const [step, setStep] = useState(0) // count of Kael follow-ups delivered
  const [openerChips, setOpenerChips] = useState(false)
  const [done, setDone] = useState(reopened)
  const [draft, setDraft] = useState('')
  const bodyRef = useRef(null)
  const timer = useRef(null)

  const kaelSay = (text, after) => {
    setTyping(true)
    timer.current = setTimeout(() => {
      setMsgs((m) => [...m, { who: 'kael', text }])
      setTyping(false)
      if (after) after()
    }, 900)
  }

  // fresh run: Kael reaches out first — mirror, then the on-ramp question
  useEffect(() => {
    if (reopened) return
    kaelSay(profile.mirror, () => kaelSay(profile.question, () => setOpenerChips(true)))
    return () => clearTimeout(timer.current)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [msgs, typing, done])

  const say = (text) => {
    if (!text.trim() || typing) return
    setMsgs((m) => [...m, { who: 'user', text: text.trim() }])
    setDraft('')
    setOpenerChips(false)
    if (reopened) { kaelSay('Mm. Keep going — I’m with you.'); return }
    const next = followups[step]
    const isHook = step === followups.length - 1
    kaelSay(next, () => { if (isHook) setDone(true) })
    setStep((s) => s + 1)
  }

  const finish = (text) => {
    setMsgs((m) => [...m, { who: 'user', text }])
    timer.current = setTimeout(() => onDone(msgs), 650)
  }

  const hTitle = reopened || done ? profile.saved.title : 'Your first reflection'
  const hSub = reopened || done ? profile.saved.line : 'This one’s just for you.'

  return (
    <div className="rf-screen rf-room">
      <header className="rf-room-head">
        <button className="rf-back" onClick={onBack} aria-label="Back"><ArrowLeft size={19} /></button>
        <div className="rf-room-id" key={hTitle}>
          <h2>{hTitle}</h2>
          <span>{hSub}</span>
        </div>
        <span style={{ width: 34 }} />
      </header>

      <div className="rf-body" ref={bodyRef}>
        {reopened && <span className="rf-then">Earlier</span>}
        {msgs.map((m, k) => (
          <div key={k} className={`io-cmsg io-cmsg-${m.who}`}>
            {m.who === 'kael' && <span className="io-cmsg-av"><Sparkle size={12} weight="fill" /></span>}
            <div className="rf-msg-col"><p>{m.text}</p></div>
          </div>
        ))}
        {typing && (
          <div className="io-cmsg io-cmsg-kael">
            <span className="io-cmsg-av"><Sparkle size={12} weight="fill" /></span>
            <p className="rf-typing">…</p>
          </div>
        )}
        {done && !reopened && (
          <div className="fr-saved"><Check size={13} weight="bold" /> Saved to your reflections</div>
        )}
        {openerChips && !done && (
          <div className="rf-chips">
            {profile.chips.map((c) => <button key={c} className="rf-chip" onClick={() => say(c)}>{c}</button>)}
          </div>
        )}
        {done && !reopened && (
          <div className="rf-chips">
            {['Yes, check in on me', 'I’ll come back myself'].map((c) => (
              <button key={c} className="rf-chip" onClick={() => finish(c)}>{c}</button>
            ))}
          </div>
        )}
      </div>

      {!done && (
        <div className="rf-input">
          <input
            value={draft}
            placeholder="Say it in your words…"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') say(draft) }}
          />
          <button className="rf-send" onClick={() => say(draft)} aria-label="Send"><PaperPlaneTilt size={17} weight="fill" /></button>
        </div>
      )}
    </div>
  )
}

export default function FirstRunConcept() {
  const [pid, setPid] = useState('overloaded')
  const [stage, setStage] = useState('paywall') // paywall | threshold | chat | home | recovery
  const [log, setLog] = useState([])
  const [reopened, setReopened] = useState(false)
  const profile = PROFILES[pid]

  const fallbackLog = [
    { who: 'kael', text: profile.mirror },
    { who: 'kael', text: profile.question },
  ]
  const saved = {
    id: 'first', when: 'just now',
    title: profile.saved.title, line: profile.saved.line,
    mood: profile.accent, Icon: profile.Icon,
    history: (log.length ? log : fallbackLog).map((m) => ({ ...m, time: '' })),
    reopen: profile.reopen,
  }

  const pickProfile = (id) => { setPid(id); setStage('paywall'); setLog([]); setReopened(false) }
  const openChat = (isReopen) => { setReopened(isReopen); setStage('chat') }

  return (
    <div className="lib-page ov-page rf-page">
      <div className="rf-demo">
        {[['overloaded', 'Overloaded'], ['critic', 'Self-critic'], ['numb', 'Numb-out']].map(([id, label]) => (
          <button key={id} className="rf-demo-chip" data-on={pid === id || undefined} onClick={() => pickProfile(id)}>{label}</button>
        ))}
        <span className="rf-demo-sep" />
        {[['paywall', 'Paywall'], ['threshold', 'Threshold'], ['chat', 'First chat'], ['home', 'Home'], ['recovery', 'Recovery']].map(([id, label]) => (
          <button key={id} className="rf-demo-chip" data-on={stage === id || undefined} onClick={() => { setReopened(false); setStage(id) }}>{label}</button>
        ))}
      </div>
      <div className="ov-stage">
        <div className="ov-screen rf-phone">
          {stage === 'paywall' && <Paywall profile={profile} onStart={() => setStage('threshold')} />}
          {stage === 'threshold' && <Threshold profile={profile} onDone={() => openChat(false)} />}
          {stage === 'chat' && (
            <FirstChat
              key={reopened ? 'reopen' : 'fresh'}
              profile={profile}
              reopened={reopened}
              initialLog={saved.history}
              onBack={() => setStage(reopened || log.length ? 'home' : 'recovery')}
              onDone={(finalLog) => { setLog(finalLog); setReopened(false); setStage('home') }}
            />
          )}
          {stage === 'home' && (
            <Home
              lib={[saved]}
              name={profile.name}
              firstVisit
              onNew={() => openChat(false)}
              onInvite={() => openChat(false)}
              onReopen={() => openChat(true)}
              onOpen={() => openChat(true)}
            />
          )}
          {stage === 'recovery' && (
            <Home
              lib={[]}
              name={profile.name}
              firstVisit
              onNew={() => openChat(false)}
              onInvite={() => openChat(false)}
              onReopen={() => openChat(true)}
              onOpen={() => openChat(true)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
