# Kael Onboarding — Final Spec (V4)

The canonical build document for the Love Archetype onboarding. Supersedes
`ONBOARDING_V3_SPEC.md` and `ONBOARDING_V3_RECOMMENDATIONS.md`. This is the
forced-choice trait instrument: the screen flow, the question bank, the breathers,
the scoring engine, and every line of copy, ready to hand to implementation.

Engine: `src/obv3.js`. Screens: `src/screens/OnboardingV3.jsx`. Archetype prose is
the source of truth in `ARCHETYPES.md` (do not fork it).

---

## 0. The core idea, in one breath

Two channels, never mixed.

- **The quiz measures the trait.** Forced choices between two goods produce a
  durable four-letter archetype that does not move with her mood. It is still
  true in six weeks.
- **The situation channel carries the state.** What she walked in carrying (the
  situation chips) is captured separately and threaded through the copy. It never
  touches the score. It decides which *door* she enters the read through, not
  which *room* she's in.

Same archetype for everyone of a type. A different way in, depending on what is
alive for her today. This is how the read feels personal tonight and stays
accurate later, without the wound-then-paywall surveillance trap that killed v1.

---

## 1. The model (internal only)

Four binary axes. She never sees these words, scores, or poles.

| Axis | `+` pole | `-` pole | What it measures |
|---|---|---|---|
| Closeness (CF) | Close / Together (C) | Free (F) | how much togetherness feels like safety |
| Attunement (AS) | Attuned (A) | Settled (S) | how loudly she reads the bond's weather |
| Expression (ER) | Expressive (E) | Reserved (R) | love sent through words or through steadiness |
| Tilt (GH) | Growth (G) | Harmony (H) | what she moves toward, depth or peace |

Code order is **C-A-E-P** (Closeness, Attunement, Expression, Tilt), e.g. `CSEH`.
The 16 codes map to the 16 archetypes in `ARCHETYPES.md`. The `+` pole is listed
first by convention only; it carries no "better" meaning.

**Luxury vocabulary** (used so neither pole ever reads as a flaw):

| Pole | Words to reach for |
|---|---|
| Together | shared rhythm, woven, present, nearness |
| Free | spacious, room to breathe, whole lives choosing each other |
| Attuned | perceptive, reads warmth, feels every shift |
| Settled | steady, grounded, trusts the bond without checking |
| Expressive | open, says it out loud, visible warmth |
| Reserved | quiet care, steady presence, shown not announced |
| Growth | depth, becoming, opening, awake |
| Harmony | peace, ease, calm ground, home |

---

## 2. Design principles

1. **Cognitive load is the metric, not length.** Long is fine and even helps
   (more investment → more trust and more loss aversion → more conversion, the
   Noom effect). What kills a flow is high load *per screen*. Forced-choice taps
   are near-zero load, so the flow can be long while every screen stays light.

2. **Forced choice between two goods is the backbone.** Never "do you agree with
   this admirable thing." Always "which true thing is more yours." This kills
   acquiescence (no "yes" to drift toward), kills the virtue-word leak (both
   options are pride-able), and is faster than a scale.

3. **Never pathologize a pole.** Every option is a valid, attractive way to love.
   The moment one answer reads as the healthy one, she manages her image instead
   of answering, which is the heaviest load there is and the death of validity.

4. **Measure her against herself, not a norm.** Within-person forced choice plus
   consistency-based intensity launders out the residual desirability lean that
   wording alone can never fully remove (especially on Attunement, where the
   culture always codes "trust" as healthier than "notice").

5. **Hide the machinery during the quiz.** No axis names, no scores, no poles, no
   sense of being sorted. Revealed only after the archetype lands, as precision.

6. **The breather is the reciprocity beat.** Every question takes; the breather is
   the only place Kael gives back before the reveal. Its job is to convert
   extraction into relationship: build trust and make her feel seen, while
   leaking nothing about what's being measured. (Full design in §5.)

7. **Anchor the referent.** She answers about one specific real person, so every
   answer has a face attached, instead of a different abstract "someone" per item.

