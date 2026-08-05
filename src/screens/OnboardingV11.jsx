import { useEffect, useMemo, useRef, useState } from 'react'
import { PaperPlaneTilt, Sparkle, ArrowRight, Check } from '@phosphor-icons/react'
import {
  PINNED, TOTAL_ASKS, FREE_SET, NOTICING_AFTER, RELIEF_FROM,
  fetchTurn, streamNote, parseNote,
} from '../obv11.js'

/* ──────────────────────────────────────────────────────────────────────────
   Kael V11 — Session One.

   One screen. One thread. Everything said stays said, the way it does in
   the app's own chat, because a conversation you can scroll back through is
   a conversation, and a stack of screens replacing each other is a form
   wearing a chat's clothes.

   Kael's lines are queued and revealed one at a time: dots, then typing,
   then the next. Only the newest line is ever in flight, so there is never
   more than one Kael writing at once. Answers sit under the last thing
   said, and the composer is always live.

   Everything except the door, the note and the close happens in the thread:
   the name, the two facts, the frame, the session, the retell.
   ────────────────────────────────────────────────────────────────────────── */

const TYPE_SPEED = 20
const DOT_MS = 560
const GAP_MS = 260

let uid = 0
const nextId = () => { uid += 1; return uid }

/* ── the thread engine ──────────────────────────────────────────────────────
   `said` is history, `queue` is what Kael still has to say. The effect walks
   the queue one line at a time and is the only writer, so two lines can
   never be typing together. */
function useThread() {
  const [said, setSaid] = useState([])
  const [queue, setQueue] = useState([])
  const [live, setLive] = useState(null)
  const timers = useRef([])
  const clearTimers = () => { timers.current.forEach((t) => { clearTimeout(t); clearInterval(t) }); timers.current = [] }
  useEffect(() => () => clearTimers(), [])

  useEffect(() => {
    if (live || !queue.length) return undefined
    const [head, ...rest] = queue
    setQueue(rest)
    setLive({ text: head.text, shown: '', dots: true })
    const t0 = setTimeout(() => {
      const start = performance.now()
      const tick = setInterval(() => {
        const chars = Math.floor((performance.now() - start) / TYPE_SPEED)
        if (chars >= head.text.length) {
          clearInterval(tick)
          setSaid((s) => [...s, { id: nextId(), who: 'kael', text: head.text }])
          timers.current.push(setTimeout(() => setLive(null), GAP_MS))
          return
        }
        setLive({ text: head.text, shown: head.text.slice(0, chars), dots: false })
      }, 32)
      timers.current.push(tick)
    }, DOT_MS)
    timers.current.push(t0)
    return undefined
  }, [queue, live])

  const kael = (lines) => setQueue((q) => [...q, ...lines.filter(Boolean).map((text) => ({ text }))])
  const user = (text) => setSaid((s) => [...s, { id: nextId(), who: 'user', text }])
  /* tapping anywhere finishes whatever Kael is mid-way through saying */
  const rush = () => {
    if (!live && !queue.length) return
    clearTimers()
    setSaid((s) => {
      const out = [...s]
      if (live) out.push({ id: nextId(), who: 'kael', text: live.text })
      queue.forEach((l) => out.push({ id: nextId(), who: 'kael', text: l.text }))
      return out
    })
    setQueue([])
    setLive(null)
  }
  const reset = () => { clearTimers(); setSaid([]); setQueue([]); setLive(null) }
  return { said, live, busy: Boolean(live) || queue.length > 0, kael, user, rush, reset }
}

/* ── atoms ──────────────────────────────────────────────────────────────── */
const Dots = () => <span className="v11-dots" aria-label="Kael is typing"><i /><i /><i /></span>
const KaelDots = () => (
  <div className="v11-row">
    <span className="v11-av"><Sparkle size={10} weight="fill" /></span>
    <span className="v11-bub v11-bub-k v11-bub-dots"><Dots /></span>
  </div>
)
const Bubble = ({ who, text, caret, mark }) => (
  who === 'user'
    ? <p className="v11-bub v11-bub-u">{text}</p>
    : (
      <div className="v11-row">
        {mark ? <span className="v11-av"><Sparkle size={10} weight="fill" /></span> : <span className="v11-av-ghost" />}
        <p className="v11-bub v11-bub-k">{text}{caret && <i className="v11-caret" />}</p>
      </div>
    )
)

