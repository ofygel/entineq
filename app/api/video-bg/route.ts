import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const supabase = createClient(url, anon);

  // читаем активный фон (storage_path), вьюха доступна всем (RLS allow select)
  const { data, error } = await supabase
    .from('active_background')
    .select('storage_path')
    .maybeSingle();

  // fallback на локальный файл
  const path = data?.storage_path?.trim() || 'bg.mp4';

  // если бакет public — можно собрать public URL прямо так:
  const publicUrl = `${url}/storage/v1/object/public/backgrounds/${encodeURIComponent(path)}`;

  if (error) {
    return NextResponse.json({ url: '/bg.mp4', hint: 'db_error' }, { status: 200 });
  }
  return NextResponse.json({ url: publicUrl }, { status: 200 });
}
