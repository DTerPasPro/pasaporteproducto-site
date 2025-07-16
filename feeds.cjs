const feeds = [
  // ── Google News (mantiene volumen) ──
  {
    title: 'Google News DPP',
    type : 'rss',
    url  : 'https://news.google.com/rss/search?q=%22pasaporte+digital%22+OR+%22digital+product+passport%22+OR+DPP+OR+ESPR&hl=es&gl=ES&ceid=ES:es'
  },

  // ── RSS que sí funcionan ──
  { title: 'Textile Value Chain',   type: 'rss', url: 'https://textilevaluechain.in/feed/' },
  { title: 'AITEX',                 type: 'rss', url: 'https://www.aitex.es/feed/' },
  { title: 'Textile Exchange',      type: 'rss', url: 'https://textileexchange.org/feed/' },
  { title: 'GreenBiz Circularidad', type: 'rss', url: 'https://www.greenbiz.com/rss_topic/101/1524' },
  { title: 'Environmental Leader',  type: 'rss', url: 'https://www.environmentalleader.com/feed/' },

  // ── HTML scraping (funcionan) ──
  {
    title   : 'CIRPASS Project',
    type    : 'html',
    url     : 'https://cirpassproject.eu/news-events/',
    selector: 'article h2 a',
    urlBase : 'https://cirpassproject.eu'
  },
  {
    title   : 'EURATEX',
    type    : 'html',
    url     : 'https://euratex.eu/news/',
    selector: 'article h2 a',
    urlBase : 'https://euratex.eu'
  }
];

module.exports = { feeds };
