export const SITE = 'https://www.frogfishconsulting.com';
export const ORG_ID = SITE + '/#org';
export const ALEX_ID = SITE + '/#alex';

// Site-wide entity graph. Keep facts in sync with llms.txt and the About page.
export function orgGraph() {
  return [
    {
      '@type': ['Organization', 'ProfessionalService'],
      '@id': ORG_ID,
      name: 'FrogFish Consulting',
      url: SITE + '/',
      logo: SITE + '/wp-content/uploads/2026/05/FrogFish-Logo-Transparent.png',
      image: SITE + '/wp-content/uploads/2026/05/frogfish-hero-square-1080.png',
      description:
        "Growth consultancy specializing in answer engine optimization (AEO/GEO), SEO, paid media, lead scoring and analytics, measured on revenue in the client's CRM.",
      founder: { '@id': ALEX_ID },
      foundingDate: '2026',
      address: { '@type': 'PostalAddress', addressLocality: 'Los Angeles', addressRegion: 'CA', addressCountry: 'US' },
      areaServed: 'US',
      email: 'alex@frogfishconsulting.com',
      knowsAbout: [
        'Answer engine optimization', 'Generative engine optimization', 'AI search optimization', 'SEO',
        'Paid media', 'Google Ads', 'Microsoft Advertising', 'Meta Ads', 'Lead scoring', 'Marketing attribution',
        'Clinical trial recruitment', 'Legal marketing', 'Solar marketing',
      ],
      sameAs: ['https://www.linkedin.com/company/frogfishconsulting'],
    },
    {
      '@type': 'Person',
      '@id': ALEX_ID,
      name: 'Alex Fleshner',
      jobTitle: 'Founder & CEO',
      worksFor: { '@id': ORG_ID },
      description:
        '13 years at Google across Ads and AI: AI Transformation Lead at Google Cloud AI, Head of Media Strategy at Verily, and lead of the Google Ads lead-gen vertical.',
      alumniOf: [{ '@type': 'Organization', name: 'Google' }, { '@type': 'Organization', name: 'Verily' }],
      url: SITE + '/about-us/',
      sameAs: ['https://www.linkedin.com/in/alexfleshner'],
    },
    { '@type': 'WebSite', '@id': SITE + '/#website', url: SITE + '/', name: 'FrogFish Consulting', publisher: { '@id': ORG_ID } },
  ];
}

export function pageGraph(e) {
  const url = SITE + e.path;
  const crumbs = [{ name: 'Home', path: '/' }];
  const segs = e.path.split('/').filter(Boolean);
  let acc = '/';
  for (const s of segs) { acc += s + '/'; crumbs.push({ name: s === segs[segs.length - 1] ? e.h1 : s.replace(/-/g, ' '), path: acc }); }
  const out = [{
    '@type': e.kind === 'blog' ? 'CollectionPage' : 'WebPage', '@id': url + '#webpage', url, name: e.title,
    description: e.description, isPartOf: { '@id': SITE + '/#website' }, about: { '@id': ORG_ID }, dateModified: e.modified,
  }];
  if (segs.length) out.push({
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: SITE + c.path })),
  });
  if (e.kind === 'post') out.push({
    '@type': 'BlogPosting', '@id': url + '#article', headline: e.h1, description: e.description, image: e.image ? SITE + e.image : undefined,
    datePublished: e.date, dateModified: e.modified, author: { '@id': ALEX_ID }, publisher: { '@id': ORG_ID }, mainEntityOfPage: url,
  });
  if (e.path === '/aeo/' || e.kind === 'landing') out.push({
    '@type': 'Service', '@id': url + '#service', name: e.h1, serviceType: 'Answer engine optimization (AEO)', provider: { '@id': ORG_ID }, areaServed: 'US', url,
  });
  return out;
}
