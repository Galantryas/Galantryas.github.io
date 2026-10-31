# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Galantryas's portfolio as a single, dependency-free static page at `D:/Project/Porto`, then publish it to a freshly created `Galantryas.github.io` repository.

**Architecture:** One `index.html` with static English markup for hero, about, experience and contact; the Work ledger is rendered from `data/projects.js` by `assets/lib.js` through `assets/app.js`. Bilingual via `data-i18n` attributes and two dictionaries. One stylesheet drives both light and dark canvases from custom properties. No build step, no runtime dependencies.

**Tech Stack:** HTML, CSS (custom properties, grid, container-free media queries), ES modules, Node 22 built-in test runner (`node --test`) for unit tests only.

**Spec:** `docs/design.md`

## Global Constraints

- Deploy target: repository `Galantryas.github.io`, branch `master`, Pages from root, legacy build. No GitHub Actions.
- No runtime dependencies. `package.json` exists only for `"type": "module"` and the test script.
- No webfonts, no analytics, no third-party scripts.
- Budget: HTML + CSS + JS under 60 KB uncompressed, excluding images.
- Light canvas tokens: `--paper #f4f1ea`, `--ink #191512`, `--rule #ddd6c9`, `--muted #6d655a`, `--accent #7a2e1e`.
- Dark canvas tokens: `--paper #15130f`, `--ink #ebe5d9`, `--rule #2e2a24`, `--muted #8a8175`, `--accent #d9905e`.
- Type: display serif stack `Georgia, 'Iowan Old Style', 'Source Serif 4', serif`; body `system-ui`; metadata `ui-monospace, 'SFMono-Regular', Consolas, monospace`.
- Spacing scale: 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96.
- Radii 0–2px. Hairline rules, no shadows.
- Motion 160–240 ms `ease-out`, all inside `prefers-reduced-motion: no-preference`.
- English default; Indonesian toggle in the rail. `<html lang>` must match.
- No emoji, no gradient text, no glassmorphism, no lorem ipsum, no placeholder marketing copy.
- No AI attribution in commits, README, or file headers. Commits authored as `Galantryas <galantryas.2014@gmail.com>`.
- Never publish the phone number. Contact is email, GitHub, LinkedIn only.
- Every screenshot gets real `alt` text and sits in an `aspect-ratio` box.

## Review Focus

Inputs and conditions the spec implies but no feature test naturally covers, most likely to bite first. Each gets its test in the owning task.

1. **Long Indonesian strings** (~10–30% longer than English) overflowing the 38%-wide rail or wrapping ledger rows into two lines. Owner: Task 4.
2. **JavaScript disabled or blocked** must still leave hero, about, experience and contact readable, with Work degrading to a labelled empty state rather than a blank gap. Owner: Task 1.
3. **Missing or renamed image file** must not collapse the layout or leave a broken-image icon. Owner: Task 4.
4. **Clipboard API unavailable** (non-HTTPS, older browser, permission denied) must fall back so the email is still copyable. Owner: Task 7.
5. **Dark canvas contrast on `--rule` and `--muted`** against `--paper` must stay at or above 4.5:1 for text and 3:1 for rules. Owner: Task 2.

---

### Task 1: Shell, tokens, and no-JS baseline

**Files:**
- Create: `package.json`, `.gitignore`, `index.html`, `assets/styles.css`
- Test: `tests/shell.test.js`

**Interfaces:**
- Consumes: nothing.
- Produces: `index.html` with landmarks `header.rail`, `main`, `section#work`, `section#about`, `section#experience`, `section#contact`; `<html lang="en">`; a skip link; `assets/styles.css` defining all Global Constraint tokens on `:root` and under `@media (prefers-color-scheme: dark)`.

- [ ] **Step 1: Write the failing test**

