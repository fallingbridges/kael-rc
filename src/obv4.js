/* ──────────────────────────────────────────────────────────────────────────
   Kael Onboarding V4 — the Love Archetype instrument (final).

   Forced-choice backbone between two goods, one graded slider (Tilt), a
   multi-select texture block, and conditional loss-aversion tiebreaks. The read
   is delivered as 4 chat messages; reveal is its own screen; features are
   visual-first. Trait in the score, situation in the delivery.

   Axes (internal, never shown): Closeness C/F · Attunement A/S ·
   Expression E/R · Tilt G/H. Code order C-A-E-P.
   Spec: ONBOARDING_V4_FINAL.md. Reads: ARCHETYPE_READS.md.
   ────────────────────────────────────────────────────────────────────────── */
import {
  Waves, Flame, Anchor, Plant, Heart, FireSimple, Feather, Key, Sun, Compass,
  Lighthouse, MapTrifold, Bird, Lightning, Shield, Spiral,
  Wind, ArrowsClockwise, Sparkle,
  ChatCircle, ChatCircleText, ChatCircleDots, Quotes, HandHeart, House, Waveform,
  UsersThree, UserFocus, Gift, MagnifyingGlass, Check, Wine, MoonStars,
  PaperPlaneTilt, Mountains, Hourglass, HeartStraight, Handshake, Eye, Smiley,
  Tree, ShieldCheck, ArrowUpRight, Moon, Scales,
  StackSimple, ChartLineUp,
  User, GenderFemale, GenderMale, GenderNonbinary, Minus,
  ChatsCircle, TrendUp, BookOpen, Star, LockKey, Ear,
} from '@phosphor-icons/react'

export const AXES = ['CF', 'AS', 'ER', 'GH']
export const POSITIVE = { CF: 'C', AS: 'A', ER: 'E', GH: 'G' }
const POLE_AXIS = { C: 'CF', F: 'CF', A: 'AS', S: 'AS', E: 'ER', R: 'ER', G: 'GH', H: 'GH' }

