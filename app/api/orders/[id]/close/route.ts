import { NextRequest, NextResponse } from 'next/server';

/** POST /api/orders/[id]/close — закрыть заказ (заглушка) */
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
  // TODO: в БД: статус -> COMPLETED/CANCELLED и т.д.
  return NextResponse.json({
    order: { id, status: 'CLOSED', closedAt: new Date().toISOString() },
  });
}

export const runtime = 'edge';
