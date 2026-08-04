# Kael V8 — Session Zero

The onboarding is not an onboarding. It is the user's first session with Kael, and it produces their first Reflection. Everything in this document follows from that one sentence.

---

## 0 · The thesis

V7 is a quiz that ends in a classification. You answer sixteen things, you are told you are The Perfectionist, then you pay.

V8 is a session that ends in a document. The user talks to Kael for three minutes, Kael writes something about them, and that thing is saved to their library. The paywall is not "unlock premium." It is "keep this going."

The product never gets explained. It happens, once, for free, and then it asks to continue.

### The naming, locked

| Word | Means | Never means |
|---|---|---|
| **Session** | The conversation. The onboarding is Session Zero. | The app, the screen, the account |
| **Reflection** | The thing Kael writes at the end of a session. A saved object. | The act of thinking, a mood log, a profile |
| **Journey** | All your Reflections over time. | A program, a course, a streak |

One word, one job. The user's mental model is: *I have a Session, Kael writes a Reflection, my Reflections become my Journey.*

### The activation event

There is exactly one moment this whole flow exists to produce:

> **"How did it know that?"**

If that moment lands, the paywall is the next chapter. If it does not, the paywall is a toll booth. Every rule below exists to protect that moment. Completion rate is a constraint. Activation is the objective.

---

## 1 · The design language is a conversation

The session looks like a chat, in the grammar of the V7 first screen: Kael's lines arrive as typed bubbles behind a small sparkle avatar, the user's answer sits above as their own warm bubble, typing dots hold the beats between bubbles, and the composer never leaves the bottom. Every screen keeps the V7 chassis: head (the mark + Kael wordmark, back chevron on ask screens), body, foot.

### The Ask screen — one exchange per screen

```
                       ┌ "I keep replaying it" ┐   ← their last answer, user bubble
  ✳ ┌ You said "I keep replaying it".     ┐       ← ack bubble, typed in
    └ That stays with me.                 ┘
    ┌ How long has it felt like this?     ┐       ← question bubble, typed in
    └                                     ┘
    ( Since March ) ( A few months )               ← quick-reply chips
    ( Honestly, years ) ( It comes and goes )

  ┌ or say it your way…                ➤ ┐        ← composer, pinned, always
```

The ack and the next question share one screen, like consecutive messages. Sequence: user bubble → dots → ack types → dots → question types → chips stagger in. The dots double as the real model latency, so waiting reads as Kael thinking. Chips are pills; the chosen one inverts and flies up to become the user bubble on the next screen (`layoutId`). A tap anywhere lands the typing instantly.

### The Ceremony screen — frame, noticing, handoff, notify

Same chat column, no question, no chips: Kael's bubbles type in sequence and a pinned CTA advances ("Okay" / "Go on"). The noticing gets a chat-native day-divider label ("SOMETHING I'M NOTICING") above its bubbles. The frame's promise bubble carries a gold left edge and heavier weight.

**Nothing auto-advances, anywhere.** Answering is the advance on ask screens; the CTA is the advance on ceremony screens.

---

## 2 · The rules that keep it honest

These are enforced in the prompt and are not negotiable. Every one of them exists because the alternative is a fortune cookie.

### The cover test

> Cover the user's answer. Does Kael's line still work? If yes, delete it.

Run it on the lines a lesser version of this product would write:

- "That helps me tailor our conversations." → works for any answer. **Filler.**
- "Stress can show up differently for everyone." → works for any answer. **Filler.**
- "Big life transitions can leave us carrying emotions." → works for any answer. **Filler.**

None of those required reading anything. Two of them in a row and the user knows they are in a form wearing a costume.

### Ack rules

