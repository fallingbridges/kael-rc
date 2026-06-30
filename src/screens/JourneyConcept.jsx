import { useState, Fragment } from 'react'
import { Sparkle, ArrowLeft, ChatCircleDots, Notebook, Microphone, CaretRight, GearSix } from '@phosphor-icons/react'

/* today's conversation — Kael stays contextual (it remembers the patterns) */
const CHAT = [
  { who: 'kael', text: 'Morning. I left something in your journal about last night, whenever you want it. How are you landing today?' },
  { who: 'user', text: 'A bit tired. Okay though.' },
  { who: 'kael', text: 'Tired’s allowed. Anything sitting on you, or should we just breathe here a minute?' },
  { who: 'user', text: 'Work’s piling up again.' },
  { who: 'kael', text: 'Is it the work itself, or the looking-at-all-of-it-at-once? With you, it’s usually the second one.', options: ['The work itself', 'The all-at-once', 'Both, honestly'] },
]

/* ── the day ribbon (newest first); marked days have a reflection ──────────── */
const DAYS = [
  { w: 'Tue', n: 24, rid: 'walk', on: true },
  { w: 'Mon', n: 23 },
  { w: 'Sun', n: 22, rid: 'sunday' },
  { w: 'Sat', n: 21 },
  { w: 'Fri', n: 20 },
  { w: 'Thu', n: 19, rid: 'call' },
  { w: 'Wed', n: 18 },
  { w: 'Tue', n: 17 },
  { w: 'Mon', n: 16, rid: 'email' },
]

/* ── the reflections — Kael's writing about the user, day by day, newest first.
   body blocks: { t:'p', x, linkText?, linkTo? } paragraph (optional inline
   cross-time thread link) · { t:'quote', x } the user's own words pulled back. */
