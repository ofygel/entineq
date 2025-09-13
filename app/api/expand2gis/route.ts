import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_HOSTS = [/\.2gis\.(kz|ru|com)$/i];

export async function POST(req: NextRequest) {
  const payload = await req.json().catch(() => ({}));
  const url = typeof payload?.url === 'string' ? payload.url : '';
  if (!url) return NextResponse.json({ error: 'url is required' }, { status: 400 });

  let current = new URL(url);
  let hops = 0;
  while (hops < 3) {
    const hostOk = ALLOWED_HOSTS.some((re) => re.test(current.hostname));
    if (!hostOk) return NextResponse.json({ error: 'forbidden host' }, { status: 400 });

    const head = await fetch(current.toString(), { method: 'HEAD', redirect: 'manual' });
    const loc = head.headers.get('location');
    if (!loc) break;
    const next = new URL(loc, current);
    current = next;
    hops++;
  }
  return NextResponse.json({ url: current.toString() });
}
