import { ArrowLeft, BookmarkSimple, Export, Leaf, Sparkle } from '@phosphor-icons/react'
import { MOOD, getPattern } from '../journal.js'

const TAGCATS = [
  { cat: 'mood', label: 'Mood' },
  { cat: 'patterns', label: 'Patterns noticed' },
  { cat: 'topics', label: 'Topics' },
  { cat: 'people', label: 'People' },
]

const META = {
  today: 'Written this morning, while you were resting',
  sunday: 'Written last night, after the wall came down',
  manager: 'Written Saturday, once the reply finally came',
  mom: 'Written Wednesday night, after you hung up',
  walk: 'Written Friday night, when you got back in',
  first: 'Your very first reflection',
}

export default function ReflectionView({ r, onBack, onOpenTag, onTalk }) {
  if (!r) return null
  const mood = MOOD[r.moodId]
  const primary = r.tags?.patterns?.[0]
  const task = primary ? getPattern(primary)?.anatomy?.practice : null
  const words = r.body.reduce((n, b) => n + b.x.split(/\s+/).length, 0)
  const readMin = Math.max(1, Math.round(words / 160))

  return (
    <div className="ka-screen ka-refl" style={{ '--mood': mood.accent }}>
      <header className="ka-refl-bar">
        <button className="ka-round-btn" onClick={onBack} aria-label="Back"><ArrowLeft size={18} /></button>
        <div className="ka-refl-bar-r">
          <button className="ka-round-btn" aria-label="Save"><BookmarkSimple size={16} /></button>
          <button className="ka-round-btn" aria-label="Share"><Export size={16} /></button>
        </div>
      </header>

      <div className="ka-refl-scroll">
        <span className="ka-refl-date">{r.date}</span>
        <h1 className="ka-refl-title">{r.title}</h1>
        <p className="ka-refl-meta">{META[r.id] || 'Written by Kael'} · {readMin} min</p>

        <div className="ka-refl-prose">
          {r.body.map((b, i) => (b.t === 'quote'
            ? <blockquote className="ka-refl-quote" key={i}>{b.x}</blockquote>
            : <p className="ka-refl-p" key={i} data-first={i === 0 || undefined}>{b.x}</p>))}
        </div>

        {task && (
          <div className="ka-field">
            <span className="ka-field-head"><span className="ka-field-ic"><Leaf size={12} weight="fill" /></span>A small field task</span>
            <p className="ka-field-body">{task}</p>
          </div>
        )}

        <div className="ka-sign">— Kael</div>
        <div className="ka-refl-rule" />

        <div className="ka-tags">
          {TAGCATS.map(({ cat, label }) => {
            const names = r.tags?.[cat] || []
            if (!names.length) return null
            return (
              <div className="ka-tagrow" key={cat}>
                <span className="ka-tagrow-label">{label}</span>
                <div className="ka-tagrow-chips">
                  {names.map((n) => (
                    <button key={n} className="ka-chip" onClick={() => onOpenTag(cat, n)}>{cat === 'mood' ? MOOD[n].label : n}</button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        <div className="ka-refl-pinsp" />
      </div>

      <button className="ka-refl-pin" onClick={onTalk}>
        <span className="ka-pin-orb"><Sparkle size={12} weight="fill" /></span>Talk to Kael about this
      </button>
    </div>
  )
}
