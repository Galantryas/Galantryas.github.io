# Portfolio site — design

Date: 2026-10-31
Owner: Galantryas Mukti Pratama
Location: `D:/Project/Porto`
Deploy target: `Galantryas.github.io` (GitHub Pages, branch `master`, root, legacy build)

## Intent

One page that does three jobs at once: convince a recruiter to interview, convince a
client to make contact, and serve as the permanent home for everything I build.
Today it is a placeholder — `galantryas.github.io` still serves a 2019 IndexedDB
class assignment ("Belajar IDB").

The identity it sells: **full-stack PHP developer — Laravel on the back, Vue on the
front — six years of business systems** (cooperatives, POS, HRIS, PPOB, regional
data). Mobile (Flutter/Java) is range, not the pitch.

## Audiences

| Audience | Time they give it | What they need | What success looks like |
|---|---|---|---|
| Recruiter | ~20 s | role, stack, years, availability, CV, contact | knows within 20 s whether to keep reading |
| Client | ~2 min | proof of shipping, domain familiarity, low-friction contact | one click to start a conversation |
| Future me | — | a place to file every project | adding a project is a 5-line edit |

All three are served by the same page, layered by scroll depth.

## Goals

- Recruiter understands the role and stack above the fold.
- Email reachable in one click from anywhere on the page.
- Adding a project requires editing one object in `data/projects.js` and dropping one image.
- Site loads with no webfont request, no framework, no build step, no third-party script.
- Content in English by default, Indonesian on toggle.
- Light and dark canvases from one stylesheet.

## Non-goals

- No backend, no contact form, no CMS, no analytics in v1.
- No live demos for the two placeholder projects (their APIs are gone).
- No blog.
- No client or employer project names until those projects are cleared for publication.

## Anti-goals

These would make the site a failure even if it ships:

- Looking like a generated template: gradient hero, glassmorphism cards, emoji section
  icons, "passionate about building things" copy, bento grid, three pill CTAs.
- Any AI attribution: no `Co-authored-by: Copilot`, no "Generated with …" trailers, no
  AI-tool badges in README.
- Publishing a phone number.
- A Work section padded with projects that don't exist.

## Constraints

- GitHub Pages, free plan: static files only. Private repos cannot be published.
- All 44 repos are currently private except `Galantryas.github.io`.
- The two placeholder projects (`smarteco2`, `NusaEnergi`) must be made public again for
  their repo links to work.
- No build step: files are served exactly as committed.
- Owner's actual stack is PHP/Vue; the portfolio itself will not be a Vue app.

## Approaches considered

### Stack

| Option | Trade-off | Verdict |
|---|---|---|
| **A. Plain HTML + CSS + vanilla JS** | no components; nothing to rot; no framework fingerprint | **chosen** |
| B. Vite + Vue 3 | matches owner's stack; build step, Actions, client-rendered HTML | rejected — pipeline for one page |
| C. Astro | best authoring for a growing archive; new tool, build step | rejected for v1; the natural upgrade path |

### Visual direction

- A (editorial paper) and B (terminal mono) both appealed; C (Swiss/brutalist) rejected.
- **Chosen: A×B hybrid.** Paper canvas and serif display from A, monospace metadata and
  ledger-style project rows from B. Warm light default, warm charcoal dark alternate,
  accent hue shifts per canvas so contrast holds.

### Layout

- L1 (centred single column) vs **L2 (fixed side rail)**.
- **Chosen: L2.** Name, role, availability, nav pinned left; content scrolls right.
  Collapses to a top bar under 900px. Extends to a `/work` page later without redesign.

## Structure

Single page, five anchored sections:

1. **Hero** — availability line, three-line serif statement, one-sentence mono summary.
2. **Work** — ledger rows, not cards. Each row: title, stack, year. Expands to a detail
   block (screenshot, three-line description, role, repo link).
3. **About** — two short paragraphs: what I build and for whom; the systems list.
4. **Experience** — timeline: role, company, period, one line each. Ends with education.
5. **Contact** — email with click-to-copy, GitHub, LinkedIn, CV download.

## Design system

Tokens as CSS custom properties on `:root`, overridden under
`@media (prefers-color-scheme: dark)` and `[data-theme="dark"]`.

| Token | Light | Dark |
|---|---|---|
| `--paper` | `#f4f1ea` | `#15130f` |
| `--ink` | `#191512` | `#ebe5d9` |
| `--rule` | `#ddd6c9` | `#2e2a24` |
| `--muted` | `#6d655a` | `#8a8175` |
| `--accent` | `#7a2e1e` | `#d9905e` |

- Display: serif stack (`Georgia, 'Iowan Old Style', 'Source Serif 4', serif`), tight
  tracking, 1.05 line-height.
- Body: `system-ui` at 17px/1.6.
- Metadata: `ui-monospace, 'SFMono-Regular', Consolas, monospace`, 11–12px, uppercase,
  `letter-spacing: .16em`.
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96.
- Radii: 0–2px. Hairline rules do the work that shadows would.
- Motion: 160–240 ms `ease-out`; entry reveals via `IntersectionObserver`; all motion
  wrapped in `prefers-reduced-motion` guards. No parallax, no cursor followers.

