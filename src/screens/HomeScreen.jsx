import { Sparkle, Flame, ArrowRight, CaretRight } from '@phosphor-icons/react'
import { HOME_MOODS, REFLECTIONS, MOOD, PROFILE } from '../journal.js'

const recent = REFLECTIONS.filter((r) => !r.isToday).slice(0, 3)

export default function HomeScreen({ onTalk, onMood, onOpenReflection, onSeeAll }) {
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

        <section className="ka-prompt">
          <span className="ka-prompt-eyebrow"><Sparkle size={13} weight="fill" />From Kael</span>
          <p className="ka-prompt-text">Last night the week felt like a wall. How does it look in the daylight?</p>
          <button className="ka-cta" onClick={onTalk}>Talk to Kael<ArrowRight size={17} weight="bold" /></button>
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

          <div className="ka-hcard-list">
            {recent.map((r) => {
              const m = MOOD[r.moodId]
              return (
                <button key={r.id} className="ka-hcard" onClick={() => onOpenReflection(r.id)}>
                  <span className="ka-hcard-eyebrow"><span className="ka-hcard-dot" style={{ background: m.accent }} />{r.dayLabel} · {m.label}</span>
                  <span className="ka-hcard-title">{r.title}</span>
                  <span className="ka-hcard-prev">{r.preview}</span>
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
