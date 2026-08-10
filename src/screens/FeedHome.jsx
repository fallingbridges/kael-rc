import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Brain, ChatCircleDots, ShieldCheck, Heart, Flame, Quotes, UsersThree,
  Lightning, Scales, Moon, Anchor, Compass, CloudRain, Path,
  MagnifyingGlass, ArrowRight, ArrowLeft, Sparkle, House, ClockCounterClockwise,
  X, CaretRight, PaperPlaneTilt, Target, Hourglass, Handshake, Eye, Plant, UserCircle, Check, Flame as Streak,
} from '@phosphor-icons/react'
import { PatternLesson as ReflectLoop, TagPage as ReflectTag, LIBRARY } from './ReflectConcept.jsx'
/* the long-form bodies. There is no lesson surface any more; this is what
   Kael says in the room when a card is tapped. */
import { generateLesson } from '../feedLessons.js'

/* ──────────────────────────────────────────────────────────────────────────
   Kael — the feed home (studio lab).

   A reskin, not a rebuild. Every thread keeps the data it already has:
   its title, the hook from Kael's note, the note itself, and the two ways
   in. The arrow opens the conversation, everything else opens the note,
   exactly as it does in the app today.

   What changes is the shape of the screen. The greeting stays at the top,
   the one thread they were last in sits under it as the single dark object
   on a light screen, and under that runs the deck: short ideas, each of
   which opens a fresh conversation.

   Search and the tag and loop filters move to Journey, because that is the
   only place anyone goes looking for something. Home is for arriving.
   ────────────────────────────────────────────────────────────────────────── */

const NAME = 'Sumit'
const TODAY = 'Tuesday, June 30'

const hourGreeting = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

/* ── the deck ───────────────────────────────────────────────────────────────
   An idea names something they would recognise but had not worded, then
   stops. It never resolves, because one that closes the loop ends the
   session and the tap into Kael is the resolution.

   eyebrow  the claim, scannable
   line     the thing itself, one glance, capped at fourteen words
   ask      what Kael opens with if they tap through
   seed     what they are taken to have said, in their own voice
   ──────────────────────────────────────────────────────────────────────── */