```js
// tests/shell.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../assets/styles.css', import.meta.url), 'utf8');

test('document declares English and a skip link', () => {
  assert.match(html, /<html[^>]+lang="en"/);
  assert.match(html, /href="#main"/);
});

test('every required landmark exists once', () => {
  for (const id of ['main', 'work', 'about', 'experience', 'contact']) {
    assert.equal(html.split(`id="${id}"`).length - 1, 1, id);
  }
});

test('work section has a non-JS empty state', () => {
  assert.match(html, /<noscript[\s\S]*work[\s\S]*<\/noscript>/i);
});

test('light tokens are declared', () => {
  for (const [name, value] of Object.entries({
    '--paper': '#f4f1ea', '--ink': '#191512', '--rule': '#ddd6c9',
    '--muted': '#6d655a', '--accent': '#7a2e1e',
  })) assert.match(css, new RegExp(`${name}:\\s*${value}`, 'i'));
});

test('dark tokens are declared under prefers-color-scheme', () => {
  const dark = css.slice(css.indexOf('prefers-color-scheme: dark'));
  for (const [name, value] of Object.entries({
    '--paper': '#15130f', '--ink': '#ebe5d9', '--rule': '#2e2a24',
    '--muted': '#8a8175', '--accent': '#d9905e',
  })) assert.match(dark, new RegExp(`${name}:\\s*${value}`, 'i'));
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/shell.test.js`
Expected: FAIL — `ENOENT` on `package.json` module type or missing `index.html`.

- [ ] **Step 3: Implement the shell**

`package.json`:

```json
{ "name": "porto", "private": true, "type": "module", "scripts": { "test": "node --test tests/" } }
```

`.gitignore`: `.superpowers/`, `node_modules/`, `.DS_Store`, `Thumbs.db`.

`index.html`: `<!doctype html>`, `<html lang="en">`, `<meta name="viewport" content="width=device-width, initial-scale=1">`, `<title>Galantryas Mukti Pratama — Full-stack PHP developer</title>`, skip link to `#main`, `<div class="shell">` containing `<header class="rail">` and `<main id="main">` with the five sections in order. Inside `#work`, a `<noscript>` paragraph stating that the project list requires JavaScript, wrapped in the same list styling as the ledger. Sections carry headings only for now; copy arrives in Task 3 and Task 7.

`assets/styles.css`: `:root` token block, `@media (prefers-color-scheme: dark)` override block, a minimal reset (`box-sizing: border-box`, zero margins), `body { background: var(--paper); color: var(--ink); font-family: system-ui, sans-serif; }`, and the display/serif and metadata/mono utility classes.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: 5 passing.

- [ ] **Step 5: Commit**

```bash
git add package.json .gitignore index.html assets/styles.css tests/shell.test.js
git commit -m "Add page shell, design tokens, and no-JS baseline"
```

---

### Task 2: Side rail layout and responsive collapse

**Files:**
- Modify: `assets/styles.css`
- Test: none (visual) — verified by the steps below.

**Interfaces:**
- Consumes: Task 1 landmarks and tokens.
- Produces: `.shell` grid with `grid-template-columns: 38% 1fr`; `.rail` sticky at `top: 0`, `height: 100vh`; under `@media (max-width: 899px)` the grid becomes one column and `.rail` becomes a static top bar.

- [ ] **Step 1: Implement the layout**

`.shell { display: grid; grid-template-columns: 38% 1fr; }`, `.rail { position: sticky; top: 0; height: 100vh; border-right: 1px solid var(--rule); display: flex; flex-direction: column; padding: 24px; }`, `main { padding: 96px 64px; max-width: 68ch; }`. Under `@media (max-width: 899px)`: `.shell { grid-template-columns: 1fr; }`, `.rail { position: static; height: auto; flex-direction: row; align-items: center; justify-content: space-between; border-right: 0; border-bottom: 1px solid var(--rule); }`, `main { padding: 48px 24px; }`.

- [ ] **Step 2: Verify no horizontal scroll at three widths**

Run: `python -m http.server 8000` in `D:/Project/Porto`, open `http://localhost:8000`.
Expected: at 320 px and 768 px the rail is a horizontal top bar and `document.documentElement.scrollWidth === clientWidth`; at 1440 px the rail is a full-height left column and the same equality holds.

- [ ] **Step 3: Verify dark-canvas contrast (Review Focus 5)**

Use browser devtools with `prefers-color-scheme: dark` emulated. Sample `--muted` on `--paper` and `--rule` on `--paper`.
Expected: ≥ 4.5:1 for muted text, ≥ 3:1 for the rule. If a value fails, darken `--paper` or lighten `--muted` in the dark block only, and record the new value in `docs/design.md`.

- [ ] **Step 4: Commit**

```bash
git add assets/styles.css docs/design.md
git commit -m "Add side-rail layout with mobile collapse"
```

---

### Task 3: Copy, dictionaries, and the i18n core

**Files:**
- Create: `data/i18n.js`, `assets/lib.js`
- Modify: `index.html`
- Test: `tests/i18n.test.js`