/* ── the 16 reads (essence + 4 chat bubbles + 3 attuned features) ── */
export const READS = {
  CSEH: { name: 'The Harbor', glyph: Waves, essence: 'The safe place love comes home to.',
    bubbles: [
      "You love out loud, and you mostly trust it's returned, which is rarer than it sounds. You tend closeness instead of gripping it: the warm text, the thing remembered, the room made easy to come home to.",
      "What scares you is the chill. The second someone goes quiet, you feel weather moving in, and you warm it back before you've even asked whether a storm was coming.",
      "So you smooth. You still the water before it tips. It feels like love, and it is. But the people closest to you don't always know when they've hurt you. You've already tidied it away.",
      "You don't need to be braver. Just say the hard thing while it's still small. Do that, and you get to be met, instead of only keeping the room safe for everyone else.",
    ],
    features: [
      { h: 'One message away', l: "When you catch yourself smoothing it over again, I'll help you say the real thing." },
      { h: 'This was the surface', l: 'The full read goes into what you protect and the one move that changes it.' },
      { h: 'I keep up with you', l: 'Whatever you walked in carrying stays in view as it shifts.' },
    ] },
  CSEG: { name: 'The Kindler', glyph: Flame, essence: "The one who loves you toward what's next.",
    bubbles: [
      "You're all-in and you say so plainly. You don't lie awake wondering if they'll leave, that part you just trust. Your eyes are forward: the next conversation, the next version of this, who you two are becoming.",
      "Your fear is the flatline: the slow slide into pleasant and predictable, a love that stops asking anything of either of you. You'd take a real fight over a comfortable nothing. What you can't stand is the two of you going still.",
      "So when something feels stuck, you push. You're sure it can be more, and you want to work it tonight. But to someone who was happy as things were, your reach can land as a verdict, and they brace for the next thing you'll want changed.",
      "You don't have to stop reaching. Just let some moments stay finished. Right now an easy night reads as a warning. Soon you feel that same quiet as the deep part, and they stop flinching when you bring something up.",
    ],
    features: [
      { h: 'Before you push tonight', l: 'When you want to fix it right now, I\'ll help you say it so it lands as "come closer," not "do better."' },
      { h: "Where you're actually driving", l: "The full read maps what you're chasing when you push, and where staying put would have grown it faster." },
      { h: 'I track the climb', l: "What you're working toward stays in view, so you can see it move instead of fearing it's stalled." },
    ] },
  CSRH: { name: 'The Anchor', glyph: Anchor, essence: 'The one who shows up, every time.',
    bubbles: [
      "You don't announce love, you build it. You show up, you follow through, you're the calm when the room isn't, and you trust the bond enough that checking it never crosses your mind. To you, the doing is the saying.",
      "What wears you out is being asked to keep proving it. The check-ins, the are-we-okay, love turned into a thing to discuss instead of live. To you that questions the one thing you thought was already settled.",
      "So you answer with more doing. More shown up for, more handled, and less said than ever. The cost is quiet: the person closest to you can feel provided for instead of let in, because everything you mean stays true and unspoken.",
      "Try saying the obvious thing out loud, the one too redundant to bother with. Right now they have to translate your steadiness. Say it plainly, and your showing up finally lands as the choosing it always was.",
    ],
    features: [
      { h: 'Say it before you do it', l: "When you'd rather just handle it quietly, I'll help you put the unsaid part into words." },
      { h: 'What your quiet costs', l: "The full read goes into why the people you're surest of feel least told, and the one sentence that fixes it." },
      { h: 'I keep up with you', l: 'Every small thing you finally said out loud stays in view, so you can see the steadiness land.' },
    ] },
  CSRG: { name: 'The Cultivator', glyph: Plant, essence: "The love that's being built while no one's watching.",
    bubbles: [
      "You love by building. You take the thing that matters and grow it slowly, in private, more interested in the change than in being seen to make it. You'd rather hand someone the deeper version than announce you were working on it.",
      "What scares you is shallow. A bond that stays pleasant and never roots, that lives on the surface and calls it enough. You want it to deepen, without the noise of a big talk about deepening it.",
      "So you tend it quietly. You think it through, you adjust, you come back having changed something real, and you assume the care lands without being pointed at. But they can't see the work, so the quiet reads as distance, and they wonder if you've drifted.",
      "You don't have to narrate everything. Just let them catch you mid-tend, the half-finished thought. Right now they're guessing whether you're still in this. Let them see the garden before the harvest, and they grow it with you.",
    ],
    features: [
      { h: 'Before you go quiet on it', l: "When you'd rather retreat and fix it alone, I'll help you say the part out loud first." },
      { h: 'The work they never saw', l: "The full read goes into the care that isn't landing and the one way to make it visible." },
      { h: 'I watch it grow too', l: "The slow build you're tending stays tracked, so the progress isn't only in your head." },
    ] },
  CAEH: { name: 'The Devoted', glyph: Heart, essence: 'The one who keeps asking if the warmth is still there.',
    bubbles: [
      "You love generously and you say so, out loud and often. You read the bond by feel: reply speed, the temperature of a text, the half-second pause before someone answers. When something dips, you close the gap fast.",
      "What scares you is the drift. The slow fade where the warmth thins and no one names it, until one day you're polite strangers who used to be in love. So a quiet hour can start to feel like the fade arriving early.",
      "So you ask. Are we okay, did I do something, are you sure. It comes from love, and the answer is almost always yes. But you make them keep proving a thing that was never in doubt, and a person tires of passing a test they didn't know they were taking.",
      "You don't need to stop caring. Just let one quiet moment stay quiet. Right now calm reads as the warmth slipping, and you reach to top it up. Soon a slow afternoon feels like ground you can rest on, warm without anyone saying so.",
    ],
    features: [
      { h: 'Before you hit send', l: 'When you\'re about to ask "are we okay" again, I\'ll help you read whether it\'s the bond talking or the worry.' },
      { h: 'Why quiet feels like distance', l: 'The full read goes into why a silence reads as the warmth fading, and the move that lets a quiet stretch stay safe.' },
      { h: 'I keep up with you', l: 'Whatever set off the spiral today stays in view, so you can watch the reaching get quieter over time.' },
    ] },
  CAEG: { name: 'The Wildheart', glyph: FireSimple, essence: 'The one who needs love to stay alive.',
    bubbles: [
      "You love at full volume, and you want all of it: the closeness, the intensity, the bigger you that being someone's person unlocks. You feel the relationship's charge in real time, and you say it out loud, because holding it in feels like letting the fire bank down.",
      "What scares you is tame. When it goes peaceful you don't feel safe, you feel the volume dropping, like whatever made this alive is quietly leaving the room. A calm stretch can read as settling for less.",
      "So you stir it up. You start the big conversation, chase the spark, push for more to feel the charge come back. You'd call it passion, and you'd be right. But you can read a settling bond as a dying one and yank the heat back up on someone who'd finally relaxed.",
      "You don't have to keep it roaring to know it's lit. Next time it goes calm, ask whether the charge really left or just got quiet. Right now a peaceful week feels like the end. Soon you feel the depth under it, and stop mistaking steady for over.",
    ],
    features: [
      { h: 'Before you stir it up', l: 'When calm has you itching to start something, I\'ll help you check what the quiet actually means.' },
      { h: 'Why calm feels like the end', l: 'The full read goes into why peace reads as dying to you, and how steady can be the deep part, not the flat part.' },
      { h: 'I track the charge with you', l: 'Every spike and every flat stretch stays in view, so you can tell real fading from just settling.' },
    ] },
  CARH: { name: 'The Peacekeeper', glyph: Feather, essence: 'The one who keeps the calm, and pays for it.',
    bubbles: [
      "You scan the room before anyone speaks, and you fix the small thing before it grows. The mood lands softer, the night stays easy, and most of the time nobody clocks that you did any of it.",
      "What scares you is the snap: the actual break, voices up, the thing said that can't be unsaid. So you catch it early, and the way you catch it is to shrink yourself until the danger passes.",
      "So you go quiet. You swallow the thing that bugged you, you say it's fine, you arrange your day around their mood. The peace is real, but you're keeping a tally they can't see. One day the bill comes due all at once, and to them it lands out of nowhere.",
      "You don't need to keep the peace better. The day something costs you, name the one line it cost, before it joins the tally. Right now you're running a total only you can see. Say it early, and they pay it down with you.",
    ],
    features: [
      { h: "Before you say it's fine", l: "When you're about to swallow it again, I'll help you find the small, sayable version." },
      { h: 'What the ledger holds', l: "The full read counts what you've been absorbing, and the early move that stops the bill from stacking." },
      { h: 'I keep the tally with you', l: 'What you give and swallow stays visible, so it never builds up where only you can see it.' },
    ] },
  CARG: { name: 'The Confidant', glyph: Key, essence: 'The one who has to be sure before letting you in.',
    bubbles: [
      "You let almost no one all the way in, but the few who make it get everything: your whole attention, your inner world, a closeness most people never get handed. You want them near. You just need to be certain first.",
      "What scares you is handing the real you to someone who can't hold it, or being loved for a version of you that isn't the true one. So you test, you wait, you watch how they handle the small things before you trust them with the big ones.",
      "So you keep a proving ground. You go quiet, decide in private whether they've earned it, and only then let them closer. But the proving takes so long that people give up waiting, and you lose ones you'd have chosen, just not yet.",
      "You don't have to be certain first. Let one person past the test before they've finished earning it. Right now trust only comes after proof, so it mostly never comes. Offer one true thing early, and someone finally gets all the way in.",
    ],
    features: [
      { h: 'Before you make them earn it', l: "When you catch yourself testing instead of trusting, I'll help you offer the thing that lets them in." },
      { h: "What you're waiting for", l: "The full read names the proof you're holding out for, and why it rarely arrives in time." },
      { h: 'I keep up with you', l: "Who you've let in, and who's still earning it, stays in view as it changes." },
    ] },
  FSEH: { name: 'The Kindred', glyph: Sun, essence: 'The easy yes that never needed to grip.',
    bubbles: [
      "You love light and warm and entirely yourself, partnered or not. You give affection freely and you don't hover over the bond, because you assume it's fine, and honestly you're usually right. Being close to you feels like nothing is being asked of anyone.",
      "What scares you is being swallowed. A partner who wants all of you all the time, who treats a night alone as a problem to fix, who reads your independence as a sign something's wrong. You can lose a person and recover. Losing yourself inside one, you couldn't.",
      "So when it gets heavy you stay pleasant. You keep it warm and breezy and steer around the friction. The cost is quiet: because you never seem to need them or worry, your person wonders whether you'd even notice if they drifted. Your calm reads as not minding.",
      "You don't need to want less freedom. Just let one person see they specifically matter, out loud. Right now your contentment looks the same whether they're there or gone. Say \"I'd feel it if you went quiet,\" and they know the ease was a choice you made for them.",
    ],
    features: [
      { h: "When you're keeping it light", l: 'Next time you smooth past the real thing to stay easy, I\'ll help you let them in without it costing your space.' },
      { h: 'Why your calm reads as cold', l: 'The full read goes into how your contentment lands on them, and the one way to be needed without being caged.' },
      { h: 'I keep up with you', l: 'However much room you\'re carrying, and whoever you let close to it, I keep it in view.' },
    ] },
  FSEG: { name: 'The Voyager', glyph: Compass, essence: 'Love as the open road you want company on.',
    bubbles: [
      "You love by bringing someone with you. The trip planned, the thing you're learning, the next version of your life, you want them in it, side by side and both getting bigger. You don't cling and you don't check, you just point forward and assume they're game.",
      "What scares you is the shrink. A love that quietly trades the wide world for a smaller one, where the calendar fills with \"us\" and the horizon goes from the window. Tied down lands in your body before it reaches words.",
      "So when something's off, you grow past it. You add a plan, a trip, a project, keep the two of you moving. But the one who wanted to be still with you starts running to keep up, and wonders if they're the point or just one more thing in a full life.",
      "Try staying when the instinct says go. Let one quiet evening be the whole plan. Right now they're chasing you to feel chosen. Choose to be still with them, and they stop wondering whether they're a destination or a stop.",
    ],
    features: [
      { h: 'Before you add a plan', l: 'When the fix is another trip or project, I\'ll help you find the words to actually stay.' },
      { h: 'Are you outpacing them', l: 'The full read maps where your momentum lands as love and where it lands as a race they can\'t win.' },
      { h: 'I move at your pace', l: 'Whatever you\'re building toward stays in view, and so does the person trying to build it with you.' },
    ] },
  FSRH: { name: 'The Lighthouse', glyph: Lighthouse, essence: 'The fixed point, best loved from a little distance.',
    bubbles: [
      "You love by being unmovable. You don't need checking on, so you don't ask for it, you just stand exactly where you said you'd be. Most people can't be counted on like that. You can.",
      "The steadiness runs on space. You need your own footing, your own quiet, room that's only yours, and from in there you assume that being reachable is the same as reaching out.",
      "So you hold steady from arm's length and give them almost nothing to read. But steady from a distance can read as steady toward no one. You feel close. They feel like they're beside a wall that never turns.",
      "Steady is the floor, not the whole house. Once a week, close the distance on purpose and name one thing you'd miss if they were gone. The light doesn't only have to stay on. It has to turn toward them.",
    ],
    features: [
      { h: 'Before you let it speak for itself', l: "When you're about to let being there do all the talking, I'll help you say the part out loud." },
      { h: 'What steady is hiding', l: 'The full read shows where being unbothered turned into being unreadable, and the move that lets them back in.' },
      { h: 'I notice the quiet ones', l: "The shifts you'd never flag because nothing's technically wrong, I keep those in view so they don't pass you by." },
    ] },
  FSRG: { name: 'The Cartographer', glyph: MapTrifold, essence: 'The one quietly charting where this goes.',
    bubbles: [
      "You love by working out where this is going and steering toward it. You don't need to be on top of each other to feel solid, you just want a direction, and you'd rather build the next step than talk it to death.",
      "What scares you is drift. A relationship with no shape, going nowhere on purpose. And worse, someone steering your life onto their road while you weren't looking.",
      "So you go quiet, you think, and you come back with the route already chosen. The call is good. But the person you love keeps finding out where you're both headed after you've turned the wheel, and a settled destination is a strange thing to hand someone who thought they were steering too.",
      "You don't have to share less of the plan. Just think the next turn out loud, before it's final, with them in the room. Right now they meet every decision already made. Decide one together, and they go from reading your map to holding the pen.",
    ],
    features: [
      { h: 'Before you present it settled', l: "When you've worked out the next move and you're about to announce it, I'll help you ask it before you state it." },
      { h: "The route you can't see", l: 'The full read maps where you\'re steering this and the spot a partner stops co-authoring and starts reading along.' },
      { h: 'I track the arc with you', l: 'Where you said this was going stays on the map, so you watch the direction move instead of just deciding it.' },
    ] },
  FAEH: { name: 'The Wanderer', glyph: Bird, essence: 'Always arriving, always leaving the door cracked.',
    bubbles: [
      "You love warm and out loud, and you love your freedom just as loudly. Up close you catch every shift and meet it with the exact right words, and you mean all of them. Then the walls inch in, you need air, and the pull to go is as honest as the wanting was.",
      "Two needs live in you and they swap places without warning. Too far out and you ache to be back in. Too far in and you can't breathe, sure there'll be no you left. Neither ever fully wins, so you keep moving between them.",
      "So you make the swing look like ease. You warm it all the way up, then you drift, and you smooth the seam with a joke so no one clocks the turn. But your person stops trusting the good days, because they feel the next disappearance coming and you've already laughed it off.",
      "You don't have to pick a side. Just say the rhythm out loud: I need closeness and I need space, and both are real today. Right now they brace through the good days waiting for the drift. Name it as it turns, and the rhythm becomes yours together.",
    ],
    features: [
      { h: 'The moment you pull back', l: 'When you feel the urge to drift right after getting close, I\'ll help you name it before they read it as a door closing.' },
      { h: 'Why the needs trade places', l: 'The full read maps when you reach and when you retreat, and the move that steadies the swing.' },
      { h: 'I track the rhythm with you', l: 'As the pull moves between closeness and space, I keep both in view so you don\'t have to hide the turn.' },
    ] },
  FAEG: { name: 'The Tempest', glyph: Lightning, essence: 'The fire that only burns for what it chose.',
    bubbles: [
      "You love at full volume, and you want the kind of love that changes you. You read every shift, you push for more honesty, more aliveness, and you give all of it back. Tame doesn't bore you so much as it makes you check the exits.",
      "What scares you is the cage. Closeness is fine until the day it starts to feel like a toll you pay in freedom, and you notice the door locked while you weren't looking.",
      "So when it gets calm, you reach for room. A sharper question, a sudden need to be alone, and you tell yourself the friction means you two are wrong. The cost: they never get to relax into you, because the closer it gets, the more you brace, and they feel it.",
      "You don't have to leave to stay free. Next time the calm makes you itch, name the itch instead of starting a fight. Right now you reach for the door the second it feels settled. Sit in it long enough to feel it hold, and you'll see the room was never locked.",
    ],
    features: [
      { h: 'Before you reach for the door', l: 'When the calm makes you want to pick a fight or bolt, I\'ll help you say what\'s really happening instead.' },
      { h: 'The pattern under the restlessness', l: 'The full read names what you mistake for a trap, and why you reach for room right when it\'s working.' },
      { h: 'I clock when you run hot', l: 'Every spike and every sudden urge for the door stays in view, so you see the pattern, not just live it.' },
    ] },
  FARH: { name: 'The Sentinel', glyph: Shield, essence: "Self-contained, and quietly afraid you'll believe it.",
    bubbles: [
      "You love by needing almost nothing out loud, while underneath you clock every shift: the shorter reply, the off note, the day the texts thin out. You run your own life and keep your own counsel, and from outside you look like the most self-sufficient person in the room.",
      "Two fears pull at you. Being crowded, you've always known that one. The other you'd never say out loud: that you'll stay this quiet and self-contained, and they'll simply take you at it, stop reaching, and one day not notice you've gone.",
      "So you hold the calm surface and let the distance stand, because asking would mean admitting how closely you've been watching. They read the composure as she's fine, she wants room, and they give it to you. Then you're sitting in the exact absence you feared.",
      "You don't have to open all the way. Just correct the signal once: tell them the quiet isn't the same as not needing them. Right now they're calibrating to someone who doesn't care. Say \"I noticed you went quiet, and it stayed with me,\" and they find you behind the calm.",
    ],
    features: [
      { h: 'Before you go quiet', l: 'When you catch yourself deciding to say nothing and give it room, I\'ll help you name the one thing you actually noticed.' },
      { h: 'What the calm costs you', l: 'The full read traces how your composure reads to them, and the line between giving space and disappearing.' },
      { h: 'I see the part you hide', l: 'Everything you track and never say stays in view here, so you\'re not the only one holding it.' },
    ] },
  FARG: { name: 'The Alchemist', glyph: Spiral, essence: 'The one who wants to be remade, and bolts the door anyway.',
    bubbles: [
      "You love by going deep and quiet. You read someone all the way down, past the words to what they're built of, and you build them a private world to step into, one almost no one else is shown. You'd rather hand someone the depth than narrate it.",
      "What scares you is being known only at the surface, loved for the version of you people can see and never the depths you actually live in. And under that, a stranger fear: that the remaking you crave could swallow the self you've worked to keep your own.",
      "So you go silent. You pull someone into the deep end, then slip inward to feel it all alone where it's safe. From outside it looks like mystery. From two feet away, the person who loves you can sit there for years and never feel they got in.",
      "Stop saving the real you for the big transforming moment. Say one ordinary, unguarded thing on a flat Tuesday, and don't vanish after. Right now the depth lives where only you can reach it. Let someone in, and you stop making them chase a door that keeps moving.",
    ],
    features: [
      { h: 'When you feel the door move', l: 'The second you go to disappear inward, I\'ll help you send the small real thing instead.' },
      { h: 'Why the door keeps moving', l: 'The full read maps both fears pulling at once and the one ordinary move that lets someone in.' },
      { h: 'I stay when you go quiet', l: 'Every time you withdraw to feel it alone, what you\'re carrying stays in view until you come back.' },
    ] },
}

export const READ_CODES = Object.keys(READS)
export const FEATURE_ICONS = [ChatCircle, StackSimple, ChartLineUp]

/* regenerated read content — 4 beats (body + chips) + aspiration + with/without labels.
   Merged into READS below so each archetype gains .beats / .aspiration / .shift. */
