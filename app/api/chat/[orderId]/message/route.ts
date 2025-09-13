import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/chat/[orderId]/message
 * Body: { text: string }
 * NOTE: из-за typedRoutes в Next 15 контекст params является Promise.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await params;
    const body = await req.json().catch(() => null) as { text?: string } | null;

    if (!orderId) {
      return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
    }
    if (!body?.text || typeof body.text !== 'string') {
      return NextResponse.json({ error: 'text is required' }, { status: 400 });
    }

    // TODO: здесь в следующей итерации добавим запись в Supabase (таблица messages)
    // Сейчас — просто возвращаем эхо-ответ, чтобы сборка прошла.
    return NextResponse.json({
      message: {
        id: 'tmp-' + Math.random().toString(36).slice(2),
        orderId,
        text: body.text,
        createdAt: new Date().toISOString(),
      }
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'unknown error' }, { status: 500 });
  }
}

// (необязательно) Явно укажем runtime Edge — совместимо с Next API routes в app/
export const runtime = 'edge';
