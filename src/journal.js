import {
  Heartbeat, Spiral, Waves, Lightning, CloudRain, Drop, Moon, HeartBreak,
  MaskSad, Cloud, BatteryLow, Wind, Flame, Leaf, CloudSun,
} from '@phosphor-icons/react'

/* ── the mood spectrum — a fixed, deterministic set of real feelings. accents are
   muted, desaturated tones that sit on warm paper, tinting pages/discs via
   color-mix in CSS. one mood, one color, used everywhere it appears ───────────── */
export const MOODS = [
  { id: 'anxious', label: 'Anxious', Icon: Heartbeat, accent: 'var(--mood-anxious)', seed: 'I’m really anxious and I can’t tell why.' },
  { id: 'overthinking', label: 'Overthinking', Icon: Spiral, accent: 'var(--mood-overthinking)', seed: 'I can’t stop overthinking everything.' },
  { id: 'overwhelmed', label: 'Overwhelmed', Icon: Waves, accent: 'var(--mood-overwhelmed)', seed: 'Everything feels like too much right now.' },
  { id: 'stressed', label: 'Stressed', Icon: Lightning, accent: 'var(--mood-stressed)', seed: 'I’m so stressed, I can’t switch off.' },
  { id: 'low', label: 'Low', Icon: CloudRain, accent: 'var(--mood-low)', seed: 'I just feel really low today.' },
  { id: 'sad', label: 'Sad', Icon: Drop, accent: 'var(--mood-sad)', seed: 'I feel sad and I don’t fully know why.' },
  { id: 'lonely', label: 'Lonely', Icon: Moon, accent: 'var(--mood-lonely)', seed: 'I feel so lonely right now.' },
  { id: 'hurt', label: 'Hurt', Icon: HeartBreak, accent: 'var(--mood-hurt)', seed: 'Something really hurt me today.' },
  { id: 'ashamed', label: 'Ashamed', Icon: MaskSad, accent: 'var(--mood-ashamed)', seed: 'I feel ashamed, like I got something wrong.' },
  { id: 'numb', label: 'Numb', Icon: Cloud, accent: 'var(--mood-numb)', seed: 'I feel numb. Kind of nothing.' },
  { id: 'tired', label: 'Tired', Icon: BatteryLow, accent: 'var(--mood-tired)', seed: 'I’m exhausted. I’ve got nothing left.' },
  { id: 'restless', label: 'Restless', Icon: Wind, accent: 'var(--mood-restless)', seed: 'I’m restless and I can’t settle.' },
  { id: 'angry', label: 'Angry', Icon: Flame, accent: 'var(--mood-angry)', seed: 'I’m angry and I’m trying not to be.' },
  { id: 'calm', label: 'Calm', Icon: Leaf, accent: 'var(--mood-calm)', seed: 'I’m actually feeling okay right now.' },
  { id: 'hopeful', label: 'Hopeful', Icon: CloudSun, accent: 'var(--mood-hopeful)', seed: 'I feel a little hopeful today.' },
]
export const MOOD = Object.fromEntries(MOODS.map((m) => [m.id, m]))
/* the six brought to Home's "bring a feeling" — the common hard ones */
export const HOME_MOODS = ['anxious', 'overthinking', 'overwhelmed', 'low', 'lonely', 'numb'].map((id) => MOOD[id])

export const PROFILE = { name: 'Maya', initial: 'M', day: 142, streak: 4, reflections: 38, daysActive: 31 }

/* ── reflections — Kael's daily writing about the user, newest first.
   prose blocks: { t:'p', x } · { t:'quote', x } (the user's own words, pulled back).
   tags: { people, topics, patterns } strings + mood:[moodId] ─────────────────── */
