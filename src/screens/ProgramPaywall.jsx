import { useState } from 'react'
import {
  X, Sparkle, ChatCircleDots, ArrowsClockwise, Star, Leaf, Sun, ChartLineUp, ShieldCheck,
} from '@phosphor-icons/react'

/* ──────────────────────────────────────────────────────────────────────────
   The program close — Clear30-style variant: journey and offer fused into one
   scrollable syllabus. The bet under test: proof-density beats the ceremony-
   minimal close. Every day card is something Kael actually does; no invented
   stats, no clinical claims, no rainbow. Offer block matches the V7 paywall.
   The X opens the catcher: a bottom sheet with a pace for everyone.
   ────────────────────────────────────────────────────────────────────────── */

const DAYS = [
  { d: 'Day 1', t: 'Bring what’s on your mind', s: 'Start anywhere. Kael starts learning how your mind runs.', Icon: ChatCircleDots },
  { d: 'Day 2', t: 'Your rhythm takes shape', s: 'A few honest minutes a day, at the pace you picked.', Icon: Sun },
  { d: 'Day 3', t: 'Your loops get caught early', s: 'Kael starts spotting them before you finish naming them.', Icon: ArrowsClockwise },
  { d: 'Day 7', t: 'Your first shift, named', s: 'One spiral caught, one kinder word to yourself.', Icon: Star },
  { marker: true, t: 'End of week 1', s: 'Your read updates with what’s already shifted.' },
  { d: 'Day 14', t: 'The connections surface', s: 'Kael starts linking what Tuesday has to do with Sunday.', Icon: ChartLineUp },
  { d: 'Day 30', t: 'The pattern loosens its grip', s: 'The old reflex shows up. You catch it, and choose.', Icon: Leaf },
]

/* one laurel branch (Tuah Firmansyah, Noun Project), attribution stripped;
   rendered twice, the right side mirrored */