**Interfaces:**
- Consumes: Task 1 landmarks.
- Produces:
  - `data/i18n.js`: `export const dictionaries = { en: Record<string,string>, id: Record<string,string> }`.
  - `assets/lib.js`: `export function t(lang: string, key: string): string` returning `dictionaries[lang]?.[key] ?? dictionaries.en[key] ?? key`; `export function localize(value: {en: string, id: string}, lang: string): string` returning `value?.[lang] ?? value?.en ?? ''`.
- Later tasks call `t` and `localize` with exactly these signatures.

- [ ] **Step 1: Write the failing test**

```js
// tests/i18n.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dictionaries } from '../data/i18n.js';
import { t, localize } from '../assets/lib.js';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('every data-i18n key in the page exists in both dictionaries', () => {
  const keys = [...html.matchAll(/data-i18n="([^"]+)"/g)].map(m => m[1]);
  assert.ok(keys.length > 0);
  for (const key of keys) {
    assert.ok(dictionaries.en[key], `en missing ${key}`);
    assert.ok(dictionaries.id[key], `id missing ${key}`);
  }
});

test('no dictionary key is unused by the page', () => {
  const used = new Set([...html.matchAll(/data-i18n="([^"]+)"/g)].map(m => m[1]));
  for (const key of Object.keys(dictionaries.en)) {
    assert.ok(used.has(key), `unused key ${key}`);
  }
});

test('t falls back to English, then to the key itself', () => {
  assert.equal(t('id', 'nav.work'), dictionaries.id['nav.work']);
  assert.equal(t('fr', 'nav.work'), dictionaries.en['nav.work']);
  assert.equal(t('en', 'nope'), 'nope');
});

test('localize picks the language, then English, then empty', () => {
  assert.equal(localize({ en: 'A', id: 'B' }, 'id'), 'B');
  assert.equal(localize({ en: 'A' }, 'id'), 'A');
  assert.equal(localize(null, 'id'), '');
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/i18n.test.js`
Expected: FAIL — cannot resolve `../data/i18n.js`.

- [ ] **Step 3: Write the copy and the i18n core**

Add `data-i18n` attributes to `index.html` on: nav items (`nav.work`, `nav.about`, `nav.experience`, `nav.contact`), availability line (`hero.status`), the three-line hero statement (`hero.line1`, `hero.line2`, `hero.line3`), hero summary (`hero.summary`), section headings (`work.title`, `about.title`, `experience.title`, `contact.title`), about paragraphs (`about.p1`, `about.p2`), each timeline period and role line, contact labels, CV link (`contact.cv`), theme and language toggle labels (`ui.theme`, `ui.lang`).

Write English copy in the owner's voice, grounded in the résumé: six years of business systems — cooperatives, POS, HRIS, PPOB, regional data. No adjectives that could describe anyone ("passionate", "detail-oriented", "innovative"). Indonesian copy is written, not machine-translated; keep sentences shorter than the English ones where doing so preserves meaning.

`assets/lib.js` implements `t` and `localize` exactly as the Interfaces block specifies.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: all passing, including the earlier shell tests.

- [ ] **Step 5: Commit**

```bash
git add index.html data/i18n.js assets/lib.js tests/i18n.test.js
git commit -m "Add bilingual copy and translation core"
```

---

### Task 4: Work ledger from project data

**Files:**
- Create: `data/projects.js`
- Modify: `assets/lib.js`, `assets/app.js`, `assets/styles.css`, `index.html`
- Test: `tests/work.test.js`

**Interfaces:**
- Consumes: `t`, `localize` from Task 3.
- Produces:
  - `data/projects.js`: `export const projects: Project[]` where `Project = { id: string, title: {en,id}, year: number, stack: string[], role: {en,id}, summary: {en,id}, repo: string, demo: string|null, image: string }`.
  - `assets/lib.js`: `export function renderWorkRow(project: Project, lang: string): string` returning a `<li class="work-row">` containing a `<button class="work-toggle" aria-expanded="false">` with title, stack joined by ` · `, and year; `export function renderWorkDetail(project: Project, lang: string): string` returning the detail block with `<img loading="lazy" alt>` inside a `.work-figure` box, summary, role, and repo link (`rel="noopener"`).
  - `assets/app.js`: on `DOMContentLoaded`, render `projects` into `#work-list` (created if absent), wire each toggle to flip `aria-expanded` and `hidden` on its detail block.

