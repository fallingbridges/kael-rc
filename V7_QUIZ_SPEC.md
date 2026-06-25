# Kael Onboarding V7 — Quiz, Logic & Reads

The full specification for the V7 onboarding instrument: every question, the exact
scoring logic, the 16 patterns, and the deep read content.

Source of truth: `src/obv7.js` (data) + `src/screens/OnboardingV7.jsx` (view).

---

## 1. Concept

We do **not** sell an "archetype." We find a person's **dominant pattern** and reflect
it back honestly, framed as *"what Kael noticed."*

- Four **pillars**, each a binary spectrum, scored from a balanced 16-question quiz.
- The four poles together form a **4-letter code** → one of **16 named patterns**.
- The read = the pattern's identity (name + essence + opening) **+** a deep read driven
  by the person's **loudest pillar**, with their **second-loudest** woven in as an accent.
- The read is **personalized**: it echoes the user's own answers back via `{SIT}`,
  `{BODY}`, and `{REACH}`.

`resolveRead(answers) → { code, primary, secondary, axes, read, phrases }`

---

## 2. The Four Pillars

| Pillar | Healthy pole | Symptom pole | What it measures |
|---|---|---|---|
| **MIND** (`Q` ↔ `R`) | Quiet | Racing | A mind that races / won't power down |
| **ENERGY** (`S` ↔ `D`) | Steady | Running low | Stress, depletion, running on empty |
| **VOICE** (`K` ↔ `H`) | Kind | Critical | The inner critic, never quite enough |
| **COPE** (`F` ↔ `N`) | Faces it | Numbs it | How you handle the hard stuff |

- `POSITIVE` (symptom pole) = `{ MIND: R, ENERGY: D, VOICE: H, COPE: N }`
- `HEALTHY` pole = `{ MIND: Q, ENERGY: S, VOICE: K, COPE: F }`
- Read bars show each pillar's position (0–100); the **right-hand / symptom** pole is the named one.

---

## 3. The Quiz — 16 questions, 4 themed segments

Each segment has a heavy **anchor** (two-choice, weight 1.5) plus graded supports. A
breather follows each segment. After Block 1 the order shown is: method breather (5),
Block 1, breather 1, Block 2, breather 2, Block 3, breather 3, Block 4, breather 4.

> **Weighting note:** MIND/VOICE use `1.5 + 1.0 + 1.0 + 1.0`; ENERGY/COPE use
> `1.5 + 1.5 + 1.5` over three mandatory questions **+** an optional multi. Both total
> **4.5** mandatory weight per pillar, so the four pillars are balanced (no bias toward
> any pillar when the optional multis are skipped). The multis are a personalization
> **bonus** on top.

### Block 1 · Your mind (MIND)

| id | kind | weight | prompt | answers → pole |
|---|---|---|---|---|
| `m1` | two | 1.5 | *Be honest. How's your head most days?* | "Mostly busy and hard to quiet" → **R** · "Mostly quiet and clear" → **Q** |
| `m2` | slider | 1.0 | *How often do you replay a conversation after it's over?* | Rarely → **Q** … Almost always → **R** |
| `m3` | statement | 1.0 | *"My brain won't switch off when I'm trying to sleep."* | Not me → **Q** … Exactly me → **R** |
| `m4` | slider | 1.0 | *When something's uncertain, how often does your mind jump to the worst case?* | Rarely → **Q** … Almost always → **R** |

### Block 2 · Your energy (ENERGY)

| id | kind | weight | prompt | answers → pole |
|---|---|---|---|---|
| `e1` | two | 1.5 | *By the end of most days, you're* | "Running on empty" → **D** · "Still got something left" → **S** |
| `e2` | slider | 1.5 | *How often do you feel drained before the day's even begun?* | Rarely → **S** … Almost always → **D** |
| `e3` | statement | 1.5 | *"I push through until I crash."* | Not me → **S** … Exactly me → **D** |
| `e4` | multi (≤3, **optional**) | bonus | *Where does the stress tend to land?* | Tight chest · Restless sleep · A short fuse · Can't focus · Low energy · A knot in my stomach — all → **D**. Feeds `{BODY}`. |

### Block 3 · Your inner voice (VOICE)

