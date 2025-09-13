import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import VideoBg from '@/components/VideoBg';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: 'Taxi & Delivery — SPA',
  description: 'Женское такси и доставка. Исполнители и клиенты в одном SPA.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={`${inter.className} min-h-dvh relative overflow-x-hidden`}>
        <VideoBg />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.06),transparent_60%)]" />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
