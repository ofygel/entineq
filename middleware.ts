import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * Простой pass-through middleware.
 * Без импорта node:crypto — совместимо с Edge Runtime.
 * CSP не выставляем в деве/стейдже, чтобы не ловить блокировку inline-скриптов Next.
 */
export function middleware(_req: NextRequest) {
  // Можно добавить заголовки/локаль/редиректы — сейчас просто пропускаем.
  return NextResponse.next();
}

/**
 * Матчер оставим дефолтным — middleware применится ко всем путям,
 * кроме статических ассетов/иконок. При желании сузить область — отредактируй.
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