const READ_BEATS = {
  CSEH: { aspiration: "Kael helps you say the hard thing while it's still small, so you get met, not just kept calm.", shift: { withoutLabel: 'The smoothing reflex', withLabel: 'You, saying it' }, beats: {
    love: { body: "You love out loud and you trust it lands, which is rarer than it sounds. You don't grip the bond, you tend it: the warm text, the detail remembered, the room made easy to come home to.", chips: ['loves out loud', 'warm texts', 'easy to come home to', "tends, doesn't grip"] },
    value: { body: 'You want calm water. A home port where love feels settled and the day softens when you walk in. You prize a bond that runs warm and steady, the kind people dock in and feel the noise go quiet.', chips: ['calm water', 'a home port', 'warm and steady', 'peace that holds'] },
    triggers: { body: 'A partner going quiet or flat. To you it reads as weather moving in, a chill where the warmth was. You feel the temperature drop before a single word confirms anything is wrong.', chips: ['the room goes flat', "a partner's chill", 'sudden quiet', 'warmth thinning'] },
    respond: { body: "You warm it back. You smooth, lighten, still the water before it tips, often before you've asked if a storm was real. The cost: your own hurt gets tidied away, so they never learn they caused it.", chips: ['smooth it over', 'still the water', 'hurt tidied away', 'they never hear it'] } } },
  CSEG: { aspiration: 'Kael helps you let some good moments stay finished, so your reaching for more lands as closeness instead of a verdict.', shift: { withoutLabel: 'The fear of going stale', withLabel: 'You, reaching on purpose' }, beats: {
    love: { body: 'You love forward. You ask the real questions, name what you see, and pull the two of you toward a bigger version of this. Closeness is a given, so you spend it building.', chips: ['all-in', 'names it plainly', 'future-focused', 'builds toward more'] },
    value: { body: "You want a love that keeps asking something of you both. Depth over ease, motion over a smooth surface. A partner who'll go further with you, not just sit beside you. Coasting is the one thing you can't agree to.", chips: ['growth together', 'depth over ease', 'keeps moving', 'no coasting'] },
    triggers: { body: "The plateau. A stretch where you two go pleasant and predictable, where nothing's being asked of either of you. Not a fight, not distance. Just comfortable, and staying that way. That stalling reads as the end.", chips: ['the plateau', 'comfortable nothing', 'gone predictable', 'no pull forward'] },
    respond: { body: 'You push. You turn toward it and want to work it now, tonight, together. But to a partner who was happy as things were, your reach lands as a verdict, and they brace for the next thing you want fixed.', chips: ['push now', 'work it tonight', 'lands as a verdict', 'they brace'] } } },
  CSRH: { aspiration: 'Kael helps you say the obvious thing out loud, so your showing up finally lands as the choosing it always was.', shift: { withoutLabel: 'Letting the doing speak', withLabel: 'You, saying it plainly' }, beats: {
    love: { body: 'You show love by showing up. You follow through, you handle the thing, you stay calm when the room is not. You want your people close, you trust they are, so you prove it in the doing, not the saying.', chips: ['follow-through', 'calm in chaos', 'quietly reliable', 'actions over words'] },
    value: { body: 'You want your people close and a bond solid enough that no one keeps checking it. Love you can live in, not one you keep narrating. You prize a partner who reads your steadiness as the proof it is.', chips: ['steady over showy', 'no constant proving', 'lived not discussed', 'settled certainty'] },
    triggers: { body: 'Being asked to keep proving it. The are-we-okay, the check-ins, love turned into a thing to discuss. To you it questions the one thing you thought was already settled between you.', chips: ['are-we-okay', 'needing verbal proof', 'hashing out the obvious', 'drama over nothing'] },
    respond: { body: 'You answer with more doing and less said than ever. More handled, more shown up for, fewer words. The cost is quiet: the person closest to you feels provided for instead of let in, sure of you but never told.', chips: ['doubles down on doing', 'goes wordless', "provides, doesn't open", 'felt but unspoken'] } } },
  CSRG: { aspiration: 'Kael helps you let a partner see the tending in progress, so depth you build in private gets grown by two.', shift: { withoutLabel: 'Tending in silence', withLabel: 'Letting them see the garden' }, beats: {
    love: { body: 'You love by building, slowly and out of sight. You take what matters and grow it deeper over months, more interested in the change than in being seen making it. You hand over the better version, not the work.', chips: ['quiet builder', 'plays the long game', "show, don't tell", 'depth over noise'] },
    value: { body: 'You want roots. A bond that keeps deepening, the kind that means more in year three than year one. Pleasant-but-flat is your nightmare. You crave depth without the noise of a big talk about reaching it.', chips: ['depth that compounds', 'roots, not surface', 'no drama', 'built to last'] },
    triggers: { body: 'The talk that never goes under. A whole evening of plans, errands, who-does-what, and not one question about the thing actually living between you. Closeness that touches only the top layer.', chips: ['logistics-only talk', 'never goes under', 'top-layer closeness', 'the real thing skipped'] },
    respond: { body: 'You go quiet and inward. You think it through, adjust something real, come back changed, and assume the care is felt. But they never saw you working, so your silence reads as drifting.', chips: ['retreats to fix', 'builds in private', 'reads as distant', 'work stays invisible'] } } },
  CAEH: { aspiration: 'Kael helps you let one quiet hour stay quiet, so calm feels like rest instead of warmth slipping away.', shift: { withoutLabel: 'The reassurance loop', withLabel: 'You, trusting the warmth' }, beats: {
    love: { body: 'You love out loud, and you say it often. You read the bond by feel: reply speed, the warmth of a text, the half-second pause before they answer. When something dips, you close the gap fast and warmly.', chips: ['says it first', 'reads reply speed', 'closes the gap', 'warmth out loud'] },
    value: { body: 'You want the warmth returned and you want to feel it, plainly. A safe, close bond where love gets shown, not just assumed. Steady on its own is not enough if no one is saying so.', chips: ['warmth returned', 'shown not assumed', 'close and safe', 'felt daily'] },
    triggers: { body: 'A quiet hour with no clear reason. A shorter reply, a flatter tone, a pause that lands wrong. Nothing was said, but the warmth feels thinner, and that thinning reads as the drift starting early.', chips: ['unexplained quiet', 'shorter reply', 'flatter tone', 'the warmth thins'] },
    respond: { body: 'You ask. Are we okay, did I do something, are you sure. Almost always yes. But you make them keep proving what was never in doubt, and a person tires of passing a test they did not know they took.', chips: ['are we okay', 'asks again', 'needs the proof', 'wears the bond'] } } },
  CAEG: { aspiration: 'Kael helps you tell a quiet that means depth from a quiet that means leaving, so calm stops reading as the end.', shift: { withoutLabel: 'The fire-chasing, stirring it up', withLabel: 'You, reading the quiet first' }, beats: {
    love: { body: 'You love at full volume and you say it as you feel it. You read the energy in the room in real time and name it, because going quiet about it feels like letting the fire die down.', chips: ['full volume', 'says it live', 'wants intensity', 'reads the room'] },
    value: { body: 'You want love that keeps unfolding, the bigger version of you that being someone\'s person unlocks. A bond that stops changing feels like one that stopped wanting you. Steady alone is not enough.', chips: ['aliveness', 'transformation', 'the bigger you', 'more, not steady'] },
    triggers: { body: 'A calm stretch. The reply that comes slower, the easy quiet night, the week with no spark. To you the volume just dropped, and a dropping volume reads as something leaving the room.', chips: ['a quiet week', 'slower replies', 'easy calm', 'volume dropping'] },
    respond: { body: 'You stir it back up. You start the big talk, chase the charge, push for more until the heat returns. The cost: you yank someone out of a calm they were finally enjoying.', chips: ['starts the big talk', 'chases the spark', 'pushes for more', 'breaks the calm'] } } },
  CARH: { aspiration: 'Kael helps you voice a small need the day it costs you, so peace stops meaning silence and a hidden bill.', shift: { withoutLabel: 'The hidden tally runs you', withLabel: 'You, naming it early' }, beats: {
    love: { body: 'You read the room before anyone speaks and smooth the small thing before it grows. You absorb the friction quietly, make yourself easy, and most of the time nobody clocks that you did any of it.', chips: ['read the room', 'smooth it early', 'made easy', 'quiet fixer'] },
    value: { body: 'You want the calm to hold. Not the silence of distance, the ease of a night where nothing cracks and everyone stays close. A bond that stays whole is worth almost any small thing you swallow.', chips: ['a calm bond', 'no rupture', 'everyone stays close', 'kept whole'] },
    triggers: { body: 'The signs a snap is coming: a clipped reply, a tightening jaw, the air going hard. The second you feel a real break loading, the one that cannot be unsaid, the alarm goes off.', chips: ['the tightening', 'voices rising', 'a break loading', 'the hard air'] },
    respond: { body: 'So you shrink. You swallow what bugged you, say it is fine, arrange your day around their mood. The peace is real, but you keep a tally they cannot see, and one day the whole bill lands at once.', chips: ["say it's fine", 'swallow it', 'the hidden tally', 'bill comes due'] } } },
  CARG: { aspiration: "Kael helps you offer one true thing before someone's finished earning it, so the few you'd choose stop giving up at the gate.", shift: { withoutLabel: 'The proving ground runs the show', withLabel: 'You let one in early' }, beats: {
    love: { body: 'You let almost no one all the way in, but the few who pass get everything: your full attention, your inner world, a closeness most people never get handed. You want them near. You just need to be sure first.', chips: ['chosen few', 'all-in inside', 'slow to open', 'deep over wide'] },
    value: { body: "You want love that's rare and real, two interiors actually meeting. Not pleasant, not surface. You would rather have no one than be loved for a version of you that isn't the true one.", chips: ['the real you', 'rare not nice', 'true over easy', 'no pretending'] },
    triggers: { body: 'Someone reaches for the real you before they have proven they can hold it. A question that wants the deep answer too soon, a person moving in fast. Part of you flags it: not certain yet.', chips: ['asked too soon', 'not yet earned', 'moving in fast', 'unproven hands'] },
    respond: { body: 'You go quiet and run a private proving ground, deciding alone whether they have earned more of you. But the vetting takes so long that people give up waiting, and you lose ones you would have chosen.', chips: ['go quiet', 'make them earn it', 'decide in private', 'lose the waiters'] } } },
  FSEH: { aspiration: 'Kael helps you let one person see they specifically matter, out loud, without trading away the freedom you need.', shift: { withoutLabel: 'Ease that hides you', withLabel: 'Closeness you choose' }, beats: {
    love: { body: "You love light and warm, fully yourself whether they're in the room or not. Affection comes easy, you give it freely, and you don't hover over the bond because you assume it's fine.", chips: ['easy affection', 'no hovering', 'warm and breezy', 'self with or without'] },
    value: { body: 'Love that stays easy. Peaceful, good-natured, no policing of your time alone. You want closeness that does not ask you to merge, a bond you can trust from a comfortable distance.', chips: ['keep it peaceful', 'room of your own', 'no merging', 'trust without checking'] },
    triggers: { body: 'Someone wanting all of you, all the time. A night by yourself treated like a problem to fix, your independence read as a sign something is wrong. The pull to be needed lands as a cage closing.', chips: ['wants all of you', 'solo night questioned', 'read as distance', 'pull to merge'] },
    respond: { body: 'You stay pleasant and steer around the friction, warm on the surface, space quietly protected. The cost: you never seem to need them, so they wonder if you would even notice them drifting.', chips: ['smooth it over', 'protect the space', 'seems like indifference', 'drift goes unnoticed'] } } },
  FSEG: { aspiration: 'Kael helps you learn that staying still with one person and going deep is its own adventure worth choosing.', shift: { withoutLabel: 'Momentum running the show', withLabel: 'You, choosing to stay' }, beats: {
    love: { body: 'You love by bringing someone along. The trip you are planning, the thing you are learning, the next version of your life, you want them in it, both of you getting bigger. You point forward and assume they are game.', chips: ['come with me', 'next adventure', 'both getting bigger', 'forward, together'] },
    value: { body: 'A partner who grows alongside you, not one who leans on you. You prize a wide world and someone game to keep it wide. Love should add horizon, never trade it for a smaller, cozier life.', chips: ['room to roam', 'a partner not a port', 'keep the world wide', 'growing side by side'] },
    triggers: { body: 'The quiet shrink. The calendar fills with us, plans get smaller, and you feel the horizon slide back to the window. Being tied down lands in your body before you find the word for it.', chips: ['walls closing in', 'the smaller life', 'tied down', 'horizon gone'] },
    respond: { body: 'You add a plan, a trip, a project, and keep the two of you moving. It works, mostly. But the one who wanted to be still with you runs to keep up, wondering if they are even the point.', chips: ['book the trip', 'keep moving', 'outrunning the still', 'are they the point'] } } },
  FSRH: { aspiration: 'Kael helps you stay your steady self while learning to turn the light toward someone, so being reachable becomes being reached for.', shift: { withoutLabel: 'Steady from a wall', withLabel: 'Steady, turned toward them' }, beats: {
    love: { body: "You love by being unmovable. You don't check in, you don't make a fuss, you're just exactly where you said you'd be, every time. People can build their whole footing on you.", chips: ['always reliable', 'low drama', 'no fuss', 'fixed point'] },
    value: { body: 'You prize your own footing. A bond that lets you keep your quiet, your space, your room that is only yours, and trusts that you are solid without a constant report on it.', chips: ['space to breathe', 'own quiet', 'calm over chaos', 'trusted not tracked'] },
    triggers: { body: 'Someone asking you to come closer, to turn toward them and show you are present. You already are, from right here. The ask reads as a pull off your footing, a demand to leave your spot and perform it.', chips: ['come closer', 'turn toward me', 'pulled off your spot', 'made to perform'] },
    respond: { body: 'You plant harder and give them even less to read, sure that standing firm is the whole answer. But steady from a distance reads as steady toward no one. They sit beside a fixed point that never turns to face them.', chips: ['plant harder', 'give less to read', 'never turns toward them', "holds but won't turn"] } } },
  FSRG: { aspiration: "Kael helps you think the next turn out loud before it's final, so the one you love draws the route with you.", shift: { withoutLabel: 'Route chosen alone', withLabel: 'Charting it together' }, beats: {
    love: { body: 'You love by steering. You do not need to be on top of each other to feel solid, you just need a direction. Where this is going, what it is becoming. And you would rather build the next step than discuss it.', chips: ['steering quietly', 'eyes on the arc', "build, don't discuss", 'solid from a distance'] },
    value: { body: "A bond that's going somewhere on purpose. You can hold the independence and stay secure; what you can't stand is drift, a love idling with no shape and no next turn. You prize a route, and someone walking it.", chips: ['a clear trajectory', 'hates aimless drift', 'room to move', 'forward motion'] },
    triggers: { body: 'The moment someone steers your life onto their road while you were not looking. Their plan, quietly deciding your direction. Or the opposite: a relationship that has stopped moving anywhere at all.', chips: ['plans made for you', 'steered without asking', 'standstill', "someone else's map"] },
    respond: { body: 'You go quiet, decide alone, and come back with the route already chosen. The call is good. But your partner keeps learning where you are headed after you turned the wheel, and feels handed the map, not holding the pen.', chips: ['decide alone', 'present it settled', 'turn the wheel first', 'they read along'] } } },
  FAEH: { aspiration: 'Kael helps you name the rhythm out loud, so closeness and space become something you share, not a turn they decode alone.', shift: { withoutLabel: 'The silent swing', withLabel: 'You, naming the turn' }, beats: {
    love: { body: 'You love warm and out loud. Up close you catch every small shift and meet it with the right words, and you mean them. Then you need air, and the pull to go is as honest as the wanting was.', chips: ['warm out loud', 'reads every shift', 'needs air too', 'door left cracked'] },
    value: { body: 'You want both at once: real closeness and room to breathe. You prize a love that lets you come near and step back without anyone keeping score. Peace, to you, means nobody forces you to pick.', chips: ['closeness and space', 'room to breathe', 'no scorekeeping', 'easy peace'] },
    triggers: { body: 'The moment good closeness tips into too much. The walls inch in, the air thins, and the room starts to feel like a hand resting on your arm. Crowded scares you and so does far.', chips: ['closeness tips over', 'walls inching in', 'air thins', 'crowded or far'] },
    respond: { body: 'You make the swing look like ease. You warm all the way up, then drift, and cover the seam with a joke so no one clocks the turn. The cost: your person stops trusting the good days.', chips: ['warm then drift', 'smooth with humor', 'hide the turn', 'they brace daily'] } } },
  FAEG: { aspiration: 'Kael helps you tell a settled stretch from a cage, so you can stay by choice instead of bolting on instinct.', shift: { withoutLabel: 'The exits, running the show', withLabel: 'You, staying on purpose' }, beats: {
    love: { body: 'You love at full volume and want a love that changes you. You read every shift, push for more honesty and aliveness, and hand it all back. Tame does not bore you so much as make you check the exits.', chips: ['full volume', 'pushes for depth', 'wants to be undone', 'eyes the exits'] },
    value: { body: 'You want a love you chose with the door wide open, not one you got talked into. Depth on your own terms. Being deeply met matters, but only if nothing is holding you there but you.', chips: ['chosen, not owed', 'door left open', 'depth on your terms', 'no leash'] },
    triggers: { body: 'The calm sets you off. A peaceful, settled stretch lands like a toll you pay in freedom, and you notice the door looks locked. The more it works, the more it reads as a cage closing.', chips: ['a settled week', 'feeling contained', 'the door locked', 'being held'] },
    respond: { body: 'You reach for room. A sharper question, a sudden need for space, a fight that proves you two are wrong. The cost: they never relax into you, because the closer it gets the more you brace, and they feel it.', chips: ['picks a fight', 'bolts for space', 'calls it wrong', 'they stop relaxing'] } } },
  FARH: { aspiration: 'Kael helps you correct the signal once, so the person you love stops mistaking your calm for not needing them.', shift: { withoutLabel: 'The calm surface', withLabel: 'You, behind it' }, beats: {
    love: { body: 'You love by needing almost nothing out loud while clocking everything underneath: the shorter reply, the off note, the week the texts thin out. You run your own life and look like the most self-sufficient person in the room.', chips: ['needs nothing aloud', 'clocks every shift', 'keeps own counsel', 'self-sufficient front'] },
    value: { body: 'You prize a bond that lets you keep your own footing and your own quiet, where no one crowds you and you never have to ask. You also want to be noticed without ever waving for it.', chips: ['own footing', 'no crowding', 'never having to ask', 'noticed unasked'] },
    triggers: { body: 'When they take your distance at face value. They read your calm as she is fine, she wants room, so they stop reaching and give you exactly the space you signaled. The quiet you built starts to feel like being forgotten.', chips: ['taken at face value', 'they stop reaching', 'space you signaled', 'quiet feels like absence'] },
    respond: { body: 'You hold the calm and let the distance stand, since asking would mean admitting how closely you watched. So you manage the ache alone and stay unreadable, and the one person who would close the gap never learns there is one.', chips: ['holds the calm', "won't admit watching", 'manages it alone', 'stays unreadable'] } } },
  FARG: { aspiration: 'Kael helps you prove the remaking you crave happens in staying ordinary and present, not in the pull-close-and-vanish.', shift: { withoutLabel: 'The moving door', withLabel: 'You, staying in the room' }, beats: {
    love: { body: "You read someone all the way down, past their words to what they're built of, then build them a private world to step into that almost no one else is shown. You hand over the depth instead of narrating it.", chips: ['read all the way down', 'private inner world', 'depth over words', 'few ever shown'] },
    value: { body: 'You want a love that remakes you at the root and a person who knows the depths you actually live in, not the version on the surface. Anything shallow you quietly refuse.', chips: ['remade at the root', 'known in the depths', 'no shallow love', 'transformation'] },
    triggers: { body: 'The moment it gets real and close enough that the remaking could swallow the self you have kept your own. Being held that completely trips both fears at once, engulfed and abandoned, in the same breath.', chips: ['it gets too real', 'close enough to swallow you', 'both fears at once', 'held completely'] },
    respond: { body: 'You pull them into the deep end, then slip inward to feel it all alone where it is safe, moving the door as they reach it. It looks like mystery. Up close, they sit beside you for years and never arrive.', chips: ['pull close then vanish', 'feel it alone', 'the moving door', 'they never arrive'] } } },
}
Object.entries(READ_BEATS).forEach(([code, data]) => { if (READS[code]) Object.assign(READS[code], data) })