export const REFLECTIONS = [
  {
    id: 'today', dayLabel: 'Today', date: 'Tuesday, June 30', moodId: 'tired', isToday: true,
    title: 'The day you almost rested',
    preview: 'An hour came free, and you didn’t know what to do with it.',
    body: [
      { t: 'p', x: 'You got to the end of your list today, and for once there was a little left over. An hour, maybe, that didn’t have a job. And you told me you didn’t know what to do with it.' },
      { t: 'quote', x: 'It feels weird to just sit here.' },
      { t: 'p', x: 'It almost never feels earned, that hour. There’s always one more thing that would make the rest okay, as if rest were a wage and you hadn’t quite worked enough to be paid in it.' },
      { t: 'p', x: 'You did sit, in the end. Twenty minutes by the window. You called it nothing. I’d call it practice.' },
    ],
    tags: { people: ['Sam'], topics: ['Rest & body', 'Work'], patterns: ['Earning rest'], mood: ['tired'] },
  },
  {
    id: 'sunday', dayLabel: 'Yesterday', date: 'Monday, June 29', moodId: 'overwhelmed',
    title: 'Sunday took more than its share',
    preview: 'By nine the week ahead had turned into a wall again.',
    body: [
      { t: 'p', x: 'By nine tonight the week ahead had turned into a wall again. You could see all of it at once, every meeting, every unanswered thing, and none of it felt possible.' },
      { t: 'quote', x: 'I don’t even know where to start, so I just don’t.' },
      { t: 'p', x: 'That isn’t laziness, whatever your 9pm voice tells you. It’s a mind trying to hold seven days in a single moment. Of course it buckles.' },
      { t: 'p', x: 'We’ve been here three Sundays now. It was never the work. It’s the looking at all of it at once.' },
    ],
    tags: { people: [], topics: ['Work', 'Sleep'], patterns: ['The Sunday wall'], mood: ['overwhelmed'] },
  },
  {
    id: 'manager', dayLabel: 'Sat, Jun 27', date: 'Saturday, June 27', moodId: 'anxious',
    title: 'What your manager’s silence did',
    preview: 'Four hours on read, and somewhere it stopped being a message.',
    body: [
      { t: 'p', x: 'Your manager left a message on read for four hours, and somewhere in hour two it stopped being a message and started being a verdict.' },
      { t: 'quote', x: 'I keep thinking I did something wrong.' },
      { t: 'p', x: 'Notice what the silence became. Not “they’re busy,” not “they’re in back-to-backs.” It became you, failing, quietly. Your mind reached for the worst reading and called it the obvious one.' },
      { t: 'p', x: 'They replied at five. It was fine. It’s always, so far, been fine. The cost wasn’t the message. It was the three hours you spent bracing for one that never came.' },
    ],
    tags: { people: ['Priya'], topics: ['Work'], patterns: ['Reading silence as judgment'], mood: ['anxious'] },
  },
  {
    id: 'mom', dayLabel: 'Wed, Jun 24', date: 'Wednesday, June 24', moodId: 'low',
    title: 'The call with your mom',
    preview: 'You said it was good, then went quiet the way you do.',
    body: [
      { t: 'p', x: 'You called your mom tonight, and you said it was good, and then you went quiet in the way you do when something good also aches a little.' },
      { t: 'quote', x: 'I just always want her to be proud of me.' },
      { t: 'p', x: 'There’s a younger you in that sentence, still doing the math: be good enough, and be loved. You’re allowed to put the calculator down with her. The love was never the prize waiting at the end of the work.' },
    ],
    tags: { people: ['Mom', 'Dad'], topics: ['Family'], patterns: ['Earning love'], mood: ['low'] },
  },
  {
    id: 'walk', dayLabel: 'Fri, Jun 20', date: 'Friday, June 20', moodId: 'calm',
    title: 'You chose the walk',
    preview: 'The spiral started, and you put your shoes on instead.',
    body: [
      { t: 'p', x: 'The spiral started tonight, the familiar one, and instead of lying down inside it, you put your shoes on and walked.' },
      { t: 'quote', x: 'I just went outside. It’s not a big deal.' },
      { t: 'p', x: 'It is, a little. A month ago this exact feeling kept you up until three. Tonight you found the door. Let it count, even if you can’t quite let it be a big deal yet.' },
    ],
    tags: { people: ['Rohan'], topics: ['Rest & body'], patterns: ['Breaking the loop'], mood: ['calm'] },
  },
  {
    id: 'first', dayLabel: 'Wed, Jun 11', date: 'Wednesday, June 11', moodId: 'overthinking',
    title: 'Where we started',
    preview: 'The first thing I’ve written about you. Here’s what I see.',
    body: [
      { t: 'p', x: 'This is the first thing I’ve written about you, so let me just say what I see so far.' },
      { t: 'p', x: 'You came in carrying a lot, and you apologized for it more than once. You don’t have to be sorry with me. The lot is the point. The lot is why we’re here.' },
      { t: 'p', x: 'Already a shape is showing: a mind that runs ahead of you, a voice harder on you than you’d ever be on a friend, and a quiet sense that rest and love both have to be earned.' },
      { t: 'p', x: 'I won’t fix any of that this week. But I’ll remember it, and every time we talk it gets clearer, and you get a little less alone with it. We start here.' },
    ],
    tags: { people: [], topics: [], patterns: [], mood: ['overthinking'] },
  },
]