- [ ] **Step 1: Write the failing test**

```js
// tests/work.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderWorkRow, renderWorkDetail } from '../assets/lib.js';

const project = {
  id: 'smarteco', title: { en: 'Smart Eco', id: 'Smart Eco' }, year: 2018,
  stack: ['Laravel', 'Blade', 'MySQL'], role: { en: 'Full-stack', id: 'Full-stack' },
  summary: { en: 'Regional data.', id: 'Data wilayah.' },
  repo: 'https://github.com/Galantryas/smarteco2', demo: null,
  image: 'assets/work/smarteco.webp',
};

test('row carries title, stack and year', () => {
  const row = renderWorkRow(project, 'en');
  assert.match(row, /Smart Eco/);
  assert.match(row, /Laravel · Blade · MySQL/);
  assert.match(row, /2018/);
  assert.match(row, /aria-expanded="false"/);
});

test('detail localises and carries alt text plus a safe link', () => {
  const detail = renderWorkDetail(project, 'id');
  assert.match(detail, /Data wilayah\./);
  assert.match(detail, /alt="[^"]*Smart Eco[^"]*"/);
  assert.match(detail, /rel="noopener"/);
  assert.match(detail, /loading="lazy"/);
});

test('missing image path degrades to a labelled placeholder (Review Focus 3)', () => {
  const detail = renderWorkDetail({ ...project, image: '' }, 'en');
  assert.doesNotMatch(detail, /<img/);
  assert.match(detail, /work-placeholder/);
});

test('long Indonesian strings do not break the markup (Review Focus 1)', () => {
  const long = { ...project, title: { en: 'Smart Eco', id: 'Sistem Informasi Lingkungan Hidup Wilayah Kabupaten' } };
  const row = renderWorkRow(long, 'id');
  assert.match(row, /Sistem Informasi Lingkungan Hidup Wilayah Kabupaten/);
  assert.equal((row.match(/<li/g) || []).length, 1);
});

test('html in copy is escaped', () => {
  const row = renderWorkRow({ ...project, title: { en: '<script>x</script>', id: '' } }, 'en');
  assert.doesNotMatch(row, /<script>/);
  assert.match(row, /&lt;script&gt;/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/work.test.js`
Expected: FAIL — `renderWorkRow is not a function`.

- [ ] **Step 3: Implement the ledger**

`data/projects.js` holds two entries: `smarteco` (Laravel, Blade, MySQL, 2018, full-stack, repo `https://github.com/Galantryas/smarteco2`, no demo, image `assets/work/smarteco.webp`) and `nusaenergi` (Vue 2, Vuetify, amCharts 4, Vuex, 2021, front-end, repo `https://github.com/Galantryas/NusaEnergi`, no demo, image `assets/work/nusaenergi.webp`). Summaries describe what the app does, not what was learned.

`renderWorkRow` and `renderWorkDetail` escape all interpolated strings through a single private `escapeHtml` helper. Rows are `display: grid` with `grid-template-columns: 1fr auto`; the title and stack `grid-column: 1`, the year `grid-column: 2`, so a long Indonesian title wraps under the stack rather than pushing the year off-row. `.work-figure` is `aspect-ratio: 16 / 10; overflow: hidden; border: 1px solid var(--rule)`.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: all passing.

- [ ] **Step 5: Verify in the browser with JavaScript off (Review Focus 2)**

Disable JS in devtools, reload `http://localhost:8000`.
Expected: hero, about, experience and contact are readable; `#work` shows the `<noscript>` message; nothing else collapses.

- [ ] **Step 6: Commit**

```bash
git add data/projects.js assets/lib.js assets/app.js assets/styles.css index.html tests/work.test.js
git commit -m "Render work ledger from project data"
```

---

### Task 5: Theme toggle

**Files:**
- Modify: `assets/lib.js`, `assets/app.js`, `assets/styles.css`, `index.html`
- Test: `tests/theme.test.js`

**Interfaces:**
- Consumes: Task 1 tokens.
- Produces: `export function resolveTheme(stored: string|null, systemPrefersDark: boolean): 'light'|'dark'` — explicit stored value wins, otherwise the system preference. `assets/app.js` writes the resolved value to `<html data-theme>`, persists explicit choices under `localStorage` key `porto.theme`, and exposes the toggle as `<button id="theme-toggle" aria-pressed>`.