1. **One line. Twelve words or fewer.** Two lines only when the second line earns it.
2. **Must contain a word or phrase the user chose.** If they typed it, quote a fragment of it. If they tapped an option, echo a piece of the label.
3. **Never praise.** No "great answer," no "thank you for sharing that," no "that takes courage."
4. **Never therapize.** No "it sounds like you're experiencing," no "I hear that you're feeling."
5. **Rotate the shape.** Four shapes, never two of the same consecutively:
   - **Reflect** — hand the phrase back with a small turn on it
   - **Name** — put a word to the thing they described around
   - **Normalize** — say the thing is common, but only with their specific detail attached
   - **Connect** — tie it to an earlier answer (this is the callback, and it is the strongest)
6. **No em dashes.** Commas and periods.
7. **Kael is "it," never "he."**

### Insight rationing

The tempting structure is *acknowledgment → tiny insight → question* on every screen. It is wrong. An insight that fires nine times is not an insight, it is a tic, and it is exactly where the fortune cookies come from.

**Insights fire at most three times in the session.** The model is told it has three, and told to spend them where there is something real to say. Everywhere else the ack is one plain line.

### The "why I'm asking" move, also rationed

Explaining the reason for a question raises answer quality on intrusive ones. Used everywhere it reads as insecure, like the product justifying itself.

**Twice per session, maximum.** Reserve it for the demographic slots and for whichever question the model judges most invasive.

### Free-text handling

When someone types, quote a fragment back verbatim inside Kael's line. It always passes the cover test, it always reads as attention, and it never requires understanding the sentence.

> *"…that I'm not doing enough." I'm holding onto that one.*

---

## 3 · The flow

25 screens to the paywall. Roughly three and a half minutes.

### Act 0 · Arrival (5 screens: meet, name, age, gender, frame)

---

**1 · Meet Kael** — *Ask-less, CTA*

> **I'm Kael.**
> Your mental wellness coach.
>
> *No forms. Just a conversation.*
>
> `[ Start ]`

The mark breathes once, then settles. That is the entire animation.

**Why:** does not explain the product. Five words of positioning, and "no forms" sets the format expectation so the first ask screen reads as a promise kept rather than a surprise.

---

**2 · Name** — *Ask screen, input only, no options*

> Before we start, what should I call you?
>
> `Your name`

**Why:** the smallest possible first disclosure, and the only screen with no options, which signals that the composer is the real instrument here.

---

**2b · Two quick ones** — *Ask screens, chips, local, no acks*

> *Two quick ones first, so I know who I'm talking to.*
> How old are you? → And how do you identify?

**Why:** demographics happen here, in the setup register, framed honestly as a form. Fast taps, no model call, no acknowledgment ("25 to 34. Noted." is worse than nothing). After the frame, the session is never interrupted by a form question again.

---

**3 · The frame** — *Kael screen, CTA*

> Hi, {name}.
>
> I'm going to ask you a few things. Nothing you say needs to be tidy.
>
> **When we're done, I'll tell you what I see.**

`[ Okay ]`

**Why:** three jobs in three lines. The name lands warm (payoff for giving it). "Nothing needs to be tidy" is the permission-to-be-messy beat, placed immediately before the first heavy question where it raises answer quality. And the bolded line is the promise the entire session is collateral for. Everything the user gives from here is a payment against that sentence.

---

### Act 1 · The Session (19 screens)

Ten asks, seven acks, one noticing, one closing Kael screen.

**The spine.** The model does not free-roam. It covers a fixed set of territories, chooses the order of the middle ones, and writes every line itself.

**Age and gender live in the arrival act, before the frame's promise.** Once the session register starts and someone has told you what they are carrying, any form question reads as Kael not listening. The "demographics as palate cleansers" idea was wrong for this format: the acks are the session's breathing, and it never needed demographic breaks. Arrival slots are pinned local screens (no model call, no acks, fast taps); the session that follows is slow and never interrupted by a form again.

