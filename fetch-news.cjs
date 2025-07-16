const Parser  = require('rss-parser');
const fs      = require('fs');
const path    = require('path');
const cheerio = require('cheerio');
const translate = require('google-translate-api-x');
const { feeds } = require('./feeds.cjs');

const parser = new Parser({ timeout: 10000 });

const KEYWORDS = [
  'pasaporte digital','passport digital','digital product passport',
  'digital passport','dpp','espr','ecodiseño','traceability'
];

// ── helpers ───────────────────────────────────────────
function stripHtml(html='') { return cheerio.load(html).text(); }
function norm(str='')      { return str.toLowerCase().replace(/[^\w]/g,''); }

function makeSummary(item, title='') {
  const raw = stripHtml(
    item.description     ||
    item.contentSnippet  ||
    item.content         ||
    ''
  ).trim();

  if (!raw || norm(raw).startsWith(norm(title).slice(0,60)))
    return '';                           // ← sin resumen

  const words = raw.split(/\s+/).slice(0, 30);
  return words.join(' ') + (words.length >= 30 ? '…' : '');
}

function tag(t='') {
  const s = t.toLowerCase();
  if (/regulation|directive|commission|espr/.test(s)) return 'Regulación';
  if (/platform|blockchain|api|trace/.test(s))        return 'Tecnología';
  if (/pilot|prototype|trial/.test(s))                return 'Proyectos piloto';
  return 'Industria';
}

function originalLink(gUrl) {
  try {
    const u = new URL(gUrl);
    if (!u.hostname.includes('news.google.com')) return gUrl;
    return u.searchParams.get('url') ||
           decodeURIComponent(u.searchParams.get('q') || '') ||
           gUrl;
  } catch { return gUrl; }
}

// ── main ─────────────────────────────────────────────
(async () => {
  const news = [];

  for (const f of feeds) {
    try {
      // ---------- RSS ----------
      if (f.type === 'rss') {
        const feed = await parser.parseURL(f.url);
        console.log('✅ RSS', f.title);

        for (const item of feed.items.slice(0, 30)) {
          const blob = (
            item.title + ' ' +
            (item.description || '') + ' ' +
            (item.contentSnippet || '')
          ).toLowerCase();
          if (!KEYWORDS.some(k => blob.includes(k))) continue;

          const titleES = (await translate(item.title,{to:'es'}).catch(()=>({text:item.title}))).text;

          const link   = (f.title==='Google News DPP') ? originalLink(item.link) : item.link;
          const source = (f.title==='Google News DPP')
            ? new URL(link).hostname.replace(/^www\./,'')
            : (feed.title || f.title);

          news.push({
            title   : item.title,
            titleES ,
            link,
            pubDate : item.pubDate,
            source  : source,
            summary : makeSummary(item, item.title),
            tag     : tag(item.title)
          });
        }
      }

      // ---------- HTML ----------
      if (f.type === 'html') {
        const html = await fetch(f.url).then(r=>r.text());
        const $    = cheerio.load(html);
        console.log('✅ HTML', f.title);

        $(f.selector).slice(0, 30).each((_, el) => {
          const title = $(el).text().trim();
          if (!KEYWORDS.some(k => title.toLowerCase().includes(k))) return;

          const href = $(el).attr('href') || '#';
          const link = href.startsWith('http') ? href : f.urlBase + href;

          news.push({
            title,
            titleES : title,
            link,
            pubDate : new Date().toISOString(),
            source  : f.title,
            summary : '',                    // sin resumen
            tag     : tag(title)
          });
        });
      }
    } catch(e){ console.error(`❌ ${f.title} →`, e.message); }
  }

  news.sort((a,b)=>new Date(b.pubDate)-new Date(a.pubDate));
  fs.writeFileSync(path.resolve('./news.json'), JSON.stringify({ news }, null, 2));
  console.log('✅ news.json generado con', news.length, 'noticias');
})();