/* tag registries — counts represent the fuller history (rankings on Patterns) */
export const PEOPLE = [
  { name: 'Sam', role: 'Partner', count: 31, tone: 'close, but anxious', accent: '#b06a72' },
  { name: 'Priya', role: 'Manager', count: 24, tone: 'weighs on you', accent: '#bd7c42' },
  { name: 'Dad', role: 'Father', count: 14, tone: 'tightens you', accent: '#5c6893' },
  { name: 'Rohan', role: 'Closest friend', count: 9, tone: 'lifts you', accent: '#4d8d7e' },
  { name: 'Mom', role: 'Mother', count: 6, tone: 'softens you', accent: '#7f9550' },
]
export const TOPICS = [
  { name: 'Work', count: 14, accent: '#6d82a0' },
  { name: 'Rest & body', count: 9, accent: '#7f9a6f' },
  { name: 'Family', count: 6, accent: '#b8748a' },
  { name: 'Relationships', count: 5, accent: '#c2734f' },
  { name: 'Sleep', count: 4, accent: '#8a82a0' },
]
export const PATTERNS = [
  { name: 'Earning rest', count: 7 },
  { name: 'Reading silence as judgment', count: 5 },
  { name: 'The Sunday wall', count: 4 },
  { name: 'Earning love', count: 3 },
  { name: 'Breaking the loop', count: 2 },
]

/* ── the pattern library — the deterministic "life loops". Each pattern is its
   own page: a second-person mirror, the loop itself, and the 8-part anatomy
   (trigger, story, emotion, body, move, cost, need, practice). Families follow
   the clean four: thinking · feeling · connecting · functioning ─────────────── */
export const PATTERN_FAMILIES = {
  thinking: { label: 'Thinking', blurb: 'How the mind reads the moment.' },
  feeling: { label: 'Feeling', blurb: 'The emotional weather that returns.' },
  connecting: { label: 'Connecting', blurb: 'How it plays out with people.' },
  functioning: { label: 'Functioning', blurb: 'How you act, avoid, work, and rest.' },
}

