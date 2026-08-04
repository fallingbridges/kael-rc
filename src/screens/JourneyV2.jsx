import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, PaperPlaneTilt, Sparkle, Check } from '@phosphor-icons/react'
import {
  PINNED, STAGE_ORDER, STAGE_META, TOTAL_SCREENS, EXERCISE_TYPES, EXERCISE_LABEL,
  TYPE_LABEL, journeyAccent, fragment, breathPhases,
  fetchStart, fetchNext, fetchArtifact,
} from '../journeyV2.js'

/* ──────────────────────────────────────────────────────────────────────────
   Kael V2 — Adaptive Therapy Journeys.

   Every screen has one job and the session always feels like progress. The
   structure is invisible: the user sees a conversation that keeps moving, and
   the stage rail reports psychological progress rather than a percentage.

   Screen types are fixed. Everything inside them is written for this person,
   this session, by the model in journeyV2.js.
   ────────────────────────────────────────────────────────────────────────── */

const EASE = [0.22, 0.61, 0.36, 1]

/* ── atoms ──────────────────────────────────────────────────────────────── */

const Mark = () => (
  <span className="jv2-mark" aria-hidden="true"><Sparkle size={11} weight="fill" /></span>
)

const Dots = () => (
  <span className="jv2-dots" aria-label="Kael is thinking"><i /><i /><i /></span>
)

/* Kael's answer to the last screen. It sits at the top, above the new
   question, so the screen reads as a reply and not a form. */
function Ack({ text }) {
  if (!text) return null
  return (
    <motion.div
      className="jv2-ack"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: EASE }}
    >
      <Mark />
      <p>{text}</p>
    </motion.div>
  )
}

/* psychological progress, not 12%. The rail names the stage you are in and
   fills as the session moves through it. */
function StageRail({ stages, stage, screenNo }) {
  const idx = Math.max(0, stages.findIndex((s) => s.id === stage))
  const here = stages[idx]
  return (
    <div className="jv2-rail">
      <div className="jv2-rail-head">
        <span className="jv2-rail-name">{here?.name || 'Session'}</span>
        <span className="jv2-rail-goal">{here?.goal || ''}</span>
      </div>
      <div className="jv2-rail-bars">
        {stages.map((s, k) => (
          <span
            key={s.id}
            className="jv2-rail-bar"
            data-state={k < idx ? 'done' : k === idx ? 'here' : 'ahead'}
          >
            <i style={k === idx ? { width: `${Math.min(96, (screenNo / TOTAL_SCREENS) * 100 + 22)}%` } : undefined} />
          </span>
        ))}
      </div>
    </div>
  )
}

/* the composer. Present on every screen that wants their words, absent on the
   ones that do not, which is how the screen says what it wants. */
function Composer({ value, onChange, onSend, placeholder, ready }) {
  return (
    <div className="jv2-composer">
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') onSend() }}
      />
      <button
        className="jv2-send"
        data-on={ready || undefined}
        onClick={onSend}
        aria-label="Send"
      >
        <PaperPlaneTilt size={15} weight="fill" />
      </button>
    </div>
  )
}

function Options({ options, picked, onPick }) {
  if (!options?.length) return null
  return (
    <div className="jv2-opts">
      {options.map((o, k) => (
        <motion.button
          key={o.label + k}
          className="jv2-opt"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.36, delay: 0.1 + k * 0.05, ease: EASE }}
          data-on={picked === o.label || undefined}
          onClick={() => onPick(o)}
        >
          <span>{o.label}</span>
          <i className="jv2-opt-tick"><Check size={12} weight="bold" /></i>
        </motion.button>
      ))}
    </div>
  )
}

/* the percentage loader, used for both waits. Real work runs behind it, so it
   eases toward 92 and only finishes when the work does. */