8. **Trait in the score, state in the delivery.** §0. The archetype is
   mood-proof; the doorway is mood-responsive.

9. **Voice: sharp, warm, a friend who sees clearly.** No em dashes. No "it's not
   X, it's Y." No therapy-speak (growth edge, activated, hold space, sit with,
   feel into, unpack). No software voice. No Barnum priming ("whatever you feel,
   it's working"). No filler poetry.

---

## 3. Pre-quiz flow

**1 · Hero.** Opens in the feeling, not the product. No assumption about time of
day, mood, or what she's doing right now (a first screen that's factually wrong
about her reads as generic copy, the one thing this screen can't be). Lead with
the only thing that's true whenever she opens it: she's here because of someone.
> There's someone on your mind. That's usually how people find me.
> Give me a few honest minutes, and I'll show you how you love, what scares you in
> it, and what keeps repeating.
> CTA: Start

**2 · Situation chips.** Her first action: a low-effort, emotionally relevant tap
(not typing). Reuse the shipped `SITUATIONS` list (already non-pathological).
Optional one-line text below, skippable. This is the **state channel**; it feeds
the doorway and threading, never the score.
> What's pulling at you right now?
> Pick whatever's closest. This is where we start.

**3 · Situation reflect.** One true sentence back on her pick (the taste of
relief). Reuse `SITUATION_REFLECT`. CTA: Continue.

**4 · Why this.** Sells the quiz using her situation.
> You know who you're drawn to. Few people know who they become once they're in
> it. That second part is your Love Archetype: the version of you that shows up
> when someone really matters, the part that reaches, or protects, or goes quiet.
> To really help with {SIT_PHRASE}, I need to see yours first.
> CTA: Show me how

**5 · Relationship context.** Tap (structural, distinct from the emotional
situation, and low-friction). Single and reflecting · Dating someone · In a
relationship · Married · It's complicated · Just out of something

**6 · The referent anchor.** Load-bearing. It pulls her out of the abstract
"ideal me" into a real relational nervous system, and fixes the referent so every
answer is about the same person.
> Before the questions, bring one person to mind. The relationship most alive for
> you right now, good or complicated.
> Answer as you generally are with them, across the whole of it, not just this
> week, and not the way you wish you were.
> CTA: Okay, I've got them

**7 · Quiz intro.** Both load-bearing microcopy lines.
> Twenty quick choices. Mostly taps.
> Most are two ways of loving, both real. Pick the one that sits a little closer.
> There are no better or worse answers here. Only truer ones.
> CTA: Start

> **Name, age, and gender are deferred to after the read (§8).** Drop-off
> concentrates at the name field, so nothing high-friction is asked until she's
> seen the reveal and the read and is most invested. The front of the funnel is a
> pure emotional hook straight into the quiz.

---

## 4. The instrument

20 items in four blocks, four breathers, plus up to four conditional tiebreaks
that fire only when an axis lands on the line. Most users answer 20-21 questions.

**Formats:**
- **Two-choice** — pick the closer of two goods. Backbone. Each pick = 1 to its
  pole.
- **Slider** — one graded bipolar hero item (Q12), both ends equally desirable,
  carries fine magnitude on Tilt. Endpoint labels are tiny (2-4 words): the slider
  already asks for a felt comparison, so long labels make it drag-hell.
- **Multi-select (pick up to 3)** — texture only. Never sets the type.
- **Tiebreak (conditional)** — loss-aversion forced choice, fires per axis only on
  a tie.

**Per option, the hidden pole tag is in brackets. Never rendered.**
**Shuffle the two option orders on render for every two-choice, tiebreak, and
multi-select item. Never reorder the slider ends. (§7.)**

**Option copy and icons.**
- Every option is a 2-5 word fragment. The stem carries the context; the options
  stay glanceable and roughly equal length (length asymmetry tilts the choice).
- Every option carries one leading icon: a Phosphor line glyph, single weight,
  monochrome, same visual size on both sides. It is a scanning aid and texture,
  never information the words don't already carry.
- Both icons in a pair must be equally appealing and equally neutral. If one looks
  warmer, prettier, or more "right," it biases the tap the way a pathologized word
  would. Cover the text: the two icons should read as peers.
- Icons fit the question's content, not the pole. Don't let one glyph consistently
  mark a pole across questions, or it becomes an axis key and telegraphs the
  machinery. Tune the whole set together so no icon is a tell.
- Glyphs below are a starting palette, tuned visually as a set at build. The
  slider takes optional tiny end-glyphs only, never per-step icons.

### Block 1 · Two ways of loving
*Two ways of loving. Both real. Pick the one that sits a little closer.*

**Q1 · Closeness** — When something good happens, first I want to
- Share it with someone close `[C]` *(ChatCircle)*
- Sit with it a while myself `[F]` *(Armchair)*

**Q2 · Expression** — My love shows most in
- What I say `[E]` *(Quotes)*
- What I do `[R]` *(HandHeart)*

**Q3 · Tilt** — The relationship I want feels most like
- A journey that keeps opening `[G]` *(Compass)*
- A calm place to return to `[H]` *(House)*

**Q4 · Attunement** — When the mood between us shifts, I
- Catch it right away `[A]` *(Waveform)*
- Take the day as it comes `[S]` *(Sun)*

**Q5 · Closeness** — Big decisions feel right when
- Talked through with someone `[C]` *(UsersThree)*
- Worked out on my own `[F]` *(UserFocus)*

**Q6 · Expression** — I feel most loved when someone
- Tells me, in words `[E]` *(ChatCircleText)*
- Shows me, without asking `[R]` *(Gift)*

> **Breather 1 — Permission** (lower defenses; build trust in the process)
> No right answers in here. Just you, being honest about how you love.

### Block 2 · When it happens
*A moment, and what's truer for you in it.*

**Q7 · Attunement** — When a message could be read two ways, I
- Read the tone underneath `[A]` *(MagnifyingGlass)*
- Take it at face value `[S]` *(Check)*

**Q8 · Closeness** — An open evening feels best
- Shared with someone `[C]` *(Wine)*
- Kept for myself `[F]` *(MoonStars)*

**Q9 · Tilt** — A year in, I'm happiest when we're
- Still finding new depth `[G]` *(Plant)*
- Easy and sure `[H]` *(Anchor)*

**Q10 · Attunement** — When I haven't heard from someone in a while, I
- Feel it and reach out `[A]` *(PaperPlaneTilt)*
- Keep it in the background `[S]` *(Mountains)*

**Q11 · Expression** *(retrieval)* — The last time distance opened up, I
- Said something `[E]` *(ChatCircle)*
- Gave it time `[R]` *(Hourglass)*

> **Breather 2 — Perceptiveness / the velvet knife** (earn authority; sell Kael
> sideways)
> There's no healthiest way to love. Most advice forgets that. I'm built around
> how you actually work.

### Block 3 · Closer in
*(Q12 is a slider, both ends true. The rest are this or that.)*

**Q12 · Tilt · SLIDER (hero item)** — When love gets steady, underneath I feel
- *(left)* Safe to rest `[H]`
- *(right)* Ready to deepen `[G]`

**Q13 · Closeness** — Closeness, for me
- Where I feel most myself `[C]` *(HeartStraight)*
- Best with room to breathe `[F]` *(Wind)*

**Q14 · Expression** — When something's bothering me, I
- Say it out loud `[E]` *(ChatCircleDots)*
- Show it in what I do `[R]` *(Handshake)*

**Q15 · Attunement** — In a relationship, I tend to
- Read the weather closely `[A]` *(Eye)*
- Assume we're fine `[S]` *(Smiley)*

**Q16 · Tilt** — A relationship that grows familiar over the years sounds
- Beautiful, if it keeps deepening `[G]` *(Sparkle)*
- Peaceful, like home `[H]` *(Tree)*

> **Breather 3 — Seen** (the intimate peak; threads her situation, leaks no axis)
> I'm starting to see how you love. And how much it's tangled up in {SIT_PHRASE}.
> Stay with me.
> *(No {Name} here: name is captured after the read now, §8.)*

### Block 4 · Pick what rings true
*As many or few as fit, up to three. No right number.*
**Texture only. Does not set the type. (§6.)**

**Q17** — When I'm worried about someone I love, I *(pick up to 3)*
- Reach out and talk it through `[E]` *(ChatCircle)*
- Give it space, process alone `[R]` *(Armchair)*
- Watch for signs we're okay `[A]` *(Eye)*
- Stay steady, trust it passes `[S]` *(Anchor)*
- Want to face it and grow `[G]` *(Plant)*
- Smooth it over, back to good `[H]` *(Heart)*

**Q18** — A great relationship is one that *(pick up to 3)*
- Feels like a safe harbor `[H]` *(House)*
- Leaves me free to be myself `[F]` *(Wind)*
- Keeps opening new depth `[G]` *(Compass)*
- Weaves us into each other's lives `[C]` *(UsersThree)*
- Stays steady when life gets noisy `[S]` *(Mountains)*
- Says the loving thing out loud `[E]` *(Quotes)*
- Shows love through actions `[R]` *(HandHeart)*
- Notices without me explaining `[A]` *(MagnifyingGlass)*

**Q19** — Which feel most like you? *(pick up to 3)*
- I need my own space `[F]` *(MoonStars)*
- I catch the little cues `[A]` *(Waveform)*
- Hard to shake once I trust you `[S]` *(ShieldCheck)*
- I love being close, a lot `[C]` *(HeartStraight)*
- I say what I feel `[E]` *(ChatCircleDots)*
- I'd rather show than tell `[R]` *(Gift)*

> **Breather 4 — Anticipation / handoff** (lean her into the reveal; no "sixteen,"
> no Barnum prime)
> That's everything I need. Give me a second with it. Not a label, just how you
> love, said back to you clearly.

### Conditional tiebreaks
Fire **only** for an axis that lands exactly on the line (§6). Most users see zero
or one. Loss-aversion framing pulls a cleaner read at a true tie than preference
does, and lands as Kael noticing a nuance rather than flattening her.

> On one thing, you sit right on the line. Both of these are true for you. Which
> would you miss more if it were gone?

- **Closeness tiebreak** — Sharing the small moments of a day with someone `[C]` /
  Having space that's fully my own `[F]`
- **Attunement tiebreak** — Sensing what someone feels before they say it `[A]` /
  The ease of not having to read into anything `[S]`
- **Expression tiebreak** — Putting what I feel into words `[E]` / Showing it
  through what I do `[R]`
- **Tilt tiebreak** — A relationship that keeps growing into something new `[G]` /
  A relationship that settles into something calm and sure `[H]`

### Coverage check

| Axis | Items | Facets covered |
|---|---|---|
| Closeness | Q1, Q5, Q8, Q13 | sharing news · decisions · open time · self-definition |
| Attunement | Q4, Q7, Q10, Q15 | present mood · reading ambiguity · distance · baseline posture |
| Expression | Q2, Q6, Q11, Q14 | expressing · receiving · distance (retrieval) · under friction |
| Tilt | Q3, Q9, Q12 (slider), Q16 | what I want · a year in · the calm test · over the years |

Four distinct facets per axis (de-duplicated from the prior draft). Multi-select
covers every pole across Q17-Q19 so the doorway can key on any of the eight.

---

## 5. The breathers (first-principles)

Every question extracts; the breather is the only beat where Kael gives back
before the reveal. Its job is reciprocity: turn "I'm taking a quiz" into "this
thing gets me." It must make her feel seen **without revealing what's being
measured** (or the back-half answers turn to performance), and it must never claim
to see what it can't observe (the old "you're answering without overthinking"
line failed both tests).

