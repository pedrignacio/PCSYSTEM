export default function manifest() {
  return {
    name: 'PCSystem - Servicio Técnico Hualpén',
    short_name: 'PCSystem',
    description: 'Servicio técnico de computadores, notebooks y consolas en Hualpén. Reparación, mantenimiento e instalación de redes.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/logo-header.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/logo-header.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['technology', 'business', 'shopping'],
    lang: 'es-CL',
    dir: 'ltr',
  }
}
