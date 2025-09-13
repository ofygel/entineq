import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }

  const cookieStore = await cookies();
  let clientId = cookieStore.get('client_id')?.value;
  if (!clientId) {
    clientId = crypto.randomUUID();
    cookieStore.set('client_id', clientId, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from('orders')
    .insert({
      type: body.type,
      city: 'Almaty',
      from_addr: body.fromText,
      from_lat: body.from?.lat,
      from_lon: body.from?.lon,
      to_addr: body.toText,
      to_lat: body.to?.lat,
      to_lon: body.to?.lon,
      distance_km: body.distanceKm,
      comment_text: body.comment,
      price_estimate: body.price,
    })
    .select('id')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const payload = {
    event: 'order.created',
    source: 'web',
    city: 'Almaty',
    ...body,
    client_id: clientId,
    created_at: new Date().toISOString(),
  };
  const webhook = process.env.TELEGRAM_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      // ignore webhook errors
    }
  }

  return NextResponse.json({ id: data.id, status: 'NEW', price: body.price, eta: body.etaMin });
}
