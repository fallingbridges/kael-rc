# Kael Paywall Strategy

The paywall that follows the 47-screen onboarding. Grounded in the funnel doc (ONBOARDING_V7_CONTENT.md) and a research sweep of 2024-2026 paywall data: RevenueCat State of Subscription Apps 2025/2026, Adapty State of In-App Subscriptions 2026, Superwall's test corpus and case studies, growth.design and abtest.design case libraries, and teardowns of Rosebud, Stoic, Finch, Breeze, Liven, Calm, Headspace, Noom and Cal AI. This version has been through an adversarial review pass (monetization, brand, and iOS compliance lenses); the fixes are baked in.

---

## 1 · The job of this paywall

After 47 screens, the paywall's job is not to sell. The selling is done. The user has named their problem, met their pattern, read a document about themselves, set a daily goal, signed a promise with their finger, and watched their 30 days get laid out. The paywall's only job is to **close without breaking the spell**.

**The one-line strategy: the paywall is screen 48 of the same ceremony. It hands the user the thing they just built, states the terms with total transparency, and gets out of the way.**

Every element below follows from that. The moment the paywall looks like a template (stock gradient, feature grid, countdown timer), it tells the user the previous 15 minutes were theater, and it forfeits the premium the onboarding earned. The IKEA effect literature is explicit: effort raises willingness to pay only when it ends in a completed, owned artifact. Generic paywall copy throws that artifact away.

One vocabulary rule before anything else: **the paywall may only use words the funnel already taught.** The funnel sold a *pattern*, a *read*, a *coach*, a *promise*, and *30 days*. It never once said "plan," "premium," "subscription," or "membership." Those words are template tells; they don't appear on this screen.

## 2 · What the research says (the ten findings that matter)

