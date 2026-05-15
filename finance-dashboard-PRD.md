# PRD — Personal Finance Position Dashboard
**Version:** 1.0 — Final, ready for build  
**Status:** Approved  
**Last updated:** May 2026  

---

## Problem Statement

Two people manage 18 bank accounts across 3 countries (Australia, Japan, Ecuador), 3 currencies (AUD, JPY, USD), with different account types, interest rates, ownership structures, and financial goals. There is no single place to see the complete financial picture without manually checking each bank app.

The goal is a shared, mobile-first dashboard that makes this information instantly readable, visually engaging, and updated on a predictable cadence (fortnightly or monthly). It should feel like a personal tool built specifically for this household — not a generic finance app.

---

## Solution

A Progressive Web App (PWA) hosted on GitHub Pages, backed by a Google Sheet as a manual data source, with live FX rates from the Frankfurter API. Four distinct screens accessible via bottom tab navigation: Home, Accounts, Goals, and Convert. Mobile-first, desktop-compatible, accessible via a home screen bookmark on iPhone.

---

## User Stories

### General
1. As a user, I want to open the app and see a password prompt so that anyone who finds the URL cannot view our financial data.
2. As a user, I want the password to be remembered on my device so that I am not re-prompted on every visit.
3. As a user, I want the app to work on my iPhone home screen like a native app so that I can access it in one tap without opening a browser.
4. As a user, I want the app to work on desktop as a comfortable scale-up of the mobile layout.
5. As a user, I want all currency conversions to use live rates fetched on load so that AUD equivalents are always current.
6. As a user, I want to see a global data freshness indicator so that I know how recently balances were manually updated.
7. As a user, I want the app to degrade gracefully if the FX API is unavailable, showing the last known rates with a timestamp rather than a blank screen.

### Home Tab
8. As a user, I want to see a bold illustration at the top of the home screen so that the app feels personal and engaging, not generic.
9. As a user, I want to see a greeting with the current date so that the app feels alive and context-aware.
10. As a user, I want to see our combined avatar initials (R and N overlapping) in the top right so that the shared nature of this tool is immediately visible.
11. As a user, I want to see our total household net worth in AUD as the hero number so that I can assess our overall financial position at a glance.
12. As a user, I want the hero number to be displayed in Syne font, large, in teal, so that it is the most visually dominant element on screen.
13. As a user, I want to see three sub-lines beneath the hero number — liquid, in deposits, and super — so that I understand the composition of the total without scrolling.
14. As a user, I want the sub-lines to use DM Mono font to visually distinguish data from labels.
15. As a user, I want to see a geography section showing where our money is, grouped by country (Australia, Japan, Ecuador), so that I can understand our geographic distribution at a glance.
16. As a user, I want each geography tile to show the native currency amount prominently and the AUD equivalent below it, so that I can read both without extra taps.
17. As a user, I want to tap a currency amount on any tile to cycle through AUD, JPY, and USD equivalents, so that I can see the value in any currency without leaving the screen.
18. As a user, I want the tap-to-cycle currency state to be per-tile, not global, so that each tile maintains its own display independently.
19. As a user, I want a Retirement tile in the geography grid, visually distinct from cash account tiles, so that super is visible but clearly categorised as illiquid.
20. As a user, I want geography tiles to be tappable and navigate to the Accounts tab pre-filtered to that country, so that I can drill into detail naturally.
21. As a user, I want to see an ownership split section below the geography grid showing Rodrigo, Nat, and Joint totals in AUD, so that individual financial positions are transparent.
22. As a user, I want joint account balances counted in full for both individuals (not split 50/50), so that our shared money is represented accurately for each person.
23. As a user, I want tapping an ownership tile to navigate to the Accounts tab pre-filtered to that person, so that the drill-down is consistent with the geography interaction.
24. As a user, I want to see a data freshness bar at the bottom of the home screen showing when balances were last updated, so that I never mistake the dashboard for live bank data.
25. As a user, I want the freshness indicator to turn amber if data is more than 30 days old, so that stale data is clearly flagged.

