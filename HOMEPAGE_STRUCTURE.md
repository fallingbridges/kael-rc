# Kael — Home Screen Structure (current state)

A reference doc describing the current Home screen, for design/code review by another model.

## App context

**Kael** is a relationship-intelligence app. The user talks to "Kael" (an AI coach) about their relationships. Onboarding sorts each user into 1 of **16 Love Archetypes** (the user here is **The Lighthouse**). The archetype is fixed identity; it never changes. Everything is a high-fidelity prototype rendered inside an on-screen iPhone frame.

The app has 5 tabs via a bottom nav: **Today (Home)**, **Journey**, **Kael (chat)**, **Learn**, **You**. This doc covers **Home**.

- Stack: React + Vite, `framer-motion` for taps/springs, `@phosphor-icons/react` for icons, one big hand-written `styles.css` (CSS variables, no framework).
- Files: `src/screens/HomeScreen.jsx`, styles in `src/styles.css`, routing/state in `src/App.jsx`.
- The demo user is "Maya", Day 142, 6-day streak.

## Design system (tokens)

Warm-paper monochrome, premium-minimal. Light + dark themes.

- Fonts: `--title` Newsreader (serif display), `--serif` Charter (serif body/quotes), `--sans` DM Sans (UI).
- Surfaces: `--paper`, `--surface`, `--surface-2`, `--field`.
- Ink (text): `--ink` (near-black), `--ink-2` (medium), `--ink-3` (light/labels).
- Lines: `--line`, `--line-2`, `--line-strong`.
- Warm accent chip: `--badge-fill` (tan), `--badge-ink` (brown).
- Inverted (for dark cards on light theme / spotlight): `--invert-surface`, `--invert-ink`, `--invert-ink-2`.
- Shadows: `--shadow-card` (whisper), `--shadow-float` (hover lift).
- Eyebrows: 11px, 700, uppercase, 0.13–0.15em tracking, `--ink-3`.
- Cards: 18–28px radius, 1px `--line-2` border, `--shadow-card`, hover lifts 2px to `--shadow-float`.

## Home screen — section by section (top to bottom)

The screen is a vertical scroll (`.home-scroll`). Order:

### 1. Hero card — greeting + today's stats
Container `.arch-card` (warm radial-wash surface, one cohesive color).
- **Greeting row** (`.arch-hello`):
  - Date eyebrow (`.ag-date`): e.g. "WEDNESDAY, JUNE 17".
  - Greeting (`.ag-greet`, `<h1>`, big serif ~33px): "Good afternoon, Maya" (time-based: morning/afternoon/evening).
  - Avatar (`.ag-avatar`, top-right): initial "M".
- **Stats band** (`.arch-stats`, separated by a hairline border-top): two stats, big serif numbers + uppercase labels.
  - `142` / "Days with Kael"
  - 🔥 `6` / "Day streak" (flame icon in warm amber)
- Not interactive. No archetype here (deliberately removed; archetype is constant, so it was pulled out of the daily greeting).

### 2. Live read card — "Kael's read on you"
Container `.read-card` (plain surface, faint Lighthouse glyph watermark). **The whole card is tappable and navigates to the You tab** (the full read). This is intended as the retention hook: Kael's evolving read of the user that updates as they talk.
- **Header** (`.read-head`):
  - Label (`.read-label`): "KAEL'S READ ON YOU".
  - Freshness (`.read-fresh`): a pulsing green dot (`.read-pulse`, CSS keyframe) + "Updated 2 days ago".
- **Insight** (`.read-insight`, serif ~20px): "You reach for clarity when what you really need is to feel safe." (This is the "live"/evolving line.)
- **Footer** (`.read-foot`):
  - Archetype tag (`.read-arch`): 🏛 "The Lighthouse" (small, with lighthouse glyph).
  - CTA (`.read-cta`): "Open your read →".

### 3. "What's alive right now?" — the primary action
Container `.pickup` (a prominent input box).
- Serif prompt: "What's alive right now?"
- Text input + circular send button. Submitting sends the text to Kael and switches to the chat tab.
- Placeholder: "Say it out loud, or just start typing…".

### 4. "Bring a mood to Kael" — mood grid
Eyebrow "BRING A MOOD TO KAEL" + a 3-column grid (`.mood-grid`) of 6 tiles (`.mood-tile`), each an icon + label:
- Anxious, Hurt, Hopeful, Lonely, Calm, Overwhelmed.
- Tapping a mood opens chat with a mood-specific exchange.