1. **Hard paywall is right.** Hard paywalls convert installs to paid at ~10.7% median vs ~2.1% freemium, with near-identical year-1 retention, and ~8x revenue per install at day 60 (RevenueCat 2026). Keep it hard. No skip path. (See §3 for why our own funnel will land far below that 10.7% and why that's expected.)
2. **Day 0 is the whole game.** 80-90% of trials start on install day. There is no "they'll subscribe later." This one screen carries the business, so it earns disproportionate design and testing investment.
3. **Trial transparency is the best-documented lever in our category.** Blinkist's "how your trial works" timeline plus a reminder promise: +23% trial starts, complaints down 55%. The #1 paywall objection is "I'll forget to cancel." Answer it on the screen, and only promise what we can deliver (§7).
4. **Personalized paywalls are an open gap in mental wellness.** Rosebud, Stoic, Finch, Wysa and Youper all show generic feature lists after their quizzes. Nobody in mobile mental wellness quotes the user's own quiz output on the paywall. Kael has a named pattern, a signed promise, and a minutes goal to quote. This is our edge.
5. **Radical simplicity wins.** Minimal paywalls consistently beat dense ones in Superwall's corpus (their headline claim: a hero-headline-button layout beat a comparison-chart layout by 111%). Note: Superwall reports the same 111% figure for the plain-CTA finding below; treat both as one directional "simplicity wins" signal from a single vendor corpus, not two independent facts. The direction is corroborated by RevenueCat's four redesign case studies, where every winner went long-form to short-form.
6. **Plain CTAs beat themed CTAs.** "Continue" outperformed descriptive CTAs in the same Superwall corpus (see caveat above). "No payment due now" and "Cancel anytime" microcopy are consistent winners. Restating price under the CTA helps, never hurts. Caveat for Kael: that corpus wasn't measured downstream of 47 conditioning taps where "Continue" has meant "no consequences" every time, so CTA copy is a day-one test here, not a settled fact (§5).
7. **Attach the trial to the annual plan only.** The free-trial toggle is dead (Apple rejects it since January 2026), but its economics survive Apple-safe: annual carries the trial, shorter plans don't. Moonly's version: paywall conversion +39%, revenue per 100 installs +47%. And show fewer plans: Mojo's annual-only layout with a "View other plans" link lifted annual share 15-20%.
8. **Real social proof or none.** Runtastic swapped its promo line for a single authentic 5-star review: +44% paid subscriptions. The operative word is authentic. A launch app has no reviews, so the control ships without a testimonial (§4). Fabricated quotes with star glyphs violate the FTC fake-review rule (16 CFR Part 465, in force since October 2024) and App Review honesty guidelines.
9. **The decline path is a second business.** Transaction-abandon catcher paywalls drove 17% of total revenue across an 18-app study, with LOWER refund rates than full-price converters. Discounts belong there, never on the main paywall.
10. **Test money beats design money.** Trial-structure and pricing experiments win 45-60% of the time; visual redesigns win 34.6%. The test roadmap (§10) is ordered accordingly: offers first, structure second, art last.

And one guardrail finding: the aggressive quiz-funnel apps (Liven, Breeze) monetize hard and are bleeding trust for it. Countdown timers, paywalled quiz results, and surprise charges have earned them "the trap snaps shut" Trustpilot reviews, billing disputes, and rising ad costs. Kael's onboarding gives the reveal and the full read away BEFORE asking for money. That generosity is a conversion asset. Protect it.

## 3 · The economics (read this before the design)

The design only matters if the math works, so the math goes first.

**Net revenue per annual subscription.** Enroll in the App Store Small Business Program at launch (any app under $1M/year qualifies). Apple's cut is 15%, not 30%. At $89.99/year that nets **$76.49** (stress case at 30%: $62.99). Every payback number below uses 15%; treat 30% as the stress case only. The post-Epic external-checkout link (US storefront, supported by Superwall/RevenueCat tooling) is a later margin lever worth a line item, not a launch dependency.

**Honest funnel math.** Multiply our own targets: 60-70% of installs reach the paywall (the realistic band for a 47-screen flow) × 9-12.5% view-to-trial (unique viewers) × 35-40% trial-to-paid. That's **1.9-3.5% install-to-paid**, or roughly **$1.45-$2.68 first-charge revenue per install** at $76.49 net, before the decline ladder adds its ~17%. Call it **$1.70-$3.10 per install, all-in.**

**Why this doesn't contradict finding #1.** RevenueCat's 10.7% median is measured across all hard-paywall apps, most of which have short onboardings and direct purchase (no trial filter). Kael's 47-screen reach discount (×0.6-0.7) and the trial filter (×0.35-0.40) are exactly what turn 10.7% into ~2-3%. Same physics, different funnel shape. Whoever approves ad budget should anchor on 2-3%, not 10.7%.

**The uncomfortable implication.** US iOS mental-wellness CPIs on Meta run $2.50-$6+. At $1.70-$3.10 revenue per install, first-charge payback is marginal at the low end of CPI and underwater at the high end. This is normal for the category (renewals, monthly mix, and winbacks close the gap for everyone), but it dictates three things about the launch config rather than leaving them to taste:

1. **Price at $89.99, not $69.99.** The research says pricing high earns 3-5x LTV without proportional conversion loss, the category ceiling is Rosebud's $107.99, and our payback math needs every dollar. $69.99 is the downward test arm, not the control.
2. **Trial vs no-trial is a genuine coin-flip, so it's experiment #1.** Wellness data favors trials (trial-started annuals out-LTV direct buyers). But 86% of AI apps skip trials, our closest comps monetize day 0, and a trial pushes all cash and the real purchase event 7+ days out, which starves Meta's optimization during the most capital-intensive learning phase. Run 7-day trial vs no-trial direct purchase as a 50/50 from day one.
3. **Paywall reach is the biggest lever on the sheet.** Moving reach from 60% to 70% is worth more than any on-paywall test. Instrument per-screen drop-off across all 47 screens before spending on paywall variants.

**Meta measurement (so the trial arm doesn't fly blind).** Decide per campaign what Meta optimizes on: with a trial, purchase events arrive 7 days late and trial starts carry $0 value, so either optimize on the StartTrial event (volume signal, no value) or let the no-trial arm carry value optimization. Define the SKAN conversion-value schema around paywall reach, trial start, and purchase before launch. The ad promise, the onboarding story, and the paywall must say the same thing, or Meta's feedback loop optimizes toward the wrong users.

## 4 · The screen, top to bottom

Kael's design language throughout: cream paper, ink, Newsreader serif title, DM Sans details, the gold seal. It should look like the 48th screen of the onboarding, because it is. Content is specified in priority order; §9 defines what compresses on small screens, because this stack does not all fit on an iPhone SE and pretending otherwise means someone else decides what gets cut.

### Top: the hero (illustration strategy)

**Recommendation: no illustration. The hero is the user's own pattern seal.**

The pattern glyph (their Spiral, Flame, Scales or Waves) sits inside the same gold-stamped seal the "You're all set!" ceremony just used. Small, centered, quiet. Continuity does three jobs: it says "same ritual, last step," it puts the endowed artifact (their identity) at the top of the ask, and it avoids the single biggest failure mode, which is the paywall suddenly looking like a different app.

Why not the alternatives, and when to test them:

- **Animated chat demo** (a Kael exchange typing itself). The evidence for motion is real (+8-18% for video/animated heroes, Adapty and RevenueCat data) and a chat product is invisible in a static screenshot. But the user has already seen the chat demo twice (intro beat 2, breather 2). Test as a hero variant in the polish phase.
- **Big emotional illustration.** No evidence it converts, and placeholder-quality art would undercut 47 screens of typographic confidence. Skip.
- **Their signature echoed above the CTA.** Novel, Cialdini-backed, zero published tests, cheap to run. Polish-phase variant: "You signed a promise two minutes ago. This is how you keep it."

### The headline

**Control:**

> **{Name}, your 30 days start today.**

Kicker above it: **Built from your answers**

"30 days" is the funnel's own noun: the screen ten seconds ago was literally titled "Your 30 days with Kael." The headline turns the price into what it buys, frames the trial as day 1 of a journey already in motion (endowed progress), and works identically in the no-trial arm. This is the Noom handoff pattern ("your X is ready") rebuilt in Kael's vocabulary instead of Noom's.

Fallback when no name was given: "Your 30 days start today."

**Subtitle (one line, personalized):**

> A coach tuned to The Brooder, working toward a calmer mind.

One metaphor, not two. The pattern name and goal phrase are Superwall user attributes set during onboarding (at the reveal and goals screens, well before presentation), with liquid defaults so a sync race never renders a hole: `{{ user.patternName | default: "your pattern" }}`, `{{ user.goalPhrase | default: "what you came here for" }}`.

**Never pipe raw quiz labels into prose.** Screen 35's options are first-person strings that break in this sentence ("working toward Being kinder to myself"). Set a bespoke `goalPhrase` per goal at selection time:

| Goal picked (screen 35) | goalPhrase |
|---|---|
| A calmer mind | a calmer mind |
| Breaking the cycle | breaking the cycle |
| Being kinder to myself | a kinder voice in your head |
| Steadier energy | steadier energy |
| Feeling like myself again | feeling like yourself again |
| Just some relief | some real relief |

Multi-select rule: first pick wins. If somehow empty, the default fires.

### The centerpiece: the trial rail (trial arm only)

The same thick rail visual from the "Your 30 days with Kael" screen, and this is the delicate part: **the trial must never shrink the journey.** The user just memorized "Day 7: Your first shift, named." If the paywall re-renders Day 7 as "Trial ends," the 30-day story gets overwritten by a 7-day billing window wearing its clothes. So the rail keeps the 30-day frame and threads the trial mechanics through it:

> ● **Today** · Day 1 of 30. Full access, free.
> ○ **Day 5** · We'll remind you before your trial ends.
> ○ **Day 7** · Trial ends. Your 30 days keep going.
>
> (the rail runs on past Day 7 and fades toward a small unlabeled Day 30 node, so the destination stays on screen)

- "Today" node pre-filled, exactly like the journey screen. This is the Blinkist +23% pattern rendered in a visual the user already trusts.
- The Day 5 line is conditional and operationally backed; §7 covers who sends the reminder and what non-permission users see instead.
- No cancel-deadline claim on the Day 7 row. Apple attempts renewal charges up to 24 hours before expiry, so "cancel anytime before day 7" is a promise Apple's billing can break. The cancel reassurance lives in the CTA microcopy as the always-true "Cancel anytime."
- In the no-trial arm this section is replaced by three benefit lines in the same rail visual (Today · Day 7 · Day 30 as transformation beats, no billing copy), which keeps the layout identical across arms.

### The plan

**Control: one card plus a link** (the Mojo layout, +15-20% annual share; it also relieves the viewport and keeps low-LTV monthly buyers from muddying early cohorts).

> ┌ **Yearly** · badge: **7 days free** ┐
> │ 7 days free, then $89.99/year. │
> │ That's $7.50 a month. │
> └──────────────────┘
>
> View other plans

- "View other plans" opens monthly ($12.99/month, no trial) and, later, any test SKUs.
- Every number is a Superwall product variable, locale-formatted, never a hardcoded string: `{{ products.primary.price }}`, monthly-equivalent computed from rawPrice. A savings badge ("Save 42% vs monthly"), if used, is computed from both products' rawPrice at render time, because Apple's price tiers round differently per storefront and a hardcoded "55%" will be wrong somewhere.
- Trial rides the annual only. Monthly is deliberately trial-less (the Apple-safe replacement for the banned toggle).
- No invented strikethrough prices. Anchor plan against plan, real numbers only.

### Social proof

**The control ships without a testimonial.** We have no App Store reviews at launch, and an invented quote with star glyphs on a purchase screen is an FTC violation, an App Review risk, and the exact theater the whole strategy exists to avoid. The calibration screen's loader quotes (screen 40) should be revisited under the same standard.

If the slot needs weight before real reviews exist, use honest mechanism proof in one line, no stars, no quote marks: "Built on CBT and ACT. Read from your own 16 answers." Once real reviews accumulate, swap in a verbatim quote, ideally pattern-matched (an overthinker's review shown to MIND-primary users). That's the Runtastic play (+44%), run honestly.

### The CTA block

State-dependent, bound to the selected product. This is not optional polish; static microcopy becomes a lie the moment someone selects monthly.

**Annual selected (trial arm):**

> [ **Continue** ]
> No payment due now · Cancel anytime
> 7 days free, then $89.99/year

**Monthly selected:**

> [ **Continue** ]
> $12.99/month, billed today · Cancel anytime

**No-trial arm (annual):**

> [ **Continue** ]
> $89.99/year, billed today · Cancel anytime

- "Continue" is the control CTA; "Start my free week" is a day-one 50/50 test, not an afterthought (§5).
- Terms restated in small type under the button, always describing the selected product. Transparency converts in this category; it also happens to be what 3.1.2 requires.
- Button instant, full-width, bottom-pinned, exactly like the previous 47 CTAs.

### The footer (required, control, not variant)

> Restore · Terms · Privacy

Muted DM Sans, one row. Guideline 3.1.2 requires functional Terms and Privacy links on auto-renewable subscription paywalls, and a hard paywall without Restore permanently locks out a paying subscriber who reinstalls. This footer is the difference between passing and failing review, and its ~28pt is budgeted in the viewport math (§9).

### The close button

Visible X, top corner, standard weight, no delay games. Hiding it is the losing dark pattern (Blinkist's losing control did it), and Apple is actively policing paywall opacity. The X is not a leak; it's the trigger for the decline ladder (§8), where the real recovery economics live.

## 5 · CTA strategy, summarized

| Layer | Copy | Why |
|---|---|---|
| Button (control) | Continue | Plain beat themed in Superwall's corpus; harvests, doesn't re-sell |
| Button (co-test, day one) | Start my free week | 47 screens conditioned "Continue" = "no consequences"; on screen 48 it fires a payment sheet. The corpus never tested that. Run 50/50, judge on refund-adjusted revenue per viewer and the 3-hour trial-cancel rate (the reflex-tap signature) |
| Above/below button | No payment due now · Cancel anytime | The two highest-consensus microcopy wins in the industry; shown only when true for the selected product |
| Under button, small | 7 days free, then {price}/year | Transparency lifts (+23% Blinkist); Apple requires it anyway; always product-bound |
| The reminder promise | We'll remind you before your trial ends (on the rail) | Kills the #1 stated objection; measurably cuts complaints and instant-cancels; shown only when deliverable (§7) |

The deeper CTA principle: every button from screen 41 onward has escalated commitment ("This sounds like me" → "I want that" → "I commit to myself"). The paywall button must NOT escalate further. It de-escalates precisely because the psychological work is finished; asking for one more act of bravery at the money moment adds friction, not resolve.

## 6 · Offer architecture and pricing

- **Launch config:** Annual **$89.99** with 7-day free trial, one card + "View other plans" link revealing Monthly $12.99 (no trial). No-trial direct purchase runs as the 50/50 challenger from day one (§3).
- **Why $89.99:** the payback math (§3) doesn't clear at $69.99, the evidence says price high, and the category ceiling (Rosebud $107.99) is well above it. $69.99 is the downward test arm; $99.99 is the upward one.
- **Why 7 days if trialing:** vendor data conflicts on trial length (RevenueCat: longer converts better; Adapty: shorter converts better). 7 days is the category compromise and the defensible start; length is a later test.
- **Weekly SKU:** not at launch. Weekly is how Liven monetizes and how Liven earned its reviews. Revisit only if annual payback fails both price arms, and then with eyes open.
- **Unit economics honesty:** 72% of annual subscribers cancel auto-renew within year 1. Treat annual LTV as roughly the first charge: $76.49 net at 15%. Renewals are upside, not plan.

## 7 · The reminder promise (make it true before making it pretty)

"We'll remind you before your trial ends" is the strategy's best trust lever and its biggest liability if unkept. The funnel collects no email (name only, screen 9), and screen 39's gentle notification ask has a real "Not now" path plus an iOS system prompt that can still be denied. So:

1. **Schedule a local notification for day 5 in the Superwall transaction-complete callback.** No backend needed. Copy in Kael's voice: "Your trial ends in 2 days. Staying is one tap, and so is going."
2. **Render the rail's Day 5 line conditionally** on notification permission (passed as a Superwall user attribute). Permission granted: "We'll remind you before your trial ends." Not granted: "Day 5 · Check in. Two days left to decide."
3. **Re-ask permission right after purchase** for deniers, with the reminder as the stated reason ("So we can remind you before day 7"). This is literally Blinkist's 74% opt-in mechanic, and post-purchase is the highest-trust moment available.
4. **Known gap, documented:** local notifications die if the app is deleted. Acceptable at launch; email capture (e.g. at receipt/export features later) closes it eventually. Never print a promise that depends on a channel we don't have.

## 8 · The decline ladder (where the aggression lives, quietly)

The main paywall stays clean because Superwall placements catch the leaks:

1. **Transaction abandon** (user taps Continue, then cancels Apple's payment sheet): catcher paywall with a genuinely discounted annual (33-50% off, e.g. $49.99/year, real price, no fake strikethrough). This placement alone was worth 17% of total revenue across 18 apps, and its converters refund LESS than full-price buyers. Build this first.
2. **Paywall decline** (user taps X): one screen, gain-framed: "Your pattern read is saved for you" plus the discounted annual or monthly fallback. **Configured to fire exactly once** via audience filters on the placement (Superwall's decline rules won't do this by themselves; without filters the catcher's own decline re-triggers the ladder, and the infinite discount staircase is the documented Liven trust-killer).
3. **The post-X state, specified so engineering doesn't improvise:** a native locked screen, not a re-shown paywall loop and not a dead end. It shows the user's saved pattern seal and one line ("Your read is saved. Your 30 days are ready when you are.") with a single "Resume" CTA that re-triggers the paywall placement. App relaunch lands here too, which doubles as the permission-independent winback path.
4. **Later:** 24-hour welcome-back offer via push where permission exists, and Apple native win-back offers for lapsed subscribers.

Framing rule for every decline surface: gain-framed, never threatening, and always the funnel's own artifact ("your pattern read," "your 30 days," never "your plan"). "Your read is saved for you" converts the same anxiety that "your results will be deleted" weaponizes, without the reactance, and threats against the quiz artifact are exactly what Breeze gets torched for.

## 9 · Layout reality and implementation requirements

**Viewport math.** The full stack (X row, seal, kicker, headline, subtitle, three-row rail, plan card + link, CTA block, footer) runs roughly 850-900pt with honest spacing. That fits a 6.1" phone and does not fit an iPhone SE (667pt), which Meta traffic will include. Degradation order, specified now so nobody deletes the price by accident:

1. Below ~740pt: shrink the seal, drop the mechanism-proof line if present.
2. Below ~700pt: rail compresses to two rows (Today + Day 7) and loses the fade-out node.
3. Still over: allow scroll with the CTA bottom-pinned and the selected plan's full price guaranteed above the fold. Type size never drops below the funnel's standard; the ceremony's typographic confidence is not the compression budget.

**Superwall implementation requirements** (the continuity thesis silently depends on these):

- **Preload the paywall during onboarding** and verify it's warm before screen 47's CTA. A spinner at the handoff is precisely the "suddenly a different app" failure.
- **Embed Newsreader and DM Sans and all 16 pattern glyphs** in the paywall bundle. No system-font fallback on the money screen.
- **Fallback paywall** for config-fetch failure on first launch (flaky cellular is the norm for ad-driven installs): a cached variant plus a minimal native StoreKit screen as the last resort. A hard paywall that fails to load is an app that doesn't work.
- **User attributes** (`patternName`, `goalPhrase`, notification state) set at the moment each is known (reveal, goals, permission screens), with liquid defaults on every templated token.
- **Product variables for every number on screen.** No hardcoded prices, no hardcoded savings percentages, no hand-typed per-month math (and when per-week framing gets tested, derive it in the template with round-half-up: $89.99/52 is $1.74, not a truncated $1.73).

## 10 · Test roadmap (reordered by expected value, with costs)

Instrument first: per-screen onboarding drop-off (reach is the biggest lever, §3), paywall reach (target 60-70%), view-to-trial on unique viewers (target 9-12.5%), trial-to-paid (median 35-40%, top decile 68%), 3-hour trial-cancel rate, refund rate. Judge every test on refund-adjusted revenue per paywall viewer, not trial starts.

| # | Test | Arms | Judged on | Rough cost to significance |
|---|---|---|---|---|
| 1 | Trial structure | 7-day trial vs no-trial direct | Revenue/viewer + Meta signal quality | ~200 paid events/arm ≈ 7-10K installs/arm. The big one; budget it |
| 2 | CTA copy (cheap, parallel) | Continue vs Start my free week | Trial starts + 3-hr cancel + revenue/viewer | Fast; resolves on trial starts (~2K viewers/arm) |
| 3 | Price | $89.99 vs $69.99 (later $99.99) | Revenue/viewer, LTV | Same denominator as #1; run after or stratified |
| 4 | Plan display | Card+link vs two stacked cards | Annual share, revenue/viewer | Moderate |
| 5 | Multi-page paywall | Single page vs value → reminder → price sequence | Revenue/viewer | The biggest cited structural effect (+37%, 40M-open study) and the funnel's grammar is already sequential; promoted above all art tests |
| 6 | Polish: headline noun | 30 days vs coach vs pattern handoff | Revenue/viewer | Only after offers stabilize |
| 7 | Polish: hero | Seal vs animated chat vs signature echo above CTA | Revenue/viewer | Cheap to build, low expected effect |

Deep-personalization headline variants must stay inside the funnel's no-shame frame: the pattern "loosens its grip" (screen 47's own words), it never gets "quieted" or "fixed." Test only frames the brand could ship as control.

A note on statistical honesty: at ~2-3% install-to-paid, any test judged on paid events needs tens of thousands of installs per arm. That's real money (at a $3 CPI, roughly $25-30K per arm). Sequence accordingly, use trial starts as the fast proxy where the metric allows it, and don't run seven tests at once on launch traffic.

## 11 · What NOT to do (brand and platform guardrails)

- **No countdown timers on the main paywall.** Documented Trustpilot poison in this exact category, and pressure cues measurably suppressed conversion in the Blinkist case.
- **No free-trial toggle.** Apple has rejected it under 3.1.2 since January 2026.
- **No fake strikethrough prices, no invented reviews, no borrowed stars.** Every number and every quote on the screen must be real. Same rule, one standard.
- **No hidden or delayed X.** No evidence for delay; active enforcement risk; the decline ladder monetizes the X better than camouflage does.
- **No unkeepable promises.** The reminder line renders only where a delivery channel exists (§7). No "cancel anytime before day 7" against Apple's 24-hour renewal window.
- **No feature-comparison grid, no "Kael Premium" framing.** The word "Premium" implies a lesser Kael exists. There is one Kael and the user already met it.
- **No new vocabulary.** Pattern, read, coach, promise, 30 days. Not plan, not membership, not unlock.
- **No em dashes, no shadows, no off-palette color.** Screen 48 of the ceremony.

## 12 · The copy, on one screen (control render, annual selected, trial arm)

> ✕
>
> ⟡ [pattern glyph in gold seal]
>
> BUILT FROM YOUR ANSWERS
>
> **Maya, your 30 days start today.**
>
> A coach tuned to The Brooder, working toward a calmer mind.
>
> ● **Today** · Day 1 of 30. Full access, free.
> ○ **Day 5** · We'll remind you before your trial ends.
> ○ **Day 7** · Trial ends. Your 30 days keep going.
> ┊ (fades toward Day 30)
>
> ┌ **Yearly** · 7 DAYS FREE ┐
> │ 7 days free, then $89.99/year. │
> │ That's $7.50 a month. │
> └──────────────────┘
> View other plans
>
> [ **Continue** ]
> No payment due now · Cancel anytime
> 7 days free, then $89.99/year
>
> Restore · Terms · Privacy

Every line either hands over something the user built, states a term plainly, or answers the cancel objection before it forms. Nothing on the screen asks the user to believe anything new, and nothing on it is a promise the app can't keep.
