import { useState } from 'react'
import { MagnifyingGlass, X } from '@phosphor-icons/react'
import { REFLECTIONS, MOOD, PROFILE } from '../journal.js'

const uniq = (a) => [...new Set(a)]
const MOODS_PRESENT = uniq(REFLECTIONS.map((r) => r.moodId))
const THEMES = uniq(REFLECTIONS.flatMap((r) => [...(r.tags.topics || []), ...(r.tags.patterns || [])]))
const PEOPLE = uniq(REFLECTIONS.flatMap((r) => r.tags.people || []))
const WHENS = [['all', 'All time'], ['month', 'This month'], ['week', 'This week']]

const allTags = (r) => [...(r.tags.people || []), ...(r.tags.topics || []), ...(r.tags.patterns || [])]
const dayNum = (r) => parseInt(r.date.split(' ').pop(), 10)
const parse = (r) => {
  const [wd, md] = r.date.split(', ')
  const [, day] = md.split(' ')
  return { day, wd: wd.slice(0, 3) }
}

export default function JourneyScreen({ onOpenReflection }) {
  const [find, setFind] = useState(false)
  const [q, setQ] = useState('')
  const [mood, setMood] = useState(null)
  const [tag, setTag] = useState(null)
  const [when, setWhen] = useState('all')

  const list = REFLECTIONS.filter((r) => {
    if (q) {
      const hay = `${r.title} ${r.preview} ${allTags(r).join(' ')}`.toLowerCase()
      if (!hay.includes(q.toLowerCase())) return false
    }
    if (mood && r.moodId !== mood) return false
    if (tag && !allTags(r).includes(tag)) return false
    if (when === 'week' && dayNum(r) < 27) return false
    return true
  })
  const active = q || mood || tag || when !== 'all'

  return (
    <div className="ka-screen ka-diary">
      <header className="ka-diary-head">
        <div className="ka-diary-bar">
          <div>
            <h1 className="ka-journey-title">Your journey with Kael</h1>
            <p className="ka-j-sub">{PROFILE.reflections} reflections, kept together.</p>
          </div>
          <button className="ka-diary-find" data-on={find || undefined} onClick={() => setFind((f) => !f)} aria-label="Search and filter">
            {find ? <X size={18} weight="bold" /> : <MagnifyingGlass size={18} />}
            {active && !find && <span className="ka-diary-finddot" />}
          </button>
        </div>

        {find && (
          <div className="ka-diary-findpanel">
            <div className="ka-j-search">
              <MagnifyingGlass size={16} />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search your reflections" aria-label="Search" />
            </div>
            <div className="ka-j-frow"><span className="ka-j-flabel">Feeling</span>
              <div className="ka-j-fchips">
                {MOODS_PRESENT.map((id) => <button key={id} className="ka-j-fchip" data-on={mood === id || undefined} onClick={() => setMood(mood === id ? null : id)}>{MOOD[id].label}</button>)}
              </div>
            </div>
            <div className="ka-j-frow"><span className="ka-j-flabel">Theme</span>
              <div className="ka-j-fchips">
                {THEMES.map((t) => <button key={t} className="ka-j-fchip" data-on={tag === t || undefined} onClick={() => setTag(tag === t ? null : t)}>{t}</button>)}
              </div>
            </div>
            {PEOPLE.length > 0 && (
              <div className="ka-j-frow"><span className="ka-j-flabel">Person</span>
                <div className="ka-j-fchips">
                  {PEOPLE.map((p) => <button key={p} className="ka-j-fchip" data-on={tag === p || undefined} onClick={() => setTag(tag === p ? null : p)}>{p}</button>)}
                </div>
              </div>
            )}
            <div className="ka-j-frow"><span className="ka-j-flabel">When</span>
              <div className="ka-j-fchips">
                {WHENS.map(([k, l]) => <button key={k} className="ka-j-fchip" data-on={when === k || undefined} onClick={() => setWhen(k)}>{l}</button>)}
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="ka-scroll">
        <div className="ka-dv">
          {list.length > 0 && (
            <div className="ka-dv-chapter"><span className="ka-dv-month">June</span><span className="ka-dv-year">2026</span></div>
          )}
          {list.map((r) => {
            const d = parse(r)
            const m = MOOD[r.moodId]
            return (
              <button key={r.id} className="ka-dv-entry" style={{ '--mood': m.accent }} onClick={() => onOpenReflection(r.id)}>
                <span className="ka-dv-date">
                  <span className="ka-dv-day">{d.day}</span>
                  <span className="ka-dv-wd">{r.isToday ? 'Today' : d.wd}</span>
                </span>
                <span className="ka-dv-body">
                  <span className="ka-dv-title">{r.title}</span>
                  <span className="ka-dv-line">{r.preview}</span>
                  <span className="ka-dv-feel"><m.Icon size={12} weight="fill" />{m.label}</span>
                </span>
              </button>
            )
          })}
          {!list.length && <p className="ka-empty">Nothing matches that yet.</p>}
        </div>
        <div className="ka-foot-sp" />
      </div>
    </div>
  )
}
