import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = Number(searchParams.get('lat'));
    const lon = Number(searchParams.get('lon'));
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return NextResponse.json({ error: 'invalid coords' }, { status: 400 });
    }
    const label = `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
    return NextResponse.json({ label });
  } catch (e:any) {
    return NextResponse.json({ error: e?.message || 'revgeo failed' }, { status: 500 });
  }
}
