/* ──────────────────────────────────────────────────────────────────────────
   Kael — the lessons behind the deck.

   An idea card names something and stops. A lesson is what arrives when
   someone asks for more, and it has to earn the tap: mechanism first, then
   recognition, then one move small enough to do today.

   The shape is fixed on purpose. A generated essay with no skeleton is
   where quality variance shows, and every lesson here has the same four
   beats so none of them can wander.

   Blocks: { h } heading · { p } paragraph · { q } the line to remember.

   This is the local generator. It satisfies the same contract a model
   route would, so the screen is reviewable with no key and identical with
   one: an array of blocks, streamed a word at a time.
   ────────────────────────────────────────────────────────────────────────── */

export const LESSONS = {
  'feedback': {
    read: '3 min',
    quiz: {
      q: 'Someone says your deck was hard to follow. Which part is worth keeping?',
      options: [
        { label: 'The bit about the structure', reply: 'Right. That is the data. It is boring and useful, which is the point.' },
        { label: 'The fact that they said it publicly', reply: 'That is the sting. Real, but there is nothing in it you can use tomorrow.' },
        { label: 'Both, honestly', reply: 'Understandable, but keeping both is what makes it replay. One of them has no next action attached.' },
      ],
    },
    blocks: [
      { h: 'Why it happens' },
      { p: 'Criticism arrives as information about one moment. It gets filed as evidence about who you are. That filing error is what makes it repeat, because the mind does not rehearse facts, it rehearses threats to identity.' },
      { p: 'A note about one deck becomes a verdict about your competence. The verdict is the part that will not close, so it replays looking for a ruling it never gets.' },
      { sciLabel: 'Negativity bias', sci: 'The brain weights threatening information far heavier than neutral information, and anything touching identity counts as threatening. That is why the useful ninety percent of a review evaporates and the one barbed clause survives a month intact.' },
      { h: 'What it looks like' },
      { p: 'You can recite the sentence weeks later, word for word, but not the three useful things said around it. You defend it in the shower. You are not solving anything, you are appealing.' },
      { h: 'The move' },
      { p: 'Before you respond, split it in two. Write down the one thing in there you could actually use. Then write down the part that only stung. The first is work. The second is not information, and it does not need answering.' },
      { q: 'Feedback about a moment is not a verdict about a person.' },
    ],
  },

  'speak': {
    read: '3 min',
    quiz: {
      q: 'You have a half-formed thought in a meeting. What is the lowest-cost way in?',
      options: [
        { label: 'Wait until it is fully formed', reply: 'That is the trap. It never finishes forming while you are holding it.' },
        { label: 'Say what you are noticing', reply: 'Yes. Noticing costs nothing to be wrong about, which is why it is the cheapest door.' },
        { label: 'Send it after in a message', reply: 'Safer, and it also removes the only thing that would have built the confidence.' },
      ],
    },
    blocks: [
      { h: 'Why it happens' },
      { p: 'You are waiting to feel ready, and readiness is not something that arrives before an action. It is built by the action. Confidence is a memory of having done it, so it cannot exist the first time.' },
      { p: 'Waiting for it inverts the order. You end up rehearsing instead of speaking, and every rehearsal raises the bar for what the first sentence has to be.' },
      { sciLabel: 'Self-efficacy', sci: 'Bandura found confidence is built almost entirely from mastery experiences, meaning the memory of having done the thing. Encouragement barely moves it. Which is why waiting to feel ready cannot work: the only source of the feeling is the act you are postponing.' },
      { h: 'What it looks like' },
      { p: 'The meeting ends. You had the thought at minute four and said nothing for forty. Then someone says a rougher version of it and the room takes it fine.' },
      { h: 'The move' },
      { p: 'Lower what the first sentence has to do. It does not have to be a finished argument. Something noticing shaped works: I am noticing we keep coming back to this. It opens a door without asking you to walk through it fully formed.' },
      { q: 'You do not speak because you are confident. You are confident because you spoke.' },
    ],
  },

  'boundaries': {
    read: '3 min',
    quiz: {
      q: 'You said no and feel awful. What is the one question to ask?',
      options: [
        { label: 'Was I too harsh?', reply: 'That is the guilt asking the guilt. It will always say yes.' },
        { label: 'Who is actually hurt here?', reply: 'That is the one. If you cannot name a person and a cost, it was unfamiliarity, not harm.' },
        { label: 'Should I explain more?', reply: 'Explaining more is usually the guilt negotiating.' },
      ],
    },
    blocks: [
      { h: 'Why it happens' },
      { p: 'Guilt is trained. It fires when you break a rule, and it does not check whether the rule is a good one. If you were raised where being available was the price of being loved, then declining will fire guilt even when declining is right.' },
      { p: 'So guilt is not a moral signal. It is a familiarity signal. It tells you that you have left a pattern, not that you have done harm.' },
      { sciLabel: 'Operant conditioning', sci: 'Guilt is a learned response to rule-breaking, and the rule does not have to be a good one to have been learned. The signal fires on familiarity, not on ethics.' },
      { h: 'What it looks like' },
      { p: 'You say no, and it is the correct no, and you spend the evening drafting an explanation nobody asked for.' },
      { h: 'The move' },
      { p: 'When the guilt lands, ask one question: who is hurt here. If you can name a real cost to a real person, take it seriously. If you cannot, what you are feeling is the newness, and it fades with repetition rather than with justification.' },
      { q: 'Guilt tells you something is unfamiliar. It does not tell you it is wrong.' },
    ],
  },

  'hard-talk': {
    read: '3 min',
    quiz: {
      q: 'Before the hard part, what do you say first?',
      options: [
        { label: 'Get straight to the issue', reply: 'Efficient, and it fires the alarm before they can hear you.' },
        { label: 'Say what you are protecting', reply: 'Yes. Naming the bond first is what keeps the rest audible.' },
        { label: 'Soften it with a compliment', reply: 'That is a sandwich, and people hear the middle coming.' },
      ],
    },
    blocks: [
      { h: 'Why it happens' },
      { p: 'People do not defend against criticism. They defend against the threat underneath it, which is usually that the relationship is being withdrawn. Once that alarm goes off, nothing you say afterwards gets processed properly.' },
      { p: 'This is why the same sentence can land as feedback with one person and as an ending with another. The content did not change. The safety did.' },
      { sciLabel: 'Attachment threat', sci: 'Gottman found what makes a conversation escalate is rarely the content. It is whether the listener reads it as a threat to the bond. Once that alarm fires, comprehension drops for the rest of the exchange.' },
      { h: 'What it looks like' },
      { p: 'You open carefully and they go cold or loud within a sentence, and afterwards you cannot work out which word did it. It was probably not a word. It was the frame.' },
      { h: 'The move' },
      { p: 'Say what you are protecting before you say what is wrong. I care about this, which is why I would rather be honest than let it turn into resentment. That is not softening. It is telling them the ground is not moving so they can hear the rest.' },
      { q: 'People can hear hard things once they know they are not being left.' },
    ],
  },

  'burnout': {
    read: '3 min',
    quiz: {
      q: 'A perfect week off ends. What tells you the load has not changed?',
      options: [
        { label: 'You feel rested', reply: 'That is capacity returning, which is real but temporary.' },
        { label: 'The tiredness arrives on Sunday night', reply: 'That is the tell. It shows up before any work does, so the work is not what caused it.' },
        { label: 'You dread Monday morning', reply: 'Close, but Sunday is earlier and more diagnostic.' },
      ],
    },
    blocks: [
      { h: 'Why it happens' },
      { p: 'Rest restores capacity. It does not change demand. If the demand you return to is the thing that emptied you, rest is a slower drain, not a fix.' },
      { p: 'Most burnout is not a shortage of sleep. It is a mismatch that a holiday cannot touch, because the holiday ends and the mismatch is still there waiting, unchanged and slightly annoyed.' },
      { sciLabel: 'Job-person mismatch', sci: 'Maslach spent thirty years showing burnout is not caused by hours. It is caused by a mismatch between the person and the work, chiefly around control and fairness. Rest addresses none of it.' },
      { h: 'What it looks like' },
      { p: 'You take the week off. Day three feels human. The Sunday before you go back, the tiredness arrives early, before any work has happened. That is the tell.' },
      { h: 'The move' },
      { p: 'Do not ask what would help you recover. Ask what would still be waiting for you after a perfect week off. Name that one thing. It is the actual problem, and it is usually smaller and more specific than the fog suggests.' },
      { q: 'If rest is not working, the load is the problem, not your stamina.' },
    ],
  },

  'self-talk': {
    read: '3 min',
    quiz: {
      q: 'The voice starts. What actually changes its status?',
      options: [
        { label: 'Arguing with it', reply: 'It is better at that argument than you are, because it has been having it longer.' },
        { label: 'Noticing whose cadence it is', reply: 'Yes. The moment it becomes a quotation it stops being a report.' },
        { label: 'Replacing it with something positive', reply: 'Affirmation without attribution tends to bounce off.' },
      ],
    },
    blocks: [
      { h: 'Why it happens' },
      { p: 'Nobody invents their inner voice. It is assembled from what got said to you, usually early, usually by someone whose approval you needed. You kept the recording because at the time it was cheaper to agree than to be in conflict with them.' },
      { p: 'Which is why it does not sound like cruelty from the inside. It sounds like accuracy. Familiar and true are very easy to confuse.' },
      { sciLabel: 'Introjection', sci: 'The inner critic is assembled from actual voices, usually early, usually someone whose approval mattered. It reads as truth partly because the mind rates familiar statements as more likely to be true.' },
      { h: 'What it looks like' },
      { p: 'You would never speak to a friend that way. Not close. You would find it shocking. But directed at yourself it registers as simply the facts.' },
      { h: 'The move' },
      { p: 'Next time it starts, try to hear it out loud. Whose cadence is that. Whose words. Most people can answer in under a second, and the answer changes the status of the sentence from truth to quotation.' },
      { q: 'That voice was installed. It is not a report from reality.' },
    ],
  },

  'comparison': {
    read: '3 min',
    quiz: {
      q: 'You feel behind. What is the single most useful question?',
      options: [
        { label: 'Behind by how much?', reply: 'That accepts the premise and starts measuring.' },
        { label: 'Who exactly is ahead of me?', reply: 'That one. If you cannot name a person, there is no race to be behind in.' },
        { label: 'What do I need to do to catch up?', reply: 'Reasonable, and it is answering a question that has not been checked yet.' },
      ],
    },
    blocks: [
      { h: 'Why it happens' },
      { p: 'You have full access to your own doubt and none to anyone else’s. So the comparison is never like for like. It is your unedited interior against their finished exterior, and that gap will always favour them.' },
      { p: 'Then the gap gets read as a verdict on effort rather than as an artefact of the viewing angle.' },
      { sciLabel: 'Social comparison theory', sci: 'Festinger showed we evaluate ourselves against others whenever objective measures are missing. Upward comparison against curated exteriors reliably lowers self-assessment, and feeds have made the curated exterior the default input.' },
      { h: 'What it looks like' },
      { p: 'Ask someone who feels behind who exactly is ahead of them and they usually cannot say. It is not a person. It is a composite made of everyone’s best day.' },
      { h: 'The move' },
      { p: 'Name the person. An actual one. If you cannot, you are not behind anyone, you are behind an average that no single human being is actually living.' },
      { q: 'You are comparing your inside to an edit.' },
    ],
  },

  'anger': {
    read: '3 min',
    quiz: {
      q: 'The reaction was bigger than the event. Where do you look?',
      options: [
        { label: 'At the event', reply: 'The event is the trigger, not the cause. It rarely explains the size.' },
        { label: 'At the half second before', reply: 'Yes. Something quieter got there first, and it is usually the real one.' },
        { label: 'At how tired you were', reply: 'Often a factor, and it amplifies rather than explains.' },
      ],
    },
    blocks: [
      { h: 'Why it happens' },
      { p: 'Anger is fast and it is protective. It shows up after something more exposed has already been felt and dismissed: hurt, fear, embarrassment, being unimportant. Anger is what covers those, because anger has power in it and they do not.' },
      { p: 'The speed is what hides it. The softer feeling is often there for less than a second before the heat replaces it.' },
      { sciLabel: 'Secondary emotion', sci: 'Appraisal research puts the primary response a fraction of a second before anger arrives. Anger recruits energy and reduces the sense of vulnerability, which is exactly why it is the one that reaches consciousness.' },
      { h: 'What it looks like' },
      { p: 'The size of the reaction does not match the size of the event, and you know it while it is happening. Afterwards you can name what you were angry at but not what you were angry about.' },
      { h: 'The move' },
      { p: 'Go back to the half second before. Not the incident, the instant. Something was there first. Naming it usually drops the temperature on its own, because the anger was doing a job that no longer needs doing.' },
      { q: 'Anger is the second feeling. Something quieter got there first.' },
    ],
  },

  'decision': {
    read: '3 min',
    quiz: {
      q: 'You have all the facts and still cannot choose. What is missing?',
      options: [
        { label: 'More information', reply: 'New facts stop moving you at this point, which is the giveaway.' },
        { label: 'The two losses, named', reply: 'That. You are not between options, you are between costs you have not said out loud.' },
        { label: 'More time', reply: 'Time without naming the losses produces the same stall, later.' },
      ],
    },
    blocks: [
      { h: 'Why it happens' },
      { p: 'Real indecision is rare. What is common is a choice where both options require giving something up, and neither loss has been said out loud. So the mind circles, looking for the version with no cost, which does not exist.' },
      { p: 'The circling feels like gathering information. It is not. You have the information. You are avoiding the invoice.' },
      { sciLabel: 'Loss aversion', sci: 'Kahneman and Tversky showed losses feel about twice as heavy as equivalent gains. When both options contain a loss the mind stalls rather than choosing, and it experiences the stall as needing more information.' },
      { h: 'What it looks like' },
      { p: 'You can argue either side fluently. You have argued both, several times, sometimes within one evening. New facts do not move you, which is the giveaway that facts were never the blocker.' },
      { h: 'The move' },
      { p: 'Stop listing pros. Write the two sentences that begin: if I choose this, I am giving up. Once both losses are visible, most people find they already know which one they can carry.' },
      { q: 'You are not stuck between options. You are stuck between two costs you have not named.' },
    ],
  },

  'rest': {
    read: '3 min',
    quiz: {
      q: 'You sit down and immediately feel behind. What is that?',
      options: [
        { label: 'A signal you have not done enough', reply: 'That is the rule talking, and the rule has no ceiling.' },
        { label: 'A learned rule about earning rest', reply: 'Yes. It is conditioning, not measurement.' },
        { label: 'Proof you should be working', reply: 'If it were proof, it would eventually be satisfied. It never is.' },
      ],
    },
    blocks: [
      { h: 'Why it happens' },
      { p: 'If rest has to be earned, it becomes a payment against a debt, and the debt has no ceiling. There is always more that could have been done, so the balance never clears and rest never fully arrives.' },
      { p: 'People learn this young, usually somewhere that praised output and went quiet otherwise. The lesson was not that work matters. It was that stopping needs a receipt.' },
      { sciLabel: 'Effort justification', sci: 'People assign more value to outcomes they suffered for, which quietly teaches that unearned rest is worth less. It is a conditioned rule, not a fact about recovery, and physiology does not care whether you deserved it.' },
      { h: 'What it looks like' },
      { p: 'You sit down and immediately feel behind. Rest happens with one eye open, so it does not restore much, which seems to prove you had not earned it yet.' },
      { h: 'The move' },
      { p: 'Take twenty minutes without producing a reason. Not as a reward, not after finishing. The point is not the twenty minutes, it is disproving the rule that says they have to be bought.' },
      { q: 'Rest is maintenance. It was never wages.' },
    ],
  },

  'control': {
    read: '3 min',
    quiz: {
      q: 'You are rehearsing a conversation again. What are you actually doing?',
      options: [
        { label: 'Preparing properly', reply: 'It feels like preparation, which is exactly why it persists.' },
        { label: 'Trying to control their answer', reply: 'Yes. And their half was never yours, which is why the search does not end.' },
        { label: 'Processing the anxiety', reply: 'Sometimes, but rehearsal usually raises it rather than lowers it.' },
      ],
    },
    blocks: [
      { h: 'Why it happens' },
      { p: 'Rehearsing a conversation looks like preparation. Mostly it is an attempt to control the other person’s response by finding the exact wording that makes a bad reaction impossible. There is no such wording, so the search does not terminate.' },
      { p: 'The mind treats it as an unsolved problem and keeps reopening the file, which is why it turns up at two in the morning.' },
      { sciLabel: 'Intolerance of uncertainty', sci: 'Rumination is failed problem-solving: the mind keeps reopening a file it cannot close because the missing piece belongs to someone else. Borkovec found worry persists precisely because it feels like preparation.' },
      { h: 'What it looks like' },
      { p: 'You script their replies too. You have played nine versions. In the ones you rehearse most, they respond badly, which means you are not planning, you are bracing.' },
      { h: 'The move' },
      { p: 'Decide the first sentence only, and let the rest be unscripted. It hands their half back to them, which is where it always was, and the loop loses its job.' },
      { q: 'You are not preparing. You are trying to author someone else’s answer.' },
    ],
  },

  'known': {
    read: '3 min',
    quiz: {
      q: 'You feel unknown despite good friends. What is the missing ingredient?',
      options: [
        { label: 'More time together', reply: 'Proximity is already there. It is not the variable.' },
        { label: 'Something told that was not told before', reply: 'Yes. Closeness is built by disclosure, one notch at a time.' },
        { label: 'Deeper friends', reply: 'Possibly, but the same pattern tends to follow you into the new ones.' },
      ],
    },
    blocks: [
      { h: 'Why it happens' },
      { p: 'Being surrounded is a fact about proximity. Being known is a fact about disclosure. They are unrelated, and one does not produce the other over time no matter how long you wait.' },
      { p: 'The gap usually persists because being easy to be around gets rewarded quickly, and being known does not. So the easy version stays on, and it works, and it is lonely.' },
      { sciLabel: 'Reciprocal self-disclosure', sci: 'Closeness is built through escalating disclosure, one side then the other. Aron showed it can be produced deliberately between strangers in under an hour. Proximity alone does none of it.' },
      { h: 'What it looks like' },
      { p: 'Plenty of people would call you a friend. None of them could say what has actually been hard for you this year, because nobody has been told.' },
      { h: 'The move' },
      { p: 'Pick the person who almost knows. Tell them one true thing that is slightly more than you would normally give. Not the whole of it. One notch past comfortable is enough to move the relationship.' },
      { q: 'Nobody can know something you have not said.' },
    ],
  },

  'change': {
    read: '3 min',
    quiz: {
      q: 'You cannot say what you want but can say what you do not. What is that?',
      options: [
        { label: 'Confusion', reply: 'It looks like it, and it is more specific than that.' },
        { label: 'The normal middle of a transition', reply: 'Yes. You disengage before you arrive, and the gap is the process, not a fault.' },
        { label: 'Avoidance', reply: 'Sometimes, but the asymmetry itself is diagnostic of transition.' },
      ],
    },
    blocks: [
      { h: 'Why it happens' },
      { p: 'Wanting arrives after leaving, not before it. You lose interest in the old shape first, and the new one takes a while to show up, so there is a stretch with nothing in either hand.' },
      { p: 'That stretch gets misread as being lost. It is not a failure of direction, it is the ordinary gap between outgrowing and arriving.' },
      { sciLabel: 'Liminality', sci: 'Ibarra found identity transitions run in the opposite order to the one people expect. You disengage from the old self well before the new one is available, and the gap between is the normal middle rather than a failure.' },
      { h: 'What it looks like' },
      { p: 'You cannot say what you want, but you can say precisely what you no longer want, and with some heat. That asymmetry is the whole diagnosis.' },
      { h: 'The move' },
      { p: 'Stop interrogating the future and inventory the past year instead. What have you quietly stopped caring about. That list is real data, and it points somewhere, which is more than the question what do I want has managed.' },
      { q: 'Not knowing yet is a stage. It is not a flaw in you.' },
    ],
  },

  'grief': {
    read: '3 min',
    quiz: {
      q: 'Months on, it still hits at full volume. What does that mean?',
      options: [
        { label: 'You have regressed', reply: 'Nothing regressed. That reading is what makes it worse.' },
        { label: 'It was always that size', reply: 'Yes. What changes is how much life is around it, not how big it is.' },
        { label: 'You are not processing it', reply: 'Processing does not shrink it. That was never the mechanism.' },
      ],
    },
    blocks: [
      { h: 'Why it happens' },
      { p: 'Grief is not a quantity that reduces. It is the size of what mattered, and that does not shrink because time passed. What changes is the amount of life around it.' },
      { p: 'This is why the timeline advice fails. People wait to feel less, and less is not the mechanism. More is.' },
      { sciLabel: 'Tonkin’s model', sci: 'Asked to draw their grief over time, people expect a shrinking circle. What happens instead is the circle stays the same and the life drawn around it grows. Nothing about the loss reduces. The proportions change.' },
      { h: 'What it looks like' },
      { p: 'Most days are workable, and then something small and unrelated puts you straight back at full volume. Nothing regressed. The grief was always that size, you were simply somewhere else in the room.' },
      { h: 'The move' },
      { p: 'Stop measuring recovery by how little you feel. Measure it by how much else is in the week. Adding is available to you. Subtracting was never going to be.' },
      { q: 'It does not get smaller. Your life gets bigger around it.' },
    ],
  },

  'perfectionism': {
    read: '3 min',
    quiz: {
      q: 'Something is at ninety percent for a month. What is the last ten?',
      options: [
        { label: 'The hardest work', reply: 'Rarely. The hard work usually happened earlier.' },
        { label: 'Exposure', reply: 'Yes. Unfinished cannot be judged, which is what the delay is buying.' },
        { label: 'Perfectionism about details', reply: 'That is the description. Exposure is the reason.' },
      ],
    },
    blocks: [
      { h: 'Why it happens' },
      { p: 'High standards are about the work. Perfectionism is about you. The tell is what happens when something comes out merely good: standards are satisfied, perfectionism is not, because the thing being protected was never the quality.' },
      { p: 'What it protects against is being seen getting it wrong in front of someone. So the work stays unfinished, because unfinished cannot be judged.' },
      { sciLabel: 'Evaluative concern', sci: 'Research splits perfectionism in two. Personal standards are broadly healthy. Evaluative concern, the fear of being judged for falling short, predicts almost all of the harm. The tell is whether finishing feels like relief or like exposure.' },
      { h: 'What it looks like' },
      { p: 'You have things sitting at ninety percent that have been at ninety percent for months. The last ten percent is not work. It is exposure.' },
      { h: 'The move' },
      { p: 'Ship one thing at eighty and watch what actually happens. Not as a discipline exercise, as evidence. The fear is making a prediction, and it has never once been tested.' },
      { q: 'Perfectionism is not high standards. It is a fear of being seen.' },
    ],
  },

  'regret': {
    read: '3 min',
    quiz: {
      q: 'You know exactly what you should have done. What is missing from that?',
      options: [
        { label: 'The courage to have done it', reply: 'That assumes you could have seen it, which is the part being skipped.' },
        { label: 'How you were supposed to know', reply: 'Yes. Hindsight hands you information the decision never had.' },
        { label: 'Better judgment', reply: 'Judgment with different information is a different decision.' },
      ],
    },
    blocks: [
      { h: 'Why it happens' },
      { p: 'Hindsight hands you information you did not have, then invites you to judge a decision made without it. That is not reflection, it is a rigged trial.' },
      { p: 'The version of you who chose was working with less, and was doing something reasonable with what they had.' },
      { sciLabel: 'Hindsight bias', sci: 'Once an outcome is known the mind rewrites how predictable it was. Fischhoff showed people cannot recover their own prior uncertainty even when instructed to try. So regret judges a decision using information the decision never had.' },
      { h: 'What it looks like' },
      { p: 'You can describe exactly what you should have done. You cannot describe how you were supposed to have known it at the time.' },
      { h: 'The move' },
      { p: 'Write down what you actually knew on the day. Only that. Most regret does not survive contact with the real list.' },
      { q: 'You are judging a decision by information it never had.' },
    ],
  },

  'procrastination': {
    read: '3 min',
    quiz: {
      q: 'The task is small and the resistance is huge. What does that tell you?',
      options: [
        { label: 'You need better systems', reply: 'Systems do not touch it, which is why they keep failing on this one task.' },
        { label: 'It is a feeling you are avoiding', reply: 'Yes. Size was never the variable. The feeling is.' },
        { label: 'You are not motivated', reply: 'Motivation would be low across everything, not on one specific item.' },
      ],
    },
    blocks: [
      { h: 'Why it happens' },
      { p: 'Avoidance is almost never about effort. It is about a feeling the task will produce: being judged, being found out, being bored, being stuck. The mind avoids the feeling, and the task comes along with it.' },
      { p: 'Which is why the task is often small and the resistance is enormous. Size was never the variable.' },
      { sciLabel: 'Mood repair', sci: 'Sirois and Pychyl reframed procrastination as emotion regulation rather than time management. You are not avoiding the task, you are avoiding the feeling it produces, and delay works briefly.' },
      { h: 'What it looks like' },
      { p: 'You do four harder things instead. Cleaning, admin, a difficult email. You are not lazy, you are busy avoiding one specific thing.' },
      { h: 'The move' },
      { p: 'Catch what you feel in the second before you switch away, and name it. The task usually shrinks the moment the feeling has a name, because it was doing the work of two problems.' },
      { q: 'You are not avoiding the work. You are avoiding what the work makes you feel.' },
    ],
  },

  'apology': {
    read: '3 min',
    quiz: {
      q: 'Which of these actually transfers the weight?',
      options: [
        { label: 'I am sorry you felt that way', reply: 'That returns it. It apologises for their reaction.' },
        { label: 'I am sorry, I did that and it cost you', reply: 'Yes. Responsibility plus the cost, and then silence.' },
        { label: 'I am sorry but I was under pressure', reply: 'The because cancels the transfer.' },
      ],
    },
    blocks: [
      { h: 'Why it happens' },
      { p: 'An apology is a transfer. You take the weight off them and carry it yourself. Anything that puts weight back, a reason, an explanation, a but, cancels the transfer.' },
      { p: 'So a because is not context. It is a request to be forgiven and to be right at the same time, and people hear the second half.' },
      { sciLabel: 'Non-apology', sci: 'Repair research is unusually clear: the components that work are accepting responsibility and offering repair. A because clause reads as defence, and people detect it faster than they can explain it.' },
      { h: 'What it looks like' },
      { p: 'I am sorry you felt that way. I am sorry, but I was under a lot of pressure. Both are defences wearing an apology as a coat.' },
      { h: 'The move' },
      { p: 'Say what you did, say what it cost them, and then stop talking. If a reason genuinely matters, it can come later and separately, once the apology has stood on its own.' },
      { q: 'An apology with a because in it is a defence.' },
    ],
  },

  'envy': {
    read: '3 min',
    quiz: {
      q: 'Envy arrives about a friend. What is the useful question?',
      options: [
        { label: 'Why am I like this?', reply: 'That is shame arriving on top, and it buries the information.' },
        { label: 'What one thing would I take?', reply: 'Yes. The answer is data about your own life.' },
        { label: 'How do I stop feeling it?', reply: 'Stopping it also discards what it was pointing at.' },
      ],
    },
    blocks: [
      { h: 'Why it happens' },
      { p: 'Envy is uncomfortable because it is honest. It fires at what you actually want, before your good reasons for not wanting it can get there first.' },
      { p: 'That is why it embarrasses people. It leaks the want, and the want was supposed to stay private even from you.' },
      { sciLabel: 'Benign envy', sci: 'Van de Ven distinguishes benign envy, which motivates, from malicious envy, which corrodes. Both point at something wanted. The difference is whether the wanting is admitted or hidden.' },
      { h: 'What it looks like' },
      { p: 'It is specific. You are not envious of everything about them, you are envious of one thing, and you could name it immediately if you let yourself.' },
      { h: 'The move' },
      { p: 'Ask what you would take if you could take exactly one thing. That answer is information about your own life. It is not a character flaw and it does not need to be confessed to anyone.' },
      { q: 'Envy is a map. It points at something you have not admitted to wanting.' },
    ],
  },

  'drift': {
    read: '3 min',
    quiz: {
      q: 'You have not spoken in a year. What stops the message?',
      options: [
        { label: 'They have probably moved on', reply: 'The research says the opposite, consistently and by a wide margin.' },
        { label: 'Not having a good enough reason', reply: 'Yes. The bar you have set is the actual obstacle, and it is invented.' },
        { label: 'It would be awkward', reply: 'Briefly, and far less than predicted.' },
      ],
    },
    blocks: [
      { h: 'Why it happens' },
      { p: 'Most friendships do not end in a decision. They end in an absence of small maintenance, and then in embarrassment about the size of the gap.' },
      { p: 'The gap starts to feel like evidence that it is over. On the other side it usually feels exactly the same, which is why nobody moves.' },
      { sciLabel: 'The liking gap', sci: 'Boothby found people consistently underestimate how much others enjoy hearing from them, and the gap persists for months. Both sides wait, each reading the silence as something it is not.' },
      { h: 'What it looks like' },
      { p: 'You think about them often. You have drafted something. You did not send it because you could not find a message good enough to justify the silence.' },
      { h: 'The move' },
      { p: 'Send the short one. No apology for the gap, no explanation, just that you thought of them. It lands far more often than people expect, because they were doing the same arithmetic.' },
      { q: 'Friendships do not end. They go unwatered.' },
    ],
  },
}

