# Kael Onboarding V4 — Full Content & Copy

_Source of truth: `src/obv4.js` (FLOW, QUESTIONS, BREATHERS, READS, etc.) and a few hard-coded strings in `src/screens/OnboardingV4.jsx` (collected under §9). Edit copy here, then port it back._

38 screens. Quiz two-choice + single-select auto-advance on tap; sliders, statement sliders, and multi-selects use a Continue button. Light theme only.

## 1. Flow (38 screens, in order)

| # | id | kind | act |
|---|---|---|---|
| 1 | welcome | welcome | 1 |
| 2 | situation | situation | 1 |
| 3 | situationText | situationText | 1 |
| 4 | hero | hero | 1 |
| 5 | trust | trust | 1 |
| 6 | name | name | 1 |
| 7 | age | age | 1 |
| 8 | gender | gender | 1 |
| 9 | relcontext | relcontext | 1 |
| 10 | prep | prep | 1 |
| 11 | br5 | breather | 2 |
| 12 | q1 | two | 2 |
| 13 | q2 | two | 2 |
| 14 | q3 | two | 2 |
| 15 | q4 | two | 2 |
| 16 | br1 | breather | 2 |
| 17 | qf1 | slider | 2 |
| 18 | qf2 | slider | 2 |
| 19 | qf3 | slider | 2 |
| 20 | qf4 | slider | 2 |
| 21 | br2 | breather | 2 |
| 22 | s_cf | statement | 2 |
| 23 | s_as | statement | 2 |
| 24 | s_er | statement | 2 |
| 25 | s_gh | statement | 2 |
| 26 | br3 | breather | 2 |
| 27 | q17 | single | 2 |
| 28 | q18 | multi | 2 |
| 29 | q19 | multi | 2 |
| 30 | br4 | breather | 2 |
| 31 | notif | notif | 2 |
| 32 | calibration | calibration | 2 |
| 33 | reveal | reveal | 3 |
| 34 | miniread | miniread | 3 |
| 35 | fullread | fullread | 3 |
| 36 | ready | ready | 4 |
| 37 | thirtydays | thirtydays | 4 |
| 38 | paywall | paywall | 4 |

## 2. Act 1 — Open + get to know you

### welcome — illustration + congratulate
- **Title:** You showed up. That is the first move.
- **Sub:** Most people sit with this alone for years. You just chose not to, so let's make sense of how you love.
- **Italic phrase in sub:** "how you love"
- **Button:** Begin

### situation — tappable situation chips (see §6)
- **Title:** What brings you here?
- **Sub:** Pick what's closest. We start there.
- **Button:** Continue

### situationText — only if "Something else" chosen
- **Title:** Say it in your words.
- **Sub:** Whatever is on your mind right now. Keep it short.
- **Placeholder:** In a few words…
- **Button:** Continue

### hero — the promise (kicker "Now, a promise")
- **Title:** There's a you that only love brings out.
- **Italic word in title:** "you"
- **Sub:** A few honest minutes, and I'll show you how you love, what scares you in it, and what keeps repeating.
- **Button:** Show me

### trust — kicker "Before we start" (title/sub hard-coded — see §9)
- **Button:** I value my privacy

### name
- **Title:** What should Kael call you?
- **Sub:** Stays between us, only used to sharpen your read.
- **Placeholder:** Your first name
- **Button:** Continue

### age — auto-advance ranges (see §6); {name} fills with the entered name
- **Title:** How old are you, {name}?
- **Sub:** Closeness and conflict shift across life stages. This keeps your read honest to yours.
- **Button:** Continue

### gender — auto-advance (see §6)
- **Title:** How do you identify?
- **Sub:** So Kael speaks to you, not a generic template.
- **Button:** Continue

### relcontext — auto-advance (see §6)
- **Title:** Where are you right now?
- **Sub:** It changes what helps most right now.
- **Button:** Continue

### prep — kicker "16 love archetypes"
- **Title:** Let's find your love archetype.
- **Sub:** A 3-minute quiz that reveals how you attach, react, protect yourself, and grow in love.
- **Button:** Start

## 3. Act 2 — The quiz

**Segment eyebrows** (shown top-right during each block):
- Block 1: How you reach for love
- Block 2: What you need to feel safe
- Block 3: How you show up when it counts
- Block 4: Almost there

### Block 1 — two ways of loving (anchors, heaviest weight)

**q1** — two-choice, auto-advance · axis: Closeness (CF) · weight 1.5
- Prompt: When something good happens, the first thing I want is
  - Share it with someone close  →  Close (C)
  - Sit with it a while myself  →  Free (F)

**q2** — two-choice, auto-advance · axis: Expression (ER) · weight 1.5
- Prompt: My love is loudest in
  - Words and affection  →  Expressive (E)
  - Showing up and doing  →  Reserved (R)

**q3** — two-choice, auto-advance · axis: Tilt (GH) · weight 1.5
- Prompt: The relationship I want feels most like
  - A journey that keeps opening  →  Growth (G)
  - A calm place to return to  →  Harmony (H)

**q4** — two-choice, auto-advance · axis: Attunement (AS) · weight 1.5
- Prompt: When the mood between us shifts, I
  - Catch it right away  →  Attuned (A)
  - Take the day as it comes  →  Settled (S)

*Breather 1* — kicker "Already, a shape" · title "There's a pattern in how you reach." · body "Not better, not worse. Just yours. Kael learns it so it can catch you the moment it shows up." · italic "Just yours"

### Block 2 — how often (sliders)

**qf1** — how-often slider · axis: Closeness (CF) · weight 0.8
- Prompt: How often do you crave a whole day that's just yours?
- Left: Rarely → Close (C)  ·  Right: Frequently → Free (F)

**qf2** — how-often slider · axis: Attunement (AS) · weight 0.8
- Prompt: How often do you sense how someone feels before they say it?
- Left: Rarely → Settled (S)  ·  Right: Frequently → Attuned (A)

**qf3** — how-often slider · axis: Expression (ER) · weight 0.8
- Prompt: How often do you put what you feel straight into words?
- Left: Rarely → Reserved (R)  ·  Right: Frequently → Expressive (E)

**qf4** — how-often slider · axis: Tilt (GH) · weight 0.8
- Prompt: How often does a calm, settled stretch feel just right?
- Left: Rarely → Growth (G)  ·  Right: Frequently → Harmony (H)

*Breather 2* — kicker "A small truth" · title "None of these needs is too much." · body "Closeness, space, intensity. There's no right amount, only yours, and a love built to fit it. Kael helps you ask for it out loud." · italic "only yours"

### Block 3 — does this sound like you? (statement sliders)

**s_cf** — statement slider · axis: Closeness (CF) · weight 1
- Statement: "I'm happiest when the person I love is woven right into my everyday life."
- Left: Not like me → Free (F)  ·  Right: Exactly me → Close (C)

