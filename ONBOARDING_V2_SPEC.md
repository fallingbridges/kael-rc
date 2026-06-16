# Kael Onboarding V2 — Spec

A complete revamp, built as a **separate studio tab ("Onboarding V2")** that borrows the existing `ob2`/`ob3` design system and bespoke screens. The current onboarding stays intact.

The north star: it should never feel like *"answer 19 questions so we can build your profile."* It should feel like **"Kael is already reading me as I move."** The user is being *seen*, in real time — not filling out a form.

The arc we move them through:
> understood → safe → *"these are easy but surprisingly accurate"* → *"Kael is reading me right now"* → *"the read feels true, this gets me"* → *"I want the full read and the path."*

## The three laws (above everything)
- **Mirror, not pitch.** During the quiz the only goal is to make the user feel seen. Recognition and hope — never features.
- **Sell through relief, only after the read.** Features are sold as the resolution of a pain the user just named, clustered after the read. A feature stated as a feature breaks the spell; the same feature stated as relief lands.
- **Every screen earns the next — never extract work without first giving a reason.** Before any ask (a tap, personal data, a multi-select), the user already knows *why it helps them*. And every screen does two things: it **pays off the action just taken** (an ack, a reveal, a forward nudge) and **opens a pull toward the next** (curiosity, momentum, an unfinished thread). No screen is a dead transaction. The payoff screen (§4.3) is the loudest instance of this law, but it governs *every* transition — if a screen makes the user work and doesn't tell them why or give something back, it's wrong.

---

## Voice (how every word sounds) — non-negotiable

Write like a sharp, warm friend who happens to be wise. Not a brand, not a therapist, not an AI. If a real person wouldn't say it out loud to a friend, cut it. **Read every line aloud before it ships.**

- **No em dashes. Ever.** Use a period or a comma. Short sentences win.
- **Kill the AI tells:** no "it's not X, it's Y," no rule-of-three lists, no heavy parallelism, no colon-then-profound-fragment, no stacked poetic clauses. One clear thought per line.
- **Banned words/phrases:** journey, unlock, embrace, dive in, navigate, foster, empower, elevate, "messy moments" (and any brand-poetry pile-up).
- **Use contractions. Use "you." Concrete over abstract.** "When they go quiet, you spiral" beats "moments of relational ambiguity."
- Warm without being sugary. Direct without being cold. Plain words doing real work.

All example copy in this spec is written to this standard; any line that still smells like AI gets rewritten, including during the build.

---

## 1. Principles

1. **Everyday language, no jargon.** Never "anxious attachment," "schema," "emotional regulation." Transformation is **"reacting → responding"** / "spiraling → steady," never "anxious → secure." (Attachment is internal scoring only, never shown.)
2. **One action per screen.** Name, age, gender each get their own screen.
3. **< 5 seconds per question.** Short copy, icons, tap-to-answer.
4. **Format follows function, grouped into movements.** Consistent format within a movement; the shift between movements is the pattern-interrupt. See §6.
5. **Comprehensive + universal.** Works for single / dating / situationship / relationship / married / healing / unsure. Questions are about the user's *tendencies*, not a current partner. Universality via comprehensive options, never a generic "none of these."
6. **Earn the sensitive stuff, and justify every ask** (the third law, applied). A free, resonant tap comes *before* any personal-data ask — and every ask carries a one-line *why it helps the read*, never bare. Name, age, gender are not a form: each says what it's *for*.
7. **Beliefs are inferred silently, never asked, and named gently in the read** (§5).
8. **Custom micro-copy.** Every single-select option has its own authored ack; interstitials are written to the specific answer. Authored content, not LLM — this is where the mirror lives.
9. **Scannable, not verbose.** Especially the read: one idea per screen, hero line + structured fragments + a visual + whitespace. Depth lives in the *locked* unlock. Aesthetic by restraint.
10. **Hope throughout.** Recognize the struggle without making it heavy; heavy beats are followed by hope.
11. **No code-drawn illustrations.** Code-drawn artwork reads as amateurish (see the v1 loop diagram). The build produces **graphs, meters, the segmented bar, icons (Phosphor), type, and layout** — nothing more decorative than that. Every bespoke **illustration** is a styled **placeholder + a precise description** (see §16); the user supplies the final art. No app screenshots either — placeholders only. A data trajectory (e.g. the transformation) is a *graph* and is built; a *medallion / diagram / scene* is an *illustration* and is a placeholder.