### 5. "Bring a situation to Kael" — situation pills
Eyebrow "BRING A SITUATION TO KAEL" + a 2-column grid (`.ways`) of 6 pills (`.way-pill`), each icon + short label, that send a fuller message to Kael:
- "I'm spiraling", "We had a fight", "They're distant", "I feel rejected", "Mixed signals", "Overthinking it".
- Tapping starts a chat seeded with that message.

> Note: sections 3, 4, and 5 are all "start a conversation with Kael" entry points (one open input + two chip sets).

### 6. "From Kael" — square poster feed
Eyebrow "FROM KAEL" + a vertical stack (`.kfeed`) of 5 **square (1:1) poster cards** (`.poster`). All posters share **one structure**:
- A chip label on top (`.poster-chip`), optional tag pill (`.poster-tag`, e.g. "2 min").
- A body of **two short paragraphs** (`.poster-quote` > `.pq-para`), with emphasis on **individual words** (bold via `<strong>`, italic via `<em>`), never whole sentences.
- A CTA at the bottom (`.poster-cta`) with an arrow.
- A `tone` controls the whole-card color: `ink` (dark/inverted), `warm` (cream), or default (plain surface). A faint glyph watermark sits behind.
- Tapping a poster brings that thread into chat.

The 5 posters:
1. **From Kael** (tone: ink) — "You keep **apologising** for taking up space in your own life. / Your needs were never the problem. You learned that being *easy* was the price of being **kept**." CTA: "Talk it through".
2. **Reflection** (tone: warm) — "When someone pulls back, your mind reaches for the **worst** reading. / But distance is often a nervous system asking for *room*, not the start of an ending. The story you add is the part that **hurts**." CTA: "Sit with this".
3. **Try today** (default, tag "2 min") — "The urge to send one more text is rarely about the **message**. / Name the feeling first: "I feel unseen." That pause is where your **choice** comes *back*." CTA: "Practice with Kael".
4. **Your pattern** (default) — "When things feel uncertain, you reach for **clarity** to make the fear go quiet. / The relief lasts a minute. Then the *reaching* itself crowds out the closeness you actually **wanted**." CTA: "Catch it earlier".
5. **For a Lighthouse** (tone: warm) — "You hold steady from arm's length, giving them almost **nothing** to read. / Steady from a distance can *read* as steady toward no one. Once a week, close the distance on **purpose**." CTA: "Bring this to Kael".

## Data shapes (for reference)

```js
// Live read card
LIVE_READ = { label, updated, archetype, insight }  // taps -> You page

// Poster (From Kael feed) — uniform structure
{
  id, chip, Icon, tag?, tone?,        // tone: 'ink' | 'warm' | undefined
  quote: [ paragraph, paragraph ],    // each paragraph is an array of segments
  // segment: { t: string } | { t: string, em: 'b' | 'i' }
  cta, msg                            // msg is the text sent to chat on tap
}
```

## Interactions / navigation

- Bottom nav switches tabs; Home is default.
- Hero: not interactive.
- Live read card: whole card -> **You tab** (full "Kael's read of you").
- "What's alive" input, mood tiles, situation pills, and posters: all -> **Kael (chat) tab**, seeded with the relevant text.

## Copy rules (house style)

- Sentences 5–10 words where possible, human and plain, no poetic vagueness.
- **No em dashes** anywhere in copy.
- Curly apostrophes/quotes.

## Open design questions being worked on

(Context for review — these are unresolved.)

1. **Clutter.** Six stacked modules; three of them (What's alive, Bring a mood, Bring a situation) are all "start a chat." Considering collapsing them into one input + a single compact row of quick-start chips.
2. **Archetype prominence.** The archetype should be a **prominent element inside the read card** (lead with "The Lighthouse", with the evolving read line + "updated" beneath it) rather than a small footer tag — but it should NOT headline the daily greeting hero, since the archetype is constant.
3. **Ordering.** Whether the live-read card belongs above or below "What's alive right now?". Current thinking: above, grouping greeting + read as a "you" zone at the top, then the action, then the feed.

## Goal of the screen

A daily-return home that (a) welcomes the user and shows their progress, (b) surfaces Kael's evolving read of them as the reason to come back, (c) makes it one tap to bring something to Kael, and (d) offers passive, scrollable reflections. Should feel calm and premium, not busy.
