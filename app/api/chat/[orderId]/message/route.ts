import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function POST(req: Request, { params }: { params: { orderId: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data:{ user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const { text } = await req.json() as { text?: string };
  if (!text) return NextResponse.json({ error: 'text required' }, { status: 400 });

  let { data:chat } = await supabase.from('chats').select('*').eq('order_id', params.orderId).maybeSingle();
  if (!chat) {
    const ins = await supabase.from('chats').insert({ order_id: params.orderId }).select().single();
    if (ins.error) return NextResponse.json({ error: ins.error.message }, { status: 400 });
    chat = ins.data;
  }
  const { data, error } = await supabase.from('messages').insert({ chat_id: chat.id, sender_id: user.id, body: text }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ message: data });
}
