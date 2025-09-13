import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function POST(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const supabase = supabaseServer();
  const { data, error } = await supabase.rpc('claim_order', { p_order_id: Number(id) });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (!data || (Array.isArray(data) && data.length === 0)) {
    return NextResponse.json({ error: 'already_claimed' }, { status: 409 });
  }
  return NextResponse.json({ order: Array.isArray(data) ? data[0] : data });
}