| Slot | Territory | Act | Pinned |
|---|---|---|---|
| 1 | **AGE** | arrival, before the frame | ✅ local |
| 2 | **GENDER** | arrival, before the frame | ✅ local |
| — | **THE FRAME** — the promise | ceremony | ✅ |
| 3 | **OPENING** — what brought them here | session | ✅ pinned first |
| 4–9 | free set, model-ordered | session | |
| — | **NOTICING** | ceremony, after slot 6 | ✅ midpoint |
| 10 | **WANT** — what different looks like | session | ✅ pinned last |

**Free set** (all six must be covered, model chooses order):

| Territory | What it is after |
|---|---|
| DURATION | how long it has been like this |
| BODY | where it lands physically |
| DAYS | what a normal day holds (work, sleep) |
| VOICE | how they talk to themselves |
| REACH | what they do when it gets bad |
| PEOPLE | who they tell, if anyone → captures `people[]` |

**The breathing pattern.** DURATION, DAYS, and PEOPLE are the lighter territories; BODY, VOICE, and REACH are the heavier ones. The prompt tells the model to avoid three heavy territories in a row. The acks between questions are the breathing; the noticing is the one full stop.

---

**Slot 1 · The opening ask** — *pinned copy, not generated*

> So. What's been on your mind lately?
>
> `I can't stop overthinking`
> `Everything feels heavy`
> `I'm stressed and it won't let up`
> `Honestly, I'm not sure`
>
> ┌ *Say it however it comes out* ➤ ┐

**Why:** the emotional hook comes before any demographic. By the time the age question appears, the user has already invested something real, so the form-shaped questions read as context-gathering rather than bureaucracy. This is the one ask whose copy is fixed, because the first impression is too important to leave to a generation that might come back flat.

---

**Every other ask** is generated. Shape:

> {question, one or two lines, second person}
>
> `{option}` × 3–4
>
> ┌ *{placeholder}* ➤ ┐

**Option rules:**
- 3 or 4, never 5
- Written in the user's voice, first person, as real sentences ("I keep replaying it"), never labels ("Rumination")
- Mutually distinct. If two options could describe the same person, one is wasted
- One option should always be the honest low-effort answer ("I don't really know")
- On the two heaviest questions only, a fourth option: `I'd rather not say`

**There is no Skip button.** Options, composer, and nothing else. The composer already is the escape hatch, a third exit only competes with the other two and punches holes in the Reflection.

---

**The noticing** — *Kael screen, CTA, fires after slot 6*

Kael says what it is picking up. No question attached.

> **Something I'm noticing**
>
> {observation, two or three short lines}

`[ Go on ]`

Generated fresh, and it must pass the cover test hardest of all. The strongest form is naming an **absence**:

> You've told me a lot about what happened. Almost nothing about how it felt.

**Why:** three jobs at once. It is the break the flow needs, it is proof of listening at the exact midpoint where attention dips, and it is a trailer for the Reflection. It also carries the entire progress burden (see below).

---

**Slot 10 · The closing ask** — *pinned last*

> If this actually worked, what's different in a month?

Free-text weighted, options dimmer. This answer becomes the closing line of the Reflection.

---

**The handoff** — *Kael screen, CTA*

> I think I have enough.
>
> Give me a minute. I want to put this down properly.

`[ Okay ]`

---

### Act 2 · The build (1 screen)

**The loader.** Real generation, real duration. Roughly eight to twelve seconds.

Large thin serif percentage, centered. Stage lines crossfade beneath in small sans, and **each stage names something the user actually said**:

```
        47%

  Reading what you told me
  Sitting with "I'm still figuring it out"
  Looking for the thread
  Writing it down
```

**Why:** Stella runs a four-to-six second fake timer here. Ours is real, which means it is also variable, so it needs the same choreography as a fake one. The stages quoting the user turns dead time into one more proof of attention.

---

### Act 3 · The Report (1 long screen)

