# frogfishconsulting.com

Static Astro site deployed on Vercel. Replaces the WordPress (Kadence) site at the exact same URLs.

- `src/content-html/` – page bodies ported verbatim from WordPress (`page-<wp id>.html`, `post-<wp id>.html`) plus new pages (`new-<slug>.html`).
- `src/data/site.json` – every route: path, kind (`raw` = hand-built page block, `post`, `legal`, `landing`, `blog`), SEO title, description, dates.
- `src/layouts/Base.astro` – head/SEO, JSON-LD (`src/lib/schema.js`), GTM `GTM-TCWTJR7M`, Google tag `GT-WFFZFGQR`, thank-you conversion, mobile menu, floating audit button.
- `src/styles/` – WordPress global CSS, Kadence content rules (kept so ported blocks render identically), article shell.
- `public/` – `/wp-content/uploads/...` assets at their original paths, `llms.txt`, `robots.txt`, `js/site.js` (menu + UTM attribution cookie).
- `vercel.json` – redirects for old WordPress URLs (`/home-2/`, `/wp-sitemap.xml`, `/feed/`, `/author/*`, `/category/*`).

Forms: the assessment posts to the existing Google Apps Script endpoint; booking uses Calendly (redirects to `/thank-you/`).

```
npm install
npm run build && npm run check:site   # verifies every local link/asset resolves
```

Adding a page: drop the HTML body in `src/content-html/`, add an entry to `src/data/site.json`, and it is in the sitemap automatically. Update `public/llms.txt` too.
