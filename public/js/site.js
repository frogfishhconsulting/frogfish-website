/* FrogFish site scripts: mobile menu + first-touch attribution cookie (ported from WordPress). */
(function() {
  function init() {
    var btn = document.getElementById('ffMobileBtn');
    var overlay = document.getElementById('ffMobileOverlay');
    if (!btn || !overlay) return;

    btn.addEventListener('click', function() {
      var isOpen = btn.classList.toggle('is-open');
      overlay.classList.toggle('is-open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    overlay.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        btn.classList.remove('is-open');
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
        btn.classList.remove('is-open');
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
(function() {
  var TRACKED_PARAMS = ['utm_source','utm_medium','utm_campaign','utm_term','utm_content','gclid','fbclid','li_fat_id','msclkid'];
  var COOKIE_NAME = 'ff_attribution';
  var COOKIE_DAYS = 30;
  
  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
  }
  
  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }
  
  function getQueryParams() {
    var params = {};
    var query = window.location.search.substring(1);
    if (!query) return params;
    query.split('&').forEach(function(pair) {
      var parts = pair.split('=');
      if (parts[0]) params[parts[0]] = decodeURIComponent(parts[1] || '');
    });
    return params;
  }
  
  var existing = getCookie(COOKIE_NAME);
  var existingData = existing ? JSON.parse(existing) : null;
  var current = getQueryParams();
  var hasNewUTM = current.utm_source || current.utm_medium || current.utm_campaign || current.gclid || current.fbclid;
  
  if (hasNewUTM || !existingData) {
    var attribution = existingData || {};
    TRACKED_PARAMS.forEach(function(key) {
      if (current[key]) attribution[key] = current[key];
    });
    if (!attribution.first_referrer) attribution.first_referrer = document.referrer || '(direct)';
    if (!attribution.first_landing) attribution.first_landing = window.location.pathname;
    if (!attribution.first_seen) attribution.first_seen = new Date().toISOString();
    attribution.last_seen = new Date().toISOString();
    
    setCookie(COOKIE_NAME, JSON.stringify(attribution), COOKIE_DAYS);
    existingData = attribution;
  }
  
  function decorateCalendlyLinks() {
    if (!existingData) return;
    var links = document.querySelectorAll('a[href*="calendly.com"]');
    links.forEach(function(link) {
      try {
        var url = new URL(link.href);
        ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(function(p) {
          if (existingData[p] && !url.searchParams.has(p)) {
            url.searchParams.set(p, existingData[p]);
          }
        });
        if (existingData.gclid && !url.searchParams.has('a1')) url.searchParams.set('a1', 'gclid:' + existingData.gclid);
        if (existingData.first_referrer && !url.searchParams.has('a2')) url.searchParams.set('a2', 'ref:' + existingData.first_referrer);
        link.href = url.toString();
      } catch(e) {}
    });
    
    var iframes = document.querySelectorAll('iframe[src*="calendly.com"]');
    iframes.forEach(function(iframe) {
      try {
        var url = new URL(iframe.src);
        ['utm_source','utm_medium','utm_campaign','utm_term','utm_content'].forEach(function(p) {
          if (existingData[p] && !url.searchParams.has(p)) {
            url.searchParams.set(p, existingData[p]);
          }
        });
        if (iframe.src !== url.toString()) iframe.src = url.toString();
      } catch(e) {}
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', decorateCalendlyLinks);
  } else {
    decorateCalendlyLinks();
  }
  
  window.dataLayer = window.dataLayer || [];
  if (existingData) {
    window.dataLayer.push({
      event: 'attribution_loaded',
      ff_utm_source: existingData.utm_source || '(direct)',
      ff_utm_medium: existingData.utm_medium || '(none)',
      ff_utm_campaign: existingData.utm_campaign || '(none)',
      ff_first_referrer: existingData.first_referrer || '(direct)'
    });
  }
})();
