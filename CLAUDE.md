# frogfishconsulting.com — notes for coding agents

Static Astro 5 site (Node 22). Pushing/merging to `main` auto-deploys to production on Vercel
(project `frogfish-website`, live at https://www.frogfishconsulting.com). Every branch/PR gets a preview deploy.

## Workflow
1. `git checkout main && git pull`, then create a branch (never commit straight to main).
2. `npm install`, `npm run dev` → http://localhost:4321 to preview.
3. Before pushing: `npm run build && npm run check:site` (must print "All local links and assets resolve.").
4. Open a PR, check the Vercel preview URL, then squash-merge. Production updates in ~1 min.

## Where things live
- `src/content-html/*.html` — page bodies. **This repo is the source of truth**; edit these files directly.
  - `app-home.html` = homepage, `app-ai-concierge.html` = /ai-concierge/, `app-ind-<vertical>.html` = /industries/<vertical>/
    (legal, lead-gen, real-estate, clinical-trials). `app` pages carry their own `<style>`/`<script>` inside the file.
  - `page-<wp id>.html` / `post-<wp id>.html` = pages ported from the old WordPress site.
- `src/data/site.json` — every route: path, kind, file, SEO title + meta description. New page = HTML file + entry here + line in `public/llms.txt`.
- `src/components/FFNav.astro` (desktop nav), `src/layouts/Base.astro` (head/SEO/JSON-LD, GTM, mobile menu, floating audit button), `FFFooter.astro`.
  Nav labels also appear inside some legacy `page-*.html` files — grep and change all of them together.
- `src/styles/light-theme.css` — site-wide light (paper/white) theme overrides, loaded last. Brand: ink text, red `#d62839`-ish accents; keep the light look.
- `public/` — images/assets, `robots.txt`, `llms.txt`, `js/site.js`. `vercel.json` — redirects for old WordPress URLs.

## Rules
- Don't change existing URLs, page titles or meta descriptions without a redirect/SEO reason (rankings carry over from WordPress).
- Keep GTM (`GTM-TCWTJR7M`), the Google tag and the thank-you conversion in `Base.astro` intact.
- Results/claims must be real FrogFish numbers; demo data stays labelled "Illustrative example".
- Check desktop (1440) and mobile (390) before merging.
