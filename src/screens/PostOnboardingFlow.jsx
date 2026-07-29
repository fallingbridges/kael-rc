import { useState } from 'react'
import {
  ArrowRight, Brain, ChatCircleText, Check, Compass, Crown, Gift, HandHeart,
  Infinity as InfinityIcon, ShieldCheck, Sparkle, Tag, X,
} from '@phosphor-icons/react'
import { Home as ReflectHome } from './ReflectConcept.jsx'

const NAME = 'Maya'
const PRICE = {
  full: '69.99',
  discount: '52.49',
  percent: '25',
}

const SURFACES = [
  {
    id: 'notification',
    label: 'Return notification',
    trigger: 'After the hard paywall is abandoned',
    route: 'Opens Kael in limited free mode',
  },
  {
    id: 'gift',
    label: 'Gift modal',
    trigger: 'First app open after re-entry',
    route: 'Open gift -> Discount paywall',
  },
  {
    id: 'pill',
    label: 'Collapsed gift',
    trigger: 'Gift modal dismissed',
    route: 'Gift pill -> Discount paywall',
  },
  {
    id: 'banner',
    label: 'Home ribbon',
    trigger: 'Always-on home reminder',
    route: 'Claim -> Discount paywall',
  },
  {
    id: 'limit',
    label: 'Limit reached',
    trigger: 'Chat submit blocked at zero credits',
    route: 'Keep talking -> Flow paywall',
  },
  {
    id: 'discount',
    label: 'Discount paywall',
    trigger: 'Passive, low-intent surfaces',
    route: 'Close -> cancellation safety',
  },
  {
    id: 'flow',
    label: 'Flow paywall',
    trigger: 'Active, high-intent limit moment',
    route: 'Close -> cancellation safety',
  },
  {
    id: 'safety',
    label: 'Cancellation safety',
    trigger: 'Primary paywall dismissed',
    route: 'Start free week or leave Premium',
  },
]

const SURFACE_IDS = SURFACES.map((surface) => surface.id)

const FLOW_FEATURES = [
  {
    Icon: InfinityIcon,
    title: 'Keep talking when it opens',
    text: 'No hard stop in the middle of the thought.',
  },
  {
    Icon: Brain,
    title: 'Kael remembers the thread',
    text: 'People, old loops, and what helped last time.',
  },
  {
    Icon: Compass,
    title: 'Patterns get easier to catch',
    text: 'The repeat stops feeling like your whole personality.',
  },
  {
    Icon: HandHeart,
    title: 'A steadier voice at 2am',
    text: 'Warm pushback, not generic reassurance.',
  },
]

const TRIAL_STEPS = [
  ['Today', 'No charge. The full version opens now.'],
  ['Before billing', 'Kael reminds you while you can still cancel.'],
  ['Day 7', 'Keep it, or leave before paying anything.'],
]

function HomeLayer({ children, dim = false }) {
  return (
    <div className="po-home-wrap">
      <div className="po-home-layer">
        <ReflectHome
          name={NAME}
          promptTone="dusk"
          onNew={() => {}}
          onOpen={() => {}}
          onInvite={() => {}}
          onReopen={() => {}}
        />
      </div>
      {dim && <div className="po-scrim" />}
      {children}
    </div>
  )
}

function NotificationReentry({ goTo }) {
  return (
    <div className="po po-lock">
      <div className="po-lock-top">
        <span>9:42</span>
        <span>LTE 81%</span>
      </div>

      <div className="po-lock-mid">
        <span className="po-lock-date">Sunday, 9:42 PM</span>
        <h1>Same Sunday. Softer landing.</h1>
        <p>Come back for one reflection. No trial, no card, no pressure.</p>
      </div>

      <button className="po-notice" onClick={() => goTo('gift')}>
        <span className="po-app-icon"><Sparkle size={18} weight="fill" /></span>
        <span className="po-notice-body">
          <span className="po-notice-top"><b>Kael</b><i>now</i></span>
          <span>You said Sundays get loud. Want to sit with this one for a minute?</span>
        </span>
      </button>

      <div className="po-lock-foot">
        <button className="po-glass-btn" onClick={() => goTo('gift')}>
          Open Kael <ArrowRight size={15} weight="bold" />
        </button>
      </div>
    </div>
  )
}

