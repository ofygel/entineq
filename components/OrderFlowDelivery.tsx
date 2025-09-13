'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { createOrder, getMyProfile } from '@/lib/db';
import Link from 'next/link';

export default function OrderFlowDelivery() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [size, setSize] = useState<'S'|'M'|'L'>('S');
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<'idle'|'posting'|'ok'|'err'>('idle');
  const price = size === 'S' ? 1200 : size === 'M' ? 1600 : 2200;

  const submit = async () => {
    setStatus('posting');
    try {
      const me = await getMyProfile();
      const city = me?.city || 'Алматы';
      await createOrder({
        type: 'DELIVERY',
        city,
        from_addr: from,
        to_addr: to,
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
        <h2 className="text-xl font-semibold mb-3">Доставка</h2>
        <div className="space-y-3">
          <input value={from} onChange={e=>setFrom(e.target.value)} placeholder="Забрать (2ГИС/адрес)" className="w-full rounded-xl px-4 py-3 bg-white/10 border border-white/20 outline-none" />
          <input value={to} onChange={e=>setTo(e.target.value)} placeholder="Доставить (2ГИС/адрес)" className="w-full rounded-xl px-4 py-3 bg-white/10 border border-white/20 outline-none" />
          <div className="flex items-center gap-2">
            {(['S','M','L'] as const).map(s => (
              <button key={s} onClick={()=>setSize(s)} className={`btn ${size===s?'bg-white text-black':'btn-ghost'} flex-1`}>Посылка {s}</button>
            ))}
          </div>
          <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Комментарий" className="w-full rounded-xl px-4 py-3 bg-white/10 border border-white/20 outline-none resize-none h-20" />
          <div className="flex items-center justify-between">
            <div className="text-white/80">Предварительно: <b className="text-white">{price.toLocaleString()}₸</b></div>
            <button disabled={!from || !to || status==='posting'} onClick={submit} className="btn btn-primary rounded-2xl disabled:opacity-50">
              {status==='posting' ? 'Публикуем...' : 'Опубликовать'}
            </button>
          </div>
          <div className="text-sm text-white/70">
            Чтобы оформить, <Link href="/auth" className="underline">войдите</Link>, а в профиле укажите город.
          </div>
          {status==='ok' && <div className="text-green-400 text-sm">Заказ создан!</div>}
          {status==='err' && <div className="text-red-400 text-sm">Ошибка создания заказа</div>}
        </div>
      </div>
    </motion.div>
  );
}