The payoff is not a soft reflection. It is a **session report**: pattern detection with evidence and a break plan, scannable top to bottom. The page order is: kicker ("What Kael found") · **Primary pattern**, named in their language, as the hero · essence line · an honest detection stat ("Detected in 6 of your 8 answers") · **The loop** (it starts / you reach for / it costs, each in their own words, as a three-row table) · **The evidence** (verbatim quotes, each with a short signal label) · **What you didn't say** (the absence) · **How it breaks** (three numbered moves, imperative, each pointed at their specific loop; the third is done with Kael) · signature. CTA: "This sounds like me." The three mechanisms (verbatim quotation, the callback, the absence) remain required, now living inside evidence and loop. The older letter-style sketch below is superseded by this structure.

```
REFLECTION 01                              Thursday, 31 July

{Title, in their language, not a diagnosis}

{Opening, two or three sentences. Second person.
Written for this exact person.}

WHAT YOU SAID
   "I'm still figuring myself out"
   "it just doesn't stop"
   "I don't really talk about it"

WHAT I SEE
{Two or three short paragraphs. Must include at least one
verbatim quote and at least one observation about something
they did NOT say.}

THE THING I'D WATCH
{One forward-looking paragraph. Names something specific to
return to. This is the open loop the paywall closes.}

{tags, drawn from their own words}

                                              — Kael

This is a first impression. It sharpens every time we talk.

Saved to your Journey.
```

**The three mechanisms that produce "how did it know."** These are not writing advice, they are required structure:

1. **Verbatim quotation.** Not paraphrase. Their sentence, in quotation marks, handed back with something noticed about how it was said. Nobody can dismiss their own words as generic.
2. **The callback.** At least one connection between two answers given far apart. Proof of retention.
3. **The absence.** One observation about what they did not say. This is the most therapist-like move available and it cannot fail the cover test by construction.

**Banned from this screen:** emoji category chips, level meters, percentage scores, a pattern name from a fixed list of sixteen. Every one of those converts a personal read back into a category everyone else also gets, and undoes the three mechanisms above in a single row of pixels.

**The Reflection is a `LIBRARY` record.** Not a special onboarding artifact. It is the same shape as every reflection in `ReflectConcept.jsx`, dated, saved, and rendered through the same card in the library afterwards. Their Journey has exactly one thing in it, and that thing is real.

---

### Act 4 · The close

**Revised order:** handoff → **notification ask** → build → **report** → **the road** → **the paywall**. The notification permission now sits BEFORE the reveal: anticipation is at its peak, and the report is generating behind the screen the whole time, so the ask covers real latency. The road is a Today / Day 3 / Day 7 / Day 30 timeline of the loop breaking ("I want that"). The paywall is a letter, "A note from Kael," not a feature grid: you walked in with something unnamed, one session later it has a name, breaking it is the part we do together. Then plans, trial CTA, and the reminder promise. The older post-reveal ordering below is superseded.

---

**Notification permission** — *Kael screen*

> There's one thing in there I want to come back to.
>
> Can I check in with you in a few days?

`[ Yes, check in ]`   `[ Not right now ]`

---

**Rating prompt** — fires right after, native `SKStoreReviewController`

---

**Why this order:** Stella asks for notifications on screen 3 and the App Store rating on screen 4, before anything good has happened, because Stella has no emotional peak before its paywall. V8 does. The thirty seconds after the Reflection lands is the highest-consent moment in the entire product. Asking there, in Kael's voice, framed as continuing a relationship rather than granting a permission, should badly outperform asking a stranger on screen 3.

---

**The handoff to the paywall.** Compose from `PrePaywall.jsx`, which is the live close (`OfferBody`, `SignupBody`, `DeclineBody`, `SavedBody`). The only state it needs is the capitalized first name.

The paywall's voice should be **a letter, not a feature grid**. Stella's paywall is "a note from the team," and that register fits a product that just wrote you something personal far better than four checkmarked bullets do.

---

## 4 · Progress, and why there is no bar

