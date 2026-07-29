import { useState } from 'react'
import {
  BellSimpleRinging, Gift, Sparkle, Crown, Check, X, ArrowLeft, ArrowRight,
  LockSimpleOpen, BellSimple, Hourglass, Infinity as InfinityIcon, ShieldCheck,
} from '@phosphor-icons/react'
import { Home as ReflectHome } from './ReflectConcept.jsx'

/* ──────────────────────────────────────────────────────────────────────────
   Premium Flow — post-onboarding conversion, rebuilt from scratch, Kael brand.

   Model:
   · onboarding ends on the HARD PAYWALL (A/B against the notification gate,
     which lets people into the app to try a few free reflections)
   · exactly TWO routes to a paywall from inside the app:
        gift (pill / modal)      →  Discount paywall   (Blinkist structure)
        credits run out (limit)  →  Trial paywall      (2-step, Cal AI trial)
   · bailing on the trial        →  Cancellation paywall (trial-anxiety, Cal AI)

   Prices use DM Sans so the dollar sign is single-bar. Warm cream, ink, gold.
   ────────────────────────────────────────────────────────────────────────── */

const NAME = 'Maya'

const SURFACES = [
  { id: 'notif', label: 'Notification gate' },
  { id: 'gift', label: 'Gift · modal ↔ pill' },
  { id: 'limit', label: 'Limit reached' },
  { id: 'discount', label: 'Discount paywall' },
  { id: 'trial1', label: 'Trial · how it works' },
  { id: 'trial2', label: 'Trial · choose plan' },
  { id: 'cancel', label: 'Cancellation' },
]

function HomeBg() {
  return <ReflectHome name={NAME} onNew={() => {}} onOpen={() => {}} onInvite={() => {}} onReopen={() => {}} />
}

function OverHome({ children, dim = true }) {
  return (
    <div className="pf-over">
      <div className="pf-over-bg"><HomeBg /></div>
      {dim && <div className="pf-scrim" />}
      {children}
    </div>
  )
}

/* ── 1 · Notification gate ─────────────────────────────────────────────── */
function NotifGate() {
  return (
    <div className="pf pf-screen pf-notif">
      <div className="pf-head">
        <span className="pf-badge"><BellSimpleRinging size={25} weight="duotone" /></span>
        <span className="pf-kick">No rush</span>
        <h1 className="pf-h1">See what it’s<br />like first.</h1>
        <p className="pf-lede">A few reflections, free. We’ll send one gentle check-in so tonight doesn’t just slip away.</p>
      </div>
      <div className="pf-mid">
        <div className="pf-notifcard">
          <span className="pf-notifcard-ic"><Sparkle size={17} weight="fill" /></span>
          <span className="pf-notifcard-tx"><b>Kael</b><i>It’s Sunday. How’s tonight feeling?</i></span>
          <span className="pf-notifcard-now">now</span>
        </div>
        <span className="pf-mid-note">One check-in. Nothing more.</span>
      </div>
      <div className="pf-foot">
        <button className="pf-cta">Turn on check-ins and start</button>
        <button className="pf-quiet">Maybe later</button>
      </div>
    </div>
  )
}

/* ── 2 · Gift · dismissable modal that collapses to a bottom pill ──────── */
function GiftSurface() {
  const [open, setOpen] = useState(true)
  return (
    <OverHome dim={open}>
      {open ? (
        <div className="pf-sheet" key="sheet">
          <button className="pf-sheet-x" aria-label="Collapse" onClick={() => setOpen(false)}><X size={17} /></button>
          <span className="pf-sheet-glow" aria-hidden="true"><Gift size={140} weight="duotone" /></span>
          <span className="pf-sheet-ic"><Gift size={28} weight="fill" /></span>
          <span className="pf-kick">A gift for you</span>
          <h2 className="pf-sheet-h">Kael Premium,<br />unwrapped.</h2>
          <p className="pf-sheet-s">A private discount, saved to your account. Open it whenever you’re ready.</p>
          <button className="pf-cta">Open your gift</button>
          <span className="pf-sheet-note">No pressure. It will be waiting.</span>
        </div>
      ) : (
        <button className="pf-pill" key="pill" onClick={() => setOpen(true)}><Gift size={16} weight="fill" />Your gift is waiting</button>
      )}
    </OverHome>
  )
}

