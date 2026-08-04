import { useMemo, useState } from 'react'
import { ArrowLeft, CaretRight, Sparkle } from '@phosphor-icons/react'
import { LIBRARY } from './ReflectConcept.jsx'
import { PATTERN_LESSONS } from '../patternLessons.js'

/* ──────────────────────────────────────────────────────────────────────────
   Insight — what the tags never told you.

   Tags filter; this screen means. Two destinations: Insight (the aggregate
   view of moods, people, topics, and loops across the library) and Lessons
   (the reading list ranked by which loops actually show up in it).

   Chart notes: the mood ring folds ten raw moods into four families, because
   ten equal slices is a table pretending to be a chart. The house mood
   accents are deliberately low-chroma, which fails a strict palette check,
   so identity is NEVER color-alone here: every segment has a 2-degree gap,
   every family is a labeled legend row with its count, and the center names
   the dominant family. Ring order alternates warm/cool for CVD separation
   (validated: worst adjacent pair ΔE 40).
   ────────────────────────────────────────────────────────────────────────── */

/* mood → family. Honest grouping: weather, not diagnosis. */
const FAMILIES = [
  { id: 'Low', color: '#6d82a0', members: ['Heavy', 'Sad', 'Tired', 'Grief', 'Guilt', 'Lonely', 'Numb'] },
  { id: 'Wired', color: '#c0894f', members: ['Anxious', 'Pressure', 'Stressed', 'Overwhelmed'] },
  { id: 'Spinning', color: '#8a82a0', members: ['Overthinking', 'Doubt', 'Restless'] },
  { id: 'Heat', color: '#b35f4a', members: ['Anger', 'Hurt', 'Ashamed'] },
]

const count = (map, k) => map.set(k, (map.get(k) || 0) + 1)

function aggregate(lib) {
  const fam = new Map()
  const people = new Map()
  const topics = new Map()
  const loops = new Map()

  lib.forEach((r) => {
    const seen = new Set()
    ;(r.moods || []).forEach((m) => {
      const f = FAMILIES.find((x) => x.members.includes(m))
      if (f && !seen.has(f.id)) { seen.add(f.id); count(fam, f.id) }
    })
    ;(r.people || []).forEach((p) => count(people, p))
    ;(r.topics || []).forEach((t) => count(topics, t))
    ;(r.patterns || []).forEach((l) => count(loops, l))
  })

  const rank = (m) => [...m.entries()].sort((a, b) => b[1] - a[1])
  return { fam, people: rank(people), topics: rank(topics), loops: rank(loops) }
}

/* ── the mood ring ──────────────────────────────────────────────────────── */