| id | kind | weight | prompt | answers → pole |
|---|---|---|---|---|
| `v1` | two | 1.5 | *The voice in your head is usually* | "A tough critic" → **H** · "On your side" → **K** |
| `v2` | slider | 1.0 | *How often do you feel like you're not quite enough?* | Rarely → **K** … Almost always → **H** |
| `v3` | statement | 1.0 | *"I'm harder on myself than I'd ever be on a friend."* | Not me → **K** … Exactly me → **H** |
| `v4` | slider | 1.0 | *How often does one small slip stick with you for days?* | Rarely → **K** … Almost always → **H** |

### Block 4 · How you cope (COPE)

| id | kind | weight | prompt | answers → pole |
|---|---|---|---|---|
| `c1` | two | 1.5 | *When a feeling gets heavy, you* | "Reach for something to take the edge off" → **N** · "Sit with it and let it pass" → **F** |
| `c2` | slider | 1.5 | *How often do you numb out instead of feeling it?* | Rarely → **F** … Almost always → **N** |
| `c3` | statement | 1.5 | *"I'd rather distract myself than sit with a hard feeling."* | Not me → **F** … Exactly me → **N** |
| `c4` | multi (≤3, **optional**) | bonus | *When it gets heavy, what do you reach for?* | Endless scrolling · A drink or a smoke · Burying it in work · Zoning out · Keeping constantly busy · Shutting people out — all → **N**. Feeds `{REACH}`. |

The two optional multis show a **"None of these"** button until something is picked
(then it becomes "Continue"), so no one is forced to claim a body symptom or a vice.

---

## 4. Scoring Logic

Constants: `MULTI_W = 0.4` · `SEED_W = 1.2` · `TIE_EPS = 0.2`.

**Per-question contribution to its pillar's signed sum:**

- **two** (anchor): `±weight` (`+` toward the symptom pole `POSITIVE`, `−` toward healthy). Weight 1.5.
- **slider / statement**: graded. `delta = ((value − 50) / 50) × weight`, signed so the
  right-hand (symptom) end is positive. Untouched = 50 = neutral (0).
- **multi**: each picked option adds `±MULTI_W` toward its pole's pillar. Optional, so it's
  a bonus on top of the mandatory questions.

**Opener seed:** the situation the user picks adds `SEED_W (1.2)` toward one pillar
(state → result continuity), but never decides the result on its own:

| Situation | Seeds |
|---|---|
| Overthinking everything | MIND |
| Anxiety | MIND |
| Stress and burnout | ENERGY |
| Being hard on myself | VOICE |
| Feeling low | VOICE |
| A habit I want to change | COPE |
| Something else | — |

**Normalization → position (0–100):**
`pos = clamp( round( 50 + (sum / AXIS_MAX) × 50 ), 6, 96 )`

`AXIS_MAX` is built from **mandatory questions only** (the optional multis are excluded
from the ceiling, so every pillar normalizes off the same 4.5 of mandatory weight; filling
a multi is a bonus that pushes toward the 96 cap).

**Code (which of 16):** for each pillar, `sum > TIE_EPS → symptom pole`, else `healthy pole`.
Concatenated in MIND-ENERGY-VOICE-COPE order → e.g. `RDHN`. With no/neutral answers the
code defaults to `QSKF` (The Grounded).

**primary / secondary:** the pillars ranked by `pos` (highest = loudest). `primary` drives
the deep read; `secondary` adds a one-line accent (only if its `sum > TIE_EPS`).

**Personalization fill-ins:**

- `{SIT}` = the free-text "say it in your words" OR the picked situation's phrase (e.g. "the overthinking").
- `{BODY}` = a prose list of the `e4` body picks (e.g. "tight chest and restless sleep"), else "the tension you carry".
- `{REACH}` = a prose list of the `c4` echoes (e.g. "the endless scroll and a drink"), else "something to take the edge off".

---

## 5. The 16 Patterns (identity layer)

Each 4-letter code → a bespoke **name + essence + opening line** (the 1-of-16 reveal).
Code letters are MIND·ENERGY·VOICE·COPE = (`R`acing/`Q`uiet)·(`D`rained/`S`teady)·(`H`arsh/`K`ind)·(`N`umbs/`F`aces).

**`RDHN` — The Overloaded** — *Everything's loud at once, and you're running on fumes.*
> Racing mind, empty tank, a critic that won't quit, and a reach for whatever quiets it. If it feels like a lot, that's because it is. The point isn't to fix all four at once, it's to start with the loudest.

**`RDHF` — The Striver** — *Racing, drained, self-critical, and pushing through it all.*
> You overthink, you're exhausted, you're hard on yourself, and you still face it head-on. That's grit, and it's unsustainable. You're carrying all of it at once, and you don't have to.