/* the same contract a model route would satisfy: blocks in, blocks out.
   Kept as a function so the call site never has to know which one it got. */
export const generateLesson = (id) => LESSONS[id] || null

/* ── what sits under each lesson ────────────────────────────────────────────
   Three, not six, and every one labelled with how it relates. An unlabelled
   grid teaches people to ignore grids; a labelled one reads as following a
   thought rather than being fed. This is the loop that makes the browsing
   endless, so the relations have to be real. */
export const RELATED = {
  feedback: [['self-talk', 'Goes deeper'], ['comparison', 'The same root'], ['speak', 'What comes next']],
  speak: [['control', 'Goes deeper'], ['hard-talk', 'What comes next'], ['known', 'The same root']],
  boundaries: [['rest', 'The same root'], ['self-talk', 'Goes deeper'], ['known', 'What comes next']],
  'hard-talk': [['anger', 'Goes deeper'], ['speak', 'What comes first'], ['apology', 'What comes next']],
  burnout: [['rest', 'Goes deeper'], ['boundaries', 'The same root'], ['change', 'What comes next']],
  'self-talk': [['comparison', 'The same root'], ['rest', 'Goes deeper'], ['known', 'What comes next']],
  comparison: [['envy', 'Goes deeper'], ['self-talk', 'The same root'], ['change', 'What comes next']],
  anger: [['self-talk', 'Goes deeper'], ['control', 'The same root'], ['hard-talk', 'What comes next']],
  decision: [['regret', 'What comes next'], ['control', 'The same root'], ['change', 'Goes deeper']],
  rest: [['burnout', 'Goes deeper'], ['procrastination', 'The same root'], ['self-talk', 'What comes next']],
  control: [['decision', 'Goes deeper'], ['anger', 'The same root'], ['speak', 'What comes next']],
  known: [['self-talk', 'Goes deeper'], ['comparison', 'The same root'], ['speak', 'What comes next']],
  change: [['grief', 'Goes deeper'], ['comparison', 'The same root'], ['decision', 'What comes next']],
  grief: [['rest', 'Goes deeper'], ['known', 'The same root'], ['change', 'What comes next']],
  perfectionism: [['self-talk', 'Goes deeper'], ['procrastination', 'The same root'], ['speak', 'What comes next']],
  regret: [['decision', 'Goes deeper'], ['control', 'The same root'], ['change', 'What comes next']],
  procrastination: [['perfectionism', 'Goes deeper'], ['rest', 'The same root'], ['decision', 'What comes next']],
  apology: [['hard-talk', 'Goes deeper'], ['anger', 'What comes first'], ['drift', 'What comes next']],
  envy: [['comparison', 'Goes deeper'], ['change', 'The same root'], ['known', 'What comes next']],
  drift: [['known', 'Goes deeper'], ['apology', 'The same root'], ['speak', 'What comes next']],
}
