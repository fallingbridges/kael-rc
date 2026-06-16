# Kael Onboarding V3 — Evaluation Recommendations

Consolidated from the per-axis + cross-cutting evaluation (9 reviewers, 58 raw
findings → 39 deduped → 28 material → adversarially verified). Each item below
survived a skeptic trying to refute it. Refuted/over-stated findings are listed
at the bottom so they are not re-litigated.

Two buckets: **A. Spec / design** (do before building `obv3.js`) and
**B. Code / build** (do during the build). Priority: P0 = real defect, fix now ·
P1 = quality lift, strongly recommended · P2 = polish.

---

## A. Spec / design recommendations

### P0 — Purpose axis: de-moralize Growth (the one real content defect)

The Growth pole owns the aspirational vocabulary (honest, awake, depth, becoming,
understand) while Harmony gets comfort words (safe, ease, home, soft). This is a
same-direction *valence* skew, so the 2+/2- keying balance does nothing against
it: a balanced user reaching for the better-sounding content tilts Growth. Worst
at Q14 and the Q20 anchor (which is ±3, the last beat before the reveal, and the
tiebreaker on a true 0). Violates §5 ("both options must be something a proud
person would claim").

Word-parity rewrites (give Harmony its own earned aspiration; pull "honest" out of
Growth, it is not a G-vs-H distinction):

- **Q3** "When love feels good, I'm pulled more toward…"
  - `G` "Depth and honesty." (was "Depth, honesty, and becoming together")
  - `H` "Warmth and ease." (was "Warmth, ease, and feeling at home")
- **Q14** "After a rough patch, what I need more is…"
  - `H` "To feel close and warm again before we get into it."
  - `G` "To talk through what happened before we move on."
  (Both are legitimate repair styles; neither is the "mature" answer.)
- **Q20 (anchor)** "The love I'm most drawn to leaves me feeling…"
  - `G` "Alive, and always becoming."
  - `H` "Whole, and deeply at home."
  (Strict word-for-word parity bar on anchors: equal virtue-term count per side.)

Rule to add to §5: anchors get a parity audit — count the virtue/aspiration words
on each side; they must match.

### P0 — Closeness scoring parity (math defect)

Closeness is all two-choice (±2, multiples of 4) + a ±3 anchor, so its sum is
**always odd**: reachable |sum| = {1,3,5,7,11}. Consequences: it can never reach
0 (so the "anchor decides on a tie" rule can never fire on Closeness), and it
lands the "Clear" band only at |sum|=5, ~3-4x less often than the other axes.
Identical true confidence produces different read prose purely from item format.

Fix (pick one):
- Give Closeness one **frequency** item (also helps redundancy, below), so it can
  reach every integer including 0 and even values; or
- Derive confidence bands on a **normalized** score (sum / max-reachable) per axis,
  or set band cutoffs from each axis's reachable value set.

Also correct the §4 claim "a true 0 is rare": under realistic answering the
frequency axes tie ~5-9% of the time, not rare.

### P1 — De-duplicate within each axis + cover missing facets

Each axis spends 5 questions measuring ~3 questions' worth of distinct
information, so the 20-question length does not buy 20 questions of signal, the
axis becomes legible by its second appearance, and confidence bands collapse
toward "Strong." No single item mis-types anyone (a ±11 axis with a ±3 anchor is
robust), but this is what holds every axis at 5/10 instead of 8/10.

Replace the redundant/off-construct item in each axis with one covering a missing
facet. Keep the anchor; vary the surface domain of the others.

- **Expression** (worst: Q1/Q6/Q12/Q15 are all say-vs-show): keep the Q12 anchor
  as the pure say/show item; re-point the others to distinct facets — receiving
  love, expression under conflict, self-disclosure pacing. Replace **Q17**
  (currently measures deliberation latency, not expressiveness).
- **Attunement** (conflates perceiving the bond with acting on it): make the axis
  consistently about *perception* (reading the weather), or split coping into its
  own signal. De-duplicate **Q2 vs Q18** (near-inverses of the same perception
  item). Convert **Q11** from a coping action ("check in") to pure perception.
- **Purpose** (missing the trajectory/meaning facet the archetype prose hinges
  on): re-point one item (ideally Q7 or a replaced Q10) at direction/building,
  e.g. Q7 `H` "Let me settle into a life that feels like home" / `G` "Keep
  building toward who we could become." Replace **Q10** (measures
  novelty-tolerance/temperament, not "what love is for").
- **Closeness** (over-samples the alone-time facet): replace **Q9** (measures
  relationship architecture, "a shared world we've built," and leaks Growth via
  "built") with a felt-proximity item; this is also the natural slot for the new
  frequency item from the P0 parity fix.

### P1 — Strip cross-axis vocabulary (discriminant validity)

