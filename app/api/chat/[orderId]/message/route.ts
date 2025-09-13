import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/chat/[orderId]/message
 * Body: { text: string }
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  if (!orderId) return NextResponse.json({ error: 'orderId is required' }, { status: 400 });

  const body = (await req.json().catch(() => null)) as { text?: string } | null;
  if (!body?.text || typeof body.text !== 'string') {
    return NextResponse.json({ error: 'text is required' }, { status: 400 });
  }

  // TODO: insert в messages (Supabase) и realtime-ивент
  return NextResponse.json({
    message: { id: 'tmp-' + Math.random().toString(36).slice(2), orderId, text: body.text, createdAt: new Date().toISOString() },
  });
}

export const runtime = 'edge';