/* plain-human, Barnum-resonant rewrite of the 4 read beats (workflow-generated, edited).
   Overwrites .beats only; aspiration + shift labels above are kept. */
const READ_COPY = {
  CSEH: {
    love: { body: "You love out loud and you mean it. You're the one sending the warm text, remembering the small stuff, making it easy to be around you. And you trust them back, which is rarer than you think.", chips: ["texts back warm", "remembers the little things", "doesn't cling", "easy to be around"] },
    value: { body: "You want a relationship that feels calm. Someone steady, someone safe. Not dramatic, not a guessing game. Just warm and easy, day after day.", chips: ["wants calm", "needs steady", "wants to feel safe", "no drama"] },
    triggers: { body: "What gets you is when they suddenly go cold. One short reply, one quiet hour, and your stomach drops. You're already bracing for something to be wrong before you even know if it is.", chips: ["hates when they go quiet", "reads the short reply", "braces for the worst", "spots the chill fast"] },
    respond: { body: "So you smooth it over. You fix the mood, you keep it light, you tell yourself it's fine. The catch: the people closest to you rarely know when they've hurt you, because you've already packed it away.", chips: ["smooths it over", "says it's fine", "swallows the hurt", "they never hear it"] },
  },
  CSEG: {
    love: { body: "You're all in and you just say it. You're not lying awake wondering if they'll leave, you trust that part. You're already thinking about the next trip, the next version of you two, what's coming.", chips: ["says it out loud", "always thinking ahead", "never plays it cool", "trusts they'll stay"] },
    value: { body: "You want a relationship that keeps growing, not one that just sits there. You'd take a hard, real conversation over an easy night where nothing happens. Coasting is your nightmare.", chips: ["wants you both growing", "hates coasting", "picks depth over easy", "never wants it to stall"] },
    triggers: { body: "What gets to you is when it goes flat. When you two settle into the same week on repeat and nobody's reaching for anything. A comfortable, predictable nothing makes you itch.", chips: ["dreads the plateau", "scared of going stale", "hates predictable", "needs something to move toward"] },
    respond: { body: "So you push. Something feels stuck and you want to fix it tonight, right now. But to someone who was happy as is, it lands like a grade, and they start bracing for the next thing you'll want changed.", chips: ["wants to fix it now", "brings it up at 11pm", "comes off like a verdict", "they start bracing"] },
  },
  CSRH: {
    love: { body: "You don't say love, you do it. You show up, you follow through, you stay calm when everyone else is losing it. Checking if you're okay never even crosses your mind, because to you the doing is the saying.", chips: ["shows up every time", "does, doesn't announce", "calm when it counts", "follow-through is the love"] },
    value: { body: "You want steady, not a show. No constant proving, no turning love into a thing you have to keep talking about. You just want it lived. The certainty is supposed to be settled already.", chips: ["steady over flashy", "done arguing the obvious", "no constant proving", "just let it be settled"] },
    triggers: { body: "What gets you is being asked to keep proving it. The check-ins, the are-we-okay, hashing out a thing you thought was a given. It reads like the one thing you were sure of is suddenly up for debate.", chips: ["hates are-we-okay", "why prove the obvious", "drama over nothing", "not this again"] },
    respond: { body: "So you just do more. More handled, more shown up for, and you say even less. The cost is quiet: the person closest to you can feel taken care of but not let in, because everything you mean stays true and never said out loud.", chips: ["doubles down on doing", "goes quiet", "provides, doesn't open up", "means it, never says it"] },
  },
  CSRG: {
    love: { body: "You don't say love, you do it. You take what matters and quietly make it better over time, way more into the actual change than getting credit for it. You'd rather just hand someone the better version than tell them you've been working on it.", chips: ["does it, doesn't say it", "plays the long game", "hates taking credit", "deep over loud", "shows up changed"] },
    value: { body: "You want something that gets deeper the longer it goes, not a nice surface that never goes anywhere. No drama, no big talks about the talk. Just real, solid, built to actually last.", chips: ["wants depth not small talk", "no drama", "built to last", "tired of surface-level", "in it for real"] },
    triggers: { body: "It gets to you when it's all logistics and never anything real. When you only ever talk about the surface stuff and the actual conversation just never happens. You can feel when someone's dodging the deep part, and it bugs you.", chips: ["hates logistics-only talk", "needs the real conversation", "over surface-level", "notices when it's skipped", "wants someone to go there"] },
    respond: { body: "So you go quiet and try to fix it yourself. You work it out in your head, come back having changed something real, and figure they'll just feel it. They can't see any of that, so the quiet reads as you pulling away.", chips: ["retreats to fix it", "works it out alone", "reads as distant", "the effort stays invisible", "they think you drifted"] },
  },
  CAEH: {
    love: { body: "You say it first and you say it a lot. You clock how fast they text back, whether the tone's a little off, that half-second before they answer. The second something feels off, you reach right in.", chips: ["says it first", "reads reply speed", "texts back fast", "closes the gap quick", "warmth out loud"] },
    value: { body: "You want it said back, not just assumed. You need the warmth to actually show up, every day, not be a thing you have to take on faith. Close and safe is the whole point.", chips: ["wants it said back", "needs warmth returned", "shown not assumed", "close and safe", "felt every day"] },
    triggers: { body: "A quiet hour with no reason behind it gets to you fast. A shorter reply, a flatter tone, them feeling a little less warm than yesterday. You notice the dip before they even know they dipped.", chips: ["hates unexplained quiet", "clocks shorter replies", "notices a flat tone", "feels them pull back", "dreads the slow fade"] },
    respond: { body: "So you ask. Are we okay, did I do something, you sure. The answer's almost always yes, but you make them keep proving a thing that was never in doubt, and that quietly wears on the very thing you're guarding.", chips: ["asks are we okay", "asks again", "needs the reassurance", "makes them keep proving it", "wears on you both"] },
  },
  CAEG: {
    love: { body: "You love loud and you say it out loud. You want the close, all-in, can't-stop-texting kind, and you tell them how you feel the second you feel it. Bottling it up makes you itchy.", chips: ["says it first", "texts how you feel right away", "wants the intense kind", "hates playing it cool"] },
    value: { body: "You want a relationship that makes you feel more alive, not just comfortable. You want to grow into a bigger version of yourself with someone. Fine and steady isn't enough for you.", chips: ["wants to feel alive", "more, not just nice", "grows with someone", "bored by comfortable"] },
    triggers: { body: "A quiet week freaks you out. Slower replies, everyone chill, nothing happening, and your brain goes wait, is this dying. When things get peaceful you read it as you two drifting apart.", chips: ["quiet week panics you", "reads slow replies as fading", "calm feels like a warning", "peaceful equals scary"] },
    respond: { body: "So you stir things up. You start the deep talk, you chase that spark, you push for more just to feel something happen. It works, but you'll shake up a person who was finally relaxed and content.", chips: ["starts the big talk", "chases the spark", "pushes for more", "won't let it just be calm"] },
  },
  CARH: {
    love: { body: "You catch a mood the second you walk in, and you fix the little stuff before it turns into a thing. Most nights go smooth because of you, and nobody even notices you did it.", chips: ["catches a mood instantly", "fixes it before it grows", "keeps the night easy", "the quiet fixer"] },
    value: { body: "You just want things calm between you. No big blowup, no one stomping off, everyone still close at the end of the day. You want it kept in one piece.", chips: ["wants the calm", "hates a blowup", "everyone stays close", "keeps the peace"] },
    triggers: { body: "What gets you is the buildup. Things going tense, voices starting to climb, that feeling a fight is about to land. You feel the blowup coming before it's here.", chips: ["feels it coming", "voices going up", "hates the tension", "senses a fight loading"] },
    respond: { body: "So you say it's fine when it isn't. You swallow the thing that bugged you and let it go, again. But you're keeping a count they can't see, and one day it all comes out at once and blindsides them.", chips: ["says it's fine", "swallows it", "keeps a hidden count", "blows up later out of nowhere"] },
  },
  CARG: {
    love: { body: "You let almost no one all the way in, but the few who make it get everything. Your full attention, the stuff you don't tell anyone, the real you. You'd rather have two people who actually know you than twenty who sort of do.", chips: ["chosen few", "all in once you're in", "slow to let people close", "few people, but deep"] },
    value: { body: "You want someone who actually knows the real you, not the polished version. Nice isn't enough. You'd genuinely rather be alone than be loved for someone you're pretending to be.", chips: ["the real you, not the front", "rare over nice", "honest over easy", "done pretending"] },
    triggers: { body: "Someone reaches for the deep stuff before they've earned it. Asks the big question way too soon, wants to get serious fast, leans in before you're ready. Something in you goes nope, not yet, I don't know you like that.", chips: ["asked too soon", "haven't earned it yet", "moving way too fast", "leaning in before i'm ready"] },
    respond: { body: "You go quiet and start quietly testing them, deciding in your head whether they're worth more of you. But it takes you so long that they give up and leave first. You lose people you actually wanted, just not yet.", chips: ["go quiet", "make them earn it", "decide it all in your head", "they leave before you open up"] },
  },
  FSEH: {
    love: { body: "You love easy. Affection comes free, you don't hover, and you're you whether they're around or not. Being close to you feels light, like nothing's being demanded.", chips: ["affection comes easy", "never hovers", "still fully yourself", "close but not clingy", "keeps it light"] },
    value: { body: "You want it calm and roomy. Your own space, no constant merging, and a partner who trusts you without needing to check in every five minutes. A solo night should just be a solo night.", chips: ["needs her own space", "hates being checked on", "calm over intense", "a solo night is fine", "trust, no merging"] },
    triggers: { body: "What gets you is someone wanting all of you, all the time. When your alone time gets questioned, or your chill gets read as you pulling away. Someone needing to fully merge makes you want out.", chips: ["wants all of you", "questions her solo time", "reads calm as distance", "clingy energy", "needing to merge"] },
    respond: { body: "So you smooth it over and keep things breezy instead of getting into it. The quiet cost: you seem so fine that they wonder if you'd even notice them drifting. Your calm reads as not caring.", chips: ["smooths it over", "stays breezy to dodge it", "seems like she doesn't care", "protects the space", "won't clock the drift"] },
  },
  FSEG: {
    love: { body: "You love by bringing someone along. The next trip, the thing you're into lately, the bigger version of your life. You don't cling, you don't check in. You just point ahead and assume they're in.", chips: ["come with me", "what's next", "both getting bigger", "always pointed ahead", "assumes they're in"] },
    value: { body: "You want room to do your own thing and a partner who's doing theirs. Not someone who needs you to be their whole world. You want two people growing next to each other, with plenty still left to do.", chips: ["room to roam", "a partner not a project", "keep your options open", "growing side by side", "independence first"] },
    triggers: { body: "The thing that gets you is feeling boxed in. A life that keeps getting smaller, a calendar that's all us, the sense that you're tied down. You feel it in your gut before you can even name it.", chips: ["feeling boxed in", "life getting smaller", "tied down", "calendar all us", "trapped before you can say it"] },
    respond: { body: "So when something's off, you make a plan. Book the trip, start the project, keep moving. But the person who just wanted a quiet night with you is now chasing you, wondering if they're the point or just one more thing on your list.", chips: ["books the trip", "keeps moving", "can't just sit still", "never just sits in it", "are they the point"] },
  },
  FSRH: {
    love: { body: "You're the one people can count on. You show up when you said you would, you don't make a thing of it, and you don't need anyone checking in on you. You just stay put and steady.", chips: ["always shows up", "zero drama", "doesn't make a fuss", "rock solid"] },
    value: { body: "You need room to breathe and time that's just yours. Calm beats chaos every time. And you want to be trusted to do your thing, not checked up on like you're about to bolt.", chips: ["needs alone time", "calm over chaos", "trust me, don't track me", "low maintenance"] },
    triggers: { body: "What gets to you is being pulled in close on demand. Someone wanting you to turn toward them right now, prove how you feel, perform it. The second you feel yanked into it, you tense up.", chips: ["hates being smothered", "don't make me prove it", "back off a little", "no on-demand feelings"] },
    respond: { body: "So you dig in harder and give them even less to read. You stay solid but you never actually turn toward them. The cost: they're right next to you and still feel alone.", chips: ["goes quiet", "digs in", "never turns toward them", "hard to read"] },
  },
  FSRG: {
    love: { body: "You show love by figuring out where this is headed and quietly moving you both that way. You don't need to be glued together to feel solid. You'd rather build the next thing than talk it to death.", chips: ["already three steps ahead", "shows up, doesn't announce", "fine on your own", "would rather just do it"] },
    value: { body: "You want to know this is actually going somewhere. Aimless makes your skin crawl. Give you a direction and a little space to move and you're all in.", chips: ["needs a direction", "hates spinning in circles", "wants forward motion", "room to breathe"] },
    triggers: { body: "What gets you is being handed a plan you didn't agree to. Someone deciding your life for you while you weren't paying attention. Standing still with no end in sight does it too.", chips: ["don't plan my life for me", "hates being stuck", "decided behind your back", "no going nowhere"] },
    respond: { body: "So you go quiet, work it out solo, and come back with it already decided. The call's usually right. But the person you love keeps finding out the plan after it's set, and that stings more than you think.", chips: ["decides alone", "shows up with it settled", "skips the conversation", "they find out after"] },
  },
  FAEH: {
    love: { body: "You're warm and you say it out loud. Up close you catch every little shift in someone and meet it with the perfect words, and you mean them. Then you need space, and that pull is just as real.", chips: ["warm out loud", "catches every mood", "needs space too", "leaves the door open"] },
    value: { body: "You want both at once: real closeness and room to breathe. You want a love where you can lean in or step back and nobody keeps a tally. To you, peace means nobody's making you pick one.", chips: ["close but not caged", "room to breathe", "no keeping score", "easy, no pressure"] },
    triggers: { body: "It's when good closeness suddenly feels like too much. One minute you're all in, the next you feel boxed in and need out. Being crowded freaks you out, but so does being too far away.", chips: ["too close, too fast", "feeling boxed in", "need to bolt", "crowded or distant"] },
    respond: { body: "You make the whole back-and-forth look effortless. You go all warm, then you pull away, and you crack a joke so nobody notices the switch. The cost: your person stops trusting the good days.", chips: ["warm then gone", "jokes it off", "hides the pullback", "they wait for the drop"] },
  },
  FAEG: {
    love: { body: "You go all in. You read where things are at, you push for the real talk, you want someone who actually changes you. And when it gets too easy, you're already clocking how to get out.", chips: ["all in, loud", "pushes for the real talk", "wants to be changed", "clocks the exits"] },
    value: { body: "You want to be chosen, not stuck with. Door open, free to go, and you stay anyway. You'll go deep, but on your terms, and only if nothing's making you.", chips: ["chosen, not stuck with", "door stays open", "deep on your terms", "no leash"] },
    triggers: { body: "A calm, settled week freaks you out. Things are good and somehow that feels like you signed something you didn't read. The better it gets, the more you feel pinned down.", chips: ["too settled", "feeling pinned", "can't leave", "being held too close"] },
    respond: { body: "So you grab for room. A sharp question, a sudden need to be alone, a fight that proves you two won't work. The cost: they can't relax around you, because the closer it gets the more you tense up, and they feel it.", chips: ["picks a fight", "bolts for space", "calls it doomed", "they stop relaxing"] },
  },
  FARH: {
    love: { body: "You never say what you need out loud, but you catch everything. The shorter reply, the off mood, the day they text less. You handle your own stuff and come across as the person who needs no one.", chips: ["never asks for anything", "notices the short reply", "handles it solo", "looks low-maintenance"] },
    value: { body: "You want your own space and someone who doesn't crowd you. And you want to be noticed without ever having to spell it out. Asking out loud is the thing you won't do.", chips: ["needs room to breathe", "hates being crowded", "won't ask out loud", "wants to be noticed anyway"] },
    triggers: { body: "It gets to you when they take you at your word and back off. You said you were fine, they believed you, they stopped reaching. Now the space you asked for just feels like being left.", chips: ["taken at face value", "they stop reaching", "got the space you signaled", "quiet starts to sting"] },
    respond: { body: "So you stay calm and say nothing, because asking means admitting how much you've been watching. You sort it out in your head, alone, and they have no clue. You're impossible to read on purpose.", chips: ["acts totally fine", "won't admit it's bothering them", "deals with it alone", "stays hard to read"] },
  },
  FARG: {
    love: { body: "You feel everything way down deep and you almost never show it. There's a whole world running in your head that maybe one or two people have ever seen. You'd rather show love by getting someone than by saying a bunch of words.", chips: ["keeps the deep stuff inside", "picks one person to let in", "shows more than you say", "bad at small talk, great at 2am talk"] },
    value: { body: "You don't want a nice, easy, surface-level thing. You want someone who actually knows you, all the way down, and you want this to change you. Anything shallow just feels like a waste of your time.", chips: ["wants to be fully known", "no surface-level stuff", "craves the deep version", "wants love that changes you"] },
    triggers: { body: "What sets you off is when it gets too real. Someone gets close enough that you could lose yourself in them, and at the same time you're scared they'll leave. So getting close freaks you out from both sides at once.", chips: ["scared of losing yourself", "scared of being left", "panics when it gets real", "both fears at the same time"] },
    respond: { body: "So you pull them in close, then go quiet and disappear. You'd rather go through the hard stuff alone than let them watch. You keep moving the goalposts, so someone can be with you for years and still feel like they never fully got in.", chips: ["pull close then vanish", "go through it alone", "always moving the goalposts", "they never quite arrive"] },
  },
}
Object.entries(READ_COPY).forEach(([code, beats]) => { if (READS[code]) READS[code].beats = beats })

