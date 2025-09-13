'use client';
import { useEffect, useState } from 'react';
import { claimOrder, completeOrder, getExecutorFeed, getMyProfile } from '@/lib/db';
import Link from 'next/link';

type DbOrder = {
  id: number;
  type: 'TAXI'|'DELIVERY';
  from_addr: string;
  to_addr: string | null;
  price_estimate: number | null;
  status: string;
  created_at: string;
  claimed_by: string | null;
};

export default function ExecutorPage() {
  const [orders, setOrders] = useState<DbOrder[]>([]);
  const [me, setMe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const profile = await getMyProfile();
    setMe(profile);
    const feed = await getExecutorFeed();
    setOrders(feed as any);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  if (!me) {
    return (
      <div className="max-w-md mx-auto p-6 space-y-4">
        <div className="glass rounded-2xl p-6">
          <div className="text-white/80">Чтобы видеть фид заказов, войдите и укажите свой город в профиле.</div>
          <div className="mt-3 flex gap-2">
            <Link className="btn btn-primary" href="/auth">Войти</Link>
            <Link className="btn btn-ghost" href="/">На главную</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto w-full p-4 pb-24 space-y-4">
      <div className="text-white/80 text-sm">Город: <b>{me.city || '—'}</b></div>
      {loading && <div className="glass p-4 rounded-2xl">Загружаем...</div>}
      {!loading && orders.length===0 && <div className="glass p-4 rounded-2xl">Заказов пока нет</div>}
      {orders.map(o => (
        <div key={o.id} className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm text-white/70">{o.type==='TAXI'?'Такси':'Доставка'} · {new Date(o.created_at).toLocaleTimeString()}</div>
              <div className="font-semibold">{o.from_addr} → {o.to_addr || '—'}</div>
              <div className="text-white/80 text-sm">{o.price_estimate ? `${o.price_estimate.toLocaleString()}₸` : '—'}</div>
            </div>
            <div className="flex flex-col gap-2">
              {o.status==='NEW' ? (
                <button onClick={async ()=>{ await claimOrder(o.id); await load(); }} className="btn btn-primary rounded-xl">Взять</button>
              ) : (
                <button disabled className="btn btn-ghost opacity-60">Занят</button>
              )}
              {o.status==='CLAIMED' && (
                <button onClick={async ()=>{ await completeOrder(o.id); await load(); }} className="btn btn-ghost">Завершить</button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
