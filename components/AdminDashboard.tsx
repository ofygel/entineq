'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { uploadBackgroundAndActivate } from '@/lib/db';

type Verif = { id: number; executor_id: string; status: string; created_at: string; photos: string[]; };
type Ord = { id: number; type: 'TAXI'|'DELIVERY'; status: string; from_addr: string; to_addr: string|null; price_estimate: number|null; created_at: string; };

export default function AdminDashboard(){
  const [tab, setTab] = useState<'verif'|'orders'|'bg'>('bg');
  const [verifs, setVerifs] = useState<Verif[]>([]);
  const [orders, setOrders] = useState<Ord[]>([]);
  const [bgUrl, setBgUrl] = useState<string|null>(null);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const v = await supabase.from('verifications').select('*').order('created_at', { ascending: false });
    if (!v.error) setVerifs(v.data as any);
    const o = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(50);
    if (!o.error) setOrders(o.data as any);

    const bg = await supabase.from('active_background').select('storage_path').maybeSingle();
    if (!bg.error && bg.data?.storage_path) {
      const pub = supabase.storage.from('backgrounds').getPublicUrl(bg.data.storage_path).data.publicUrl;
      setBgUrl(pub);
    } else setBgUrl(null);
  };

  useEffect(()=>{ load(); }, []);

  const review = async (id: number, approve: boolean) => {
    await supabase.from('verifications').update({
      status: approve ? 'APPROVED' : 'REJECTED',
      reviewed_at: new Date().toISOString(),
    }).eq('id', id);
    await load();
  };

  const onUpload = async (f?: File|null) => {
    if (!f) return;
    setBusy(true);
    try {
      const url = await uploadBackgroundAndActivate(f);
      setBgUrl(url);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-md mx-auto w-full p-4 pb-20 space-y-4">
      <div className="flex gap-2">
        <button onClick={()=>setTab('bg')} className={`btn ${tab==='bg'?'bg-white text-black':'btn-ghost'} flex-1`}>Видео-фон</button>
        <button onClick={()=>setTab('verif')} className={`btn ${tab==='verif'?'bg-white text-black':'btn-ghost'} flex-1`}>Верификации</button>
        <button onClick={()=>setTab('orders')} className={`btn ${tab==='orders'?'bg-white text-black':'btn-ghost'} flex-1`}>Заказы</button>
      </div>

      {tab==='bg' && (
        <div className="glass rounded-2xl p-5 space-y-4">
          <div className="text-lg font-semibold">Фон сайта (Storage: backgrounds)</div>
          {bgUrl ? (
            <video src={bgUrl} className="w-full rounded-xl" controls />
          ) : (
            <div className="text-white/70 text-sm">Активный фон не задан</div>
          )}
          <label className="block">
            <span className="text-sm text-white/70">Загрузить .mp4 (H.264, AAC):</span>
            <input type="file" accept="video/mp4,video/webm" onChange={(e)=>onUpload(e.target.files?.[0])} className="mt-2 block w-full text-sm"/>
          </label>
          <button disabled={busy} onClick={()=>load()} className="btn btn-ghost">{busy?'':'Обновить'}</button>
        </div>
      )}

      {tab==='verif' && (
        <div className="space-y-3">
          {verifs.length===0 && <div className="glass rounded-2xl p-5">Нет заявок</div>}
          {verifs.map(v => (
            <div key={v.id} className="glass rounded-2xl p-5">
              <div className="text-sm text-white/70"># {v.id} · {new Date(v.created_at).toLocaleString()}</div>
              <div className="text-sm">Исполнитель: {v.executor_id}</div>
              <div className="text-sm">Статус: {v.status}</div>
              <div className="flex gap-2 mt-3">
                <button disabled={v.status!=='PENDING'} onClick={()=>review(v.id, true)} className="btn btn-primary">Принять</button>
                <button disabled={v.status!=='PENDING'} onClick={()=>review(v.id, false)} className="btn btn-ghost">Отклонить</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==='orders' && (
        <div className="space-y-3">
          {orders.length===0 && <div className="glass rounded-2xl p-5">Заказов нет</div>}
          {orders.map(o => (
            <div key={o.id} className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-white/70">{o.type} · {o.status}</div>
                  <div className="font-semibold">{o.from_addr} → {o.to_addr ?? '—'}</div>
                  <div className="text-white/80 text-sm">{o.price_estimate ?? '—'}₸</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