---

## 2. The profile schema (the backbone)

Every option tags this. Read, transformation, the living narration, scoring — all derive from it.

```
profile = {
  name, ageBand, gender, relationshipState,
  emotionalState,        // anxious | hurt | hopeful | numb | lonely | overwhelmed | calm-unsure
  corePattern,           // reassurance_loop | meaning_making_spiral | self_abandonment | defensive_strike | guarded_distance
  attachmentLean,        // anxious | avoidant | secure | mixed   (internal only, never shown)
  topTriggers: [],       // slow_replies | distance | criticism | needing_space | feeling_unwanted | mixed_signals
  conflictStyle,         // fix_now | defend | shut_down | give_in | go_cold
  coreBelief,            // INFERRED from the protective recognition beats (§6 B); named gently in the read; never asked
  beliefConfidence,      // strong | weak  → gates whether the read names the belief (§8)
  coreValues: [],        // chosen | safe | desired | understood | free | calm | respected | close | secure
  intensity,             // low | med | high  (from the Likert movement)
  situation,             // the picked current-situation scenario (§6) — anchors the read
  situationText          // OPTIONAL free text (only if they tap "Something else") — quoted as a bonus, never required
}
```

**You Page sections** (revealed as the locked scaffold at the read): *Your read · Attachment style · Your patterns · Your triggers · The story underneath · Your values.*

---

## 3. The living progress (the signature mechanic)

The top bar carries orientation *and* Kael's voice in one strip: **Back · named section · segmented progress**, with the living narration riding the transitions. No percentage — the segments are the gradient.

**Top-bar anatomy** (persists across the whole diagnostic):
- **Back button** (left) — recovers mis-taps (§12).
- **Named section** (center kicker, warm + Kael-voiced) — *what part you're in*: `Getting to know you` · `Your patterns` · `What runs underneath` · `What you want` · `Your read`. This is the orientation Noom's "DEMOGRAPHIC PROFILE" gives, minus the spreadsheet tone — and the final section reads "Almost there" for anticipation.
- **Segmented bar** (beneath) — **one segment per movement** (~5). The active segment **fills continuously on every answer** (per-tap momentum — the strongest goal-gradient); completed segments solid, future ones empty. No number.

