import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/orders/[id]/claim
 * typedRoutes (Next 15): params в контексте — Promise.
 * Пока возвращаем мок-ответ, чтобы билд проходил. Далее подключим атомарный UPDATE в Supabase.
 */
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  // TODO (боевой код): вызвать RPC/SQL в Supabase:
  // UPDATE orders SET status='CLAIMED', claimed_by=auth.uid(), claimed_at=now()
  // WHERE id=$1 AND status='NEW' AND claimed_by IS NULL RETURNING *
  // Сейчас — заглушка для зелёной сборки.
  return NextResponse.json({
    order: {
      id,
      status: 'CLAIMED',
      claimedAt: new Date().toISOString(),
    },
  });
}

// Совместимо с Edge Runtime (не тянем node-модули)
export const runtime = 'edge';
