import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/chat/[orderId]
 * typedRoutes (Next 15): params в контексте — Promise.
 * Здесь пока мок—ответ для успешной сборки (можно заменить на запрос к Supabase).
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  if (!orderId) {
    return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
  }
  // TODO: подтянуть чат из БД (таблицы chats/messages) по orderId
  return NextResponse.json({
    chat: {
      id: 'tmp-' + orderId,
      orderId,
      createdAt: new Date().toISOString(),
      messages: [],
    },
  });
}

/**
 * (опционально) POST /api/chat/[orderId]
 * Может создавать чат на заказ, если его ещё нет (когда подключим БД).
 */
export async function POST(_req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  if (!orderId) {
    return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
  }
  // TODO: insert в chats (если нет), вернуть chat id
  return NextResponse.json({
    chat: {
      id: 'tmp-' + orderId,
      orderId,
      createdAt: new Date().toISOString(),
    },
  });
}

// Совместимо с Edge Runtime (без node:crypto и т.п.)
export const runtime = 'edge';