**The living narration** rides this structure (it doesn't replace it):
- At each **segment completion**, the segment snaps full and **Kael's line animates in** as the transition beat: *"Your patterns are coming through."* → *"The story underneath is getting clearer."* → *"Almost there. Your read is taking shape."* → at calibration: *"Your first read is ready."*
- Occasional **per-answer nudge** keyed to a strong answer (*"I'm noticing how you handle distance."*), tasteful, never every tap.
- The assembly *feeling* lives here — no separate "✓" milestone screens. The bar (momentum + orientation) + the narration (emotion) are the assembly.

**Why segmented, not noded:** nodes only move at checkpoints, so a 6-question movement sits static — dead momentum on a long quiz. A segment that fills on every tap keeps motion alive exactly where drop-off hides, while the segments still give the macro "which phase / how far."

---

## 4. The flow (screen by screen)

`[live]` = the living-progress header is present (the diagnostic portion only).

### Act 1 — Promise → proof → payoff → trust *(the sell preamble; no progress bar — it begins at Name)*
1. **Welcome** — *Understand what really happens to you in relationships.* (signal-medallion = **illustration placeholder**, §16). The promise.
2. **Hook** — *What brought you here?* (single-choice, icons). The first action, pulled to the front: zero typing, instantly relevant, makes them feel seen *immediately*. Its custom ack is the **proof**. (Answer feeds scoring; no progress bar yet — this is still preamble.)
3. **The payoff — pre-quiz prep (NEW).** The screen that *earns* the next 3 minutes — answers "why should I bother?" **before** any personal ask, so people don't bail at Name. Scannable, never a wall:
   - **Payoff headline** (serif): *"In about 3 minutes, you'll see the pattern you keep running, and what to do about it."* Can be lightly keyed to their hook answer (authored variants, not LLM) so it feels responsive.
   - **Building, not testing:** frame the questions as assembling *their* read, not a survey (IKEA effect). Three tight value fragments — *what you get · how it feels · yours to keep* — not paragraphs.
   - **A concrete goal image:** a small, partly-locked preview of the You Page being assembled — *"this is what we're building."* Makes the reward tangible (goal-gradient) without spoiling the reveal. **Built scaffold + blur, not an illustration.**
   - **Expectation set:** *~3 min · just tap · no right answers · private.*
   - **CTA names the reward:** *"Build my read"* (not "Continue").
4. **A private space to be honest** — *No judgment. No noise. Just a clearer picture of what's going on with you.* (trust sanctuary). One quiet line: *"Kael is a coach, not therapy or crisis support."* (passive, no flow.) Sits last in Act 1: desire (payoff) then safety (trust), right before the first personal ask.

*(The old "see the pattern underneath" and "watch yourself grow" promise screens collapse: the underneath idea is shown by the read itself; the growth promise is planted on the payoff screen and paid off by the transformation beat.)*

### Act 2 — About you *([live] — the segmented bar begins here, section: "Getting to know you")*
5. **Name** `[live]` — *What should Kael call you?* **Why, stated:** *"so Kael can speak to you, not at you."* (Earned by the hook + payoff; used sparingly thereafter.)
6. **Age** `[live]` — chips, tap-only. **Why:** *"this shapes how Kael reads you."*
7. **Gender** `[live]` — chips, tap-only. **Why:** *"so the read fits you"* (with a no-pressure "prefer not to say").

### Act 3 — The diagnostic, by movement *([live]; one-job interstitial after B and C)*
- **Movement A — "Where you are"** (single-choice; **ack → Continue**): love-life state, current feeling, conflict reflex.
- **Movement B — "What happens"** (recognition: *Sounds like me / Sometimes / Not really*; **auto-advance + confirm beat**): behavioral patterns + the protective belief-inferring beats, folded together (the belief is never announced). The mirror core.
- → *Interstitial 1* (sell-as-relief, keyed to their leading pattern; withholds the named belief: *"there's usually a quiet story underneath all this, and we'll get to it"*).
- **Movement C — "How much"** (Likert chips: *Rarely / Sometimes / Often / Almost always*; **auto-advance**): intensity.
- → *Interstitial 2* (educate + hope: *"triggers aren't flaws"*).
- **Movement D — "What you want"** (values multi-choice; Continue): aspiration — placed late so the diagnostic ends on what they're *moving toward*, not the wound.
- **Situation** `[live]` — *What's pulling at you right now?* A **tappable scenario picker** (concrete current situations) **+ "Something else →"** that opens an optional text field. The pick anchors the read; typed text is a *bonus* quote, never required. (Framed distinctly from the hook: hook = the broad why; this = the concrete thing happening now.)

### Act 4 — The payoff *(no progress)*
- **Calibration** — *Building your read, [Name]…* The read is generated here (§11); latency-adaptive + failure-proof. Ceremonial, real steps tied to their data.
- **The read — a scannable, multi-beat drip** (§8). Each beat = one glanceable screen.
- **An emotional landing beat** — one warm, user-owned line before any lock/price: *"Whatever you do next, you saw something true about yourself today."*
- **Locked You Page** — the personalized, glanceable scaffold (§9): their map, mostly locked.
- **Notifications** — *Want Kael to check in gently?* (a gentle care beat, after the read lands).
- **Paywall** — the **real first paywall** from the Paywall studio: `VClassic` ("01 · The Secure Plan," the icon-chip capability list). The flow closes straight into the actual offer, not a placeholder. (Reuse the component; a static, non-editable version in the flow.)

Approx length ≈ 31 screens; the timed quiz is ~19 questions ≈ **~3 min** (the payoff screen sets that expectation up front).

---

## 5. Beliefs — inferred, broadened, named gently

Nobody consciously thinks *"I have to earn love."* So we never ask. We infer from **protective, non-judgmental recognition statements folded into Movement B** (the user never sees a "beliefs" screen), and **name the belief gently in the read** as *a learned story that made sense once* — only when confidence is strong (§8).

The taxonomy is **balanced across anxious / avoidant / deprivation** so it isn't an anxious-only quiz:

| Belief | Protective recognition beat (folded into B) |
|---|---|
| Conditional love | *"I feel steadier when I know I'm being useful or needed."* |
| Abandonment | *"Part of me stays a little ready for people to drift."* |
| Defectiveness | *"I'm careful about showing all of myself too soon."* |
| Self-blame | *"When something's off, my first instinct is to check what I did."* |
| Self-reliance / mistrust | *"When it comes down to it, I trust myself more than I trust others to show up."* |
| Engulfment | *"Too much closeness can start to feel like losing my own space."* |
| Deprivation | *"I half-expect to be the one giving more than I get."* |

Framed as understandable ways people stay safe, not flaws. If **few** resonate, that's signal too (toward secure). The belief surfaces only in the read, gently.

---

## 6. The question set (~19 questions)

Tags map to §2. Format is consistent within a movement.

**Hook (Act 1) · single-choice, icon · ack → Continue**
- *What brought you here?* — `Overthinking someone` · `We keep fighting` · `They feel distant` · `Healing from a breakup` · `Keep choosing the wrong people` · `I want to feel secure` · `I just feel off` (universal) → seeds `corePattern`, `emotionalState`.

**Movement A — "Where you are" · single-choice · ack → Continue**
- *Where are you in your love life right now?* — `Single` · `Dating` · `Situationship` · `In a relationship` · `Married` · `Recently ended` · `It's complicated` → `relationshipState`.
- *Right now, you mostly feel…* (mood palette) — `Anxious` · `Hurt` · `Hopeful` · `Numb` · `Lonely` · `Overwhelmed` · `Calm but unsure` → `emotionalState`.
- *When a fight starts, your first move is…* — `Fix it now` · `Defend myself` · `Shut down` · `Give in to keep peace` · `Go cold` → `conflictStyle`.

**Movement B — "What happens" · recognition (Sounds like me / Sometimes / Not really) · auto-advance + confirm beat**
Patterns + the protective belief beats (§5), interleaved so it reads as one stream of "does this sound like you," never a belief interrogation.
- *When someone I care about goes quiet, I imagine the worst.* `[anxious · meaning · trigger:distance]`
- *When things get tense, I pull back and go quiet.* `[avoidant · guarded · conflict:shut_down]`
- *I replay conversations looking for what I did wrong.* `[meaning · anxious]`
- *I'll keep the peace instead of saying what I need.* `[self_abandonment]`
- *When I feel criticized, I get defensive fast.* `[defensive · trigger:criticism]`
- *A slow reply can hijack my whole mood.* `[anxious · trigger:slow_replies]`
- *(+ 3-4 protective belief beats from §5, chosen to span the taxonomy)*

**Movement C — "How much" · Likert chips (Rarely / Sometimes / Often / Almost always) · auto-advance**
- *Little things set me off, like a tone or a slow reply.*
- *I need reassurance to feel okay in a relationship.*
- *I'd rather handle hard feelings alone than bring them up.*
- *I worry I want too much from people.*

**Movement D — "What you want" · multi-choice, icon · Continue** *(cap: pick up to 3)*
- *In an ideal relationship, you feel…* — `Chosen` · `Safe` · `Desired` · `Understood` · `Free` · `Calm` · `Respected` · `Close` · `Secure` → `coreValues`.

**Situation · scenario picker + optional text**
- *What's pulling at you right now?* — `A text I'm overthinking` · `A fight we keep having` · `Someone pulling away` · `A breakup I'm not over` · `Mixed signals I can't read` · `I want to feel more secure` · **`Something else →`** (opens a short, optional field). Pick → `situation`; typed → `situationText` (bonus).

---

## 7. Micro-acks + interstitials

- **Acks** — authored, one per option, on the **single-select screens** (hook + Movement A). Select → the ack lands (short, specific, warm) → **Continue**. These emotional beats get a breath; never auto-advance. *(e.g. "I just feel off" → "That's reason enough. Let's give the feeling some shape.")*
- **Movements B / C / D auto-advance** — the recognition itself is the acknowledgment; a **confirm beat** (the answer visibly lands — check + the card settles, ~400ms) plays first, longer on B's heavier protective beats, so it never feels dismissive.
- **Interstitials — one job each, per-answer.** Two of them (after B, after C), written to the dominant answer. Relief / hope / educate — never assembly (the living narration owns that), never a feature list. Name used here, sparingly.

---

## 8. The read — scannable, multi-beat drip (the make-or-break)

The mini-read is a **visual artifact, not an essay.** The verbose, paragraph-deep version is the *paid* unlock; what shows here is glanceable in ~3 seconds and feels like *seeing yourself on a beautiful card*. Scannability *serves* the aha — recognition lands harder in a hero line than in prose.

Rules for every read screen: **one hero line (big serif), structured fragments not sentences (labeled rows / chips), a meaningful visual — a built graph/meter or an illustration placeholder (§16), never code-drawn art — and generous whitespace.** Each pairing of recognition→relief is *one short line or chip*, not a sentence-pair.

- **Beat 1 — Pattern + the story underneath (richest; make-or-break).**
  - Visual: **illustration placeholder** — the "reveal medallion" (§16). Built fallback while art is pending: a quiet centered icon + ring, never a fake illustration.
  - Chip: *Your read · The Reassurance Loop.*
  - Hero line (the essence, ~one line): *"[Name], you reach for clarity when what you need is safety."*
  - Fragment: *The story underneath · "love is something you have to earn."* — **only if `beliefConfidence` is strong**, phrased tentatively (*"it can sound like…"*), with a quiet **"that's not quite me"** tap that reframes rather than dead-ends. If weak, describe the pattern without naming a belief.
  - If they typed: their words as a single framed pull-line (*"You said: '…'"*). If not, this device is simply absent — the beat stands on the pattern + belief (strong for everyone).
  - Relief, one chip: *Kael remembers this.*
- **Beat 2 — Trigger + in-the-moment help.**
  - Fragment: *It starts small · a slow reply.*
  - Small **icon** + one short relief line: *"Bring Kael the moment, and respond instead of reacting."*
- **Beat 3 — The shift (transformation).**
  - Hero: the **built trajectory graph** (§10) — a clean line/curve from *reacting* to *responding* with three markers (Today · 7 days · 30 days), one line on what *secure* means. Minimal copy. (This is a graph, not an illustration — built in code.)
- **Emotional landing beat** — one warm full-screen line, whitespace, no lock yet: *"Whatever you do next, you saw something true about yourself today."*

Then → the locked You Page (§9). Depth stays locked; these are tastes. Drop-off here is low (it's the reward) — but every beat must be substantive and *short*.

---

## 9. Locked You Page (the converting image) + paywall

The final pre-paywall screen is a **gorgeous, glanceable card — the map of them** — not paragraphs. All six section headers in **their own words**; 2-3 revealed as short fragments (the free taste); the rest softly **blurred with one-line teasers + counts**:

> *Your pattern:* The Reassurance Loop ✓
> *Your triggers:* slow replies, +4 more 🔒
> *The story underneath:* 🔒
> *Your 7-day plan:* Day 1 ready 🔒
> *Your values:* Secure, Understood, Chosen ✓

One look = *the whole shape of me, and the best parts are locked.* That image converts, not copy.

**Paywall** in V2 = the real first studio paywall (`VClassic`, "01 · The Secure Plan"). The locked You Page hands straight off to it. Honest pricing carries over from the studio (Monthly $14.99, Annual $99.99 shown as the real yearly price with "Save 44%," 7-day trial, Privacy/Terms/Restore).

---

## 10. Transformation graph + "secure"

- **Built as a graph, not an illustration** (it's a data trajectory — squarely in the build's lane). A clean line/curve rising from *reacting* toward *responding*, with three markers: **Today · 7 days · 30 days**. Start **their** dot where the quiz placed them (data-backed, defensible).
- The 1 / 7 / 30-day trajectory is **illustrative of how Kael works** ("what practice looks like"), **not a dated forecast** of this user's results. No outcome-guarantee verbs — soften the line into "what practice tends to look like."
- "Secure" defined experientially, one line (no "not X but Y" frame): *"You'll still feel the spike. You just won't be run by it."*
- Axis labels are **"reacting → responding"** / "spiraling → steady."
- *(If a hand-drawn illustration is preferred over the graph, it converts to an §16 placeholder instead — but default is the built graph.)*

---

## 11. Read generation

**Hybrid: algorithm decides *what*, LLM renders *how*.**
- **Algorithm** computes the profile (§2) deterministically → `corePattern`, `attachmentLean`, `topTriggers`, `coreBelief` + `beliefConfidence`, top `coreValues`, `intensity`, plus the picked `situation`. Guarantees coverage; the network-free fallback.
- **LLM (seam)** takes profile + name + `situation`/`situationText` and writes the beats in Kael's voice. Renders, doesn't diagnose.

**Build = algorithmic-rich now + LLM seam.** A real key can't live safely in a client-side Vite app, so real LLM = a small backend proxy later (Sonnet, not Haiku). For now `buildRead(profile)` produces believable, specific, *short* beats; the picked situation personalizes them; typed text is quoted as a bonus.

**Calibration is latency-adaptive + failure-proof:** a min-display floor (~3s) so the ceremony always plays; advance on `max(floor, readReady)`; a hard timeout (~7s) → silent fallback to the algorithmic read; an offline/error path that still renders the network-free read. Never surface a raw error before the read. Steps tie to their data (*"Mapping your slow-reply trigger…"*).

Custom acks and interstitials are **authored content, not LLM**. The only LLM seam is the read beats.

---

## 12. Interaction + craft

**Layout (the thumb-zone law — every question screen):** question anchored **high** (where the eye lands) → generous breathing space → **options in the lower two-thirds** (the thumb zone, where the hand actually is) → **primary action pinned to the bottom**. One-handed, no reaching, no friction — the ergonomics of the reference. Keep each screen to one job, ≤5–6 options visible; never force a scroll to see the answer set.

**Every option carries a relevant icon**, always — a small line/duotone glyph in a soft chip on the left, label beside it, selected state on the right. Reduces cognitive load, raises scannability, lifts the polish. This is real design work: an apt icon authored for *every* option across *every* question (same effort tier as the custom acks — do not stub it).

**Copy on options:** simple, first-person, short — "I reach out right away," "Sometimes," "2 to 6 times." Plain words, no clauses.

**The statement-relate beat (Movement B):** the recognition statement sits in a **calm, focused card** (quiet surface, a small quote mark), and the responses — *Sounds like me · Sometimes · Not really* — are **big bottom cards/chips**, thumb-reachable, like the reference's Yes/No but three-point for nuance.

- **Back button** to the left of the living-progress header — recovers mis-taps (a wrong tap silently corrupts the scoring the whole read depends on); returns with the answer pre-selected/editable.
- **Confirm beat** on the auto-advancing movements (B/C/D): the answer visibly lands (~400ms, longer on B's heavier beats) before advancing — fast questions stay fast, tender ones get a breath.
- **Auto-advance split:** single-select (hook + A) = ack → Continue; B/C/D = auto-advance with the confirm beat.
- **Movement D multi-select capped** ("pick up to 3," live counter, Continue enabled at 1).
- **Situation picker** is tap-first; "Something else" is the only path to typing, demoted.
- Back-nav / edit available across the diagnostic; ≥44pt targets; reduced-motion variants.

**Motion — subtle micro-animation throughout (alive, never busy).** The rule is *one orchestrated moment per screen + light feedback on every interaction* — enough that it never feels static, restrained enough that it never distracts from the read.

- **CSS-only** (transforms + opacity keyframes + transitions). **No framer-motion** in the onboarding — it wedged the headless preview before, and CSS is the right tool for micro-motion anyway. Reuse the existing `ob2-` keyframes (`enter`, `rise`, `pop`, `trace`).
- **Screen entrance:** content **rises + settles** (~8–12px, 280–360ms, eased), with a **gentle stagger** (kicker → question → options → CTA via `animation-delay`). One well-timed entrance > scattered effects.
- **Option tap:** immediate press feedback (scale ~0.98), then the **selected ink-ring + check draw in** (~200ms). The tap should feel *physical*.
- **Segmented bar:** the active segment fills with an **eased width transition on every answer** (the per-tap momentum); at movement end it **snaps full** and the **living narration line slides/fades in** as the beat.
- **Confirm beat (B/C/D):** the chosen option **lands** — a brief settle/pulse (~400ms) — before the screen advances. The motion *is* the acknowledgement.
- **The read:** hero line + fragments **stagger in** (delays), the chips settle; the medallion placeholder/graph fades up.
- **Transformation graph:** the trajectory **draws** (`stroke-dashoffset`) and the three markers (Today · 7d · 30d) **pop in sequence** — the one "wow" beat, still quiet.
- **Calibration:** ceremonial steps tick through with a soft progress motion.
- **Discipline:** durations 200–500ms; nothing loops or pulses idly; no opacity-fade on critical text that could leave it invisible in headless capture (settle to final state). **`prefers-reduced-motion` → near-instant** (tiny cross-fade only). Screenshot-only `noanim` override available for reliable capture.

---

## 13. Selling (relief, after the read)

- **Always relief, never a feature.** "Kael remembers" → *"never start over and re-explain yourself."* "Journey" → *"watch yourself change."*
- **Cluster after the read.** The quiz is a near-pure mirror; features ride the read beats, each earned by the facet it answers, in *one short line*.

---

## 14. Build approach

- New **"Onboarding V2"** studio tab. Current onboarding untouched.
- **Borrow** the `ob2`/`ob3` system + bespoke screens: signal-medallion welcome, trust sanctuary, mood palette, attachment spectrum, reveal medallion, option cards, screen frame, scoring engine. **Closing paywall = `VClassic` from `PaywallLab.jsx`** ("01 · The Secure Plan"), reused as a static (non-`Ed`-editable) component.
- **New for V2:** the **segmented-bar top chrome** (Back · named section · per-movement segments + living narration); the thumb-zone question layout with an **icon on every option**; recognition / Likert-chip formats with the confirm-beat + back button; silent belief inference (broadened, confidence-gated, gently named); the **scenario-picker** (no free-text dependency); the latency-proof calibration; the **scannable multi-beat read**; the reacting→responding **trajectory graph** (built, not illustrated); **illustration placeholders** (§16) for the bespoke art the user supplies; the **locked You-Page scaffold**; the emotional landing beat.
- **Motion (§12)** is woven in, not bolted on: Pass 1 wires the structural transitions (entrance, segment fill, confirm beat); Pass 2 refines the micro-feedback and the read/graph reveals. CSS-only, reduced-motion safe.

---

## 15. Decisions — resolved

1. Progress = **segmented bar (one segment per movement, fills continuously on every answer, no number) + warm named section + living Kael-voice narration on segment completion**; Back button to its left. Top-bar pattern modeled on Noom (Back · section name · progress), with Kael's voice and per-tap momentum layered on.
2. Free-text capstone **replaced by a scenario picker + optional "Something else"**; quote is a bonus, never required.
3. **Hook pulled to the front** (promise → proof → **payoff** → trust); intro compressed.
4. Beliefs **inferred silently** (broadened taxonomy, confidence-gated), **named gently in the read**.
5. Read = **scannable visual artifact**, multi-beat drip; depth in the locked unlock; emotional landing beat before any lock.
6. Locked You Page = **personalized, glanceable scaffold**.
7. **Calibration latency/failure-proof**; algorithmic-now + LLM seam; Sonnet via proxy later.
8. Transformation = **built trajectory graph** (illustrative of how Kael works, not a dated prediction).
9. Auto-advance on B/C/D with a **confirm beat**; single-selects read the ack + Continue; **back button** for recovery.
10. Name **early (post-hook), used sparingly**; values capped at 3.
11. **Payoff / pre-quiz prep screen** after the hook — sells what the 3 minutes build (goal image + expectations + reward-named CTA) **before** any personal ask, to stop the name-screen drop-off. Progress bar **begins at Name**; Act 1 is the no-bar sell preamble.
12. **No code-drawn illustrations** (§1.11); bespoke art = placeholder + description (§16). **Subtle CSS-only micro-animation** throughout (§12 Motion).

## 16. Illustration manifest (placeholders — user supplies the art)

The build **never code-draws these.** Each renders as a styled placeholder; swap in final art when ready.

**Placeholder treatment** (looks intentional, not broken): a frame at the exact target aspect ratio · soft warm fill + 1px dashed warm border · a small centered image icon · a label "Illustration — [name]" · the one-line description in muted caption. On-brand and calm, clearly reading as "beautiful art lands here."

**Slots:**
1. **Welcome — "signal medallion"** · ~1:1 (~200×200) · Act 1 hero, the most important first impression. A warm, premium emblem evoking *a signal being read / relationship intelligence* — gold line-work on warm paper, calm and confident.
2. **Read Beat 1 — "reveal medallion"** · ~1:1 · the payoff centerpiece as the pattern resolves into focus; should feel like a crest/insight coming clear. Pairs with the pattern name + hero line.
3. *(Optional)* **The loop, illustrated** · ~3:2 landscape · only if a read beat or the You Page shows the named loop (Trigger → Belief → Reaction → Cost) as art. **Explicitly replaces the v1 code-drawn loop** — must be hand-crafted and beautiful.

**Built, not supplied** (so it's unambiguous): segmented progress bar · attachment spectrum + any meters · the reacting→responding trajectory graph · Likert/option chips + cards · all option & section icons (Phosphor) · the locked You-Page scaffold (layout / blur / counts) · mood as Phosphor icons · values as clean chips. None of these are illustrations.

---

## Out of scope (deliberately)
- **No crisis-detection flow** (only the single passive "not therapy" line on the trust screen).
- **No under-18 gate** (18+ is enforced at the App Store).
- **New paywall design** — V2 reuses the existing first studio paywall (`VClassic`), it does not design a new one.
