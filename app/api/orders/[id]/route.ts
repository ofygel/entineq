import { NextRequest, NextResponse } from 'next/server';

/** GET /api/orders/[id] — заглушка для сборки (подключим БД позже) */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
  return NextResponse.json({
    order: { id, status: 'NEW', from: '—', to: '—', priceEstimate: 0, createdAt: new Date().toISOString() },
  });
}

/** PATCH /api/orders/[id] — заглушка обновления (например, комментарий/адрес) */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
  const body = await req.json().catch(() => ({}));
  return NextResponse.json({ ok: true, id, patch: body });
}

export const runtime = 'edge';
