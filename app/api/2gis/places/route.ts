import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const radius = searchParams.get('radius');
  const key = process.env.DGIS_KEY;
  if (!key || !q) return NextResponse.json([]);
  const params = new URLSearchParams({ q, key });
  if (lat) params.set('lat', lat);
  if (lon) params.set('lon', lon);
  if (radius) params.set('radius', radius);
  const res = await fetch(`https://catalog.api.2gis.com/3.0/suggests?${params}`, { cache: 'no-store' });
  if (!res.ok) return NextResponse.json([]);
  const j = await res.json();
  const items = (j?.result?.items || []).map((it: any) => ({
    name: it.name,
    full_name: it.full_name || it.subtitle || it.name,
    point: it.point,
  }));
  return NextResponse.json(items);
}
