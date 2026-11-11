import site from '../data/site.json';
const SITE = 'https://www.frogfishconsulting.com';
const esc = (s = '') => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export function GET() {
  const items = site.filter((e) => e.kind === 'post').map((e) => `  <item><title>${esc(e.h1)}</title><link>${SITE}${e.path}</link><guid>${SITE}${e.path}</guid><pubDate>${new Date(e.date + 'T17:00:00Z').toUTCString()}</pubDate><description>${esc(e.description)}</description><author>alex@frogfishconsulting.com (Alex Fleshner)</author></item>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>FrogFish Consulting Insights</title><link>${SITE}/blog/</link><description>AEO, AI search, paid media and revenue-led growth.</description>\n${items}\n</channel></rss>\n`,
    { headers: { 'Content-Type': 'application/rss+xml' } });
}