The four levers, each a distinct breather, escalating trust → seen → Kael →
reveal:

| # | Job | Lever | Why it's safe |
|---|---|---|---|
| 1 | Permission | take the pressure off; make honesty safe | reduces social-desirability on the vulnerable back half |
| 2 | Perceptiveness | one sharp, true thing about love in general + velvet knife | builds trust in the reader without reading *her* |
| 3 | Seen | thread her situation ({SIT_PHRASE}) | the situation is a channel she explicitly gave; touches no axis |
| 4 | Anticipation | pay the reveal forward | momentum, not a content leak |

Read in sequence they feel like a deepening conversation, not four taps of the
same reassurance. Copy in §4.

---

## 6. Scoring engine

Four independent tallies, one per axis. The letter is the side; the distance from
the midline is the intensity readout.

**Backbone.** Each two-choice pick adds 1 to its pole.
- Closeness: Q1, Q5, Q8, Q13 (4 items)
- Attunement: Q4, Q7, Q10, Q15 (4 items)
- Expression: Q2, Q6, Q11, Q14 (4 items)
- Tilt: Q3, Q9, Q16 (3 two-choice) + Q12 (slider)

**Intensity from consistency, not self-rating.** Four-of-four toward a pole is
high intensity; three-of-one is moderate; two-of-two is a true midline. This is
behavioral and far harder to game than asking someone to rate their own
magnitude.