An adaptive session cannot show "12 of 33." Stella can; we cannot. And a long flow with no sense of an ending is how people quit.

**The answer is that Kael carries progress, not the UI.** Three cues, all in voice, all diegetic:

1. The frame screen sets the expectation: *"a few things"*
2. The noticing at the midpoint is a felt milestone. Something changed, so time is passing
3. The handoff screen ends it explicitly: *"I think I have enough"*

No bar, no dots, no counter, no "Question 6 of 10." A progress bar would reintroduce the form feeling this entire design exists to remove. The tradeoff is real and this is the deliberate side of it.

---

## 5 · Design

The aesthetic thesis: **this should look like a page, not an app.** V4 and V7 look like well-made product screens. V8 should look like something printed and quiet, because a session is not a flow.

Inherit the chassis (`ov-page ov4-page ov8-page`, `.ov-screen` at 393×820), add `ov8-` deltas only.

### Chrome: there isn't any

No header, no progress, no back button visible by default. Just paper. Back appears as a small ink chevron in the top left **only after the first ask**, and never on Kael screens (going back on an acknowledgment is nonsense).

### The mark

Kael's presence, reduced to almost nothing. A **7px dot** in `--warm-proof`.

| State | Behavior |
|---|---|
| Thinking | breathes: `scale 1 → 1.35`, `opacity .5 → 1`, 1.4s `ease-in-out` infinite |
| Speaking | still, full opacity, while text types |
| Ask screen | small, top left, static |

No avatar, no orb, no chat bubble, no face. The dot is the whole identity, and because it is the loader too, waiting for the model looks like Kael thinking rather than like a network request.

### Type

| Element | Font | Size | Color |
|---|---|---|---|
| Kael screen line | `--title` (Newsreader) | 30px / 1.35 | `--ink` |
| Echo line | `--serif` italic | 14.5px | `--ink-3` |
| Question | `--title` | 26px / 1.3 | `--ink` |
| Option | `--sans` | 15px | `--ink` |
| Composer placeholder | `--serif` italic | 14.5px | `--ink-3` |
| Section label | `--sans` 600, `.09em` tracking, uppercase | 10.5px | `--ink-3` |
| Reflection body | `--serif` | 16px / 1.62 | `--ink-2` |
| Reflection quote | `--serif` italic | 17px | `--ink` |
| Loader numeral | `--title` 300 | 64px | `--ink` |

### Layout

**The chat column** is top-weighted: user bubble, then Kael's group. Kael bubbles are `--surface` with a hairline and a 5px tail corner; the user bubble is tinted with `--warm-react` and sits right. The avatar (22px, `--badge-fill`, sparkle) marks only the first bubble of a group. Typing dots are the beat between bubbles and double as model latency.

**Options are quick-reply chips.** Pills: `--surface`, `--line-strong` hairline, stadium radius, wrapping under the question bubble at the avatar indent. The chosen chip inverts to `--invert-bg` and flies up to become the next screen's user bubble; siblings fade out.

**Composer** reuses `.rf-input` from the Reflect room: pill, `--surface`, `--line-2` border, serif italic placeholder, `PaperPlaneTilt` send. Using the product's real composer is the point.

### Motion

**The signature move.** On answer, the chosen option (or the typed text) travels up and becomes the echo line on the next screen. `framer-motion` `layoutId`, 420ms, `--ease`. This is the first `layoutId` in the onboarding family, and it is worth the deviation from the house `key={i}` remount pattern, because it is what sells "it heard me" without a scrollback.

**Typing.** Reuse `useReveal` from `ReflectConcept.jsx:15`, which reveals formatted segments so bold and italic survive the character reveal. Speed ramps **22ms → 12ms per character** across the session, and a tap anywhere completes instantly. Non-negotiable: eight screens of un-skippable typewriter is a hostage situation.

**Thinking dwell.** Scales with the length of what they gave. 700ms for a tapped option, up to 1600ms for a long typed answer. In production this is genuinely true, since more input means more tokens, so the honest behavior is also the convincing one.

