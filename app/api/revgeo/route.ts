import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get('lat') || '');
  const lon = Number(searchParams.get('lon') || '');
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return NextResponse.json({ error: 'lat/lon required' }, { status: 400 });
  }
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'entineq-taxi-spa/1.0 (contact: dev@example.com)' }
  });
  if (!res.ok) return NextResponse.json({ error: 'reverse geocode failed' }, { status: 502 });
  const json = await res.json();
  return NextResponse.json({ label: json.display_name, raw: json });
}