- [ ] **Step 1: Write the failing test**

```js
// tests/theme.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveTheme } from '../assets/lib.js';

test('explicit choice beats the system preference', () => {
  assert.equal(resolveTheme('dark', false), 'dark');
  assert.equal(resolveTheme('light', true), 'light');
});
test('no choice follows the system preference', () => {
  assert.equal(resolveTheme(null, true), 'dark');
  assert.equal(resolveTheme(null, false), 'light');
});
test('garbage stored values fall back to the system preference', () => {
  assert.equal(resolveTheme('purple', true), 'dark');
  assert.equal(resolveTheme('', false), 'light');
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/theme.test.js`
Expected: FAIL — `resolveTheme is not a function`.

- [ ] **Step 3: Implement the toggle**

`styles.css` adds `[data-theme="dark"]` alongside the `prefers-color-scheme` block (same token values), so an explicit choice overrides the OS. The toggle button sits at the bottom of the rail above contact links, shows `Light`/`Dark` via `ui.theme`, and has a visible `:focus-visible` outline.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: all passing.

- [ ] **Step 5: Verify persistence**

Toggle to dark, reload.
Expected: still dark, `localStorage['porto.theme'] === 'dark'`, `<html data-theme="dark">`.

- [ ] **Step 6: Commit**

```bash
git add assets/lib.js assets/app.js assets/styles.css index.html tests/theme.test.js
git commit -m "Add persistent theme toggle"
```

---

### Task 6: Language toggle

**Files:**
- Modify: `assets/lib.js`, `assets/app.js`, `index.html`
- Test: `tests/lang.test.js`

**Interfaces:**
- Consumes: `t`, `localize`, and the dictionaries.
- Produces: `export function resolveLang(stored: string|null, navigatorLang: string): 'en'|'id'` — stored `en`/`id` wins, else `id` when `navigatorLang` starts with `id`, else `en`. `assets/app.js` applies a language by walking `[data-i18n]`, setting `textContent` from `t`, setting `document.documentElement.lang`, re-rendering `#work-list`, and persisting under `porto.lang`.

- [ ] **Step 1: Write the failing test**

```js
// tests/lang.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveLang } from '../assets/lib.js';

test('stored language wins', () => {
  assert.equal(resolveLang('id', 'en-US'), 'id');
  assert.equal(resolveLang('en', 'id-ID'), 'en');
});
test('browser language decides when nothing is stored', () => {
  assert.equal(resolveLang(null, 'id-ID'), 'id');
  assert.equal(resolveLang(null, 'en-GB'), 'en');
  assert.equal(resolveLang(null, 'fr-FR'), 'en');
});
test('unknown stored values are ignored', () => {
  assert.equal(resolveLang('de', 'id-ID'), 'id');
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/lang.test.js`
Expected: FAIL — `resolveLang is not a function`.

- [ ] **Step 3: Implement the toggle**

The language control in the rail renders `EN / ID` as two `button`s inside a `role="group"` with `aria-label` from `ui.lang`; the active one carries `aria-pressed="true"`.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: all passing.

- [ ] **Step 5: Verify the switch end to end**

Switch to ID, reload.
Expected: `<html lang="id">`, nav and headings in Indonesian, work rows re-rendered in Indonesian, choice persisted.

- [ ] **Step 6: Commit**

```bash
git add assets/lib.js assets/app.js index.html tests/lang.test.js
git commit -m "Add bilingual toggle with persistence"
```

---

### Task 7: Contact block, copy-to-clipboard, CV link

**Files:**
- Modify: `assets/lib.js`, `assets/app.js`, `index.html`, `assets/styles.css`
- Test: `tests/contact.test.js`

**Interfaces:**
- Consumes: `t`.
- Produces: `export function mailtoHref(email: string, subject: string): string` returning `mailto:` with the subject percent-encoded and `+` never emitted as a space. `export function canCopy(): boolean` returning `typeof navigator !== 'undefined' && !!navigator.clipboard?.writeText`.

- [ ] **Step 1: Write the failing test**

```js
// tests/contact.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mailtoHref } from '../assets/lib.js';

test('mailto encodes the subject', () => {
  const href = mailtoHref('galantryas.2014@gmail.com', 'Project enquiry');
  assert.match(href, /^mailto:galantryas\.2014@gmail\.com\?subject=/);
  assert.match(href, /Project%20enquiry/);
  assert.doesNotMatch(href, /\+/);
});
test('email is never HTML', () => {
  const href = mailtoHref('a"b@c.d', 'x');
  assert.doesNotMatch(href, /"/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/contact.test.js`
