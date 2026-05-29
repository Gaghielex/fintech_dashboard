# PRD — Doggo Finance
**Version:** 2.0 — Draft
**Status:** In review
**Last updated:** May 2026
**Builds on:** V1.0 (approved, built)

---

## Overview

V2 extends Doggo Finance with visual polish, new data insights, improved navigation, and a richer converter experience. No architectural changes to the core data model. All new features build on the existing Google Sheets + Frankfurter API foundation.

The scope is organized into three effort tiers: Quick Wins (low complexity, high return), Medium Effort (self-contained features requiring meaningful build time), and Higher Effort (complex interactions or new data surfaces).

---

## Schema Changes (Google Sheets)

These changes are required before or during V2 build. Make them now to avoid retroactive effort.

### Accounts tab — add column

| Column | Type | Notes |
|---|---|---|
| icon_url | string | Direct image URL for bank logo. Null falls back to initials avatar. |

### Goals tab — add column

| Column | Type | Notes |
|---|---|---|
| icon_url | string | Direct image URL for goal institution logo (e.g. RMIT). Null falls back to goal initials. |

### Snapshots tab — new tab

Manually populated after each account update session. One row per update.

| Column | Type | Notes |
|---|---|---|
| date | date | ISO format YYYY-MM-DD |
| total_aud | number | Total net worth in AUD at time of update |
| liquid_aud | number | Liquid total in AUD at time of update |
| deposits_aud | number | Term deposit total in AUD at time of update |

Rules:
- Never delete rows. This tab is append-only.
- Values are manually read from the app hero number after each update session and typed here.
- App reads all rows. Time range selectors unlock progressively as data accumulates.

---

## V2 Features

---

### QUICK WINS

---

#### QW-01 — Pull to refresh / refresh button

**Status:** ✅ Implemented

**What:** Add a visible refresh button to the home tab header (and support pull-to-refresh gesture on mobile). Re-fetches Google Sheets data and FX rates without a full page reload.

**Why:** Users update the sheet then open the app expecting fresh data. Currently requires a manual browser reload.

**Acceptance criteria:**
- [ ] Refresh button visible in home tab header
- [ ] Pull-to-refresh gesture triggers the same re-fetch on mobile
- [ ] Loading state shown during fetch (spinner or skeleton)
- [ ] Freshness indicator updates after successful refresh

---

#### QW-02 — Cash account type badge

**Status:** ✅ Implemented

**Note:** The `cash` type value was added to the Accounts sheet and app logic in a previous merge. This ticket covers the visual treatment only.

**What:** Give `cash` accounts a distinct badge so they are visually differentiated from `transaction` accounts, which currently share the same grey badge.

**Current state:** Cash accounts render with the same grey badge as transaction accounts. This is ambiguous.

**Target state:**
- Cash badge: white or off-white (`#E6EDF3` or similar) with dark text, clearly distinct from the transaction grey
- All other badge colours unchanged: transaction (grey), savings (teal), term deposit (gold)
- No logic changes required -- badge colour mapping only

---

#### QW-03 — Bank and goal logos via icon_url

**Status:** ✅ Implemented

**What:** Display institution logos on account rows (Accounts tab) and goal cards (Goals tab). Logo sourced from `icon_url` column in the respective sheet tab.

**Fallback:** If `icon_url` is null, empty, or the image fails to load (404), render a coloured circle with the institution's initials. Colour seeded deterministically from the institution name string (consistent across sessions).

**Scope:**
- Account rows: logo replaces or sits alongside the bank name
- Goal cards: logo shown in the card header area
- No logo in account expanded detail (redundant)

---

#### QW-04 — Fortnightly update reminder

**Status:** ✅ Implemented

**What:** On app load, check if the most recent `last_updated` value across all accounts is more than 14 days ago. If yes, show a dismissible in-app banner.

**Banner content:** "Balances may be out of date — last updated [date]. Update now →"

**CTA:** "Update now" deep-links directly to the Google Sheet URL. Opens in Safari.

**Dismissal:** Stored in `localStorage` as `reminder_dismissed_at`. Reminder re-appears after another 14 days regardless of whether the sheet was actually updated (app has no write access to verify).

**Edge case:** If all accounts have been updated within 14 days, no banner is shown.

---

#### QW-05 — Draggable goal priority

**Status:** ✅ Implemented

**What:** Goals on the Goals tab can be reordered by drag-and-drop.

**Storage:** Order stored in `localStorage` under key `goal_order` as an array of goal IDs. Applied on top of the Sheets data order on each render.

**New goal handling:** If a goal ID appears in the sheet but not in `localStorage`, append it to the end of the saved order.

**No Google Sheets write access required.**

---

