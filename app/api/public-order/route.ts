import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: 'invalid' }, { status: 400 });
  const id = crypto.randomUUID();
  const payload = {
    event: 'order.created',
    source: 'web',
    city: 'Almaty',
    ...body,
    client_id: body.client_id || crypto.randomUUID(),
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
    } catch {}
  }
  return NextResponse.json({ id, status: 'NEW', price: body.price, eta: body.etaMin });
}