Expected: FAIL — `mailtoHref is not a function`.

- [ ] **Step 3: Implement the contact block**

Email link uses `mailtoHref`. A "copy" button calls `navigator.clipboard.writeText`, and when `canCopy()` is false it selects the email text in a readonly input instead, so the email is still copyable (Review Focus 4). Confirmation text swaps for 2 s, via `ui.copied`.

The CV link points at `assets/cv.pdf`, carrying `download` and the `contact.cv` label. Copy `D:\Lamaran\Resume 2023.pdf` to that path.

GitHub links to `https://github.com/Galantryas`, LinkedIn to the public profile URL. No phone number anywhere.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: all passing.

- [ ] **Step 5: Verify the fallback path**

In devtools, override `navigator.clipboard` to `undefined` before load.
Expected: clicking copy selects the email text instead of throwing; the console stays clean.

- [ ] **Step 6: Commit**

```bash
git add assets/lib.js assets/app.js assets/styles.css index.html assets/cv.pdf tests/contact.test.js
git commit -m "Add contact block with clipboard fallback and CV"
```

---

### Task 8: Stand-in artwork

**Files:**
- Create: `assets/work/smarteco.webp`, `assets/work/nusaenergi.webp`, `assets/og.png`
- Modify: `assets/styles.css`

**Interfaces:**
- Consumes: `.work-figure` from Task 4.
- Produces: two 1600×1000 images and one 1200×630 Open Graph image.

- [ ] **Step 1: Generate the images**

Use Python with Pillow (already available via `pip install pillow` if missing) to draw a flat panel in the light canvas colours: `#f4f1ea` background, `#ddd6c9` hairline border, the project name set in a serif face at ~64 px in `#191512`, and a monospace subtitle line in `#6d655a`. These are deliberate stand-ins, not fake UI screenshots — no browser chrome, no fake dashboards. Save the work images as WebP at quality 82, and compose `og.png` the same way at 1200×630 with the name and one-line role.

- [ ] **Step 2: Verify size and ratio**

Run: `python -c "from PIL import Image; im=Image.open('assets/work/smarteco.webp'); print(im.size, im.mode)"`
Expected: `(1600, 1000) RGB`. Repeat for the other two files.

- [ ] **Step 3: Verify the rendered page**

Reload with JS on.
Expected: both work details show an image inside a 16:10 box, no layout shift when scrolling, and `alt` text describing the project.

- [ ] **Step 4: Commit**

```bash
git add assets/work assets/og.png
git commit -m "Add stand-in project artwork and Open Graph image"
```

---

### Task 9: Metadata, structured data, and 404

**Files:**
- Create: `404.html`
- Modify: `index.html`
- Test: `tests/meta.test.js`

**Interfaces:**
- Consumes: Task 1 shell.
- Produces: `index.html` head carrying description, canonical `https://galantryas.github.io/`, Open Graph and Twitter tags pointing at `assets/og.png`, and a JSON-LD `Person` block with `name`, `jobTitle`, `url`, `sameAs`.

- [ ] **Step 1: Write the failing test**

```js
// tests/meta.test.js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('core meta present', () => {
  assert.match(html, /<meta name="description" content="[^"]{40,}"/);
  assert.match(html, /<link rel="canonical" href="https:\/\/galantryas\.github\.io\/"/);
  assert.match(html, /property="og:image"/);
  assert.match(html, /name="twitter:card"/);
});

test('json-ld parses and is a Person', () => {
  const raw = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1];
  const data = JSON.parse(raw);
  assert.equal(data['@type'], 'Person');
  assert.ok(Array.isArray(data.sameAs) && data.sameAs.length >= 2);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/meta.test.js`
Expected: FAIL — no description meta.

- [ ] **Step 3: Implement**