/* per-archetype With Kael / Without Kael comparison rows (workflow-generated,
   distinctiveness-edited). Each: { moment, without, withKael }. Merged into READS. */
const COMPARE = {
  CSEH: [
    { moment: 'They go flat and one-word', without: 'You get chattier to thaw them out', withKael: 'Ask what shifted before you fill the silence' },
    { moment: 'Something they did stung', without: 'You file it away and act unbothered', withKael: 'Name the small sting the same day it lands' },
    { moment: 'A real disagreement surfaces', without: 'You smooth it over to keep calm', withKael: 'Let the talk stay bumpy until it finishes' },
  ],
  CSEG: [
    { moment: 'A calm, easy week', without: 'You call it a rut and propose a fix', withKael: 'Name one thing you loved this week, full stop' },
    { moment: 'They share a small win', without: 'You add what to push on next', withKael: 'Let the win land before you build on it' },
    { moment: 'A good night winding down', without: 'You open a deep talk at 11pm', withKael: 'Save the big topic, ask for time tomorrow' },
  ],
  CSRH: [
    { moment: 'They ask if you still care', without: "You list what you've done and feel cornered", withKael: 'Name the feeling first, then point to proof' },
    { moment: 'They seem off, hard day', without: 'You fix the thing and stay quiet about them', withKael: 'Say one line about them before you fix anything' },
    { moment: 'They ask are we okay', without: 'You go flat and let showing up answer', withKael: "Say out loud you're choosing them right now" },
  ],
  CSRG: [
    { moment: 'A check-in stays surface', without: 'You save the real thing for later', withKael: 'Name one buried thing before the talk ends' },
    { moment: 'A rough patch hits', without: 'You go quiet and work it alone in your head', withKael: "Tell them what you're turning over while you turn it" },
    { moment: 'You quietly improved something', without: 'You wait to reveal the finished change', withKael: 'Show them the work mid-tend, not just the result' },
  ],
  CAEH: [
    { moment: 'Their reply comes back short', without: 'You reread for hidden weather, reply twice as warm', withKael: 'Answer the words they sent, not the imagined tone' },
    { moment: "They're quiet for an hour", without: 'You text to check, then check that landed', withKael: 'Let the hour pass and notice nothing broke' },
    { moment: 'Things feel calm and settled', without: 'You ask are we okay and make them prove it', withKael: 'Sit in the calm and let it stay an answer' },
  ],
  CAEG: [
    { moment: 'Their reply comes slower', without: "You read the drop and ask what's wrong", withKael: 'Wait one full day before naming the gap' },
    { moment: 'An easy quiet night', without: 'You break it open to feel the spark', withKael: "Let the night stay quiet and notice it's warm" },
    { moment: 'A calm stretch, no spark', without: 'You start a big talk to stir heat back', withKael: 'Ask if the quiet is depth before forcing fire' },
  ],
  CARH: [
    { moment: 'Their reply goes clipped', without: 'You brace and decide later is easier', withKael: 'Name it now: "You sound short, what\'s up?"' },
    { moment: 'They pick the plan again', without: 'You say fine and add it to the tally', withKael: 'Say it out loud: "I wanted the other place"' },
    { moment: 'The tally finally spills', without: 'You unload six months of grievances at once', withKael: 'Flag one fresh thing the day it stings' },
  ],
  CARG: [
    { moment: "They ask what's really wrong", without: 'You say "I\'m fine" and process alone for days', withKael: "Name one real thing now, before you've sorted it" },
    { moment: 'Someone wants to get close', without: "You set quiet tests they don't know about", withKael: 'Tell them one true thing instead of testing' },
    { moment: 'They wait at your locked door', without: 'You stay shut until sure, so they drift off', withKael: 'Open it halfway today, before certainty arrives' },
  ],
  FSEH: [
    { moment: 'They want your solo night', without: 'You laugh it off and book a date', withKael: 'Name the night as yours, then offer a real one' },
    { moment: 'They go quiet and pull back', without: 'You stay breezy and miss that they left', withKael: 'Say you noticed they got quiet, and ask why' },
    { moment: "They don't feel needed", without: 'You reassure lightly and change the subject', withKael: 'Tell them one thing only they give you' },
  ],
  FSEG: [
    { moment: 'They ask for a quiet weekend', without: 'You fill it with a plan, then they deflate', withKael: 'Leave the weekend open and let them set pace' },
    { moment: 'A hard patch shows up', without: 'You book a trip to grow past it', withKael: 'Name the thing and stay in the room one night' },
    { moment: 'They go quiet on the future', without: 'You hear a slowdown and pitch the next big thing', withKael: 'Ask what stillness with you would actually look like' },
  ],
  FSRH: [
    { moment: 'They ask if you still want this', without: 'You answer "of course, I\'m here" and move on', withKael: "Name one thing you'd miss if they left" },
    { moment: 'A quiet night on the couch', without: 'You sit close and say nothing, calling it ease', withKael: 'Tell them what you like about right now' },
    { moment: 'They had a hard day', without: 'You make dinner and stay calm, expecting it lands', withKael: 'Put down the task and ask how they are' },
  ],
  FSRG: [
    { moment: 'A big decision is coming', without: 'You decide alone, then announce it done', withKael: 'Float two options out loud before you pick' },
    { moment: 'They suggest a different plan', without: 'You go quiet and route around it', withKael: 'Say the turn you were taking, and why' },
    { moment: 'The relationship feels stalled', without: 'You set a new course in your head', withKael: 'Ask where they think this is heading first' },
  ],
  FAEH: [
    { moment: 'A night gets really good', without: 'You drift the next day and joke it off', withKael: 'Text them it landed, then take your space' },
    { moment: 'You feel crowded midweek', without: 'You go quiet and cancel with no reason', withKael: 'Say you need low-key days, not a disappearance' },
    { moment: 'They finally reach back', without: 'You pull away the second they lean in', withKael: 'Say you reached and still want room right now' },
  ],
  FAEG: [
    { moment: 'A run of good weeks', without: 'You start a fight to break the quiet', withKael: 'Name the itch out loud instead of swinging' },
    { moment: 'They settle into you', without: 'You go cold and need a night alone', withKael: 'Stay in it long enough to feel it hold' },
    { moment: 'Things work, no friction', without: "You read the peace as proof you're wrong", withKael: 'Tell a settled stretch from an actual cage' },
  ],
  FARH: [
    { moment: 'They give you the space', without: 'You take their backing off as relief, go quieter', withKael: 'Tell them the space has a return time' },
    { moment: 'You miss them but stay flat', without: 'You manage the ache alone and show nothing', withKael: 'Send one line: "I\'m thinking about you"' },
    { moment: 'They stop checking in', without: 'You read it as fine and let the gap widen', withKael: "Say you noticed and you'd like them closer" },
  ],
  FARG: [
    { moment: 'A talk gets really close', without: 'You open a door, then go vague and unreachable', withKael: 'Name the pull-back out loud and stay put' },
    { moment: 'They ask to really know you', without: 'You offer intensity instead of one plain truth', withKael: 'Share one ordinary detail, not a grand reveal' },
    { moment: 'Things go calm and steady', without: 'You read the quiet as flat and stir depth', withKael: 'Let the boring stretch stand and text them anyway' },
  ],
}
Object.entries(COMPARE).forEach(([code, compare]) => { if (READS[code]) READS[code].compare = compare })

