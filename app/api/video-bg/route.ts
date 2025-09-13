import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

// Возвращает { url, path } активного видеофона
export async function GET() {
  const supabase = supabaseServer();

  const { data, error } = await supabase.from('active_background').select('*').limit(1).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (!data?.storage_path) return NextResponse.json({ url: null });

  // пробуем подписанный URL, иначе — public
  const signed = await supabase.storage.from('backgrounds').createSignedUrl(data.storage_path, 3600);
  const url = signed.data?.signedUrl
    ?? supabase.storage.from('backgrounds').getPublicUrl(data.storage_path).data.publicUrl;

  return NextResponse.json({ url, path: data.storage_path });
}
