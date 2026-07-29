/* ──────────────────────────────────────────────────────────────────────────
   The micro-lessons behind each named loop.

   Kael invents these names, so each one has to be able to explain itself
   properly: what it is, where it comes from, how to catch it in the act, and
   what actually interrupts it. Written in Kael's voice. Plain, warm, direct.
   No therapy-speak, no em dashes, nothing that shames the reader for having
   the pattern in the first place.

   Block types the reader supports: p, h, quote, list, note.
   ────────────────────────────────────────────────────────────────────────── */

export const PATTERN_LESSONS = {
  'Inheritance loop': {
    kicker: 'Inheritance loop',
    title: 'When one sentence undoes a week',
    lede: 'Why one sentence from a parent can undo a week you were otherwise handling fine.',
    minutes: 4,
    blocks: [
      { t: 'p', v: 'There is a particular kind of hurt that arrives out of proportion. Someone says a short, ordinary thing, and it goes through you like it was engineered for the purpose. Afterwards you replay it and cannot quite explain why it landed so hard. The sentence was not that bad. Your reaction was not that small.' },
      { t: 'p', v: 'That gap between the size of the comment and the size of the reaction is the whole pattern. It is the most reliable signal you have that something older just got touched.' },

      { t: 'h', v: 'What is actually happening' },
      { t: 'p', v: 'When your father said you have become too busy for family, you did not hear one sentence. You heard the whole file. The version of this from the year you chose your college. The version from the job you took. Every earlier instance stacked behind it, all arriving at once, in a moment that on paper contained only eleven words.' },
      { t: 'p', v: 'Your nervous system is doing something efficient here, not something broken. It has met this shape before. It recognises the opening notes and plays the rest of the song without waiting to hear whether this time is different. That is pattern matching, and most of the time pattern matching is what keeps you safe.' },
      { t: 'p', v: 'The cost is that you end up answering the archive instead of the person. You defend against a case that was built over twenty years, in a conversation the other person thinks is about your calendar.' },

      { t: 'quote', v: 'The comment was the size of a comment. The reaction was the size of the history.' },

      { t: 'h', v: 'Where it comes from' },
      { t: 'p', v: 'Every family teaches a handful of sentences about who you are. Not by sitting you down, but by repetition, in offhand moments, usually without meaning to. You are the responsible one. You are difficult. You leave. You are too much. You are not enough for your own good.' },
      { t: 'p', v: 'These become the terms of the argument, and you inherit them the way you inherit a face. By the time you are an adult they are so familiar they stop sounding like opinions and start sounding like facts. When someone touches one, you do not experience it as an interpretation you could disagree with. You experience it as being found out.' },
      { t: 'p', v: 'The loop closes because your response usually confirms the thing. You go quiet, or you go sharp, and the room reads it as evidence. Then everyone has slightly more proof for the story than they had before, and the next time it fires a little faster.' },

      { t: 'h', v: 'How to catch it in the act' },
      { t: 'p', v: 'You will not catch it by trying to feel less. The feeling arrives before you get a vote. What you can catch is the disproportion, and it has some fairly consistent tells.' },
      { t: 'list', v: [
        'The reaction is bigger than the moment, and you know it while it is happening.',
        'You are suddenly arguing about something that is not on the table. Not tonight, but always, never, every time.',
        'You are defending a version of yourself nobody in the room has actually accused you of being.',
        'You can predict their next line, and you have your answer ready before they say it.',
        'Afterwards, the sentence you cannot stop replaying is not the worst thing said. It is the most familiar thing said.',
      ] },
      { t: 'p', v: 'That last one is the sharpest test. Familiarity, not severity, is what makes a comment stick to you for three days.' },

      { t: 'h', v: 'How to break it' },
      { t: 'p', v: 'Not insight alone. You can understand this pattern perfectly and still run it on Sunday. What helps is smaller and more mechanical than understanding.' },
      { t: 'p', v: 'The first move is naming the age of the feeling while you are in it. Not the cause, just the age. Something like, this feels like the college conversation. You are not trying to solve anything. You are only telling yourself that some of the weight in the room came in with you, and the rest of it belongs to tonight. That separation is most of the work.' },
      { t: 'p', v: 'The second move is answering the sentence rather than the file. The sentence was about your visits this year. It is answerable. The file is not answerable, which is exactly why arguing it never resolves anything and always leaves you flattened.' },
      { t: 'p', v: 'The third is the hardest and it is a question rather than a technique. If the old story turned out to be wrong, what would you have to feel about the years you spent believing it? Sometimes the loop stays because the alternative is grief, and grief is a worse Tuesday than being angry at your father.' },

      { t: 'note', v: 'This one is not on a schedule. It gets quieter as you catch it earlier, not as you stop having it. Six months in, most people are not free of it. They just recognise it in ten minutes instead of three days, and ten minutes is a different life.' },

      { t: 'h', v: 'What to expect' },
      { t: 'p', v: 'For a while you will only see it afterwards. That is normal and it still counts. Recognising a loop in hindsight is how you eventually recognise it in the moment, and recognising it in the moment is how you eventually get a choice about it.' },
      { t: 'p', v: 'The point is not to stop loving people who can do this to you. It is to stop handing them the whole history every time they say something careless, so that a bad sentence on a Tuesday costs you an evening instead of a week.' },
    ],
  },

  'Silence spiral': {
    kicker: 'Silence spiral',
    title: 'The verdict you wrote yourself',
    lede: 'What happens in the hours between sending something and hearing back.',
    minutes: 4,
    blocks: [
      { t: 'p', v: 'You sent the message at eleven. By one, you have read it back four times. By three, you have decided what they think of you. By five, you are composing the follow up that makes it look like you do not care, which is the message that most reliably announces that you do.' },
      { t: 'p', v: 'Nothing happened in those hours. That is the strange part. No information arrived at all. The entire verdict was manufactured inside your own head, out of nothing but time.' },

      { t: 'h', v: 'What is actually happening' },
      { t: 'p', v: 'Ambiguity is genuinely uncomfortable, and the mind resolves it fast, because an answer is easier to carry than an open question. So it writes one. And when the mind writes an answer with no evidence, it does not flip a coin. It reaches for whatever story is already loaded.' },
      { t: 'p', v: 'For most people that story is not neutral. It is some version of, they have seen the real me and reconsidered. Silence does not create that belief. It just gives it a stage.' },
      { t: 'p', v: 'The tell is that the verdict arrives before any information does. If you can already describe their tone, their face, what they said to someone else about you, you are not reading a situation. You are reading yourself, and calling it them.' },

      { t: 'quote', v: 'Silence has no content. Everything you found in it, you brought.' },

      { t: 'h', v: 'The trap inside the trap' },
      { t: 'p', v: 'The spiral does not only cost you an afternoon. It changes what you do next, and what you do next tends to make the situation real.' },
      { t: 'list', v: [
        'You go cold, so that when they reply you are already halfway out of the conversation.',
        'You over explain, and a simple message becomes something they now have to manage.',
        'You send the light follow up that is not light at all, and they feel the weight in it.',
        'You withdraw entirely, and the distance you feared becomes distance you built.',
      ] },
      { t: 'p', v: 'This is why the pattern is so convincing over time. It keeps producing evidence for itself. Not because your read was right, but because your response was visible.' },

      { t: 'h', v: 'How to break it' },
      { t: 'p', v: 'Speed is the enemy here, so the counter is delay. Not the false calm of pretending you do not care, which takes more energy than caring does. Just a decision that the story does not get written yet.' },
      { t: 'p', v: 'One useful move is to say the read out loud, in full, and then look at what it rests on. They think I am too much. Based on what? Four hours of nothing, on a Tuesday, when they were at work. Said plainly, most of these collapse. They only survive while they stay unspoken.' },
      { t: 'p', v: 'A second is to count the other explanations before you commit to yours. Not to be positive about it, just accurate. Busy. Tired. Forgot. Composing something careful. Phone dead. Having their own bad day that has nothing to do with you.' },
      { t: 'p', v: 'The third is the one that actually ends it. Ask. A plain question costs less than four hours of invention, and it puts the answer back with the person who has it.' },

      { t: 'note', v: 'If it helps: people are, on the whole, thinking about you far less than the spiral assumes. That is not a slight. It is the relief hiding inside it.' },
    ],
  },

  'Comparison loop': {
    kicker: 'Comparison loop',
    title: 'Behind, but behind what?',
    lede: 'Feeling behind, without being able to say behind what.',
    minutes: 3,
    blocks: [
      { t: 'p', v: 'There is a restlessness that has no object. You are not moving toward anything in particular and you are not running from anything in particular. You just have the persistent sense that you should be further along than you are, and no clear idea what further would look like if you got there.' },
      { t: 'p', v: 'That absence is the diagnostic. Real ambition can name what it wants. This cannot. Ask it what further means and it goes quiet, or it borrows an answer from someone else.' },

      { t: 'h', v: 'What is actually happening' },
      { t: 'p', v: 'You are measuring your pace against a finish line you did not draw. Usually several at once, assembled out of people you know, people you follow, and a version of yourself you imagined at twenty three. None of these agree with each other, which is why the standard is impossible to meet and impossible to argue with.' },
      { t: 'p', v: 'The comparison is also unfair in a specific structural way. You are comparing your inside to their outside, and their outside has been edited. You know your own doubt in full. You know their progress only in summary.' },

      { t: 'quote', v: 'You are behind on a race you never chose to enter, against people running somewhere you may not want to go.' },

      { t: 'h', v: 'How it shows up' },
      { t: 'list', v: [
        'Achievements stop landing. The relief lasts about a day and then the bar moves.',
        'You feel it most in idle moments, not busy ones. It is a symptom of stillness.',
        'Good news from friends produces a small, unwelcome flinch before the happiness arrives.',
        'You cannot describe what enough would look like, only that this is not it.',
      ] },

      { t: 'h', v: 'How to break it' },
      { t: 'p', v: 'The instinct is to work harder, which feeds it. The loop is not short of effort. It is short of a destination.' },
      { t: 'p', v: 'A better move is to make the finish line explicit. Whose is it. Write the name. Often the answer is a person whose life you would not actually want if it came as a package, and seeing that on paper takes most of the charge out of it.' },
      { t: 'p', v: 'Then ask what you would do this year if nobody could see it. Not as a nice thought experiment. As an actual filter. The things that survive it are yours. The things that evaporate were somebody else’s the whole time.' },
      { t: 'note', v: 'Restlessness is not a flaw. It is usually a want that has not been given a name yet. The work is naming it, not suppressing it.' },
    ],
  },

  'Clock-watching': {
    kicker: 'Clock-watching',
    title: 'Tired, or done?',
    lede: 'When time becomes the thing you are managing instead of the work.',
    minutes: 3,
    blocks: [
      { t: 'p', v: 'It rarely arrives as a crisis. There is no morning where you decide you are done. What happens instead is that interest drains out slowly, and one day you notice you are managing hours rather than doing work. Not dread exactly. More like absence.' },
      { t: 'p', v: 'Most people call this burnout and try to fix it with rest. Sometimes that is right. Often the rest works for a week and then the clock comes back, which is the sign it was never about tiredness.' },

      { t: 'h', v: 'Two things that look identical' },
      { t: 'p', v: 'Burnout is depletion. You still care, you simply have nothing left to spend, and genuine recovery restores it. Doneness is different. The tank refills and you still do not want to spend it here. Rest does nothing for doneness because nothing is broken. Something has ended.' },
      { t: 'p', v: 'They feel the same from inside, which is why people spend years applying the wrong remedy. The way to tell them apart is not how tired you are. It is what happens on the good days.' },

      { t: 'quote', v: 'If a great week here still leaves you counting hours, it was never rest you needed.' },

      { t: 'h', v: 'Tells worth watching' },
      { t: 'list', v: [
        'You check the time more often than you check the work.',
        'Finishing something produces relief rather than satisfaction.',
        'You are protective of your evenings in a way you never used to be.',
        'On holiday you feel fine within two days, and the dread returns the night before you go back.',
      ] },

      { t: 'h', v: 'How to break it' },
      { t: 'p', v: 'Start with the week it began. Not roughly, actually find it. Almost nobody drifts for no reason, and the specific week usually contains the thing: a reorganisation, a promise not kept, a project you cared about that got quietly shelved, a person who left.' },
      { t: 'p', v: 'Then separate the job from the chapter. Often the work is fine and the chapter is over, which is a far less alarming conclusion than the one people fear when they start asking these questions.' },
      { t: 'note', v: 'Losing interest is information, not failure. It usually arrives long before you are willing to act on it, which is why noticing it early is worth something.' },
    ],
  },
}
