import fs from 'fs';
import fetch from 'node-fetch';

const INPUT_PATH = './news.json';
const OUTPUT_PATH = './news-traducido.json';
const API_URL = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=';

// Lee el archivo original
const raw = JSON.parse(fs.readFileSync(INPUT_PATH, 'utf-8'));
const news = raw.news;

async function traducir(texto) {
  const res = await fetch(API_URL + encodeURIComponent(texto));
  const data = await res.json();
  return data[0][0][0];
}

const traducirTodo = async () => {
  for (const item of news) {
    if (!item.titleES || item.title === item.titleES) {
      item.titleES = await traducir(item.title);
      console.log('✔ Traducido:', item.titleES);
    }
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify({ news }, null, 2), 'utf-8');
  console.log(`✅ Archivo generado: ${OUTPUT_PATH}`);
};

traducirTodo();

