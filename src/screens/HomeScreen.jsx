import { Flame, CaretRight, ChatCircleDots } from '@phosphor-icons/react'
import { Sparkle as KaelMark } from '../components/Icons.jsx'
import { HOME_MOODS, REFLECTIONS, MOOD, PROFILE } from '../journal.js'

const recent = REFLECTIONS.filter((r) => !r.isToday).slice(0, 3)

// the last 7 days, each painted with that day's feeling; a blank day is just
// unpainted, no shame. `ref` links a day to the reflection it holds.
const WEEK = [
  { wd: 'W', d: 24 },
  { wd: 'T', d: 25, mood: 'low' },
  { wd: 'F', d: 26 },
  { wd: 'S', d: 27, mood: 'anxious', ref: 'manager' },
  { wd: 'S', d: 28, mood: 'calm' },
  { wd: 'M', d: 29, mood: 'overwhelmed', ref: 'sunday' },
  { wd: 'T', d: 30, mood: 'tired', today: true, ref: 'today' },
]

export default function HomeScreen({ kaelMessage, onTalk, onMood, onOpenReflection, onSeeAll }) {
  return (
    <div className="ka-screen ka-today">
      <div className="ka-scroll">
        <header className="ka-hero">
          <div className="ka-hero-top">
            <div>
              <span className="ka-eyebrow">Tuesday, June 30</span>
              <h1 className="ka-greeting">Good morning, {PROFILE.name}</h1>
            </div>
            <div className="ka-streak-pill" aria-label={`${PROFILE.streak}-day streak`}>
              <Flame size={16} weight="fill" />{PROFILE.streak}
            </div>
          </div>
        </header>

        <div className="ka-week-wrap">
          <div className="ka-week">
            {WEEK.map((day, i) => {
              const m = day.mood ? MOOD[day.mood] : null
              return (
                <button
                  key={i}
                  className="ka-week-day"
                  disabled={!m}
                  style={m ? { '--dm': m.accent } : undefined}
                  onClick={m ? () => (day.ref ? onOpenReflection(day.ref) : onSeeAll()) : undefined}
                >
                  <span className="ka-week-wd">{day.wd}</span>
                  <span className="ka-week-disc" data-on={!!m || undefined} data-today={day.today || undefined}>
                    {m ? <m.Icon size={16} weight="duotone" /> : day.d}
                  </span>
                </button>
              )
            })}
          </div>
          <p className="ka-week-cap">This week, painted by how it felt.</p>
        </div>

        <section className="ka-prompt">
          <span className="ka-prompt-id">
            <span className="ka-prompt-mark"><KaelMark size={16} sw={1.5} /></span>
            Kael
          </span>
          <p className="ka-prompt-text">{kaelMessage}</p>
          <button className="ka-cta" onClick={onTalk}><ChatCircleDots size={16} weight="fill" />Continue</button>
        </section>

        <section className="ka-block">
          <h2 className="ka-sec-label">Bring a feeling to Kael</h2>
          <div className="ka-moods">
            {HOME_MOODS.map((m) => (
              <button key={m.id} className="ka-mood" style={{ '--mood': m.accent }} onClick={() => onMood(m.id)}>
                <span className="ka-mood-ic"><m.Icon size={20} weight="duotone" /></span>
                <span className="ka-mood-label">{m.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="ka-block">
          <div className="ka-sec-head">
            <h2 className="ka-sec-label">Lately on your journey</h2>
            <button className="ka-seeall" onClick={onSeeAll}>See all<CaretRight size={12} weight="bold" /></button>
          </div>

          <div className="ka-jent-list">
            {recent.map((r) => {
              const m = MOOD[r.moodId]
              return (
                <button key={r.id} className="ka-jent" style={{ '--mood': m.accent }} onClick={() => onOpenReflection(r.id)}>
                  <span className="ka-jent-ic"><m.Icon size={19} weight="duotone" /></span>
                  <span className="ka-jent-body">
                    <span className="ka-jent-title">{r.title}</span>
                    <span className="ka-jent-meta">{r.dayLabel} · {m.label}</span>
                    <span className="ka-jent-prev">{r.preview}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </section>
        <div className="ka-foot-sp" />
      </div>
    </div>
  )
}