**s_as** — statement slider · axis: Attunement (AS) · weight 1
- Statement: "I pick up on the smallest shift in someone's mood, often before they do."
- Left: Not like me → Settled (S)  ·  Right: Exactly me → Attuned (A)

**s_er** — statement slider · axis: Expression (ER) · weight 1
- Statement: "When I feel love, I say it out loud. I don't keep it quiet."
- Left: Not like me → Reserved (R)  ·  Right: Exactly me → Expressive (E)

**s_gh** — statement slider · axis: Tilt (GH) · weight 1
- Statement: "I want a love that keeps growing and changing me, more than one that just stays calm."
- Left: Not like me → Harmony (H)  ·  Right: Exactly me → Growth (G)

*Breather 3* — kicker "The honest part" · title "This is the part you usually guard." · body "Most people armor over exactly this. Kael holds it up to the light, so the pattern stops running you from the dark." · italic "to the light"

### Block 4 — conflict (single) + values + emotional weather (multi)

**q17** — single-select, auto-advance · axis: mixed (per option) · weight 1
- Prompt: When we clash, my instinct is to
- Sub: Go with your gut, not your best behavior.
  - Say it straight  →  Expressive (E)
  - Go quiet, retreat  →  Reserved (R)
  - Smooth it over fast  →  Harmony (H)
  - Get to the root of it  →  Growth (G)
  - Read every reaction  →  Attuned (A)
  - Trust it'll pass  →  Settled (S)

**q18** — multi-select (pick up to 3) · each pick +0.4 to its pole
- Prompt: A great relationship is one that
  - Feels like a safe harbor  →  Harmony (H)
  - Leaves me free to be myself  →  Free (F)
  - Keeps opening new depth  →  Growth (G)
  - Weaves us into each other's lives  →  Close (C)
  - Says the loving thing out loud  →  Expressive (E)
  - Notices without me explaining  →  Attuned (A)

**q19** — multi-select (pick up to 3) · 2-column tiles · each pick +0.4 to its pole
- Prompt: On most days, love leaves me feeling
  - Anxious  →  Attuned (A)
  - Hopeful  →  Growth (G)
  - Lonely  →  Close (C)
  - Peaceful  →  Harmony (H)
  - Affectionate  →  Expressive (E)
  - Secure  →  Settled (S)
  - Guarded  →  Reserved (R)
  - Smothered  →  Free (F)

*Breather 4* — kicker "What it adds up to" · title "That's your pattern, showing itself." · body "Nothing here is a flaw. It's how you learned to stay safe. From here, Kael helps you keep the gift and drop the cost." · italic "keep the gift"

### Breather 5 — credibility (placed right after "prep", before the quiz)
- Kicker: The method
- Title: This isn't a personality quiz.
- Body: Your answers run through attachment theory and real relationship science, never guesswork.
- Italic phrase: "real relationship science"

### notif — kicker "One small thing"
- **Title:** Want Kael to check in gently?
- **Sub:** A quiet nudge when it helps, nothing more.
- **Button:** Yes, check in on me
- **Secondary button:** Not now

## 4. Calibration loader (% counter)

Sequential mini-steps:
- Reading your answers
- Mapping how you connect
- Weighing what you reach for
- Putting it into words

Rotating 5-star review lines:
- "Felt like it actually knew me."
- "I finally have words for it."
- "Scarily accurate, in the best way."
- "The first one that didn't feel generic."

## 5. Act 3 — Reveal + read

- **Reveal:** label "Your Love Archetype" + glyph + archetype **name** + **essence** line (per archetype, §8).
- **Mini-read** (one scrollable screen): 4 axis bars → mini prose (love.body bold lead + respond.body italic lead, "— Kael") → **How you love** chips (love.chips) → **What you value in love** 2×2 icon tiles (value.chips) → **What activates you** chips (triggers.chips) → **What growth looks like for you** pointers (aspiration + first 2 "with Kael" lines). Grey note at bottom: "This read gets sharper the more you talk to Kael." Button: "This sounds like me".
- **Full read (teaser):** label "The full read" · title "The Complete {Archetype} Read." · "1,000+ words · 6 chapters" · 01 Your pattern, in depth · 02 What you protect, and why · 03 Who fits you, who clashes · 04 How the {Archetype} grows in love · "Unlocks inside Kael".

**Axis bars** (label · left pole ↔ right pole):
- Closeness: Free ↔ Close
- Attunement: Settled ↔ Attuned
- Expression: Reserved ↔ Expressive
- Tilt: Harmony ↔ Growth

**Echo lines** (per pole; available in data):
- Close (C): and I can see how much you want someone woven into your days.
- Free (F): and I can see how much you need room to stay fully yourself.
- Attuned (A): and I can see how closely you read the people you love.
- Settled (S): and I can see how steady you stay, even when it goes quiet.
- Expressive (E): and I can see how openly your warmth comes out.
- Reserved (R): and I can see how much you say through what you do.
- Growth (G): and I can see how much you want love to keep opening.
- Harmony (H): and I can see how much you want love to feel like peace.

## 6. Choice lists

**Situations** (screen "situation") — name → reflection shown when picked:
- **I'm spiraling over someone** — Spirals feel like thinking. They are usually feeling, looking for somewhere to land.
- **We keep fighting** — The same fight on repeat is rarely about the thing. It is about what the thing means.
- **They feel distant** — Distance is loud when you love someone. Let us find out what it is actually saying.
- **I'm getting mixed signals** — Mixed signals are exhausting because you keep doing the decoding alone. Not anymore.
- **I'm healing from a breakup** — Healing is not linear, and you are not behind. Let us start where you actually are.
- **It's good, but I'm scared it won't last** — Wanting to protect something good is not paranoia. It is love with skin in the game.
- **Something else** — Whatever it is, you do not have to carry it alone in your head anymore.

**Relationship context:** Single and reflecting · Dating someone · In a relationship · Married · It's complicated · Just out of something

**Age ranges:** 18-24 · 25-34 · 35-44 · 45-54 · 55+

**Gender:** Woman · Man · Non-binary · Prefer not to say

## 7. Scoring logic — full audit

_Implementation: `resolve(answers)` in [src/obv4.js](src/obv4.js). The user never sees axes or letters — only the final archetype._

### 7.1 The four axes

Every scored item pushes one axis toward its **+ pole** or **− pole**. A positive running sum = + pole.

| Axis | + pole (positive sum) | − pole (negative sum) | Anchor question |
|---|---|---|---|
| CF · Closeness | **C** Close | **F** Free | q1 |
| AS · Attunement | **A** Attuned | **S** Settled | q4 |
| ER · Expression | **E** Expressive | **R** Reserved | q2 |
| GH · Tilt | **G** Growth | **H** Harmony | q3 |