**`RDKN` — The Drifter** — *An overworked mind, low and numbing, but gentle with itself.*
> Your mind won't quit and your energy's gone, so you drift and numb and scroll past the feeling. You're not hard on yourself, which helps more than you know. The work here is the energy and the reaching.

**`RDKF` — The Trier** — *A busy, tired mind that keeps showing up anyway.*
> You overthink and you're running low, but you stay kind to yourself and you face what comes. The risk is the tank. A racing mind on empty is exactly how good people burn out.

**`RSHN` — The Brooder** — *A racing, critical mind that you numb to quiet.*
> Your head runs hot and harsh, replaying what you got wrong, and when it's too loud you reach for something to mute it. The energy's there. The noise is the problem, and it needs somewhere to land.

**`RSHF` — The Perfectionist** — *A sharp mind and a sharper inner critic.*
> Your mind catches everything, you've got the energy to chase it, and you face what's hard. But you hold yourself to a bar you'd set for no one else, and the overthinking feeds it. Easing the critic is the unlock.

**`RSKN` — The Dreamer** — *A vivid mind that drifts off instead of landing.*
> You think in a thousand directions and you're easy on yourself about it. The pattern is the drift: when a feeling gets real, your mind wanders somewhere easier. Coming back is the practice.

**`RSKF` — The Seeker** — *A busy, curious mind on steady ground.*
> Your head is always running, but it doesn't run you into the floor. You've got energy, you're kind to yourself, and you face things. The mind is the thing to channel, not to quiet.

**`QDHN` — The Burnt Out** — *Empty, hard on yourself, and numbing to get through.*
> This is the heavy one, and part of you already knew. You're depleted, the inner voice is unkind, and you reach for whatever takes the edge off. None of it is a flaw. It's a tank that's been empty too long.

**`QDHF` — The Pusher** — *Running on empty and driving yourself anyway.*
> You keep going long past where most people stop, and you're hard on yourself for not doing more. Your mind's quiet, but the tank is empty and the critic won't let you rest. Something gives before you do.

**`QDKN` — The Fader** — *Gentle with yourself, but quietly fading out.*
> You're not hard on yourself and your mind isn't racing. What's happening is quieter than that: the energy's gone, and you've been numbing the low instead of naming it. So let's name it.

**`QDKF` — The Giver** — *Kind, grounded, and running low from carrying everyone.*
> You're warm with yourself and you face what's hard, but you're tired in a way rest doesn't fix. Usually that's because you carry other people first. The tank is the thing to watch.

**`QSHN` — The Stoic** — *Calm on the surface, harsh underneath, all of it held in.*
> From outside you look unshakeable: steady, low-drama, handling it. Inside, the voice is sharp and the feelings get managed quietly, alone. Steady isn't the same as okay.

**`QSHF` — The Hard Marker** — *Steady and honest, but you grade yourself on a brutal curve.*
> You stay level and you face what comes, but the scorecard in your head never closes. You'd never speak to anyone the way you speak to you. That's the one voice worth softening.

**`QSKN` — The Avoider** — *Calm and kind, but you look away from the hard stuff.*
> You keep an even keel and you're gentle with yourself, which is rarer than you think. The catch is what you do with a hard feeling: reach past it, keep it light, change the subject. It waits for you anyway.

**`QSKF` — The Grounded** — *Steadier than most, with one quiet edge to keep an eye on.*
> Honestly, you're doing better than you give yourself credit for. Your mind is mostly clear, your tank isn't empty, and you don't tear yourself down. The work now is keeping it that way when life leans on you.

---

## 6. The Deep Read (pillar layer)

The four sections of the read come from `PILLAR_READ[primary]` — the user's **loudest
pillar**. So two people with different patterns but the same loudest pillar share these
four beats; their **name, essence, opening, axis bars, and accent** differ. Each beat is
`body` + recognizable `chips` + a "how Kael helps" line. `{SIT}/{BODY}/{REACH}` fill in.

The read renders as: **How you carry it** (`love`) → **What you're really after** (`value`)
→ **What sets it off** (`triggers`) → **How you cope** (`respond`) → **Where this goes**
(`aspiration` + the first two `compare.withKael` moves), with the secondary pillar's
`accent` as a quiet aside.

### MIND — glyph: Spiral

- **How you carry it** — You notice everything. The tone of a text, the thing left unsaid, the detail nobody else clocked. The same mind that catches it all also replays it at 2am, hunting for the one piece you missed.
  *chips:* catches every detail · replays it after · three thoughts deep · always scanning
  *Kael:* catches the loop as you describe it and walks you back to what's actually true right now.