export const PATTERN_LIB = {
  'Reading silence as judgment': {
    count: 5,
    family: 'thinking',
    aka: 'Mind reading',
    mirror: 'When someone goes quiet, your mind fills the silence with a verdict about you. Then you brace for a rejection that, so far, has never come.',
    loop: ['A silence', 'I did something wrong', 'Anxiety, bracing', 'Re-read, re-check', 'The reply comes, it’s fine', 'But silence still means danger'],
    anatomy: {
      trigger: 'A pause. A message left on read, a short reply, a meeting that runs long with no word.',
      story: '“They’re upset with me. I did something wrong.” The blank gets filled with the worst reading, and the worst reading feels like the obvious one.',
      emotion: 'Anxiety, dread, a low hum of shame.',
      body: 'Tight chest, the phone back in your hand, a knot that won’t settle.',
      move: 'You brace. You re-read what you sent, you draft and delete, sometimes you double-text just to make the silence stop.',
      cost: 'Hours spent bracing for a verdict that rarely arrives. The silence costs you more than the answer ever does.',
      need: 'Reassurance that you’re still okay with them. A little certainty inside a moment built out of ambiguity.',
      practice: 'Name the gap out loud: this is silence, not a verdict. Let the story be one possibility, not the fact, and wait for the reply before you write the ending.',
    },
  },
  'Earning rest': {
    count: 7,
    family: 'functioning',
    aka: 'Productivity guilt',
    mirror: 'Rest never feels earned, so you keep working for a permission slip that never comes. The break only counts once there’s nothing left to do, and there’s always one more thing.',
    loop: ['An open hour', 'I haven’t earned this', 'Guilt', 'Find one more task', 'Still no rest', 'Rest stays a wage you’re short on'],
    anatomy: {
      trigger: 'An hour comes free. A list actually ends. The day leaves a little room.',
      story: '“I haven’t done enough to deserve to stop.” Rest reads as a reward you haven’t paid for yet.',
      emotion: 'Guilt, a restless itch, a faint dread of sitting still.',
      body: 'You reach for the phone, the laptop, the next thing. Stillness feels like static under the skin.',
      move: 'You fill the gap. One more email, one more chore, one more useful thing, so the rest never quite arrives.',
      cost: 'You run without refuelling. The body keeps the score, and the tank gets lower than you admit.',
      need: 'Permission to stop that doesn’t depend on output. To matter while producing nothing.',
      practice: 'Rest before the list is done, not after. Treat twenty minutes by the window as practice, not a prize. Rest is a need, not a wage.',
    },
  },
  'The Sunday wall': {
    count: 4,
    family: 'thinking',
    aka: 'Seeing the whole week at once',
    mirror: 'By evening the week ahead stops being days and becomes a single wall. You try to hold all of it at once, it buckles, and not-starting feels like the only move left.',
    loop: ['Sunday evening', 'The whole week at once', 'It’s impossible', 'Freeze, look away', 'Worse sleep', 'Monday confirms the dread'],
    anatomy: {
      trigger: 'Sunday night. The quiet before the week, when there’s finally room to look ahead.',
      story: '“There’s too much and I can’t start.” Every meeting and unanswered thing arrives in the same instant.',
      emotion: 'Overwhelm, dread, a sinking with nowhere to go.',
      body: 'A heaviness, a tight jaw, sleep that won’t come.',
      move: 'You look at all of it, you can’t find the first thread, so you look away. The avoidance feels like rest but isn’t.',
      cost: 'A wasted evening and a worse Monday. The wall was never the work, it was looking at all of it at once.',
      need: 'To shrink the week back into a single next thing. Permission to let the other six days wait.',
      practice: 'Name one first thing and let the rest stay out of frame. The week is a line of days, not a wall, and you only have to stand on one.',
    },
  },
  'Earning love': {
    count: 3,
    family: 'connecting',
    aka: 'Achievement-based worth',
    mirror: 'Somewhere you learned that love is the prize at the end of being good enough. So you keep performing for a closeness that was never actually conditional.',
    loop: ['A bid for closeness', 'Have I earned it', 'Perform, achieve', 'A little approval', 'Relief, briefly', 'The ledger resets'],
    anatomy: {
      trigger: 'A moment with someone whose love matters. A call with a parent, a partner’s mood, a quiet wish to be chosen.',
      story: '“If I’m good enough, I’ll be loved.” Closeness gets filed as something to earn, not something you already have.',
      emotion: 'A tender ache, a quiet anxiety under the wanting.',
      body: 'Holding your breath a little, bracing for the verdict.',
      move: 'You perform. You achieve, you please, you do the math: be good, be loved.',
      cost: 'Love starts to feel like a wage, and no amount clears the balance. You’re tired in a way rest doesn’t fix.',
      need: 'To be loved as you are, not as you perform. To set the calculator down.',
      practice: 'Notice the ledger and put it down. The love was never the prize waiting at the end of the work. Let yourself be received without the invoice.',
    },
  },
  'Catastrophizing': {
    count: 4, family: 'thinking', aka: 'Worst-case thinking',
    mirror: 'Your mind jumps to the worst ending and treats it as the likely one. A small wrong thing becomes proof the whole thing is about to fall apart.',
    loop: ['A small thing goes wrong', 'What if it all falls apart', 'Panic, bracing', 'Rehearse the disaster', 'It mostly resolves', 'But the dread felt true'],
    anatomy: {
      trigger: 'A mistake, a symptom, a delay, a hard conversation on the horizon.',
      story: '“If this goes wrong, everything is ruined.” The worst case arrives fully formed and certain.',
      emotion: 'Spiking anxiety, dread, a racing urgency.',
      body: 'Heart fast, breath shallow, a pit in the stomach.',
      move: 'You rehearse the catastrophe on a loop, as if rehearsal were protection.',
      cost: 'You live the bad outcome before it happens, and most of the time it never does.',
      need: 'Safety, and a sense that you could handle it even if it went wrong.',
      practice: 'Ask what is most likely, not what is worst, and name one true next step. You can meet the real thing if it comes. You don’t have to live it twice.',
    },
  },
  'All-or-nothing': {
    count: 3, family: 'thinking', aka: 'Black-and-white thinking',
    mirror: 'There is winning and there is failing, and nothing in between. One slip and the whole effort flips from good to worthless.',
  },
  'The comparison spiral': {
    count: 4, family: 'thinking', aka: 'Compare and despair',
    mirror: 'You measure your inside against everyone else’s outside, and you always come up short. Their highlight reel becomes the bar you quietly fail to clear.',
    loop: ['A glimpse of someone’s life', 'They’re ahead, I’m behind', 'Shame, envy', 'Scroll for more proof', 'Feel smaller', 'I must be the problem'],
    anatomy: {
      trigger: 'A feed, a friend’s news, a peer who seems further along.',
      story: '“Everyone has it figured out except me.” Their curated best becomes your honest worst.',
      emotion: 'Envy, shame, a deflating smallness.',
      body: 'A sink in the chest, the thumb still scrolling.',
      move: 'You keep looking, gathering evidence that you are behind.',
      cost: 'A borrowed yardstick that never fits, and a life unlived because you were watching others live theirs.',
      need: 'To be measured by your own path, not a stranger’s edit.',
      practice: 'Close the comparison and name one thing that is real and yours today. Their reel is not their life, and it is not your scoreboard.',
    },
  },
  'Should-storms': {
    count: 2, family: 'thinking', aka: 'Should statements',
    mirror: 'A voice keeps issuing rules: you should be further, calmer, over this by now. Each should is a small verdict that you are behind.',
  },
  'Discounting the good': {
    count: 2, family: 'thinking', aka: 'Disqualifying the positive',
    mirror: 'The good gets waved away as luck or a fluke, while every mistake counts double. The ledger is rigged against you, by you.',
  },
  'Personalizing': {
    count: 3, family: 'thinking', aka: 'Making it about you',
    mirror: 'When something goes wrong nearby, you reach for your own fault first. Other people’s moods become a quiet referendum on you.',
  },
  'Fortune-telling': {
    count: 2, family: 'thinking', aka: 'Predicting the worst',
    mirror: 'You know how it will go before it goes, and you know it will go badly. The prediction feels like wisdom, but it is just fear with a calendar.',
  },
  'Becoming the label': {
    count: 2, family: 'thinking', aka: 'Labeling',
    mirror: 'A thing you did becomes a thing you are. One failure stops being an event and starts being an identity.',
  },
  'The anxiety loop': {
    count: 6, family: 'feeling', aka: 'Reassurance and relief',
    mirror: 'Fear sends you checking for reassurance, the relief lasts a minute, and the fear comes back a little stronger. The thing that calms you is feeding it.',
    loop: ['A fear lands', 'Check, seek reassurance', 'Relief, briefly', 'The fear returns', 'Check again', 'The fear grows teeth'],
    anatomy: {
      trigger: 'Uncertainty. A worry about your health, money, a person, a what-if.',
      story: '“If I just make sure, I can stop the fear.” Certainty becomes the only acceptable exit.',
      emotion: 'Anxiety, urgency, brief relief, then more anxiety.',
      body: 'Tight chest, restless hands, the phone or the search bar.',
      move: 'You check, you ask, you google, you confirm, again and again.',
      cost: 'The reassurance wears off faster each time, and the fear gets stronger for being fed.',
      need: 'To tolerate not-knowing without having to resolve it right now.',
      practice: 'Let the urge to check pass once without acting on it. Certainty is not the cure, capacity is. The fear shrinks when it stops being fed.',
    },
  },
  'The shame spiral': {
    count: 3, family: 'feeling', aka: 'Mistake to identity',
    mirror: 'A mistake turns into a self-attack, the self-attack makes you hide, and hiding leaves you alone with the shame. The spiral feeds on the dark.',
    loop: ['A mistake', 'I’m bad, not just wrong', 'Hide, withdraw', 'Alone with it', 'Shame grows', 'Proof I should hide'],
    anatomy: {
      trigger: 'A slip, a rejection, a moment you replay with a wince.',
      story: '“I didn’t just do something bad, I am bad.” The error becomes evidence about your worth.',
      emotion: 'Shame, self-disgust, a wish to disappear.',
      body: 'Heat in the face, a curl inward, eyes down.',
      move: 'You hide it, you isolate, you rehearse the self-attack.',
      cost: 'The thing that would help, being seen kindly, is the thing shame forbids.',
      need: 'To be met in the mistake instead of left alone with it.',
      practice: 'Say the thing out loud to one safe person. Shame cannot survive being witnessed with warmth. You did a bad thing, you are not a bad thing.',
    },
  },
  'Bracing against good things': {
    count: 2, family: 'feeling', aka: 'Waiting for the other shoe',
    mirror: 'When things are good you start waiting for the other shoe. Joy feels unsafe, so you guard against it instead of having it.',
    loop: ['Something good happens', 'This won’t last', 'Brace, hold back', 'Can’t fully enjoy it', 'Stay guarded', 'Safer not to want it'],
    anatomy: {
      trigger: 'A good day, a kind word, a moment of real happiness.',
      story: '“If I let myself enjoy this, it will be taken.” Bracing feels like protection.',
      emotion: 'A guarded flatness under the good, a quiet dread.',
      body: 'A held breath, shoulders that won’t drop.',
      move: 'You hedge, you downplay, you keep one eye on the exit.',
      cost: 'You pay the price of the loss without ever getting the joy.',
      need: 'To let yourself have the good thing while it is here.',
      practice: 'Name the good out loud and let it be real for one minute. Bracing does not prevent loss, it only steals the present. Let it land.',
    },
  },
  'The anger shield': {
    count: 2, family: 'feeling', aka: 'Hurt comes out hard',
    mirror: 'When you’re hurt or scared, it comes out sideways as sharpness, sarcasm, or cold. The anger guards a softer thing you’d rather not show.',
  },
  'Resentment build-up': {
    count: 3, family: 'feeling', aka: 'Unspoken needs',
    mirror: 'You don’t say the small need, so it stacks up quietly, and then it spills over something minor. The silence was never neutral.',
  },
  'Emotional numbness': {
    count: 3, family: 'feeling', aka: 'The circuit breaker',
    mirror: 'Feeling everything got to be too much, so now you feel almost nothing. The numb is not peace, it is a breaker that tripped to keep the house from burning.',
  },
  'The hopelessness lens': {
    count: 2, family: 'feeling', aka: 'Nothing changes',
    mirror: '“Nothing changes” becomes the lens you see everything through, and through that lens, nothing is worth trying. The story writes the outcome.',
  },
  'Guilt by default': {
    count: 3, family: 'feeling', aka: 'Everyone’s comfort is yours',
    mirror: 'You feel responsible for everyone’s comfort, so any unease in the room becomes yours to fix. Guilt arrives before you’ve even done anything.',
  },
  'Reassurance-seeking': {
    count: 4, family: 'connecting', aka: 'Are we okay?',
    mirror: 'You ask “are we okay?” in a hundred small ways, but the answer never quite lands. The asking soothes for a moment and slowly wears down the thing you’re protecting.',
    loop: ['A flicker of doubt', 'Are we okay?', 'They say yes', 'Relief, briefly', 'Doubt returns', 'Ask again'],
    anatomy: {
      trigger: 'A short reply, a change in tone, a quiet you can’t read.',
      story: '“If they reassure me, I can feel safe.” Their words become the only thing that settles you.',
      emotion: 'Anxiety, a neediness you’re ashamed of, fleeting relief.',
      body: 'A pull to text, to check, to ask one more time.',
      move: 'You seek the yes again and again, in words and tests and check-ins.',
      cost: 'The reassurance never absorbs, and the asking slowly wears the other person down.',
      need: 'To hold your own okay-ness without outsourcing it.',
      practice: 'Let one wave of doubt pass without asking, and offer yourself the reassurance first. Safety you can give yourself doesn’t run out.',
    },
  },
  'People-pleasing': {
    count: 5, family: 'connecting', aka: 'Fawn and appease',
    mirror: 'You stay agreeable to stay safe, saying yes when you mean no, until you’re not sure what you actually want. Niceness becomes a way to never be a problem.',
    loop: ['A small ask', 'No feels unsafe', 'Yes, automatically', 'Quiet resentment', 'Overextended', 'Lose track of what I want'],
    anatomy: {
      trigger: 'A request, a preference, a moment that asks what you want.',
      story: '“If I please them, I’ll be safe and kept.” Your no feels like a risk to the bond.',
      emotion: 'Relief at being agreeable, then a low resentment.',
      body: 'An automatic nod, a smile that arrives before you’ve decided.',
      move: 'You accommodate, you over-give, you shrink your needs to fit.',
      cost: 'You disappear a little at a time, and the people around you never meet the real you.',
      need: 'To be safe and yourself at once, not safe by erasing yourself.',
      practice: 'Pause before the yes and ask what you actually want. A kind, honest no keeps the real you in the room.',
    },
  },
  'The anxious-attachment loop': {
    count: 3, family: 'connecting', aka: 'Pursue the distance',
    mirror: 'Distance reads as danger, so you pursue, and the pursuing creates the distance you feared. The harder you reach, the further it goes.',
  },
  'The avoidant loop': {
    count: 2, family: 'connecting', aka: 'Withdraw and return',
    mirror: 'Closeness starts to feel like too much, so you pull back to breathe, and then the loneliness pulls you back in. Near feels trapping, far feels empty.',
  },
  'Conflict avoidance': {
    count: 3, family: 'connecting', aka: 'Peace now, pay later',
    mirror: 'You keep the peace now and pay for it later. The unsaid thing doesn’t disappear, it just compounds into something harder to say.',
    loop: ['A small friction', 'Don’t make it a thing', 'Swallow it', 'Resentment builds', 'It leaks or bursts', 'Avoid harder next time'],
    anatomy: {
      trigger: 'A disagreement, a hurt, a need that would take a hard conversation.',
      story: '“If I raise it, it’ll blow up or push them away.” Silence feels safer than truth.',
      emotion: 'Relief at avoiding it, a simmering underneath.',
      body: 'A swallow, a subject change, a tightness that stays.',
      move: 'You smooth it over, you let it go in a way that isn’t really let go.',
      cost: 'Small things become big things, and the relationship runs on a script instead of the truth.',
      need: 'To be close and honest at the same time.',
      practice: 'Name the small thing while it’s still small, gently and early. Conflict tended early is connection. Avoided, it becomes distance.',
    },
  },
  'Scorekeeping': {
    count: 2, family: 'connecting', aka: 'The ledger of care',
    mirror: 'You track who gave more, cared more, reached out last, and the ledger quietly poisons the closeness. Love measured this way always comes up short.',
  },
  'Caretaking to feel needed': {
    count: 2, family: 'connecting', aka: 'Needed, so not left',
    mirror: 'You become the one who helps, so you’ll never be the one who’s left. Being needed feels safer than being chosen.',
  },
  'Walling off': {
    count: 1, family: 'connecting', aka: 'Distance as a boundary',
    mirror: 'When closeness scares you, distance gets renamed as a boundary. The wall keeps out the hurt and the love in equal measure.',
  },
  'Chasing the unavailable': {
    count: 2, family: 'connecting', aka: 'Scarcity as chemistry',
    mirror: 'The ones who can’t quite show up feel like chemistry, and the ones who can feel like boredom. Scarcity gets mistaken for a spark.',
  },
  'Procrastination as fear': {
    count: 3, family: 'functioning', aka: 'Fear in a hoodie',
    mirror: 'It looks like laziness, but it’s fear wearing a hoodie. The task matters too much, so you avoid it, and the avoiding makes it scarier.',
    loop: ['An important task', 'What if I do it badly', 'Avoid, do something else', 'Guilt mounts', 'Task grows scarier', 'Avoid harder'],
    anatomy: {
      trigger: 'A task that matters, where doing it badly would mean something about you.',
      story: '“If I don’t start, I can’t fail.” Avoidance feels like protection from the verdict.',
      emotion: 'Dread, guilt, a restless avoidance.',
      body: 'A pull toward any other tab, any other chore.',
      move: 'You do the easy things, the urgent things, anything but the one thing.',
      cost: 'The task looms larger the longer you wait, and the guilt taxes everything else.',
      need: 'To matter regardless of how the task turns out.',
      practice: 'Make the first step absurdly small, two minutes, ugly draft allowed. Procrastination is fear, and fear shrinks the moment you start.',
    },
  },
  'Overworking as anesthesia': {
    count: 4, family: 'functioning', aka: 'Busy so you don’t feel',
    mirror: 'Work is the one place the noise goes quiet, so you keep going past empty. Busy isn’t ambition here, it’s a way not to feel.',
    loop: ['A hard feeling', 'Bury it in work', 'Numb, productive', 'Depletion', 'Guilt at slowing', 'Work harder'],
    anatomy: {
      trigger: 'An uncomfortable feeling, an empty evening, a quiet that asks something of you.',
      story: '“If I’m producing, I’m okay.” Work becomes proof and painkiller at once.',
      emotion: 'A driven numbness, relief in the doing, dread in the stopping.',
      body: 'Wired and tired, a body running on fumes.',
      move: 'You take on more, you stay later, you make rest impossible.',
      cost: 'You burn the reserves you don’t replace, and the feelings wait for you anyway.',
      need: 'To be okay when you’re not producing, and to let the feeling come.',
      practice: 'Stop before empty, on purpose, and let one quiet moment in. Work can wait. The feeling you’re outrunning is the one asking to be felt.',
    },
  },
  'Doomscrolling': {
    count: 3, family: 'functioning', aka: 'Snacking on alarm',
    mirror: 'You reach for the feed to feel less, and somehow end up feeling worse and more wired. It’s the nervous system snacking on alarm.',
  },
  'Self-sabotage': {
    count: 2, family: 'functioning', aka: 'Break it before it breaks you',
    mirror: 'When something good gets close, you find a way to break it first. If you end it, it can’t end you.',
  },
  'Revenge bedtime procrastination': {
    count: 2, family: 'functioning', aka: 'Stealing the day back',
    mirror: 'The day was never yours, so you steal it back from sleep, scrolling past tired to claim a little freedom. Morning pays the bill.',
  },
  'Decision paralysis': {
    count: 2, family: 'functioning', aka: 'Certainty before action',
    mirror: 'You wait for certainty before you move, and certainty never comes, so you don’t. Keeping every option open quietly becomes choosing none.',
  },
  'Isolating when you need people most': {
    count: 3, family: 'functioning', aka: 'Withdraw when low',
    mirror: 'The lower you feel, the more you pull away, right when company would help. Reaching out feels like a burden, so you carry it alone.',
    loop: ['A hard stretch', 'I’d just be a burden', 'Pull away', 'More alone', 'Feel worse', 'Withdraw further'],
    anatomy: {
      trigger: 'A low patch, a dip, a stretch where everything feels heavy.',
      story: '“No one wants this version of me.” Connection feels like an imposition.',
      emotion: 'Heaviness, shame, a numb retreat.',
      body: 'Cancelled plans, an unanswered phone, the curtains drawn.',
      move: 'You go quiet, you decline, you make yourself scarce.',
      cost: 'You lose the very thing that lifts the low, and the isolation deepens it.',
      need: 'To be kept company in the low without having to perform okay.',
      practice: 'Send one low-effort signal to one safe person, even just “rough day.” You don’t have to host. You just have to not vanish.',
    },
  },
  'Achievement as worth': {
    count: 3, family: 'functioning', aka: 'Only as good as the last win',
    mirror: 'You’re only as valuable as your last win, so you chase the next one to stay afloat. The finish line moves every time you reach it.',
  },
  'Breaking the loop': {
    count: 2, family: 'functioning', aka: 'The exit',
    mirror: 'This is the one that isn’t a trap. It’s the moment you saw a loop starting and chose the door instead. Kael keeps this one so you can see it is real, and repeatable.',
  },
}
export const getPattern = (name) => PATTERN_LIB[name] || null
export const LOOPS = Object.entries(PATTERN_LIB).map(([name, p]) => ({ name, ...p }))
export const loopsByCount = [...LOOPS].sort((a, b) => (b.count || 0) - (a.count || 0))
export const loopsInFamily = (fam) => loopsByCount.filter((l) => l.family === fam)

