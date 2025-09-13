import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function GET(_: Request, { params }: { params: { orderId: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const orderId = params.orderId;
  const ex = await supabase.from('chats').select('*').eq('order_id', orderId).maybeSingle();
  if (ex.error) return NextResponse.json({ error: ex.error.message }, { status: 400 });
  if (ex.data) return NextResponse.json({ chat: ex.data });
  const { data, error } = await supabase.from('chats').insert({ order_id: orderId }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ chat: data });
}