/* ── 4 · Limit reached ─────────────────────────────────────────────────── */
function LimitModal() {
  return (
    <div className="pf-over">
      <div className="pf-over-bg pf-over-room">
        <div className="pf-room-head"><span className="pf-room-av"><Sparkle size={12} weight="fill" /></span><b>Kael</b></div>
        <div className="pf-room-bub pf-room-u">And there is the thing with my family.</div>
        <div className="pf-room-bub pf-room-k">Two weights in one breath. Which gets heavier when the house goes quiet?</div>
      </div>
      <div className="pf-scrim" />
      <div className="pf-sheet">
        <button className="pf-sheet-x" aria-label="Close"><X size={17} /></button>
        <span className="pf-sheet-ic"><InfinityIcon size={26} weight="bold" /></span>
        <h2 className="pf-sheet-h">You’re mid-thought.</h2>
        <p className="pf-sheet-s">That was your last free reflection. Keep going with Kael, unlimited, whenever it hits.</p>
        <button className="pf-cta">Continue with Premium</button>
        <button className="pf-quiet pf-quiet-tight">Not now</button>
      </div>
    </div>
  )
}

/* ── plan card (shared) ────────────────────────────────────────────────── */
function Plan({ on, onClick, name, sub, price, per, badge, was }) {
  return (
    <button className="pf-plan" data-on={on || undefined} onClick={onClick}>
      {badge && <span className="pf-plan-badge">{badge}</span>}
      <span className="pf-plan-l">
        <b>{name}</b>
        <i>{sub}</i>
      </span>
      <span className="pf-plan-r">
        <span className="pf-plan-price">{was && <s>{was}</s>}{price}<em>{per}</em></span>
        <span className="pf-plan-radio"><span /></span>
      </span>
    </button>
  )
}

/* ── 5 · Discount paywall (Blinkist structure, brand) ──────────────────── */
const DISC_FEATS = ['Unlimited reflections, any hour', 'A memory that keeps your whole story', 'The patterns underneath your weeks, named', 'Grounded in CBT and ACT']
function DiscountPaywall() {
  const [plan, setPlan] = useState('year')
  return (
    <div className="pf pf-screen pf-pay pf-center">
      <button className="pf-x" aria-label="Close"><X size={19} /></button>
      <div className="pf-pay-head">
        <span className="pf-disc-pill"><Sparkle size={13} weight="fill" />Your secret gift</span>
        <h1 className="pf-disc-off"><em>25% off</em>, just for you.</h1>
      </div>
      <div className="pf-plans">
        <Plan on={plan === 'year'} onClick={() => setPlan('year')} name="Yearly" sub="$69.99 → $52.49, billed yearly" price="$1.01" per="/wk" badge="Save 25%" />
        <Plan on={plan === 'month'} onClick={() => setPlan('month')} name="Monthly" sub="Billed monthly" price="$9.99" per="/mo" />
      </div>
      <ul className="pf-checks">
        {DISC_FEATS.map((f) => (<li key={f}><Check size={15} weight="bold" />{f}</li>))}
      </ul>
      <div className="pf-foot">
        <button className="pf-cta">Claim your gift</button>
        <p className="pf-fine"><ShieldCheck size={13} weight="fill" />Cancel anytime in your settings.</p>
        <div className="pf-legal"><button>Restore</button><button>Terms</button><button>Privacy</button></div>
      </div>
    </div>
  )
}

/* ── 6 · Trial step 1 — how the free trial works (Cal AI timeline) ─────── */
const TRAIL = [
  { Icon: LockSimpleOpen, t: 'Today', s: 'Full access. Bring whatever is on your mind.', tone: 'gold' },
  { Icon: BellSimple, t: 'Day 5, a reminder', s: 'We’ll tell you your trial is ending soon.', tone: 'gold' },
  { Icon: Crown, t: 'Day 7, it begins', s: 'You’re charged only if you haven’t cancelled.', tone: 'ink' },
]
function TrialTimeline({ onNext }) {
  return (
    <div className="pf pf-screen pf-pay">
      <div className="pf-pay-top"><button className="pf-back"><ArrowLeft size={19} /></button><button className="pf-restore">Restore</button></div>
      <div className="pf-pay-head pf-pay-head-l">
        <h1 className="pf-h1">Start your 7-day<br />free trial.</h1>
      </div>
      <div className="pf-trail-wrap">
        <div className="pf-trail">
          {TRAIL.map((r, k) => (
            <div key={r.t} className="pf-trail-row" style={{ '--d': `${0.12 * k + 0.15}s` }}>
              <span className={`pf-trail-ic pf-trail-${r.tone}`}><r.Icon size={17} weight="fill" /></span>
              <span className="pf-trail-tx"><b>{r.t}</b><i>{r.s}</i></span>
            </div>
          ))}
        </div>
      </div>
      <div className="pf-foot">
        <p className="pf-nopay"><Check size={16} weight="bold" />No payment due now</p>
        <button className="pf-cta" onClick={onNext}>See your plan</button>
        <div className="pf-legal"><button>Restore</button><button>Terms</button><button>Privacy</button></div>
      </div>
    </div>
  )
}