**Tilt resolves cleanly by design.** Three two-choice items can't deadlock (always
a 2-1 or 3-0 majority), so the Tilt **letter** comes from that majority. The Q12
slider adds **magnitude** and must NOT flip the majority. When the majority is
weak (2-1) and the slider sits opposite or near center, Tilt counts as on the line
and fires its tiebreak.

**The tie referee (the structural fix).** The other three axes have four
two-choice items each, so a 2-2 split happens for roughly a third of users per
axis, and ~60% of users tie on at least one. A two-choice axis cannot name a
letter at 2-2. So: **whenever any axis lands 2-2 (or Tilt lands on the line after
the slider), fire that axis's loss-aversion tiebreak** (§4). The pick sets the
letter and flags the axis as lowest-confidence for the read's hedge language.
Everyone leaves with a clean four-letter code; nobody gets a coin-flip.

**Multi-select does NOT touch the code.** Q17-Q19 power, in order of importance:
the doorway (the hottest pole she flagged sets which cost beat the read opens on),
reveal emphasis, the "what's alive right now" surface, and lesson
recommendations. The result is identical if you delete the block. (If you ever
want it to nudge, allow it to break a near-midline axis only, never to override a
clear lean.)

**Confidence bands** (for read voice, from the consistency count):
- Strong — 4-0 (or Tilt 3-0)
- Clear — 3-1 (or Tilt 2-1 with the slider agreeing)
- On the line — 2-2 resolved by tiebreak (or Tilt 2-1 with slider opposing)

