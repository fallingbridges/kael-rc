import { useState } from 'react'
import {
  User, Compass, EnvelopeSimple,
  BookmarkSimple, ArrowsClockwise, Spiral,
} from '@phosphor-icons/react'

/* ──────────────────────────────────────────────────────────────────────────
   Reflection card — six MATERIAL treatments rather than six layouts.
   Monochrome throughout. What changes is depth, surface, inversion and
   graphic weight, not where the elements sit.
   ────────────────────────────────────────────────────────────────────────── */

const SET = [
  {
    id: 'dad', when: '6d ago', d: '24', m: 'Jun', Icon: User, Glyph: Spiral, count: 8,
    title: 'The fight with Dad',
    read: 'Anger on the surface, but something older underneath it.',
    tags: ['Family', 'Dad', 'Heavy'],
    pattern: 'Inheritance loop',
  },
  {
    id: 'manager', when: '1w ago', d: '16', m: 'Jun', Icon: EnvelopeSimple, Glyph: Compass, count: 6,
    title: 'What my manager’s silence does to me',
    read: 'Four hours on read, and a verdict I wrote myself.',
    tags: ['Work', 'Priya'],
    pattern: 'Silence spiral',
  },
  {
    id: 'restless', when: '2h ago', d: '30', m: 'Jun', Icon: Compass, Glyph: Spiral, count: 5,
    title: 'Why am I so restless lately?',
    read: 'Life is moving, but maybe not in the right direction.',
    tags: ['Direction', 'Restless'],
    pattern: null,
  },
]

const stop = (fn) => (ev) => { ev.stopPropagation(); fn() }

function Mark({ id, cls = '' }) {
  const [on, setOn] = useState(id === 'manager')
  return (
    <button
      className={`mv-mark ${cls}`}
      data-on={on || undefined}
      onClick={stop(() => setOn((s) => !s))}
      aria-label={on ? 'Remove bookmark' : 'Bookmark'}
      aria-pressed={on}
    >
      <BookmarkSimple size={18} weight={on ? 'fill' : 'regular'} />
    </button>
  )
}

function Tags({ e, cls = '' }) {
  return (
    <div className={`mv-tags ${cls}`}>
      {e.tags.map((t) => (<span className="mv-tag" key={t}>{t}</span>))}
      {e.pattern && (
        <span className="mv-tag mv-tag-pat"><ArrowsClockwise size={11} weight="bold" />{e.pattern}</span>
      )}
    </div>
  )
}

/* 1 · Watermark — the topic glyph bled large and faint behind the writing */
function M1({ e }) {
  return (
    <article className="mv mv1">
      <span className="mv1-wm" aria-hidden="true"><e.Glyph size={150} weight="duotone" /></span>
      <div className="mv1-top">
        <span className="mv-when">{e.when}</span>
        <Mark id={e.id} />
      </div>
      <h3 className="mv-title">{e.title}</h3>
      <p className="mv-read">{e.read}</p>
      <Tags e={e} />
    </article>
  )
}

/* 2 · Inverted — ink surface, cream type. The archive as something solid */
function M2({ e }) {
  return (
    <article className="mv mv2">
      <div className="mv2-top">
        <span className="mv-when">{e.when} · {e.count} messages</span>
        <Mark id={e.id} cls="mv-mark-inv" />
      </div>
      <h3 className="mv-title">{e.title}</h3>
      <p className="mv-read">{e.read}</p>
      <Tags e={e} cls="mv-tags-inv" />
    </article>
  )
}

/* 3 · Split — a tinted panel holds the date and the icon, writing sits beside */
function M3({ e }) {
  return (
    <article className="mv mv3">
      <div className="mv3-panel">
        <span className="mv3-d">{e.d}</span>
        <span className="mv3-m">{e.m}</span>
        <span className="mv3-ic"><e.Icon size={17} weight="duotone" /></span>
      </div>
      <div className="mv3-body">
        <div className="mv3-top">
          <h3 className="mv-title">{e.title}</h3>
          <Mark id={e.id} cls="mv-mark-tight" />
        </div>
        <p className="mv-read">{e.read}</p>
        <Tags e={e} />
      </div>
    </article>
  )
}

/* 4 · Stack — faint layers behind the card, so a long thread looks thick */
function M4({ e }) {
  return (
    <div className="mv4-wrap">
      <span className="mv4-l2" aria-hidden="true" />
      <span className="mv4-l1" aria-hidden="true" />
      <article className="mv mv4">
        <div className="mv3-top">
          <h3 className="mv-title">{e.title}</h3>
          <Mark id={e.id} cls="mv-mark-tight" />
        </div>
        <p className="mv-read">{e.read}</p>
        <Tags e={e} />
        <span className="mv4-count">{e.count} messages</span>
      </article>
    </div>
  )
}

/* 5 · Numeral — the date set large as the graphic anchor of the row */
function M5({ e }) {
  return (
    <article className="mv mv5">
      <div className="mv5-date">
        <span className="mv5-d">{e.d}</span>
        <span className="mv5-m">{e.m}</span>
      </div>
      <div className="mv5-body">
        <div className="mv3-top">
          <h3 className="mv-title">{e.title}</h3>
          <Mark id={e.id} cls="mv-mark-tight" />
        </div>
        <p className="mv-read">{e.read}</p>
        <Tags e={e} />
      </div>
    </article>
  )
}

/* 6 · Grand — the title given real size, everything else whispered */
function M6({ e }) {
  return (
    <article className="mv mv6">
      <div className="mv6-rule" aria-hidden="true" />
      <div className="mv6-top">
        <span className="mv6-eye">{e.tags[0]}</span>
        <Mark id={e.id} cls="mv-mark-tight" />
      </div>
      <h3 className="mv6-title">{e.title}</h3>
      <p className="mv-read">{e.read}</p>
      <p className="mv6-meta">{[...e.tags.slice(1), e.pattern].filter(Boolean).join(' · ')} · {e.when}</p>
    </article>
  )
}

const VARIANTS = [
  { id: 1, name: '1 · Watermark', note: 'The topic glyph bled large and faint behind the writing.', C: M1 },
  { id: 2, name: '2 · Inverted', note: 'Ink surface, cream type. The archive as something solid.', C: M2 },
  { id: 3, name: '3 · Split panel', note: 'A tinted panel carries the date and icon; writing beside it.', C: M3 },
  { id: 4, name: '4 · Stack', note: 'Faint layers behind, so a long thread physically looks thick.', C: M4 },
  { id: 5, name: '5 · Numeral', note: 'The date set large as the graphic anchor of the row.', C: M5 },
  { id: 6, name: '6 · Grand', note: 'The title given real size, everything else whispered.', C: M6 },
]

export default function CardVariants() {
  return (
    <div className="lib-page mv-page">
      <h1 className="lib-title">Reflection card</h1>
      <p className="lib-sub">
        Six material treatments rather than six layouts. Monochrome throughout: what changes is
        depth, surface, inversion and graphic weight.
      </p>
      <div className="mv-grid">
        {VARIANTS.map((v) => (
          <section className="mv-col" key={v.id}>
            <div className="mv-head">
              <span className="mv-name">{v.name}</span>
              <span className="mv-note">{v.note}</span>
            </div>
            <div className="mv-stack">
              {SET.map((e) => <v.C key={e.id} e={e} />)}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
