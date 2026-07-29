import { useEffect, useRef, useState } from 'react'
import { Sparkle, ArrowRight, Compass, User, EnvelopeSimple, Quotes } from '@phosphor-icons/react'
import { Home as ReflectHome } from './ReflectConcept.jsx'
import markUrl from './kael-mark.svg'

/* ──────────────────────────────────────────────────────────────────────────
   Kael landing page — "The Reflection That Scrolls", selling the AI mental
   wellness coach.

   The page behaves like the product: Kael opens by asking the visitor a
   question, the page runs as a magazine-scale reflection transcript (Kael
   left in cream serif bubbles that type on, the visitor right in ink bubbles),
   it gathers a few fragments, then reflects a pattern back at the reader.
   Woven through it are the seven things that sell the coach: it is your
   personal coach, it remembers your story, you can talk vent or reflect
   anytime, it is grounded in CBT and ACT, real voices, your whole story in
   one place, and it helps you know and break the patterns keeping you stuck.
   Quiz funnel. Paddle-compliant. No em dashes.

   NOTE: the testimonials below are placeholders written in the right voice.
   Replace them with real, permissioned quotes before launch.
   ────────────────────────────────────────────────────────────────────────── */

function useInView() {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return undefined
    const check = () => {
      const r = el.getBoundingClientRect()
      return r.top < window.innerHeight * 0.9 && r.bottom > 0
    }
    if (check()) { setSeen(true); return undefined }
    const onScroll = () => { if (check()) { setSeen(true); window.removeEventListener('scroll', onScroll, true) } }
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll, true); window.removeEventListener('resize', onScroll) }
  }, [seen])
  return [ref, seen]
}

const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

/* Kael's voice: composes itself a few words at a time when it comes into view */
function Types({ text, tag: Tag = 'span', className = '', speed = 58 }) {
  const [ref, seen] = useInView()
  const words = text.split(' ')
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!seen) return undefined
    if (reduceMotion()) { setN(words.length); return undefined }
    let i = 0
    const t = setInterval(() => { i += 1; setN(i); if (i >= words.length) clearInterval(t) }, speed)
    return () => clearInterval(t)
  }, [seen]) // eslint-disable-line react-hooks/exhaustive-deps
  const shown = reduceMotion() ? text : words.slice(0, n).join(' ')
  const typing = n > 0 && n < words.length
  return <Tag ref={ref} className={className}>{shown}<i className="lp2-caret" data-on={typing || undefined} /></Tag>
}

function KaelSays({ text }) {
  return (
    <div className="lp2-turn lp2-turn-k">
      <span className="lp2-av"><Sparkle size={13} weight="fill" /></span>
      <div className="lp2-bub lp2-bub-k"><Types text={text} tag="p" /></div>
    </div>
  )
}

function YouSay({ text }) {
  const [ref, seen] = useInView()
  return (
    <div className="lp2-turn lp2-turn-u" ref={ref} data-in={seen || undefined}>
      <div className="lp2-bub lp2-bub-u"><p>{text}</p></div>
    </div>
  )
}

function Reveal({ children, className = '', tag: Tag = 'div', style }) {
  const [ref, seen] = useInView()
  return <Tag ref={ref} className={`lp2-rev ${className}`} data-in={seen || undefined} style={style}>{children}</Tag>
}

/* a big serif "movement": one selling idea, quiet and confident */
function Movement({ eyebrow, line, sub, children }) {
  return (
    <section className="lp2-band lp2-col lp2-move">
      {eyebrow && <Reveal tag="span" className="lp2-label lp2-move-eye">{eyebrow}</Reveal>}
      <Reveal tag="h2" className="lp2-move-line">{line}</Reveal>
      {sub && <Reveal tag="p" className="lp2-move-sub" style={{ '--d': '0.08s' }}>{sub}</Reveal>}
      {children}
    </section>
  )
}

const CHIPS = ['I keep replaying a conversation', 'I am more tired than I should be', 'Something with my family']

const CARDS = [
  { Icon: Compass, t: 'Why am I so restless lately?', when: '2h ago', line: 'Life is moving, but maybe not in the right direction.' },
  { Icon: User, t: 'The fight with Dad', when: '6d ago', line: 'Anger on the surface, but something older underneath it.' },
  { Icon: EnvelopeSimple, t: 'What my manager’s silence does to me', when: '1w ago', line: 'Four hours on read, and a verdict I wrote myself.' },
]

/* placeholder quotes in the right voice; replace with real ones before launch */
const VOICES = [
  { q: 'I open it at 1am when my head won’t stop. It actually helps me land, instead of just spinning.', by: 'Maya R.' },
  { q: 'It brought up something I had said weeks earlier and connected it to now. I felt genuinely seen.', by: 'Daniel K.' },
  { q: 'Less a chatbot, more like someone who has been quietly paying attention the whole time.', by: 'Priya S.' },
]