**Options stagger.** `--d: 0.06s * n + 0.1s`, after the question completes, using the existing `ov4-rise`.

### Light

The paper warms by hour, reusing the `autoTone()` dawn / day / dusk / night logic already in `ReflectConcept.jsx`. Session Zero at 11pm should not look identical to 8am. Costs nothing, and it is the kind of detail that makes a screenshot feel authored.

### The Reflection page

The one screen that breaks the flow's visual language on purpose.

A `--surface` sheet on `--paper`, `--shadow-float`, 20px radius, 28px side margins, so it reads as a page laid down rather than another screen. Masthead rule under the kicker. Quotes indented 16px behind a 2px `--warm-proof` left rule. Section labels in the small uppercase sans, bodies in serif. Signature `— Kael` in title-face italic, right-aligned. Tags as filled pills matching `.rf-card-tag` exactly, because they are the same object.

It should be screenshot-able. People will screenshot this. Design for that.

---

## 6 · The generation layer

### The turn contract

One call per turn, fired the instant they answer. It returns the ack **and** the next question **and** its options together.

**The Kael screen is the async boundary.** The dots render, the call resolves, the ack types. By the time it finishes the next Ask screen is loaded and waiting. The latency is paid for by the most emotionally valuable beat in the flow, and the pause is not theater, it is real.

```jsonc
// POST /api/session/turn  →
{
  "ack": "string | null",        // null on demographic turns
  "insight": "string | null",    // max 3 per session, model-rationed
  "question": "string",
  "options": [{ "label": "string", "tags": ["string"] }],
  "placeholder": "string",
  "territory": "OPENING|DURATION|BODY|DAYS|VOICE|REACH|PEOPLE|WANT|AGE|GENDER",
  "flag": "none|distress|crisis"
}
```

### The Reflection contract

```jsonc
// POST /api/session/reflection  →
{
  "title": "string",              // the thread name, in their language
  "line": "string",               // Kael's one-line read (LIBRARY.line)
  "opening": "string",
  "quotes": ["string"],           // 2–3, VERBATIM from the transcript
  "read": ["string"],             // 2–3 paragraphs
  "absence": "string",            // the thing they did not say
  "watch": "string",              // the open loop
  "moods": ["string"],
  "people": ["string"],
  "topics": ["string"],
  "patterns": ["string"]          // named loops → LIBRARY.patterns
}
```

`moods` / `people` / `topics` flatten into `tags` exactly as `ReflectConcept.jsx:273` already does. This object **is** a `LIBRARY` record.

### The turn prompt

