import { NextResponse } from 'next/server';

export function middleware() {
  // Простой pass-through + быстрый health
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest).*)']
};