#### QW-06 — App logo (Doggo Finance)

**What:** Design and implement the Doggo Finance logo/mark in three placements:

1. PWA home screen icon (180x180px square, with safe zone padding)
2. Top-left of home tab header on mobile (~32px height)
3. Top of left sidebar on desktop (~48px height)

**Design constraint:** Logo must work as a standalone mark at all three sizes. A wordmark is optional and secondary. Style must be consistent with the flat vector illustration aesthetic already established in V1.

**Note:** PWA icon changes do not auto-update existing home screen bookmarks. Users must re-add manually. No in-app notice required.

---

#### QW-07 — Search on Accounts tab

**Status:** ✅ Implemented

**What:** Add a search input to the Accounts tab that filters the visible account list in real time.

**Search scope:** Account name, bank name, owner name.

**Behaviour:**
- Fuzzy match, case-insensitive
- Search operates within the currently active filter (country or person). Does not clear the active filter.
- Empty state: "No accounts match your search"
- Search input clears on tab exit

---

#### QW-08 — Number masking

**Status:** ✅ Implemented

**What:** All sensitive balance numbers start blurred on every load/refresh and can be revealed by tapping an eye toggle in the top-right of the net worth card.

**Scope:**
- Hero AUD total, Liquid, In Deposits, and Super all blur/unblur together
- Eye-off icon in the top-right corner of the net worth card
- Smooth `filter: blur(10px)` → `none` CSS transition on tap
- State lives in `DashboardApp` so visibility persists across tab switches within the session
- Resets to hidden on every page reload or pull-to-refresh

---

#### QW-09 — Country flag icons

**Status:** ✅ Implemented

**What:** Replace placeholder country indicators with real circular flag images for Australia, Japan, and Ecuador.

**Implementation:**
- Flag images sourced from `flagcdn.com`, displayed as full-bleed circles using `object-fit: cover`
- Applied in both the home tab geography tiles and the accounts tab country section headers
- Retirement/Super section retains its existing bank emoji — no country flag for super accounts

---

---

### MEDIUM EFFORT

---

#### ME-01 — Bottom nav redesign (glass pill)

**Status:** ✅ Implemented

**What:** Redesign the bottom navigation bar with a floating glass pill aesthetic and a smooth active-state animation.

**Visual spec:**
- Floating pill shape, does not span full screen width
- `backdrop-filter: blur(20px)` with semi-transparent background
- Subtle top-edge border with light tint (rim light effect)
- Sufficient margin from bottom edge to float above content
- Does not overlap the freshness bar on the home tab (layout adjustment required)

**Animation:**
- Active indicator animates between tab positions using Framer Motion `layoutId`
- Transition: spring, fast (under 300ms)
- No full-screen slide transitions -- tab content fades only

**Performance note:** `backdrop-filter` is GPU-accelerated. Test on iPhone SE (2nd gen) minimum. If jank is observed, fall back to a solid semi-transparent background.

---

#### ME-02 — Converter tab redesign with swipeable rate cards

**What:** Redesign the Convert tab rate context section. Replace the current static cards with two swipeable cards: JPY/AUD and USD/AUD.

**Each card contains:**
- Current rate (large, DM Mono)
- 30-day sparkline / mini line chart pulled from Frankfurter historical endpoint
- Rate trend label (see logic below)
- 30-day min, max, and current position indicator

**Trend label logic (deterministic, not financial advice):**

Calculate two signals:
1. 7-day slope: is the rate higher or lower than 7 days ago?
2. Range position: bottom third / middle third / top third of 30-day range

Combine into a plain-language label:

| Slope | Range position | Label |
|---|---|---|
| Up | Bottom third | "Rising from recent lows -- watch closely" |
| Up | Middle | "Trending up -- mid-range" |
| Up | Top third | "Near recent highs -- momentum may slow" |
| Down | Top third | "Falling from recent highs -- consider acting" |
| Down | Middle | "Trending down -- mid-range" |
| Down | Bottom third | "Near recent lows -- may continue falling" |
| Flat | Any | "Stable at [position] -- no strong signal" |

Label framing: always presented as rate context, not financial advice. No "buy" or "sell" language.

**Swipe interaction:** Consistent with the geography section swipe. Two cards, two pagination dots.

**EUR:** EUR/AUD card not included. EUR account is minimal. EUR remains in the converter fields for calculation purposes only.

**API note:** The 30-day historical data fetched for these cards is the same dataset used by HE-01 (historical FX chart). Both features must share a single fetch and cache layer. Do not make duplicate API calls.

---

#### ME-03 — Three-view geography section (Home tab)

**What:** Replace the static geography cards grid with a swipeable horizontal section offering three views.