`404.html` reuses the same stylesheet and rail, with a single paragraph linking home. JSON-LD `sameAs` lists the GitHub profile and LinkedIn profile URLs.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm test`
Expected: all passing.

- [ ] **Step 5: Commit**

```bash
git add 404.html index.html tests/meta.test.js
git commit -m "Add metadata, structured data, and a 404 page"
```

---

### Task 10: Motion and final polish

**Files:**
- Modify: `assets/styles.css`, `assets/app.js`
- Test: none (visual) — verified by the steps below.

**Interfaces:**
- Consumes: Tasks 2–9.
- Produces: entry reveals for sections via `IntersectionObserver`, all inside `prefers-reduced-motion: no-preference`; `:focus-visible` outlines on every interactive element.

- [ ] **Step 1: Implement motion and focus states**

Sections start at `opacity: 0; translateY(12px)` and transition over 220 ms `ease-out` when `.is-visible` is added. Wrap the initial hidden state in `@media (prefers-reduced-motion: no-preference)` so reduced-motion users never see a fade. Add `:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }`.

- [ ] **Step 2: Verify reduced motion**

Emulate `prefers-reduced-motion: reduce`.
Expected: content is fully visible immediately, no transitions.

- [ ] **Step 3: Verify keyboard traversal**

Tab from the address bar.
Expected: skip link appears first, then rail nav, theme toggle, language buttons, work toggles, contact links and copy button, each with a visible ring.

- [ ] **Step 4: Verify the size budget**

Run: `Get-ChildItem index.html, 404.html -Recurse | Measure-Object Length -Sum` plus the same for `assets/*.css`, `assets/*.js`, `data/*.js`, `assets/lib.js`.
Expected: total under 60 KB.

- [ ] **Step 5: Lighthouse pass**

Run Lighthouse on `http://localhost:8000` in mobile mode.
Expected: ≥ 95 Performance, Accessibility, Best Practices, SEO.

- [ ] **Step 6: Commit**

```bash
git add assets/styles.css assets/app.js
git commit -m "Add reduced-motion-aware reveals and focus states"
```

---

### Task 11: Publish

**Files:**
- Create: `README.md`, `.gitattributes` (optional, `* text=auto`)
- Modify: nothing

**Interfaces:**
- Consumes: everything above.
- Produces: public repo `Galantryas/Galantryas.github.io`, Pages serving `https://galantryas.github.io/`.

- [ ] **Step 1: Write a short README**

Three sentences: what the site is, how to preview locally (`python -m http.server 8000`), how to add a project (edit `data/projects.js`, drop an image in `assets/work/`). No badges, no emoji, no feature list.

- [ ] **Step 2: Initialise the repository and commit**

```bash
git init -b master
git add -A
git commit -m "Portfolio site"
```

- [ ] **Step 3: Create the repo and push**

```bash
gh repo create Galantryas.github.io --public --source . --remote origin --push
```

- [ ] **Step 4: Enable Pages from `master` root**

```bash
gh api -X POST repos/Galantryas/Galantryas.github.io/pages -f "source[branch]=master" -f "source[path]=/"
```

- [ ] **Step 5: Re-publish the two placeholder projects**

```bash
gh repo edit Galantryas/smarteco2 --visibility public --accept-visibility-change-consequences
gh repo edit Galantryas/NusaEnergi --visibility public --accept-visibility-change-consequences
```

- [ ] **Step 6: Verify the live site**

Run: `curl -I https://galantryas.github.io/` and fetch the body.
Expected: `HTTP/2 200`, and the body contains the hero statement and both project titles. If Pages reports `build` in progress, wait and retry.

- [ ] **Step 7: Verify the repo links resolve without auth**

Run: `curl -o /dev/null -w "%{http_code}" https://github.com/Galantryas/smarteco2`
Expected: `200`.

- [ ] **Step 8: Commit any final fix and push**

```bash
git add -A
git commit -m "Fix issues found after first deploy"
git push
```

---

## Self-review notes

- Spec coverage: intent/audiences (Tasks 1, 3), stack (all), style system (Tasks 1–2), layout (Task 2), structure (Tasks 1, 3, 7), content model (Task 4), timeline (Task 3), localisation (Tasks 3, 6), accessibility (Tasks 2, 7, 10), files (all), performance/SEO (Tasks 8–10), deployment (Task 11), verification list (Tasks 2, 4, 7, 10, 11). No gaps.
- Deliberately absent: a `data/experience.js` file. The timeline is static markup, so it stays in `index.html`; adding a job is an HTML edit, which matches how rarely that happens.
- Deliberately absent: automated tests for CSS-only work (Tasks 2, 8, 10). Those deliverables are visual, and the plan pins the exact expected observation instead of asserting on stylesheet text, which would test implementation rather than behaviour.
