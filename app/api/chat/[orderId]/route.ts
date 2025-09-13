import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET(_req: NextRequest, ctx: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await ctx.params;
  const supabase = await supabaseServer();

  let { data: chat, error } = await supabase.from('chats').select('*').eq('order_id', Number(orderId)).single();
  if (error && error.code !== 'PGRST116') { // not found handled below
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  if (!chat) {
    const ins = await supabase.from('chats').insert({ order_id: Number(orderId) }).select('*').single();
    if (ins.error) return NextResponse.json({ error: ins.error.message }, { status: 400 });
    chat = ins.data;
  }

  const msgs = await supabase.from('messages').select('*').eq('chat_id', chat.id).order('created_at', { ascending: true });
  if (msgs.error) return NextResponse.json({ error: msgs.error.message }, { status: 400 });

  return NextResponse.json({ chat, messages: msgs.data ?? [] });
}