**Near-midline is surfaced as precision, not hidden.** A resolved-but-thin axis
reads as Kael seeing nuance: "You live close to the line between closeness and
freedom. You want real room to stay yourself, but not at the cost of feeling near
the people who matter." This makes the read feel sharper, not indecisive.

**One validity catch, not ten.** Plant two items that should agree, sitting far
apart (e.g. Q1/Q13 for Closeness, or Q2/Q6 for Expression). If they contradict
*and* the user also has multiple 2-2 ties, treat the run as low-reliability and
widen the result language to a confident range rather than a false-precise point.
A junk result shared as "lol this is so wrong" poisons the share engine; one check
is enough for a funnel.

**The score is trait-true.** Mood does not touch which archetype she is. The state
channel (§0, §3) sets the doorway only.

---

## 7. Shuffle and integrity rules

- **Shuffle the two option orders** on render for every two-choice, tiebreak, and
  multi-select item, with a stable per-user seed (so a session is consistent).
  The `+` pole must not sit in a fixed position.
- **Never reorder the slider ends.** Left and right stay fixed (rest on the left,
  forward on the right) so she doesn't re-orient each time.
- **Never reorder a frequency scale** if any are ever reintroduced. (None in this
  version.)
- **Never show** axis names, scores, poles, the number 16, or archetype logic at
  any point during the quiz.
