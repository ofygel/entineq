import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/orders/[id]/claim
 * typedRoutes: params — Promise
 * Тут заглушка. В бою вызываем атомарный UPDATE в БД.
 */
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

  // TODO: заменить на реальный SQL/RPC в Supabase:
  // UPDATE orders SET status='CLAIMED', claimed_by=auth.uid(), claimed_at=now()
  // WHERE id=$1 AND status='NEW' AND claimed_by IS NULL RETURNING *
  return NextResponse.json({
    order: { id, status: 'CLAIMED', claimedAt: new Date().toISOString() },
  });
}

export const runtime = 'edge';