const REFLECTIONS = [
  {
    id: 'walk', eyebrow: 'Yesterday · Tue 24', dateFull: 'Tuesday, June 24', isNew: true,
    title: 'The night you chose the walk',
    preview: 'You moved past it like it was nothing. It wasn’t nothing.',
    body: [
      { t: 'p', x: 'You almost didn’t tell me about Sunday. It slipped out near the end, almost an afterthought: the spiral started, the one that usually takes the whole night, and instead of lying there with it, you put your shoes on and walked.' },
      { t: 'p', x: 'Stay there with me a second, because you moved past it like it was nothing.' },
      { t: 'quote', x: 'It’s not a big deal. I just went outside.' },
      { t: 'p', x: 'It is, though. Three weeks ago, on the first Sunday you told me about, you were awake past three, certain you’d never get out from under it. Same night of the week, same trigger, and this time you found the door.', linkText: 'the first Sunday you told me about', linkTo: 'sunday' },
      { t: 'p', x: 'I noticed you still added “it’s not a big deal.” You do that, make yourself small the moment after you’ve done something hard. Not tonight. You broke a pattern. Let it count.' },
    ],
    thread: 'When you’re ready, tell me what the walk was like. Sometimes the moment we rush past is the one worth standing in.',
  },
  {
    id: 'sunday', eyebrow: 'Sun 22', dateFull: 'Sunday, June 22',
    title: 'Sunday, again',
    preview: 'Three weeks running, the evening turns heavy. That stopped being a coincidence.',
    body: [
      { t: 'p', x: 'It’s the third Sunday in a row that the evening has gotten heavy on you. I don’t think that’s a coincidence anymore, and I don’t think you do either.' },
      { t: 'p', x: 'You called the week ahead a wall.' },
      { t: 'quote', x: 'I can see all of it at once and none of it feels possible.' },
      { t: 'p', x: 'That isn’t weakness, even if that’s the story you’re telling yourself by nine. It’s your mind trying to hold seven days in a single moment. Of course it buckles. Anyone’s would.' },
      { t: 'p', x: 'It’s the same shape as the first Sunday in June, the night you couldn’t sleep. The trigger was never the work. It’s the looking at all of it at once.', linkText: 'the first Sunday in June', linkTo: 'first' },
      { t: 'p', x: 'Next Sunday, when the wall shows up, let’s try naming one thing for Monday morning and letting the other six wait. You don’t have to climb it. You just have to find the first step.' },
    ],
    thread: 'I’ll be around Sunday, if the wall comes back.',
  },
  {
    id: 'call', eyebrow: 'Thu 19', dateFull: 'Thursday, June 19',
    title: 'When you almost called him',
    preview: 'Twenty minutes with your thumb over his name. Then you didn’t.',
    body: [
      { t: 'p', x: 'Tonight you sat with your thumb over his name for, what was it, twenty minutes. And then you didn’t.' },
      { t: 'quote', x: 'I don’t even know what I’d have said.' },
      { t: 'p', x: 'I think you know a little. Not the words, but the want underneath them: to feel known by someone who already knew you, on a night when being known felt far away. That’s a human thing to reach for. There’s no shame in the reaching.' },
      { t: 'p', x: 'But here’s what I noticed. You didn’t call because you remembered how it felt the last three times, not because you white-knuckled your way out of it. That’s different. Last month this was a fight you had with yourself every night. Tonight it was almost quiet.' },
      { t: 'p', x: 'You’re starting to trust your own memory of what’s good for you. That kind of strength never feels like strength while it’s happening. It just feels like a quiet Thursday and an unsent message.' },
    ],
    thread: '',
  },
  {
    id: 'email', eyebrow: 'Mon 16', dateFull: 'Monday, June 16',
    title: 'You did a hard small thing',
    preview: 'A short one, because your day with me was short.',
    body: [
      { t: 'p', x: 'A short one today, because your day with me was short. You mentioned, almost in passing, that you finally answered the email you’d been avoiding for a week.' },
      { t: 'p', x: 'You said “finally,” like you were late. I’d say “done.”' },
      { t: 'p', x: 'Some days the whole reflection is just this: you did a hard small thing, and someone saw it. That’s all this one needs to be.' },
    ],
    thread: '',
  },
  {
    id: 'first', eyebrow: 'Wed 11 · First reflection', dateFull: 'Wednesday, June 11',
    title: 'Where we started',
    preview: 'The first thing I’ve written about you. Here’s what I see.',
    body: [
      { t: 'p', x: 'This is the first thing I’ve written about you, so let me just say what I see so far.' },
      { t: 'p', x: 'You came in carrying a lot, and you apologized for it more than once.' },
      { t: 'quote', x: 'Sorry, this is probably a lot.' },
      { t: 'p', x: 'You don’t have to be sorry with me. The lot is the point. The lot is why we’re here.' },
      { t: 'p', x: 'In a few conversations, a shape is already showing: a mind that runs ahead of you, a voice in your head harder on you than you’d ever be on a friend, and Sunday nights that seem to carry more weight than the other six.' },
      { t: 'p', x: 'I won’t fix any of that this week, and I won’t pretend to. But I’ll remember it. Every time we talk, the picture gets clearer, and you get a little less alone with it.' },
      { t: 'p', x: 'We start here.' },
    ],
    thread: '',
  },
]

export default function JourneyConcept() {
  const [view, setView] = useState('chat') // chat | feed | entry
  const [openId, setOpenId] = useState(null)
  const open = REFLECTIONS.find((r) => r.id === openId)
  const openEntry = (id) => { setOpenId(id); setView('entry') }
  return (
    <div className="lib-page ov-page jr-page">
      <div className="ov-stage">
        <div className="ov-screen jr-screen" data-theme="light">
          {view === 'chat' && <Chat onJourney={() => setView('feed')} onOpen={openEntry} />}
          {view === 'feed' && <Feed onOpen={openEntry} onBack={() => setView('chat')} />}
          {view === 'entry' && open && (
            <Entry key={open.id} r={open} onOpen={openEntry} onBack={() => setView('feed')} onChat={() => setView('chat')} />
          )}
        </div>
      </div>
    </div>
  )
}

