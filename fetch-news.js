const Parser = require('rss-parser');
const fs = require('fs');
const path = require('path');
const translate = require('@vitalets/google-translate-api');
const feeds = require('./feeds.js'); // Ajusta ruta si está en otra carpeta

const parser = new Parser({ timeout: 10000 });
const out = [];

const KEYWORDS = [
  'pasaporte digital',
  'digital product passport',
  'dpp',
  'espr',
  'ecodiseño'
];

function makeSummary(text = '') {
  const words = text.split(/\s+/).slice(0, 30);
  return words.join(' ') + (words.length >= 30 ? '…' : '');
}

function tag(t) {
  const s = t.toLowerCase();
  if (/regulation|directive|commission|espr/.test(s)) return 'Regulación';
  if (/platform|blockchain|api|trace/.test(s))        return 'Tecnología';
  if (/pilot|prototype|trial/.test(s))                return 'Proyectos piloto';
  return 'Industria';
}

(async () => {
  const rssFeeds = feeds.filter(f => f.type === 'rss');

  for (const feedSource of rssFeeds) {
    try {
      const feed = await parser.parseURL(feedSource.url);
      for (const item of feed.items.slice(0, 10)) {
        const text = (item.title ?? '') + ' ' + (item.contentSnippet ?? '') + ' ' + (item.content ?? '');
        const matches = KEYWORDS.some(k => text.toLowerCase().includes(k));
        if (!matches) continue;

        // Traducimos el título al español
        let titleES;
        try {
          const { text } = await translate(item.title, { to: 'es' });
          titleES = text;
        } catch {
          titleES = item.title;
        }

        out.push({
          title    : item.title,
          titleES,
          link     : item.link,
          pubDate  : item.pubDate,
          source   : feed.title || feedSource.title,
          summary  : makeSummary(item.contentSnippet || item.content || ''),
          tag      : tag(item.title)
        });
      }
    } catch (err) {
      console.error('❌ Error en feed:', feedSource.url, err.message);
    }
  }

  out.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  fs.writeFileSync(
    path.resolve('./news.json'),
    JSON.stringify({ news: out }, null, 2)
  );

  console.log(`✅ Generado news.json con ${out.length} noticias relevantes (filtradas por DPP/ESPR)`);
})();
