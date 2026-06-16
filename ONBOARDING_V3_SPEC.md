# Kael Onboarding V3 — Spec (rebuilt)

This supersedes the earlier V3 spec. It is the canonical design for the Love
Archetype onboarding: the screen flow, the 20-question instrument, the scoring
engine, and every line of copy. Built to be handed straight to implementation.

Engine lives in `src/obv3.js`. Screens in `src/screens/OnboardingV3.jsx`.
Archetype prose is the source of truth in `ARCHETYPES.md` (do not fork it).

---

## 0. Operating principles

These are the rules every screen is measured against. If a screen breaks one, it
is wrong, no matter how nice it looks.

1. **Cognitive load is the metric, not screen count.** Length is fine. Noom
   proved that more questions build more trust and more loss aversion (she paid
   in effort, so she values the result and is motivated to pay in money). What
   kills a flow is high load *per screen*, not the number of screens. So we
   optimize the work each screen demands, and we let the flow be as long as it
   earns the right to be.

2. **One low-effort decision per screen.** A tap, a short read, a single field.
   Never two cognitive jobs on one screen.

3. **Never pathologize a pole.** Every option is a valid, attractive way to love.
   The moment one answer reads as "the healthy one" and the other as "my
   problem," she stops answering honestly and starts managing her image, which is
   the heaviest load there is. Both sides of every axis get luxury wording.

4. **Hide the machinery during the quiz.** She never sees the four axes, never
   sees a score, never feels herself being sorted. The structure is invisible:
   shuffled axes, themed blocks, mixed formats. The machinery is revealed only
   *after* the archetype lands, where it reads as precision, not a lookup table.

5. **A break at least every 4 questions.** Hard cap. The break is both a
   cognitive reset and a trust signal (Kael is reacting to *her*, not collecting
   data).

6. **Thread her situation through the whole arc.** The person she came in
   carrying must be on screen at the reflect beat, in a break, in the read, and
   especially at the paywall. The promise is "built for exactly how I struggle,"
   and a generic read breaks it.

7. **Voice: sharp, warm, a friend who sees clearly.** No em dashes. No
   "it's not X, it's Y." No therapy-speak (growth edge, activated, hold space,
   receipt). No software voice (your read updates, syncing). No filler poetry.

---

## 1. The model (internal only)

Four binary axes. She never sees these words. The `+` pole is listed first by
convention only; it carries no "better" meaning.

| Axis | `+` pole | `-` pole | What it measures |
|---|---|---|---|
| Closeness (CF) | Close / Together (C) | Free (F) | how much togetherness feels like safety |
| Attunement (AS) | Attuned (A) | Settled (S) | how loudly she reads the bond's weather |
| Expression (ER) | Expressive (E) | Reserved (R) | love sent through words or through steadiness |
| Purpose (GH) | Growth (G) | Harmony (H) | what she moves toward, depth or peace |

Code order is **C-A-E-P**, e.g. `CSEH`. The 16 codes map to the 16 archetypes in
`ARCHETYPES.md` and `ARCHETYPES` in `obv3.js`.

**Luxury vocabulary** (the words used in options, breaks, and reads so neither
pole ever sounds like a flaw):

| Pole | Words to reach for |
|---|---|
| Together | shared rhythm, woven, present, nearness |
| Free | spacious, room to breathe, whole lives choosing each other |
| Attuned | perceptive, reads warmth, feels every shift |
| Settled | steady, grounded, trusts the bond without checking |
| Expressive | open, says it out loud, visible warmth |
| Reserved | quiet care, steady presence, thoughtful restraint |
| Growth | depth, honest, becoming, awake |
| Harmony | peace, safe, at ease, calm ground |

---

## 2. Question architecture

**20 questions. 5 per axis. No separate tiebreaker screen.** The 5th question per
axis is an **anchor**: a clean two-choice that carries the heaviest weight and
acts as the built-in tiebreaker.