```
You are Kael, a mental wellness coach. You are running Session Zero: a
user's first conversation with you. It lasts ten questions. At the end you
will write them a Reflection.

You are "it," never "he" or "she."

## Your output

Return JSON matching the schema. Nothing else.

## The acknowledgment

Before each new question you acknowledge what they just said.

THE COVER TEST, which governs everything: cover their answer. Does your
line still work? If yes, you have written filler. Delete it and write one
that could only have been written after reading their specific answer.

These all fail and are banned:
  "That helps me tailor our conversations."
  "Stress shows up differently for everyone."
  "Thank you for sharing that."
  "Big changes can leave us carrying a lot."

Rules:
  - One line. Twelve words or fewer.
  - It must contain a word or phrase THEY used. If they typed, quote a
    fragment verbatim inside your line. If they tapped, echo part of it.
  - Never praise. Never say "thank you for sharing."
  - Never therapize. No "it sounds like you're experiencing."
  - No em dashes. Commas and periods only.
  - Rotate shape, never two of the same consecutively:
      REFLECT  hand the phrase back with a small turn on it
      NAME     put a word to the thing they described around
      NORMALIZE say it's common, but only with their detail attached
      CONNECT  tie it to something they said earlier

CONNECT is the strongest. Use it at least once, after turn four.

## Insights

You have THREE insights for the whole session. An insight is one extra
line that tells them something, not just reflects them. Spend them where
there is something real. Every other turn, ack only. If you cannot say
something true and specific, say nothing. `insight: null` is correct most
of the time.

## The question

  - One or two lines, second person, plain.
  - 3 or 4 options, never 5.
  - Options are written in THEIR voice. First person. Real sentences
    ("I keep replaying it"), never labels ("Rumination").
  - Options must be mutually distinct. If two describe the same person,
    one is wasted.
  - One option is always the honest low-effort answer ("I don't know").
  - The placeholder invites their own words and varies by question.

Twice per session at most, and only on demographic or intrusive
questions, give one short clause on why you're asking. More than twice
and you sound like you're justifying yourself.

## Coverage

Territories to cover: {SPINE}. Already covered: {COVERED}.
This turn's territory: {TERRITORY}.
Never two heavy territories back to back.

## Safety

If they disclose self-harm, suicidal ideation, abuse, or acute crisis,
set flag to "crisis", write an ack that responds to THEM and not to a
policy, and set question to "". Do not ask another question. Do not
continue the spine.
If they are in distress but not in danger, set flag to "distress",
slow down, and pick a lighter territory next.

## Transcript

{TRANSCRIPT}
```

### The Reflection prompt

```
Write {name}'s first Reflection from this session.

This is the only screen that matters. If it reads generic, everything
before it was wasted. It must produce one thought: "how did it know that."

Three mechanisms are REQUIRED. Not stylistic advice. Required.

1. VERBATIM QUOTATION
   Quote their actual sentences. Exactly as typed, in quotation marks.
   Not paraphrase. At least two, ideally in the body prose and not only
   in the quotes list. Nobody can call their own words generic.

2. THE CALLBACK
   Connect two answers they gave far apart in the session. Name both.
   This is proof you retained, not just responded.

3. THE ABSENCE
   Name one thing they did NOT say. What they moved past quickly. What
   they described without ever locating in themselves. Where they gave
   you events and no feeling, or feeling and no events.
   This is the single strongest line in the document. Write it carefully.

Apply the cover test to every sentence. If a line would be true of
anyone who downloads a wellness app, cut it. Banned:
   "You carry a lot internally."
   "You're thoughtful but you second-guess yourself."
   "You try to solve emotional problems logically."

Voice: second person, plain, warm, unhurried. Short sentences. No
therapy-speak, no diagnosis, no jargon, no em dashes. Never shame a
coping mechanism. Things they do made sense once.

Length: opening 2–3 sentences. read: 2–3 short paragraphs. watch: one
paragraph naming something specific you want to return to, which is what
the next session would open with.

Tags come from their words, not a taxonomy.

Transcript:
{TRANSCRIPT}
```

### Model configuration

| Call | Config | Why |
|---|---|---|
| Turn | no thinking, `effort: low`, `max_tokens: 1024` | a 900ms ack is the product |
| Reflection | `thinking: {type: "adaptive"}`, `effort: high`, `max_tokens: 4096` | the loader already buys 10s, and this screen is everything |

**Structured outputs** via `output_config.format` on both, so the shape is guaranteed and never needs parsing out of prose.

**Cache the system prompt.** It is byte-identical across all ten turns, so a `cache_control` breakpoint on the last system block makes turns 2–10 read at roughly a tenth the input cost. Note the minimum cacheable prefix is 4096 tokens on Opus, so a short prompt silently will not cache.

**`temperature` is rejected on current models.** Variety cannot be dialed. It has to be written in, which is why the shape-rotation rule exists.

### Cost

Roughly 51k input and 3.3k output per full run. About 34 cents uncached, 10 to 15 cents with the system prompt cached. Fifty design iterations is under ten dollars. Do not economize on the model here.

### Plumbing