- **What you're really after** — You just want the noise to stop. A mind that switches off when you tell it to, a night where the thoughts don't follow you to bed. Quiet, the kind you can actually rest inside.
  *chips:* a quiet mind · an off switch · rest that holds · a little certainty
  *Kael:* becomes the place you set the thoughts down, so your head isn't the only place they live.
- **What sets it off** — Anything left open sets it off. A vague reply, a decision unmade, a question hanging in the air. `{SIT}` is exactly the kind of thing that keeps the engine running.
  *chips:* open loops · vague replies · the not-knowing · what-ifs
  *Kael:* bring it the trigger in the moment and it helps you sort the real signal from the spiral.
- **How you cope** — So you think harder. You replay it, rehearse it, run every branch of what could go wrong and call it preparation. Mostly it just keeps the engine running and leaves you wrung out.
  *chips:* overthinks it · runs every angle · rehearses the worst · never lands
  *Kael:* helps you tell a real problem from a rehearsed one, before it costs you the night.
- **Where this goes:** Kael catches the spiral as you describe it and walks you back to what's actually true right now.
  - A text sits unanswered for hours — *without:* you write six versions of what it means — *with Kael:* name the story your mind picked, then test it.
  - You're wide awake at 2am — *without:* you replay the whole day on a loop — *with Kael:* park the loop somewhere outside your head.
  - A decision is left open — *without:* you run every branch until you're drained — *with Kael:* sort the real risk from the rehearsed one.
- **As a secondary pillar (accent):** *Your mind runs hot underneath it, replaying and rehearsing when you'd rather rest.*

### ENERGY — glyph: Flame

- **How you carry it** — You carry a lot, quietly. You meet the load by doing more: push through the tired, answer the message, handle the thing. The crash comes later, in private, where no one has to see it.
  *chips:* carries the load · pushes through · crashes in private · runs on reserves
  *Kael:* helps you read the gauge before you hit empty, not after.
- **What you're really after** — Rest you don't have to earn. Permission to stop without everything falling apart. You want to feel full again, not just functioning, and a day that doesn't take everything you've got.
  *chips:* rest without guilt · room to breathe · a full tank · to just stop
  *Kael:* helps you find rest that doesn't cost you anything, and take it before the crash.
- **What sets it off** — Stacked demands, and the quiet rule that slowing down isn't allowed. `{SIT}` sits on top of a tank already low. Your body's been keeping score: `{BODY}`.
  *chips:* one more thing · no room to stop · rest feels earned · the full plate
  *Kael:* tracks where the stress lands in your body and flags the dip early.
- **How you cope** — So you push through. You override the tiredness and keep going on fumes, and you call it strength. But running on empty was never strength. It's a slow leak you've learned to ignore.
  *chips:* overrides the tired · keeps going · ignores the signals · until the crash
  *Kael:* remembers your week, so it knows when you're slipping before you do.
- **Where this goes:** Kael helps you read the gauge before you hit empty, not after.
  - You're wiped by midafternoon — *without:* push on with caffeine and willpower — *with Kael:* name the dip and take a real ten minutes.
  - Someone asks for one more thing — *without:* you say yes before checking the tank — *with Kael:* pause, and answer from what you actually have.
  - A rare free evening — *without:* you fill it with errands, allow no rest — *with Kael:* protect one hour that asks nothing of you.
- **As a secondary pillar (accent):** *And you're running lower than you let on, closer to empty than you'll admit.*

### VOICE — glyph: Scales

- **How you carry it** — You replay your mistakes and skim past what went well. A compliment slides off, a small slip sticks for days. The scorecard stays open, and somehow you're always a little behind on it.
  *chips:* replays mistakes · discounts the wins · keeps score · always behind
  *Kael:* helps you hear the critic as a voice, not a verdict, so you can answer it back.
- **What you're really after** — To finally feel like you're enough. Not after the next achievement, just steady, allowed to be okay as you are. You want the bar to stop moving every single time you reach it.
  *chips:* to be enough · a kinder voice · the bar to hold still · to ease up
  *Kael:* remembers your wins, so it can show you the evidence the critic keeps deleting.
- **What sets it off** — Comparison, judgment, the fear of being seen as not enough. `{SIT}` tends to hand the critic its microphone, and it starts reading the list.
  *chips:* comparison · a small mistake · being judged · the highlight reel
  *Kael:* when the voice gets loud, helps you name it and weigh it against what's real.
