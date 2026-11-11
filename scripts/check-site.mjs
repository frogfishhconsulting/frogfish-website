// Post-build check: every local href/src/srcset in dist resolves to a file or a built route.
import fs from 'node:fs'; import path from 'node:path';
const dist = 'dist'; const missing = new Set();
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const redirects = JSON.parse(fs.readFileSync('vercel.json', 'utf8')).redirects.map((r) => r.source);
for (const f of walk(dist).filter((f) => f.endsWith('.html'))) {
  const h = fs.readFileSync(f, 'utf8');
  const refs = [...h.matchAll(/(?:href|src)="(\/[^"#?]*)/g)].map((m) => m[1])
    .concat([...h.matchAll(/srcset="([^"]+)"/g)].flatMap((m) => m[1].split(',').map((s) => s.trim().split(' ')[0]).filter((s) => s.startsWith('/'))))
    .concat([...h.matchAll(/url\('(\/[^']+)'\)/g)].map((m) => m[1]));
  for (const r of refs) {
    if (r.startsWith('//')) continue;
    const p = decodeURI(r); const fp = path.join(dist, p);
    const ok = fs.existsSync(fp) && (fs.statSync(fp).isFile() || fs.existsSync(path.join(fp, 'index.html')));
    if (!ok && !redirects.includes(p)) missing.add(`${p}  (in ${f})`);
  }
}
if (missing.size) { console.log('MISSING:\n' + [...missing].join('\n')); process.exit(1); } else console.log('All local links and assets resolve.');
