import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json() as { url?: string };
    if (!url) return NextResponse.json({ error: 'url required' }, { status: 400 });

    // follow redirects сервером
    const res = await fetch(url, { redirect: 'follow' });
    const expanded = res.url || url;
    return NextResponse.json({ expanded });
  } catch (e:any) {
    return NextResponse.json({ error: e?.message || 'expand failed' }, { status: 500 });
  }
}