Growth options are written in perception/insight language (honest, awake,
understand) that overlaps the Attuned vocabulary, and closeness words (together,
home, close) leak into Purpose/Attunement options. This correlates the axes on top
of the trait correlation the model already bakes in, so the 16 cells will not be
equiprobable (~4 overflow, ~4 starve, ~1.9x max/min).

- Remove perception words from the Growth pole; anchor Growth on forward-motion
  and change, not insight.
- Strip closeness words from Purpose and Attunement options so a Close and a Free
  person of equal depth answer them identically. Specific offender: **Q14**'s
  Harmony option is literally a closeness statement ("feel soft and close with
  each other again") — covered by the P0 Q14 rewrite above.
- Accept that part of the correlation is inherent to the chosen axes (the model
  bundles Close+Attuned / Free+Settled) and cannot be removed by wording. Plan to
  validate the real archetype distribution post-launch rather than assume 16 even
  cells.

### P2 — Copy / cognitive-load polish

- **Q18** is the highest-load screen: double-barrelled with a "rather than"
  contrast on a frequency scale. Single-barrel it: "How often do you trust the
  overall feel of a relationship without checking the small signals?" (Or drop it
  in the Q2/Q18 de-dup above.)
- **Triple-adjective options** on the heaviest items (Q3, Q12, Q20) force
  AND-evaluation instead of a glance. Cut to 1-2 words per option; let the luxury
  reading live in the breaks and reveal, not in every option. (Q3/Q20 covered by
  the P0 rewrites.)
- **Q13**: drop "not read into it" so the Settled option stops monopolizing
  "trust"; match option length across the pair.
- **Length parity**: in any two-choice item, keep both options roughly equal
  length and concreteness so the shorter/plainer side does not win on effort.

---

## B. Code / build recommendations (for `obv3.js` + `OnboardingV3.jsx`)

These are already on the build list; flagged here because the current `obv3.js`
still ships the old 18-question bank, so any audit run against the code today is
auditing the wrong instrument.

### P0 — Implement the 20-item instrument

Replace the old `QUESTIONS` bank (c1-c4 / a1-a4 / e1-e4 / p1-p4 / t1-t2) with the
20 spec items as `{ axis, fmt: 'two-choice'|'freq'|'anchor', prompt, options:[{ name,
pole, w }] }`. Add frequency scoring (VO ±2 / Often ±1 / Sometimes ∓1 / Rarely
∓2), set anchor weight to ±3, rebuild `QUIZ_IDS` / `answeredCount` for 20 items.
Delete the old pathologized strings ("Barely notice. They are probably busy.",
"Replaying moments, reading what they meant.", "A little stagnant.").

### P0 — Implement the anchor tie rule

`resolveCode()` currently hard-defaults CF/AS/ER to the + pole on `>= 0` and GH to
Harmony on a tie. Spec §4 mandates: on an exact 0, use that axis's **anchor
option's** direction. Requires tagging the anchor option in the data model. Apply
to all four axes.

### P0 — Add the confidence helper

No `confidence()` / band logic exists in code. Add a helper returning
`{ letter, sum, band }` per axis (Strong/Clear/Leaning/Tie), and wire the
hedge-language + 4-axis map to it. Without this, the reveal presents one archetype
as a hard verdict with no softening on low-confidence axes.

### P1 — Implement anti-gaming + de-label the structure

- Seeded Fisher-Yates option-order shuffle for all two-choice and anchor items
  (frequency scales never shuffled).
- Replace the four-segment progress bar (which broadcasts the four-axis skeleton,
  one segment per axis block) with a single continuous 0-100% bar.

### P1 — Calibration copy

Remove "16" and axis names ("Weighing closeness against freedom") from
`CALIB_STEPS`; one step references the situation. (Per §8 screen 35.)

### P1 — Studio gate

Gate the dev bar behind a flag so it never renders near a real user.

---

## C. Confirmed non-issues (do NOT change)

The adversarial pass refuted these; changing them would add complexity or harm.

- **Meta-gaming / steerability** is not a real risk for a self-insight quiz. The
  keying balance defeats it, and a user who games it only fools herself (no gate,
  no payment to bypass). Do not add anti-gaming complexity beyond the shuffle.
- **Anchor redundancy** (Q8≈Q2, Q16≈Q4): a tiebreaker *should* be the most
  face-valid, high-loading statement of the pole. High correlation is the point,
  not a defect.
- **Attunement intensity** ("two women, same score, opposite nights"): intensity
  is carried by the situation chips and by the Expression axis, by design.
- **Q11 "check in" as pathology**: refuted — it is the culturally flattering
  choice, so it does not drag the Attuned pole. (Only Q13's "not read into it"
  needs the one-word fix in A/P2.)
- **Eliminating Format A**: confirmed correct. It killed acquiescence and most
  pathology; Closeness and Expression are now near-parity and should be the
  template for the rewrites above.