- **Progress UI is one continuous bar**, not per-axis segments. Segment boundaries
  would broadcast the four-axis skeleton.

---

## 8. Reveal, read, and the ask

**Calibration.** Percentage multi-loader. Never names "16," an axis, "lookup," or
"algorithm." One step references her situation.
> Reading how you answered. · Putting the pieces together. · Holding it all
> together. · Putting words to it.

**Reveal (one full-size screen).** The archetype lands on its own full screen, the
big moment, nothing competing: the name large, a placeholder glyph, the one-line
essence, and the echo line from her highest-confidence axis (the specific
recognition that separates a read from a horoscope).
> You're [archetype].
> [essence]
> [echo line from her strongest axis]

Echo lines per pole:

| Pole | Echo line |
|---|---|
| Together | "and I can see how much you want someone woven into your days." |
| Free | "and I can see how much you need room to stay fully yourself." |
| Attuned | "and I can see how closely you read the people you love." |
| Settled | "and I can see how steady you stay, even when it goes quiet." |
| Expressive | "and I can see how openly your warmth comes out." |
| Reserved | "and I can see how much you say through what you do." |
| Growth | "and I can see how much you want love to keep opening." |
| Harmony | "and I can see how much you want love to feel like peace." |

**The read, delivered as chat (4 messages).** After the reveal, she drops into
Kael's chat and the read arrives as four messages, with a typing pause between each,
as if Kael is telling her what it sees. This is the read's whole delivery: no
results page, no scrolling wall. Each message is one chat bubble, tight (2-3
sentences). The four beats: how you love · what scares you · when it's threatened ·
what helps (with the forward turn folded into the last). Situation-free and
falsifiable (the opposite archetype would reject it).

Worked example (the Harbor, CSEH), four bubbles:
> **1** You love out loud, and you mostly trust it's returned, which is rarer than
> it sounds. You tend closeness instead of gripping it: the warm text, the thing
> remembered, the room made easy to come home to.
> **2** What scares you is the chill. The second someone goes quiet, you feel
> weather moving in, and you warm it back before you've even asked whether a storm
> was coming.
> **3** So you smooth. You still the water before it tips. It feels like love, and
> it is. But the people closest to you don't always know when they've hurt you.
> You've already tidied it away.
> **4** You don't need to be braver. Just say the hard thing while it's still
> small. Do that, and you finally get to be met, instead of only keeping the room
> safe for everyone else.

After the read she is at peak investment. Everything high-friction is deferred to
here.

**Name → Age → Gender ("make it yours").** The three deferred fields, asked now that
she wants to keep her read. Name is the one typed field; age and gender are taps.
Lead with one line of privacy reassurance.
> Let's make this yours.
> (sub) Stays between us, only used to sharpen your read.
> Name (field) · Age (tap range) · Gender (tap)

**Notification permission.** A benefit-framed soft pre-prompt before the OS dialog,
riding the warmth of the read. Never a bare "Allow notifications?"
> I can be here when it's hard, not just when you come looking.
> Want me to reach out when you might need it?
> Primary: Yes, check in on me · Quiet: Not now

**Three feature/benefit screens (visual-first).** Three screens, one benefit each,
**more visual than verbose**: a placeholder visual or an icon/graph carries the
screen, with a short headline and at most one line under it. Archetype-aware via the
name; the situation appears once (screen 3, the doorway).
> **1** *(visual: chat bubble)* When the spiral hits, I'm one message away.
> **2** *(visual: layered depth / graph)* There's a deeper read under this one.
> **3** *(visual: timeline graph)* Whatever you walked in with, I keep it in view.