- **How you cope** — So you turn it on yourself first, harder than anyone else would, and tell yourself it keeps you sharp. But the harshness was never the thing that made you capable. You already were.
  *chips:* criticizes first · raises the bar · never quite enough · runs on pressure
  *Kael:* helps you build a steadier inner voice, the kind that pushes without punishing.
- **Where this goes:** Kael helps you hear the critic as a voice, not a verdict, so you can answer it back.
  - You make a small mistake at work — *without:* you replay it for the rest of the day — *with Kael:* weigh it at its real size, not the critic's.
  - Someone gives you a compliment — *without:* you deflect it and find the flaw — *with Kael:* let it land before you argue with it.
  - You catch yourself comparing — *without:* you come up short and sit in it — *with Kael:* catch the unfair scorecard as it opens.
- **As a secondary pillar (accent):** *And the inner critic is loud too, quicker to your faults than your wins.*

### COPE — glyph: Waves

- **How you carry it** — You're not avoiding your life, you're managing a feeling no one taught you to sit with. When it rises, you reach for `{REACH}`. It works for a minute. That's the trap.
  *chips:* reaches for relief · quiets it fast · hard to sit still · feeling on mute
  *Kael:* helps you catch the reach in the moment and stay with the feeling a beat longer.
- **What you're really after** — Relief that doesn't cost you. A way to feel the hard stuff without it flattening you, and a little faith that you can handle a feeling without needing to escape it first.
  *chips:* relief that lasts · to feel it safely · steadier ground · to handle it
  *Kael:* is the steady hand, there the second the urge hits, not the morning after.
- **What sets it off** — The hard-to-name stuff, mostly. Stress, loneliness, a low you'd rather not look at. `{SIT}` is exactly what the reaching was built to numb.
  *chips:* the nameless low · stress · loneliness · the urge hits
  *Kael:* helps you find the feeling under the urge, which is where the real relief lives.
- **How you cope** — So you reach for `{REACH}`. It quiets things for a moment, then leaves you one step further from what you actually felt. The feeling waits for you. It always waits.
  *chips:* numbs it · reaches on autopilot · quick relief · the feeling waits
  *Kael:* remembers your triggers and your wins, so the next urge is one you've practiced for.
- **Where this goes:** Kael helps you catch the reach in the moment and stay with the feeling a beat longer.
  - A wave of stress hits — *without:* you're scrolling before you notice you reached — *with Kael:* name the feeling before you reach for the phone.
  - A low, lonely evening — *without:* you numb it and feel emptier after — *with Kael:* sit with it two minutes and let it move.
  - You catch yourself reaching — *without:* you tell yourself it's no big deal — *with Kael:* pause and ask what you're actually feeling.
- **As a secondary pillar (accent):** *And when it gets heavy, you tend to reach for something to take the edge off.*

---

## 7. The Opener (situation) — state channel

Asked first; seeds the result lightly (never decides it) and is reflected back as an
acknowledgement. `{SIT}` phrase is what gets woven into the read.

| Situation | `{SIT}` phrase | Acknowledgement |
|---|---|---|
| Overthinking everything | the overthinking | Spirals feel like thinking. Usually they're feeling, looking for somewhere to land. |
| Stress and burnout | the stress you're carrying | You're carrying a lot. Let's look at what's actually draining you. |
| Anxiety | the anxiety | That low hum of dread. You're in the right place for it. |
| Being hard on myself | how hard you are on yourself | The inner critic is louder than it should be. We can turn it down. |
| Feeling low | the low you've been in | When everything feels heavy. We'll take this gently. |
| A habit I want to change | the habit | It takes something just to name it. No judgment here. |
| Something else | what you're carrying | Whatever it is, you do not have to carry it alone in your head anymore. |

---

## 8. The Flow (screen order)

`welcome` → `promise` ("A coach that remembers you") → `situation` → `situationText` →
`hero` ("There's a logic to how you feel") → `trust` (privacy) → **`name` → `age` →
`gender`** → `relcontext` ("What's weighing most right now?") → `prep` ("Let's find your
pattern", Start) → **method breather** → **Block 1** → breather → **Block 2** → breather
(chat demo) → **Block 3** → breather → **Block 4** → breather → `goals` ("What are you
hoping for?", multi) → `notif` → `calibration` → `reveal` ("What Kael noticed") →
`miniread` (the read) → `ready` ("Kael is ready, {name}") → `thirtydays` → `paywall`.

`goals` is a non-scoring hope question; the picks are echoed on the `ready` screen.
