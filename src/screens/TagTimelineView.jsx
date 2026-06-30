import { ArrowLeft } from '@phosphor-icons/react'
import { reflectionsWithTag, tagCount, tagLabel, MOOD } from '../journal.js'

const CATLABEL = { people: 'Person', topics: 'Topic', patterns: 'Pattern', mood: 'Mood' }

export default function TagTimelineView({ cat, name, onBack, onOpenReflection }) {
  const items = reflectionsWithTag(cat, name)
  const count = tagCount(cat, name)
  const label = tagLabel(cat, name)
  return (
    <div className="ka-screen ka-tag">
      <header className="ka-refl-top">
        <button className="ka-icon-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
      </header>
      <div className="ka-scroll">
        <div className="ka-tag-head">
          <span className="ka-eyebrow">{CATLABEL[cat] || 'Tag'}</span>
          <h1 className="ka-tag-name">{label}</h1>
          <span className="ka-tag-count">Appears in {count} reflection{count === 1 ? '' : 's'}</span>
        </div>
        <div className="ka-tl">
          {items.map((r) => (
            <button key={r.id} className="ka-tl-card" onClick={() => onOpenReflection(r.id)}>
              <span className="ka-recent-date">{r.dayLabel}</span>
              <h3 className="ka-tl-title">{r.title}</h3>
              <p className="ka-tl-prev">{r.preview}</p>
            </button>
          ))}
        </div>
        <div className="ka-foot-sp" />
      </div>
    </div>
  )
}
