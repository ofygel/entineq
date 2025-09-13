import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import VideoBg from '@/components/VideoBg';
import AuthProvider from '@/components/AuthProvider';

export const metadata: Metadata = {
  title: 'Taxi & Delivery — SPA',
  description: 'Женское такси и доставка. Исполнители и клиенты в одном SPA.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className={`${inter.className} min-h-dvh relative overflow-hidden`}>
        <VideoBg />
        <AuthProvider>
          <main className="relative z-10 min-h-dvh flex flex-col">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