/* echo line per pole — the one piercing recognition on the reveal */
export const ECHO = {
  C: 'and I can see how much you want someone woven into your days.',
  F: 'and I can see how much you need room to stay fully yourself.',
  A: 'and I can see how closely you read the people you love.',
  S: 'and I can see how steady you stay, even when it goes quiet.',
  E: 'and I can see how openly your warmth comes out.',
  R: 'and I can see how much you say through what you do.',
  G: 'and I can see how much you want love to keep opening.',
  H: 'and I can see how much you want love to feel like peace.',
}

/* ── the instrument ── */
export const QUESTIONS = {
  /* Block 1 · Two ways of loving — the anchors (heaviest weight, also break ties) */
  q1: { axis: 'CF', kind: 'two', block: 1, weight: 1.5, prompt: 'When something good happens, the first thing I want is', options: [
    { name: 'Share it with someone close', pole: 'C', icon: ChatCircle },
    { name: 'Sit with it a while myself', pole: 'F', icon: Moon },
  ] },
  q2: { axis: 'ER', kind: 'two', block: 1, weight: 1.5, prompt: 'My love is loudest in', options: [
    { name: 'Words and affection', pole: 'E', icon: Quotes },
    { name: 'Showing up and doing', pole: 'R', icon: HandHeart },
  ] },
  q3: { axis: 'GH', kind: 'two', block: 1, weight: 1.5, prompt: 'The relationship I want feels most like', options: [
    { name: 'A journey that keeps opening', pole: 'G', icon: Compass },
    { name: 'A calm place to return to', pole: 'H', icon: House },
  ] },
  q4: { axis: 'AS', kind: 'two', block: 1, weight: 1.5, prompt: 'When the mood between us shifts, I', options: [
    { name: 'Catch it right away', pole: 'A', icon: Waveform },
    { name: 'Take the day as it comes', pole: 'S', icon: Sun },
  ] },
  /* Block 2 · How often (Rarely ↔ Frequently sliders, non-pathological) */
  qf1: { axis: 'CF', kind: 'slider', block: 2, weight: 0.8, prompt: "How often do you crave a whole day that's just yours?",
    left: { name: 'Rarely', pole: 'C' }, right: { name: 'Frequently', pole: 'F' } },
  qf2: { axis: 'AS', kind: 'slider', block: 2, weight: 0.8, prompt: 'How often do you sense how someone feels before they say it?',
    left: { name: 'Rarely', pole: 'S' }, right: { name: 'Frequently', pole: 'A' } },
  qf3: { axis: 'ER', kind: 'slider', block: 2, weight: 0.8, prompt: 'How often do you put what you feel straight into words?',
    left: { name: 'Rarely', pole: 'R' }, right: { name: 'Frequently', pole: 'E' } },
  qf4: { axis: 'GH', kind: 'slider', block: 2, weight: 0.8, prompt: 'How often does a calm, settled stretch feel just right?',
    left: { name: 'Rarely', pole: 'G' }, right: { name: 'Frequently', pole: 'H' } },

  /* Block 3 · Does this sound like you? — quoted statements on an agreement slider.
     left "Not like me" = the opposite pole · right "Exactly me" = the named pole. */
  s_cf: { axis: 'CF', kind: 'statement', block: 3, weight: 1.0,
    statement: "I'm happiest when the person I love is woven right into my everyday life.",
    left: { name: 'Not like me', pole: 'F' }, right: { name: 'Exactly me', pole: 'C' } },
  s_as: { axis: 'AS', kind: 'statement', block: 3, weight: 1.0,
    statement: "I pick up on the smallest shift in someone's mood, often before they do.",
    left: { name: 'Not like me', pole: 'S' }, right: { name: 'Exactly me', pole: 'A' } },
  s_er: { axis: 'ER', kind: 'statement', block: 3, weight: 1.0,
    statement: "When I feel love, I say it out loud. I don't keep it quiet.",
    left: { name: 'Not like me', pole: 'R' }, right: { name: 'Exactly me', pole: 'E' } },
  s_gh: { axis: 'GH', kind: 'statement', block: 3, weight: 1.0,
    statement: "I want a love that keeps growing and changing me, more than one that just stays calm.",
    left: { name: 'Not like me', pole: 'H' }, right: { name: 'Exactly me', pole: 'G' } },

  /* Block 4 · Pick what rings true — scored supports (each pick nudges its pole) */
  q17: { kind: 'multi', block: 4, max: 4, prompt: "When I'm worried about someone I love, I", options: [
    { name: 'Reach out and talk it through', pole: 'E', icon: ChatCircle },
    { name: 'Give it space, process alone', pole: 'R', icon: Moon },
    { name: "Watch for signs we're okay", pole: 'A', icon: Eye },
    { name: 'Stay steady, trust it passes', pole: 'S', icon: Anchor },
    { name: 'Want to face it and grow', pole: 'G', icon: Plant },
    { name: 'Smooth it over, back to good', pole: 'H', icon: Heart },
  ] },
  q18: { kind: 'multi', block: 4, max: 4, prompt: 'A great relationship is one that', options: [
    { name: 'Feels like a safe harbor', pole: 'H', icon: House },
    { name: 'Leaves me free to be myself', pole: 'F', icon: Wind },
    { name: 'Keeps opening new depth', pole: 'G', icon: Compass },
    { name: "Weaves us into each other's lives", pole: 'C', icon: UsersThree },
    { name: 'Says the loving thing out loud', pole: 'E', icon: Quotes },
    { name: 'Notices without me explaining', pole: 'A', icon: MagnifyingGlass },
  ] },
  q19: { kind: 'multi', block: 4, max: 4, prompt: 'What I need most from a partner', options: [
    { name: 'To stay close and woven into my days', pole: 'C', icon: UsersThree },
    { name: 'To trust me with real space', pole: 'F', icon: Wind },
    { name: 'To just know I care, without me spelling it out', pole: 'R', icon: HandHeart },
    { name: "To not need constant proof we're okay", pole: 'S', icon: ShieldCheck },
    { name: 'To keep growing right alongside me', pole: 'G', icon: Plant },
    { name: 'To keep things calm and easy', pole: 'H', icon: House },
  ] },
}