/* ── 7 · Trial step 2 — choose plan ────────────────────────────────────── */
function TrialPlans() {
  const [plan, setPlan] = useState('year')
  return (
    <div className="pf pf-screen pf-pay">
      <div className="pf-pay-top"><button className="pf-back"><ArrowLeft size={19} /></button></div>
      <div className="pf-pay-head pf-pay-head-l">
        <h1 className="pf-h1">Pick a pace<br />that fits.</h1>
        <p className="pf-lede pf-lede-l">Both start with 7 days free. Cancel anytime before you’re charged.</p>
      </div>
      <div className="pf-plans pf-plans-mid">
        <Plan on={plan === 'year'} onClick={() => setPlan('year')} name="Yearly" sub="7 days free, then $69.99/yr" price="$5.83" per="/mo" badge="7 days free" />
        <Plan on={plan === 'month'} onClick={() => setPlan('month')} name="Monthly" sub="7 days free, then billed monthly" price="$12.99" per="/mo" />
      </div>
      <div className="pf-foot">
        <p className="pf-nopay"><Check size={16} weight="bold" />No payment due now</p>
        <button className="pf-cta">Start my 7-day free trial</button>
        <div className="pf-legal"><button>Restore</button><button>Terms</button><button>Privacy</button></div>
      </div>
    </div>
  )
}

/* ── 8 · Cancellation paywall (trial anxiety, Cal AI reassurance) ──────── */
function Cancellation() {
  return (
    <div className="pf pf-screen pf-pay pf-cancel">
      <button className="pf-x" aria-label="Close"><X size={19} /></button>
      <div className="pf-pay-head">
        <span className="pf-badge pf-badge-sm"><ShieldCheck size={24} weight="duotone" /></span>
        <h1 className="pf-h1">You won’t be<br />charged today.</h1>
        <p className="pf-lede">The trial is genuinely free. Here is exactly how it goes.</p>
      </div>
      <div className="pf-trail-wrap">
        <div className="pf-trail">
          {TRAIL.map((r, k) => (
            <div key={r.t} className="pf-trail-row" style={{ '--d': `${0.1 * k + 0.15}s` }}>
              <span className={`pf-trail-ic pf-trail-${r.tone}`}><r.Icon size={17} weight="fill" /></span>
              <span className="pf-trail-tx"><b>{r.t}</b><i>{r.s}</i></span>
            </div>
          ))}
        </div>
      </div>
      <div className="pf-foot">
        <button className="pf-cta">Start my free trial</button>
        <button className="pf-quiet">No thanks</button>
      </div>
    </div>
  )
}

export default function PremiumFlow() {
  const [i, setI] = useState(0)
  const s = SURFACES[i]
  const go = (n) => setI(Math.max(0, Math.min(SURFACES.length - 1, n)))
  return (
    <div className="lib-page ov-page ov4-page">
      <div className="ob-devbar">
        <span className="ob-dev-title">Premium Flow · {i + 1}/{SURFACES.length} · {s.id}</span>
        <div className="ob-dev-controls">
          <button className="ob-dev-btn" onClick={() => go(i - 1)} disabled={i === 0}>Prev</button>
          <button className="ob-dev-btn" onClick={() => go(i + 1)} disabled={i === SURFACES.length - 1}>Next</button>
          <select className="ob-dev-jump" value={i} onChange={(e) => go(Number(e.target.value))}>
            {SURFACES.map((sc, idx) => (<option key={sc.id} value={idx}>{idx + 1}. {sc.label}</option>))}
          </select>
        </div>
      </div>
      <div className="ov-stage">
        <div className="ov-screen rf-phone pf-phone" data-theme="light">
          {s.id === 'notif' && <NotifGate />}
          {s.id === 'gift' && <GiftSurface />}
          {s.id === 'limit' && <LimitModal />}
          {s.id === 'discount' && <DiscountPaywall />}
          {s.id === 'trial1' && <TrialTimeline onNext={() => go(i + 1)} />}
          {s.id === 'trial2' && <TrialPlans />}
          {s.id === 'cancel' && <Cancellation />}
        </div>
      </div>
      <p className="pf-cap">{s.label}</p>
    </div>
  )
}
