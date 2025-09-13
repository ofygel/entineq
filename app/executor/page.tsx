'use client';
import { useEffect, useMemo, useState } from 'react';
import { useData } from '@/lib/store';
import BottomNav from '@/components/BottomNav';
import { supabaseBrowser } from '@/lib/supabase-browser';
import Link from 'next/link';

export default function ExecutorPage() {
  const { orders, claimOrder, closeOrder, executors, meExecutorId, submitVerification, toggleSubscription, refreshFeed } = useData();
  const me = useMemo(()=>executors.find(e=>e.id===meExecutorId), [executors, meExecutorId]);
  const [tab, setTab] = useState<'feed'|'profile'|'verify'|'subscription'>('feed');

  useEffect(()=>{ refreshFeed(); }, [refreshFeed]);

  useEffect(()=> {
    const ch = supabaseBrowser
      .channel('orders:feed')
      .on('postgres_changes', { event:'INSERT', schema:'public', table:'orders' }, () => refreshFeed())
      .on('postgres_changes', { event:'UPDATE', schema:'public', table:'orders' }, () => refreshFeed())
      .subscribe();
    return ()=> { supabaseBrowser.removeChannel(ch); };
  }, [refreshFeed]);

  return (
    <div className="max-w-md mx-auto w-full p-4 pb-20 space-y-4">
      <div className="flex gap-2">
        {(['feed','profile','verify','subscription'] as const).map(t => (
          <button key={t} onClick={()=>setTab(t)} className={`btn ${t===tab? 'btn-primary text-black':'btn-ghost'} flex-1`}>
            {t==='feed'?'Заказы':t==='profile'?'Профиль':t==='verify'?'Верификация':'Подписка'}
          </button>
        ))}
      </div>

      {tab==='feed' && (
        <div className="space-y-3">
          {orders.length===0 && <div className="glass rounded-2xl p-5">Заказов пока нет</div>}
          {orders.map(o => (
            <div key={o.id} className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-white/70">{o.type==='TAXI'?'Такси':'Доставка'} · {new Date(o.createdAt).toLocaleTimeString()}</div>
                  <div className="font-semibold line-clamp-2">{o.from} → {o.to}</div>
                  <div className="text-white/80 text-sm">{o.priceEstimate.toLocaleString()}₸</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button disabled={o.status!=='NEW'} onClick={()=> claimOrder(o.id, meExecutorId!)} className={`btn rounded-xl ${o.status==='NEW'?'btn-secondary':'btn-ghost opacity-60'}`}>
                    {o.status==='NEW' ? 'Взять' : (o.status==='CLAIMED' && o.claimedBy===meExecutorId) ? 'Ваш заказ' : 'Занят'}
                  </button>
                  <Link href={`/chat/${o.id}`} className="text-xs text-white/70 underline text-center">Чат</Link>
                  {(o.status==='CLAIMED' && o.claimedBy===meExecutorId) && (
                    <button onClick={()=>closeOrder(o.id)} className="btn btn-ghost">Завершить</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==='profile' && me && (
        <div className="glass rounded-2xl p-5 space-y-2">
          <div className="text-white/80">Имя</div>
          <div className="text-lg font-semibold">{me.name}</div>
          <div className="flex items-center gap-2 text-sm"><span className={`h-2.5 w-2.5 rounded-full ${me.verified?'bg-green-400':'bg-yellow-400'}`} /> {me.verified? 'Верифицирован' : 'Ожидает/не верифицирован'}</div>
          <div className="flex items-center gap-2 text-sm"><span className={`h-2.5 w-2.5 rounded-full ${me.subscriptionActive?'bg-green-400':'bg-red-400'}`} /> {me.subscriptionActive? 'Подписка активна' : 'Подписка неактивна'}</div>
        </div>
      )}

      {tab==='verify' && me && (
        <div className="glass rounded-2xl p-5 space-y-3">
          <div className="text-white/85 font-semibold">Верификация</div>
          <p className="text-sm text-white/70">Загрузите фото документов (демо: создаём заглушки)</p>
          <button onClick={()=> submitVerification(me.id, ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAB'])} className="btn btn-secondary rounded-xl">Отправить на модерацию</button>
        </div>
      )}

      {tab==='subscription' && me && (
        <div className="glass rounded-2xl p-5 space-y-3">
          <div className="text-white/85 font-semibold">Подписка для исполнителя</div>
          <p className="text-sm text-white/70">Демо-переключатель имитирует оплату.</p>
          <button onClick={()=> toggleSubscription(me.id, !me.subscriptionActive)} className="btn btn-primary rounded-xl">
            {me.subscriptionActive ? 'Отключить подписку' : 'Оплатить и активировать'}
          </button>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
