import { NextRequest, NextResponse } from 'next/server';

/** GET /api/chat/[orderId] — получить чат по заказу (заглушка) */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  if (!orderId) return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
  return NextResponse.json({
    chat: { id: 'tmp-' + orderId, orderId, messages: [], createdAt: new Date().toISOString() },
  });
}

/** POST /api/chat/[orderId] — создать чат, если нужно (заглушка) */
export async function POST(_req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  if (!orderId) return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
  return NextResponse.json({
    chat: { id: 'tmp-' + orderId, orderId, createdAt: new Date().toISOString() },
  });
}

export const runtime = 'edge';