function GiftModal({ goTo }) {
  return (
    <HomeLayer dim>
      <div className="po-sheet po-gift-sheet">
        <button className="po-x po-sheet-x" aria-label="Close" onClick={() => goTo('pill')}>
          <X size={18} />
        </button>
        <span className="po-seal"><Gift size={26} weight="duotone" /></span>
        <span className="po-kicker">Saved for you</span>
        <h2>A quieter price, if you want the full room.</h2>
        <p>Your private gift is saved inside Kael. It is here when you are ready, not shouting over the reflection.</p>
        <button className="ov-cta" onClick={() => goTo('discount')}>See the gift</button>
        <button className="po-quiet" onClick={() => goTo('pill')}>Keep reflecting</button>
      </div>
    </HomeLayer>
  )
}

function GiftPill({ goTo }) {
  return (
    <HomeLayer>
      <button className="po-floating-gift" onClick={() => goTo('discount')}>
        <span><Gift size={15} weight="duotone" /></span>
        <b>Private gift saved</b>
        <i>Open</i>
      </button>
    </HomeLayer>
  )
}

function HomeBanner({ goTo }) {
  return (
    <HomeLayer>
      <button className="po-banner" onClick={() => goTo('discount')}>
        <span className="po-banner-ic"><Gift size={16} weight="duotone" /></span>
        <span className="po-banner-copy">
          <b>Your private gift is saved.</b>
          <i>A quieter way into the full version.</i>
        </span>
        <span className="po-banner-cta">Claim <ArrowRight size={12} weight="bold" /></span>
      </button>
    </HomeLayer>
  )
}

function ChatLayer() {
  return (
    <div className="po-chat-bg">
      <header className="po-chat-head">
        <span className="po-chat-mark"><Sparkle size={13} weight="fill" /></span>
        <span><b>Kael</b><i>Present</i></span>
      </header>
      <div className="po-chat-thread">
        <p className="po-bubble po-user">There is the thing with my family too.</p>
        <p className="po-bubble po-kael">Two weights in one breath. Which gets heavier when the house goes quiet?</p>
        <p className="po-bubble po-user">The family one. I think I keep pretending it is not that big.</p>
      </div>
      <div className="po-composer">
        <span>I need to keep going with this...</span>
        <button><ChatCircleText size={17} weight="fill" /></button>
      </div>
    </div>
  )
}

function LimitReached({ goTo }) {
  return (
    <div className="po-home-wrap">
      <ChatLayer />
      <div className="po-scrim" />
      <div className="po-sheet po-limit-sheet">
        <span className="po-seal po-seal-ink"><InfinityIcon size={26} weight="bold" /></span>
        <span className="po-kicker">Free reflections used</span>
        <h2>You are right in the middle.</h2>
        <p>Kael can keep this thread open, remember where you were, and stay with the part that finally surfaced.</p>
        <button className="ov-cta" onClick={() => goTo('flow')}>Keep talking</button>
        <button className="po-quiet" onClick={() => goTo('safety')}>Not now</button>
      </div>
    </div>
  )
}

function DiscountPaywall({ goTo }) {
  return (
    <div className="po po-paywall po-discount">
      <button className="po-x" aria-label="Close" onClick={() => goTo('safety')}><X size={20} /></button>
      <div className="po-pay-head">
        <span className="po-seal"><Gift size={26} weight="duotone" /></span>
        <span className="po-kicker">Private gift</span>
        <h1>The full room, for less.</h1>
        <p>A saved offer for coming back instead of closing the door.</p>
      </div>

      <div className="po-price-wrap">
        <span className="po-price-label">{PRICE.percent}% saved</span>
        <div className="po-price">
          <b><span className="po-currency">$</span>{PRICE.discount}<i>/year</i></b>
        </div>
        <span className="po-usual">Usually {PRICE.full}/year</span>
        <span className="po-weekly">Billed yearly. Cancel anytime.</span>
      </div>

      <div className="po-foot">
        <p className="po-trust"><ShieldCheck size={15} weight="fill" />Cancel anytime. Restore available.</p>
        <button className="ov-cta">Claim the gift</button>
        <div className="po-legal"><button>Restore</button><button>Terms</button><button>Privacy</button></div>
      </div>
    </div>
  )
}