The four resolved letters are concatenated in fixed order **C-A-E-Tilt** → a 4-letter code → 1 of 16 archetypes.

### 7.2 What each question contributes

| Question | Kind | Axis it scores | Contribution to that axis |
|---|---|---|---|
| q1 | two-choice (anchor) | CF | **±1.5** |
| q4 | two-choice (anchor) | AS | **±1.5** |
| q2 | two-choice (anchor) | ER | **±1.5** |
| q3 | two-choice (anchor) | GH | **±1.5** |
| qf1 | how-often slider | CF | graded **±0.8** |
| qf2 | how-often slider | AS | graded **±0.8** |
| qf3 | how-often slider | ER | graded **±0.8** |
| qf4 | how-often slider | GH | graded **±0.8** |
| s_cf | statement slider | CF | graded **±1.0** |
| s_as | statement slider | AS | graded **±1.0** |
| s_er | statement slider | ER | graded **±1.0** |
| s_gh | statement slider | GH | graded **±1.0** |
| q17 | single-select (conflict) | whichever axis the chosen option's pole belongs to | **±1.0** to that one axis |
| q18 | multi-select (≤3) | the axis of each picked option's pole | **+0.4 per pick** toward that pole |
| q19 | multi-select (≤3) | the axis of each picked option's pole | **+0.4 per pick** toward that pole |

Sign convention: a pick/answer on the **+ pole** adds; on the **− pole** subtracts. Weights live on each question in `QUESTIONS` (`weight`), except the multi pick weight (`MULTI_W = 0.4`).

### 7.3 Contribution formulas

- **Two-choice / single-select** (`q1–q4`, `q17`): `+weight` if the chosen pole is the axis's + pole, else `−weight`.
- **Sliders & statements** (`qf*`, `s_*`): the input is a 0–100 value, centre = 50 (untouched). 
  `delta = ((value − 50) / 50) × weight` → range `[−weight, +weight]`. 
  Then signed by which end is the + pole: `right.pole === +pole ? delta : −delta`. 
  So a slider dragged fully to a + pole end contributes `+weight`; left to centre contributes `0`; an untouched slider (50) contributes **0** (neutral).
- **Multi-select** (`q18`, `q19`): for each picked option, `+0.4` if its pole is the + pole, else `−0.4`. Unpicked options contribute nothing.
- **Unanswered questions contribute 0** (skipped entirely).

A single full-strength support (≤1.0) can never out-vote an anchor (1.5), but **two aligned supports can** — by design, the anchor only decides genuine ties.

### 7.4 Per-axis sum & resolution

For each axis, `axisSum` adds up every item above. Then the letter is chosen:

```
sum >  +0.15  → + pole   (C / A / E / G)
sum <  −0.15  → − pole   (F / S / R / H)
|sum| ≤ 0.15  → near-tie → use the ANCHOR's chosen pole (q1/q4/q2/q3)
                (if the anchor itself is unanswered, fall back to the − pole)
```

`TIE_EPS = 0.15`. **There are no tiebreaker screens** — ties resolve silently to the anchor.

### 7.5 Dramatic-archetype safety

The three "intense" types must *earn* their Growth, so a barely-Growth result can't mint one:

```
if code ∈ { CAEG (Wildheart), FAEG (Tempest), FARG (Alchemist) }
   AND Tilt resolved to G
   AND Tilt sum < 0.6 (DRAMATIC_MIN)
then flip G → H to the calmer neighbour:
   CAEG → CAEH (Devoted)
   FAEG → FAEH (Wanderer)
   FARG → FARH (Sentinel)
```

(Verified: a Tilt sum of 0.40 with otherwise-FAE answers yields Wanderer, not Tempest.)

### 7.6 Confidence band + reveal-bar position (display only)