/* BLOCK_IDS is derived from FLOW after it is defined (see below), so the
   progress bar can never drift from the actual question order. */

/* ── scoring (weighted instrument) ──
   Anchors (block-1 two-choice, ±1.5) are the diagnostic backbone and also break
   ties. How-often sliders (±0.8) and statement sliders (±1.0) are graded supports.
   Each multi pick nudges its pole by +0.4. A full-tilt support (≤1.0) can never
   out-vote an anchor (1.5). Ties resolve internally to the anchor — no tiebreaker
   screens. The intense archetypes must be earned (dramatic-safety, below). */
const clampN = (n, lo, hi) => Math.max(lo, Math.min(hi, n))
const NEG = { CF: 'F', AS: 'S', ER: 'R', GH: 'H' }
const ANCHOR = { CF: 'q1', AS: 'q4', ER: 'q2', GH: 'q3' }
const MULTI_W = 0.4   // per picked option, toward that option's pole
const TIE_EPS = 0.15  // |sum| at or below this is a near-tie → the anchor decides
/* a barely-Growth intense type softens to its calmer neighbor (flip G→H) */
const DRAMATIC_FALLBACK = { CAEG: 'CAEH', FAEG: 'FAEH', FARG: 'FARH' }
const DRAMATIC_MIN = 0.6

/* graded slider/statement contribution toward the axis + pole, in [-w, +w] */
function gradedContribution(answers, qid, axis) {
  const a = answers[qid]
  if (!a || typeof a.value !== 'number') return 0
  const q = QUESTIONS[qid]
  const delta = ((a.value - 50) / 50) * (q.weight || 1) // -w..+w toward the right end
  return q.right.pole === POSITIVE[axis] ? delta : -delta
}

/* signed sum per axis across every scored item; positive = toward the + pole */
function axisSum(answers, axis) {
  let sum = 0
  Object.entries(QUESTIONS).forEach(([qid, q]) => {
    const a = answers[qid]
    if (!a) return
    if (q.kind === 'two' && q.axis === axis && a.pole) {
      sum += (a.pole === POSITIVE[axis] ? 1 : -1) * (q.weight || 1)
    } else if ((q.kind === 'slider' || q.kind === 'statement') && q.axis === axis) {
      sum += gradedContribution(answers, qid, axis)
    } else if (q.kind === 'multi' && Array.isArray(a.picks)) {
      a.picks.forEach((p) => {
        if (POLE_AXIS[p.pole] === axis) sum += (p.pole === POSITIVE[axis] ? 1 : -1) * MULTI_W
      })
    }
  })
  return sum
}

/* max attainable magnitude per axis (deterministic items + multi headroom) → bars */
const AXIS_MAX = (() => {
  const m = {}
  AXES.forEach((axis) => {
    let det = 0
    Object.values(QUESTIONS).forEach((q) => {
      if ((q.kind === 'two' || q.kind === 'slider' || q.kind === 'statement') && q.axis === axis) det += (q.weight || 1)
    })
    m[axis] = det + 1.2
  })
  return m
})()

/* the anchor pole the user actually chose on this axis (the silent tie-breaker) */
function anchorPole(answers, axis) {
  const a = answers[ANCHOR[axis]]
  return a && a.pole ? a.pole : NEG[axis]
}

export function resolve(answers) {
  const axes = {}
  AXES.forEach((axis) => {
    const sum = axisSum(answers, axis)
    let letter
    if (sum > TIE_EPS) letter = POSITIVE[axis]
    else if (sum < -TIE_EPS) letter = NEG[axis]
    else letter = anchorPole(answers, axis) // near-tie → the anchor decides, silently
    const mag = Math.abs(sum)
    const pos = clampN(50 + (sum / AXIS_MAX[axis]) * 50, 6, 94)
    axes[axis] = { letter, sum, pos, band: mag >= 2 ? 'strong' : mag >= 1 ? 'clear' : 'leaning', onLine: mag <= TIE_EPS }
  })
  let code = axes.CF.letter + axes.AS.letter + axes.ER.letter + axes.GH.letter
  /* dramatic-archetype safety: a weak Growth win can't mint an intense type */
  if (DRAMATIC_FALLBACK[code] && axes.GH.letter === 'G' && axes.GH.sum < DRAMATIC_MIN) {
    code = DRAMATIC_FALLBACK[code]
  }
  return { code, axes }
}

export function resolveRead(answers) {
  const { code, axes } = resolve(answers)
  return { code, axes, read: READS[code] || READS.CSEH }
}