/* ── the door ───────────────────────────────────────────────────────────── */
function DoorScreen({ onNext }) {
  const [at, setAt] = useState(0)
  const lines = PINNED.door.lines
  useEffect(() => {
    if (at >= lines.length) return undefined
    const t = setTimeout(() => setAt((n) => n + 1), at === 0 ? 650 : 2000)
    return () => clearTimeout(t)
  }, [at, lines.length])
  return (
    <div className="v11-screen v11-door" onClick={() => setAt(lines.length)}>
      <div className="v11-door-mid">
        <span className="v11-orb" aria-hidden="true"><i /><i /><i /></span>
        <div className="v11-door-lines">
          {lines.slice(0, at).map((l, k) => (
            <p key={l} className={`v11-door-line${k === 0 ? ' v11-door-lead' : ''}`}>{l}</p>
          ))}
        </div>
      </div>
      <div className="v11-foot">
        <button className="v11-cta" data-wait={at < lines.length || undefined} onClick={(e) => { e.stopPropagation(); onNext() }}>
          {PINNED.door.cta}
        </button>
      </div>
    </div>
  )
}

/* ── the note, written in front of them ─────────────────────────────────── */
function NoteScreen({ payload, onNext }) {
  const [raw, setRaw] = useState('')
  const [done, setDone] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    const ctrl = new AbortController()
    streamNote(payload, setRaw, ctrl.signal).then(() => setDone(true))
    return () => ctrl.abort()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { const el = ref.current; if (el && !done) el.scrollTop = el.scrollHeight }, [raw, done])

  const note = useMemo(() => parseNote(raw), [raw])
  const rich = (t) => t.split(/(\*[^*]+\*)/g).filter(Boolean).map((seg, i) => (
    seg.startsWith('*') && seg.endsWith('*')
      ? <em key={i}>{seg.slice(1, -1)}</em>
      : <span key={i}>{seg}</span>
  ))
  return (
    <div className="v11-screen v11-note">
      <div className="v11-note-scroll" ref={ref}>
        <span className="v11-kicker v11-note-kicker">
          {done ? 'Kael’s note' : <><Sparkle size={11} weight="fill" />Kael is writing</>}
        </span>
        {note.title && <h1 className="v11-note-title">{note.title}</h1>}
        {note.salutation && <p className="v11-note-hi">{note.salutation}</p>}
        {note.blocks.map((b, k) => {
          if (b.kind === 'h') return <h2 className="v11-note-h" key={k}>{b.text}</h2>
          if (b.kind === 'sign') return <p className="v11-note-sign" key={k}>{b.text}</p>
          return <p className="v11-note-p" key={k}>{rich(b.text)}{!done && k === note.blocks.length - 1 && <i className="v11-caret" />}</p>
        })}
        {!note.title && !note.blocks.length && <div className="v11-note-wait"><Dots /></div>}
        <div className="v11-note-sp" />
      </div>
      <div className="v11-foot">
        <button className="v11-cta" data-wait={!done || undefined} onClick={onNext}>
          This is mine<ArrowRight size={15} weight="bold" />
        </button>
      </div>
    </div>
  )
}

function SavedScreen({ onNext }) {
  return (
    <div className="v11-screen v11-saved">
      <div className="v11-door-mid">
        <span className="v11-saved-mark" aria-hidden="true"><Check size={26} weight="bold" /></span>
        <span className="v11-kicker">{PINNED.saved.kicker}</span>
        <h1 className="v11-saved-t">{PINNED.saved.title}</h1>
        <p className="v11-saved-s">{PINNED.saved.body}</p>
      </div>
      <div className="v11-foot">
        <button className="v11-cta" onClick={onNext}>{PINNED.saved.cta}</button>
      </div>
    </div>
  )
}

