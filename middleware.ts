import { NextRequest, NextResponse } from 'next/server';

export function middleware(_req: NextRequest) {
  // Dev: никаких CSP-заголовков, чтобы не ломать Turbopack/HMR/RSC
  return NextResponse.next();
}

// Не нужен matcher: по умолчанию применяется ко всем роутам