export const IDEAS = [
  {
    hook: 'The mind does not rehearse facts, it rehearses threats. So the part that stung keeps coming back looking for a ruling, and the part you could actually use is gone by Tuesday.',
    id: 'feedback',
    open: 'Why does criticism keep replaying in my head?', cat: 'Feedback', Icon: Brain, mood: 'var(--mood-overthinking)',
    eyebrow: 'The feedback is not the whole story',
    line: 'Criticism replays when you hear it as a verdict, not a data point.',
    ask: 'Whose voice does it sound like when it repeats?',
    seed: 'There’s some feedback I keep replaying.',
    title: 'Feedback I can’t put down', sub: 'Separating the data from the sting.',
    chips: ['Someone at work', 'Someone close to me', 'I’d rather not name them'],
    lesson: 'How to stop taking criticism personally', why: 'Recommended when feedback keeps replaying',
  },
  {
    hook: 'Confidence is a memory of having done it, which means it cannot exist the first time. Waiting for it only raises the bar for what your opening sentence has to be.',
    id: 'speak',
    open: 'Why does confidence only turn up after I speak?', cat: 'Speaking up', Icon: ChatCircleDots, mood: 'var(--mood-sad)',
    eyebrow: 'Confidence arrives late',
    line: 'Confidence usually starts after you speak, not before.',
    ask: 'What would you say if you were allowed to say it badly?',
    seed: 'I keep not saying the thing I want to say.',
    title: 'The thing I don’t say', sub: 'Finding what the silence is costing.',
    chips: ['At work', 'With family', 'With one person'],
    lesson: 'How to speak up before you feel ready', why: 'Recommended when you leave meetings with things unsaid',
  },
  {
    hook: 'Guilt fires when you break a rule. It never checks whether the rule was a good one. So it tells you that you have left a pattern, not that you have done harm.',
    id: 'boundaries',
    open: 'Why does saying no make me feel guilty?', cat: 'Boundaries', Icon: ShieldCheck, mood: 'var(--mood-restless)',
    eyebrow: 'Guilt is not always a warning',
    line: 'Sometimes guilt only means you did something unfamiliar.',
    ask: 'Who taught you that saying no was unkind?',
    seed: 'I feel guilty every time I say no.',
    title: 'Guilt when I say no', sub: 'Finding where the rule came from.',
    chips: ['Family', 'Work', 'Everyone, honestly'],
    lesson: 'How to say no without feeling guilty', why: 'Recommended when guilt shows up after requests',
  },
  {
    hook: 'People do not defend against criticism. They defend against being left. Once that alarm goes off, nothing you say afterwards gets heard properly.',
    id: 'hard-talk',
    open: 'Why do hard conversations turn into fights?', cat: 'Relationships', Icon: Heart, mood: 'var(--mood-hurt)',
    eyebrow: 'Safety comes before honesty',
    line: 'A hard conversation lands better when the other person knows they still matter.',
    ask: 'What are you protecting by not saying it yet?',
    seed: 'There’s a conversation I’ve been avoiding.',
    title: 'The conversation I’m avoiding', sub: 'Finding what makes it feel unsafe.',
    chips: ['A partner', 'Family', 'A friend'],
    lesson: 'How to have a hard conversation without a fight', why: 'Recommended before a talk you keep putting off',
  },
  {
    hook: 'Rest restores capacity. It does not touch demand. You do not need a longer holiday, you need a different Monday, and the tiredness that arrives on Sunday night already knows it.',
    id: 'burnout',
    open: 'Why isn’t rest fixing this?', cat: 'Burnout', Icon: Flame, mood: 'var(--mood-anxious)',
    eyebrow: 'Rest is not the missing piece',
    line: 'Burnout survives rest when the thing you return to has not changed.',
    ask: 'What would still be waiting after a perfect week off?',
    seed: 'I rest and it doesn’t seem to help.',
    title: 'Rest that isn’t working', sub: 'Finding what the load actually is.',
    chips: ['Work', 'Home', 'Something in me'],
    lesson: 'Why rest is not fixing your burnout', why: 'Recommended when time off stops working',
  },
  {
    hook: 'From the inside it does not sound like cruelty, it sounds like accuracy. That is the trick of it. Familiar and true are very easy to confuse.',
    id: 'self-talk',
    open: 'Why am I so much harder on myself than on anyone else?', cat: 'Self talk', Icon: Quotes, mood: 'var(--mood-ashamed)',
    eyebrow: 'You would not say it to anyone else',
    line: 'The voice you use on yourself was learned from someone.\n\nIt was never yours.',
    ask: 'When did you first hear it said out loud?',
    seed: 'I’m harder on myself than I’d be on anyone else.',
    title: 'The voice I use on myself', sub: 'Finding out whose voice it is.',
    chips: ['I know exactly whose', 'I’ve never thought about it', 'It’s always been there'],
    lesson: 'How to hear whose voice you are using', why: 'Recommended when you are harder on yourself than anyone',
  },
  {
    hook: 'Ask anyone who feels behind who exactly is ahead of them. Most cannot name one. It is not a person, it is a composite made of everyone\'s best day.',
    id: 'comparison',
    open: 'Why do I always feel behind?', cat: 'Comparison', Icon: UsersThree, mood: 'var(--mood-lonely)',
    eyebrow: 'You are measuring against an edit',
    line: 'You compare your inside to other people’s outside.\n\nThen you call the gap failure.',
    ask: 'Whose life are you actually behind?',
    seed: 'I keep feeling behind everyone else.',
    title: 'Feeling behind', sub: 'Finding whose finish line this is.',
    chips: ['People I know', 'People online', 'Where I thought I’d be'],
    lesson: 'How to stop measuring yourself against an edit', why: 'Recommended when you keep feeling behind',
  },
  {
    hook: 'Hurt, fear, being made small. Anger covers those because anger has power in it and they do not. Whatever came first was quieter, and it was the real one.',
    id: 'anger',
    open: 'Why does my anger come out bigger than the thing?', cat: 'Anger', Icon: Lightning, mood: 'var(--mood-angry)',
    eyebrow: 'Anger is a second emotion',
    line: 'Anger almost always arrives after something softer got ignored.',
    ask: 'What was there half a second before it?',
    seed: 'I snapped at someone and it wasn’t really about them.',
    title: 'What was under the anger', sub: 'Finding the feeling that came first.',
    chips: ['Hurt', 'Fear', 'I couldn’t tell you'],
    lesson: 'How to find the feeling under your anger', why: 'Recommended after a reaction that felt too big',
  },
  {
    hook: 'That is why new facts never move you. You are not missing information, you are avoiding the invoice, and the circling does a good impression of thinking.',
    id: 'decision',
    open: 'Why can’t I make this decision?', cat: 'Decisions', Icon: Scales, mood: 'var(--mood-overwhelmed)',
    eyebrow: 'Stuck is information',
    line: 'You are not indecisive.\n\nBoth options cost something you have not named.',
    ask: 'What are you actually being asked to give up?',
    seed: 'There’s a decision I keep going back and forth on.',
    title: 'A decision I’m stuck on', sub: 'Finding what the choice is between.',
    chips: ['Stay or go', 'Say it or don’t', 'It’s bigger than that'],
    lesson: 'How to get unstuck on a decision', why: 'Recommended when you keep going back and forth',
  },
  {
    hook: 'There is always more that could have been done, so the balance never clears. You rest with one eye open, which restores very little, which seems to prove you had not earned it.',
    id: 'rest',
    open: 'Why does resting make me feel like I’m slacking?', cat: 'Rest', Icon: Moon, mood: 'var(--mood-calm)',
    eyebrow: 'Rest was never a reward',
    line: 'If rest has to be earned, you will always be behind on the payment.',
    ask: 'Who told you that stopping needed a reason?',
    seed: 'I can’t rest without feeling like I’m slacking.',
    title: 'Rest I have to earn', sub: 'Finding where the rule started.',
    chips: ['My family', 'My work', 'I put it there myself'],
    lesson: 'How to rest without earning it first', why: 'Recommended when sitting down feels like slacking',
  },
  {
    hook: 'You are hunting for the wording that makes a bad reaction impossible. There is no such wording, so the search never closes, and it turns up again at two in the morning.',
    id: 'control',
    open: 'Why do I keep rehearsing conversations in my head?', cat: 'Control', Icon: Anchor, mood: 'var(--mood-stressed)',
    eyebrow: 'Overthinking is a plan for the unplannable',
    line: 'Rehearsing a conversation is how you try to control someone else’s answer.',
    ask: 'What are you rehearsing right now?',
    seed: 'I keep rehearsing a conversation in my head.',
    title: 'The conversation on repeat', sub: 'Finding what the rehearsal is for.',
    chips: ['One I need to have', 'One I already had', 'One that will never happen'],
    lesson: 'How to stop rehearsing conversations', why: 'Recommended when your head will not switch off',
  },
  {
    hook: 'Being easy to be around gets rewarded quickly. Being known does not. So the easy version stays on, and it works, and it is lonely.',
    id: 'known',
    open: 'Why do I feel unknown even around people?', cat: 'Loneliness', Icon: Path, mood: 'var(--mood-numb)',
    eyebrow: 'Being known takes a first move',
    line: 'You can be surrounded and still unknown, because nobody was told.',
    ask: 'Who almost knows the real version?',
    seed: 'I’m around people and still feel unknown.',
    title: 'Around people, still unknown', sub: 'Finding who almost knows.',
    chips: ['One person, sort of', 'People know pieces', 'Nobody, really'],
    lesson: 'How to be known, not just liked', why: 'Recommended when company still feels lonely',
  },
  {
    hook: 'That leaves a stretch with nothing in either hand, and it gets read as being lost. You cannot say what you want yet, but you can say exactly what you do not. That is the whole diagnosis.',
    id: 'change',
    open: 'Why don’t I know what I want anymore?', cat: 'Change', Icon: Compass, mood: 'var(--mood-tired)',
    eyebrow: 'Not knowing is a stage, not a flaw',
    line: 'You lose interest in the old life before the new one shows up.',
    ask: 'What have you already outgrown quietly?',
    seed: 'I don’t really know what I want anymore.',
    title: 'Not sure what I want', sub: 'Looking for the thread under it.',
    chips: ['Work', 'A relationship', 'All of it'],
    lesson: 'How to sit with not knowing what you want', why: 'Recommended when the old life stopped fitting',
  },
  {
    hook: 'Which is why waiting to feel less never works. Less was never the mechanism. More is.',
    id: 'grief',
    open: 'Why does this still take up so much room?', cat: 'Grief', Icon: CloudRain, mood: 'var(--mood-low)',
    eyebrow: 'It does not shrink, you grow',
    line: 'Grief does not get smaller.\n\nThe life around it gets bigger.',
    ask: 'What still takes up the same amount of room?',
    seed: 'Something I lost still takes up all the space.',
    title: 'What I’m still carrying', sub: 'Sitting with it instead of past it.',
    chips: ['A person', 'A version of my life', 'I’m not ready to name it'],
    lesson: 'How to carry something that does not shrink', why: 'Recommended when it still takes up the same room',
  },
  {
    id: 'perfectionism',
    open: 'Why can’t I let anything be good enough?', cat: 'Perfectionism', Icon: Target, mood: 'var(--fam-thinking)',
    line: 'Perfectionism is not high standards.\n\nIt is a fear of being seen getting it wrong.',
    ask: 'What would people see if you let it be ordinary?',
    seed: 'I can\u2019t seem to let anything be good enough.',
    title: 'Never quite finished', sub: 'Finding what the last ten percent protects.',
    chips: ['Work', 'Something creative', 'Everything, honestly'],
    lesson: 'How to finish things that are not perfect',
  },
  {
    id: 'regret',
    open: 'Why do I keep going back over that decision?', cat: 'Regret', Icon: ClockCounterClockwise, mood: 'var(--fam-feeling)',
    line: 'Regret assumes you had information you did not have at the time.',
    ask: 'What did you actually know on the day?',
    seed: 'I keep going back over a decision I made.',
    title: 'The decision I keep reopening', sub: 'Judging it by what you knew then.',
    chips: ['Something years ago', 'Something recent', 'I\u2019d rather not say'],
    lesson: 'How to stop relitigating old decisions',
  },
  {
    id: 'procrastination',
    open: 'Why do I keep putting this off?', cat: 'Avoidance', Icon: Hourglass, mood: 'var(--fam-functioning)',
    line: 'Procrastination is rarely laziness. It is a feeling you are avoiding.\n\nThe feeling arrives before the task does.',
    ask: 'What do you feel in the second before you switch away?',
    seed: 'I keep putting off something important.',
    title: 'The thing I keep not doing', sub: 'Finding the feeling under the delay.',
    chips: ['Something at work', 'Something personal', 'A conversation'],
    lesson: 'How to start the thing you keep avoiding',
  },
  {
    id: 'apology',
    open: 'Why didn’t my apology land?', cat: 'Repair', Icon: Handshake, mood: 'var(--fam-connecting)',
    line: 'An apology with a because in it is a defence.\n\nIt asks to be forgiven and to be right.',
    ask: 'What would it cost to say it without the because?',
    seed: 'I apologised and it didn\u2019t land.',
    title: 'The apology that missed', sub: 'Finding what got taken back.',
    chips: ['A partner', 'Family', 'Someone at work'],
    lesson: 'How to apologise so it actually lands',
  },
  {
    id: 'envy',
    open: 'Why does someone else’s good news land like that?', cat: 'Envy', Icon: Eye, mood: 'var(--sage)',
    line: 'Envy is a map.\n\nIt points at something you want and have not admitted to wanting.',
    ask: 'What is the one thing you would take if you could?',
    seed: 'I feel envious of someone and I don\u2019t like it.',
    title: 'What the envy points at', sub: 'Reading it as information, not a flaw.',
    chips: ['A friend', 'Someone at work', 'Someone I barely know'],
    lesson: 'How to read what your envy is telling you',
  },
  {
    id: 'drift',
    open: 'Why is it so hard to message someone after a long silence?', cat: 'Friendship', Icon: Plant, mood: 'var(--mood-hopeful)',
    line: 'Friendships rarely end. They go unwatered, and then the gap feels like proof it is over.\n\nIt almost never is.',
    ask: 'Who have you been meaning to message?',
    seed: 'There\u2019s someone I\u2019ve let drift.',
    title: 'Someone I let drift', sub: 'Finding what the silence became.',
    chips: ['An old friend', 'Family', 'Someone I fell out with'],
    lesson: 'How to reach out after too long',
  },
]