The key never enters the bundle. Vite dev-server middleware in `vite.config.js` reads `process.env.ANTHROPIC_API_KEY` and proxies. `.gitignore` gets `.env*.local` **before** any key exists on disk.

The provider is one adapter function, so the same session prompt can be run across models and the acks compared side by side. That comparison is the only evaluation that matters here.

### Turn cache

Every generated turn is stored by index in an array. Back navigation replays from cache and never regenerates. Regenerating different text on a back-tap destroys trust instantly and permanently.

---

## 7 · When it breaks

A static onboarding cannot fail. This one can, and it will fail mid-emotional-moment.

**Turn call fails.** Retry once, silently, behind the thinking dots. If it fails again, **skip the Kael screen entirely** and go to the next pinned question from a client-side spine bank. The user sees a slightly faster beat and nothing else. Never write a fallback ack, because a generic ack is worse than no ack.

**Reflection call fails.** This is the payoff and cannot be faked. Retry with backoff, holding the loader. If it truly fails:

> This is taking longer than it should.
>
> I don't want to give you something half-finished. Let me get it to you properly.

`[ Notify me when it's ready ]`

**Never render a template Reflection.** A generic one is worse than none, because it converts the activation moment into an anti-activation moment and there is no second attempt.

**Slow but working.** Past eight seconds on a turn, the dots gain a quiet line: *"Still with you."*

---

## 8 · Safety

Free text, adaptive follow-up, a mental wellness product, and a user alone at 3am. Someone will type something serious into screen 6. At any volume this is a certainty, not a risk, and it happens in the least supervised part of the product.

**Detection** is a field on every turn response (`flag`), not a separate classifier pass.

**On `crisis` the session stops.** Not pauses, stops.

- Kael's line responds to the person, not to a policy. Generated, not templated.
- Region-appropriate crisis resources, plainly presented, tappable.
- Two paths: `I'm okay, I want to keep going` and `I'll stop here.`
- **If they stop, they do not see a paywall.** They get a way back and nothing else. Monetizing that moment is indefensible and would be the single worst thing this product could do.
- If they continue, the spine drops all heavy territories for the rest of the session and the Reflection is written gentler and shorter.

**On `distress`** the session continues but slows: the next territory is a light one, and one of the three insights is spent on warmth.

---

## 9 · Budget

Screens are the wrong unit. Seconds are the unit.

| Beat | Each | Count | Total |
|---|---|---|---|
| Arrival | ~5s | 3 | 15s |
| Ask screen | ~9s | 10 | 90s |
| Kael screen | ~4s | 7 | 28s |
| Noticing | ~6s | 1 | 6s |
| Handoff | ~4s | 1 | 4s |
| Build loader | ~10s | 1 | 10s |
| Reflection read | ~40s | 1 | 40s |
| **To the paywall** | | **24** | **≈ 3m 15s** |

Stella runs 33 screens, but each is a two-second tap. Ours are fewer and heavier. If the measured time to paywall exceeds four and a half minutes, cut a territory rather than speeding up the typing. The pace is the product.

---

## 10 · Build order

1. `ONBOARDING_V8_SPEC.md` — this document
2. `.gitignore` gets `.env*.local`; Vite middleware; the two prompts and contracts, testable from the terminal before any UI exists
3. `src/obv8.js` — spine, pinned copy, option banks for the fallback path, tag→territory mapping
4. `src/screens/OnboardingV8.jsx` — the two screen types, the session machine, `useReveal` typing, the `layoutId` echo
5. `ov8-*` in `styles.css`
6. The Reflection screen, rendering a `LIBRARY` record through the existing card grammar
7. Register in `App.jsx` as `['onboarding-v8', 'V8']`, first in the Onboarding group
8. Compose the close from `PrePaywall.jsx`

**The prompts are the product.** Get the acks right before writing a line of CSS. A beautiful screen delivering a fortune cookie is a worse outcome than an ugly screen delivering the truth.
