import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Taxi & Delivery',
    short_name: 'TaxiApp',
    display: 'standalone',
    start_url: '/',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      { src: '/favicon.ico', sizes: '48x48 64x64', type: 'image/x-icon' }
    ]
  };
}