/* ── atoms ──────────────────────────────────────────────────────────────── */

const Sheen = ({ a }) => <span className="kf-sheen" style={{ '--a': `${a}deg` }} aria-hidden="true" />
const Label = ({ children }) => <span className="kf-label">{children}</span>

/* ── the thread they were last in ───────────────────────────────────────────
   The same object the app already has, restyled: when, title, the hook from
   Kael's note, and the two ways in. The arrow opens the conversation,
   everything else opens the note. */
function Thread({ r, i = 0, onRead, onChat }) {
  const a = r.analysis
  return (
    <article className="kf-thread kf-rise" style={{ '--mood': r.mood, '--d': `${Math.min(i, 8) * 40}ms` }}
      role="button" tabIndex={0}
      onClick={onRead} onKeyDown={(e) => e.key === 'Enter' && onRead()}>
      <Sheen a={128} />
      <div className="kf-thread-in">
        <div className="kf-thread-top">
          <span className="kf-thread-ic"><r.Icon size={21} weight="duotone" /></span>
          <span className="kf-when">{r.when}</span>
        </div>
        <h2 className="kf-thread-title">{r.title}</h2>
        {/* the note block is its own door, so it does not need a link
            underneath repeating what tapping it already does */}
        {a ? (
          <div className="kf-noticed">
            <span className="kf-noticed-lbl">
              <Sparkle size={11} weight="fill" />Kael’s note
              <CaretRight size={13} weight="bold" />
            </span>
            <p>{a.hook}</p>
          </div>
        ) : null}
        <span className="kf-reflect" role="button" tabIndex={0}
          onClick={(e) => { e.stopPropagation(); onChat() }}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); onChat() } }}>
          Continue thread<ArrowRight size={14} weight="bold" />
        </span>
      </div>
    </article>
  )
}

/* ── the shelf ──────────────────────────────────────────────────────────────
   Two up, because a lesson is something you pick off a shelf rather than
   scroll past. The tile does the prompting: most people do not know what
   they need until it is put in front of them, which is the one thing a
   prompt box can never do. It waits; this offers.
   ────────────────────────────────────────────────────────────────────────── */
function LessonTile({ c, i, done, onOpen }) {
  return (
    <button className="kf-tile kf-rise" style={{ '--mood': c.mood, '--d': `${Math.min(i, 8) * 40}ms` }}
      onClick={() => onOpen(c)}>
      <span className="kf-tile-art">
        <Sheen a={124 + (i % 4) * 20} />
        <c.Icon size={30} weight="duotone" />
        {done && <i className="kf-tile-done"><Check size={11} weight="bold" /></i>}
      </span>
      <span className="kf-tile-in">
        <span className="kf-tile-cat">{c.cat}</span>
        <span className="kf-tile-title">{c.lesson}</span>
      </span>
    </button>
  )
}