/* the two facts, answered inside the thread rather than on a screen of their
   own, so the conversation never breaks for a form */
function FactsBlock({ needName, onDone }) {
  const [age, setAge] = useState(null)
  const [gender, setGender] = useState(null)
  const [nm, setNm] = useState('')
  const ready = age && gender && (!needName || nm.trim())
  return (
    <div className="v11-facts" onClick={(e) => e.stopPropagation()}>
      {needName && (
        <div className="v11-fact">
          <span className="v11-fact-l">What should I call you?</span>
          <div className="v11-composer v11-fact-name">
            <input value={nm} placeholder="Your name" onChange={(e) => setNm(e.target.value)} />
          </div>
        </div>
      )}
      {[
        { k: 'age', label: PINNED.facts.age.label, options: PINNED.facts.age.options, value: age, set: setAge },
        { k: 'gender', label: PINNED.facts.gender.label, options: PINNED.facts.gender.options, value: gender, set: setGender },
      ].map((row, i) => (
        <div className="v11-fact" key={row.k} style={{ '--d': `${0.08 * i + 0.05}s` }}>
          <span className="v11-fact-l">{row.label}</span>
          <div className="v11-fact-opts">
            {row.options.map((o) => (
              <button key={o} className="v11-chip" data-on={row.value === o || undefined} onClick={() => row.set(o)}>{o}</button>
            ))}
          </div>
        </div>
      ))}
      <button className="v11-cta v11-facts-go" data-wait={!ready || undefined} onClick={() => onDone(age, gender, nm)}>
        {PINNED.facts.cta}
      </button>
    </div>
  )
}

/* ── the machine ────────────────────────────────────────────────────────── */

/* with no name yet, drop the address entirely: "I have enough, you." is
   worse than saying nothing */
const fill = (s, name) => (name
  ? String(s).replace(/\{name\}/g, name)
  : String(s).replace(/,?\s*\{name\}/g, ''))

/* Someone who types "my girlfriend left me man" into the name box is not
   telling you their name, they are starting the session. */
