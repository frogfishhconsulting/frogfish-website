import site from '../data/site.json';
const SITE = 'https://www.frogfishconsulting.com';
export function GET() {
  const urls = site.filter((e) => !e.noindex).map((e) =>
    `  <url><loc>${SITE}${e.path}</loc><lastmod>${e.modified}</lastmod></url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml' } });
}