**View 1 — Geography cards (current)**
Existing country tiles. No changes to content.

**View 2 — Allocation donut**
- Donut chart showing % of total net worth by country (AU / JP / EC)
- Centre label: total net worth in AUD
- Segment labels: country name + percentage
- Colours: teal for AU, gold for JP, grey for EC
- Net worth view only in V2. Liquid toggle deferred.

**View 3 — Interactive map**
See HE-05 for full spec. This view slot is active in V2, not a placeholder.

**Navigation:** Horizontal swipe + pagination dots. Three dots total.

---

#### ME-04 — Net worth delta chip

**Status:** ✅ Implemented

**What:** Surface a net worth delta on the home screen hero section, derived from the Snapshots sheet tab.

**Display:** Below or adjacent to the hero net worth number:
- "+$X,XXX (+X.X%) since [date]" in positive colour (teal)
- "-$X,XXX (-X.X%) since [date]" in negative colour
- If fewer than two snapshot rows exist: chip not shown

**Data source:** Snapshots tab. Delta calculated between the two most recent rows.

**Tap behaviour:** Tapping the chip navigates to or expands the net worth trend chart (ME-05).

---

#### ME-05 — Net worth trend chart

**Status:** ✅ Implemented

**What:** A line chart showing total net worth over time, built from the Snapshots tab.

**Placement:** Accessible via tap on the delta chip (ME-04). Rendered below the hero section or in an expanded drawer.

**Chart spec:**
- X axis: date
- Y axis: AUD value
- Single line: total net worth
- Optional secondary lines: liquid and deposits (togglable, off by default)
- Time range selector: 30d / 90d / 180d / 1Y / All
- Each range option shown only if at least 2 data points exist within that window
- Minimum display: 3 data points before the chart renders at all

**Chart library:** Recharts (already in stack).

**Empty state:** "Net worth history will appear here after a few updates."

---

#### ME-06 — Avatars redesign (G and A)

**Status:** ✅ Implemented

**What:** Redesign the overlapping avatar initials in the top right of the home screen.