**Paywall.** Sell the full read as a reward. No locked/blurred tease. The doorway
opens on the cost beat she flagged hottest in Blocks 3-4.
> You met [archetype]. Now let's change how you love.
> You came in carrying {SIT_PHRASE}. The full read tells you what to do with it,
> the next time it hits and the spiral starts, in a response built for you and not
> a generic script.
> [price, framed as less than a coffee a week]
> Primary: Unlock the full read · Quiet: I'll keep my free read for now

**Free vs paid.** Free: the reveal and the four-message read in chat. Paid: the
full per-field read, deeper situational guidance, the ongoing "what's alive right
now." Sell with confidence, never with a blur.

---

## 9. Copy laws (enforce on every line)

- No em dashes. Commas, periods, "and," or restructure.
- No "it's not X, it's Y."
- No therapy-speak: growth edge, activated, hold space, sit with, feel into,
  unpack, your truth.
- No software voice: your read updates, syncing, personalize your experience.
- No Barnum priming ("whatever you feel, it's working"; "some of it will land
  close, both mean it's working").
- No claiming to observe what you can't (her pace, her hesitation).
- No filler poetry that floats above her.
- Options sit directly under the question, never floated to the bottom.
- The glance test applies to every screen, breathers included: one or two short
  lines, never a paragraph. A breather she has to study is not a breather.
- The read is one scrollable screen, ~180 words max, 1-2 minutes. The five beats
  fold into flowing copy, never labeled paragraphs. The read is situation-free.
- Feature/benefit screens are a headline plus one or two lines. Three of them,
  visual-first (the visual carries the screen, the words support it).
- All visuals are placeholders (neutral blocks) except icons and graphs/charts,
  which are real. No code-drawn illustration anywhere.
- Loaders are percentage multi-loaders, never spinners, and never name "16."
- Every option is an attractive, valid way to love.

---

## 10. Build notes (`obv3.js` + `OnboardingV3.jsx`)

**Reuse:** `ARCHETYPES` (16), `SITUATIONS`, `SITUATION_REFLECT`.

**Replace `QUESTIONS`** with the 20 items in §4. Item shape:
`{ id, axis, block, fmt: 'two-choice'|'slider'|'multi', prompt, options: [{ name, pole, w }] }`.
Two-choice `w:1`; slider returns a graded value mapped to magnitude; multi options
carry a pole tag but feed only the doorway (see below).

**Add a tiebreak table:** one loss-aversion item per axis (§4), keyed by axis,
fired conditionally by the scorer.

**Rewrite `scoreAxes()` / `resolveCode()`:**
- Tally each axis from its backbone two-choice picks.
- Tilt letter from the Q3/Q9/Q16 majority; Q12 slider → magnitude, may not flip.
- For any axis at 2-2 (or Tilt on the line), require the tiebreak answer and use
  it for the letter; tag that axis `onTheLine`.
- Return `{ code, axes: { CF, AS, ER, GH: { letter, count, band, onTheLine } } }`.
- Multi-select results go to a separate `texture`/`doorway` object, never into the
  code.

**Add `confidence`** from the consistency count (Strong / Clear / On the line),
wired to the four-axis map and the hedge lines.

**Add the doorway selector:** from Q17-Q19 picks, pick the hottest pole/theme →
choose the opening cost beat for the read and paywall.

**`SIT_PHRASE` map** (chip → grammatical fragment):
- "I'm spiraling over someone" → "the person on your mind"
- "We keep fighting" → "the fighting"
- "They feel distant" → "the distance you're feeling"
- "I'm getting mixed signals" → "the mixed signals"
- "I'm healing from a breakup" → "what you're healing from"
- "It's good, but I'm scared it won't last" → "the fear that it won't last"
- "Something else" → "what you're carrying"

**Shuffle:** seeded option-order shuffle for two-choice/tiebreak/multi; slider ends
fixed; per §7.

**Progress UI:** single continuous percentage bar, not per-axis segments.

**Studio:** gate the dev bar behind a flag so it never renders near a real user.

---

## 11. Changelog — judgment calls in this synthesis (veto any)

1. **Referent wording.** Kept the vivid "relationship most alive for you right
   now" (engagement, embodiment) but added the trait-framing instruction "as you
   generally are with them, across the whole of it, not just this week." This is
   the state/trait dial: the vivid referent stays, the instruction de-states it so
   the score measures the person, not this week's mood.
2. **Dropped "especially lately"** from the quiz intro for the same reason; the
   "lately" hit is delivered by the situation channel, not the quiz.
3. **De-duplicated facets.** The prior draft repeated one probe per axis (e.g.
   Attunement asked "silence → reach or trust" twice; Expression asked "say vs do"
   three times). Rewrote so each axis hits four distinct facets (§4 coverage). New
   items: Q5 (decisions), Q7 (reading ambiguity, the previously missing facet),
   Q14 (expression under friction).
4. **Kept Q11 as retrieval.** Fixed the option wording ("named it" / "gave it time
   and watched") but kept the "the last time…" memory frame, which is harder to
   game than a self-description. (Rejected the reviewer's rewrite that dropped it.)
5. **Q12 Growth end.** Rejected both the original "is this it" (reads dissatisfied)
   and the reviewer's "I still want us to keep opening" (reintroduces a virtue
   lean). Chose "content, and still itching for what's next": a positive pull, not
   a virtue, balanced in desirability against "finally, somewhere I can rest."
6. **Generalized the tiebreak to all four axes.** The conditional loss-aversion
   item now fires on any 2-2 axis, not just Tilt. This closes the real structural
   hole (three axes could otherwise tie with no referee). Chosen over odd-numbered
   backbones because it keeps the flow short for most users and turns a tie into
   the most "seen" moment in the quiz.
7. **Multi-select capped at "pick up to 3"** and locked out of the type
   calculation; it powers the doorway and reveal emphasis only.
8. **Fixed Q18 mis-tags** ("truly knows me" was tagged Expressive → now an Attuned
   "notices the little things"; "calm and easy" Settled → Harmony "safe harbor").
9. **Rewrote all four breathers** to four distinct jobs (§5); removed the
   presumptuous pace claim, the "sixteen ways of loving," and the Barnum prime.
   Later tightened all four to one or two glanceable lines.
10. **Tightened every option to a 2-5 word fragment and added a leading icon**
    per option, with guardrails (§4 "Option copy and icons"): equal-appeal,
    equal-weight, content-fit, never a pole-tell. The bracketed glyph names are a
    starting palette to tune visually as a set; some repeat across questions and
    should be diversified at build so no icon becomes an axis key. Slider Q12
    takes optional tiny end-glyphs only.
11. **Made the read situation-free** so it can be written sharply; the situation
    now lives only in the setup (reflect, why, breather 3) and the paywall doorway,
    never in the read. Removed the situation reference from the calibration loader.
12. **Deferred name/age/gender to after the read** (drop-off concentrates at the
    name field), so the front is a pure emotional hook into the quiz. Privacy
    reassurance moved with them. Removed {Name} from the breathers.
13. **Reveal is its own full-size screen** (name large, placeholder glyph, essence,
    echo), nothing competing.
14. **The read is delivered as four chat messages in Kael's chat** (typing pauses
    between), not a results page or scroll wall. Each bubble is tight; the turn
    folds into the fourth.
15. **Feature screens are visual-first** (placeholder visual or icon/graph carries
    the screen, words support). **Added a benefit-framed notification permission
    screen** after the read. Reaffirmed: every visual is a placeholder except icons
    and graphs.
    Post-quiz order is now: calibration → reveal → 4-message chat read →
    name/age/gender → notification → 3 visual feature screens → paywall.

## 12. Open ends (not retired by a clean quiz)

- The reveal copy for the other 15 archetypes still has to be written and
  edge-tested the way Lighthouse was (a read is only good if the *opposite* type
  would read it and reject it).
- The Lighthouse cost beat still hasn't been read cold by a real Lighthouse.
- The "on the line" reveal variants (for tiebreak-resolved axes) need writing and
  the same edge-test, since ~60% of users will have at least one.
