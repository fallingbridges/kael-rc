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
  feedback: {
    read: '3 min',
    blocks: [
      { h: 'Why it happens' },
      { p: 'Criticism arrives as information about one moment. It gets filed as evidence about who you are. That filing error is what makes it repeat, because the mind does not rehearse facts, it rehearses threats to identity.' },
      { p: 'A note about one deck becomes a verdict about your competence. The verdict is the part that will not close, so it replays looking for a ruling it never gets.' },
      { h: 'What it looks like' },
      { p: 'You can recite the sentence weeks later, word for word, but not the three useful things said around it. You defend it in the shower. You are not solving anything, you are appealing.' },
      { h: 'The move' },
      { p: 'Before you respond, split it in two. Write down the one thing in there you could actually use. Then write down the part that only stung. The first is work. The second is not information, and it does not need answering.' },
      { q: 'Feedback about a moment is not a verdict about a person.' },
    ],
  },

  speak: {
    read: '3 min',
    blocks: [
      { h: 'Why it happens' },
      { p: 'You are waiting to feel ready, and readiness is not something that arrives before an action. It is built by the action. Confidence is a memory of having done it, so it cannot exist the first time.' },
      { p: 'Waiting for it inverts the order. You end up rehearsing instead of speaking, and every rehearsal raises the bar for what the first sentence has to be.' },
      { h: 'What it looks like' },
      { p: 'The meeting ends. You had the thought at minute four and said nothing for forty. Then someone says a rougher version of it and the room takes it fine.' },
      { h: 'The move' },
      { p: 'Lower what the first sentence has to do. It does not have to be a finished argument. Something noticing shaped works: I am noticing we keep coming back to this. It opens a door without asking you to walk through it fully formed.' },
      { q: 'You do not speak because you are confident. You are confident because you spoke.' },
    ],
  },

  boundaries: {
    read: '2 min',
    blocks: [
      { h: 'Why it happens' },
      { p: 'Guilt is trained. It fires when you break a rule, and it does not check whether the rule is a good one. If you were raised where being available was the price of being loved, then declining will fire guilt even when declining is right.' },
      { p: 'So guilt is not a moral signal. It is a familiarity signal. It tells you that you have left a pattern, not that you have done harm.' },
      { h: 'What it looks like' },
      { p: 'You say no, and it is the correct no, and you spend the evening drafting an explanation nobody asked for.' },
      { h: 'The move' },
      { p: 'When the guilt lands, ask one question: who is hurt here. If you can name a real cost to a real person, take it seriously. If you cannot, what you are feeling is the newness, and it fades with repetition rather than with justification.' },
      { q: 'Guilt tells you something is unfamiliar. It does not tell you it is wrong.' },
    ],
  },

  'hard-talk': {
    read: '3 min',
    blocks: [
      { h: 'Why it happens' },
      { p: 'People do not defend against criticism. They defend against the threat underneath it, which is usually that the relationship is being withdrawn. Once that alarm goes off, nothing you say afterwards gets processed properly.' },
      { p: 'This is why the same sentence can land as feedback with one person and as an ending with another. The content did not change. The safety did.' },
      { h: 'What it looks like' },
      { p: 'You open carefully and they go cold or loud within a sentence, and afterwards you cannot work out which word did it. It was probably not a word. It was the frame.' },
      { h: 'The move' },
      { p: 'Say what you are protecting before you say what is wrong. I care about this, which is why I would rather be honest than let it turn into resentment. That is not softening. It is telling them the ground is not moving so they can hear the rest.' },
      { q: 'People can hear hard things once they know they are not being left.' },
    ],
  },

  burnout: {
    read: '3 min',
    blocks: [
      { h: 'Why it happens' },
      { p: 'Rest restores capacity. It does not change demand. If the demand you return to is the thing that emptied you, rest is a slower drain, not a fix.' },
      { p: 'Most burnout is not a shortage of sleep. It is a mismatch that a holiday cannot touch, because the holiday ends and the mismatch is still there waiting, unchanged and slightly annoyed.' },
      { h: 'What it looks like' },
      { p: 'You take the week off. Day three feels human. The Sunday before you go back, the tiredness arrives early, before any work has happened. That is the tell.' },
      { h: 'The move' },
      { p: 'Do not ask what would help you recover. Ask what would still be waiting for you after a perfect week off. Name that one thing. It is the actual problem, and it is usually smaller and more specific than the fog suggests.' },
      { q: 'If rest is not working, the load is the problem, not your stamina.' },
    ],
  },

  'self-talk': {
    read: '3 min',
    blocks: [
      { h: 'Why it happens' },
      { p: 'Nobody invents their inner voice. It is assembled from what got said to you, usually early, usually by someone whose approval you needed. You kept the recording because at the time it was cheaper to agree than to be in conflict with them.' },
      { p: 'Which is why it does not sound like cruelty from the inside. It sounds like accuracy. Familiar and true are very easy to confuse.' },
      { h: 'What it looks like' },
      { p: 'You would never speak to a friend that way. Not close. You would find it shocking. But directed at yourself it registers as simply the facts.' },
      { h: 'The move' },
      { p: 'Next time it starts, try to hear it out loud. Whose cadence is that. Whose words. Most people can answer in under a second, and the answer changes the status of the sentence from truth to quotation.' },
      { q: 'That voice was installed. It is not a report from reality.' },
    ],
  },

  comparison: {
    read: '2 min',
    blocks: [
      { h: 'Why it happens' },
      { p: 'You have full access to your own doubt and none to anyone else’s. So the comparison is never like for like. It is your unedited interior against their finished exterior, and that gap will always favour them.' },
      { p: 'Then the gap gets read as a verdict on effort rather than as an artefact of the viewing angle.' },
      { h: 'What it looks like' },
      { p: 'Ask someone who feels behind who exactly is ahead of them and they usually cannot say. It is not a person. It is a composite made of everyone’s best day.' },
      { h: 'The move' },
      { p: 'Name the person. An actual one. If you cannot, you are not behind anyone, you are behind an average that no single human being is actually living.' },
      { q: 'You are comparing your inside to an edit.' },
    ],
  },

  anger: {
    read: '2 min',
    blocks: [
      { h: 'Why it happens' },
      { p: 'Anger is fast and it is protective. It shows up after something more exposed has already been felt and dismissed: hurt, fear, embarrassment, being unimportant. Anger is what covers those, because anger has power in it and they do not.' },
      { p: 'The speed is what hides it. The softer feeling is often there for less than a second before the heat replaces it.' },
      { h: 'What it looks like' },
      { p: 'The size of the reaction does not match the size of the event, and you know it while it is happening. Afterwards you can name what you were angry at but not what you were angry about.' },
      { h: 'The move' },
      { p: 'Go back to the half second before. Not the incident, the instant. Something was there first. Naming it usually drops the temperature on its own, because the anger was doing a job that no longer needs doing.' },
      { q: 'Anger is the second feeling. Something quieter got there first.' },
    ],
  },

  decision: {
    read: '3 min',
    blocks: [
      { h: 'Why it happens' },
      { p: 'Real indecision is rare. What is common is a choice where both options require giving something up, and neither loss has been said out loud. So the mind circles, looking for the version with no cost, which does not exist.' },
      { p: 'The circling feels like gathering information. It is not. You have the information. You are avoiding the invoice.' },
      { h: 'What it looks like' },
      { p: 'You can argue either side fluently. You have argued both, several times, sometimes within one evening. New facts do not move you, which is the giveaway that facts were never the blocker.' },
      { h: 'The move' },
      { p: 'Stop listing pros. Write the two sentences that begin: if I choose this, I am giving up. Once both losses are visible, most people find they already know which one they can carry.' },
      { q: 'You are not stuck between options. You are stuck between two costs you have not named.' },
    ],
  },

  rest: {
    read: '2 min',
    blocks: [
      { h: 'Why it happens' },
      { p: 'If rest has to be earned, it becomes a payment against a debt, and the debt has no ceiling. There is always more that could have been done, so the balance never clears and rest never fully arrives.' },
      { p: 'People learn this young, usually somewhere that praised output and went quiet otherwise. The lesson was not that work matters. It was that stopping needs a receipt.' },
      { h: 'What it looks like' },
      { p: 'You sit down and immediately feel behind. Rest happens with one eye open, so it does not restore much, which seems to prove you had not earned it yet.' },
      { h: 'The move' },
      { p: 'Take twenty minutes without producing a reason. Not as a reward, not after finishing. The point is not the twenty minutes, it is disproving the rule that says they have to be bought.' },
      { q: 'Rest is maintenance. It was never wages.' },
    ],
  },

  control: {
    read: '3 min',
    blocks: [
      { h: 'Why it happens' },
      { p: 'Rehearsing a conversation looks like preparation. Mostly it is an attempt to control the other person’s response by finding the exact wording that makes a bad reaction impossible. There is no such wording, so the search does not terminate.' },
      { p: 'The mind treats it as an unsolved problem and keeps reopening the file, which is why it turns up at two in the morning.' },
      { h: 'What it looks like' },
      { p: 'You script their replies too. You have played nine versions. In the ones you rehearse most, they respond badly, which means you are not planning, you are bracing.' },
      { h: 'The move' },
      { p: 'Decide the first sentence only, and let the rest be unscripted. It hands their half back to them, which is where it always was, and the loop loses its job.' },
      { q: 'You are not preparing. You are trying to author someone else’s answer.' },
    ],
  },

  known: {
    read: '2 min',
    blocks: [
      { h: 'Why it happens' },
      { p: 'Being surrounded is a fact about proximity. Being known is a fact about disclosure. They are unrelated, and one does not produce the other over time no matter how long you wait.' },
      { p: 'The gap usually persists because being easy to be around gets rewarded quickly, and being known does not. So the easy version stays on, and it works, and it is lonely.' },
      { h: 'What it looks like' },
      { p: 'Plenty of people would call you a friend. None of them could say what has actually been hard for you this year, because nobody has been told.' },
      { h: 'The move' },
      { p: 'Pick the person who almost knows. Tell them one true thing that is slightly more than you would normally give. Not the whole of it. One notch past comfortable is enough to move the relationship.' },
      { q: 'Nobody can know something you have not said.' },
    ],
  },

  change: {
    read: '2 min',
    blocks: [
      { h: 'Why it happens' },
      { p: 'Wanting arrives after leaving, not before it. You lose interest in the old shape first, and the new one takes a while to show up, so there is a stretch with nothing in either hand.' },
      { p: 'That stretch gets misread as being lost. It is not a failure of direction, it is the ordinary gap between outgrowing and arriving.' },
      { h: 'What it looks like' },
      { p: 'You cannot say what you want, but you can say precisely what you no longer want, and with some heat. That asymmetry is the whole diagnosis.' },
      { h: 'The move' },
      { p: 'Stop interrogating the future and inventory the past year instead. What have you quietly stopped caring about. That list is real data, and it points somewhere, which is more than the question what do I want has managed.' },
      { q: 'Not knowing yet is a stage. It is not a flaw in you.' },
    ],
  },

  grief: {
    read: '3 min',
    blocks: [
      { h: 'Why it happens' },
      { p: 'Grief is not a quantity that reduces. It is the size of what mattered, and that does not shrink because time passed. What changes is the amount of life around it.' },
      { p: 'This is why the timeline advice fails. People wait to feel less, and less is not the mechanism. More is.' },
      { h: 'What it looks like' },
      { p: 'Most days are workable, and then something small and unrelated puts you straight back at full volume. Nothing regressed. The grief was always that size, you were simply somewhere else in the room.' },
      { h: 'The move' },
      { p: 'Stop measuring recovery by how little you feel. Measure it by how much else is in the week. Adding is available to you. Subtracting was never going to be.' },
      { q: 'It does not get smaller. Your life gets bigger around it.' },
    ],
  },

  perfectionism: {
    read: '3 min',
    blocks: [
      { h: 'Why it happens' },
      { p: 'High standards are about the work. Perfectionism is about you. The tell is what happens when something comes out merely good: standards are satisfied, perfectionism is not, because the thing being protected was never the quality.' },
      { p: 'What it protects against is being seen getting it wrong in front of someone. So the work stays unfinished, because unfinished cannot be judged.' },
      { h: 'What it looks like' },
      { p: 'You have things sitting at ninety percent that have been at ninety percent for months. The last ten percent is not work. It is exposure.' },
      { h: 'The move' },
      { p: 'Ship one thing at eighty and watch what actually happens. Not as a discipline exercise, as evidence. The fear is making a prediction, and it has never once been tested.' },
      { q: 'Perfectionism is not high standards. It is a fear of being seen.' },
    ],
  },

  regret: {
    read: '2 min',
    blocks: [
      { h: 'Why it happens' },
      { p: 'Hindsight hands you information you did not have, then invites you to judge a decision made without it. That is not reflection, it is a rigged trial.' },
      { p: 'The version of you who chose was working with less, and was doing something reasonable with what they had.' },
      { h: 'What it looks like' },
      { p: 'You can describe exactly what you should have done. You cannot describe how you were supposed to have known it at the time.' },
      { h: 'The move' },
      { p: 'Write down what you actually knew on the day. Only that. Most regret does not survive contact with the real list.' },
      { q: 'You are judging a decision by information it never had.' },
    ],
  },

  procrastination: {
    read: '3 min',
    blocks: [
      { h: 'Why it happens' },
      { p: 'Avoidance is almost never about effort. It is about a feeling the task will produce: being judged, being found out, being bored, being stuck. The mind avoids the feeling, and the task comes along with it.' },
      { p: 'Which is why the task is often small and the resistance is enormous. Size was never the variable.' },
      { h: 'What it looks like' },
      { p: 'You do four harder things instead. Cleaning, admin, a difficult email. You are not lazy, you are busy avoiding one specific thing.' },
      { h: 'The move' },
      { p: 'Catch what you feel in the second before you switch away, and name it. The task usually shrinks the moment the feeling has a name, because it was doing the work of two problems.' },
      { q: 'You are not avoiding the work. You are avoiding what the work makes you feel.' },
    ],
  },

  apology: {
    read: '2 min',
    blocks: [
      { h: 'Why it happens' },
      { p: 'An apology is a transfer. You take the weight off them and carry it yourself. Anything that puts weight back, a reason, an explanation, a but, cancels the transfer.' },
      { p: 'So a because is not context. It is a request to be forgiven and to be right at the same time, and people hear the second half.' },
      { h: 'What it looks like' },
      { p: 'I am sorry you felt that way. I am sorry, but I was under a lot of pressure. Both are defences wearing an apology as a coat.' },
      { h: 'The move' },
      { p: 'Say what you did, say what it cost them, and then stop talking. If a reason genuinely matters, it can come later and separately, once the apology has stood on its own.' },
      { q: 'An apology with a because in it is a defence.' },
    ],
  },

  envy: {
    read: '2 min',
    blocks: [
      { h: 'Why it happens' },
      { p: 'Envy is uncomfortable because it is honest. It fires at what you actually want, before your good reasons for not wanting it can get there first.' },
      { p: 'That is why it embarrasses people. It leaks the want, and the want was supposed to stay private even from you.' },
      { h: 'What it looks like' },
      { p: 'It is specific. You are not envious of everything about them, you are envious of one thing, and you could name it immediately if you let yourself.' },
      { h: 'The move' },
      { p: 'Ask what you would take if you could take exactly one thing. That answer is information about your own life. It is not a character flaw and it does not need to be confessed to anyone.' },
      { q: 'Envy is a map. It points at something you have not admitted to wanting.' },
    ],
  },

  drift: {
    read: '2 min',
    blocks: [
      { h: 'Why it happens' },
      { p: 'Most friendships do not end in a decision. They end in an absence of small maintenance, and then in embarrassment about the size of the gap.' },
      { p: 'The gap starts to feel like evidence that it is over. On the other side it usually feels exactly the same, which is why nobody moves.' },
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
