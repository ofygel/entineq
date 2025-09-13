import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  if (process.env.NODE_ENV === 'production') {
    const nonce = randomUUID();
    res.headers.set(
      'Content-Security-Policy',
      `default-src 'self'; script-src 'self' 'nonce-${nonce}' 'strict-dynamic'; connect-src 'self' https://*.supabase.co https://*.2gis.ru https://*.2gis.kz https://*.2gis.com; img-src 'self' data: blob:; style-src 'self';`
    );
    res.headers.set('x-nonce', nonce);
  }
  return res;
}

