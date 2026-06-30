import { CaretRight } from '@phosphor-icons/react'
import { MOOD, MOOD_MAKEUP, PEOPLE, TOPICS, PROFILE, loopsByCount } from '../journal.js'

const peopleMax = Math.max(...PEOPLE.map((p) => p.count))
const topicsMax = Math.max(...TOPICS.map((t) => t.count))
const BAR = 'color-mix(in srgb, var(--ink) 30%, var(--paper))'
const STATS = [
  [PROFILE.reflections, 'Reflections'],
  [PROFILE.streak, 'Day streak'],
  [PROFILE.daysActive, 'Days active'],
]

// donut geometry — each slice an arc of length=pct, rotated to its start
let cum = 0
const SLICES = MOOD_MAKEUP.map((m) => {
  const s = { ...m, start: cum }
  cum += m.pct
  return s
})
const topMood = MOOD[MOOD_MAKEUP[0].id]
const TopIcon = topMood.Icon

const RECUR = loopsByCount.filter((l) => l.count > 0).slice(0, 5)
const recurMax = RECUR[0]?.count || 1
const gist = (m) => { const s = (m || '').split('. ')[0]; return s.endsWith('.') ? s : `${s}.` }

function Rank({ name, count, max, color, onClick }) {
  return (
    <button className="ka-rankrow" onClick={onClick}>
      <span className="ka-rank-name">{name}</span>
      <span className="ka-rank-bar"><span style={{ width: `${(count / max) * 100}%`, background: color }} /></span>
      <span className="ka-rank-n">{count}</span>
      <CaretRight size={13} weight="bold" />
    </button>
  )
}

export default function PatternsScreen({ onOpenTag }) {
  return (
    <div className="ka-screen ka-patterns">
      <header className="ka-patterns-head">
        <h1 className="ka-journey-title">Insight</h1>
        <p className="ka-patterns-sub">The shape of your days, gathering over time.</p>
      </header>
      <div className="ka-scroll ka-insight-scroll">
        <div className="ka-stats">
          {STATS.map(([n, l]) => (
            <div className="ka-stat" key={l}><span className="ka-stat-n">{n}</span><span className="ka-stat-l">{l}</span></div>
          ))}
        </div>

        <section className="ka-card">
          <span className="ka-card-eyebrow">How you’ve felt</span>
          <h2 className="ka-card-title">Your mood, all of it</h2>
          <div className="ka-weather">
            <div className="ka-donut-wrap">
              <svg className="ka-donut" viewBox="0 0 36 36" role="img" aria-label="Mood makeup">
                {SLICES.map((s) => (
                  <circle
                    key={s.id} cx="18" cy="18" r="15.915" fill="none"
                    stroke={MOOD[s.id].accent} strokeWidth="4" pathLength="100"
                    strokeDasharray={`${s.pct} 100`}
                    transform={`rotate(${-90 + s.start * 3.6} 18 18)`}
                  />
                ))}
              </svg>
              <div className="ka-donut-center">
                <TopIcon size={21} weight="duotone" />
                <span className="ka-donut-label">{topMood.label}</span>
                <span className="ka-donut-sub">most of your days</span>
              </div>
            </div>
            <div className="ka-weather-legend">
              {MOOD_MAKEUP.map((m) => (
                <span className="ka-wlegend" key={m.id}>
                  <span className="ka-wdot" style={{ background: MOOD[m.id].accent }} />
                  {MOOD[m.id].label} · <b>{m.pct}%</b>
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="ka-card">
          <h2 className="ka-card-title">Recurring patterns</h2>
          <p className="ka-card-sub">The loops Kael sees most across your reflections.</p>
          <div className="ka-rp">
            {RECUR.map((l) => (
              <button key={l.name} className="ka-rp-row" onClick={() => onOpenTag('patterns', l.name)}>
                <span className="ka-rp-head">
                  <span className="ka-rp-name">{l.name}</span>
                  <span className="ka-rp-count">{l.count}<CaretRight size={12} weight="bold" /></span>
                </span>
                <span className="ka-rp-gist">{gist(l.mirror)}</span>
                <span className="ka-rp-bar"><span style={{ width: `${(l.count / recurMax) * 100}%`, background: BAR }} /></span>
              </button>
            ))}
          </div>
        </section>

        <section className="ka-card">
          <h2 className="ka-card-title">Who fills your days</h2>
          <div className="ka-rank">
            {PEOPLE.map((p, i) => (
              <Rank key={p.name} name={p.name} count={p.count} max={peopleMax} color={BAR} onClick={() => onOpenTag('people', p.name)} />
            ))}
          </div>
        </section>

        <section className="ka-card">
          <h2 className="ka-card-title">What you keep returning to</h2>
          <div className="ka-rank">
            {TOPICS.map((t, i) => (
              <Rank key={t.name} name={t.name} count={t.count} max={topicsMax} color={BAR} onClick={() => onOpenTag('topics', t.name)} />
            ))}
          </div>
        </section>
        <div className="ka-foot-sp" />
      </div>
    </div>
  )
}
