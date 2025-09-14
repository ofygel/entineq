import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body.rating !== 'number') {
    return NextResponse.json({ error: 'invalid' }, { status: 400 });
  }
  const payload = {
    event: 'feedback.sent',
    rating: body.rating,
    text: body.text || '',
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
      // ignore errors
    }
  }
  return NextResponse.json({ ok: true });
}
