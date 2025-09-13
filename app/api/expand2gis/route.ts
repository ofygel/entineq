import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json() as { url?: string };
    if (!url || !/^https?:\/\/go\.2gis\.com\//i.test(url)) {
      return NextResponse.json({ error: 'Invalid go.2gis.com URL' }, { status: 400 });
    }
    const res = await fetch(url, { redirect: 'follow' });
    return NextResponse.json({ expanded: res.url });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