### Accounts Tab
26. As a user, I want the Accounts tab to open in a default state grouped by country when accessed directly, so that geography remains the primary mental model.
27. As a user, I want the Accounts tab to open pre-filtered to a specific country when tapped from a geography tile, with other countries collapsed, so that the drill-down is seamless.
28. As a user, I want the Accounts tab to open pre-filtered to a specific person when tapped from an ownership tile, so that the person view is equally accessible.
29. As a user, I want a filter bar at the top of the Accounts tab with options for All, Rodrigo, Nat, and Joint, so that I can switch ownership views without returning to the home screen.
30. As a user, I want a group toggle (By Country / By Type / By Person) so that I can reorganise the account list based on what I need to understand.
31. As a user, I want country section headers to show the country name, flag, total balance in native currency, AUD equivalent, and account count, so that I have a summary without expanding.
32. As a user, I want country sections to be collapsible, with collapse state driven by entry point, so that I see only what is relevant to the context I came from.
33. As a user, I want each account row to show bank name/account name, account type badge, owner initial (R/N/J), and balance (native + AUD equivalent), so that I can read all key information without tapping.
34. As a user, I want account type badges to be colour-coded: transaction (grey), savings (teal), term deposit (gold), so that account types are scannable without reading labels.
35. As a user, I want the owner initial (R, N, or J) to appear on each account row so that ownership is immediately clear when viewing mixed lists.
36. As a user, I want stale accounts (not updated in 30+ days) to appear at reduced opacity with a clock badge showing days since update, so that data quality issues are visible without being alarming.
37. As a user, I want accounts with status "matured" to show a green Matured badge so that I know a term deposit cycle has completed and funds are available.
38. As a user, I want accounts with status "pending_renewal" to show a gold Pending renewal badge so that I know money is technically liquid but mentally reserved for re-locking.
39. As a user, I want accounts with status "inactive" to be visually muted so that dormant accounts do not distract from active ones.
40. As a user, I want to tap an account row to expand a detail view showing interest rate (for savings and term deposits only), maturity date, notes, and last updated date, so that I can access deeper information on demand.
41. As a user, I want interest rate to be hidden from the account row surface and only visible in the expanded detail, so that the list stays clean for accounts where rate is not relevant.
42. As a user, I want the Accounts tab page title to show the total count and AUD equivalent of all currently visible accounts, so that the filter context is immediately clear.

### Goals Tab
43. As a user, I want to see a liquid available strip at the top of the Goals tab showing the current AUD liquid total and an overall on-track status, so that I understand my planning capacity before reading individual goals.
44. As a user, I want each goal to display as a separate card with a name, due date, target amount, current progress bar, threshold line, and key stats, so that each goal is self-contained and readable.
45. As a user, I want the progress bar to represent my liquid balance as a percentage of the target amount, so that I can see how close I am to the goal.
46. As a user, I want a threshold line on the progress bar with a label below showing "need $X by now", so that I know whether I am ahead or behind schedule without interpreting the bar alone.
47. As a user, I want the threshold line position to be calculated based on time elapsed in the goal window, so that the "on track" reference is always current.
48. As a user, I want a secondary time elapsed bar below the main progress bar so that I can see how much of the time window has passed.
49. As a user, I want goal stat chips showing surplus/shortfall, days remaining, and due date, so that the key numbers are surfaced without requiring mental calculation.
50. As a user, I want goal cards to be colour-coded by accent (teal for Semester 1, gold for Semester 2) so that multiple goals are visually distinct.
51. As a user, I want an "Add a goal" button at the bottom of the Goals tab that opens the Google Sheet Goals tab directly, so that I can add new goals without needing a form in the app.
52. As a user, I want goal amounts and dates to be editable exclusively via the Google Sheet, so that the app remains read-only and architecturally simple.

### Convert Tab
53. As a user, I want to see three live currency fields (AUD, JPY, USD) simultaneously so that I can edit any one and see the others update instantly.
54. As a user, I want to tap any currency field to make it the active input, so that I can convert from any of the three currencies without a separate selector.
55. As a user, I want to see rate context cards for JPY/AUD and USD/AUD showing the current rate, 30-day range, current position on that range, and a plain-language label (e.g. "Mid-range · not peak"), so that I can assess whether now is a good moment to convert or transfer.
56. As a user, I want the 30-day range data to be fetched from the Frankfurter API historical endpoint so that no manual tracking is required.
57. As a user, I want to see balance shortcut pills (Japan total, Ecuador total) below the rate cards so that I can pre-fill the converter with my actual balances in one tap.
58. As a user, I want a live "Updated now" indicator next to the tab title so that I know rates are current.
59. As a user, I want the converter to show the last known rates with a timestamp if the Frankfurter API is unavailable, rather than showing an error or blank fields.

