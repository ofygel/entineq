import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data:{ user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('orders')
    .update({ status: 'CLAIMED', claimed_at: new Date().toISOString(), claimed_by: user.id })
    .eq('id', params.id)
    .eq('status','NEW')
    .is('claimed_by', null)
    .select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (!data) return NextResponse.json({ error: 'already_claimed' }, { status: 409 });
  return NextResponse.json({ order: data });
}
