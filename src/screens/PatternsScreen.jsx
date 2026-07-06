import { CaretRight } from '@phosphor-icons/react'
import { MOOD, MOOD_MAKEUP, PEOPLE, TOPICS, PROFILE, MOSAIC, loopsByCount } from '../journal.js'

const topicsMax = Math.max(...TOPICS.map((t) => t.count))
const STATS = [
  [PROFILE.reflections, 'Reflections'],
  [PROFILE.streak, 'Day streak'],
  [PROFILE.daysActive, 'Days active'],
]

// donut geometry — each slice an arc of length=pct, rotated to its start; a
// sliver is trimmed off each so thin paper gaps separate the colours.
let cum = 0
const SLICES = MOOD_MAKEUP.map((m) => {
  const s = { ...m, start: cum }
  cum += m.pct
  return s
})
const topMood = MOOD[MOOD_MAKEUP[0].id]
const topPct = MOOD_MAKEUP[0].pct

const RECUR = loopsByCount.filter((l) => l.count > 0).slice(0, 5)
const recurMax = RECUR[0]?.count || 1
const gist = (m) => { const s = (m || '').split('. ')[0]; return s.endsWith('.') ? s : `${s}.` }

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
          <h2 className="ka-card-title">Mood balance</h2>
          <div className="ka-mb">
            <div className="ka-mb-donut">
              <svg className="ka-donut" viewBox="0 0 36 36" role="img" aria-label="Mood balance">
                {SLICES.map((s) => (
                  <circle
                    key={s.id} cx="18" cy="18" r="15.915" fill="none"
                    stroke={MOOD[s.id].accent} strokeWidth="4.4" pathLength="100"
                    strokeDasharray={`${Math.max(s.pct - 1.1, 0.5)} 100`}
                    transform={`rotate(${-90 + s.start * 3.6} 18 18)`}
                  />
                ))}
              </svg>
              <div className="ka-mb-center">
                <span className="ka-mb-pct">{topPct}%</span>
                <span className="ka-mb-label">{topMood.label}</span>
              </div>
            </div>
            <ul className="ka-mb-legend">
              {MOOD_MAKEUP.map((m) => (
                <li key={m.id} className="ka-mb-row">
                  <span className="ka-mb-dot" style={{ background: MOOD[m.id].accent }} />
                  <span className="ka-mb-name">{MOOD[m.id].label}</span>
                  <span className="ka-mb-val">{m.pct}%</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="ka-card">
          <h2 className="ka-card-title">What keeps coming up</h2>
          <p className="ka-card-sub">The loops Kael sees most, coloured by the part of you they live in.</p>
          <div className="ka-rp">
            {RECUR.map((l) => {
              const fam = `var(--fam-${l.family})`
              return (
                <button key={l.name} className="ka-rp-row" onClick={() => onOpenTag('patterns', l.name)}>
                  <span className="ka-rp-head">
                    <span className="ka-rp-name"><span className="ka-rp-fam" style={{ background: fam }} />{l.name}</span>
                    <span className="ka-rp-count">{l.count}<CaretRight size={12} weight="bold" /></span>
                  </span>
                  <span className="ka-rp-gist">{gist(l.mirror)}</span>
                  <span className="ka-rp-bar"><span style={{ width: `${(l.count / recurMax) * 100}%`, background: fam }} /></span>
                </button>
              )
            })}
          </div>
        </section>

        <section className="ka-card">
          <h2 className="ka-card-title">The people in your story</h2>
          <div className="ka-ppl">
            {PEOPLE.map((p) => (
              <button key={p.name} className="ka-ppl-row" onClick={() => onOpenTag('people', p.name)}>
                <span className="ka-ppl-av" style={{ background: p.accent }}>{p.name[0]}</span>
                <span className="ka-ppl-id">
                  <span className="ka-ppl-name">{p.name}<span className="ka-ppl-tick" style={{ background: p.accent }} /></span>
                  <span className="ka-ppl-role">{p.role}</span>
                </span>
                <span className="ka-ppl-meta">
                  <span className="ka-ppl-n">{p.count}</span>
                  <span className="ka-ppl-tone" style={{ color: p.accent }}>{p.tone}</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="ka-card">
          <h2 className="ka-card-title">What you keep returning to</h2>
          <div className="ka-rank">
            {TOPICS.map((t) => (
              <button key={t.name} className="ka-rankrow" onClick={() => onOpenTag('topics', t.name)}>
                <span className="ka-rank-name">{t.name}</span>
                <span className="ka-rank-bar"><span style={{ width: `${(t.count / topicsMax) * 100}%`, background: t.accent }} /></span>
                <span className="ka-rank-n">{t.count}</span>
                <CaretRight size={13} weight="bold" />
              </button>
            ))}
          </div>
        </section>
        <section className="ka-card">
          <h2 className="ka-card-title">The weather you’ve kept</h2>
          <p className="ka-card-sub">Every day you’ve shown up, each square marked with how it mostly felt. The blank ones are days you stepped away, and that’s okay. This is your last twelve weeks, at a glance.</p>
          <div className="ka-wx">
            {MOSAIC.map((mood, i) => {
              const m = mood ? MOOD[mood] : null
              return (
                <span key={i} className="ka-wx-cell" data-on={m ? true : undefined} title={m ? m.label : undefined}>
                  {m ? <m.Icon size={15} weight="duotone" /> : null}
                </span>
              )
            })}
          </div>
        </section>
        <div className="ka-foot-sp" />
      </div>
    </div>
  )
}
