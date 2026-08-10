/* ──────────────────────────────────────────────────────────────────────────
   Kael — what there is to learn.

   Titles exist beforehand. Lessons do not. In the shipped product every
   lesson is generated when the title is tapped; here a local generator
   stands in, satisfying the same contract so the screen is reviewable with
   no key and identical with one.

   Block vocabulary, which is what gives a generated lesson its shape and
   stops it wandering:

     { h }        section heading
     { p }        paragraph
     { callout }  the thing to remember, set apart
     { quote }    a line worth carrying, with an optional { by }
     { eg }       a worked example, labelled
     { sci }      the research beat, with { sciLabel }

   The writing framework every lesson follows:
     opening · problem · misconception · explanation · psychology ·
     research · examples · practical advice · summary
   ────────────────────────────────────────────────────────────────────────── */

export const TOPICS = [
  { id: 'thinking', name: 'Thinking', icon: 'brain', mood: 'var(--mood-overthinking)' },
  { id: 'relationships', name: 'Relationships', icon: 'heart', mood: 'var(--mood-hurt)' },
  { id: 'communication', name: 'Communication', icon: 'chat', mood: 'var(--mood-sad)' },
  { id: 'confidence', name: 'Confidence', icon: 'spark', mood: 'var(--mood-hopeful)' },
  { id: 'emotions', name: 'Emotional intelligence', icon: 'waves', mood: 'var(--mood-lonely)' },
  { id: 'decisions', name: 'Decision making', icon: 'scales', mood: 'var(--mood-overwhelmed)' },
  { id: 'self', name: 'Self awareness', icon: 'eye', mood: 'var(--mood-ashamed)' },
  { id: 'habits', name: 'Habits', icon: 'repeat', mood: 'var(--mood-restless)' },
  { id: 'mindset', name: 'Mindset', icon: 'mountain', mood: 'var(--mood-calm)' },
  { id: 'career', name: 'Career', icon: 'briefcase', mood: 'var(--mood-tired)' },
  { id: 'purpose', name: 'Purpose', icon: 'compass', mood: 'var(--mood-restless)' },
  { id: 'money', name: 'Money', icon: 'coin', mood: 'var(--mood-anxious)' },
  { id: 'leadership', name: 'Leadership', icon: 'flag', mood: 'var(--fam-functioning)' },
  { id: 'productivity', name: 'Productivity', icon: 'hourglass', mood: 'var(--fam-thinking)' },
  { id: 'creativity', name: 'Creativity', icon: 'sparkle', mood: 'var(--fam-feeling)' },
  { id: 'psychology', name: 'Psychology', icon: 'atom', mood: 'var(--mood-numb)' },
]

/* Every title is a promise. It has to name a mechanism or a move, never a
   category: a shelf label tells you where you are, a promise tells you what
   you will leave with. */
