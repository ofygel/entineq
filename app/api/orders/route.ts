import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

// грубая серверная оценка цены (будет заменена тарифами)
function calcPrice(payload: any) {
  const t = payload?.type as 'TAXI'|'DELIVERY'|undefined;
  if (t === 'DELIVERY') {
    const size = (payload?.packageSize || 'S') as 'S'|'M'|'L';
    return size === 'S' ? 1200 : size === 'M' ? 1600 : 2200;
  }
  const km = Number(payload?.distanceKm || 5);
  return Math.max(800, Math.round(500 + km * 180));
}

export async function GET(_req: NextRequest) {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ orders: data ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = supabaseServer();
  const { data: { user }, error: uerr } = await supabase.auth.getUser();
  if (uerr || !user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json();
  const payload = {
    type: body?.type,
    city: body?.city ?? null,
    from_addr: body?.from_addr ?? body?.from ?? '',
    to_addr: body?.to_addr ?? body?.to ?? '',
    from_lat: body?.from_lat ?? null,
    from_lon: body?.from_lon ?? null,
    to_lat: body?.to_lat ?? null,
    to_lon: body?.to_lon ?? null,
    distance_km: body?.distance_km ?? body?.distanceKm ?? null,
    comment_text: body?.comment_text ?? body?.comment ?? null,
    price_estimate: body?.price_estimate ?? calcPrice(body),
    created_by: user.id,
  };

  const { data, error } = await supabase.from('orders').insert(payload).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ order: data });
}
