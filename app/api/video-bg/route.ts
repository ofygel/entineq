import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('active_background')
      .select('storage_path')
      .limit(1)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ url: null, error: error.message }, { status: 200 });
    }

    const path = data?.storage_path;
    if (!path) return NextResponse.json({ url: null }, { status: 200 });

    // Паблик-линк к объекту в bucket 'backgrounds'
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const url = `${base}/storage/v1/object/public/backgrounds/${encodeURIComponent(path)}`;

    return NextResponse.json({ url }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ url: null, error: e?.message || 'unknown' }, { status: 200 });
  }
}