export const TITLES = [
  { id: 'overthink', topic: 'thinking', title: 'How to stop overthinking', sub: 'Why your mind keeps looping, and what actually breaks the cycle.' },
  { id: 'decision-fatigue', topic: 'thinking', title: 'Decision fatigue and why evenings are worse', sub: 'The reason your judgement gets cheaper as the day goes on.' },
  { id: 'rumination', topic: 'thinking', title: 'The difference between thinking and ruminating', sub: 'One of them ends. Learning to tell which is which.' },
  { id: 'self-trust', topic: 'thinking', title: 'How to build self trust', sub: 'Why you stopped believing yourself, and how that gets rebuilt.' },

  { id: 'attachment', topic: 'relationships', title: 'Understanding secure attachment', sub: 'What people who feel safe in love are actually doing differently.' },
  { id: 'validation', topic: 'relationships', title: 'How to stop chasing validation', sub: 'The quiet arithmetic underneath needing to be liked.' },
  { id: 'conflict', topic: 'relationships', title: 'Conflict without fighting', sub: 'Why the same sentence lands as feedback with one person and as an ending with another.' },
  { id: 'letting-go', topic: 'relationships', title: 'How to let go of someone', sub: 'Why time alone does not do it, and what does.' },
  { id: 'rejection', topic: 'relationships', title: 'Why we fear rejection so much', sub: 'The oldest maths in the human brain, still running.' },

  { id: 'hard-talk', topic: 'communication', title: 'How to have a difficult conversation', sub: 'What to say in the first ten seconds so the rest gets heard.' },
  { id: 'saying-no', topic: 'communication', title: 'How to say no without feeling guilty', sub: 'Guilt is not a moral signal. It is a familiarity signal.' },
  { id: 'listening', topic: 'communication', title: 'The listening most people never learn', sub: 'Why being understood is rarer than being agreed with.' },
  { id: 'apology', topic: 'communication', title: 'How to apologise so it actually lands', sub: 'The one word that cancels an apology every time.' },

  { id: 'speak-up', topic: 'confidence', title: 'How to speak up before you feel ready', sub: 'Confidence is a memory, which is why waiting for it cannot work.' },
  { id: 'imposter', topic: 'confidence', title: 'Imposter feelings and what they actually mean', sub: 'Who gets them, and the uncomfortable reason why.' },
  { id: 'criticism', topic: 'confidence', title: 'How to stop taking criticism personally', sub: 'Separating the data from the sting.' },
  { id: 'people-pleasing', topic: 'confidence', title: 'The hidden cost of people pleasing', sub: 'What you are actually buying, and the price you are paying for it.' },

  { id: 'anger', topic: 'emotions', title: 'What is underneath your anger', sub: 'Anger is the second feeling. Something quieter got there first.' },
  { id: 'naming', topic: 'emotions', title: 'Why naming a feeling makes it smaller', sub: 'There is a mechanism for this, and it is measurable.' },
  { id: 'envy', topic: 'emotions', title: 'How to read what your envy is telling you', sub: 'It is uncomfortable because it is honest.' },
  { id: 'grief', topic: 'emotions', title: 'Grief does not shrink', sub: 'What actually changes, and why waiting to feel less does not work.' },

  { id: 'stuck-decision', topic: 'decisions', title: 'How to get unstuck on a decision', sub: 'You are not missing information. You are avoiding the invoice.' },
  { id: 'regret', topic: 'decisions', title: 'How to stop relitigating old decisions', sub: 'You are judging a choice with information it never had.' },
  { id: 'reversible', topic: 'decisions', title: 'Which decisions actually deserve your time', sub: 'Most of them are reversible. Almost none are treated that way.' },

  { id: 'inner-voice', topic: 'self', title: 'Whose voice is your inner critic', sub: 'Nobody invents it. It gets installed.' },
  { id: 'patterns', topic: 'self', title: 'How to notice a pattern you are inside of', sub: 'The hardest thing to see is the thing you always do.' },
  { id: 'blindspots', topic: 'self', title: 'Why your blindspots are specifically yours', sub: 'They are not random. They are load-bearing.' },

  { id: 'procrastination', topic: 'habits', title: 'Why you procrastinate on small things', sub: 'It was never about time management.' },
  { id: 'rest', topic: 'habits', title: 'How to rest without earning it first', sub: 'If rest has to be earned, the balance never clears.' },
  { id: 'habit-start', topic: 'habits', title: 'How habits actually start', sub: 'Motivation is the least reliable ingredient, and everyone leads with it.' },

  { id: 'comparison', topic: 'mindset', title: 'How to stop measuring yourself against an edit', sub: 'You compare your inside to someone else’s outside.' },
  { id: 'perfectionism', topic: 'mindset', title: 'Perfectionism is not high standards', sub: 'The tell is whether finishing feels like relief or exposure.' },
  { id: 'change', topic: 'mindset', title: 'Why not knowing what you want is normal', sub: 'You leave the old life before the new one shows up.' },

  { id: 'burnout', topic: 'career', title: 'Why rest is not fixing your burnout', sub: 'Rest restores capacity. It does not touch demand.' },
  { id: 'work-identity', topic: 'career', title: 'When your job becomes your identity', sub: 'What it costs, and what happens when the job changes.' },

  { id: 'meaning', topic: 'purpose', title: 'Purpose is built, not found', sub: 'Why the search itself is the thing keeping you stuck.' },
  { id: 'values', topic: 'purpose', title: 'How to find out what you actually value', sub: 'Not what you say. What you spend.' },

  { id: 'money-story', topic: 'money', title: 'The money story you inherited', sub: 'Most financial behaviour is emotional, and it was set before you were ten.' },
  { id: 'enough', topic: 'money', title: 'Why enough keeps moving', sub: 'The treadmill has a name and a well-documented speed.' },

  { id: 'trust-team', topic: 'leadership', title: 'How trust is actually built at work', sub: 'It is not competence, and it is not likeability.' },
  { id: 'feedback-giving', topic: 'leadership', title: 'How to give feedback people can hear', sub: 'What makes someone defend rather than listen.' },

  { id: 'focus', topic: 'productivity', title: 'Why focus keeps breaking', sub: 'The cost of a switch is longer than the switch.' },
  { id: 'busy', topic: 'productivity', title: 'Busy is not the same as productive', sub: 'One of them is a feeling and it is very easy to buy.' },

  { id: 'blocked', topic: 'creativity', title: 'What creative block actually is', sub: 'Almost never a shortage of ideas.' },
  { id: 'taste-gap', topic: 'creativity', title: 'The gap between your taste and your work', sub: 'The most useful thing anyone has said about starting.' },

  { id: 'memory', topic: 'psychology', title: 'Why your memory rewrites itself', sub: 'Every recall is an edit, and you never notice.' },
  { id: 'liking-gap', topic: 'psychology', title: 'People like you more than you think', sub: 'A measurable gap, and it persists for months.' },
]