function Laurel({ flip = false }) {
  return (
    <svg className="pp3-laurel" viewBox="19.5 23.5 28 53" fill="currentColor" aria-hidden="true" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <path d="m31.23 26.469c0.10938-0.76953-0.089844-1.4688-0.51953-1.9492-0.62891 0.55078-1.1016 1.2891-1.1719 2.0898-0.089843 0.78125 0.19922 1.4414 0.69141 1.8711 0.53906-0.53906 0.89062-1.2617 1.0117-2.0117z" />
      <path d="m27.73 31.59c0.46875-0.64062 0.73047-1.4414 0.73047-2.25-0.019532-0.82031-0.30859-1.5117-0.83984-1.9492-0.57812 0.66016-0.96094 1.5195-0.91016 2.3594 0.039062 0.83984 0.42969 1.4688 1.0117 1.8398z" />
      <path d="m30.191 31.809c0.76953-0.12891 1.3906-0.53125 1.8711-1.0586-0.5-0.46875-1.1992-0.73828-1.9805-0.62109-0.37891 0.058594-0.75 0.21094-1.0781 0.42188-0.32812 0.21094-0.60156 0.51172-0.82812 0.82812 0.55078 0.41016 1.2891 0.57031 2.0312 0.42969z" />
      <path d="m25.66 35.23c0.37891-0.75 0.51953-1.6211 0.39062-2.4688-0.14844-0.85156-0.57031-1.5195-1.1914-1.8906-0.51172 0.78906-0.75 1.7383-0.55859 2.6211 0.17188 0.85937 0.69922 1.4609 1.3594 1.7383z" />
      <path d="m27.859 33.328c-0.39062 0.12891-0.73828 0.33984-1.0586 0.60938-0.30859 0.28125-0.53906 0.62891-0.73047 1 0.64063 0.32812 1.4297 0.37109 2.1797 0.10938 0.76953-0.26172 1.3516-0.76953 1.7617-1.3984-0.58984-0.39844-1.3594-0.57031-2.1484-0.32813z" />
      <path d="m24.148 39.379c0.25-0.85156 0.23828-1.7812-0.039063-2.6289-0.30078-0.85938-0.85938-1.4883-1.5586-1.7617-0.39062 0.91016-0.46875 1.9492-0.12891 2.8281 0.32031 0.87109 1 1.3906 1.7305 1.5703z" />
      <path d="m25.102 37.84c-0.26172 0.35156-0.44922 0.75-0.57812 1.1719 0.71875 0.23047 1.5586 0.12891 2.2812-0.26953 0.35937-0.21094 0.69922-0.46094 0.94922-0.75 0.25-0.30078 0.46875-0.62891 0.62109-0.98828-0.67969-0.32031-1.5117-0.35938-2.2891 0.03125-0.37891 0.19922-0.71875 0.48047-0.98828 0.82031z" />
      <path d="m21.25 42.66c0.5 0.83984 1.3008 1.2617 2.0898 1.3008 0.039062-0.46094 0.019531-0.94141-0.058594-1.3984-0.078125-0.46094-0.26172-0.91016-0.48047-1.3281-0.46094-0.82812-1.1602-1.3906-1.9414-1.5508-0.10938 0.51172-0.14062 1.0391-0.089844 1.5508 0.070313 0.51172 0.23047 1 0.48047 1.4219z" />
      <path d="m23.672 43.512c0.78906 0.10156 1.6211-0.16016 2.3086-0.71094 0.33984-0.28125 0.62109-0.60156 0.83984-0.94922 0.21875-0.35156 0.35938-0.73828 0.46094-1.1289-0.76953-0.21094-1.6406-0.10938-2.3594 0.44141-0.73828 0.53906-1.1797 1.4297-1.2617 2.3516z" />
      <path d="m23.379 48.859c-0.050781-0.98047-0.39844-1.9414-1.0781-2.7188-0.62109-0.78125-1.4492-1.2188-2.2891-1.2305-0.078125 1.1094 0.30859 2.2305 0.98828 3 0.67969 0.78125 1.5391 1.0586 2.3789 0.94141z" />
      <path d="m25.922 47.141c0.30859-0.35156 0.51172-0.73828 0.66016-1.1406 0.17188-0.39844 0.25-0.82812 0.26172-1.25-0.85156-0.070312-1.6992 0.19922-2.3594 0.89844-0.33984 0.35156-0.55859 0.76953-0.69141 1.2305-0.12891 0.46094-0.17969 0.94922-0.14844 1.4414 0.83984-0.050781 1.6602-0.48047 2.2695-1.1797z" />
      <path d="m22.75 51.32c-0.78906-0.67969-1.7305-0.98047-2.6016-0.82812 0.089843 0.57812 0.23047 1.1602 0.51172 1.6602 0.28906 0.5 0.66016 0.94141 1.1016 1.2695 0.87109 0.66016 1.8086 0.76953 2.6602 0.48047-0.23828-1.0117-0.83984-1.9219-1.6602-2.5898z" />
      <path d="m27.18 48.98c-0.87891 0.089843-1.7109 0.53906-2.2617 1.3984-0.58984 0.85938-0.60156 1.9414-0.33984 2.9219 0.85156-0.23047 1.6211-0.83984 2.1016-1.6797 0.44141-0.83984 0.66016-1.7695 0.51172-2.6406z" />
      <path d="m23.719 58.969c1.0117 0.51172 2.0703 0.39062 2.8594-0.089844-0.30078-0.46094-0.55859-0.94141-0.94922-1.3203-0.37891-0.39062-0.83984-0.71875-1.3398-0.98047-0.94922-0.53906-1.9883-0.64844-2.8594-0.30859 0.21875 0.57812 0.46875 1.1602 0.89062 1.6094 0.41016 0.46094 0.87891 0.82812 1.3984 1.0898z" />
      <path d="m26.59 58.23c0.82812-0.42188 1.4883-1.2188 1.8086-2.1914 0.17187-0.48828 0.19922-0.96094 0.19922-1.4414 0.011719-0.48047-0.070312-0.94141-0.23828-1.3711-0.89062 0.28125-1.6484 0.91016-2.0391 1.9102-0.10156 0.25-0.17187 0.51172-0.21094 0.76953-0.019531 0.26172-0.019531 0.51953 0.011719 0.78125 0.058594 0.53125 0.21875 1.0508 0.46875 1.5312z" />
      <path d="m25.309 63.449c0.51172 0.39062 1.0781 0.67969 1.6602 0.82812 1.1992 0.26172 2.2383-0.089844 2.9492-0.76953-0.78906-0.82812-1.7109-1.5508-2.8789-1.8516-0.58984-0.14062-1.1211-0.21094-1.6289-0.16016-0.51172 0.050781-0.98047 0.21094-1.3906 0.48828 0.17188 0.28125 0.35156 0.55859 0.57031 0.80859 0.23047 0.23828 0.46875 0.46094 0.73047 0.64844z" />
      <path d="m28.949 61.379c0.17969 0.53125 0.42969 1.0586 0.82812 1.4609 0.76953-0.62891 1.1992-1.5508 1.3516-2.6406 0.058594-0.53906 0.03125-1.0508-0.10156-1.5312-0.12891-0.46875-0.28125-0.94922-0.53906-1.3516-0.85156 0.48828-1.5117 1.3008-1.6992 2.4297-0.078124 0.55078 0 1.0898 0.17188 1.6289z" />
      <path d="m30.609 68.859c0.32812 0.070313 0.66016 0.10156 0.98047 0.10156 1.3008 0 2.2617-0.58984 2.8203-1.4609-0.48047-0.37109-1.0117-0.66016-1.6016-0.85156-0.30078-0.089844-0.58984-0.17969-0.87891-0.25-0.28906-0.070313-0.60156-0.10938-0.91016-0.12891-1.2383-0.058593-2.3516 0.32031-3.0586 1.0703 0.51172 0.48047 1.0898 0.89062 1.6992 1.1797 0.30859 0.14062 0.60938 0.26953 0.94141 0.33984z" />
      <path d="m32.91 65.551c0.30078 0.51172 0.73828 0.92188 1.2188 1.2812 0.62891-0.82031 0.89062-1.9219 0.73828-3.0117-0.078126-0.55078-0.19922-1.1016-0.44141-1.5586-0.23047-0.46875-0.55078-0.85156-0.87891-1.2305-0.75 0.69141-1.2891 1.7188-1.1719 2.8594 0.050781 0.57812 0.23828 1.1406 0.53125 1.6602z" />
      <path d="m33.379 71.852c0.30859 0.19922 0.64062 0.37109 0.98047 0.51953 0.17188 0.070312 0.33984 0.14062 0.51172 0.19922 0.17969 0.050782 0.35938 0.089844 0.53906 0.12109 0.71875 0.12891 1.4297 0.12891 2.0898-0.019531 0.64844-0.12891 1.2109-0.46875 1.6289-0.85156 0.42188-0.39062 0.71875-0.85937 0.89844-1.3711-0.30078-0.10938-0.60156-0.19922-0.92188-0.26953-0.30859-0.078126-0.60938-0.16016-0.92969-0.19922-0.62891-0.078125-1.2891-0.050781-1.9414 0.089843-1.2617 0.19922-2.3008 0.85156-2.8516 1.7891z" />
      <path d="m37.41 68.121c0.17188 0.25 0.35938 0.48828 0.57812 0.69922 0.44141 0.42188 0.96094 0.82813 1.5508 1.0312 0.21875-0.5 0.32031-1.0391 0.30859-1.5898 0-0.57031-0.089844-1.1484-0.30078-1.6992-0.19922-0.57031-0.5-1.0195-0.83984-1.4414-0.32812-0.44141-0.73047-0.78906-1.1797-1.0508-0.60938 0.89844-0.87109 2.0117-0.5 3.2109 0.089844 0.28906 0.21094 0.58984 0.37109 0.85156z" />
      <path d="m44.52 74.898c1.2695-0.67969 1.8906-1.7617 1.9805-2.8984-1.3203-0.23047-2.7109 0.039062-3.9492 0.55859-1.25 0.57812-2.1484 1.5312-2.4688 2.6211 1.5195 0.42969 3.1602 0.46094 4.4414-0.28125z" />
      <path d="m44 70.898c0.55859 0.32031 1.2109 0.51172 1.8594 0.60156 0.17188-1.1289-0.14844-2.3516-0.85938-3.3281-0.17969-0.23828-0.37109-0.46875-0.57031-0.69922-0.19922-0.21875-0.42188-0.41016-0.64063-0.57812-0.44922-0.32812-0.96094-0.53906-1.4609-0.75-0.19922 0.53906-0.28906 1.1094-0.25 1.6992 0.03125 0.60156 0.21094 1.1797 0.55859 1.7109 0.33984 0.53906 0.82031 0.98828 1.3711 1.3594z" />
    </svg>
  )
}