## Content model

`data/projects.js` exports an array; the page renders from it.

```js
{
  id: "smarteco",
  title: { en: "Smart Eco", id: "Smart Eco" },
  year: 2018,
  stack: ["Laravel", "Blade", "MySQL"],
  role: { en: "Full-stack developer", id: "Full-stack developer" },
  summary: { en: "...", id: "..." },
  repo: "https://github.com/Galantryas/smarteco2",
  demo: null,
  image: "assets/work/smarteco.webp"
}
```

Launch content — two placeholder entries, to be replaced:

1. **Smart Eco** (`smarteco2`) — Laravel 5, Blade, MySQL. Environmental and regional
   data management: region profiles, greenness data, regional regulations, profession
   census, photo evidence, comparisons. Full-stack, 2018.
2. **NusaEnergi** — Vue 2, Vuetify, amCharts 4, Vuex. Energy-monitoring dashboard with
   consumption charts and tabular data. Front-end, 2021.

Copy for both must be written by the owner or verified against the code before publishing.

Screenshots for both are **stand-ins** until real captures exist: neutral, non-mimicking
frames (a tinted panel with the project name set in mono), not fake UI. They are
replaced when the projects themselves are replaced.

## Experience timeline

1. Firstasia Consultants — Software Engineer — Feb 2024 – present
2. CV Cipta Solutindo Tech — Full Stack Web & Mobile Developer — Mar 2021 – Jan 2024
3. Revolto — Frontend Web Developer — 2020
4. Nusantera — Full Stack Web Developer (internship) — Jun–Aug 2019
5. Vocational School UGM × PT Bank Central Asia — Junior Programmer — 2018
6. Education: D3 Computer and Information Systems, UGM Vocational School, 2020, GPA 3.74

## Localisation

- `data/i18n.js` holds two dictionaries keyed by `data-i18n` attribute.
- `<html lang>` updated on switch; choice persisted in `localStorage`.
- Project fields carry `{ en, id }` pairs.
- Default `en`; toggle lives in the side rail (`EN / ID`).
- Indonesian copy is written, not machine-translated per release.

## Accessibility

WCAG AA contrast in both canvases, `:focus-visible` outlines, skip link, semantic
landmarks, real heading order, `alt` text on every screenshot, no motion without
`prefers-reduced-motion`, toggle exposed as a `button` with `aria-pressed`.

## Files

```
D:/Project/Porto/
├── index.html
├── 404.html
├── assets/
│   ├── styles.css
│   ├── app.js
│   ├── og.png
│   └── work/*.webp
├── data/
│   ├── projects.js
│   └── i18n.js
├── docs/design.md
├── README.md
└── .gitignore   (.superpowers/)
```

ES modules are used, so local preview needs a server: `python -m http.server 8000`.

## Performance and SEO

- No webfonts, no libraries, budget under 60 KB HTML+CSS+JS.
- Screenshots lazy-loaded inside `aspect-ratio` boxes to prevent layout shift.
- `title`, `meta description`, canonical, Open Graph and Twitter tags, `og.png` at 1200×630.
- JSON-LD `Person` with `sameAs` for GitHub and LinkedIn.
- `404.html` reusing the same shell.

## Deployment

- Repository `Galantryas.github.io`, branch `master`, Pages legacy build from root.
- The existing repository is **deleted and recreated** so the 2019 IndexedDB history does
  not follow the new site. The live URL is down between delete and recreate; total
  downtime should be minutes.
- Deletion needs the `delete_repo` scope, which the current token does not have.
- Push to `master` publishes. No Actions, no build.
- Custom domain deferred; add `CNAME` if one is bought later.

## Verification

- Lighthouse ≥ 95 on all four categories, mobile.
- Both canvases checked for contrast at AA.
- Toggle persists across reloads; `<html lang>` changes.
- Keyboard-only pass from skip link to contact.
- 320 px, 768 px, 1440 px without horizontal scroll.
- `view-source` shows real content, not an empty root div.

## Left to the builder

Token values may be tuned for contrast; the reveal animation specifics; the exact
hover treatment of ledger rows; `404.html` copy; the `og.png` composition.

## Resolved decisions

From the builder check, settled here rather than left to guess:

1. **Both languages ship at launch.** Indonesian drafted by the builder, corrected by the
   owner. The toggle is not a stub.
2. **Copy is drafted from repo code and the CV**, then corrected by the owner. No blank-page
   handoff.
3. **Manual theme toggle** in the rail. Initial state follows `prefers-color-scheme`,
   explicit choice persists in `localStorage`, `data-theme` set on `<html>`.
4. **Unconfirmed periods do not block launch** — timeline periods are nullable strings.
   All current periods are now confirmed anyway.
5. **Work screenshots are stand-ins** until real captures exist.
6. **Fresh repository** — the old `Galantryas.github.io` is deleted and recreated. Old
   history is deliberately discarded.

## Open items — owner must answer

1. Currently none. `delete_repo` scope must be granted before the repository can be deleted.
