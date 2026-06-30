import { useState } from 'react'
import { REFLECTIONS, MOOD } from '../journal.js'

const FILTERS = ['All', 'Work', 'Rest & body', 'Family', 'My manager', 'Mom']

const matches = (r, f) => {
  if (f === 'All') return true
  const all = [...(r.tags.people || []), ...(r.tags.topics || []), ...(r.tags.patterns || [])]
  return all.includes(f)
}

const parse = (r) => {
  const [wd, md] = r.date.split(', ')
  const [month, day] = md.split(' ')
  return { wd: wd.slice(0, 3).toUpperCase(), day, monthKey: `${month} 2026`.toUpperCase() }
}

const tagsFor = (r) => {
  const t = [{ label: MOOD[r.moodId].label, c: MOOD[r.moodId].accent, mood: true }]
  ;(r.tags.patterns || []).slice(0, 1).forEach((n) => t.push({ label: n, c: 'var(--ink-3)' }))
  return t
}

export default function JourneyScreen({ onOpenReflection }) {
  const [filter, setFilter] = useState('All')
  const list = REFLECTIONS.filter((r) => matches(r, filter))

  const groups = []
  list.forEach((r) => {
    const { monthKey } = parse(r)
    let g = groups.find((x) => x.key === monthKey)
    if (!g) { g = { key: monthKey, items: [] }; groups.push(g) }
    g.items.push(r)
  })

  return (
    <div className="ka-screen ka-journey">
      <header className="ka-journey-head">
        <h1 className="ka-journey-title">Your journey with Kael</h1>
        <div className="ka-filters">
          {FILTERS.map((f) => (
            <button key={f} className="ka-filter" data-on={filter === f || undefined} onClick={() => setFilter(f)}>{f}</button>
          ))}
        </div>
      </header>
      <div className="ka-scroll">
        {groups.map((g) => (
          <div className="ka-jmonth" key={g.key}>
            <h2 className="ka-jmonth-label">{g.key}</h2>
            <div className="ka-jtl">
              {g.items.map((r) => {
                const d = parse(r)
                const m = MOOD[r.moodId]
                return (
                  <button key={r.id} className="ka-jrow" style={{ '--mood': m.accent }} onClick={() => onOpenReflection(r.id)}>
                    <span className="ka-jdate">
                      <span className="ka-jday">{d.day}</span>
                      <span className="ka-jwd">{d.wd}</span>
                    </span>
                    <span className="ka-jcard">
                      <span className="ka-jtitle">{r.title}</span>
                      <span className="ka-jprev">{r.preview}</span>
                      <span className="ka-jtags">
                        {tagsFor(r).map((tg, i) => (
                          <span key={i} className="ka-jtag" style={{ '--c': tg.c }}>{tg.label}</span>
                        ))}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
        {!list.length && <p className="ka-empty">Nothing tagged “{filter}” yet.</p>}
        <div className="ka-foot-sp" />
      </div>
    </div>
  )
}
