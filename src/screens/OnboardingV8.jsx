import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, PaperPlaneTilt, Sparkle } from '@phosphor-icons/react'
import {
  PINNED, SPINE, TOTAL_ASKS, FRAME_AFTER, NOTICING_AFTER, LIGHT, pinnedAsk,
  localNoticing, fetchTurn, fetchReflection, fragment,
} from '../obv8.js'

/* ──────────────────────────────────────────────────────────────────────────
   Kael V8 — Session Zero.

   The design language is a conversation, like the V7 first screen: Kael's
   lines arrive as typed chat bubbles behind a small sparkle avatar, the
   user's answer sits above as their own bubble, typing dots hold the beats
   between, options are quick-reply chips, and the composer never leaves
   the bottom. One screen per exchange. Ceremony screens (frame, noticing,
   handoff, notify) keep a pinned CTA. Nothing auto-advances.
   ────────────────────────────────────────────────────────────────────────── */

const EASE = [0.22, 0.61, 0.36, 1]
const TYPE_SPEED = 26  /* ms per char; the pace is the product, keep it slow */
const DOT_MS = 750     /* the typing-dots beat before each bubble */
const GAP_MS = 420     /* silence after a bubble lands */

/* the paper warms by hour, same windows as the Reflect room */
function hourTone() {
  const h = new Date().getHours()
  if (h < 5 || h >= 21) return 'night'
  if (h < 9) return 'dawn'
  if (h < 17) return 'day'
  return 'dusk'
}

/* ── the chat script ────────────────────────────────────────────────────────
   Drives a sequence of bubbles: dots, then character-by-character typing,
   then a breath, then the next bubble. Time-based rather than tick-counted,
   so a throttled interval can never strand a bubble mid-word. A tap lands
   everything instantly. */
function useChatScript(items, speed = TYPE_SPEED, delay = 460) {
  const key = items.map((i) => i.text).join('')
  const spans = useMemo(() => {
    let t = delay
    return items.map((it) => {
      const dotsAt = t
      t += DOT_MS
      const typeAt = t
      t += it.text.length * speed
      t += GAP_MS
      return { dotsAt, typeAt }
    })
  }, [key, speed, delay]) // eslint-disable-line react-hooks/exhaustive-deps
  const total = items.length
    ? spans[items.length - 1].typeAt + items[items.length - 1].text.length * speed
    : 0

  const [t, setT] = useState(0)
  const rushRef = useRef(false)
  useEffect(() => {
    rushRef.current = false
    setT(0)
    if (!total) return undefined
    const t0 = performance.now()
    const id = setInterval(() => {
      if (rushRef.current) { setT(total); clearInterval(id); return }
      const e = performance.now() - t0
      setT(e)
      if (e >= total) clearInterval(id)
    }, 40)
    return () => clearInterval(id)
  }, [key, total]) // eslint-disable-line react-hooks/exhaustive-deps

  const bubbles = items.map((it, i) => {
    const sp = spans[i]
    if (t < sp.dotsAt) return { ...it, state: 'hidden', shown: '' }
    if (t < sp.typeAt) return { ...it, state: 'dots', shown: '' }
    const chars = Math.floor((t - sp.typeAt) / speed)
    if (chars < it.text.length) return { ...it, state: 'typing', shown: it.text.slice(0, Math.max(0, chars)) }
    return { ...it, state: 'done', shown: it.text }
  })
  const allDone = total === 0 || t >= total
  const finish = useCallback(() => { rushRef.current = true; setT(total) }, [total])
  return { bubbles, allDone, finish }
}

/* ── chat atoms ─────────────────────────────────────────────────────────── */

/* one avatar per message group, anchored to the newest bubble.
   Deliberately NOT a shared layoutId: shared layout elements inside
   AnimatePresence stall exit completion in framer v11, which is how the
   stuck-at-opacity-0 screens happened. */
const Avatar = () => (
  <span className="ov8-av" aria-hidden="true"><Sparkle size={11} weight="fill" /></span>
)

const Dots = () => (
  <span className="ov8-dots" aria-label="Kael is typing"><i /><i /><i /></span>
)

function KaelRow({ bubble, withAvatar }) {
  if (bubble.state === 'hidden') return null
  return (
    <div className="ov8-row">
      {withAvatar ? <Avatar /> : <span className="ov8-av-ghost" />}
      {bubble.state === 'dots' ? (
        <span className="ov8-bubble ov8-bubble-kael ov8-bubble-dots"><Dots /></span>
      ) : (
        <p className="ov8-bubble ov8-bubble-kael">
          {bubble.shown}
          {bubble.state === 'typing' && <i className="ov8-caret" />}
        </p>
      )}
    </div>
  )
}

