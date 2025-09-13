import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// На сервере нам хватает anon (фон в паблик-бакете)
export const supabaseServer = createClient(url, anon);
