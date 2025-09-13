import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const u = new URL(req.url);
  const lat = Number(u.searchParams.get('lat') || '');
  const lon = Number(u.searchParams.get('lon') || '');
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return NextResponse.json({ error: 'lat/lon required' }, { status: 400 });
  const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`, {
    headers: { 'User-Agent': 'entineq-taxi-spa/1.0 (contact: dev@example.com)' }
  });
  if (!resp.ok) return NextResponse.json({ error: 'reverse geocode failed' }, { status: 502 });
  const json = await resp.json();
  return NextResponse.json({ label: json.display_name, raw: json });
}