/* the index of the newest visible bubble, where the avatar sits */
const newestOf = (bubbles) => bubbles.reduce((a, b, k) => (b.state !== 'hidden' ? k : a), -1)

/* the user's own words, carried down from the chip they tapped */
const UserBubble = ({ text }) =>
  text ? <p className="ov8-bubble ov8-bubble-user">{text}</p> : null

/* a quiet day-divider, chat-native, for the noticing */
const Divider = ({ children }) => <span className="ov8-divider">{children}</span>

/* ── Kael speaks: frame, noticing, handoff, notify ──────────────────────── */

function CeremonyScreen({ echo, divider, items = [], pending, cta = 'Continue', quiet, onQuiet, onNext }) {
  const { bubbles, allDone, finish } = useChatScript(pending ? [] : items)
  const ready = allDone && !pending && items.length > 0
  return (
    <div className="ov8-screen" onClick={finish}>
      <div className="ov8-sbody ov8-chat">
        {echo && <UserBubble text={echo} />}
        {divider && <Divider>{divider}</Divider>}
        {pending && (
          <div className="ov8-row"><Avatar /><span className="ov8-bubble ov8-bubble-kael ov8-bubble-dots"><Dots /></span></div>
        )}
        {bubbles.map((b, k) => <KaelRow key={k} bubble={b} withAvatar={k === newestOf(bubbles)} />)}
      </div>
      <div className="ov8-foot">
        <button className="ov8-cta" data-wait={!ready || undefined} onClick={(e) => { e.stopPropagation(); onNext() }}>
          {cta}
        </button>
        {quiet && (
          <button className="ov8-quiet" data-wait={!ready || undefined} onClick={(e) => { e.stopPropagation(); (onQuiet || onNext)() }}>
            {quiet}
          </button>
        )}
      </div>
    </div>
  )
}

/* ── Kael asks: ack bubble, question bubble, chips, composer ────────────── */