**Two formats only.** Format A (agree/disagree: "Sounds like me / Sometimes /
Not really") is eliminated. Any agree/disagree scale creates an implicit right
answer — one pole always risks reading as the deficit, no matter how the stem is
written. The two formats that remain have no wrong end:

- **Two-choice** — both options are luxury-worded preferences. The question is
  always "more A or more B," never "do you or don't you." Regular items score
  `±2` per option; anchors score `±3`.
- **Frequency — Very often / Often / Sometimes / Rarely.** For behaviors where
  frequency is a style, not a virtue. Both poles stay attractive because high is
  not better than low; they just measure different places on the axis.

No sliders, no ranking, no drag, no free text inside the quiz.

**Themed mixed blocks, not axis blocks.** Five blocks of four. Each block holds
exactly one question from each axis, in shuffled order, so she can never tell
which axis any block is targeting. Each block has an emotional theme that gives
the quiz a narrative arc.

> Reconciliation note: ChatGPT proposed 4 blocks of 5. That breaks the hard
> "≤4 questions between breaks" bar. We use **5 blocks of 4** instead: same 20
> questions, same 5-per-axis balance, but a break never sits more than 4
> questions away, and one-question-per-axis-per-block gives perfect balance.

| Block | Theme (her experience) | Break after? |
|---|---|---|
| 1 | How love feels when it's good | yes |
| 2 | How close you like to live | yes |
| 3 | When something feels uncertain | yes |
| 4 | How you show care, and what you do when it's hard | yes |
| 5 | What you want love to become | no, goes to loading |

**Anchor placement:** the four anchors close blocks 2, 3, 4, 5 (Block 1 is all
soft openers, no forced choice yet). Ending the quiz on the Purpose anchor
("what love is for") is the strongest emotional note to walk into the reveal on.

---

## 3. The 20 questions

Notation per option: `pole · weight`. "Keyed" = which pole the question leans
toward. Two soft items per axis are keyed toward the `+` pole and two toward the
`-` pole (kills position-gaming and auto-tapping). All questions are two-choice or
frequency — no agree/disagree format.

### Block 1 · How love feels when it's good

**Q1 · Expression · two-choice · keyed Expressive**
"When I feel something warm for someone, my first move is…"
- "Say it." → `E · 2`
- "Show it." → `R · 2`

**Q2 · Attunement · Frequency · keyed Attuned**
"How often do you notice small shifts in someone's mood or energy, even when nothing seems wrong?"
- Very often → `A · 2`
- Often → `A · 1`
- Sometimes → `S · 1`
- Rarely → `S · 2`
("Rarely" = when things seem fine, I trust they are — secure Settled, not low EQ.)

**Q3 · Purpose · two-choice · keyed Growth**
"When love feels good, I'm pulled more toward…"
- "Depth, honesty, and becoming together." → `G · 2`
- "Warmth, ease, and feeling at home." → `H · 2`

**Q4 · Closeness · two-choice · keyed Together**
"When someone really matters to me, I move…"
- "Closer, wanting to share more life." → `C · 2`
- "With warmth, but keeping my own ground." → `F · 2`

*Break 1.*

### Block 2 · How close you like to live

**Q5 · Closeness · two-choice · keyed Free**
"In a close relationship, I feel most like myself when…"
- "I have real space to be myself." → `F · 2`
- "We share a lot of daily life." → `C · 2`

**Q6 · Expression · two-choice · keyed Reserved**
"The love I give is easiest to see through…"
- "What I do." → `R · 2`
- "What I say." → `E · 2`

**Q7 · Purpose · two-choice · keyed Harmony**
"What I want love to do more of is…"
- "Ground me and feel like coming home." → `H · 2`
- "Stir me and keep growing us forward." → `G · 2`

**Q8 · Attunement · ANCHOR**
"In love, I trust the bond more through…"
- "The small shifts I can feel." → `A · 3`
- "The steady pattern over time." → `S · 3`

*Break 2.*

### Block 3 · When something feels uncertain

**Q9 · Closeness · two-choice · keyed Together**
"A relationship feels right when we have…"
- "A shared world we've built together." → `C · 2`
- "Full lives we bring to each other." → `F · 2`

**Q10 · Purpose · Frequency · keyed Growth**
"How often does a stretch of pure routine start to feel restless to you?"
- Very often → `G · 2`
- Often → `G · 1`
- Sometimes → `H · 1`
- Rarely → `H · 2`
("Rarely" = I love a calm routine — proud Harmony. Restlessness is a preference, not a virtue.)

**Q11 · Attunement · two-choice · keyed Attuned**
"When something feels slightly off between us, my first move is usually…"
- "Check in on what I'm sensing." → `A · 2`
- "Give it space and trust it'll surface." → `S · 2`

**Q12 · Expression · ANCHOR**
"My care is easiest to feel when it's…"
- "Said out loud, in words and affection." → `E · 3`
- "Shown quietly, through presence and what I do." → `R · 3`

*Break 3.*

### Block 4 · How you show care, and what you do when it's hard

**Q13 · Attunement · two-choice · keyed Settled**
"When we haven't connected in a few days, I'm more likely to…"
- "Trust we're solid and not read into it." → `S · 2`
- "Notice the gap and feel into how it's sitting." → `A · 2`

**Q14 · Purpose · two-choice · keyed Harmony**
"After a rough patch, what I need more is…"
- "To feel soft and close with each other again." → `H · 2`
- "To understand what the tension showed us." → `G · 2`

**Q15 · Expression · two-choice · keyed Expressive**
"When I'm proud of someone I love, I'm more likely to…"
- "Tell them directly." → `E · 2`
- "Show them through how I treat them." → `R · 2`

**Q16 · Closeness · ANCHOR**
"The closeness I keep coming back to feels like…"
- "A shared rhythm, woven into each other's days." → `C · 3`
- "A spacious bond, with room to breathe." → `F · 3`

*Break 4.*

### Block 5 · What you want love to become

**Q17 · Expression · Frequency · keyed Reserved**
"How often do you take a beat to find the right words before sharing a big feeling?"
- Very often → `R · 2`
- Often → `R · 1`
- Sometimes → `E · 1`
- Rarely → `E · 2`

**Q18 · Attunement · Frequency · keyed Settled**
"How often do you trust the overall sense of a relationship rather than tracking the small day-to-day signals?"
- Very often → `S · 2`
- Often → `S · 1`
- Sometimes → `A · 1`
- Rarely → `A · 2`
("Rarely" = I stay close to the daily signals, that's how I know where we are — proud Attuned.)

**Q19 · Closeness · two-choice · keyed Free**
"Time to myself in a relationship usually leaves me feeling…"
- "Recharged and more open." → `F · 2`
- "Like I miss them and want to reconnect." → `C · 2`

**Q20 · Purpose · ANCHOR**
"The love I'm most drawn to leaves me feeling…"
- "Awake, honest, and growing." → `G · 3`
- "Safe, peaceful, and at ease." → `H · 3`

*Goes to calibration → reveal.*

### Coverage check

| Axis | Questions | Keyed `+` | Keyed `-` | Anchor |
|---|---|---|---|---|
| Closeness | Q4, Q5, Q9, Q16, Q19 | Q4, Q9 | Q5, Q19 | Q16 |
| Attunement | Q2, Q8, Q11, Q13, Q18 | Q2, Q11 | Q13, Q18 | Q8 |
| Expression | Q1, Q6, Q12, Q15, Q17 | Q1, Q15 | Q6, Q17 | Q12 |
| Purpose | Q3, Q7, Q10, Q14, Q20 | Q3, Q10 | Q7, Q14 | Q20 |

Format mix: 12 × two-choice + 4 × Frequency + 4 × Anchor. Every axis is keyed
2 toward `+` and 2 toward `-`, so auto-tapping any position scores near zero.

Axis order per block (proof the skeleton is hidden):
B1 E-A-P-C · B2 C-E-P-A · B3 C-P-A-E · B4 A-P-E-C · B5 E-A-C-P.

---

## 4. Scoring engine

Each option contributes a signed weight toward its axis. The existing
`scoreAxes()` in `obv3.js` already does exactly this (`dir * w`, summed per
axis); it works unchanged with the new question data.

**Per-format weights** (toward the keyed pole; the opposite pole is the negative
of the same magnitude):

- Two-choice: each option `±2` toward its pole.
- Frequency: Very often `±2`, Often `±1`, Sometimes `∓1`, Rarely `∓2`.
- Anchor (two-choice): each option `±3` toward its pole.

**Range per axis:** four non-anchor items (max `±2` each = `±8`) plus one anchor
(`±3`) = **`±11`**. Uniform across all four axes, so magnitudes are comparable.

**Resolve the code:** sign of each axis sum gives the letter (C/F, A/S, E/R,
G/H).

**Tie rule (replaces the current `+`-pole default):** if an axis sum is exactly
0, use the **anchor option's** direction for that axis. The anchor is the
cleanest single signal and is the reason we do not need a separate tiebreaker
screen. (A true 0 is rare, since the anchor alone is `±3`; it only happens when
the four soft items cancel the anchor exactly.)

**Confidence** per axis, from `|sum|` on the `±11` range:

| Band | `|sum|` | Used for |
|---|---|---|
| Strong | 7 to 11 | high-confidence language in the read |
| Clear | 4 to 6 | normal language |
| Leaning | 1 to 3 | hedged language ("you lean…, though this can shift") |
| Tie | 0 | anchor decides; lowest confidence, most hedged |

Store for each axis: `{ letter, sum, band }`. This is what makes the read feel
un-boxed (see §9, the 4-axis map and the hedge lines).

---

## 5. Shuffle and balance rules

- **Shuffle two-choice option order** with a per-user seed (stable within a
  session). Randomize which option renders first so the `+` pole is not always
  on top. Anchors follow the same shuffle rule.
- **Never shuffle Frequency scales.** Very often → Rarely must read in stable
  descending order every time, or she re-parses the scale each question and
  fatigue leaks in.
- **Balance the keying** (done in §3): 2 soft items per axis lean `+`, 2 lean
  `-`. This is the real anti-gaming guard — auto-tapping any position scores near
  zero across axes.
- **No virtue words as the keyed concept.** This was the root failure of
  agree/disagree formats (Format A), and it is why Format A is eliminated. In
  two-choice format the risk is a question where one option sounds like the
  admirable goal and the other sounds like complacency. Solved by always framing
  as a genuine trade-off between two goods: both options must be something a
  proud, healthy person would claim.

---

## 6. The breaks

Four breaks, after Blocks 1 to 4. Each is a single short reflection. Rules:

- Speak to the **theme**, never her score. Never "you seem highly attuned" (that
  biases later answers and exposes the axis).
- Sell Kael indirectly, the velvet knife: most advice treats everyone the same,
  Kael is building around her specifically. Never "Kael will help you with this."
- No axis names, no "not X, it's Y," no em dashes.

**Break 1** (after "how love feels good")
> There are a lot of ways to feel close.
> Some people feel it through nearness and shared days. Others feel it with more
> room to breathe. Both are real. I'm listening for yours.

**Break 2** (after "how close you live") — carries the velvet knife
> Small things can feel loud in love.
> Some people feel every shift in tone. Others trust the steady picture. Most
> advice ignores the difference. I'm building around yours.

**Break 3** (after "care and hurt")
> How you protect yourself tells me a lot.
> When something stings, some people move toward it and some need a beat first.
> Neither is wrong. It just tells me how to meet you when it counts.

**Break 4** (after "care") — anticipation + situation thread
> [Name], I'm starting to see the shape of it.
> One more short stretch and I'll show you what I see, including what's really
> going on with {SIT_PHRASE}.

---

## 7. Situation threading map

The situation is captured at screen 2 (chips, optional one line). It reappears
here, each as a `{SIT_PHRASE}` token (a grammatical fragment, see §12) so the
sentences read clean:

| Where | How it shows up |
|---|---|
| Screen 3 (reflect) | one true sentence back on her exact chip (relief beat) |
| Screen 4 (why) | "To really help with {SIT_PHRASE}, I need to understand…" |
| Break 4 | "what's really going on with {SIT_PHRASE}" |
| Calibration | one loader step references it |
| Read, "what helps" | closes on her situation, not generic |
| The turn | the concrete 11pm moment is her situation |
| Paywall | "You came in carrying {SIT_PHRASE}. The full read tells you what to do with it." |

---

## 8. Full screen flow

Counts honestly to ~45 screens. By the load metric in §0 this is fine: the median
screen is one tap or one paragraph of payoff about her, and a break never sits
more than 4 questions away. What we cut is not length, it is *effort per screen*.

### Act 1 · Open in the feeling (screens 1 to 10)

**1 · Hero.** Opens in the feeling, not the product. One promise, one CTA.
> It's late, and you're still thinking about someone.
> A few honest minutes, and I'll show you how you love, what scares you in it,
> and what keeps repeating.
> CTA: Start

**2 · Situation chips.** Her first action is a low-effort, emotionally relevant
tap (not typing). Reuse the shipped `SITUATIONS` list (it is already
non-pathological). Optional one-line text field below, skippable.
> What's pulling at you right now?
> Pick whatever's closest. This is where we start.

**3 · Situation reflect.** One true sentence back on her pick (the taste of
relief). Reuse the shipped `SITUATION_REFLECT` lines. CTA: Continue.

**4 · Why this.** Sells the quiz using her situation.
> You know who you're drawn to. Few people know who they become once they're in
> it.
> That second part is your Love Archetype: the version of you that shows up when
> someone really matters, the part that reaches, or protects, or goes quiet. To
> really help with {SIT_PHRASE}, I need to see yours first.
> CTA: Show me how

**5 · Privacy.** Micro-reassurance before personal questions.
> Before we go in: this stays between us.
> Your answers only go toward getting your read right. No one else sees them.
> CTA: Okay

**6 · Name.** The only typed field. Warm, no "this isn't a form."
> What should I call you?
> placeholder: Your first name · CTA: Continue

**7 · Age.** Tap a range (lower load than typing a number).
> How old are you?
> 18-24 · 25-34 · 35-44 · 45-54 · 55+

**8 · Gender.** Tap.
> How do you identify?
> Woman · Man · Non-binary · Prefer not to say

**9 · Relationship context.** Tap. Different from the situation (this is
structural, that was emotional).
> Where are you right now?
> Single and reflecting · Dating someone · In a relationship · Married ·
> It's complicated · Just out of something

**10 · Quiz intro.** Both load-bearing microcopy lines live here.
> Twenty quick questions. Mostly taps.
> Answer as you usually are when someone really matters, especially lately.
> Choose what feels true, not what sounds healthiest. Every answer is a real way
> to love.
> CTA: Start

### Act 2 · The quiz (screens 11 to 34)

20 questions + 4 breaks, per §3 and §6. Live progress bar (percentage, see §0).
Question screens: stem at top, options directly under it (never floated to the
bottom). On select, a brief inline acknowledgement may appear under the tapped
option on a few mid-quiz items only (not every screen, or it reads as
sycophantic). Auto-advance after the ack, with an undo affordance.

### Act 3 · The mirror (screens 35 to 41)

**35 · Calibration.** Percentage multi-loader. Never names "16," never names an
axis, never says "lookup" or "algorithm." Feels like Kael putting words to what
it heard. One step references her situation.
> Steps: "Reading how you answered." · "Putting the pieces together." ·
> "Holding it against {SIT_PHRASE}." · "Putting words to it."

**36 · Reveal.** Name + glyph + essence, then **one echo line drawn from her
strongest axis** (see §9), then the velvet-box reassurance *after* the
recognition, never before.
> You're [Name of archetype].
> [essence]
> [echo line from her highest-confidence axis]
> (small, below) This isn't a box. It's just who you become when you let someone
> in.

**37 · Your pattern, in four dimensions.** The machinery revealed *as
precision*. Four simple bars/positions (placeholder visuals, not code-drawn art),
one per axis, showing her lean and confidence. This is free, and it is what makes
the read feel un-boxed.
> Here's the pattern underneath your answers.
> Closeness · Attunement · Expression · Purpose, each shown as a position with a
> confidence weight. Leaning axes are labeled honestly ("leans free, lightly").

**38 to 41 · Mini-read (free).** The recognition payoff, in beats. Pull from the
archetype's `ARCHETYPES` fields. Threaded with her situation on the last beat.
- 38 · How you love → `opening`
- 39 · What you're afraid of → `fear`, `need`
- 40 · When it's threatened → `conflict`, `misread`
- 41 · What actually helps → `helps`, closing on {SIT_PHRASE}

### Act 4 · Future self and the ask (screens 42 to 44)

**42 · The turn.** A concrete before/after of a real moment, hers. No "growth
edge." Built from her archetype's `growth` line plus her situation.
> Right now, when {SIT_PHRASE} hits, here's what happens. Six weeks from now,
> here's what happens instead. Same you, steadier hands.

**43 · How Kael helps.** Features as benefits, bound to the archetype and the
situation. Fix the shipped `FEATURES` copy (no "receipt of growth," no "growth
edge," no "updates as we talk"). See §12.

**44 · Paywall.** Sell the full read as a reward. No locked/blurred tease (breaks
the design bar). Anchor to her situation and price. Visible low-shame decline.
> You met [archetype]. Now let's change how you love.
> You came in carrying {SIT_PHRASE}. The full read tells you what to do with it,
> the next time it hits at 1am, in a response built for you and not a generic
> script.
> [price, framed as less than a coffee a week]
> Primary: Unlock the full read · Quiet: I'll keep my free read for now

---

## 9. Reveal echo and the read

**Echo line** (screen 36): choose the axis with the highest confidence
(`max |sum|`); use that pole's line. This is the one piercing, specific
recognition that separates a read from a horoscope.

| Pole | Echo line |
|---|---|
| Together | "and I can see how much you want someone woven into your days." |
| Free | "and I can see how much you need room to stay fully yourself." |
| Attuned | "and I can see how closely you read the people you love." |
| Settled | "and I can see how steady you stay, even when it goes quiet." |
| Expressive | "and I can see how openly your warmth comes out." |
| Reserved | "and I can see how much you say through what you do." |
| Growth | "and I can see how much you want love to keep growing you." |
| Harmony | "and I can see how much you want love to feel like peace." |

**Hedge lines for leaning axes** (the 4-axis map and read): when an axis band is
Leaning or Tie, the read should soften, e.g. "You lean toward spacious trust,
though this part of you can shift depending on how safe the relationship feels."
Confidence honesty makes the result feel more real, not less.

**Free vs paid.** Free: the reveal, the 4-axis map, the four mini-read beats (how
you love / fear / when threatened / what helps). Paid: the full per-field read,
the deeper situational guidance, and the ongoing "what's alive right now." Sell
the paid read with confidence, never with a blur.

---

## 10. Copy laws (enforce on every line)

- No em dashes. Use commas, periods, "and," or restructure.
- No "it's not X, it's Y."
- No therapy-speak: growth edge, activated, hold space, receipt, sit with,
  unpack, your truth.
- No software voice: your read updates, syncing, personalize your experience.
- No filler poetry that floats above her ("looking for somewhere to land").
- Options sit directly under the question, never floated to the bottom.
- Acks appear inline under the tapped option, and only on a few items.
- Loaders are percentage multi-loaders, never spinners, and never name "16."
- Every option is an attractive, valid way to love.

---

## 11. What this fixes from the shipped build

- Agree/disagree format (Format A) eliminated entirely → all questions are now
  two-choice between two luxury-worded goods, or frequency. No "Not really" that
  risks reading as "I don't want to grow" or "I have no sense of self."
- Pathological options (the "feel unsettled," "always scanning," "replay what
  might have changed," "repeating old patterns" family) → all rewritten so both
  poles are luxury-worded.
- Tiebreakers firing for everyone at double weight → no separate tiebreaker;
  anchors carry the clean signal and break ties.
- Tie defaults silently favoring the `+` pole on three axes → tie resolved by the
  anchor's direction.
- Calibration naming "16" and "closeness vs freedom" → loader speaks in her
  language and her situation.
- Lanterns naming the axis and reading like horoscopes → theme-only breaks,
  velvet-knife sell.
- Situation captured then dropped → threaded through reflect, why, break 4,
  calibration, read, turn, and paywall.
- Reveal that hedges before she has felt anything → echo line first, reassurance
  after; plus the 4-axis map as earned precision.
- `FEATURES` copy with "receipt of growth" / "growth edge" → rewritten (§12).

---

## 12. Build notes (for `obv3.js` and `OnboardingV3.jsx`)

**Reuse unchanged:** `ARCHETYPES` (16), `scoreAxes()` (signed-weight sum already
matches the new model), `SITUATIONS`, `SITUATION_REFLECT`.

**Replace:**
- `QUESTIONS` → the 20 in §3. Each item: `{ axis, fmt: 'two-choice'|'freq'|'anchor',
  prompt, options: [{ name, pole, w }] }`. Keep the existing `pole → axis` and
  positive-pole maps.
- `resolveCode()` → on an exact 0 for an axis, use that axis's anchor option's
  pole instead of the current `>= 0` default. Add a `confidence(answers)` helper
  returning `{ CF, AS, ER, GH }` each as `{ letter, sum, band }`.
- `LANTERNS` → the four breaks in §6 (theme-only, situation thread on break 4).
- `CALIB_STEPS` → §8 screen 35 (no "16," one situation step).
- `FEATURES` → fix copy:
  - Chat: "When you spiral at 1am, I help you see what's happening and what to do,
    tuned to how {A} moves."
  - What's alive right now: "Where your heart is this week, and the one thing
    worth working on. Right now: {SIT}."
  - Journey: "Proof you're changing. The texts you didn't send, the spirals you
    caught early."
  - Lessons: "Short reads tuned to {A}, never generic advice."
- `FLOW` → the §8 order. Quiz screens grouped into 5 blocks of 4 with breaks
  after blocks 1 to 4. Add the demographic screens (age, gender, context) and the
  4-axis map screen.

**Add:**
- `SIT_PHRASE` map: chip → grammatical fragment, for clean substitution.
  - "I'm spiraling over someone" → "the person on your mind"
  - "We keep fighting" → "the fighting"
  - "They feel distant" → "the distance you're feeling"
  - "I'm getting mixed signals" → "the mixed signals"
  - "I'm healing from a breakup" → "what you're healing from"
  - "It's good, but I'm scared it won't last" → "the fear that it won't last"
  - "Something else" → "what you're carrying"
- `ECHO` map: pole → line (§9).
- Per-user seed for two-choice option shuffling (all two-choice and anchor
  questions). Frequency scales are never shuffled.

**Studio:** the V3 tab and dev bar already exist. Gate the dev bar behind a flag
so it never renders near a real user.
