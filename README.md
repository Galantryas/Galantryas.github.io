# galantryas.github.io

Source for [galantryas.github.io](https://galantryas.github.io/), the personal portfolio of Galantryas Mukti Pratama — a full-stack developer working in Laravel and Vue.

The site is a single page with a fixed side rail, a work ledger, an experience timeline, and a contact block. It is written as plain HTML, CSS, and ES modules: no framework, no build step, no runtime dependencies, and no third-party requests.

## Stack

| Layer | Choice |
| --- | --- |
| Markup | Hand-written HTML with semantic landmarks |
| Styles | One stylesheet, CSS custom properties, no preprocessor |
| Behaviour | ES modules, no bundler |
| Tests | Node's built-in test runner (`node --test`) |
| Hosting | GitHub Pages, `master` branch, served from the repository root |

## Project layout

```
.
├── index.html              Page markup and English copy
├── 404.html                Not-found page, served for any missing path
├── assets/
│   ├── styles.css          Design tokens, layout, and components
│   ├── app.js              Renders work rows, handles theme, language, contact
│   ├── lib.js              Pure helpers (rendering, pagination, storage, i18n)
│   ├── cv.pdf              Downloadable curriculum vitae
│   ├── favicon.svg         Scalable tab icon
│   ├── favicon-32.png      Raster fallback icon
│   ├── apple-touch-icon.png
│   └── work/               Project screenshots
├── data/
│   ├── projects.js         Work section content
│   └── i18n.js             English and Indonesian dictionaries
├── tests/                  Unit tests for the pure helpers
└── docs/                   Design notes and the implementation plan
```

## Local development

No install step is required for the site itself. ES modules must be served over HTTP, so opening `index.html` directly from disk will not work.

```bash
python -m http.server 8000
```

Then open <http://localhost:8000>.

To run the tests, Node 22 or later is required:

```bash
node --test "tests/**/*.test.js"
```

## Adding a project

Work entries are data, not markup. Append an object to the exported array in `data/projects.js`:

```js
{
  id: 'kasir-umum',                       // unique, used for DOM ids
  title: { en: 'Kasir Umum', id: 'Kasir Umum' },
  year: 2026,
  stack: ['Laravel', 'Vue', 'MySQL'],
  role: { en: 'Full-stack developer', id: 'Pengembang full-stack' },
  summary: { en: '…', id: '…' },
  repo: 'https://github.com/Galantryas/kasir-umum',
  demo: null,                             // a URL renders a "Live" link
  images: ['assets/work/kasir-umum.webp'] // one or more; the first is the cover
}
```

Place the screenshots in `assets/work/` at 1600×1000 (16:10). A single image renders without a thumbnail strip; two or more add a selectable gallery. A missing or renamed file falls back to a labelled placeholder rather than a broken image.

The list is paginated five entries per page once there are more than five; no other change is needed.

## Localisation

Every visible string is keyed. English copy lives in `index.html` as the no-JavaScript baseline, and both languages live in `data/i18n.js`; project content carries its own `{ en, id }` pairs. Adding a key means adding it to both dictionaries — a test enforces that the two sets match.

## Deployment

The site is published from `master` by GitHub Pages. Pushing to `master` is the deployment:

```bash
git add .
git commit -m "…"
git push
```

Pages rebuilds within a minute or so. Assets are cached for ten minutes, so a change may need a hard refresh before it appears.

## Conventions

- No analytics, no external fonts, no trackers.
- Contrast, focus states, and reduced-motion preferences are treated as requirements, not polish.
- Commits are authored by the site owner; no bot or tool attribution is included.

## Contact

Email: <galantryas.2014@gmail.com> · [GitHub](https://github.com/Galantryas) · [LinkedIn](https://www.linkedin.com/in/galantryas-mukti-pratama)

---

© Galantryas Mukti Pratama. Copy, screenshots, and the CV may not be reused without permission.