/* the continuous conversation — Kael messages carry tappable options */
export const CHAT = [
  { who: 'kael', text: 'Morning, Maya. Last night the week looked like a wall again. How does it look in daylight?', options: ['Still a wall', 'A bit smaller', 'I don’t want to look yet'] },
  { who: 'user', text: 'A bit smaller, maybe.' },
  { who: 'kael', text: 'Daylight does that. Want to name just the first thing for today and let the other six wait?', options: ['The manager email', 'Get through the morning', 'Rest, honestly'] },
  { who: 'user', text: 'Rest, honestly. I’m so tired.' },
  { who: 'kael', text: 'I keep coming back to something you said. You told me you were fine, more than once, and each time you said it a little faster.\n\nWhat I noticed was the move right after. You reorganised your inbox, rewrote a doc nobody asked for, found one more task to reach for, the way someone reaches for a railing.\n\nSo here’s the quieter question. Not whether you’re fine, but what you’d have to feel if you stopped being busy for a while. What do you think is waiting underneath all that motion?', options: ['Honestly, I don’t know', 'I think I’m scared to look', 'Can we start smaller?'] },
]

/* insights — for the Patterns screen */
export const MOOD_MAKEUP = [
  { id: 'anxious', pct: 24 }, { id: 'hopeful', pct: 16 }, { id: 'overwhelmed', pct: 14 },
  { id: 'restless', pct: 13 }, { id: 'sad', pct: 12 }, { id: 'numb', pct: 11 }, { id: 'calm', pct: 10 },
]
export const PATTERN_NOTES = [
  'You let yourself rest only after the work is done. Rest still has to be earned.',
  'Silence reads as a verdict before it reads as “they’re busy.” The worst story is the first one you reach for.',
  'Sunday nights carry more than their share. The trigger isn’t the week. It’s seeing all of it at once.',
]
/* 12 weeks × 7 days of engagement intensity (0–3) for the activity heatmap */
export const ACTIVITY = [
  0,1,2,1,0,2,1, 1,0,1,3,2,1,0, 2,1,0,1,2,3,1, 0,2,1,1,0,1,2,
  1,3,2,0,1,1,2, 2,1,1,2,3,1,0, 0,1,2,1,2,1,1, 3,2,1,0,1,2,2,
  1,1,2,3,2,1,1, 2,0,1,2,1,3,2, 1,2,2,1,2,1,0, 2,3,2,1,2,1,1,
]
/* the same 12 weeks, painted by feeling — each day its dominant mood, or null
   if you didn't show up. the long-view "inner weather" mosaic for the profile. */
const MOSAIC_MOODS = ['anxious', 'tired', 'overwhelmed', 'low', 'calm', 'overthinking', 'hopeful', 'stressed', 'sad', 'restless', 'numb', 'lonely']
export const MOSAIC = ACTIVITY.map((v, i) => (v === 0 ? null : MOSAIC_MOODS[(i * 5 + v * 3) % MOSAIC_MOODS.length]))

/* ── helpers ─────────────────────────────────────────────────────────────── */
export const getReflection = (id) => REFLECTIONS.find((r) => r.id === id)
export const reflectionsWithTag = (cat, name) =>
  REFLECTIONS.filter((r) => (r.tags?.[cat] || []).includes(name))
export const tagCount = (cat, name) => {
  const reg = { people: PEOPLE, topics: TOPICS, patterns: PATTERNS }[cat]
  const hit = reg && reg.find((t) => t.name === name)
  return hit ? hit.count : reflectionsWithTag(cat, name).length
}
export const tagLabel = (cat, name) => (cat === 'mood' ? MOOD[name]?.label || name : name)
