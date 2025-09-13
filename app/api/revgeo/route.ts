import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { lat, lon } = await req.json().catch(() => ({}));
  if (typeof lat !== 'number' || typeof lon !== 'number') {
    return NextResponse.json({ error: 'lat/lon required' }, { status: 400 });
  }
  const label = `Координаты: ${lat.toFixed(5)}, ${lon.toFixed(5)}`;
  return NextResponse.json({ label });
}