/* ── the room ───────────────────────────────────────────────────────────────
   One surface, and no separate lesson page. Kael is not in a bubble, because
   a bubble caps how long anything can be before it looks absurd, and a lesson
   needs room. Full width prose instead.

   The user stays in a bubble on the right. That asymmetry is the only thing
   marking who is speaking, and it is enough.

   Kael goes long about an idea and stays short about you. Tapping a lesson
   asks about an idea, so it earns the whole thing. Everything after is a
   conversation, and the chips carry it: an example, a quiz, or their own
   situation brought to the lesson.
   ────────────────────────────────────────────────────────────────────────── */

const WORD_MS = 30

const ASKS = ['Give me an example', 'Quiz me', 'This happened to me…', 'How do I practise this?']

/* and once it has turned personal, short questions that hand it back */
const FOLLOW = [
  'What does that look like when it actually happens?',
  'Where do you think you learned to do that?',
  'And what does it cost you, keeping it that way?',
  'Say the part you left out.',
  'What would change if that stopped being true?',
]

const textOf = (b) => b.lead || b.h || b.q || b.sci || b.p

const flatten = (blocks) => {
  let at = 0
  return blocks.map((b) => {
    const kind = b.lead ? 'lead' : b.h ? 'h' : b.q ? 'q' : b.sci ? 'sci' : 'p'
    const words = textOf(b).split(' ')
    const start = at
    at += words.length
    return { kind, words, start, label: b.sciLabel }
  })
}
const countWords = (blocks) => blocks.reduce((n, b) => n + textOf(b).split(' ').length, 0)

/* one of Kael's turns, streamed or already said */
function KaelTurn({ blocks, shown }) {
  const flat = useMemo(() => flatten(blocks), [blocks])
  const total = flat.reduce((n, b) => n + b.words.length, 0)
  const n = shown === undefined ? total : shown
  const done = n >= total
  return (
    <div className="kf-t-kael">
      {flat.map((b, k) => {
        const w = Math.max(0, Math.min(n - b.start, b.words.length))
        if (w <= 0) return null
        const text = b.words.slice(0, w).join(' ')
        const live = !done && w < b.words.length
        if (b.kind === 'lead') return <p key={k} className="kf-t-lead">{text}{live && <i className="kf-caret" />}</p>
        if (b.kind === 'h') return <h2 key={k} className="kf-t-h">{text}</h2>
        if (b.kind === 'q') return <p key={k} className="kf-t-q">{text}{live && <i className="kf-caret" />}</p>
        /* the evidence beat, set apart so it reads as a citation rather than
           as Kael asserting something */
        if (b.kind === 'sci') return (
          <div key={k} className="kf-t-sci">
            <span>{b.label}</span>
            <p>{text}{live && <i className="kf-caret" />}</p>
          </div>
        )
        return <p key={k} className="kf-t-p">{text}{live && <i className="kf-caret" />}</p>
      })}
    </div>
  )
}

/* ── starting from nothing ──────────────────────────────────────────────────
   The blank room is where people leave, so it is never blank. Options are
   the opening line itself, in their own words: tap one and you have already
   said something real rather than answered a question about when.

   The good ones come off their own material. Their open threads first, then
   doors drawn from the loops Kael has actually seen, then plain ones for
   something new. This is the one screen where the memory can show its work.
   ────────────────────────────────────────────────────────────────────────── */

/* the ordinary reasons somebody opens the app. Deliberately generic: a door
   drawn from their own history is uncanny before they have any, and it makes
   the same screen behave differently for two people who need the same help.

   Each one is a sentence rather than a label, which is worth a whole turn.
   Tapping "Anxious" tells Kael a category and it has to ask about what.
   Tapping one of these means something has already been said. */
const DOORS = [
  { line: 'I can’t switch my head off.', open: 'Round and round. What does it keep coming back to?' },
  { line: 'Someone I can’t stop thinking about.', open: 'Who is it, and what happened most recently between you?' },
  { line: 'A decision I keep going back and forth on.', open: 'What are the two options, in the plainest words you have?' },
  { line: 'Everything feels heavy.', open: 'Heavy is a good word for it. Does it have a reason attached, or is it just sitting there?' },
  /* arriving fine has to be a way in too. Every other door is a complaint,
     and the sessions that build a habit are the ones where nothing is wrong. */
  { line: 'Nothing’s wrong, I just want to think.', open: 'Good. Those are usually the useful ones. What has been on your mind lately, even quietly?' },
]

/* for the most common arrival state of all, which is not knowing. Kael leads
   rather than making them produce the first move. */
const LEADS = [
  'Alright. What is the last thing that annoyed you more than it should have?',
  'Okay. Who have you been avoiding thinking about?',
  'Then let me pick. What did you not say today that you wanted to?',
  'Let’s start here. When did you last feel like yourself?',
  'Fine. What would you tell me if you knew I would not ask a follow up?',
]

function StartScreen({ lib, onThread, onDoor }) {
  const h = new Date().getHours()
  const opener = h >= 21 || h < 5 ? 'Late one. What’s still going round?' : 'What’s alive right now?'

  return (
    <div className="kf-start">
      <p className="kf-start-open">{opener}</p>
      <p className="kf-start-sub">There’s no right way to start.</p>

      {lib.length > 0 && (
        <>
          <span className="kf-start-lbl">Pick something back up</span>
          {/* a shelf rather than a list. Every thread is reachable, and
              flicking through them never reads as a backlog the way a
              vertical stack of unfinished things does. */}
          <div className="kf-start-shelf">
            {lib.map((r, i) => (
              <button key={r.id} className="kf-start-tile kf-rise"
                style={{ '--mood': r.mood, '--d': `${Math.min(i, 6) * 36}ms` }} onClick={() => onThread(r.id)}>
                <span className="kf-start-tile-ic"><r.Icon size={18} weight="duotone" /></span>
                <span className="kf-start-tile-when">{r.when}</span>
                <span className="kf-start-tile-title">{r.title}</span>
              </button>
            ))}
            <span className="kf-start-shelf-end" aria-hidden="true" />
          </div>
        </>
      )}

      <span className="kf-start-lbl">Or start here</span>
      {DOORS.map((d, i) => (
        <button key={d.line} className="kf-start-row kf-rise" style={{ '--d': `${(i + 2) * 36}ms` }}
          onClick={() => onDoor(d)}>
          <span className="kf-start-body"><b>{d.line}</b></span>
          <ArrowRight size={15} weight="bold" />
        </button>
      ))}

      <button className="kf-start-lead kf-rise" style={{ '--d': '280ms' }}
        onClick={() => onDoor({ line: 'I’m not sure where to start.', open: LEADS[Math.floor(Math.random() * LEADS.length)] })}>
        <span>
          <b><Sparkle size={13} weight="fill" />Not sure where to start?</b>
          <i>I’ll ask you a question to get us going.</i>
        </span>
        <ArrowRight size={15} weight="bold" />
      </button>
    </div>
  )
}