function AskScreen({ echo, ack, insight, question, options = [], placeholder, pending, nameField, onAnswer }) {
  const items = useMemo(() => {
    if (pending || !question) return []
    const list = []
    if (ack) list.push({ text: ack })
    if (insight) list.push({ text: insight })
    list.push({ text: question })
    return list
  }, [pending, ack, insight, question])

  const { bubbles, allDone, finish } = useChatScript(items)
  const [draft, setDraft] = useState('')
  const [picked, setPicked] = useState(null)
  const inputRef = useRef(null)

  useEffect(() => { if (nameField) inputRef.current?.focus() }, [nameField])

  const pick = (o) => {
    if (picked) return
    setPicked(o.label)
    setTimeout(() => onAnswer(o.label, o), 420)
  }
  const send = () => {
    const v = draft.trim()
    if (!v || picked || pending || !allDone) return
    setPicked(v)
    setTimeout(() => onAnswer(v, null), 300)
  }

  return (
    <div className="ov8-screen" onClick={finish}>
      <div className="ov8-sbody ov8-chat">
        {echo && <UserBubble text={echo} />}
        {(pending || !question) && (
          <div className="ov8-row"><Avatar /><span className="ov8-bubble ov8-bubble-kael ov8-bubble-dots"><Dots /></span></div>
        )}
        {bubbles.map((b, k) => <KaelRow key={k} bubble={b} withAvatar={k === newestOf(bubbles)} />)}
        {allDone && !pending && options.length > 0 && (
          <div className="ov8-chips">
            {options.map((o, k) => (
              <button
                key={o.label}
                className="ov8-chip"
                style={{ '--d': `${0.06 * k + 0.08}s` }}
                data-on={picked === o.label || undefined}
                data-dim={picked && picked !== o.label ? true : undefined}
                onClick={(e) => { e.stopPropagation(); pick(o) }}
              >
                {o.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="ov8-foot">
        <div className="ov8-composer" data-solo={nameField || undefined}>
          <input
            ref={inputRef}
            value={draft}
            placeholder={placeholder}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') send() }}
          />
          <button className="ov8-send" data-on={draft.trim().length > 0 || undefined} onClick={send} aria-label="Send">
            <PaperPlaneTilt size={16} weight="fill" />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── 1 · Meet Kael: a proper intro, not a chat. The orb breathes, the name
   lands, one quiet line, Start. The conversation begins on the next screen,
   which makes the register shift itself the transition. ─────────────────── */

function MeetScreen({ onNext }) {
  return (
    <div className="ov8-screen">
      <div className="ov8-sbody ov8-meet-body">
        <div className="ov8-meet-in">
          <span className="ov8-orb" aria-hidden="true" />
          <h1 className="ov8-meet-t">{PINNED.meet.title}</h1>
          <p className="ov8-meet-s">{PINNED.meet.sub}</p>
        </div>
      </div>
      <div className="ov8-foot">
        <button className="ov8-cta ov8-meet-cta" onClick={onNext}>{PINNED.meet.cta}</button>
      </div>
    </div>
  )
}

/* ── the build ──────────────────────────────────────────────────────────── */

/* Real generation, real duration. The stages quote the user, so the wait is
   one more proof of attention instead of a spinner. */
function BuildScreen({ quote, ready, slow, onDone }) {
  const [pct, setPct] = useState(0)
  const stages = useMemo(
    () => PINNED.stages.map((s) => s.replace('{quote}', quote || 'what you told me')),
    [quote],
  )

  /* time-based: eases toward 92 and holds until the Reflection exists */
  const startRef = useRef(performance.now())
  useEffect(() => {
    const iv = setInterval(() => {
      const s = (performance.now() - startRef.current) / 1000
      const held = 92 * (1 - Math.exp(-s / 2.6))
      setPct((p) => Math.max(p, ready ? Math.min(100, p + 3) : held))
    }, 60)
    return () => clearInterval(iv)
  }, [ready])

  useEffect(() => {
    if (pct >= 100) { const t = setTimeout(onDone, 500); return () => clearTimeout(t) }
    return undefined
  }, [pct, onDone])

  const idx = Math.min(stages.length - 1, Math.floor((pct / 100) * stages.length))

  return (
    <div className="ov8-screen ov8-build">
      <div className="ov8-sbody ov8-build-body">
        <span className="ov8-think" aria-hidden="true">
          <i className="ov8-ring" />
          <i className="ov8-ring" data-i="2" />
          <span className="ov8-mark" data-breathe="true" />
        </span>
        <span className="ov8-pct">{Math.round(pct)}%</span>
        <AnimatePresence mode="wait">
          <motion.p
            key={idx}
            className="ov8-stage"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.34, ease: EASE }}
          >
            {stages[idx]}
          </motion.p>
        </AnimatePresence>
        {slow && <p className="ov8-slow">Still with you.</p>}
      </div>
    </div>
  )
}

/* ── the Report ─────────────────────────────────────────────────────────── */

/* The one screen that breaks the chat on purpose: not a soft reflection but
   a session report. A pattern detected, the loop anatomized, the evidence
   receipts, and how it breaks. Scannable top to bottom. Still a LIBRARY
   record underneath. */
function ReportScreen({ data, onNext }) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })
  const loop = data.loop || {}

  /* the loop rows ARE evidence; never print the same quote twice on one
     page. Anything the model adds beyond the loop shows up here, capped. */
  const loopVals = new Set(
    [loop.trigger, loop.response, loop.cost].map((x) => String(x || '').trim().toLowerCase()),
  )
  const extra = (data.evidence || [])
    .filter((e) => !loopVals.has(String(e.quote || '').trim().toLowerCase()))
    .slice(0, 2)

  return (
    <div className="ov8-screen ov8-refl-screen">
      <div className="ov8-sbody ov8-refl-scroll">
        <div className="ov8-sheet">
          <header className="ov8-sheet-head">
            <span className="ov8-kicker">What Kael found</span>
            <span className="ov8-date">{today}</span>
          </header>

          <h1 className="ov8-pat">{data.pattern}</h1>
          <p className="ov8-essence">{data.essence}</p>
          {data.answers > 0 && (
            <p className="ov8-seen">Seen in {data.hits} of your {data.answers} answers.</p>
          )}

          <section className="ov8-refl-sec">
            <span className="ov8-sec-t">The loop</span>
            <div className="ov8-loop">
              <div className="ov8-loop-row"><span>it starts</span><p>{loop.trigger}</p></div>
              <div className="ov8-loop-row"><span>you reach for</span><p>{loop.response}</p></div>
              <div className="ov8-loop-row"><span>it costs</span><p>{loop.cost}</p></div>
            </div>
          </section>

          {extra.length > 0 && (
            <section className="ov8-refl-sec">
              <span className="ov8-sec-t">In your words</span>
              {extra.map((e, k) => (
                <div className="ov8-ev" key={k}>
                  <blockquote className="ov8-quote">{e.quote}</blockquote>
                  <span className="ov8-ev-sig">{e.signal}</span>
                </div>
              ))}
            </section>
          )}

          {data.absence && (
            <section className="ov8-refl-sec">
              <span className="ov8-sec-t">What you didn't say</span>
              <p className="ov8-refl-p ov8-refl-absence">{data.absence}</p>
            </section>
          )}

          {data.breaks?.length > 0 && (
            <section className="ov8-refl-sec">
              <span className="ov8-sec-t">How it breaks</span>
              {data.breaks.map((b, k) => (
                <div className="ov8-break" key={k}>
                  <span className="ov8-break-n">{k + 1}</span>
                  <div className="ov8-break-t">
                    <b>{b.move}</b>
                    <p>{b.how}</p>
                  </div>
                </div>
              ))}
            </section>
          )}

          <footer className="ov8-sheet-foot">
            <span className="ov8-sign">— Kael</span>
            <p className="ov8-note">One session's read. It sharpens every time we talk.</p>
          </footer>
        </div>
        <div className="ov8-saved">Saved to your Journey.</div>
      </div>
      <div className="ov8-foot">
        <button className="ov8-cta" onClick={onNext}>This sounds like me</button>
      </div>
    </div>
  )
}

/* ── the road: what the 30 days after the report look like ──────────────── */

function RoadScreen({ onNext }) {
  return (
    <div className="ov8-screen">
      <div className="ov8-sbody ov8-road-body">
        <span className="ov8-kicker">{PINNED.road.kicker}</span>
        <h1 className="ov8-road-t">{PINNED.road.title}</h1>
        <ol className="ov8-miles">
          {PINNED.road.miles.map((m, k) => (
            <li key={m.when} style={{ '--d': `${0.1 * k + 0.15}s` }}>
              <span className="ov8-mile-when">{m.when}</span>
              <div className="ov8-mile-t">
                <b>{m.t}</b>
                <p>{m.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="ov8-foot">
        <button className="ov8-cta" onClick={onNext}>{PINNED.road.cta}</button>
      </div>
    </div>
  )
}

/* ── the paywall: a note from Kael, not a feature grid ──────────────────── */

function PayScreen({ onNext }) {
  const [plan, setPlan] = useState('annual')
  return (
    <div className="ov8-screen">
      <div className="ov8-sbody ov8-pay-body">
        <span className="ov8-kicker">{PINNED.pay.kicker}</span>
        {PINNED.pay.letter.map((l, k) => (
          <p key={k} className="ov8-pay-p" data-first={k === 0 || undefined}>{l}</p>
        ))}
        <div className="ov8-plans">
          {PINNED.pay.plans.map((pl) => (
            <button key={pl.id} className="ov8-plan" data-on={plan === pl.id || undefined} onClick={() => setPlan(pl.id)}>
              {pl.tag && <span className="ov8-plan-tag">{pl.tag}</span>}
              <span className="ov8-plan-l"><b>{pl.name}</b><i>{pl.sub}</i></span>
              <span className="ov8-plan-r"><b>{pl.price}</b><i>{pl.per}</i></span>
            </button>
          ))}
        </div>
      </div>
      <div className="ov8-foot">
        <button className="ov8-cta" onClick={onNext}>{PINNED.pay.cta}</button>
        <p className="ov8-pay-sub">{PINNED.pay.sub}</p>
        <div className="ov8-pay-links">
          {PINNED.pay.links.map((l) => <button key={l}>{l}</button>)}
        </div>
      </div>
    </div>
  )
}

/* ── the session ────────────────────────────────────────────────────────── */

export default function OnboardingV8() {
  const [screens, setScreens] = useState([{ kind: 'meet' }])
  const [i, setI] = useState(0)
  const [name, setName] = useState('')
  const [turns, setTurns] = useState([])
  const [refl, setRefl] = useState(null)
  const [slow, setSlow] = useState(false)

  const s = screens[i] || screens[0]
  const tone = useMemo(hourTone, [])

  /* interrupting a mode="wait" transition can strand the incoming screen at
     its exit style; one nav per transition window keeps that impossible */
  const navLock = useRef(0)
  const go = useCallback((n) => {
    const now = performance.now()
    if (now - navLock.current < 420) return
    navLock.current = now
    setI((cur) => Math.min(screens.length - 1, Math.max(0, n ?? cur + 1)))
  }, [screens.length])
  const push = useCallback((items) => {
    setScreens((prev) => { const next = [...prev, ...items]; setI(prev.length); return next })
  }, [])

  const restart = () => { setScreens([{ kind: 'meet' }]); setI(0); setName(''); setTurns([]); setRefl(null); setSlow(false) }

  /* their reaction to the midpoint summary enters the transcript: a
     confirmed read lets the report speak with confidence, a pushback tells
     it to hold the pattern more lightly */
  const confirmSummary = (value) => {
    setTurns((prev) => [
      ...prev.filter((t) => t.territory !== 'SUMMARY'),
      { slot: NOTICING_AFTER + 0.5, territory: 'SUMMARY', question: 'Kael retold their story back. Their response:', value, typed: false, tags: [] },
    ])
  }

  /* the reflection call starts the moment the last answer lands, so the
     loader covers real work rather than performing it */
  const startReflection = useCallback((all) => {
    setSlow(false)
    const t = setTimeout(() => setSlow(true), 8000)
    fetchReflection({ turns: all, name }).then((r) => { clearTimeout(t); setRefl(r) })
  }, [name])

  const onAnswer = (value, opt) => {
    /* name is not a session turn; it is the key everything else interpolates.
       It still gets met like a person: the greeting is the first bubble of
       the next screen, before the form framing. */
    if (s.kind === 'ask' && s.nameField) {
      const nm = value.trim().split(' ')[0]
      const capped = nm.charAt(0).toUpperCase() + nm.slice(1)
      setName(capped)
      push([{ kind: 'ask', ...pinnedAsk('AGE', 1), ack: `Nice to meet you, ${capped}.`, echo: value }])
      return
    }

    const turn = {
      slot: s.slot,
      territory: s.territory,
      question: s.question,
      value,
      typed: !opt,
      tags: opt?.tags || [],
      ack: opt?.ack || null,
    }
    /* re-answering after back-nav replaces the old turn instead of
       duplicating the slot in the transcript */
    const all = [...turns.filter((t) => t.slot < s.slot), turn]
    setTurns(all)

    /* the arrival act is a fast, honest form: pinned screens, no model call,
       no acks. The frame then delivers the promise and the session begins. */
    if (s.slot < FRAME_AFTER) {
      const node = SPINE[s.slot] /* next slot's node */
      push([{ kind: 'ask', ...pinnedAsk(node.territory, node.slot), echo: value }])
      return
    }
    if (s.slot === FRAME_AFTER) {
      push([{ kind: 'frame', echo: value }])
      return
    }

    if (s.slot >= TOTAL_ASKS) {
      push([{ kind: 'handoff', echo: value }])
      startReflection(all)
      return
    }

    const nextSlot = s.slot + 1
    const covered = all.map((t) => t.territory)

    /* the ack and the next question share one screen, like a conversation;
       the noticing interleaves as its own beat at the midpoint */
    const stub = { kind: 'ask', slot: nextSlot, pending: true, echo: value }
    const withNoticing = s.slot === NOTICING_AFTER
    if (withNoticing) {
      /* the midpoint synthesis: "let me make sure I have this right." The
         model retells their story as one thread; local fallback fills it if
         the model doesn't. Confirming or pushing back goes into the
         transcript, so the report knows how tightly to hold its read. */
      stub.echo = null
      push([
        {
          kind: 'noticing',
          echo: value,
          divider: "Something I'm noticing",
          pending: true,
          cta: "That's it",
          quiet: 'Not quite',
        },
        stub,
      ])
    } else {
      push([stub])
    }
    const stubAt = screens.length + (withNoticing ? 1 : 0)

    fetchTurn({ slot: nextSlot, last: turn, covered, transcript: all, insightsLeft: 3, wantNoticing: withNoticing })
      .then((res) => {
        const noticingItems = (res.noticing?.length ? res.noticing : localNoticing(all)).map((text) => ({ text }))
        setScreens((prev) => prev.map((sc, k) => {
          if (withNoticing && k === stubAt - 1 && sc.kind === 'noticing') {
            return { ...sc, pending: false, items: noticingItems }
          }
          if (k !== stubAt) return sc
          return {
            ...sc,
            pending: false,
            territory: res.territory,
            ack: res.ack || null,
            insight: res.insight || null,
            question: res.question,
            options: res.options,
            placeholder: res.placeholder,
          }
        }))
      })
  }

  const body = (() => {
    switch (s.kind) {
      case 'meet':
        return <MeetScreen onNext={() => push([{ kind: 'ask', nameField: true, ...PINNED.name, options: [] }])} />

      case 'frame':
        return (
          <CeremonyScreen
            echo={s.echo}
            items={[
              { text: PINNED.frame.lead.replace('{name}', name) },
              { text: PINNED.frame.body },
              { text: PINNED.frame.promise, promise: true },
            ]}
            cta={PINNED.frame.cta}
            onNext={() => push([{ kind: 'ask', slot: 3, ...PINNED.opening }])}
          />
        )

      case 'noticing':
        return (
          <CeremonyScreen
            echo={s.echo}
            divider={s.divider}
            items={s.items}
            pending={s.pending}
            cta={s.cta}
            quiet={s.quiet}
            onNext={() => { confirmSummary('confirmed, that is it') ; go(i + 1) }}
            onQuiet={() => { confirmSummary('said it was not quite right'); go(i + 1) }}
          />
        )

      case 'handoff':
        return (
          <CeremonyScreen
            echo={s.echo}
            items={[
              { text: PINNED.handoff.lead },
              { text: PINNED.handoff.body },
            ]}
            cta={PINNED.handoff.cta}
            onNext={() => push([{ kind: 'notify' }])}
          />
        )

      /* the ask sits BEFORE the reveal: anticipation is at its peak, and the
         report is generating behind this screen the whole time */
      case 'notify':
        return (
          <CeremonyScreen
            items={[
              { text: PINNED.notify.lines[0] },
              { text: PINNED.notify.lines[1] },
            ]}
            cta={PINNED.notify.yes}
            quiet={PINNED.notify.no}
            onNext={() => push([{ kind: 'build' }])}
            onQuiet={() => push([{ kind: 'build' }])}
          />
        )

      case 'build':
        return (
          <BuildScreen
            quote={fragment(turns.find((t) => t.typed)?.value || turns.find((t) => !LIGHT.has(t.territory))?.value)}
            ready={Boolean(refl)}
            slow={slow}
            onDone={() => push([{ kind: 'report' }])}
          />
        )

      case 'report':
        return refl ? <ReportScreen data={refl} onNext={() => push([{ kind: 'road' }])} /> : null

      case 'road':
        return <RoadScreen onNext={() => push([{ kind: 'pay' }])} />

      case 'pay':
        return <PayScreen onNext={restart} />

      case 'ask':
      default:
        return (
          <AskScreen
            echo={s.echo}
            ack={s.ack}
            insight={s.insight}
            question={s.question}
            options={s.options || []}
            placeholder={s.placeholder}
            pending={s.pending}
            nameField={s.nameField}
            onAnswer={onAnswer}
          />
        )
    }
  })()

  /* back appears only on ask screens; the meet screen owns its own hero */
  const showHead = s.kind !== 'meet'
  const canBack = i > 0 && s.kind === 'ask' && !s.nameField

  return (
    <div className="lib-page ov-page ov8-page" data-tone={tone}>
      <div className="ov-stage">
        <div className="ov-screen ov8-frame" data-theme="light">
          {showHead && (
            <header className="ov8-head">
              <button className="ov8-back" data-hide={!canBack || undefined} onClick={() => go(i - 1)} aria-label="Back">
                <ArrowLeft size={19} weight="regular" />
              </button>
              <span className="ov8-brand"><span className="ov8-mark" />Kael</span>
            </header>
          )}
          <div className="ov8-stagebody">
            {/* sync mode, deliberately: with mode="wait", the shared-layoutId
                elements (avatar, echo) can stall onExitComplete and strand the
                incoming screen at opacity 0. Sync also lets the chip genuinely
                fly into the next screen's user bubble. */}
            <AnimatePresence initial={false}>
              <motion.div
                key={i}
                className="ov8-page-in"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE, delay: 0.08 } }}
                exit={{ opacity: 0, transition: { duration: 0.16, ease: 'easeOut' } }}
              >
                {body}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="ob-devbar ov8-dev">
        <button onClick={() => go(i - 1)}>Prev</button>
        <span>{s.kind}{s.slot ? ` ${s.slot}/${TOTAL_ASKS}` : ''}</span>
        <button onClick={() => go(i + 1)}>Next</button>
        <button onClick={restart}>Restart</button>
        <span className="ov8-src">{refl?.source === 'model' ? 'live' : 'local'}</span>
      </div>
    </div>
  )
}