/* every price is real; per-week equivalents derived round-half-up */
const PLANS = [
  { id: 'yearly', name: 'Yearly', sub: 'billed $69.99 per year', wk: '$1.35', badge: '7 days free' },
  { id: 'monthly', name: 'Monthly', sub: 'billed $12.99 per month', wk: '$3.00' },
  { id: 'weekly', name: 'Weekly', sub: 'billed every week', wk: '$4.99' },
]
const PLAN_TERMS = {
  yearly: '7 days free, then $69.99/year',
  monthly: '$12.99/month, billed today',
  weekly: '$4.99/week, billed today',
}

export default function ProgramPaywall({ noanim = false }) {
  const [sheet, setSheet] = useState(false)
  const [plan, setPlan] = useState('yearly')
  return (
    <div className={`lib-page ov-page ov4-page ov7-page pp3-page${noanim ? ' ov-noanim' : ''}`}>
      <div className="ov-stage">
        <div className="ov-screen ov4-screen" data-theme="light">
          <header className="ov-head">
            <div className="ov-head-row">
              <button className="ov-back ov-x" onClick={() => setSheet(true)} aria-label="Close"><X size={20} /></button>
            </div>
          </header>
          <div className="ov-body">
            <div className="ov-flow ov4-flow pp3">
              <span className="pp3-mark"><Sparkle size={18} weight="fill" /></span>
              <span className="pp3-badge">Your coach is ready</span>
              <h1 className="pp3-title">Start feeling like <em>yourself</em> again, in less than 4 weeks.</h1>
              <div className="pp3-creds" aria-hidden="true">
                <span className="pp3-laur"><Laurel /><b>Built on<br />CBT + ACT</b><Laurel flip /></span>
                <span className="pp3-cred-pill">Tuned to your pattern</span>
              </div>
              <ol className="pp3-days">
                {DAYS.map((c, k) => c.marker ? (
                  <li key={c.t} className="pp3-week" style={{ '--d': `${0.06 * k + 0.2}s` }}>
                    <b>{c.t}</b> · {c.s}
                  </li>
                ) : (
                  <li key={c.t} className="pp3-day" style={{ '--d': `${0.06 * k + 0.2}s` }}>
                    <span className="pp3-day-ic"><c.Icon size={17} weight="duotone" /></span>
                    <div className="pp3-day-tx">
                      <span className="pp3-day-d">{c.d}</span>
                      <b>{c.t}</b>
                      <s>{c.s}</s>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          <footer className="ov-foot pp3-foot">
            <p className="pp3-trust"><ShieldCheck size={15} weight="fill" />No commitment. Cancel anytime</p>
            <button className="ov-cta">Start my 7-day free trial</button>
            <p className="pp3-price"><b>7 days free</b>, then $69.99/year ($5.83/month)</p>
            <div className="pp2-legal"><button>Restore</button><button>Terms</button><button>Privacy</button></div>
          </footer>

          {sheet && (
            <div className="pp3-scrim" onClick={() => setSheet(false)}>
              <div className="pp3-sheet" onClick={(e) => e.stopPropagation()}>
                <h2 className="pp3-sheet-t">Not ready for a year?<br /><b>There’s a pace for everyone.</b></h2>
                <div className="pp3-plans">
                  {PLANS.map((p) => (
                    <button key={p.id} className="pp3-plan" data-on={plan === p.id || undefined} onClick={() => setPlan(p.id)}>
                      <span className="pp3-plan-l">
                        <b>{p.name}{p.badge && <i className="pp3-plan-badge">{p.badge}</i>}</b>
                        <span>{p.sub}</span>
                      </span>
                      <span className="pp3-plan-r"><b>{p.wk}</b><span>per week</span></span>
                    </button>
                  ))}
                </div>
                <p className="pp3-trust"><ShieldCheck size={15} weight="fill" />No commitment. Cancel anytime</p>
                <button className="ov-cta">Continue</button>
                <p className="pp3-cancel">{PLAN_TERMS[plan]}</p>
                <button className="pp3-notnow" onClick={() => setSheet(false)}>Not now</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