**Spec:**
- G: teal (#00C896)
- A: pink (as updated in V1 heuristic review)
- A circle in front of G circle (A overlaps G)
- Tappable: opens a bottom sheet showing per-person balance summary (same data as ownership split tiles)

---

---

### HIGHER EFFORT

---

#### HE-01 — Historical FX rate graph (Convert tab)

**What:** A full 12-month line chart for JPY/AUD and USD/AUD, pulled from the Frankfurter API historical endpoint. No manual data entry required.

**Data:** Frankfurter `/v1/[start_date]..` endpoint. Fetch on Convert tab load. Cache in session state.

**API note:** Shares the same fetch and cache layer as ME-02 (rate cards). Single API call for both features.

**Chart spec:**
- X axis: date (12 months back from today)
- Y axis: rate value
- Vertical marker: today's rate
- Horizontal band: 30-day min/max range
- Time range selector: 30d / 90d / 1Y
- JPY/AUD and USD/AUD as togglable views (not stacked)

**Placement:** Below the swipeable rate cards on the Convert tab, or via "View history" tap on a rate card.

**Performance:** ~365 data points per pair. Lightweight for Recharts. Async fetch with skeleton loading state.

---

#### HE-02 — In-app rate threshold alert

**What:** On app load, compare current FX rates against user-defined thresholds stored in `localStorage`. Show a dismissible in-app banner if a threshold is crossed.

**Threshold setup:** "Set alert" button on the Convert tab opens a simple input. Value stored in `localStorage`. No Settings sheet integration.

**Alert types:**
- JPY/AUD above X: "JPY is strong -- may be a good time to convert"
- JPY/AUD below X: "JPY is weak -- consider waiting"
- USD/AUD above / below X: same pattern

**Not a push notification.** Fires on app open only. Push notifications deferred to V3.

**Dismissal:** Per-alert, stored in `localStorage`. Re-triggers if the rate crosses the threshold again on a future app load.

---

#### HE-03 — Nav icons revamp

**Status:** ✅ Implemented

**What:** Replace current generic nav icons with custom icons consistent with the flat vector illustration style.

**Scope:** 4 icons (Home, Accounts, Goals, Convert), two states each (active: teal, inactive: #484F58).

**Format:** SVG inline or as React components for easy colour theming.

**Design constraint:** Must read clearly at 24px. Filled style, not outline.

---

#### HE-04 — Glass card treatment (app-wide)

**Status:** ✅ Implemented

**What:** Apply glass morphism consistently across card surfaces throughout the app.

**Scope:**
- Bottom nav pill (ME-01)
- Rate cards on Convert tab
- Goal cards (Goals tab)
- Geography tiles (Home tab)
- Account rows (Accounts tab) -- evaluate visually, may be too dense

**CSS spec:**
```css
background: rgba(22, 27, 34, 0.6);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.06);
box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.08) inset; /* rim light */
```

**Risk:** `backdrop-filter` on older iPhones. Test on iPhone SE (2nd gen). If jank is observed on account rows (densest surface), remove glass treatment from that surface only. All other surfaces retain it.

---

#### HE-05 — Interactive map view (geography section, View 3)

**What:** A stylized dark map showing the geographic distribution of money, accessible as the third swipe view in the geography section (ME-03).

**Interaction:** Swipe to this view from the geography cards or donut. Country pins show the AUD equivalent for that country. Tapping a pin navigates to the Accounts tab pre-filtered to that country (same behaviour as tapping a geography card).

**Map library:** Mapbox GL JS with a custom dark style matching the app palette (`#0D1117` base). Alternative: a lightweight SVG world map with manually positioned labels if Mapbox adds too much bundle weight -- evaluate during build.

**Styled to match the design system:**
- Background: `#0D1117`
- Country highlight fill: teal for AU, gold for JP, grey for EC
- Pins: oversized, rounded, consistent with the illustration aesthetic
- No political borders beyond what is necessary to identify country locations

**Country pin content:**
- Country flag emoji or custom icon
- Total AUD equivalent for that country
- Tap navigates to Accounts tab filtered to that country

**Performance:** Mapbox adds ~250kb to the bundle. Evaluate lazy-loading the map view so it does not affect initial app load time.

---

## Out of Scope — V2

- Push notifications (requires service worker + backend -- V3)
- Light mode
- In-app goal creation form
- Google Sheets write access from the frontend
- Account type breakdown chart (below-fold home screen -- V3)
- Currency exposure chart (below-fold home screen -- V3)
- Super account detail / fund API integration
- Ownership drift view
- FX sensitivity / net worth volatility indicator

---

## Summary Table

| ID | Feature | Effort | Depends on | Status |
|---|---|---|---|---|
| QW-01 | Pull to refresh | Quick win | -- | ✅ Done |
| QW-02 | Cash badge visual treatment | Quick win | -- | ✅ Done |
| QW-03 | Bank / goal logos via icon_url | Quick win | Schema update (icon_url) | ✅ Done |
| QW-04 | Fortnightly update reminder | Quick win | -- | ✅ Done |
| QW-05 | Draggable goals | Quick win | -- | ✅ Done |
| QW-06 | App logo (Doggo Finance) | Quick win | Design asset | |
| QW-07 | Search on Accounts tab | Quick win | -- | ✅ Done |
| QW-08 | Number masking | Quick win | -- | ✅ Done |
| QW-09 | Country flag icons | Quick win | -- | ✅ Done |
| ME-01 | Bottom nav glass pill + animation | Medium | Design spec | ✅ Done |
| ME-02 | Converter swipeable rate cards | Medium | Frankfurter historical API, shares fetch with HE-01 | |
| ME-03 | Three-view geography section | Medium | Recharts (donut), HE-05 (map) | |
| ME-04 | Net worth delta chip | Medium | Snapshots tab | ✅ Done |
| ME-05 | Net worth trend chart | Medium | Snapshots tab, ME-04 | ✅ Done |
| ME-06 | Avatars redesign (G and A) | Medium | Design asset | ✅ Done |
| HE-01 | Historical FX chart | Higher effort | Frankfurter historical API, shares fetch with ME-02 | |
| HE-02 | In-app rate threshold alert | Higher effort | -- | |
| HE-03 | Nav icons revamp | Higher effort | -- | ✅ Done |
| HE-04 | Glass card treatment (app-wide) | Higher effort | ME-01 | ✅ Done |
| HE-05 | Interactive map view | Higher effort | ME-03, Mapbox GL JS | |

---

## Recommended Build Order

1. Schema updates first (icon_url columns, Snapshots tab) -- unblocks QW-03, ME-04, ME-05
2. QW-01 through QW-07 -- independent, any order
3. ME-01 (nav) -- unblocks HE-04
4. ME-02 (converter cards) -- establishes shared Frankfurter fetch layer
5. HE-01 (FX chart) -- immediately after ME-02, reuses same fetch
6. ME-03 (geography swipe) -- depends on HE-05 for View 3
7. HE-05 (map) -- build alongside or after ME-03
8. ME-04 + ME-05 (delta + trend chart) -- sequential, ME-04 first
9. ME-06 (avatars) -- independent, slot in anywhere
10. HE-02 (rate alert) -- after HE-01
11. HE-03 + HE-04 (icons + glass) -- polish pass, last