const looksLikeName = (v = '') => {
  const t = v.trim()
  if (!t || t.length > 24) return false
  if (t.split(/\s+/).length > 2) return false
  if (/[.!?,;:"']/.test(t)) return false
  if (/\b(i|my|me|im|i'm|we|she|he|they|and|but|because|left|feel|feels|felt|cant|can't|dont|don't)\b/i.test(t)) return false
  return true
}

export default function OnboardingV11() {
  const [stage, setStage] = useState('door')   // door | chat | note | saved
  const [phase, setPhase] = useState('name')   // name | facts | session
  const th = useThread()

  const [name, setName] = useState('')
  const [needName, setNeedName] = useState(false)
  const [transcript, setTranscript] = useState([])
  const [turn, setTurn] = useState(null)
  const [pending, setPending] = useState(false)
  const [slot, setSlot] = useState(1)
  const [covered, setCovered] = useState([])
  const [insightsLeft, setInsightsLeft] = useState(3)
  const [reliefUsed, setReliefUsed] = useState(false)
  const [relief, setRelief] = useState(null)
  const [head, setHead] = useState({ title: '', subtitle: '' })
  const [source, setSource] = useState('—')
  const [draft, setDraft] = useState('')
  const [answered, setAnswered] = useState(false)
  const [factsDue, setFactsDue] = useState(false)

  const bodyRef = useRef(null)
  const inFlight = useRef(false)

  useEffect(() => {
    const el = bodyRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [th.said, th.live, pending, turn, phase])

  const advance = async (nextSlot, extra = {}) => {
    if (inFlight.current) return
    inFlight.current = true
    setPending(true)
    const cov = extra.covered || covered
    const rem = [...FREE_SET.filter((t) => !cov.includes(t)), 'WANT']
    const out = await fetchTurn({
      slot: nextSlot,
      total: TOTAL_ASKS,
      territory: rem[0] || 'WANT',
      remaining: rem,
      covered: cov,
      transcript: extra.transcript || transcript,
      insightsLeft,
      wantNoticing: nextSlot === NOTICING_AFTER + 1,
      reliefAvailable: !reliefUsed && nextSlot >= RELIEF_FROM,
      reliefUrgent: !reliefUsed && nextSlot >= TOTAL_ASKS - 2,
    })
    setSource(out.source || 'model')
    if (out.title || out.subtitle) setHead((h) => ({ title: out.title || h.title, subtitle: out.subtitle || h.subtitle }))
    if (out.insight) setInsightsLeft((n) => Math.max(0, n - 1))
    if (out.kind === 'relief') setReliefUsed(true)
    th.kael([...(out.noticing || []), out.ack, out.insight, out.question])
    setTurn(out)
    setSlot(nextSlot)
    setAnswered(false)
    setPending(false)
    inFlight.current = false
  }

  const answer = (value, typed) => {
    if (answered || pending) return
    setAnswered(true)
    th.rush()
    th.user(value)
    setDraft('')

    if (phase === 'name') {
      if (looksLikeName(value)) {
        const n = value.trim().split(' ')[0]
        const nm = n.charAt(0).toUpperCase() + n.slice(1)
        setName(nm)
        setTranscript([{ territory: 'NAME', question: PINNED.name.question, value, typed: true }])
        th.kael(PINNED.name.ack.map((l) => fill(l, nm)))
        setPhase('facts')
        setAnswered(false)
        return
      }
      const entry = { territory: 'OPENING', question: PINNED.name.question, value, typed: true }
      setTranscript([entry])
      setCovered(['OPENING'])
      setNeedName(true)
      setFactsDue(true)
      setPhase('session')
      advance(2, { transcript: [entry], covered: ['OPENING'] })
      return
    }

    const t = turn || {}
    const entry = { territory: t.territory || 'OPENING', question: t.question, value, typed }
    const next = [...transcript, entry]
    setTranscript(next)

    if (t.kind === 'relief') {
      setRelief(value)
      advance(slot, { transcript: next, covered })
      return
    }
    const cov = [...covered, entry.territory]
    setCovered(cov)
    if (slot >= TOTAL_ASKS) {
      th.kael([fill(PINNED.handoff.lead, name), PINNED.handoff.body])
      setTurn({ kind: 'handoff' })
      setAnswered(false)
      return
    }
    advance(slot + 1, { transcript: next, covered: cov })
  }

  const startSession = () => {
    setPhase('session')
    th.kael([fill(PINNED.frame.lead, name), PINNED.frame.body, PINNED.frame.promise, PINNED.opening.question])
    setTurn({ ...PINNED.opening, kind: 'ask' })
  }

  const restart = () => {
    setStage('door'); setPhase('name'); th.reset()
    setName(''); setNeedName(false); setTranscript([]); setTurn(null); setPending(false)
    setSlot(1); setCovered([]); setInsightsLeft(3); setReliefUsed(false); setRelief(null)
    setHead({ title: '', subtitle: '' }); setSource('—'); setDraft(''); setAnswered(false); setFactsDue(false)
  }

  const send = () => { const v = draft.trim(); if (v) answer(v, true) }

  const showFacts = (phase === 'facts' || factsDue) && !th.busy && !pending
  const options = !answered && !pending && !th.busy && !showFacts && turn?.kind !== 'handoff' ? (turn?.options || []) : []
  const showComposer = !showFacts && turn?.kind !== 'handoff'
  const placeholder = phase === 'name' ? PINNED.name.placeholder : (turn?.placeholder || 'or say it your way')
  const arc = stage === 'door' ? 0 : stage !== 'chat' ? 1 : Math.min(0.92, 0.12 + (slot / TOTAL_ASKS) * 0.78)

  return (
    <div className="lib-page ov-page v11-page">
      <div className="ov-stage">
        <div className="ov-screen v11-frame" style={{ '--arc': arc }}>
          <div className="v11-wash" aria-hidden="true" />
          {stage !== 'door' && (
            <header className="v11-head" data-titled={head.title ? true : undefined}>
              <span className="v11-mark" aria-hidden="true"><i /></span>
              {head.title ? (
                <div className="v11-head-id" key={head.title}>
                  <h2>{head.title}</h2>
                  {head.subtitle && <span>{head.subtitle}</span>}
                </div>
              ) : (
                <span className="v11-brand">Kael</span>
              )}
            </header>
          )}

          {stage === 'door' && <DoorScreen onNext={() => { setStage('chat'); th.kael([PINNED.name.question]) }} />}

          {stage === 'chat' && (
            <div className="v11-screen v11-chatscreen" onClick={th.rush}>
              <div className="v11-thread" ref={bodyRef}>
                {th.said.map((m, i) => {
                  /* the mark sits on the last line of a run, never on every
                     line, or the thread grows a column of logos */
                  const nextIsKael = th.said[i + 1]?.who === 'kael'
                  const liveFollows = i === th.said.length - 1 && (th.live || pending)
                  return <Bubble key={m.id} who={m.who} text={m.text} mark={m.who === 'kael' && !nextIsKael && !liveFollows} />
                })}
                {th.live && (th.live.dots ? <KaelDots /> : <Bubble who="kael" text={th.live.shown} caret mark />)}
                {pending && !th.live && <KaelDots />}

                {showFacts && (
                  <FactsBlock
                    needName={needName}
                    onDone={(age, gender, typedName) => {
                      if (typedName) { const n = typedName.trim().split(' ')[0]; setName(n.charAt(0).toUpperCase() + n.slice(1)) }
                      th.user([typedName, age, gender].filter(Boolean).join(' · '))
                      setTranscript((p) => [...p,
                        ...(typedName ? [{ territory: 'NAME', question: '(arrival)', value: typedName, typed: true }] : []),
                        { territory: 'AGE', question: '(arrival)', value: age, typed: false },
                        { territory: 'GENDER', question: '(arrival)', value: gender, typed: false },
                      ])
                      if (factsDue) { setFactsDue(false); return }  /* session already running */
                      startSession()
                    }}
                  />
                )}

                {options.length > 0 && (
                  <div className={`v11-opts${turn?.kind === 'relief' ? ' v11-opts-relief' : ''}`}>
                    {options.map((o, k) => (
                      <button key={o.label + k} className="v11-opt" style={{ '--d': `${0.05 * k + 0.04}s` }}
                        onClick={(e) => { e.stopPropagation(); answer(o.label, false) }}>
                        {o.label}
                      </button>
                    ))}
                  </div>
                )}

                {turn?.kind === 'handoff' && !th.busy && (
                  <div className="v11-opts">
                    <button className="v11-opt v11-opt-go" onClick={(e) => { e.stopPropagation(); setStage('note') }}>
                      {PINNED.handoff.cta}
                    </button>
                  </div>
                )}
                <div className="v11-thread-sp" />
              </div>

              {showComposer && (
                <div className="v11-foot">
                  <div className="v11-composer" data-wait={pending || undefined}>
                    <input
                      value={draft}
                      placeholder={placeholder}
                      onChange={(e) => setDraft(e.target.value)}
                      onFocus={th.rush}
                      onKeyDown={(e) => { if (e.key === 'Enter') send() }}
                    />
                    <button className="v11-send" data-on={draft.trim().length > 0 || undefined} onClick={send} aria-label="Send">
                      <PaperPlaneTilt size={15} weight="fill" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {stage === 'note' && <NoteScreen payload={{ name, transcript, relief }} onNext={() => setStage('saved')} />}
          {stage === 'saved' && <SavedScreen onNext={restart} />}
        </div>
      </div>
      <div className="ob-devbar">
        <span>{stage}/{phase} · slot {slot}/{TOTAL_ASKS}</span>
        <button onClick={restart}>Restart</button>
        <span style={{ opacity: 0.6 }}>{source}{reliefUsed ? ' · relief' : ''}</span>
      </div>
    </div>
  )
}
