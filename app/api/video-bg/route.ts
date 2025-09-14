import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

// Возвращает { url, path } активного видеофона
export async function GET() {
  try {
    const supabase = supabaseServer();

    const { data, error } = await supabase
      .from('active_background')
      .select('*')
      .limit(1)
      .single();

    if (!error && data?.storage_path) {
      // пробуем подписанный URL, иначе — public
      const signed = await supabase.storage
        .from('backgrounds')
        .createSignedUrl(data.storage_path, 3600);
      const url =
        signed.data?.signedUrl ??
        supabase.storage
          .from('backgrounds')
          .getPublicUrl(data.storage_path).data.publicUrl;

      return NextResponse.json({ url, path: data.storage_path });
    }
  } catch (e) {
    // ignore and use fallback below
    console.warn('video-bg fallback', e);
  }

  // Fallback: use bundled public video to avoid 500
  return NextResponse.json({ url: '/bg.mp4', path: 'bg.mp4' });
}
