import rss from '@astrojs/rss';

export const get = () => rss({
  title: "Pasaporte Digital de Producto",
  description: "Noticias seleccionadas sobre el Pasaporte Digital de Producto",
  site: "https://pasaporteproducto.es",
  items: [] // Aquí deberías generar las noticias, por ahora puedes dejarlo vacío
});
