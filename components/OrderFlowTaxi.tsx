'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { createOrder, getMyProfile } from '@/lib/db';
import Link from 'next/link';

export default function OrderFlowTaxi() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [distanceKm, setDistanceKm] = useState(5);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<'idle'|'posting'|'ok'|'err'>('idle');
  const price = Math.max(800, Math.round(500 + distanceKm * 180));

  const submit = async () => {
    setStatus('posting');
    try {
      const me = await getMyProfile();
      const city = me?.city || 'Алматы';
      await createOrder({
        type: 'TAXI',
        city,
        from_addr: from,
        to_addr: to,
        distance_km: distanceKm,
        comment_text: comment || null,
        price_estimate: price,
      });
      setStatus('ok'); setFrom(''); setTo(''); setComment('');
    } catch (e) {
      console.error(e); setStatus('err');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full mx-auto p-4 space-y-4">
      <div className="glass rounded-2xl p-4">
        <h2 className="text-xl font-semibold mb-3">Женское такси</h2>
        <div className="space-y-3">
          <input value={from} onChange={e=>setFrom(e.target.value)} placeholder="Откуда (2ГИС/адрес)" className="w-full rounded-xl px-4 py-3 bg-white/10 border border-white/20 outline-none" />
          <input value={to} onChange={e=>setTo(e.target.value)} placeholder="Куда (2ГИС/адрес)" className="w-full rounded-xl px-4 py-3 bg-white/10 border border-white/20 outline-none" />
          <div>
            <label className="text-sm text-white/70">Расстояние (км): {distanceKm}</label>
            <input type="range" min={1} max={30} value={distanceKm} onChange={e=>setDistanceKm(parseInt(e.target.value))} className="w-full" />
          </div>
          <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Комментарий" className="w-full rounded-xl px-4 py-3 bg-white/10 border border-white/20 outline-none resize-none h-20" />
          <div className="flex items-center justify-between">
            <div className="text-white/80">Предварительно: <b className="text-white">{price.toLocaleString()}₸</b></div>
            <button disabled={!from || !to || status==='posting'} onClick={submit} className="btn btn-primary rounded-2xl disabled:opacity-50">
              {status==='posting' ? 'Публикуем...' : 'Опубликовать'}
            </button>
          </div>
          <div className="text-sm text-white/70">
            Чтобы оформить, <Link href="/auth" className="underline">войдите</Link>, а в профиле укажите город — фид исполнителей фильтруется по нему.
          </div>
          {status==='ok' && <div className="text-green-400 text-sm">Заказ создан!</div>}
          {status==='err' && <div className="text-red-400 text-sm">Ошибка создания заказа</div>}
        </div>
      </div>
    </motion.div>
  );
}
