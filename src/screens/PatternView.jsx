import { ArrowLeft, ArrowsClockwise } from '@phosphor-icons/react'
import { getPattern, PATTERN_FAMILIES, reflectionsWithTag, MOOD } from '../journal.js'

export default function PatternView({ name, onBack, onOpenReflection }) {
  const p = getPattern(name)
  const fam = p ? PATTERN_FAMILIES[p.family] : null
  const seen = reflectionsWithTag('patterns', name)
  const a = p?.anatomy
  // the eight fields, woven into small paragraphs — no subheadings
  const prose = a ? [
    `${a.trigger} ${a.story}`,
    `${a.emotion} ${a.body} ${a.move}`,
    a.cost,
    `${a.need} ${a.practice}`,
  ] : []

  return (
    <div className="ka-screen ka-pat" style={{ '--fam': 'var(--ink-2)' }}>
      <header className="ka-refl-top">
        <button className="ka-icon-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
      </header>
      <div className="ka-scroll">
        <div className="ka-pat-head">
          {fam && <span className="ka-pat-fam"><span className="ka-pat-fam-dot" />{fam.label} loop</span>}
          <h1 className="ka-pat-name">{name}</h1>
          {p?.aka && <span className="ka-pat-aka">also known as {p.aka}</span>}
        </div>

        {p?.mirror && <p className="ka-mirror">{p.mirror}</p>}

        {p?.loop && (
          <div className="ka-loopbox">
            <ol className="ka-loop">
              {p.loop.map((step, i) => (
                <li className="ka-loop-step" key={i}>
                  <span className="ka-loop-n">{i + 1}</span>
                  <span className="ka-loop-tx">{step}</span>
                </li>
              ))}
            </ol>
            <span className="ka-loop-back"><ArrowsClockwise size={13} weight="bold" />and it feeds the start again</span>
          </div>
        )}

        {prose.length > 0 && (
          <div className="ka-pat-prose">
            {prose.map((para, i) => <p className="ka-pat-p" key={i}>{para}</p>)}
          </div>
        )}

        {seen.length > 0 && (
          <section className="ka-block ka-pat-seen">
            <h2 className="ka-sec-label">Where Kael has seen this in you</h2>
            <div className="ka-tl">
              {seen.map((r) => {
                const m = MOOD[r.moodId]
                return (
                  <button key={r.id} className="ka-tl-card" style={{ '--mood': m.accent }} onClick={() => onOpenReflection(r.id)}>
                    <span className="ka-tl-date"><m.Icon size={13} weight="duotone" />{r.dayLabel}</span>
                    <h3 className="ka-tl-title">{r.title}</h3>
                    <p className="ka-tl-prev">{r.preview}</p>
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {!p && <p className="ka-empty">Kael is still mapping this one.</p>}
        <div className="ka-foot-sp" />
      </div>
    </div>
  )
}
