import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function POST(req: NextRequest, ctx: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await ctx.params;
  const supabase = await supabaseServer();

  const { data: { user }, error: uerr } = await supabase.auth.getUser();
  if (uerr || !user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { body } = await req.json();

  const { data: chat, error: cErr } = await supabase.from('chats').select('*').eq('order_id', Number(orderId)).single();
  if (cErr) return NextResponse.json({ error: cErr.message }, { status: 400 });

  const { data, error } = await supabase
    .from('messages')
    .insert({ chat_id: chat.id, sender_id: user.id, body })
    .select('*')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ message: data });
}
