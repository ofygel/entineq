import { NextRequest, NextResponse } from 'next/server';

/**
 * Безопасный резолвер коротких ссылок 2ГИС.
 * Принимает: POST { url: string }
 * Ограничения: только HTTPS и только whitelisted-хосты *.2gis.*
 * До 3 редиректов. Возвращает { finalUrl }.
 */

const ALLOWED_HOSTS = [
  'go.2gis.com',
  '2gis.ru', 'www.2gis.ru',
  '2gis.kz', 'www.2gis.kz',
  '2gis.com', 'www.2gis.com',
];

function isAllowed(u: URL) {
  if (u.protocol !== 'https:') return false;
  const host = u.hostname.toLowerCase();
  return ALLOWED_HOSTS.some((h) => h === host);
}

export async function POST(req: NextRequest) {
  try {
    const raw = (await req.json().catch(() => null)) as unknown;

    const url =
      raw && typeof raw === 'object' && 'url' in raw
        ? (raw as { url?: string }).url
        : undefined;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'url is required' }, { status: 400 });
    }

    let current = new URL(url);
    if (!isAllowed(current)) {
      return NextResponse.json({ error: 'host not allowed' }, { status: 400 });
    }

    // Идём максимум по 3 редиректам, только между разрешёнными хостами и по HTTPS.
    for (let i = 0; i < 3; i++) {
      const res = await fetch(current.toString(), { method: 'GET', redirect: 'manual' });
      const loc = res.headers.get('location');
      const isRedirect = res.status >= 300 && res.status <= 399 && !!loc;
      if (!isRedirect) break;

      const next = new URL(loc!, current);
      if (!isAllowed(next)) {
        return NextResponse.json({ error: 'redirect host not allowed' }, { status: 400 });
      }
      current = next;
    }

    return NextResponse.json({ finalUrl: current.toString() });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'bad request' }, { status: 400 });
  }
}

// Edge-runtime совместимо (без node-модулей)
export const runtime = 'edge';