---

## Implementation Decisions

### Hosting and Deployment
- GitHub Pages, static site, no server required
- Vite + React build pipeline, deployed via GitHub Actions on push to main
- Repository name intentionally obscure (not "finance-dashboard") as a basic discoverability deterrent

### Authentication
- Client-side password gate on app load
- Password hardcoded as a build-time environment variable (Vite `VITE_APP_PASSWORD`)
- On correct entry, a flag is written to `localStorage` so the user is not re-prompted on the same device
- Session persists until localStorage is cleared
- This is a deterrent, not cryptographic security — acceptable for this use case

### Data Source
- Google Sheets API v4, read-only
- API key scoped to Sheets API only, restricted to the specific spreadsheet ID in Google Cloud Console
- Data fetched on app load, cached in React state for the session
- No polling or real-time sync — user refreshes to get updated data

### FX Rates
- Frankfurter.app API — free, no key required, CORS-enabled
- Current rates fetched on load for AUD/JPY and AUD/USD
- 30-day historical rates fetched for the Convert tab range bars
- Graceful degradation: if API call fails, last known rates shown with a "rates as of [date]" label

### PWA
- `manifest.json` with app name, icon, theme colour (#0D1117), display: standalone
- Apple PWA meta tags: `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`
- No service worker in v1 — no offline mode
- "Add to Home Screen" instructions surfaced once on first visit via a dismissible banner, stored in localStorage

### Tech Stack

| Layer | Choice |
|---|---|
| Hosting | GitHub Pages |
| Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Charts / progress bars | Recharts (minimal use) |
| Animation | Framer Motion — hero number count-up, currency flip, card entrance |
| Data source | Google Sheets API v4 (read-only) |
| FX rates | Frankfurter.app |
| PWA | Manual manifest + Apple meta tags |
| Fonts | Syne (display/hero), DM Sans (UI), DM Mono (numbers/data) — Google Fonts |

### Design System

**Colours**
```
Base:           #0D1117
Surface:        #161B22
Surface+1:      #21262D
Border:         #30363D
Primary teal:   #00C896
Accent gold:    #F0C419
Text primary:   #E6EDF3
Text secondary: #8B949E
Text tertiary:  #484F58
Positive:       #3FB950
Warning:        #D29922
Negative:       #E24B4A
```

**Typography**
- Syne 800: hero net worth number, screen titles, section headers, geography tile names
- DM Sans 400/500/600: all UI labels, body text, badges, navigation
- DM Mono 400/500: all currency amounts, balances, rates, dates, data values

**Motion** (Framer Motion, applied sparingly)
- Hero number: count-up animation on load
- Account cards: staggered fade + translate-up on tab entry
- Currency tap-to-cycle: crossfade between values
- Tab transitions: fade (not slide)
- Stale data flag: amber pulse, subtle

### Navigation
- Bottom tab bar, 4 tabs: Home / Accounts / Goals / Convert
- Active tab: teal accent line above icon, teal icon colour
- Inactive tabs: #484F58 icon colour, no line

### Asset Classification (mirrors Google Sheet status column)
| Type | Included in "liquid" | Included in "deposits" | Included in net worth |
|---|---|---|---|
| transaction (active) | yes | no | yes |
| savings (active) | yes | no | yes |
| term_deposit (active) | no | yes | yes |
| term_deposit (matured) | yes | no | yes |
| term_deposit (pending_renewal) | yes | no | yes |
| super | no | no | yes (retirement section) |
| inactive | no | no | yes (with flag) |

### Joint Account Counting
- Joint accounts counted in full for both Rodrigo and Nat in the ownership split
- Not split 50/50
- Displayed as a separate "Joint" tile in addition to individual totals

### Currency Tap-to-Cycle
- Per-tile state, not global
- Cycles: native currency → AUD → USD (for JPY tiles) or native currency → JPY → USD (for AUD tiles)
- Implemented with local React state per tile component
- Crossfade animation between values

### Illustration
- One custom illustration, home screen hero zone (top ~40% of home screen)
- Transparent background SVG or PNG, designed to sit on #0D1117
- Composition: character sitting on globe, three currency pins (teal AU, gold JP, grey EC)
- Generated via GenAI image tool using the detailed brief in the design spec
- Placeholder SVG used during development, swapped for final asset before launch

---

## Google Sheet Structure

### Tab 1: Accounts

| Column | Type | Values / Notes |
|---|---|---|
| id | string | Unique stable ID e.g. `au-anz-01` |
| account_name | string | Display name e.g. "ANZ Savings" |
| bank | string | Institution name |
| country | enum | `AU` / `JP` / `EC` |
| currency | enum | `AUD` / `JPY` / `USD` |
| type | enum | `transaction` / `savings` / `term_deposit` / `super` / `other` |
| owner | enum | `rodrigo` / `nat` / `joint` |
| balance | number | Amount in native currency |
| interest_rate | number | % p.a. Null if not applicable |
| status | enum | `active` / `matured` / `pending_renewal` / `inactive` |
| maturity_date | date | ISO format. Null if not a term deposit |
| last_updated | date | ISO format. Manual entry on each update |
| notes | string | Free text. Optional |

### Tab 2: Goals

| Column | Type | Values / Notes |
|---|---|---|
| id | string | Unique stable ID e.g. `goal-rmit-s1` |
| goal_name | string | Display name e.g. "RMIT Tuition" |
| subtitle | string | e.g. "Semester 1" |
| target_amount_aud | number | AUD amount |
| due_date | date | ISO format |
| start_date | date | ISO format — used to calculate time elapsed |
| accent | enum | `teal` / `gold` — controls card colour |
| notes | string | Optional |

### Tab 3: FX Snapshots (passive, low effort)

Even though historical tracking is out of scope for v1 UI, this tab is worth populating from day one. 30 seconds per month. Enables trend features in v2 with zero retroactive effort.

| Column | Type | Notes |
|---|---|---|
| date | date | First of each month |
| JPY_AUD | number | Rate on that date |
| USD_AUD | number | Rate on that date |

### Tab 4: Settings

| Column | Type | Notes |
|---|---|---|
| base_currency | string | `AUD` — used as conversion target throughout |
| stale_threshold_days | number | Default 30 — days before stale flag triggers |
| low_balance_threshold_aud | number | Reserved for v2 dead money flag |

---

## Out of Scope — v1

- Transaction history or bank sync (no open banking)
- Budget tracking or spending categories
- Historical net worth trend chart (deferred to v2 — FX Snapshots tab seeds this)
- Push notifications or rate alerts
- Writing to Google Sheets from the frontend
- In-app goal creation form
- Super account detail (manual balance entry only, no fund API integration)
- Account type breakdown chart on home screen (below-fold section deferred)
- Currency exposure chart on home screen (below-fold section deferred)
- Service worker / offline mode
- Light mode
- Multi-user auth beyond the single shared password

---

## Further Notes

### Data update cadence
Balances updated fortnightly at minimum, monthly reliably. Both Rodrigo and Nat update the sheet. The app surfaces last_updated per account and a global freshness indicator. No forced update prompts — this is a visibility tool.

### Security posture
The Google Sheets API key will be visible in the client bundle. Mitigation: key scoped to Sheets API read-only, restricted to the specific spreadsheet ID in Google Cloud Console. The spreadsheet itself remains privately shared (not public). Acceptable risk for a personal household tool with no financial transaction capability.

### Illustration brief (for GenAI generation)
- Concept: round, friendly character (gold/yellow) sitting on a dark globe, legs dangling. Globe has three chunky oversized map pins: teal (#00C896) for Australia, gold (#F0C419) for Japan, grey (#484F58) for Ecuador. Character leans forward, curious, one arm pointing at the teal pin.
- Style: flat vector, rounded shapes, thick outlines, no gradients, no shadows. Up Bank illustration energy.
- Colours: strictly from app palette. Transparent background.
- Composition: character centre-right, globe centred, left third mostly empty for text overlay. Wide landscape canvas ~390x230px.
- Mood: friendly, slightly smug, cheerful. Globe feels like a toy, not a corporate asset.

### v2 Candidates (in priority order)
1. Historical net worth trend line (data already being seeded via FX Snapshots tab)
2. Account type breakdown and currency exposure charts (below-fold home screen sections)
3. In-app goal creation form with Sheets API write
4. Light mode toggle
5. Dead money flag with configurable threshold
6. Rate alert: notify when JPY or USD crosses a user-defined threshold