function FlowPaywall({ goTo }) {
  return (
    <div className="po po-paywall po-flowwall">
      <button className="po-x" aria-label="Close" onClick={() => goTo('safety')}><X size={20} /></button>
      <div className="po-pay-head">
        <span className="po-seal po-seal-sage"><Crown size={26} weight="duotone" /></span>
        <span className="po-kicker">Keep going</span>
        <h1>Stay with the thread.</h1>
        <p>You were in the part that mattered. The full version keeps Kael there without cutting the room short.</p>
      </div>

      <div className="po-feature-list">
        {FLOW_FEATURES.map((feature) => (
          <div className="po-feature" key={feature.title}>
            <span><feature.Icon size={20} weight="duotone" /></span>
            <p><b>{feature.title}</b><i>{feature.text}</i></p>
          </div>
        ))}
      </div>

      <div className="po-foot">
        <p className="po-free">7 days free</p>
        <p className="po-price-line">Then {PRICE.full}/year after the free week</p>
        <button className="ov-cta">Start my free week</button>
        <div className="po-legal"><button>Restore</button><button>Terms</button><button>Privacy</button></div>
      </div>
    </div>
  )
}

function CancellationSafety() {
  return (
    <div className="po po-paywall po-safety">
      <span className="po-seal po-seal-blue"><Tag size={26} weight="duotone" /></span>
      <span className="po-kicker">Before you go</span>
      <h1>Try the week, then decide.</h1>
      <p className="po-safety-sub">No surprise charge. Kael reminds you before billing while leaving the choice in your hands.</p>

      <div className="po-trial-rail">
        {TRIAL_STEPS.map(([day, text], index) => (
          <div className="po-trial-step" key={day}>
            <span>{index === 2 ? <ShieldCheck size={17} weight="fill" /> : <Check size={17} weight="bold" />}</span>
            <p><b>{day}</b><i>{text}</i></p>
          </div>
        ))}
      </div>

      <div className="po-foot">
        <button className="ov-cta">Start 7 days free</button>
        <button className="po-quiet">Leave Premium</button>
      </div>
    </div>
  )
}

function Surface({ id, goTo }) {
  switch (id) {
    case 'notification': return <NotificationReentry goTo={goTo} />
    case 'gift': return <GiftModal goTo={goTo} />
    case 'pill': return <GiftPill goTo={goTo} />
    case 'banner': return <HomeBanner goTo={goTo} />
    case 'limit': return <LimitReached goTo={goTo} />
    case 'discount': return <DiscountPaywall goTo={goTo} />
    case 'flow': return <FlowPaywall goTo={goTo} />
    case 'safety': return <CancellationSafety />
    default: return null
  }
}

export default function PostOnboardingFlow() {
  const [id, setId] = useState(SURFACES[0].id)
  const i = SURFACE_IDS.indexOf(id)
  const surface = SURFACES[i]
  const go = (next) => setId(SURFACES[Math.max(0, Math.min(SURFACES.length - 1, next))].id)
  const goTo = (nextId) => setId(SURFACE_IDS.includes(nextId) ? nextId : id)

  return (
    <div className="lib-page ov-page ov4-page po-page">
      <div className="ob-devbar">
        <span className="ob-dev-title">Post-Onboarding Flow - {i + 1}/{SURFACES.length} - {surface.id}</span>
        <div className="ob-dev-controls">
          <button className="ob-dev-btn" onClick={() => go(i - 1)} disabled={i === 0}>Prev</button>
          <button className="ob-dev-btn" onClick={() => go(i + 1)} disabled={i === SURFACES.length - 1}>Next</button>
          <select className="ob-dev-jump" value={id} onChange={(event) => goTo(event.target.value)}>
            {SURFACES.map((item, index) => (
              <option key={item.id} value={item.id}>{index + 1}. {item.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="po-brand-strip">
        <span className="po-brand-word">Kael</span>
        <span>Warm paper</span>
        <span>Ink first</span>
        <span>Gold seal</span>
        <span>Newsreader / Charter / DM Sans</span>
      </div>

      <div className="po-route">
        {SURFACES.map((item) => (
          <button key={item.id} data-on={item.id === id || undefined} onClick={() => goTo(item.id)}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="ov-stage">
        <div className="ov-screen rf-phone po-phone" data-theme="light">
          <Surface id={id} goTo={goTo} />
        </div>
      </div>

      <div className="po-caption">
        <b>{surface.label}</b>
        <span>{surface.trigger}</span>
        <ArrowRight size={13} weight="bold" />
        <span>{surface.route}</span>
      </div>
    </div>
  )
}
