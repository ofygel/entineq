import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export const runtime = 'edge';

export async function GET() {
  try {
    // 1) пробуем вью active_background
    const v = await supabaseServer
      .from('active_background')
      .select('storage_path')
      .maybeSingle();

    let storagePath = v.data?.storage_path || null;

    // 2) если вью пустая — берём последний активный из backgrounds
    if (!storagePath) {
      const b = await supabaseServer
        .from('backgrounds')
        .select('storage_path')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      storagePath = b.data?.storage_path || null;
    }

    if (!storagePath) {
      return NextResponse.json({ url: null, fallback: '/bg.mp4' }, { status: 200 });
    }

    // Бакет public: формируем публичную ссылку
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const url = `${base}/storage/v1/object/public/backgrounds/${encodeURIComponent(storagePath)}`;

    return NextResponse.json({ url }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ url: null, fallback: '/bg.mp4' }, { status: 200 });
  }
}
