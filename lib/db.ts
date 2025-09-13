'use client';
import { supabase } from './supabase';

export type OrderType = 'TAXI' | 'DELIVERY';

export async function getSessionUser() {
  const { data } = await supabase.auth.getUser();
  return data.user || null;
}

export async function getMyProfile() {
  const user = await getSessionUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/** --------- Orders ---------- */
export async function createOrder(payload: {
  type: OrderType;
  city: string;
  from_addr: string;
  to_addr: string;
  distance_km?: number | null;
  comment_text?: string | null;
  price_estimate: number | null;
}) {
  const user = await getSessionUser();
  if (!user) throw new Error('Not authenticated');
  const { data, error } = await supabase
    .from('orders')
    .insert({
      ...payload,
      created_by: user.id,
      status: 'NEW',
    })
    .select('*')
    .single();
  if (error) throw error;
  return data;
}

export async function getExecutorFeed() {
  // благодаря RLS вернётся только NEW по городу пользователя
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('status', 'NEW')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function claimOrder(orderId: number) {
  const { data, error } = await supabase.rpc('claim_order', { p_order_id: orderId });
  if (error) throw error;
  return data;
}

export async function completeOrder(orderId: number) {
  const { error } = await supabase
    .from('orders')
    .update({ status: 'COMPLETED', completed_at: new Date().toISOString() })
    .eq('id', orderId);
  if (error) throw error;
}

/** --------- Background video ---------- */
export async function fetchActiveBackgroundPublicUrl() {
  // читаем активную запись
  const { data: active } = await supabase
    .from('active_background')
    .select('storage_path')
    .maybeSingle();

  if (!active?.storage_path) return null;

  // бакет публичный — берём public URL
  const { data } = supabase.storage.from('backgrounds').getPublicUrl(active.storage_path);
  return data.publicUrl || null;
}

export async function uploadBackgroundAndActivate(file: File) {
  // upload в backgrounds/<timestamp>_name
  const safeName = file.name.replace(/[^\w\.\-]/g, '_');
  const path = `${Date.now()}_${safeName}`;
  const up = await supabase.storage.from('backgrounds').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (up.error) throw up.error;

  // пометить активным
  const { data: inserted, error } = await supabase
    .from('backgrounds')
    .insert({ storage_path: path, is_active: true })
    .select('*')
    .single();
  if (error) throw error;

  // выключить остальные
  await supabase.from('backgrounds').update({ is_active: false }).neq('id', inserted.id);

  const { data } = supabase.storage.from('backgrounds').getPublicUrl(path);
  return data.publicUrl;
}