/* the strongest axis pole → echo line on the reveal */
export function echoLine(answers) {
  const { axes } = resolve(answers)
  let best = null
  Object.values(axes).forEach((a) => {
    const mag = Math.abs(a.sum)
    if (!best || mag > best.mag) best = { pole: a.letter, mag }
  })
  return best ? ECHO[best.pole] : ECHO.H
}

/* doorway: hottest pole across the multi-select block (used only to phrase copy) */
export function doorwayPole(answers) {
  const tally = {}
  ;['q17', 'q18', 'q19'].forEach((id) => {
    const a = answers[id]
    if (!a || !Array.isArray(a.picks)) return
    a.picks.forEach((p) => { tally[p.pole] = (tally[p.pole] || 0) + 1 })
  })
  let best = null
  Object.entries(tally).forEach(([pole, n]) => { if (!best || n > best.n) best = { pole, n } })
  return best ? best.pole : null
}

/* ── Act 1: situation (state channel — drives the doorway, never the score) ── */
export const SITUATIONS = [
  { name: "I'm spiraling over someone", icon: Spiral, phrase: 'the person on your mind' },
  { name: 'We keep fighting', icon: Lightning, phrase: 'the fighting' },
  { name: 'They feel distant', icon: Wind, phrase: 'the distance you\'re feeling' },
  { name: "I'm getting mixed signals", icon: ArrowsClockwise, phrase: 'the mixed signals' },
  { name: "I'm healing from a breakup", icon: Heart, phrase: "what you're healing from" },
  { name: "It's good, but I'm scared it won't last", icon: Shield, phrase: "the fear that it won't last" },
  { name: 'Something else', icon: Sparkle, phrase: "what you're carrying" },
]
export const SIT_PHRASE = Object.fromEntries(SITUATIONS.map((s) => [s.name, s.phrase]))
export const SITUATION_REFLECT = {
  "I'm spiraling over someone": 'Spirals feel like thinking. They are usually feeling, looking for somewhere to land.',
  'We keep fighting': 'The same fight on repeat is rarely about the thing. It is about what the thing means.',
  'They feel distant': 'Distance is loud when you love someone. Let us find out what it is actually saying.',
  "I'm getting mixed signals": 'Mixed signals are exhausting because you keep doing the decoding alone. Not anymore.',
  "I'm healing from a breakup": 'Healing is not linear, and you are not behind. Let us start where you actually are.',
  "It's good, but I'm scared it won't last": 'Wanting to protect something good is not paranoia. It is love with skin in the game.',
  'Something else': 'Whatever it is, you do not have to carry it alone in your head anymore.',
}

export const REL_CONTEXT = [
  { name: 'Single and reflecting', icon: User },
  { name: 'Dating someone', icon: Heart },
  { name: 'In a relationship', icon: UsersThree },
  { name: 'Married', icon: HeartStraight },
  { name: "It's complicated", icon: ArrowsClockwise },
  { name: 'Just out of something', icon: Wind },
]
export const AGES = ['18-24', '25-34', '35-44', '45-54', '55+']
export const GENDERS = [
  { name: 'Woman', icon: GenderFemale },
  { name: 'Man', icon: GenderMale },
  { name: 'Non-binary', icon: GenderNonbinary },
  { name: 'Prefer not to say', icon: Minus },
]

/* feature screens — real Kael surfaces; first 3 are benefits (screenshot mockups),
   the 4th is the honest with/without transformation. {B} = archetype name, no "The". */
export const FEATURES = [
  { key: 'chat', icon: ChatsCircle, title: 'Bring any moment', sub: "The 2am spiral, the text you can't read. I answer it the way the {B} needs, never a generic script.", shot: 'Chat with Kael' },
  { key: 'journey', icon: ChartLineUp, title: 'See yourself change', sub: 'Every shift logged: the patterns you broke, the spirals you caught early, the texts you never sent.', shot: 'Your journey' },
  { key: 'lessons', icon: BookOpen, title: 'Lessons made for you', sub: 'Short reads tuned to the {B}, never one-size-fits-all advice.', shot: 'Lessons' },
  { key: 'shift', icon: TrendUp, title: 'What changes with Kael', sub: 'Same moments. A steadier you in them.', shift: true },
]

/* breathers — one per block, each tied to what that segment just revealed:
   acknowledge the user, build hope, then sell one facet of Kael. `em` = italic phrase. */
export const BREATHERS = {
  /* after block 1 · how you reach for love */
  1: { kicker: 'Already, a shape', title: "There's a pattern in how you reach.", body: "Not better, not worse. Just yours. Kael learns it so it can catch you the moment it shows up.", em: 'Just yours', icon: Ear },
  /* after block 2 · what you need to feel safe */
  2: { kicker: 'A small truth', title: 'None of these needs is too much.', body: "Closeness, space, intensity. There's no right amount, only yours, and a love built to fit it. Kael helps you ask for it out loud.", em: 'only yours', icon: Wind },
  /* after block 3 · how you show up when it counts */
  3: { kicker: 'The honest part', title: 'This is the part you usually guard.', body: 'Most people armor over exactly this. Kael holds it up to the light, so the pattern stops running you from the dark.', em: 'to the light', icon: MagnifyingGlass },
  /* after block 4 · what love is for, to you */
  4: { kicker: 'What it adds up to', title: "That's your pattern, showing itself.", body: "Nothing here is a flaw. It's how you learned to stay safe. From here, Kael helps you keep the gift and drop the cost.", em: 'keep the gift', icon: Heart },
}

export const CALIB_STEPS = [
  'Reading your answers',
  'Mapping how you connect',
  'Weighing what you reach for',
  'Putting it into words',
]
export const CALIB_REVIEWS = [
  'Felt like it actually knew me.',
  'I finally have words for it.',
  'Scarily accurate, in the best way.',
  "The first one that didn't feel generic.",
]

/* progress eyebrow per quiz segment — names what Kael is learning, not a counter */
export const QUIZ_EYEBROWS = {
  1: 'How you reach for love',
  2: 'What you need to feel safe',
  3: 'How you show up when it counts',
  4: 'What love is for, to you',
}

/* ── the flow ── */
const two = (qid, block) => ({ id: qid, kind: 'two', act: 2, block, qid })
const slider = (qid, block) => ({ id: qid, kind: 'slider', act: 2, block, qid })
const statement = (qid, block) => ({ id: qid, kind: 'statement', act: 2, block, qid })
const multi = (qid, block) => ({ id: qid, kind: 'multi', act: 2, block, qid })
const breather = (n) => ({ id: 'br' + n, kind: 'breather', act: 2, n, cta: 'Continue' })

/* the read beats — now a single carousel screen (kind 'read'); the CTA steps through these */
export const BEATS = [
  { bkey: 'love', label: 'How you love' },
  { bkey: 'value', label: 'What you value' },
  { bkey: 'triggers', label: 'What triggers you' },
  { bkey: 'respond', label: 'How you respond' },
]

export const FLOW = [
  /* ACT 1 · open + get to know you */
  { id: 'welcome', kind: 'welcome', act: 1, title: 'You showed up. That is the first move.', sub: "Most people sit with this alone for years. You just chose not to, so let's make sense of how you love.", cta: 'Begin' },
  { id: 'situation', kind: 'situation', act: 1, field: 'situation', title: 'What brings you here?', sub: "Pick what's closest. We start there.", cta: 'Continue' },
  { id: 'situationText', kind: 'situationText', act: 1, field: 'situationText', title: 'Say it in your words.', sub: 'Whatever is on your mind right now. Keep it short.', placeholder: 'In a few words…', cta: 'Continue' },
  { id: 'hero', kind: 'hero', act: 1, title: "There's a you that only love brings out.", em: 'you', sub: "A few honest minutes, and I'll show you how you love, what scares you in it, and what keeps repeating.", cta: 'Show me' },
  { id: 'trust', kind: 'trust', act: 1, cta: 'I value my privacy' },
  /* identity moved up — asked right after the privacy promise, while it's warm, so the reveal payoff runs uninterrupted later */
  { id: 'name', kind: 'name', act: 1, field: 'name', title: 'What should I call you?', sub: 'Stays between us, only used to sharpen your read.', placeholder: 'Your first name', cta: 'Continue' },
  { id: 'age', kind: 'age', act: 1, field: 'age', title: 'How old are you, {name}?', sub: 'Closeness and conflict shift across life stages. This keeps your read honest to yours.', cta: 'Continue' },
  { id: 'gender', kind: 'gender', act: 1, field: 'gender', title: 'How do you identify?', sub: 'So Kael speaks to you, not a generic template.', cta: 'Continue' },
  { id: 'relcontext', kind: 'relcontext', act: 1, field: 'rel', title: 'Where are you right now?', sub: 'It changes what helps. Rebuilding after a breakup asks different things than settling into something new.', cta: 'Continue' },
  { id: 'prep', kind: 'prep', act: 1, title: "Let's find your love archetype.", sub: 'A read on how you attach, react, protect yourself, and change in love.', cta: 'Start' },

  /* ACT 2 · the quiz — 4 blocks, a breather between each */
  /* block 1 · two ways of loving (anchors) */
  two('q1', 1), two('q2', 1), two('q3', 1), two('q4', 1),
  breather(1),
  /* block 2 · how often (sliders, grouped) */
  slider('qf1', 2), slider('qf2', 2), slider('qf3', 2), slider('qf4', 2),
  breather(2),
  /* block 3 · does this sound like you? (statement agreement sliders) */
  statement('s_cf', 3), statement('s_as', 3), statement('s_er', 3), statement('s_gh', 3),
  breather(3),
  /* block 4 · pick what rings true (multi, scored) */
  multi('q17', 4), multi('q18', 4), multi('q19', 4),
  breather(4),

  { id: 'notif', kind: 'notif', act: 2, title: 'Want Kael to check in gently?', sub: 'A quiet nudge when it helps, nothing more.', cta: 'Yes, check in on me', alt: 'Not now' },
  { id: 'calibration', kind: 'calibration', act: 2, title: 'Finding your archetype.' },

  /* ACT 3 · the mirror — reveal, then the multi-section read */
  { id: 'reveal', kind: 'reveal', act: 3 },
  { id: 'miniread', kind: 'miniread', act: 3, cta: 'This is me' },
  { id: 'fullread', kind: 'fullread', act: 3, cta: 'Continue' },

  /* ACT 4 · sell — Kael is ready, the 30-day journey, then the archetype paywall */
  { id: 'ready', kind: 'ready', act: 4, cta: 'See my 30 days' },
  { id: 'thirtydays', kind: 'thirtydays', act: 4, cta: 'See my plan' },
  { id: 'paywall', kind: 'paywall', act: 4 },
]

/* derived from FLOW — single source of truth for the segmented progress bar.
   BLOCK_IDS: { blockNumber: [qid, …] } in flow order; BLOCKS: ordered block numbers. */
export const BLOCK_IDS = FLOW
  .filter((n) => n.qid && n.block)
  .reduce((m, n) => { (m[n.block] = m[n.block] || []).push(n.qid); return m }, {})
export const BLOCKS = Object.keys(BLOCK_IDS).map(Number).sort((a, b) => a - b)

export const QUIZ_IDS = ['q1','q2','q3','q4','qf1','qf2','qf3','qf4','s_cf','s_as','s_er','s_gh','q17','q18','q19']
export function answeredCount(answers) {
  return QUIZ_IDS.filter((id) => answers && answers[id]).length
}