function Talk({ mode, onBack, onThread }) {
  const c = mode.idea
  const existing = mode.kind === 'old' ? LIBRARY.find((r) => r.id === mode.id) : null

  const [turns, setTurns] = useState(() => {
    /* nothing invented on the user's behalf. Opening from a card, Kael simply
       starts, and the statement they tapped is the answer's first line. */
    if (existing) return existing.history.map((h) => (h.who === 'user' ? { who: 'user', text: h.text } : { who: 'kael', blocks: [{ p: h.text }] }))
    return []
  })
  const [live, setLive] = useState(null)   // blocks being written right now
  const [shown, setShown] = useState(0)
  const [chips, setChips] = useState([])
  const [draft, setDraft] = useState('')
  const nextChips = useRef([])
  const followAt = useRef(0)
  const scroller = useRef(null)

  const say = (blocks, after) => { nextChips.current = after || []; setShown(0); setLive(blocks) }

  /* the opening turn. A card asks about an idea, so it gets the long answer;
     anything else opens short. */
  const started = useRef(false)
  useEffect(() => {
    if (started.current) return
    started.current = true
    if (c) {
      const lesson = generateLesson(c.id)
      const lead = c.line.split('\n\n').map((t) => ({ lead: t }))
      say([...lead, ...(lesson ? lesson.blocks : [])], ASKS)
    } else if (existing) {
      say([{ p: existing.reopen }], ['Yeah, that\u2019s it', 'Not really', 'I\u2019m not sure'])
    }
    /* a blank room says nothing until they have picked a way in */
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* one writer, driven off the clock so a throttled tab cannot strand a
     half written answer */
  useEffect(() => {
    if (!live) return undefined
    const total = countWords(live)
    const t0 = performance.now()
    const tick = setInterval(() => {
      const w = Math.floor((performance.now() - t0) / WORD_MS)
      if (w >= total) {
        clearInterval(tick)
        setTurns((t) => [...t, { who: 'kael', blocks: live }])
        setLive(null)
        setChips(nextChips.current)
        return
      }
      setShown(w)
    }, 40)
    return () => clearInterval(tick)
  }, [live])

  useEffect(() => {
    const el = scroller.current
    if (el) el.scrollTop = el.scrollHeight
  }, [turns, shown, live, chips])

  /* a quiz turn: Kael asks, the answers are the chips, and every answer gets
     a real reply rather than right or wrong. Learning, not testing. */
  const quiz = useRef(null)
  const askQuiz = () => {
    const lesson = c && generateLesson(c.id)
    if (!lesson || !lesson.quiz) return false
    quiz.current = lesson.quiz
    setTurns((t) => [...t, { who: 'user', text: 'Quiz me' }])
    setChips([])
    setTimeout(() => say([{ p: lesson.quiz.q }], lesson.quiz.options.map((o) => o.label)), 620)
    return true
  }

  const send = (text) => {
    if (!text.trim() || live) return
    const answer = quiz.current && quiz.current.options.find((o) => o.label === text)
    if (!answer) {
      if ((text === 'Quiz me' || text === 'Quiz me again') && askQuiz()) return
    }
    setTurns((t) => [...t, { who: 'user', text: text.trim() }])
    setDraft('')
    setChips([])
    if (answer) {
      quiz.current = null
      setTimeout(() => say([{ p: answer.reply }], ['Quiz me again', 'This happened to me…']), 620)
      return
    }
    /* short from here on, because now they are talking about themselves */
    const q = FOLLOW[followAt.current % FOLLOW.length]
    followAt.current += 1
    setTimeout(() => say([{ p: q }], c ? c.chips : []), 620)
  }

  /* the start screen stands in for the thread until there is one */
  const blank = !c && !existing && turns.length === 0 && !live
  const composerRef = useRef(null)
  const openDoor = (d) => {
    setTurns([{ who: 'user', text: d.line }])
    setTimeout(() => say([{ p: d.open }], ['Just now', 'A while ago', 'I\u2019d rather not say']), 520)
  }

  const title = c ? c.title : existing ? existing.title : 'A new thread'
  const sub = c ? c.sub : existing ? existing.line : 'Wherever it starts is fine.'

  return (
    <div className="kf-screen kf-room">
      <header className="kf-room-top">
        <button className="kf-room-back" onClick={onBack} aria-label="Back"><ArrowLeft size={18} weight="bold" /></button>
        <div className="kf-room-title"><h1>{title}</h1><span>{sub}</span></div>
      </header>

      <div className="kf-room-scroll" ref={scroller}>
        {blank && (
          <StartScreen
            lib={LIBRARY}
            onThread={onThread}
            onDoor={openDoor}
          />
        )}
        {turns.map((t, k) => (
          t.who === 'user'
            ? <p key={k} className="kf-t-user">{t.text}</p>
            : <KaelTurn key={k} blocks={t.blocks} />
        ))}
        {live && <KaelTurn blocks={live} shown={shown} />}
        {!live && !turns.length && !blank && <span className="kf-t-dots"><i /><i /><i /></span>}
        {!live && chips.length > 0 && (
          <div className="kf-asks">
            {chips.map((a) => <button key={a} className="kf-ask-chip" onClick={() => send(a)}>{a}</button>)}
          </div>
        )}
        <div className="kf-room-tail" />
      </div>

      <div className="kf-room-foot">
        <div className="kf-composer">
          <input ref={composerRef} value={draft} placeholder="Say it however it comes out"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send(draft)} />
          <button data-on={draft.trim().length > 0 || undefined} aria-label="Send" onClick={() => send(draft)}>
            <PaperPlaneTilt size={16} weight="fill" />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── home ───────────────────────────────────────────────────────────────── */
function Feed({ lib, done, onReflect, onRead, onChat, onSettings }) {
  const ongoing = lib[0]
  return (
    <div className="kf-screen">
      <header className="kf-top">
        <div className="kf-hello">
          <h1>{hourGreeting()}, {NAME}</h1>
          {/* no count here. Home is for arriving, and a tally of what you
              have accumulated is Journey's job. */}
          <span>{TODAY}</span>
        </div>
        <button className="kf-avatar" onClick={onSettings} aria-label="You and settings">{NAME[0]}</button>
      </header>

      <div className="kf-scroll">
        {ongoing && (
          <>
            <Label>Pick up from where you left</Label>
            <Thread r={ongoing} onRead={() => onRead(ongoing.id)} onChat={() => onChat(ongoing.id)} />
          </>
        )}
        <Label>Lessons for you</Label>
        <div className="kf-grid">
          {IDEAS.map((c, i) => (
            <LessonTile key={c.id} c={c} i={i} done={done.includes(c.id)} onOpen={onReflect} />
          ))}
        </div>
        <div className="kf-tail" />
      </div>

    </div>
  )
}

/* ── journey ────────────────────────────────────────────────────────────────
   Everything, newest first, and the only place with a search box. Tags and
   loops filter the list, because looking for something is the one thing
   people actually do with an archive. */
function Journey({ lib, onRead, onChat }) {
  const [q, setQ] = useState('')
  const [tag, setTag] = useState(null)

  /* only ever offer what the library actually carries */
  const tags = useMemo(() => {
    const seen = []
    lib.forEach((r) => ['moods', 'people', 'topics'].forEach((k) => (r[k] || []).forEach((t) => {
      if (!seen.includes(t)) seen.push(t)
    })))
    return seen
  }, [lib])
  const loops = useMemo(() => {
    const seen = []
    lib.forEach((r) => (r.patterns || []).forEach((t) => { if (!seen.includes(t)) seen.push(t) }))
    return seen
  }, [lib])

  const shown = lib.filter((r) => {
    const s = q.trim().toLowerCase()
    const hit = !s || `${r.title} ${r.line} ${r.analysis ? r.analysis.hook : ''}`.toLowerCase().includes(s)
    const tagged = !tag
      || (r.moods || []).includes(tag) || (r.people || []).includes(tag)
      || (r.topics || []).includes(tag) || (r.patterns || []).includes(tag)
    return hit && tagged
  })

  return (
    <div className="kf-screen">
      {/* the same block Home and You carry, so a page title is never a word
          floating on its own */}
      <header className="kf-top kf-top-plain">
        {/* a subtitle rather than a tally. Counting is the You tab's job,
            and a title needs to say what the page is for. */}
        <div className="kf-hello">
          <h1>History</h1>
          <span>Everything you’ve talked through</span>
        </div>
      </header>
      <div className="kf-jsearch">
        <MagnifyingGlass size={15} weight="bold" />
        <input value={q} placeholder="Ask about your life…" onChange={(e) => setQ(e.target.value)} />
        {q && <button onClick={() => setQ('')} aria-label="Clear search"><X size={13} weight="bold" /></button>}
      </div>
      <div className="kf-chips">
        <button className="kf-chip" data-on={tag === null || undefined} onClick={() => setTag(null)}>All</button>
        {tags.map((t) => (
          <button key={t} className="kf-chip" data-on={tag === t || undefined}
            onClick={() => setTag(tag === t ? null : t)}>{t}</button>
        ))}
        {loops.map((t) => (
          <button key={t} className="kf-chip kf-chip-loop" data-on={tag === t || undefined}
            onClick={() => setTag(tag === t ? null : t)}>{t}</button>
        ))}
      </div>
      <div className="kf-scroll">
        {/* the same object the home hero is, unpinned. A thread looks like
            a thread wherever it turns up. */}
        {shown.map((r, i) => (
          <Thread key={r.id} r={r} i={i} onRead={() => onRead(r.id)} onChat={() => onChat(r.id)} />
        ))}
        {!shown.length && <p className="kf-none">Nothing by that name yet.</p>}
        <div className="kf-tail" />
      </div>
    </div>
  )
}

/* ── Kael's note ────────────────────────────────────────────────────────────
   The same analysis the app already writes, given the treatment the lesson
   used to have: a colour banner off the thread's own mood, then the
   letter set as an article rather than as a plain page.

   Everything here is existing data. Only the vessel changed.
   ────────────────────────────────────────────────────────────────────────── */

/* *italic* and **bold**, the way the note is already authored */
const rich = (t) => String(t).split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean).map((seg, i) => {
  if (seg.startsWith('**') && seg.endsWith('**')) return <b key={i}>{seg.slice(2, -2)}</b>
  if (seg.startsWith('*') && seg.endsWith('*')) return <em key={i}>{seg.slice(1, -1)}</em>
  return <span key={i}>{seg}</span>
})

function KaelNote({ r, onBack, onChat, onOpenLoop, onOpenTag, onOpenNote }) {
  const a = r.analysis
  if (!a) return null
  const tags = [...(r.moods || []), ...(r.people || []), ...(r.topics || [])]
  /* the hook comes cheap, off a single exchange. The rest of the note waits
     until there is enough to be worth reading, and saying so is better than
     an empty page: it tells them something is being written for them. */
  const pending = !(a.open && a.open.length)
  return (
    <div className="kf-screen kf-kn" style={{ '--mood': r.mood }}>
      <button className="kf-note-back" onClick={onBack} aria-label="Back"><ArrowLeft size={18} weight="bold" /></button>
      <div className="kf-kn-scroll">
        <div className="kf-kn-hero">
          <Sheen a={126} />
          <div className="kf-kn-hero-in">
            <span className="kf-kn-kicker"><Sparkle size={12} weight="fill" />Kael’s note</span>
            <span className="kf-ic"><r.Icon size={22} weight="duotone" /></span>
            <h1 className="kf-kn-h1">{r.title}</h1>
            <span className="kf-kn-date">{r.when}</span>
          </div>
        </div>

        <div className="kf-kn-text">
          <p className="kf-kn-lead">{rich(a.hook)}</p>

          {pending && (
            <div className="kf-kn-pending">
              <h2>Still listening.</h2>
              <p>That’s my first read on this one. I write the rest once there’s enough to be worth reading, so keep going and it will fill in as we talk.</p>
            </div>
          )}

          {(a.open || []).map((t, k) => <p key={`o${k}`} className="kf-t-p">{rich(t)}</p>)}

          {(a.noticed || []).length > 0 && <h2 className="kf-t-h">What I noticed</h2>}
          {(a.noticed || []).map((t, k) => <p key={`n${k}`} className="kf-t-p">{rich(t)}</p>)}

          {a.patternName && <h2 className="kf-t-h">{a.patternName}</h2>}
          {(a.pattern || []).map((t, k) => <p key={`p${k}`} className="kf-t-p">{rich(t)}</p>)}

          {(a.before || []).length > 0 && (
            <>
              <h2 className="kf-t-h">Before this</h2>
              {a.before.map((b) => (
                <button key={b.id} className="kf-kn-before" onClick={() => onOpenNote(b.id)}>
                  <span>{b.when}</span>{b.line}<ArrowRight size={13} weight="bold" />
                </button>
              ))}
            </>
          )}

          {a.takeaway && <p className="kf-t-q">{rich(a.takeaway)}</p>}
          {a.ps && <p className="kf-kn-ps">{rich(a.ps)}</p>}

          {(r.patterns || tags).length > 0 && (
            <div className="kf-kn-filed">
              <span className="kf-label">Filed under</span>
              <div className="kf-kn-chips">
                {(r.patterns || []).map((l) => (
                  <button key={l} className="kf-kn-chip kf-kn-chip-loop" onClick={() => onOpenLoop(l)}>{l}</button>
                ))}
                {tags.map((t) => (
                  <button key={t} className="kf-kn-chip" onClick={() => onOpenTag(t)}>{t}</button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="kf-kn-tail" />
      </div>

      <div className="kf-kn-foot">
        <button className="kf-reflect" onClick={onChat}>
          <Sparkle size={15} weight="fill" />Pick this back up
        </button>
      </div>
    </div>
  )
}

/* ── you ────────────────────────────────────────────────────────────────────
   Everything the app has actually counted, and every row goes somewhere.
   The numbers are derived from the threads rather than invented, and
   the colours are the mood palette the rest of the app already uses, so a
   loop looks the same here as it does on a card.

   No streaks. Counting the days somebody did not show up is a different
   product with a different relationship to the person using it.
   ────────────────────────────────────────────────────────────────────────── */

/* the named feelings map onto the palette; anything unrecognised cycles
   through it so a new mood never renders colourless */
const MOOD_HUE = {
  Restless: '--mood-restless', Heavy: '--mood-low', Anger: '--mood-angry',
  Guilt: '--mood-ashamed', Anxious: '--mood-anxious', Overthinking: '--mood-overthinking',
  Doubt: '--mood-overwhelmed', Pressure: '--mood-stressed', Sad: '--mood-sad',
  Lonely: '--mood-lonely', Numb: '--mood-numb', Tired: '--mood-tired',
  Hurt: '--mood-hurt', Calm: '--mood-calm', Hopeful: '--mood-hopeful',
}
const FALLBACK = ['--mood-overthinking', '--mood-hurt', '--mood-anxious', '--mood-restless', '--mood-sad', '--mood-lonely', '--mood-tired', '--mood-calm']
const hueOf = (name, i) => `var(${MOOD_HUE[name] || FALLBACK[i % FALLBACK.length]})`

/* a donut, because moods are parts of a whole and a bar chart pretends
   they are a ranking */
function MoodRing({ rows, total }) {
  const R = 52
  const C = 2 * Math.PI * R
  let at = 0
  return (
    <svg className="kf-ring" viewBox="0 0 140 140" aria-hidden="true">
      {rows.map(([name, n], i) => {
        const len = (n / total) * C
        const seg = <circle key={name} cx="70" cy="70" r={R} fill="none"
          stroke={hueOf(name, i)} strokeWidth="17" strokeLinecap="butt"
          strokeDasharray={`${len - 2} ${C - len + 2}`}
          strokeDashoffset={-at} transform="rotate(-90 70 70)" />
        at += len
        return seg
      })}
      <text x="70" y="66" className="kf-ring-n">{total}</text>
      <text x="70" y="84" className="kf-ring-l">moods</text>
    </svg>
  )
}

function You({ lib, done, onLoop, onTag }) {
  const tally = (key) => {
    const m = new Map()
    lib.forEach((r) => (r[key] || []).forEach((t) => m.set(t, (m.get(t) || 0) + 1)))
    return [...m.entries()].sort((a, b) => b[1] - a[1])
  }
  const loops = tally('patterns')
  const people = tally('people')
  const topics = tally('topics')
  const moods = tally('moods')
  const moodTotal = moods.reduce((n, [, c]) => n + c, 0)

  const Group = ({ label, rows, onPick, hue }) => (
    rows.length === 0 ? null : (
      <section className="kf-stat-group kf-rise">
        <span className="kf-label">{label}</span>
        <div className="kf-stat-rows">
          {rows.map(([name, n], i) => (
            <button key={name} className="kf-stat-row" style={{ '--hue': hue(name, i) }} onClick={() => onPick(name)}>
              <i className="kf-stat-dot" />
              <span>{name}</span>
              {/* proportional to the busiest row, so the shape of the list
                  reads before any single number does */}
              <i className="kf-stat-bar" style={{ '--w': `${Math.round((n / rows[0][1]) * 100)}%` }} />
              <b>{n}</b>
              <CaretRight size={13} weight="bold" />
            </button>
          ))}
        </div>
      </section>
    )
  )

  return (
    <div className="kf-screen">
      <header className="kf-top kf-top-plain">
        <div className="kf-hello"><h1>You</h1><span>What keeps coming back</span></div>
      </header>
      <div className="kf-scroll">
        {/* what has actually been done, not days you did not show up */}
        <div className="kf-stats kf-rise">
          <span data-tint="a">
            <i><Streak size={17} weight="fill" /></i>
            <b>5</b>day streak
          </span>
          <span data-tint="b">
            <i><Check size={17} weight="bold" /></i>
            <b>{done.length}</b>lessons
          </span>
          <span data-tint="c">
            <i><Path size={17} weight="duotone" /></i>
            <b>{loops.length}</b>loops
          </span>
        </div>

        {done.length > 0 && (
          <section className="kf-stat-group kf-rise">
            <span className="kf-label">What you’ve learnt</span>
            <div className="kf-receipts">
              {done.map((id) => {
                const c = IDEAS.find((x) => x.id === id)
                if (!c) return null
                return (
                  <div key={id} className="kf-receipt" style={{ '--mood': c.mood }}>
                    <span className="kf-receipt-ic"><c.Icon size={16} weight="duotone" /></span>
                    <span>{c.lesson}</span>
                    <Check size={14} weight="bold" />
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {moods.length > 0 && (
          <section className="kf-mood kf-rise" style={{ '--d': '60ms' }}>
            <span className="kf-label">How it tends to feel</span>
            <div className="kf-mood-in">
              <MoodRing rows={moods} total={moodTotal} />
              <div className="kf-mood-key">
                {moods.map(([name, n], i) => (
                  <button key={name} className="kf-mood-item" style={{ '--hue': hueOf(name, i) }} onClick={() => onTag(name)}>
                    <i /><span>{name}</span><b>{n}</b>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        <Group label="Loops Kael keeps seeing" rows={loops} onPick={onLoop} hue={(n, i) => hueOf(n, i + 2)} />
        <Group label="Who comes up" rows={people} onPick={onTag} hue={(n, i) => hueOf(n, i + 5)} />
        <Group label="What you talk about" rows={topics} onPick={onTag} hue={(n, i) => hueOf(n, i + 1)} />
        <div className="kf-tail" />
      </div>
    </div>
  )
}

function Settings({ onBack }) {
  return (
    <div className="kf-screen">
      <header className="kf-top kf-top-plain">
        <button className="kf-room-back" onClick={onBack} aria-label="Back"><ArrowLeft size={18} weight="bold" /></button>
        <h1 className="kf-page-title">Settings</h1>
      </header>
      <div className="kf-scroll">
        {['Notifications', 'Memory', 'Subscription', 'Privacy', 'Help', 'Sign out'].map((x, i) => (
          <button key={x} className="kf-set kf-rise" style={{ '--d': `${i * 32}ms` }}>
            {x}<CaretRight size={15} weight="bold" />
          </button>
        ))}
        <div className="kf-tail" />
      </div>
    </div>
  )
}

/* ── the lab ────────────────────────────────────────────────────────────── */
export default function FeedHome() {
  const [tab, setTab] = useState('home')
  const [view, setView] = useState({ kind: 'feed' })
  const [roomKey, setRoomKey] = useState(0)
  /* lessons taken. A lesson is written once, so opening it again shows the
     same words rather than a fresh draft. */
  const [done, setDone] = useState(['boundaries', 'burnout', 'comparison'])
  const lib = LIBRARY
  const byId = (id) => lib.find((r) => r.id === id) || lib[0]

  /* a card always opens a fresh conversation. Merging a browse impulse into
     last week's heavy thread is jarring, and Kael can connect them in the
     note, which is a better place for that recognition to land. */
  const reflect = (c) => {
    if (c && !done.includes(c.id)) setDone((d) => [c.id, ...d])
    setRoomKey((k) => k + 1)
    setView({ kind: 'room', mode: c ? { kind: 'card', idea: c } : { kind: 'new' } })
  }
  const chat = (id) => { setRoomKey((k) => k + 1); setView({ kind: 'room', mode: { kind: 'old', id } }) }
  const openNote = (id) => setView({ kind: 'letter', id })
  const home = () => setView({ kind: 'feed' })

  return (
    <div className="lib-page ov-page kf-page">
      <div className="ov-stage">
        <div className="ov-screen kf-frame">
          {view.kind === 'room' ? (
            <Talk key={`room-${roomKey}`} mode={view.mode} onBack={home} onThread={chat} />
          ) : view.kind === 'letter' ? (
            <KaelNote
              r={byId(view.id)}
              onBack={home}
              onChat={() => chat(view.id)}
              onOpenNote={(id) => setView({ kind: 'letter', id })}
              onOpenLoop={(loop) => setView({ kind: 'loop', loop, from: view.id })}
              onOpenTag={(t) => setView({ kind: 'tag', tag: t, from: view.id })}
            />
          ) : view.kind === 'loop' ? (
            <ReflectLoop
              name={view.loop}
              seen={lib.filter((r) => (r.patterns || []).includes(view.loop))}
              onBack={() => setView(view.back === 'you' ? { kind: 'feed' } : { kind: 'letter', id: view.from })}
              onOpen={(id) => setView({ kind: 'letter', id })}
            />
          ) : view.kind === 'settings' ? (
            <Settings onBack={() => setView({ kind: 'feed' })} />
          ) : view.kind === 'tag' ? (
            <ReflectTag
              tag={view.tag}
              seen={lib.filter((r) => ['tags', 'moods', 'people', 'topics'].some((k) => (r[k] || []).includes(view.tag)))}
              onBack={() => setView(view.back === 'you' ? { kind: 'feed' } : { kind: 'letter', id: view.from })}
              onOpen={(id) => setView({ kind: 'letter', id })}
            />
          ) : (
            <>
              {tab === 'home' && <Feed lib={lib} done={done} onReflect={reflect} onRead={openNote} onChat={chat} onSettings={() => setView({ kind: 'settings' })} />}
              {tab === 'journey' && <Journey lib={lib} onRead={openNote} onChat={chat} />}
              {tab === 'you' && (
                <You
                  lib={lib}
                  done={done}
                  onLoop={(name) => setView({ kind: 'loop', loop: name, back: 'you' })}
                  onTag={(t) => setView({ kind: 'tag', tag: t, back: 'you' })}
                />
              )}
              {/* the way to Kael is available from every tab, not just from
                  the feed. It is the one action the whole app is for. */}
              <span className="kf-fade" aria-hidden="true" />
              <button className="kf-talk" onClick={() => reflect(null)}>
                <ChatCircleDots size={18} weight="fill" />
                <span>Talk to Kael</span>
              </button>
              <nav className="kf-nav">
                {[
                  ['home', 'Home', House],
                  ['journey', 'History', ClockCounterClockwise],
                  ['you', 'You', UserCircle],
                ].map(([id, label, Ic]) => (
                  <button key={id} data-on={tab === id || undefined} onClick={() => setTab(id)}>
                    <Ic size={21} weight={tab === id ? 'fill' : 'regular'} />
                    <span>{label}</span>
                  </button>
                ))}
              </nav>
            </>
          )}
        </div>
      </div>
      <div className="ob-devbar">
        <span>{view.kind === 'feed' ? `feed · ${tab}` : view.kind}</span>
        <button onClick={() => { setTab('home'); home() }}>Restart</button>
        <span style={{ opacity: 0.6 }}>{IDEAS.length} ideas · {lib.length} threads</span>
      </div>
    </div>
  )
}
