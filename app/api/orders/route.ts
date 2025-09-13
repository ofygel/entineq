import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

function calcPrice(payload: any) {
  const t = payload?.type;
  const dist = Number(payload?.distance_km ?? 0);
  if (t === 'DELIVERY') {
    const base = payload?.package_size === 'L' ? 2200 : payload?.package_size === 'M' ? 1600 : 1200;
    return Math.round(base + Math.max(0, dist - 3) * 80);
  }
  return Math.max(700, Math.round(700 + dist * 120));
}

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data:{ user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const body = await req.json();
  const price_estimate = calcPrice(body);
  const insert = {
    type: body.type, city: body.city ?? null,
    from_addr: body.from_addr ?? null, from_lat: body.from_lat ?? null, from_lon: body.from_lon ?? null,
    to_addr: body.to_addr ?? null, to_lat: body.to_lat ?? null, to_lon: body.to_lon ?? null,
    comment_text: body.comment_text ?? null, price_estimate, status: 'NEW', created_by: user.id
  };
  const { data, error } = await supabase.from('orders').insert(insert).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ order: data });
}

export async function GET(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city');
  let q = supabase.from('orders').select('*').eq('status','NEW').order('created_at',{ ascending:false }).limit(50);
  if (city) q = q.eq('city', city);
  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ orders: data });
}
