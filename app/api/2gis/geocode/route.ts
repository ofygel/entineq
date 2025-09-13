import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const key = process.env.DGIS_KEY;
  if (!key) return NextResponse.json({});
  let url = '';
  if (q) {
    const params = new URLSearchParams({ q, key });
    url = `https://catalog.api.2gis.com/3.0/geocode?${params}`;
  } else if (lat && lon) {
    const params = new URLSearchParams({ lat, lon, key });
    url = `https://catalog.api.2gis.com/3.0/geocode/reverse?${params}`;
  } else {
    return NextResponse.json({});
  }
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) return NextResponse.json({});
  const j = await res.json();
  const it = j?.result?.items?.[0];
  if (!it) return NextResponse.json({});
  return NextResponse.json({ name: it.name, full_name: it.full_name || it.address_name, point: it.point });
}