const FAQ = [
  { q: 'Is Kael a real coach or software?', a: 'Kael is AI software, your coach in your pocket. There is no human on the other side, which is exactly why it can be there at 2am on a Tuesday. It is built to listen well, ask good questions, and remember your story.' },
  { q: 'Is this therapy?', a: 'No. Kael is a self-guided mental wellness app for everyday reflection: stress, overthinking, hard weeks, big decisions. It does not diagnose or treat anything and it does not give medical advice. Many people use it alongside professional care, never instead of it.' },
  { q: 'Is my writing private?', a: 'Yes. What you write is private to your account. It is never shared and never sold, and you can delete any of it, or all of it, whenever you want.' },
  { q: 'What happens after the quiz?', a: 'You get a short read of the pattern underneath what you shared, right away, free. If it rings true and you want to keep going, you can start a trial and meet Kael already knowing your story.' },
  { q: 'How do I cancel?', a: 'In a tap, from your account, any time. Billing is handled by Paddle, and you will always see the price and the renewal date before anything is charged.' },
]

function Begin({ fine }) {
  return (
    <div className="lp2-begin">
      <a className="lp2-cta" href="#begin">Begin your reflection<ArrowRight size={16} weight="bold" /></a>
      <span className="lp2-fine">{fine}</span>
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="lp2">
      <header className="lp2-mast">
        <span className="lp2-brand"><img src={markUrl} alt="Kael" width="30" height="30" />Kael</span>
        <a className="lp2-mast-cta" href="#begin">Take the quiz</a>
      </header>

      {/* HERO — Kael opens the reflection, coach positioning up top */}
      <section className="lp2-hero lp2-band">
        <div className="lp2-halo lp2-halo-hero" aria-hidden="true" />
        <div className="lp2-col">
          <span className="lp2-label lp2-hero-eye">Your personal mental wellness coach</span>
          <div className="lp2-hero-ask">
            <Types text="What has been sitting on your mind lately?" tag="h1" className="lp2-ask" speed={64} />
          </div>
          <div className="lp2-chips">
            {CHIPS.map((c) => (<a key={c} className="lp2-chip" href="#begin">{c}</a>))}
          </div>
          <Begin fine="Two minutes. Free. No account yet, just answer." />
        </div>
      </section>

      {/* first exchange */}
      <section className="lp2-band lp2-col">
        <YouSay text="I keep replaying a conversation from last week." />
        <KaelSays text="The replay is your mind trying to win a moment that already ended. What would winning it even get you?" />
      </section>

      {/* point 3: talk, vent, reflect, anytime */}
      <Movement
        eyebrow="Whatever it is"
        line="Talk it out. Vent. Or just reflect."
        sub="A hard day, a spiral at midnight, a decision you keep circling. Bring it however it comes. Kael is there any hour, as often as you need."
      />

      {/* points 2 + 6: remembers your story, whole story in one place */}
      <section className="lp2-band lp2-col lp2-mem">
        <Reveal tag="span" className="lp2-label">It remembers your story</Reveal>
        <Reveal tag="h2" className="lp2-move-line" style={{ '--d': '0.05s' }}>You never have to explain yourself twice.</Reveal>
        <div className="lp2-cards">
          {CARDS.map((c, k) => (
            <Reveal key={c.t} className="lp2-card" style={{ '--d': `${0.1 + k * 0.09}s` }}>
              <span className="lp2-card-ic"><c.Icon size={20} weight="duotone" /></span>
              <span className="lp2-card-body">
                <span className="lp2-card-top"><b>{c.t}</b><i>{c.when}</i></span>
                <span className="lp2-card-line">{c.line}</span>
              </span>
            </Reveal>
          ))}
        </div>
        <Reveal tag="p" className="lp2-cap">Every reflection is kept. Your whole story, in one place.</Reveal>
      </section>

      {/* second exchange, one layer deeper */}
      <section className="lp2-band lp2-col">
        <YouSay text="Honestly, I am more tired than I should be. And there is the thing with my family." />
        <KaelSays text="Two weights in one breath. Which one gets heavier when the house finally goes quiet?" />
      </section>

      {/* THE PATTERN READ — the page reflects the reader back (point 7 setup) */}
      <section className="lp2-band lp2-read">
        <div className="lp2-halo lp2-halo-read" aria-hidden="true" />
        <div className="lp2-col">
          <Types text="You keep apologizing for needing rest." tag="p" className="lp2-read-line" speed={78} />
          <Reveal tag="p" className="lp2-read-sub">This is the kind of thing Kael starts to notice.</Reveal>
        </div>
      </section>

      {/* point 7: know and break the patterns keeping you stuck */}
      <Movement
        eyebrow="The real work"
        line="Know the pattern. Then break it."
        sub="The loops that keep you stuck, the yes you always regret, the story you tell yourself under pressure. You cannot change what you cannot see. Kael helps you see it, and then loosen its grip."
      >
        <Reveal className="lp2-cta-wrap"><Begin fine="See yours in the two-minute quiz." /></Reveal>
      </Movement>

      {/* point 4: based on CBT and ACT */}
      <Movement
        eyebrow="Grounded in real method"
        line="Built on CBT and ACT."
        sub="Kael’s questions draw on the same approaches good therapists use, cognitive behavioral therapy and acceptance and commitment therapy, translated into plain language. Not clinical. Just questions that actually move something."
      />

      {/* point 5: testimonials */}
      <section className="lp2-band lp2-col lp2-voices">
        <Reveal tag="span" className="lp2-label">In their words</Reveal>
        <div className="lp2-voice-grid">
          {VOICES.map((v, k) => (
            <Reveal key={v.by} className="lp2-voice" style={{ '--d': `${k * 0.09}s` }}>
              <Quotes size={22} weight="fill" className="lp2-voice-q" />
              <p>{v.q}</p>
              <cite>{v.by}</cite>
            </Reveal>
          ))}
        </div>
      </section>

      {/* honesty transition + what Kael is / is not (Paddle) */}
      <section className="lp2-band lp2-col lp2-honest" id="honest">
        <Reveal tag="p" className="lp2-pull">Not a chatbot. Not a journal.<br />Not therapy.</Reveal>
        <div className="lp2-isnt">
          <Reveal className="lp2-isnt-col">
            <span className="lp2-label">What Kael is</span>
            <p>AI software you write to, to reflect. Your personal mental wellness coach, and a private place to think in your own words. Yours to keep, and yours to delete.</p>
          </Reveal>
          <Reveal className="lp2-isnt-col" style={{ '--d': '0.1s' }}>
            <span className="lp2-label">What Kael is not</span>
            <p>A therapist, a crisis line, or a human coach. It does not diagnose, treat, or give medical advice. For anything serious, please work with a licensed professional.</p>
          </Reveal>
        </div>
        <Reveal tag="p" className="lp2-crisis">If you are in crisis or thinking about harming yourself, contact your local emergency services or a crisis line right away. Kael is not built for emergencies.</Reveal>
      </section>

      {/* the one honest device moment (doubling + real Home) */}
      <section className="lp2-band lp2-device-sec">
        <div className="lp2-col lp2-double">
          <Types text="It’s Sunday. You said these nights used to feel impossible." tag="p" className="lp2-double-voice" speed={62} />
          <Reveal className="lp2-double-bub"><span className="lp2-av"><Sparkle size={12} weight="fill" /></span><div className="lp2-bub lp2-bub-k"><p>It’s Sunday. You said these nights used to feel impossible.</p></div></Reveal>
        </div>
        <Reveal className="lp2-device-wrap">
          <div className="lp2-halo lp2-halo-dev" aria-hidden="true" />
          <div className="lp2-device" aria-hidden="true">
            <div className="lp2-device-scale"><div className="rf-phone"><ReflectHome name="Maya" onNew={() => {}} onOpen={() => {}} onInvite={() => {}} onReopen={() => {}} /></div></div>
          </div>
          <span className="lp2-cap lp2-cap-c">A real place you can hold.</span>
        </Reveal>
      </section>

      {/* pricing (Paddle, honest) */}
      <section className="lp2-band lp2-col">
        <span className="lp2-label" style={{ display: 'block', marginBottom: 18 }}>The honest terms</span>
        <Reveal tag="p" className="lp2-prose">The two-minute reflection is free and needs no account. If you choose to keep going, Kael is a paid subscription. You will see the trial length, the exact price, and the renewal date before anything is charged. Billing is handled by Paddle, and you can cancel in a tap.</Reveal>
      </section>

      {/* faq */}
      <section className="lp2-band lp2-col lp2-faq">
        <span className="lp2-label" style={{ display: 'block', marginBottom: 30 }}>Fair questions</span>
        {FAQ.map((f) => (
          <Reveal key={f.q} className="lp2-faq-row">
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </Reveal>
        ))}
      </section>

      {/* close — the loop */}
      <section className="lp2-band lp2-close" id="begin">
        <div className="lp2-halo lp2-halo-hero" aria-hidden="true" />
        <div className="lp2-col">
          <div className="lp2-hero-ask">
            <Types text="So. What has been sitting on your mind?" tag="p" className="lp2-ask" speed={72} />
          </div>
          <Begin fine="Two minutes. Free. The read is yours to keep." />
        </div>
      </section>

      <footer className="lp2-foot">
        <span className="lp2-brand"><img src={markUrl} alt="Kael" width="22" height="22" />Kael</span>
        <nav aria-label="Legal"><a href="#honest">Terms</a><a href="#honest">Privacy</a><a href="#honest">Refund policy</a><a href="#honest">Contact</a></nav>
        <p className="lp2-foot-line">Kael is self-guided AI software for reflective writing. It is not a medical device, does not provide medical advice, and is not a substitute for care from a licensed professional.</p>
      </footer>
    </div>
  )
}