function Loader({ steps, ready, onDone, tint }) {
  const [pct, setPct] = useState(0)
  const start = useRef(performance.now())

  useEffect(() => {
    const iv = setInterval(() => {
      const s = (performance.now() - start.current) / 1000
      const held = 92 * (1 - Math.exp(-s / 2.4))
      setPct((p) => Math.max(p, ready ? Math.min(100, p + 4) : held))
    }, 55)
    return () => clearInterval(iv)
  }, [ready])

  useEffect(() => {
    if (pct >= 100) { const t = setTimeout(onDone, 420); return () => clearTimeout(t) }
    return undefined
  }, [pct, onDone])

  const idx = Math.min(steps.length - 1, Math.floor((pct / 100) * steps.length))

  return (
    <div className="jv2-screen jv2-load" style={tint ? { '--accent': tint } : undefined}>
      <div className="jv2-load-in">
        <span className="jv2-orb" aria-hidden="true"><i /><i /><span /></span>
        <span className="jv2-pct">{Math.round(pct)}%</span>
        <div className="jv2-load-bar"><i style={{ width: `${pct}%` }} /></div>
        <AnimatePresence mode="wait">
          <motion.p
            key={idx}
            className="jv2-load-step"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            {steps[idx]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ── arrival ────────────────────────────────────────────────────────────── */

function OpenScreen({ onAnswer }) {
  const [draft, setDraft] = useState('')
  const [picked, setPicked] = useState(null)

  const pick = (o) => { setPicked(o.label); setTimeout(() => onAnswer(o.label, o.tags, false), 340) }
  const send = () => { const v = draft.trim(); if (v) onAnswer(v, [], true) }

  return (
    <div className="jv2-screen">
      <div className="jv2-body">
        <span className="jv2-kicker">{PINNED.open.kicker}</span>
        <h1 className="jv2-q jv2-q-hero">{PINNED.open.title}</h1>
        <p className="jv2-sub">{PINNED.open.sub}</p>
        <Options options={PINNED.open.options} picked={picked} onPick={pick} />
      </div>
      <div className="jv2-foot">
        <Composer
          value={draft}
          onChange={setDraft}
          onSend={send}
          placeholder={PINNED.open.placeholder}
          ready={draft.trim().length > 0}
        />
      </div>
    </div>
  )
}

function WeightScreen({ value, onChange, onNext }) {
  return (
    <div className="jv2-screen">
      <div className="jv2-body">
        <h1 className="jv2-q">{PINNED.weight.title}</h1>
        <p className="jv2-sub">{PINNED.weight.sub}</p>
        <div className="jv2-weight">
          {PINNED.weight.marks.map((m) => (
            <button
              key={m.v}
              className="jv2-weight-mark"
              data-on={value === m.v || undefined}
              data-under={value >= m.v || undefined}
              onClick={() => onChange(m.v)}
            >
              <i />
              <span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="jv2-foot">
        <button className="jv2-cta" onClick={onNext}>{PINNED.weight.cta}</button>
      </div>
    </div>
  )
}

/* the journey reveal. The one screen that shows the structure, once, so the
   rest of the session can hide it again. */
function RevealScreen({ journey, stages, onNext }) {
  return (
    <div className="jv2-screen" style={{ '--accent': journeyAccent(journey.id) }}>
      <div className="jv2-body jv2-reveal">
        <span className="jv2-kicker">Where we're going</span>
        <h1 className="jv2-reveal-t">{journey.name}</h1>
        <p className="jv2-reveal-read">{journey.read}</p>
        <p className="jv2-reveal-promise">{journey.promise}</p>
        <ol className="jv2-map">
          {stages.map((s, k) => (
            <motion.li
              key={s.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.18 + k * 0.08, ease: EASE }}
            >
              <span className="jv2-map-n">{k + 1}</span>
              <div className="jv2-map-t">
                <b>{s.name}</b>
                <i>{s.goal}</i>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
      <div className="jv2-foot">
        <button className="jv2-cta" onClick={onNext}>Begin</button>
      </div>
    </div>
  )
}

/* ── the adaptive screens ───────────────────────────────────────────────── */

/* listen · clarify · emotion · body · reflect · plan */
function AskScreen({ s, onAnswer }) {
  const [draft, setDraft] = useState('')
  const [picked, setPicked] = useState(null)

  const pick = (o) => { setPicked(o.label); setTimeout(() => onAnswer(o.label, o.tags, false), 340) }
  const send = () => { const v = draft.trim(); if (v && !picked) onAnswer(v, [], true) }

  return (
    <div className="jv2-screen">
      <div className="jv2-body">
        <Ack text={s.ack} />
        <h1 className="jv2-q">{s.title}</h1>
        {s.body && <p className="jv2-sub">{s.body}</p>}
        <Options options={s.options} picked={picked} onPick={pick} />
      </div>
      <div className="jv2-foot">
        {s.placeholder ? (
          <Composer
            value={draft}
            onChange={setDraft}
            onSend={send}
            placeholder={s.placeholder}
            ready={draft.trim().length > 0}
          />
        ) : (
          <button className="jv2-cta" onClick={() => onAnswer('', [], false)}>{s.cta || 'Continue'}</button>
        )}
      </div>
    </div>
  )
}

/* breathing. The ring is the exercise: it grows on the inhale, holds, and
   releases, and the count is large enough to follow with your eyes closed
   half the time. */
function BreatheScreen({ s, onAnswer }) {
  const phases = useMemo(() => breathPhases(s.pattern), [s.pattern])
  const ROUNDS = 4
  const [on, setOn] = useState(false)
  const [ph, setPh] = useState(0)
  const [left, setLeft] = useState(phases[0].s)
  const [round, setRound] = useState(0)

  useEffect(() => {
    if (!on || round >= ROUNDS) return undefined
    const iv = setInterval(() => {
      setLeft((l) => {
        if (l > 1) return l - 1
        setPh((p) => {
          const nxt = (p + 1) % phases.length
          if (nxt === 0) setRound((r) => r + 1)
          setLeft(phases[nxt].s)
          return nxt
        })
        return phases[(ph + 1) % phases.length].s
      })
    }, 1000)
    return () => clearInterval(iv)
  }, [on, ph, phases, round])

  const done = round >= ROUNDS
  const cur = phases[ph]
  /* a hold keeps whatever size the breath just reached, which CSS cannot
     remember on its own, so the scale is computed here and handed to the ring */
  const grown = cur.hold ? phases[(ph - 1 + phases.length) % phases.length].grow : cur.grow
  const scale = !on || done ? 0.86 : grown ? 1 : 0.78

  return (
    <div className="jv2-screen">
      <div className="jv2-body">
        <Ack text={s.ack} />
        <h1 className="jv2-q jv2-q-sm">{s.title}</h1>
        {s.body && <p className="jv2-sub">{s.body}</p>}

        <div className="jv2-breath">
          <div
            className="jv2-ring"
            data-run={on && !done ? 'true' : undefined}
            style={{ '--dur': `${on && !done ? cur.s : 0.6}s`, '--s': scale }}
          >
            <i /><i />
            <div className="jv2-ring-in">
              {done ? (
                <span className="jv2-ring-done"><Check size={22} weight="bold" /></span>
              ) : on ? (
                <>
                  <b>{left}</b>
                  <span>{cur.label}</span>
                </>
              ) : (
                <span className="jv2-ring-idle">{s.pattern || '4-4-4-4'}</span>
              )}
            </div>
          </div>
          <div className="jv2-rounds">
            {Array.from({ length: ROUNDS }).map((_, k) => (
              <i key={k} data-on={k < round || undefined} />
            ))}
          </div>
        </div>
      </div>
      <div className="jv2-foot">
        {!on && !done ? (
          <button className="jv2-cta" onClick={() => setOn(true)}>Start breathing</button>
        ) : (
          /* really disabled, not just dimmed: the exercise is the point, and
             "Not right now" is the honest way past it */
          <button
            className="jv2-cta"
            data-wait={!done || undefined}
            disabled={!done}
            onClick={() => onAnswer(`completed ${round} rounds of ${s.pattern}`, ['regulated'], false)}
          >
            {s.cta || "I'm done"}
          </button>
        )}
        {!done && <button className="jv2-quiet" onClick={() => onAnswer('skipped the breathing', ['skipped'], false)}>Not right now</button>}
      </div>
    </div>
  )
}

/* grounding and defusion both reveal one beat at a time, because reading them
   all at once turns an exercise back into a list. */
function StepScreen({ s, onAnswer, kind }) {
  const steps = s.steps?.length ? s.steps : ['Take one slow breath before the next screen.']
  const [at, setAt] = useState(0)
  const last = at >= steps.length - 1

  return (
    <div className="jv2-screen">
      <div className="jv2-body">
        <Ack text={s.ack} />
        <h1 className="jv2-q jv2-q-sm">{s.title}</h1>
        {s.body && <p className="jv2-sub">{s.body}</p>}
        <ol className="jv2-steps" data-kind={kind}>
          {steps.slice(0, at + 1).map((line, k) => (
            <motion.li
              key={k}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.44, ease: EASE }}
              data-past={k < at || undefined}
            >
              <span className="jv2-step-n">{k + 1}</span>
              <p>{line}</p>
            </motion.li>
          ))}
        </ol>
      </div>
      <div className="jv2-foot">
        {last ? (
          <button className="jv2-cta" onClick={() => onAnswer(`worked through ${steps.length} steps`, [kind], false)}>
            {s.cta || 'Done'}
          </button>
        ) : (
          <button className="jv2-cta" onClick={() => setAt((a) => a + 1)}>Next</button>
        )}
      </div>
    </div>
  )
}

/* the CBT screen. Two prompts, two answers, and the second one is where the
   work is, so it gets the same weight as the first. */
function CbtScreen({ s, onAnswer }) {
  const prompts = s.steps?.length >= 2 ? s.steps.slice(0, 2) : ['What supports this thought?', "What doesn't?"]
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const ready = a.trim().length > 0 || b.trim().length > 0

  return (
    <div className="jv2-screen">
      <div className="jv2-body">
        <Ack text={s.ack} />
        <h1 className="jv2-q jv2-q-sm">{s.title}</h1>
        {s.body && <p className="jv2-sub">{s.body}</p>}
        <div className="jv2-cbt">
          <label className="jv2-field">
            <span className="jv2-field-l" data-side="for">{prompts[0]}</span>
            <textarea rows={3} value={a} onChange={(e) => setA(e.target.value)} placeholder="Whatever is actually true" />
          </label>
          <label className="jv2-field">
            <span className="jv2-field-l" data-side="against">{prompts[1]}</span>
            <textarea rows={3} value={b} onChange={(e) => setB(e.target.value)} placeholder="Take your time with this one" />
          </label>
        </div>
      </div>
      <div className="jv2-foot">
        <button
          className="jv2-cta"
          data-soft={!ready || undefined}
          onClick={() => onAnswer([`For: ${a.trim() || '(nothing)'}`, `Against: ${b.trim() || '(nothing)'}`], ['cbt'], true)}
        >
          {s.cta || 'Done'}
        </button>
      </div>
    </div>
  )
}

/* psychoeducation. One concept, one minute, and the last beat has to land on
   them or the screen was a pamphlet. */
function TeachScreen({ s, onAnswer }) {
  const steps = s.steps?.length ? s.steps : [s.body].filter(Boolean)
  return (
    <div className="jv2-screen">
      <div className="jv2-body">
        <Ack text={s.ack} />
        <span className="jv2-kicker">One idea</span>
        <h1 className="jv2-q jv2-q-sm">{s.title}</h1>
        <div className="jv2-teach">
          {steps.map((line, k) => (
            <motion.p
              key={k}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.14 + k * 0.14, ease: EASE }}
              data-last={k === steps.length - 1 || undefined}
            >
              {line}
            </motion.p>
          ))}
        </div>
      </div>
      <div className="jv2-foot">
        <button className="jv2-cta" onClick={() => onAnswer('read the idea', ['taught'], false)}>{s.cta || 'That tracks'}</button>
      </div>
    </div>
  )
}

function CloseScreen({ s, journey, onAnswer }) {
  return (
    <div className="jv2-screen" style={{ '--accent': journeyAccent(journey?.id) }}>
      <div className="jv2-body jv2-close">
        <Mark />
        <motion.h1
          className="jv2-close-t"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          {s.title}
        </motion.h1>
        {s.body && <p className="jv2-close-b">{s.body}</p>}
      </div>
      <div className="jv2-foot">
        <button className="jv2-cta" onClick={() => onAnswer('', [], false)}>{s.cta || 'See my reflection'}</button>
      </div>
    </div>
  )
}

/* ── the artifact ───────────────────────────────────────────────────────── */

function ArtifactScreen({ data, journey, exercises, onRestart }) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })
  return (
    <div className="jv2-screen jv2-art-screen" style={{ '--accent': journeyAccent(journey?.id) }}>
      <div className="jv2-body jv2-art-scroll">
        <div className="jv2-sheet">
          <header className="jv2-sheet-head">
            <span className="jv2-kicker">{PINNED.artifactKicker}</span>
            <span className="jv2-date">{today}</span>
          </header>

          <h1 className="jv2-art-t">{data.title}</h1>
          <p className="jv2-art-sum">{data.summary}</p>

          <section className="jv2-sec">
            <span className="jv2-sec-t">What happened</span>
            <p className="jv2-p">{data.happened}</p>
          </section>

          {data.feeling?.length > 0 && (
            <section className="jv2-sec">
              <span className="jv2-sec-t">What you're feeling</span>
              <div className="jv2-tags">
                {data.feeling.map((f, k) => <span key={k} className="jv2-tag">{f}</span>)}
              </div>
            </section>
          )}

          <section className="jv2-sec">
            <span className="jv2-sec-t">The pattern I noticed</span>
            <div className="jv2-card">
              <b>{data.pattern?.name}</b>
              <p>{data.pattern?.detail}</p>
            </div>
          </section>

          <section className="jv2-sec">
            <span className="jv2-sec-t">The thinking underneath</span>
            <div className="jv2-card">
              <b>{data.thinking?.name}</b>
              <p>{data.thinking?.detail}</p>
              {data.thinking?.quote && <blockquote className="jv2-quote">{data.thinking.quote}</blockquote>}
            </div>
          </section>

          {exercises.length > 0 && (
            <section className="jv2-sec">
              <span className="jv2-sec-t">What helped</span>
              <div className="jv2-tags">
                {exercises.map((e) => (
                  <span key={e} className="jv2-tag jv2-tag-done"><Check size={11} weight="bold" />{EXERCISE_LABEL[e] || e}</span>
                ))}
              </div>
            </section>
          )}

          <section className="jv2-sec">
            <span className="jv2-sec-t">A different angle</span>
            <p className="jv2-p">{data.shift}</p>
          </section>

          {data.absence && (
            <section className="jv2-sec">
              <span className="jv2-sec-t">What you didn't say</span>
              <p className="jv2-p jv2-absence">{data.absence}</p>
            </section>
          )}

          <section className="jv2-sec">
            <span className="jv2-sec-t">For today</span>
            <div className="jv2-action">
              <b>{data.action?.move}</b>
              <p>{data.action?.how}</p>
              {data.action?.when && <span className="jv2-when">{data.action.when}</span>}
            </div>
          </section>

          {data.prompt && (
            <section className="jv2-sec">
              <span className="jv2-sec-t">If you want to write</span>
              <p className="jv2-p jv2-prompt">{data.prompt}</p>
            </section>
          )}

          <footer className="jv2-sheet-foot">
            <p className="jv2-note">{data.note}</p>
            <span className="jv2-sign">— Kael</span>
          </footer>
        </div>
        <div className="jv2-saved">Saved to your Journey.</div>
      </div>
      <div className="jv2-foot">
        <button className="jv2-cta" onClick={onRestart}>Done for today</button>
      </div>
    </div>
  )
}

/* ── the session ────────────────────────────────────────────────────────── */

export default function JourneyV2() {
  const [phase, setPhase] = useState('open')
  const [arrival, setArrival] = useState({ text: '', tags: [] })
  const [mood, setMood] = useState(3)
  const [journey, setJourney] = useState(null)
  const [stages, setStages] = useState([])
  const [screens, setScreens] = useState([])
  const [i, setI] = useState(0)
  const [transcript, setTranscript] = useState([])
  const [artifact, setArtifact] = useState(null)
  const [source, setSource] = useState('local')

  const s = screens[i]
  const exercises = useMemo(
    () => [...new Set(transcript.filter((t) => EXERCISE_TYPES.has(t.type) && !(t.tags || []).includes('skipped')).map((t) => t.type))],
    [transcript],
  )

  const restart = () => {
    setPhase('open'); setArrival({ text: '', tags: [] }); setMood(3)
    setJourney(null); setStages([]); setScreens([]); setI(0)
    setTranscript([]); setArtifact(null)
  }

  /* one nav per transition window; interrupting a mode="wait" exit can strand
     the incoming screen at its exit style */
  const lock = useRef(0)
  const idRef = useRef(0)
  const guard = useCallback(() => {
    const now = performance.now()
    if (now - lock.current < 380) return false
    lock.current = now
    return true
  }, [])

  /* the read starts the moment the weight lands, so the loader covers real
     work instead of performing it */
  const beginSession = () => {
    setPhase('reading')
    fetchStart({ arrival: arrival.text, tags: arrival.tags, mood }).then((r) => {
      setJourney(r.journey)
      setStages(r.stages?.length ? r.stages : STAGE_ORDER.map((id) => ({ id, ...STAGE_META[id] })))
      setScreens([r.screen])
      setSource(r.source)
    })
  }

  const buildArtifact = (all) => {
    setPhase('building')
    fetchArtifact({
      journey,
      transcript: all,
      exercises: [...new Set(all.filter((t) => EXERCISE_TYPES.has(t.type) && !(t.tags || []).includes('skipped')).map((t) => t.type))],
    }).then(setArtifact)
  }

  const onAnswer = (value, tags = [], typed = false) => {
    if (!s || !guard()) return
    const entry = { stage: s.stage, type: s.type, ack: s.ack, title: s.title, value, tags, typed }
    /* answering after a back-nav forks the session from here: everything the
       old branch said is dropped rather than duplicated in the transcript */
    const all = [...transcript.slice(0, i), entry]
    setTranscript(all)

    if (s.type === 'close' || all.length >= TOTAL_SCREENS) {
      buildArtifact(all)
      return
    }

    /* the next screen renders as a thinking beat while the model writes it,
       which is honest: something is genuinely being decided. The stub carries
       an id, and the fill matches on that id rather than on a position, so a
       fast second answer can never land in the first one's slot. */
    const id = ++idRef.current
    setScreens((prev) => [...prev.slice(0, i + 1), { id, pending: true, stage: s.stage }])
    setI(i + 1)

    fetchNext({
      journey,
      stages,
      stage: s.stage,
      screenNo: all.length + 1,
      total: TOTAL_SCREENS,
      transcript: all,
      used: all.map((t) => t.type),
      theme: journey?.id,
    }).then((next) => {
      setSource(next.source)
      setScreens((prev) => prev.map((sc) => (sc.id === id ? { ...next, id, pending: false } : sc)))
    })
  }

  const body = (() => {
    if (phase === 'open') {
      return (
        <OpenScreen
          onAnswer={(text, tags) => { setArrival({ text, tags }); setPhase('weight') }}
        />
      )
    }
    if (phase === 'weight') {
      return <WeightScreen value={mood} onChange={setMood} onNext={beginSession} />
    }
    if (phase === 'reading') {
      return (
        <Loader
          steps={PINNED.reading.map((l) => l.replace('{quote}', fragment(arrival.text, 30) || 'what you told me'))}
          ready={Boolean(journey)}
          onDone={() => setPhase('reveal')}
        />
      )
    }
    if (phase === 'reveal') {
      return <RevealScreen journey={journey} stages={stages} onNext={() => setPhase('session')} />
    }
    if (phase === 'building') {
      return (
        <Loader
          steps={PINNED.building}
          ready={Boolean(artifact)}
          onDone={() => setPhase('artifact')}
          tint={journeyAccent(journey?.id)}
        />
      )
    }
    if (phase === 'artifact') {
      return <ArtifactScreen data={artifact} journey={journey} exercises={exercises} onRestart={restart} />
    }

    if (!s) return null
    if (s.pending) {
      return (
        <div className="jv2-screen">
          <div className="jv2-body jv2-think">
            <Mark />
            <Dots />
          </div>
        </div>
      )
    }

    switch (s.type) {
      case 'breathe': return <BreatheScreen s={s} onAnswer={onAnswer} />
      case 'ground': return <StepScreen s={s} onAnswer={onAnswer} kind="ground" />
      case 'act': return <StepScreen s={s} onAnswer={onAnswer} kind="act" />
      case 'cbt': return <CbtScreen s={s} onAnswer={onAnswer} />
      case 'teach': return <TeachScreen s={s} onAnswer={onAnswer} />
      case 'close': return <CloseScreen s={s} journey={journey} onAnswer={onAnswer} />
      default: return <AskScreen s={s} onAnswer={onAnswer} />
    }
  })()

  const inSession = phase === 'session' && s && !s.pending
  const showHead = phase !== 'open' && phase !== 'reading' && phase !== 'building'
  const canBack = phase === 'session' && i > 0

  return (
    <div className="lib-page ov-page jv2-page">
      <div className="ov-stage">
        <div className="ov-screen jv2-frame" style={{ '--accent': journeyAccent(journey?.id) }}>
          {showHead && (
            <header className="jv2-head">
              <button
                className="jv2-back"
                data-hide={!canBack || undefined}
                onClick={() => { if (guard()) setI((k) => Math.max(0, k - 1)) }}
                aria-label="Back"
              >
                <ArrowLeft size={18} />
              </button>
              <span className="jv2-brand"><Mark />Kael</span>
              <span className="jv2-type">{inSession ? TYPE_LABEL[s.type] : ''}</span>
            </header>
          )}

          {inSession && stages.length > 0 && (
            <StageRail stages={stages} stage={s.stage} screenNo={i + 1} />
          )}

          <div className="jv2-stagebody">
            {/* keyed enter-only motion, no AnimatePresence: exit animations can
                wedge a keyed child at opacity 0 when phases change quickly, and
                a stuck screen costs more than a missing cross-fade */}
            <motion.div
              key={`${phase}-${i}`}
              className="jv2-page-in"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE } }}
            >
              {body}
            </motion.div>
          </div>
        </div>
      </div>

      <div className="ob-devbar jv2-dev">
        <button onClick={() => setI((k) => Math.max(0, k - 1))}>Prev</button>
        <span>{phase === 'session' ? `${s?.type || '…'} · ${i + 1}/${TOTAL_SCREENS}` : phase}</span>
        <button onClick={() => setI((k) => Math.min(screens.length - 1, k + 1))}>Next</button>
        <button onClick={restart}>Restart</button>
        <span className="jv2-src">{source === 'model' ? 'live' : 'local'}</span>
      </div>
    </div>
  )
}
