import { NextResponse } from 'next/server';

const ALLOWED_HOSTS = new Set(['go.2gis.com']); // разворачиваем только короткие 2ГИС
const MAX_REDIRECTS = 3;

export async function POST(req: Request) {
  try {
    const { url } = await req.json() as { url?: string };
    if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 });

    let u: URL;
    try { u = new URL(url); } catch { return NextResponse.json({ error: 'invalid url' }, { status: 400 }); }
    if (!ALLOWED_HOSTS.has(u.hostname)) {
      return NextResponse.json({ error: 'host not allowed' }, { status: 400 });
    }

    let current = url;
    for (let i = 0; i < MAX_REDIRECTS; i++) {
      const res = await fetch(current, { method: 'HEAD', redirect: 'manual' });
      // Если без редиректа — это и есть развёрнутый URL
      if (res.status < 300 || res.status > 399) {
        return NextResponse.json({ expanded: res.url || current });
      }
      const loc = res.headers.get('location');
      if (!loc) return NextResponse.json({ expanded: res.url || current });
      const nextUrl = new URL(loc, current).toString();
      const host = new URL(nextUrl).hostname;
      // Разрешаем редирект только внутри *.2gis.*
      if (!/(\.2gis\.(ru|kz)|^2gis\.(ru|kz)$)/i.test(host) && host !== 'go.2gis.com') {
        return NextResponse.json({ error: 'redirect host not allowed' }, { status: 400 });
      }
      current = nextUrl;
    }
    return NextResponse.json({ expanded: current });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'expand failed' }, { status: 500 });
  }
}