Each axis also gets a `band` and a normalised marker position `pos` for the reveal bars (these don't change the result):

- **band:** `|sum| ≥ 2 → strong · ≥ 1 → clear · else leaning`. `onLine = |sum| ≤ 0.15`.
- **pos** (0–100, marker on the bar): `clamp(50 + (sum / AXIS_MAX) × 50, 6, 94)`, where `AXIS_MAX = 4.5` for every axis (the deterministic items 1.5 + 0.8 + 1.0 = 3.3, plus a 1.2 multi-pick headroom). Strongly-answered axes peg near 6/94.

### 7.7 Worked example (→ The Harbor, CSEH)

Anchors: q1 Close (+1.5 CF), q4 Settled (−1.5 AS), q2 Expressive (+1.5 ER), q3 Harmony (−1.5 GH). Everything else left neutral/unanswered →

| Axis | sum | letter | pos |
|---|---|---|---|
| CF | +1.5 | C | 67 |
| AS | −1.5 | S | 33 |
| ER | +1.5 | E | 67 |
| GH | −1.5 | H | 33 |

Code **CSEH → The Harbor**. If CF had summed to exactly 0 (supports cancelling the anchor), the CF letter would fall back to q1's pole (C) — never a coin-flip.

### 7.8 Edge cases / audit notes

- **Untouched sliders** (value 50) and **unanswered questions** score 0 — a user who only taps the four anchors still resolves cleanly (anchors decide all four axes).
- **q17 (single)** lands on exactly one axis (the chosen pole's), so it nudges only one of the four.
- **Multi caps at 3 picks** per question; the same pole can appear in both q18 and q19, so a pole can collect up to +0.8 from the multis.
- **Closeness (C/F) is deliberately light in block 4** — q17's poles are E/R/H/G/A/S only, so the conflict question never touches CF; Closeness is already triple-covered by q1 + qf1 + s_cf. CF support in block 4 comes only from the multis (q18 "Weaves us"/"Leaves me free", q19 "Lonely"/"Smothered").
- All randomness is display-order only (two-choice option order); scoring is fully deterministic.

## 8. The 16 archetypes (read content)

### CSEH · The Harbor
**Essence:** The safe place love comes home to.

**How you love.**  You love out loud and you mean it. You're the one sending the warm text, remembering the small stuff, making it easy to be around you. And you trust them back, which is rarer than you think.
Chips: `texts back warm` · `remembers the little things` · `doesn't cling` · `easy to be around`

**What you value.**  You want a relationship that feels calm. Someone steady, someone safe. Not dramatic, not a guessing game. Just warm and easy, day after day.
Chips: `wants calm` · `needs steady` · `wants to feel safe` · `no drama`

**What activates you.**  What gets you is when they suddenly go cold. One short reply, one quiet hour, and your stomach drops. You're already bracing for something to be wrong before you even know if it is.
Chips: `hates when they go quiet` · `reads the short reply` · `braces for the worst` · `spots the chill fast`

**How you respond.**  So you smooth it over. You fix the mood, you keep it light, you tell yourself it's fine. The catch: the people closest to you rarely know when they've hurt you, because you've already packed it away.
Chips: `smooths it over` · `says it's fine` · `swallows the hurt` · `they never hear it`

**Aspiration:** Kael helps you say the hard thing while it's still small, so you get met, not just kept calm.

**Shift:** The smoothing reflex  →  You, saying it

| Moment | Without Kael | With Kael |
|---|---|---|
| They go flat and one-word | You get chattier to thaw them out | Ask what shifted before you fill the silence |
| Something they did stung | You file it away and act unbothered | Name the small sting the same day it lands |
| A real disagreement surfaces | You smooth it over to keep calm | Let the talk stay bumpy until it finishes |

**Paywall feature rows:**
- **One message away** — When you catch yourself smoothing it over again, I'll help you say the real thing.
- **This was the surface** — The full read goes into what you protect and the one move that changes it.
- **I keep up with you** — Whatever you walked in carrying stays in view as it shifts.

---

### CSEG · The Kindler
**Essence:** The one who loves you toward what's next.

**How you love.**  You're all in and you just say it. You're not lying awake wondering if they'll leave, you trust that part. You're already thinking about the next trip, the next version of you two, what's coming.
Chips: `says it out loud` · `always thinking ahead` · `never plays it cool` · `trusts they'll stay`

**What you value.**  You want a relationship that keeps growing, not one that just sits there. You'd take a hard, real conversation over an easy night where nothing happens. Coasting is your nightmare.
Chips: `wants you both growing` · `hates coasting` · `picks depth over easy` · `never wants it to stall`

**What activates you.**  What gets to you is when it goes flat. When you two settle into the same week on repeat and nobody's reaching for anything. A comfortable, predictable nothing makes you itch.
Chips: `dreads the plateau` · `scared of going stale` · `hates predictable` · `needs something to move toward`

**How you respond.**  So you push. Something feels stuck and you want to fix it tonight, right now. But to someone who was happy as is, it lands like a grade, and they start bracing for the next thing you'll want changed.
Chips: `wants to fix it now` · `brings it up at 11pm` · `comes off like a verdict` · `they start bracing`

**Aspiration:** Kael helps you let some good moments stay finished, so your reaching for more lands as closeness instead of a verdict.

**Shift:** The fear of going stale  →  You, reaching on purpose

| Moment | Without Kael | With Kael |
|---|---|---|
| A calm, easy week | You call it a rut and propose a fix | Name one thing you loved this week, full stop |
| They share a small win | You add what to push on next | Let the win land before you build on it |
| A good night winding down | You open a deep talk at 11pm | Save the big topic, ask for time tomorrow |

**Paywall feature rows:**
- **Before you push tonight** — When you want to fix it right now, I'll help you say it so it lands as "come closer," not "do better."
- **Where you're actually driving** — The full read maps what you're chasing when you push, and where staying put would have grown it faster.
- **I track the climb** — What you're working toward stays in view, so you can see it move instead of fearing it's stalled.

---

### CSRH · The Anchor
**Essence:** The one who shows up, every time.

**How you love.**  You don't say love, you do it. You show up, you follow through, you stay calm when everyone else is losing it. Checking if you're okay never even crosses your mind, because to you the doing is the saying.
Chips: `shows up every time` · `does, doesn't announce` · `calm when it counts` · `follow-through is the love`

**What you value.**  You want steady, not a show. No constant proving, no turning love into a thing you have to keep talking about. You just want it lived. The certainty is supposed to be settled already.
Chips: `steady over flashy` · `done arguing the obvious` · `no constant proving` · `just let it be settled`

**What activates you.**  What gets you is being asked to keep proving it. The check-ins, the are-we-okay, hashing out a thing you thought was a given. It reads like the one thing you were sure of is suddenly up for debate.
Chips: `hates are-we-okay` · `why prove the obvious` · `drama over nothing` · `not this again`

**How you respond.**  So you just do more. More handled, more shown up for, and you say even less. The cost is quiet: the person closest to you can feel taken care of but not let in, because everything you mean stays true and never said out loud.
Chips: `doubles down on doing` · `goes quiet` · `provides, doesn't open up` · `means it, never says it`

**Aspiration:** Kael helps you say the obvious thing out loud, so your showing up finally lands as the choosing it always was.

**Shift:** Letting the doing speak  →  You, saying it plainly

| Moment | Without Kael | With Kael |
|---|---|---|
| They ask if you still care | You list what you've done and feel cornered | Name the feeling first, then point to proof |
| They seem off, hard day | You fix the thing and stay quiet about them | Say one line about them before you fix anything |
| They ask are we okay | You go flat and let showing up answer | Say out loud you're choosing them right now |

**Paywall feature rows:**
- **Say it before you do it** — When you'd rather just handle it quietly, I'll help you put the unsaid part into words.
- **What your quiet costs** — The full read goes into why the people you're surest of feel least told, and the one sentence that fixes it.
- **I keep up with you** — Every small thing you finally said out loud stays in view, so you can see the steadiness land.

---

### CSRG · The Cultivator
**Essence:** The love that's being built while no one's watching.

**How you love.**  You don't say love, you do it. You take what matters and quietly make it better over time, way more into the actual change than getting credit for it. You'd rather just hand someone the better version than tell them you've been working on it.
Chips: `does it, doesn't say it` · `plays the long game` · `hates taking credit` · `deep over loud` · `shows up changed`

**What you value.**  You want something that gets deeper the longer it goes, not a nice surface that never goes anywhere. No drama, no big talks about the talk. Just real, solid, built to actually last.
Chips: `wants depth not small talk` · `no drama` · `built to last` · `tired of surface-level` · `in it for real`

**What activates you.**  It gets to you when it's all logistics and never anything real. When you only ever talk about the surface stuff and the actual conversation just never happens. You can feel when someone's dodging the deep part, and it bugs you.
Chips: `hates logistics-only talk` · `needs the real conversation` · `over surface-level` · `notices when it's skipped` · `wants someone to go there`

**How you respond.**  So you go quiet and try to fix it yourself. You work it out in your head, come back having changed something real, and figure they'll just feel it. They can't see any of that, so the quiet reads as you pulling away.
Chips: `retreats to fix it` · `works it out alone` · `reads as distant` · `the effort stays invisible` · `they think you drifted`

**Aspiration:** Kael helps you let a partner see the tending in progress, so depth you build in private gets grown by two.

**Shift:** Tending in silence  →  Letting them see the garden

| Moment | Without Kael | With Kael |
|---|---|---|
| A check-in stays surface | You save the real thing for later | Name one buried thing before the talk ends |
| A rough patch hits | You go quiet and work it alone in your head | Tell them what you're turning over while you turn it |
| You quietly improved something | You wait to reveal the finished change | Show them the work mid-tend, not just the result |

**Paywall feature rows:**
- **Before you go quiet on it** — When you'd rather retreat and fix it alone, I'll help you say the part out loud first.
- **The work they never saw** — The full read goes into the care that isn't landing and the one way to make it visible.
- **I watch it grow too** — The slow build you're tending stays tracked, so the progress isn't only in your head.

---

### CAEH · The Devoted
**Essence:** The one who keeps asking if the warmth is still there.

**How you love.**  You say it first and you say it a lot. You clock how fast they text back, whether the tone's a little off, that half-second before they answer. The second something feels off, you reach right in.
Chips: `says it first` · `reads reply speed` · `texts back fast` · `closes the gap quick` · `warmth out loud`

**What you value.**  You want it said back, not just assumed. You need the warmth to actually show up, every day, not be a thing you have to take on faith. Close and safe is the whole point.
Chips: `wants it said back` · `needs warmth returned` · `shown not assumed` · `close and safe` · `felt every day`

**What activates you.**  A quiet hour with no reason behind it gets to you fast. A shorter reply, a flatter tone, them feeling a little less warm than yesterday. You notice the dip before they even know they dipped.
Chips: `hates unexplained quiet` · `clocks shorter replies` · `notices a flat tone` · `feels them pull back` · `dreads the slow fade`

**How you respond.**  So you ask. Are we okay, did I do something, you sure. The answer's almost always yes, but you make them keep proving a thing that was never in doubt, and that quietly wears on the very thing you're guarding.
Chips: `asks are we okay` · `asks again` · `needs the reassurance` · `makes them keep proving it` · `wears on you both`

**Aspiration:** Kael helps you let one quiet hour stay quiet, so calm feels like rest instead of warmth slipping away.

**Shift:** The reassurance loop  →  You, trusting the warmth

| Moment | Without Kael | With Kael |
|---|---|---|
| Their reply comes back short | You reread for hidden weather, reply twice as warm | Answer the words they sent, not the imagined tone |
| They're quiet for an hour | You text to check, then check that landed | Let the hour pass and notice nothing broke |
| Things feel calm and settled | You ask are we okay and make them prove it | Sit in the calm and let it stay an answer |

**Paywall feature rows:**
- **Before you hit send** — When you're about to ask "are we okay" again, I'll help you read whether it's the bond talking or the worry.
- **Why quiet feels like distance** — The full read goes into why a silence reads as the warmth fading, and the move that lets a quiet stretch stay safe.
- **I keep up with you** — Whatever set off the spiral today stays in view, so you can watch the reaching get quieter over time.

---

### CAEG · The Wildheart
**Essence:** The one who needs love to stay alive.

**How you love.**  You love loud and you say it out loud. You want the close, all-in, can't-stop-texting kind, and you tell them how you feel the second you feel it. Bottling it up makes you itchy.
Chips: `says it first` · `texts how you feel right away` · `wants the intense kind` · `hates playing it cool`

**What you value.**  You want a relationship that makes you feel more alive, not just comfortable. You want to grow into a bigger version of yourself with someone. Fine and steady isn't enough for you.
Chips: `wants to feel alive` · `more, not just nice` · `grows with someone` · `bored by comfortable`

**What activates you.**  A quiet week freaks you out. Slower replies, everyone chill, nothing happening, and your brain goes wait, is this dying. When things get peaceful you read it as you two drifting apart.
Chips: `quiet week panics you` · `reads slow replies as fading` · `calm feels like a warning` · `peaceful equals scary`

**How you respond.**  So you stir things up. You start the deep talk, you chase that spark, you push for more just to feel something happen. It works, but you'll shake up a person who was finally relaxed and content.
Chips: `starts the big talk` · `chases the spark` · `pushes for more` · `won't let it just be calm`

**Aspiration:** Kael helps you tell a quiet that means depth from a quiet that means leaving, so calm stops reading as the end.

**Shift:** The fire-chasing, stirring it up  →  You, reading the quiet first

| Moment | Without Kael | With Kael |
|---|---|---|
| Their reply comes slower | You read the drop and ask what's wrong | Wait one full day before naming the gap |
| An easy quiet night | You break it open to feel the spark | Let the night stay quiet and notice it's warm |
| A calm stretch, no spark | You start a big talk to stir heat back | Ask if the quiet is depth before forcing fire |

**Paywall feature rows:**
- **Before you stir it up** — When calm has you itching to start something, I'll help you check what the quiet actually means.
- **Why calm feels like the end** — The full read goes into why peace reads as dying to you, and how steady can be the deep part, not the flat part.
- **I track the charge with you** — Every spike and every flat stretch stays in view, so you can tell real fading from just settling.

---

### CARH · The Peacekeeper
**Essence:** The one who keeps the calm, and pays for it.

**How you love.**  You catch a mood the second you walk in, and you fix the little stuff before it turns into a thing. Most nights go smooth because of you, and nobody even notices you did it.
Chips: `catches a mood instantly` · `fixes it before it grows` · `keeps the night easy` · `the quiet fixer`

**What you value.**  You just want things calm between you. No big blowup, no one stomping off, everyone still close at the end of the day. You want it kept in one piece.
Chips: `wants the calm` · `hates a blowup` · `everyone stays close` · `keeps the peace`

**What activates you.**  What gets you is the buildup. Things going tense, voices starting to climb, that feeling a fight is about to land. You feel the blowup coming before it's here.
Chips: `feels it coming` · `voices going up` · `hates the tension` · `senses a fight loading`

**How you respond.**  So you say it's fine when it isn't. You swallow the thing that bugged you and let it go, again. But you're keeping a count they can't see, and one day it all comes out at once and blindsides them.
Chips: `says it's fine` · `swallows it` · `keeps a hidden count` · `blows up later out of nowhere`

**Aspiration:** Kael helps you voice a small need the day it costs you, so peace stops meaning silence and a hidden bill.

**Shift:** The hidden tally runs you  →  You, naming it early

| Moment | Without Kael | With Kael |
|---|---|---|
| Their reply goes clipped | You brace and decide later is easier | Name it now: "You sound short, what's up?" |
| They pick the plan again | You say fine and add it to the tally | Say it out loud: "I wanted the other place" |
| The tally finally spills | You unload six months of grievances at once | Flag one fresh thing the day it stings |

**Paywall feature rows:**
- **Before you say it's fine** — When you're about to swallow it again, I'll help you find the small, sayable version.
- **What the ledger holds** — The full read counts what you've been absorbing, and the early move that stops the bill from stacking.
- **I keep the tally with you** — What you give and swallow stays visible, so it never builds up where only you can see it.

---

### CARG · The Confidant
**Essence:** The one who has to be sure before letting you in.

**How you love.**  You let almost no one all the way in, but the few who make it get everything. Your full attention, the stuff you don't tell anyone, the real you. You'd rather have two people who actually know you than twenty who sort of do.
Chips: `chosen few` · `all in once you're in` · `slow to let people close` · `few people, but deep`

**What you value.**  You want someone who actually knows the real you, not the polished version. Nice isn't enough. You'd genuinely rather be alone than be loved for someone you're pretending to be.
Chips: `the real you, not the front` · `rare over nice` · `honest over easy` · `done pretending`

**What activates you.**  Someone reaches for the deep stuff before they've earned it. Asks the big question way too soon, wants to get serious fast, leans in before you're ready. Something in you goes nope, not yet, I don't know you like that.
Chips: `asked too soon` · `haven't earned it yet` · `moving way too fast` · `leaning in before i'm ready`

**How you respond.**  You go quiet and start quietly testing them, deciding in your head whether they're worth more of you. But it takes you so long that they give up and leave first. You lose people you actually wanted, just not yet.
Chips: `go quiet` · `make them earn it` · `decide it all in your head` · `they leave before you open up`

**Aspiration:** Kael helps you offer one true thing before someone's finished earning it, so the few you'd choose stop giving up at the gate.

**Shift:** The proving ground runs the show  →  You let one in early

| Moment | Without Kael | With Kael |
|---|---|---|
| They ask what's really wrong | You say "I'm fine" and process alone for days | Name one real thing now, before you've sorted it |
| Someone wants to get close | You set quiet tests they don't know about | Tell them one true thing instead of testing |
| They wait at your locked door | You stay shut until sure, so they drift off | Open it halfway today, before certainty arrives |

**Paywall feature rows:**
- **Before you make them earn it** — When you catch yourself testing instead of trusting, I'll help you offer the thing that lets them in.
- **What you're waiting for** — The full read names the proof you're holding out for, and why it rarely arrives in time.
- **I keep up with you** — Who you've let in, and who's still earning it, stays in view as it changes.

---

### FSEH · The Kindred
**Essence:** The easy yes that never needed to grip.

**How you love.**  You love easy. Affection comes free, you don't hover, and you're you whether they're around or not. Being close to you feels light, like nothing's being demanded.
Chips: `affection comes easy` · `never hovers` · `still fully yourself` · `close but not clingy` · `keeps it light`

**What you value.**  You want it calm and roomy. Your own space, no constant merging, and a partner who trusts you without needing to check in every five minutes. A solo night should just be a solo night.
Chips: `needs her own space` · `hates being checked on` · `calm over intense` · `a solo night is fine` · `trust, no merging`

**What activates you.**  What gets you is someone wanting all of you, all the time. When your alone time gets questioned, or your chill gets read as you pulling away. Someone needing to fully merge makes you want out.
Chips: `wants all of you` · `questions her solo time` · `reads calm as distance` · `clingy energy` · `needing to merge`

**How you respond.**  So you smooth it over and keep things breezy instead of getting into it. The quiet cost: you seem so fine that they wonder if you'd even notice them drifting. Your calm reads as not caring.
Chips: `smooths it over` · `stays breezy to dodge it` · `seems like she doesn't care` · `protects the space` · `won't clock the drift`

**Aspiration:** Kael helps you let one person see they specifically matter, out loud, without trading away the freedom you need.

**Shift:** Ease that hides you  →  Closeness you choose

| Moment | Without Kael | With Kael |
|---|---|---|
| They want your solo night | You laugh it off and book a date | Name the night as yours, then offer a real one |
| They go quiet and pull back | You stay breezy and miss that they left | Say you noticed they got quiet, and ask why |
| They don't feel needed | You reassure lightly and change the subject | Tell them one thing only they give you |

**Paywall feature rows:**
- **When you're keeping it light** — Next time you smooth past the real thing to stay easy, I'll help you let them in without it costing your space.
- **Why your calm reads as cold** — The full read goes into how your contentment lands on them, and the one way to be needed without being caged.
- **I keep up with you** — However much room you're carrying, and whoever you let close to it, I keep it in view.

---

### FSEG · The Voyager
**Essence:** Love as the open road you want company on.

**How you love.**  You love by bringing someone along. The next trip, the thing you're into lately, the bigger version of your life. You don't cling, you don't check in. You just point ahead and assume they're in.
Chips: `come with me` · `what's next` · `both getting bigger` · `always pointed ahead` · `assumes they're in`

**What you value.**  You want room to do your own thing and a partner who's doing theirs. Not someone who needs you to be their whole world. You want two people growing next to each other, with plenty still left to do.
Chips: `room to roam` · `a partner not a project` · `keep your options open` · `growing side by side` · `independence first`

**What activates you.**  The thing that gets you is feeling boxed in. A life that keeps getting smaller, a calendar that's all us, the sense that you're tied down. You feel it in your gut before you can even name it.
Chips: `feeling boxed in` · `life getting smaller` · `tied down` · `calendar all us` · `trapped before you can say it`

**How you respond.**  So when something's off, you make a plan. Book the trip, start the project, keep moving. But the person who just wanted a quiet night with you is now chasing you, wondering if they're the point or just one more thing on your list.
Chips: `books the trip` · `keeps moving` · `can't just sit still` · `never just sits in it` · `are they the point`

**Aspiration:** Kael helps you learn that staying still with one person and going deep is its own adventure worth choosing.

**Shift:** Momentum running the show  →  You, choosing to stay

| Moment | Without Kael | With Kael |
|---|---|---|
| They ask for a quiet weekend | You fill it with a plan, then they deflate | Leave the weekend open and let them set pace |
| A hard patch shows up | You book a trip to grow past it | Name the thing and stay in the room one night |
| They go quiet on the future | You hear a slowdown and pitch the next big thing | Ask what stillness with you would actually look like |

**Paywall feature rows:**
- **Before you add a plan** — When the fix is another trip or project, I'll help you find the words to actually stay.
- **Are you outpacing them** — The full read maps where your momentum lands as love and where it lands as a race they can't win.
- **I move at your pace** — Whatever you're building toward stays in view, and so does the person trying to build it with you.

---

### FSRH · The Lighthouse
**Essence:** The fixed point, best loved from a little distance.

**How you love.**  You're the one people can count on. You show up when you said you would, you don't make a thing of it, and you don't need anyone checking in on you. You just stay put and steady.
Chips: `always shows up` · `zero drama` · `doesn't make a fuss` · `rock solid`

**What you value.**  You need room to breathe and time that's just yours. Calm beats chaos every time. And you want to be trusted to do your thing, not checked up on like you're about to bolt.
Chips: `needs alone time` · `calm over chaos` · `trust me, don't track me` · `low maintenance`

**What activates you.**  What gets to you is being pulled in close on demand. Someone wanting you to turn toward them right now, prove how you feel, perform it. The second you feel yanked into it, you tense up.
Chips: `hates being smothered` · `don't make me prove it` · `back off a little` · `no on-demand feelings`

**How you respond.**  So you dig in harder and give them even less to read. You stay solid but you never actually turn toward them. The cost: they're right next to you and still feel alone.
Chips: `goes quiet` · `digs in` · `never turns toward them` · `hard to read`

**Aspiration:** Kael helps you stay your steady self while learning to turn the light toward someone, so being reachable becomes being reached for.

**Shift:** Steady from a wall  →  Steady, turned toward them

| Moment | Without Kael | With Kael |
|---|---|---|
| They ask if you still want this | You answer "of course, I'm here" and move on | Name one thing you'd miss if they left |
| A quiet night on the couch | You sit close and say nothing, calling it ease | Tell them what you like about right now |
| They had a hard day | You make dinner and stay calm, expecting it lands | Put down the task and ask how they are |

**Paywall feature rows:**
- **Before you let it speak for itself** — When you're about to let being there do all the talking, I'll help you say the part out loud.
- **What steady is hiding** — The full read shows where being unbothered turned into being unreadable, and the move that lets them back in.
- **I notice the quiet ones** — The shifts you'd never flag because nothing's technically wrong, I keep those in view so they don't pass you by.

---

### FSRG · The Cartographer
**Essence:** The one quietly charting where this goes.

**How you love.**  You show love by figuring out where this is headed and quietly moving you both that way. You don't need to be glued together to feel solid. You'd rather build the next thing than talk it to death.
Chips: `already three steps ahead` · `shows up, doesn't announce` · `fine on your own` · `would rather just do it`

**What you value.**  You want to know this is actually going somewhere. Aimless makes your skin crawl. Give you a direction and a little space to move and you're all in.
Chips: `needs a direction` · `hates spinning in circles` · `wants forward motion` · `room to breathe`

**What activates you.**  What gets you is being handed a plan you didn't agree to. Someone deciding your life for you while you weren't paying attention. Standing still with no end in sight does it too.
Chips: `don't plan my life for me` · `hates being stuck` · `decided behind your back` · `no going nowhere`

**How you respond.**  So you go quiet, work it out solo, and come back with it already decided. The call's usually right. But the person you love keeps finding out the plan after it's set, and that stings more than you think.
Chips: `decides alone` · `shows up with it settled` · `skips the conversation` · `they find out after`

**Aspiration:** Kael helps you think the next turn out loud before it's final, so the one you love draws the route with you.

**Shift:** Route chosen alone  →  Charting it together

| Moment | Without Kael | With Kael |
|---|---|---|
| A big decision is coming | You decide alone, then announce it done | Float two options out loud before you pick |
| They suggest a different plan | You go quiet and route around it | Say the turn you were taking, and why |
| The relationship feels stalled | You set a new course in your head | Ask where they think this is heading first |

**Paywall feature rows:**
- **Before you present it settled** — When you've worked out the next move and you're about to announce it, I'll help you ask it before you state it.
- **The route you can't see** — The full read maps where you're steering this and the spot a partner stops co-authoring and starts reading along.
- **I track the arc with you** — Where you said this was going stays on the map, so you watch the direction move instead of just deciding it.

---

### FAEH · The Wanderer
**Essence:** Always arriving, always leaving the door cracked.

**How you love.**  You're warm and you say it out loud. Up close you catch every little shift in someone and meet it with the perfect words, and you mean them. Then you need space, and that pull is just as real.
Chips: `warm out loud` · `catches every mood` · `needs space too` · `leaves the door open`

**What you value.**  You want both at once: real closeness and room to breathe. You want a love where you can lean in or step back and nobody keeps a tally. To you, peace means nobody's making you pick one.
Chips: `close but not caged` · `room to breathe` · `no keeping score` · `easy, no pressure`

**What activates you.**  It's when good closeness suddenly feels like too much. One minute you're all in, the next you feel boxed in and need out. Being crowded freaks you out, but so does being too far away.
Chips: `too close, too fast` · `feeling boxed in` · `need to bolt` · `crowded or distant`

**How you respond.**  You make the whole back-and-forth look effortless. You go all warm, then you pull away, and you crack a joke so nobody notices the switch. The cost: your person stops trusting the good days.
Chips: `warm then gone` · `jokes it off` · `hides the pullback` · `they wait for the drop`

**Aspiration:** Kael helps you name the rhythm out loud, so closeness and space become something you share, not a turn they decode alone.

**Shift:** The silent swing  →  You, naming the turn

| Moment | Without Kael | With Kael |
|---|---|---|
| A night gets really good | You drift the next day and joke it off | Text them it landed, then take your space |
| You feel crowded midweek | You go quiet and cancel with no reason | Say you need low-key days, not a disappearance |
| They finally reach back | You pull away the second they lean in | Say you reached and still want room right now |

**Paywall feature rows:**
- **The moment you pull back** — When you feel the urge to drift right after getting close, I'll help you name it before they read it as a door closing.
- **Why the needs trade places** — The full read maps when you reach and when you retreat, and the move that steadies the swing.
- **I track the rhythm with you** — As the pull moves between closeness and space, I keep both in view so you don't have to hide the turn.

---

### FAEG · The Tempest
**Essence:** The fire that only burns for what it chose.

**How you love.**  You go all in. You read where things are at, you push for the real talk, you want someone who actually changes you. And when it gets too easy, you're already clocking how to get out.
Chips: `all in, loud` · `pushes for the real talk` · `wants to be changed` · `clocks the exits`

**What you value.**  You want to be chosen, not stuck with. Door open, free to go, and you stay anyway. You'll go deep, but on your terms, and only if nothing's making you.
Chips: `chosen, not stuck with` · `door stays open` · `deep on your terms` · `no leash`

**What activates you.**  A calm, settled week freaks you out. Things are good and somehow that feels like you signed something you didn't read. The better it gets, the more you feel pinned down.
Chips: `too settled` · `feeling pinned` · `can't leave` · `being held too close`

**How you respond.**  So you grab for room. A sharp question, a sudden need to be alone, a fight that proves you two won't work. The cost: they can't relax around you, because the closer it gets the more you tense up, and they feel it.
Chips: `picks a fight` · `bolts for space` · `calls it doomed` · `they stop relaxing`

**Aspiration:** Kael helps you tell a settled stretch from a cage, so you can stay by choice instead of bolting on instinct.

**Shift:** The exits, running the show  →  You, staying on purpose

| Moment | Without Kael | With Kael |
|---|---|---|
| A run of good weeks | You start a fight to break the quiet | Name the itch out loud instead of swinging |
| They settle into you | You go cold and need a night alone | Stay in it long enough to feel it hold |
| Things work, no friction | You read the peace as proof you're wrong | Tell a settled stretch from an actual cage |

**Paywall feature rows:**
- **Before you reach for the door** — When the calm makes you want to pick a fight or bolt, I'll help you say what's really happening instead.
- **The pattern under the restlessness** — The full read names what you mistake for a trap, and why you reach for room right when it's working.
- **I clock when you run hot** — Every spike and every sudden urge for the door stays in view, so you see the pattern, not just live it.

---

### FARH · The Sentinel
**Essence:** Self-contained, and quietly afraid you'll believe it.

**How you love.**  You never say what you need out loud, but you catch everything. The shorter reply, the off mood, the day they text less. You handle your own stuff and come across as the person who needs no one.
Chips: `never asks for anything` · `notices the short reply` · `handles it solo` · `looks low-maintenance`

**What you value.**  You want your own space and someone who doesn't crowd you. And you want to be noticed without ever having to spell it out. Asking out loud is the thing you won't do.
Chips: `needs room to breathe` · `hates being crowded` · `won't ask out loud` · `wants to be noticed anyway`

**What activates you.**  It gets to you when they take you at your word and back off. You said you were fine, they believed you, they stopped reaching. Now the space you asked for just feels like being left.
Chips: `taken at face value` · `they stop reaching` · `got the space you signaled` · `quiet starts to sting`

**How you respond.**  So you stay calm and say nothing, because asking means admitting how much you've been watching. You sort it out in your head, alone, and they have no clue. You're impossible to read on purpose.
Chips: `acts totally fine` · `won't admit it's bothering them` · `deals with it alone` · `stays hard to read`

**Aspiration:** Kael helps you correct the signal once, so the person you love stops mistaking your calm for not needing them.

**Shift:** The calm surface  →  You, behind it

| Moment | Without Kael | With Kael |
|---|---|---|
| They give you the space | You take their backing off as relief, go quieter | Tell them the space has a return time |
| You miss them but stay flat | You manage the ache alone and show nothing | Send one line: "I'm thinking about you" |
| They stop checking in | You read it as fine and let the gap widen | Say you noticed and you'd like them closer |

**Paywall feature rows:**
- **Before you go quiet** — When you catch yourself deciding to say nothing and give it room, I'll help you name the one thing you actually noticed.
- **What the calm costs you** — The full read traces how your composure reads to them, and the line between giving space and disappearing.
- **I see the part you hide** — Everything you track and never say stays in view here, so you're not the only one holding it.

---

### FARG · The Alchemist
**Essence:** The one who wants to be remade, and bolts the door anyway.

**How you love.**  You feel everything way down deep and you almost never show it. There's a whole world running in your head that maybe one or two people have ever seen. You'd rather show love by getting someone than by saying a bunch of words.
Chips: `keeps the deep stuff inside` · `picks one person to let in` · `shows more than you say` · `bad at small talk, great at 2am talk`

**What you value.**  You don't want a nice, easy, surface-level thing. You want someone who actually knows you, all the way down, and you want this to change you. Anything shallow just feels like a waste of your time.
Chips: `wants to be fully known` · `no surface-level stuff` · `craves the deep version` · `wants love that changes you`

**What activates you.**  What sets you off is when it gets too real. Someone gets close enough that you could lose yourself in them, and at the same time you're scared they'll leave. So getting close freaks you out from both sides at once.
Chips: `scared of losing yourself` · `scared of being left` · `panics when it gets real` · `both fears at the same time`

**How you respond.**  So you pull them in close, then go quiet and disappear. You'd rather go through the hard stuff alone than let them watch. You keep moving the goalposts, so someone can be with you for years and still feel like they never fully got in.
Chips: `pull close then vanish` · `go through it alone` · `always moving the goalposts` · `they never quite arrive`

**Aspiration:** Kael helps you prove the remaking you crave happens in staying ordinary and present, not in the pull-close-and-vanish.

**Shift:** The moving door  →  You, staying in the room

| Moment | Without Kael | With Kael |
|---|---|---|
| A talk gets really close | You open a door, then go vague and unreachable | Name the pull-back out loud and stay put |
| They ask to really know you | You offer intensity instead of one plain truth | Share one ordinary detail, not a grand reveal |
| Things go calm and steady | You read the quiet as flat and stir depth | Let the boring stretch stand and text them anyway |

**Paywall feature rows:**
- **When you feel the door move** — The second you go to disappear inward, I'll help you send the small real thing instead.
- **Why the door keeps moving** — The full read maps both fears pulling at once and the one ordinary move that lets someone in.
- **I stay when you go quiet** — Every time you withdraw to feel it alone, what you're carrying stays in view until you come back.

---

## 9. Hard-coded component copy (in `src/screens/OnboardingV4.jsx`)

These strings are not in `obv4.js` — change them in the components.

- **Welcome:** illustration label "Welcome".
- **Hero:** kicker "Now, a promise".
- **Trust:** kicker "Before we start" · title "Private, secure, and yours alone." · sub "No one reads your world but you. Which means you can be honest here, even about the messy parts."
- **Prep:** kicker "16 love archetypes".
- **Notif:** kicker "One small thing".
- **Reveal:** label "Your Love Archetype".
- **Mini-read:** archetype label "Your archetype" · section labels "How you love" / "What you value in love" / "What activates you" / "What growth looks like for you" · attribution "— Kael" · grey note "This read gets sharper the more you talk to Kael."
- **Statement slider:** title "Does this sound like you?" · hint "Drag to wherever you land. No wrong answer."
- **How-often slider:** hint "Slide toward whichever fits. There's no wrong spot."
- **Multi-select:** hint "Pick up to {max} · {n} chosen".
- **Ready:** kicker "Calibrated to you" · title "Kael is ready, {name}." · sub "Tuned to how you love, what scares you, and the pattern you walked in with. Not a generic coach. Yours." · button "See my 30 days".
- **Your 30 days:** kicker "The road ahead" · title "Your 30 days with Kael." · button "See my plan". Milestones:
  - Today — Bring Kael the moment you're in — The spiral, the unread text, the fight. Start where it hurts.
  - Day 3 — It learns your pattern — Kael starts to see your moves before you name them.
  - Day 7 — Your first shift, named — One reaction caught early. You feel the difference.
  - Day 30 — The pattern stops running you — You catch it early and choose differently. The old reflex loosens its grip.
- **Paywall:** kicker "You met The {Archetype}" · title "Now let's change how you love." · sub = the archetype's Aspiration (§8) · 3 feature rows = the archetype's Paywall feature rows (§8) · Annual $99.99/yr (tag "Less than a coffee a week", "7 days free, then yearly") · Monthly $14.99/mo ("7 days free, then monthly") · button "Start 7-day free trial" · secondary "Not now".