/* ── the lessons ────────────────────────────────────────────────────────────
   Written to the full framework, at length, so the format can be judged on
   the real thing rather than on a sketch. In production these arrive from
   the model; the contract is identical. */

export const LESSONS = {
  overthink: {
    blocks: [
      { p: 'You probably did not open this because you find psychology interesting. You opened it because your mind keeps replaying a conversation, or circling a decision, and you are tired of being awake inside your own head at one in the morning.' },
      { p: 'So let us start with the thing most advice gets wrong.' },

      { h: 'The misconception' },
      { p: 'Overthinking is usually described as thinking too much. That framing is why the usual advice fails: if the problem is quantity, the solution is to think less, and nobody has ever successfully thought less on purpose.' },
      { p: 'Overthinking is not excessive thinking. It is thinking that cannot terminate, and the reason it cannot terminate is that it is not aimed at a question you are able to answer.' },
      { callout: 'Real thinking ends when it reaches a conclusion. Rumination cannot end, because the thing it is reaching for is not available to you.' },

      { h: 'What is actually happening' },
      { p: 'Almost every loop you have ever been stuck in was trying to do one of three impossible things: predict how somebody else will react, obtain certainty about an outcome that has not happened, or find a version of a decision that costs nothing.' },
      { p: 'None of those are gettable. So the mind does what any system does with an unsolved problem: it keeps the file open. It reopens it when you are tired, when it is quiet, when there is nothing else occupying working memory. That is why it arrives at two in the morning rather than at two in the afternoon.' },
      { p: 'And critically, it does not feel like malfunction. It feels like diligence. That is the trap.' },

      { sciLabel: 'Intolerance of uncertainty', sci: 'Borkovec’s work on worry found something counterintuitive: worry persists because it is negatively reinforced. It feels like preparation, and the feared event usually does not happen, so the brain records the worrying as having worked. You are not stuck because you are anxious. You are stuck because the loop keeps getting rewarded.' },

      { h: 'How to tell the difference' },
      { p: 'There is a clean test, and it takes about four seconds.' },
      { p: 'Ask what would have to become true for this thinking to be finished. If you can name it, and it is something you could find out or decide, you are thinking. If the answer is that you would need to know how someone else will feel, or be certain about something unknowable, you are ruminating, and no additional rounds will help.' },
      { eg: 'Thinking: should I take the job? I need the salary, the commute, and whether I would still be learning in a year. Three things, all findable.\n\nRuminating: will they think less of me if I turn it down? Unknowable. Twenty more rounds produce exactly the same amount of information as one.' },

      { h: 'What actually interrupts it' },
      { p: 'Not distraction, which pauses it. Not deciding to stop, which has never worked for anybody. What interrupts a loop is giving it the thing it is missing, which is usually a decision made under acknowledged uncertainty.' },
      { p: 'Say the sentence out loud: I am not going to know how they will react, and I am choosing anyway. It sounds too simple to matter. What it does is close the file. The loop was searching for certainty; you have told it the search is over.' },
      { p: 'The second move is narrower and works when the loop is about a conversation. Decide the first sentence only. Not the whole exchange, not their replies, just your opening line. Rehearsal persists because you are trying to author both halves, and their half was never yours to write.' },

      { h: 'What to expect' },
      { p: 'It will come back. That is not failure, it is how a habit of thirty years behaves. What changes first is not the frequency but the duration: you will notice it starting, name it, and it will run for four minutes instead of forty.' },
      { p: 'That is the actual win, and it compounds faster than people expect.' },

      { quote: 'You are not trying to think less. You are trying to think about something answerable.' },

      { h: 'The short version' },
      { p: 'Overthinking is a search for information that does not exist. It feels like preparation, which is why it survives. Ask what would end it. If the answer is certainty about another person or an unknowable outcome, you have your diagnosis, and the way out is a decision made without the certainty rather than more rounds looking for it.' },
    ],
  },

  criticism: {
    blocks: [
      { p: 'Somebody said something about your work three weeks ago and you can still quote it exactly. You cannot remember the four useful things they said around it. You have defended yourself in the shower. You know this is disproportionate, and knowing that has not helped at all.' },

      { h: 'The misconception' },
      { p: 'The usual advice is that you should not take criticism personally. This is true and completely useless, because it describes a destination without any route, and because nobody has ever stopped a feeling by being told it was inappropriate.' },
      { p: 'Here is the more useful version: you are not failing to let it go. Something specific happened at the moment you heard it, and it happened faster than you could intervene.' },

      { h: 'What is actually happening' },
      { p: 'Criticism arrives as information about one moment. It gets filed as evidence about who you are. That filing error is the entire mechanism.' },
      { p: 'A note about one presentation becomes a claim about your competence. And a claim about your competence is not a fact you can check and put down. It is an open question about your standing, and the mind does not rehearse facts. It rehearses threats.' },
      { callout: 'The part that replays is never the part you could use. It is the part that became a verdict.' },

      { sciLabel: 'Negativity bias', sci: 'Negative information is weighted substantially heavier than equivalent positive information, and anything touching identity is processed as threat rather than as data. Baumeister’s review of the field is titled, plainly, Bad Is Stronger Than Good. This is not a personality flaw you have. It is the default setting, and it was useful when the stakes were social exclusion from a group you could not survive without.' },

      { h: 'The two-pile move' },
      { p: 'Before you respond to anything, split what was said into two piles.' },
      { p: 'Pile one is the part you could act on. Usually one sentence, usually boring. The structure was hard to follow. You went over time. That pile is work, and work is finishable.' },
      { p: 'Pile two is the part that only stung. How it was said, that it was said publicly, the tone. That pile is real, and it contains no next action, which is precisely why it loops. There is nothing to do with it, so it keeps coming back to see if you have thought of something.' },
      { eg: 'Someone says your deck was hard to follow and says it in front of the team.\n\nPile one: the deck needed a clearer through-line. One afternoon of work.\n\nPile two: it happened in front of people. Nothing to do. It will still sting tomorrow, and that is allowed.' },

      { h: 'Why the split works' },
      { p: 'It does not make pile two disappear. What it does is stop pile two from disguising itself as pile one. Most of the replaying is your mind trying to solve the sting as though it were a problem, and it is not a problem, it is a feeling, and feelings do not respond to being solved.' },
      { p: 'Separating them means the work gets done in an afternoon and the sting gets felt rather than worked on. Both finish faster.' },

      { h: 'One more thing worth knowing' },
      { p: 'The criticism that lodges hardest is almost always the one that agrees with something you already suspected. If a comment slides off, it contradicted your self-image. If it lodges, it confirmed a fear. That is useful information about the fear, and almost none about the comment.' },

      { quote: 'Feedback about a moment is not a verdict about a person.' },

      { h: 'The short version' },
      { p: 'Criticism replays when it gets filed as evidence about who you are rather than information about one moment. Split it: the part you can use, and the part that only stung. Do the first, feel the second, and stop asking the second for a next action it does not have.' },
    ],
  },

  'saying-no': {
    blocks: [
      { p: 'You said no. It was the right no. And you have spent the evening drafting an explanation that nobody asked for, editing it, and feeling like you did something unkind.' },

      { h: 'The misconception' },
      { p: 'Almost everything written about boundaries treats guilt as a sign you have gone too far, and the advice is to push through it anyway. That framing quietly accepts the premise that the guilt means something. It usually does not.' },

      { h: 'What guilt actually is' },
      { p: 'Guilt is a learned alarm. It fires when you break a rule. What it never does is check whether the rule was a good one.' },
      { p: 'If you grew up somewhere that being available was the price of being loved, then declining will fire guilt every time, including the times declining was obviously right. The alarm is doing exactly what it was trained to do. It is just wired to a rule you would reject in four seconds if it were written down.' },
      { callout: 'Guilt tells you something is unfamiliar. It does not tell you it is wrong.' },

      { sciLabel: 'Operant conditioning', sci: 'Emotional responses to rule-breaking are conditioned, and the conditioning does not evaluate the rule. This is why guilt intensity correlates with how novel the behaviour is rather than with how much harm it caused. The signal fires on familiarity, and familiarity and rightness have nothing to do with each other.' },

      { h: 'The one question' },
      { p: 'When the guilt arrives, ask a single question: who is hurt here.' },
      { p: 'If you can name a person and a real cost to them, take it seriously. That is guilt doing its actual job and it deserves a hearing.' },
      { p: 'If you cannot, what you are feeling is the newness. And newness fades with repetition, not with justification, which is why the explanation you are drafting will not help. The draft is the guilt negotiating.' },
      { eg: 'You decline a friend’s Saturday plan because you are exhausted.\n\nWho is hurt? They have a slightly quieter Saturday. That is a cost, but it is small and they will survive it.\n\nCompare: you decline to visit a parent in hospital because it is inconvenient. Nameable person, real cost. Different situation entirely, and the guilt is correct.' },

      { h: 'Why explaining makes it worse' },
      { p: 'A long explanation converts a decision into a case. Cases can be argued, which invites negotiation, which is why over-explainers get asked twice. It also signals to you that the no required justification, which reinforces the rule you were trying to loosen.' },
      { p: 'The short version, said warmly, is almost always stronger. I cannot do Saturday. That is a complete sentence.' },

      { h: 'What to expect' },
      { p: 'The first ten will feel awful. Not slightly awkward, genuinely awful, because you are running against a rule that has been reinforced for decades. That feeling is not evidence you are becoming a worse person. It is the sound of an alarm going off in an empty building.' },

      { quote: 'Not every alarm is a warning. Some of them are just old wiring.' },

      { h: 'The short version' },
      { p: 'Guilt is conditioned, and the conditioning never checked whether the rule was fair. Ask who is hurt. If you can name them, listen. If you cannot, you are feeling unfamiliarity, and the cure is repetition rather than explanation.' },
    ],
  },
}

/* the chips offered after a lesson. In production these are generated from
   the lesson and the conversation so far; the set below is the vocabulary. */
export const CHIPS = [
  'Explain differently', 'Give another example', 'Show me the science',
  'How do I practise this?', 'Quiz me', 'Apply this to my life',
  'Challenge my thinking', 'Go deeper', 'Common misconceptions',
  'Related concept', 'Summarise',
]

/* once the conversation has turned to their own situation */
export const FOLLOW_CHIPS = [
  'How should I respond?', 'Why did this trigger me?', 'Give another perspective',
  'What belief is underneath?', 'Practise this with me',
]

export const byTopic = (topicId) => TITLES.filter((t) => t.topic === topicId)
export const titleById = (id) => TITLES.find((t) => t.id === id)
export const lessonFor = (id) => LESSONS[id] || null
