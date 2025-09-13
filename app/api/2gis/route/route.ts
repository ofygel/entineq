import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { from, to, mode } = body;
  const key = process.env.DGIS_KEY;
  if (!key || !from || !to) return NextResponse.json({}, { status: 400 });
  const params = new URLSearchParams({
    key,
    points: `${from.lon},${from.lat};${to.lon},${to.lat}`,
    mode: mode || 'car',
  });
  const res = await fetch(`https://catalog.api.2gis.com/3.0/route?${params}`, { cache: 'no-store' });
  if (!res.ok) return NextResponse.json({}, { status: res.status });
  const j = await res.json();
  const route = j?.result?.routes?.[0];
  if (!route) return NextResponse.json({}, { status: 404 });
  const distance_km = route?.distance / 1000;
  const duration_min = route?.duration / 60;
  const polyline = route?.geometry?.points?.map((p: any) => [p.lat, p.lon]);
  return NextResponse.json({ distance_km, duration_min, polyline });
}