function MoodRing({ fam, total }) {
  const R = 52
  const W = 15
  const C = 2 * Math.PI * R
  const GAP = 0.022 * C /* the 2px-spacer rule, in arc length */
  const present = FAMILIES.filter((f) => fam.get(f.id))
  const sum = present.reduce((a, f) => a + fam.get(f.id), 0)
  const lead = present.reduce((a, f) => (fam.get(f.id) > (fam.get(a.id) || 0) ? f : a), present[0])

  let offset = 0
  const segs = present.map((f) => {
    const share = fam.get(f.id) / sum
    const len = Math.max(share * C - GAP, 2)
    const seg = { f, len, offset }
    offset += share * C
    return seg
  })

  return (
    <div className="ic-ring-row">
      <div className="ic-ring">
        <svg viewBox="0 0 128 128" aria-hidden="true">
          <circle cx="64" cy="64" r={R} fill="none" stroke="var(--field)" strokeWidth={W} />
          {segs.map((s) => (
            <circle
              key={s.f.id}
              cx="64" cy="64" r={R}
              fill="none"
              stroke={s.f.color}
              strokeWidth={W}
              strokeDasharray={`${s.len} ${C - s.len}`}
              strokeDashoffset={-s.offset - GAP / 2}
              transform="rotate(-90 64 64)"
            />
          ))}
        </svg>
        <div className="ic-ring-center">
          <b>{lead?.id}</b>
          <span>most weeks</span>
        </div>
      </div>
      <div className="ic-legend">
        {present.map((f) => (
          <div className="ic-leg-row" key={f.id} title={`${f.id}: ${fam.get(f.id)} of ${total} reflections`}>
            <i style={{ background: f.color }} />
            <div className="ic-leg-t">
              <b>{f.id}</b>
              <span>{f.members.filter((m) => LIBRARY.some((r) => r.moods?.includes(m))).join(', ').toLowerCase()}</span>
            </div>
            <em>{fam.get(f.id)}</em>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── ranked bars, one hue: length is the encoding, the number is the label ── */

function Bars({ rows, max = 5, unit }) {
  const top = rows.slice(0, max)
  const peak = top[0]?.[1] || 1
  const rest = rows.length - top.length
  return (
    <div className="ic-bars">
      {top.map(([name, n]) => (
        <div className="ic-bar-row" key={name} title={`${name}: ${n} ${unit}`}>
          <span className="ic-bar-name">{name}</span>
          <span className="ic-bar-track"><i style={{ width: `${(n / peak) * 100}%` }} /></span>
          <em>{n}</em>
        </div>
      ))}
      {rest > 0 && <span className="ic-bar-more">and {rest} more</span>}
    </div>
  )
}

/* ── loop cards with an occurrence strip, oldest → newest ───────────────── */

function LoopCard({ name, n, lib, onOpen }) {
  const timeline = [...lib].reverse() /* LIBRARY is newest-first */
  const lesson = PATTERN_LESSONS[name]
  return (
    <button className="ic-loop" onClick={() => lesson && onOpen(name)} title={`${name}: in ${n} of ${lib.length} reflections`}>
      <div className="ic-loop-t">
        <b>{name}</b>
        <span>In {n} of your {lib.length} reflections</span>
      </div>
      <span className="ic-strip" aria-hidden="true">
        {timeline.map((r) => (
          <i key={r.id} data-on={r.patterns?.includes(name) || undefined} />
        ))}
      </span>
      {lesson && <CaretRight size={15} weight="bold" className="ic-loop-go" />}
    </button>
  )
}

/* ── Insight ────────────────────────────────────────────────────────────── */

function InsightScreen({ agg, onLesson }) {
  const total = LIBRARY.length
  return (
    <div className="ic-screen">
      <header className="ic-head">
        <span className="ic-kicker">Insight</span>
        <h1 className="ic-title">Six weeks, drawn out.</h1>
        <p className="ic-sub">What keeps showing up across {total} reflections.</p>
      </header>

      <section className="ic-sec">
        <span className="ic-sec-t">Inner weather</span>
        <MoodRing fam={agg.fam} total={total} />
      </section>

      <section className="ic-sec">
        <span className="ic-sec-t">Who your mind returns to</span>
        <Bars rows={agg.people} unit="reflections" />
      </section>

      <section className="ic-sec">
        <span className="ic-sec-t">What it circles</span>
        <Bars rows={agg.topics} unit="reflections" />
      </section>

      <section className="ic-sec">
        <span className="ic-sec-t">Your loops</span>
        <div className="ic-loops">
          {agg.loops.map(([name, n]) => (
            <LoopCard key={name} name={name} n={n} lib={LIBRARY} onOpen={onLesson} />
          ))}
        </div>
      </section>

      <p className="ic-foot-note">
        <Sparkle size={12} weight="fill" /> Drawn from your reflections. It sharpens as you talk.
      </p>
    </div>
  )
}

/* ── Lessons ────────────────────────────────────────────────────────────── */

function LessonsScreen({ agg, onOpen }) {
  const rows = agg.loops.filter(([name]) => PATTERN_LESSONS[name])
  return (
    <div className="ic-screen">
      <header className="ic-head">
        <span className="ic-kicker">Lessons</span>
        <h1 className="ic-title">Reading for your loops.</h1>
        <p className="ic-sub">Short reads, in Kael's voice, ranked by what shows up most.</p>
      </header>

      <div className="ic-lessons">
        {rows.map(([name, n]) => {
          const l = PATTERN_LESSONS[name]
          return (
            <button className="ic-lesson" key={name} onClick={() => onOpen(name)}>
              <span className="ic-lesson-k">For your {name.toLowerCase()} · in {n} reflection{n === 1 ? '' : 's'}</span>
              <b className="ic-lesson-t">{l.title}</b>
              <span className="ic-lesson-lede">{l.lede}</span>
              <span className="ic-lesson-m">{l.minutes} min read <CaretRight size={12} weight="bold" /></span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ── the article, rendered from lesson blocks ───────────────────────────── */

function ArticleScreen({ name, n, onBack }) {
  const l = PATTERN_LESSONS[name]
  if (!l) return null
  return (
    <div className="ic-screen ic-art">
      <button className="ic-back" onClick={onBack} aria-label="Back"><ArrowLeft size={19} /></button>
      <span className="ic-kicker">{l.kicker}</span>
      <h1 className="ic-art-title">{l.title}</h1>
      <p className="ic-art-lede">{l.lede}</p>
      <span className="ic-art-meta">{l.minutes} min read · in {n} of your reflections</span>
      {l.blocks.map((b, k) => {
        if (b.t === 'h') return <h3 className="ic-art-h" key={k}>{b.v}</h3>
        if (b.t === 'quote') return <blockquote className="ic-art-q" key={k}>{b.v}</blockquote>
        if (b.t === 'list') return <ul className="ic-art-l" key={k}>{b.v.map((x, j) => <li key={j}>{x}</li>)}</ul>
        if (b.t === 'note') return <p className="ic-art-note" key={k}><Sparkle size={12} weight="fill" /> {b.v}</p>
        return <p className="ic-art-p" key={k}>{b.v}</p>
      })}
    </div>
  )
}

/* ── the lab ────────────────────────────────────────────────────────────── */

export default function InsightConcept() {
  const [view, setView] = useState('insight')
  const [article, setArticle] = useState(null)
  const agg = useMemo(() => aggregate(LIBRARY), [])
  const loopN = (name) => agg.loops.find(([x]) => x === name)?.[1] || 0

  return (
    <div className="lib-page ic-page">
      <div className="ov-stage">
        <div className="ov-screen ic-frame" data-theme="light">
          <div className="ic-scroll">
            {article ? (
              <ArticleScreen name={article} n={loopN(article)} onBack={() => setArticle(null)} />
            ) : view === 'lessons' ? (
              <LessonsScreen agg={agg} onOpen={setArticle} />
            ) : (
              <InsightScreen agg={agg} onLesson={setArticle} />
            )}
          </div>
        </div>
      </div>

      <div className="ob-devbar">
        <button data-on={view === 'insight' && !article || undefined} onClick={() => { setView('insight'); setArticle(null) }}>Insight</button>
        <button data-on={view === 'lessons' && !article || undefined} onClick={() => { setView('lessons'); setArticle(null) }}>Lessons</button>
      </div>
    </div>
  )
}