function Chat({ onJourney, onOpen }) {
  return (
    <div className="jr-chat">
      <header className="jr-chat-top">
        <button className="jr-icon-btn" aria-label="Settings"><GearSix size={19} /></button>
        <div className="jr-chat-name"><b>Kael</b><span>always here</span></div>
        <button className="jr-icon-btn jr-jbtn" onClick={onJourney} aria-label="Your journey">
          <Notebook size={19} />
          <span className="jr-jbtn-dot" />
        </button>
      </header>
      <div className="jr-chat-thread">
        <button className="jr-invite" onClick={() => onOpen('walk')}>
          <span className="jr-invite-ic"><Sparkle size={14} weight="fill" /></span>
          <div className="jr-invite-tx">
            <span className="jr-invite-k">Kael reflected on yesterday</span>
            <span className="jr-invite-t">The night you chose the walk</span>
          </div>
          <CaretRight size={15} weight="bold" />
        </button>
        {CHAT.map((m, i) => (
          <Fragment key={i}>
            <div className={`io-cmsg io-cmsg-${m.who}`}>
              {m.who === 'kael' && <span className="io-cmsg-av"><Sparkle size={12} weight="fill" /></span>}
              <p>{m.text}</p>
            </div>
            {m.options && (
              <div className="jr-opts">
                {m.options.map((o) => <button key={o} className="jr-opt">{o}</button>)}
              </div>
            )}
          </Fragment>
        ))}
      </div>
      <div className="jr-input">
        <span className="jr-input-text">Message Kael…</span>
        <span className="jr-input-mic"><Microphone size={17} weight="fill" /></span>
      </div>
    </div>
  )
}

function Feed({ onOpen, onBack }) {
  return (
    <div className="jr-feed">
      <header className="jr-head">
        <div className="jr-topbar">
          <button className="jr-back" onClick={onBack} aria-label="Back to chat"><ArrowLeft size={20} /></button>
          <span className="jr-topbar-title">Your journey with Kael</span>
          <span className="jr-topbar-sp" />
        </div>
        <div className="jr-ribbon">
          {DAYS.map((d, i) => (
            <button key={i} className="jr-day" data-on={d.on || undefined} data-has={d.rid ? true : undefined}
              onClick={() => d.rid && onOpen(d.rid)}>
              <span className="jr-day-w">{d.w}</span>
              <span className="jr-day-n">{d.n}</span>
              <span className="jr-day-dot" />
            </button>
          ))}
        </div>
      </header>
      <div className="jr-cards">
        {REFLECTIONS.map((r, i) => (
          <button key={r.id} className="jr-card" style={{ '--d': `${0.06 * i + 0.05}s` }} onClick={() => onOpen(r.id)}>
            <span className="jr-card-date">{r.eyebrow}{r.isNew && <span className="jr-new">New</span>}</span>
            <h3 className="jr-card-title">{r.title}</h3>
            <p className="jr-card-preview">{r.preview}</p>
          </button>
        ))}
        <p className="jr-foot">Your story, one day at a time.</p>
      </div>
    </div>
  )
}

function Para({ b, onOpen }) {
  if (!b.linkText || b.x.indexOf(b.linkText) < 0) return <p className="jr-p">{b.x}</p>
  const i = b.x.indexOf(b.linkText)
  return (
    <p className="jr-p">
      {b.x.slice(0, i)}
      <button className="jr-thread" onClick={() => onOpen(b.linkTo)}>{b.linkText}</button>
      {b.x.slice(i + b.linkText.length)}
    </p>
  )
}

function Entry({ r, onOpen, onBack, onChat }) {
  return (
    <div className="jr-entry">
      <header className="jr-entry-head">
        <button className="jr-back" onClick={onBack} aria-label="Back"><ArrowLeft size={20} /></button>
      </header>
      <div className="jr-read">
        <span className="jr-entry-date">{r.dateFull}</span>
        <h1 className="jr-entry-title">{r.title}</h1>
        <div className="jr-rule" />
        <div className="jr-prose">
          {r.body.map((b, i) => (b.t === 'quote'
            ? <blockquote className="jr-quote" key={i}>{b.x}</blockquote>
            : <Para key={i} b={b} onOpen={onOpen} />))}
        </div>
        {r.thread && (
          <div className="jr-close">
            <p>{r.thread}</p>
            <button className="jr-cta" onClick={onChat}><ChatCircleDots size={16} weight="fill" />Talk to Kael about this</button>
          </div>
        )}
        <div className="jr-sign">— Kael</div>
      </div>
    </div>
  )
}
